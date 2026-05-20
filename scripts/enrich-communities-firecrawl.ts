/**
 * Batch-enrich Community records with photos and amenity tags via Firecrawl.
 *
 * Requires:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   FIRECRAWL_API_KEY
 *
 * Usage:
 *   npx tsx scripts/enrich-communities-firecrawl.ts
 *   npx tsx scripts/enrich-communities-firecrawl.ts --city Westlake --limit 5
 *   npx tsx scripts/enrich-communities-firecrawl.ts --photos-only --city Westlake --limit 10
 */

import { createClient } from '@supabase/supabase-js';
import { TOP_CLEVELAND_CITIES } from '../src/lib/top-cleveland-cities';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const firecrawlApiKey = process.env.FIRECRAWL_API_KEY || '';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const photosOnly = args.includes('--photos-only');
const cityArg = args.find((_, i) => args[i - 1] === '--city');
const citiesArg = args.find((_, i) => args[i - 1] === '--cities');
const limitArg = args.find((_, i) => args[i - 1] === '--limit');
const limit = limitArg ? parseInt(limitArg, 10) : 25;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

if (!firecrawlApiKey && !dryRun) {
  console.error('Missing FIRECRAWL_API_KEY (use --dry-run to preview targets only)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface DbCommunity {
  id: string;
  name: string;
  city: string;
  state: string;
  website: string | null;
  image_url: string | null;
  image_urls: string[] | null;
  amenity_tags: string[] | null;
}

const PLACEHOLDER_PATTERNS = ['placeholder', 'no-image', 'default-community', 'generic', 'missing'];

function needsPhoto(row: DbCommunity): boolean {
  const image = row.image_url?.toLowerCase() || '';
  return (
    !row.image_url ||
    PLACEHOLDER_PATTERNS.some((p) => image.includes(p)) ||
    image.startsWith('data:image/svg')
  );
}

function needsEnrichment(row: DbCommunity): boolean {
  const missingPhoto = needsPhoto(row);
  const missingAmenities = !row.amenity_tags?.length;
  if (photosOnly) {
    return Boolean(row.website) && missingPhoto;
  }
  return Boolean(row.website) && (missingPhoto || missingAmenities);
}

const AMENITY_KEYWORDS: Record<string, string> = {
  dining: 'Restaurant-Style Dining',
  memory: 'Memory Care Program',
  fitness: 'Fitness Center',
  pool: 'Swimming Pool',
  transportation: 'Transportation Services',
  housekeeping: 'Housekeeping Services',
  '24 hour': '24-Hour Staff',
  '24-hour': '24-Hour Staff',
  nurse: 'Licensed Nurse On-Site',
  salon: 'Beauty Salon',
  chapel: 'Chapel',
  garden: 'Community Garden',
  activities: 'Social Activities',
};

function extractAmenityTags(markdown: string): string[] {
  const lower = markdown.toLowerCase();
  const found = new Set<string>();
  for (const [keyword, label] of Object.entries(AMENITY_KEYWORDS)) {
    if (lower.includes(keyword)) found.add(label);
  }
  return Array.from(found).slice(0, 12);
}

function filterImageUrls(urls: string[]): string[] {
  return Array.from(
    new Set(
      urls.filter((url) => {
        const lower = url.toLowerCase();
        if (!lower.startsWith('http')) return false;
        if (lower.includes('logo') || lower.includes('icon') || lower.includes('sprite')) return false;
        return true;
      })
    )
  ).slice(0, 10);
}

async function scrapeWithFirecrawl(url: string): Promise<{ images: string[]; amenityTags: string[] }> {
  const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${firecrawlApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url,
      formats: ['markdown', 'links'],
      onlyMainContent: true,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Firecrawl ${response.status}: ${text.slice(0, 200)}`);
  }

  const json = await response.json();
  const metadata = json.data?.metadata || {};
  const markdown: string = json.data?.markdown || '';
  const links: string[] = json.data?.links || [];

  const ogImage =
    metadata.ogImage ||
    metadata['og:image'] ||
    metadata.image ||
    metadata.twitterImage;

  const imageLinks = links.filter((l) => /\.(jpg|jpeg|png|webp)(\?|$)/i.test(l));
  const amenityTags = extractAmenityTags(markdown);

  const images = filterImageUrls([
    ...(typeof ogImage === 'string' ? [ogImage] : []),
    ...imageLinks,
  ]);

  return { images, amenityTags };
}

async function main() {
  const cityNames = citiesArg
    ? citiesArg.split(',').map((c) => c.trim())
    : cityArg
      ? [cityArg]
      : photosOnly
        ? TOP_CLEVELAND_CITIES.map((c) => c.name)
        : [];

  if (cityNames.length === 0) {
    await runForQuery(null);
    return;
  }

  for (const city of cityNames) {
    console.log(`\n========== ${city} ==========`);
    await runForQuery(city);
  }

  console.log('\nAll cities done.');
}

async function runForQuery(city: string | null) {
  let query = supabase
    .from('Community')
    .select('id, name, city, state, website, image_url, image_urls, amenity_tags')
    .not('website', 'is', null)
    .neq('website', '')
    .order('name')
    .limit(limit);

  if (city) {
    query = query.ilike('city', city);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Supabase query failed:', error.message);
    process.exit(1);
  }

  const targets = (data as DbCommunity[]).filter(needsEnrichment);
  const mode = photosOnly ? 'photos' : 'photos+amenities';
  console.log(`Found ${targets.length} communities (${mode})${city ? ` in ${city}` : ''}${dryRun ? ' (dry run)' : ''}`);

  for (const community of targets) {
    console.log(`\n→ ${community.name} (${community.city})`);
    console.log(`  Website: ${community.website}`);

    if (dryRun) continue;

    try {
      const { images, amenityTags } = await scrapeWithFirecrawl(community.website!);
      const updates: Record<string, unknown> = {};

      if (
        images.length &&
        needsPhoto(community)
      ) {
        updates.image_url = images[0];
        updates.image_urls = images;
      }

      if (!photosOnly && amenityTags.length && !community.amenity_tags?.length) {
        updates.amenity_tags = amenityTags;
      }

      if (!Object.keys(updates).length) {
        console.log('  No new data extracted');
        continue;
      }

      const { error: updateError } = await supabase
        .from('Community')
        .update(updates)
        .eq('id', community.id);

      if (updateError) {
        console.error('  Update failed:', updateError.message);
      } else {
        console.log(`  Updated: ${Object.keys(updates).join(', ')}`);
      }
    } catch (err) {
      console.error('  Scrape failed:', err instanceof Error ? err.message : err);
    }

    await new Promise((r) => setTimeout(r, 1500));
  }

  console.log('\nDone.');
}

async function mainWrapper() {
  await main();
}

mainWrapper();
