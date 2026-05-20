/**
 * Fetch Google Places photos for AL/MC/IL communities missing real images.
 *
 * Requires:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   GOOGLE_PLACES_API_KEY
 *
 * Usage:
 *   npx tsx scripts/fetch-top-city-photos.ts
 *   npx tsx scripts/fetch-top-city-photos.ts --metro
 *   npx tsx scripts/fetch-top-city-photos.ts --metro --limit 250
 *   npx tsx scripts/fetch-top-city-photos.ts --dry-run --metro
 *   npx tsx scripts/fetch-top-city-photos.ts --city Westlake --limit 5
 */

import { createClient } from '@supabase/supabase-js';
import { TOP_CLEVELAND_CITIES } from '../src/lib/top-cleveland-cities';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const googleApiKey = process.env.GOOGLE_PLACES_API_KEY || '';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const metroMode = args.includes('--metro');
const cityArg = args.find((_, i) => args[i - 1] === '--city');
const limitArg = args.find((_, i) => args[i - 1] === '--limit');
const limit = limitArg ? parseInt(limitArg, 10) : metroMode ? 500 : 20;

const PLACEHOLDER_PATTERNS = ['placeholder', 'no-image', 'default-community', 'generic', 'missing'];

function needsPhoto(imageUrl: string | null): boolean {
  const image = imageUrl?.toLowerCase() || '';
  return (
    !imageUrl ||
    PLACEHOLDER_PATTERNS.some((p) => image.includes(p)) ||
    image.startsWith('data:image/svg') ||
    image.startsWith('/community-images/')
  );
}

function cleanPlaceName(name: string): string {
  return name
    .replace(/, [A-Za-z ]+, OH - .+$/i, '')
    .replace(/, [A-Za-z ]+, OH$/i, '')
    .trim();
}

function isPlacementCareType(services: string | null, name: string): boolean {
  const joined = (services || '').toLowerCase();
  const nameLower = name.toLowerCase();

  if (joined) {
    if (
      joined.includes('skilled nursing') &&
      !joined.includes('assisted') &&
      !joined.includes('memory') &&
      !joined.includes('independent')
    ) {
      return false;
    }
    if (
      joined.includes('assisted') ||
      joined.includes('memory') ||
      joined.includes('independent')
    ) {
      return true;
    }
  }

  return (
    nameLower.includes('assisted living') ||
    nameLower.includes('memory care') ||
    nameLower.includes('independent living') ||
    nameLower.includes('senior living') ||
    nameLower.includes('retirement')
  );
}

async function findPlacePhoto(query: string): Promise<string | null> {
  if (!googleApiKey) return null;

  const searchUrl =
    `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?` +
    `input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id,photos&key=${googleApiKey}`;

  const searchResponse = await fetch(searchUrl);
  const searchData = await searchResponse.json();

  if (searchData.status !== 'OK' || !searchData.candidates?.length) {
    return null;
  }

  const place = searchData.candidates[0];
  if (!place.photos?.length) return null;

  const photo = place.photos[0];
  return (
    `https://maps.googleapis.com/maps/api/place/photo?` +
    `maxwidth=1200&photoreference=${photo.photo_reference}&key=${googleApiKey}`
  );
}

async function fetchPrimaryPhoto(
  name: string,
  city: string,
  state: string,
  address: string | null
): Promise<string | null> {
  const cleanName = cleanPlaceName(name);
  const cityState = `${city}, ${state}`;

  const attempts = [
    address ? `${cleanName} ${address}, ${cityState}` : null,
    `${cleanName} ${cityState}`,
    cleanName,
  ].filter(Boolean) as string[];

  for (const query of attempts) {
    const photo = await findPlacePhoto(query);
    if (photo) return photo;
    await new Promise((r) => setTimeout(r, 100));
  }

  return null;
}

async function main() {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  if (!googleApiKey && !dryRun) {
    console.error('Missing GOOGLE_PLACES_API_KEY (use --dry-run to preview targets)');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  let query = supabase
    .from('Community')
    .select('id, name, address, city, state, image_url, services, region_slug')
    .order('city')
    .order('name');

  if (metroMode) {
    query = query.eq('region_slug', 'cleveland');
  }

  const { data: communities, error } = await query;

  if (error) {
    console.error('Failed to fetch communities:', error.message);
    process.exit(1);
  }

  let targets = (communities || [])
    .filter((c) => isPlacementCareType(c.services, c.name))
    .filter((c) => needsPhoto(c.image_url));

  if (!metroMode && !cityArg) {
    const targetCitiesLower = new Set(TOP_CLEVELAND_CITIES.map((c) => c.name.toLowerCase()));
    targets = targets.filter((c) => targetCitiesLower.has(c.city.toLowerCase()));
  } else if (cityArg) {
    targets = targets.filter((c) => c.city.toLowerCase() === cityArg.toLowerCase());
  }

  targets = targets.slice(0, limit);

  const modeLabel = metroMode ? 'Cleveland metro AL/MC/IL' : cityArg ? cityArg : 'top suburbs';
  console.log(`📸 Google Places photo fetch — ${modeLabel} (limit ${limit})`);
  console.log(`Found ${targets.length} communities needing photos${dryRun ? ' (dry run)' : ''}`);

  let updated = 0;
  let failed = 0;
  let noPhoto = 0;

  for (const community of targets) {
    console.log(`  → ${community.name} (${community.city})`);

    if (dryRun) continue;

    try {
      const photoUrl = await fetchPrimaryPhoto(
        community.name,
        community.city,
        community.state,
        community.address
      );

      if (!photoUrl) {
        console.log('    ✗ No photo found');
        noPhoto++;
        continue;
      }

      const { error: updateError } = await supabase
        .from('Community')
        .update({
          image_url: photoUrl,
          photos_source: 'google_places',
          photos_last_updated: new Date().toISOString(),
        })
        .eq('id', community.id);

      if (updateError) {
        console.log(`    ✗ Update failed: ${updateError.message}`);
        failed++;
      } else {
        console.log('    ✓ Updated');
        updated++;
      }

      await new Promise((r) => setTimeout(r, 200));
    } catch (err) {
      console.log(`    ✗ Error: ${err}`);
      failed++;
    }
  }

  console.log(
    `\nDone. Updated: ${updated}, No photo: ${noPhoto}, Errors: ${failed}${dryRun ? ' (dry run)' : ''}`
  );
}

main();
