/**
 * Gather facts for AL/MC/IL communities missing descriptions, so unique
 * descriptions can be written and applied. Outputs JSON of per-community
 * facts from Supabase + Google Places (editorial summary, rating, types).
 *
 * Requires (.env.local / .env.production.local):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   GOOGLE_PLACES_API_KEY
 *
 * Usage:
 *   npx tsx scripts/gather-description-facts.ts
 *   npx tsx scripts/gather-description-facts.ts --limit 5
 */

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Production env first: its GOOGLE_PLACES_API_KEY is a server key, while
// .env.local holds a referer-restricted browser key that Places rejects.
dotenv.config({ path: '.env.production.local' });
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const googleApiKey = process.env.GOOGLE_PLACES_API_KEY || '';

const args = process.argv.slice(2);
const limitArg = args.find((_, i) => args[i - 1] === '--limit');
const limit = limitArg ? parseInt(limitArg, 10) : 100;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
if (!googleApiKey) {
  console.error('Missing GOOGLE_PLACES_API_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface TargetCommunity {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string | null;
  zip: string | null;
  website: string | null;
  services: string | null;
  type: string | null;
  amenity_tags: string[] | null;
  rating: number | null;
}

interface PlaceFacts {
  editorialSummary: string | null;
  googleRating: number | null;
  googleRatingCount: number | null;
  googleTypes: string[];
  formattedAddress: string | null;
}

async function fetchPlaceFacts(query: string): Promise<PlaceFacts | null> {
  const searchUrl =
    `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?` +
    `input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id&key=${googleApiKey}`;
  const searchRes = await fetch(searchUrl);
  const searchData = await searchRes.json();

  if (searchData.status !== 'OK' || !searchData.candidates?.length) {
    return null;
  }

  const placeId = searchData.candidates[0].place_id;
  const detailsUrl =
    `https://maps.googleapis.com/maps/api/place/details/json?` +
    `place_id=${placeId}&fields=editorial_summary,rating,user_ratings_total,types,formatted_address&key=${googleApiKey}`;
  const detailsRes = await fetch(detailsUrl);
  const detailsData = await detailsRes.json();

  if (detailsData.status !== 'OK') {
    return null;
  }

  const result = detailsData.result || {};
  return {
    editorialSummary: result.editorial_summary?.overview || null,
    googleRating: result.rating ?? null,
    googleRatingCount: result.user_ratings_total ?? null,
    googleTypes: result.types || [],
    formattedAddress: result.formatted_address || null,
  };
}

function cleanPlaceName(name: string): string {
  return name
    .replace(/, [A-Za-z ]+, OH - .+$/i, '')
    .replace(/, [A-Za-z ]+, OH$/i, '')
    .trim();
}

async function main() {
  const { data, error } = await supabase
    .from('Community')
    .select('id, name, city, state, address, zip, website, services, type, amenity_tags, rating')
    .eq('region_slug', 'cleveland')
    .neq('facility_type', 'skilled-nursing')
    .limit(500);

  if (error) {
    console.error('Supabase query failed:', error.message);
    process.exit(1);
  }

  // facility_type IS NULL rows are excluded by neq() above, so fetch them too
  const { data: nullTypeData, error: nullTypeError } = await supabase
    .from('Community')
    .select('id, name, city, state, address, zip, website, services, type, amenity_tags, rating')
    .eq('region_slug', 'cleveland')
    .is('facility_type', null)
    .limit(500);

  if (nullTypeError) {
    console.error('Supabase null-type query failed:', nullTypeError.message);
    process.exit(1);
  }

  const seen = new Set<string>();
  const all = [...(data || []), ...(nullTypeData || [])].filter((row) => {
    if (seen.has(row.id)) return false;
    seen.add(row.id);
    return true;
  }) as TargetCommunity[];

  // Only rows still missing a usable description
  const { data: descRows } = await supabase
    .from('Community')
    .select('id, description')
    .in('id', all.map((c) => c.id));

  const missingDesc = new Set(
    (descRows || [])
      .filter((r) => !r.description || r.description.trim().length <= 50)
      .map((r) => r.id)
  );

  const targets = all.filter((c) => missingDesc.has(c.id)).slice(0, limit);
  console.log(`Gathering facts for ${targets.length} communities...`);

  const results: Array<TargetCommunity & { placeFacts: PlaceFacts | null }> = [];

  for (const community of targets) {
    const cleanName = cleanPlaceName(community.name);
    const query = `${cleanName} ${community.city} OH`;
    process.stdout.write(`→ ${cleanName} (${community.city})... `);
    try {
      const placeFacts = await fetchPlaceFacts(query);
      results.push({ ...community, placeFacts });
      console.log(placeFacts?.editorialSummary ? 'summary ✓' : placeFacts ? 'details (no summary)' : 'not found');
    } catch (err) {
      results.push({ ...community, placeFacts: null });
      console.log(`error: ${err instanceof Error ? err.message : err}`);
    }
    await new Promise((r) => setTimeout(r, 150));
  }

  const outPath = path.join('scripts', 'output', 'description-facts.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`\nWrote ${results.length} records to ${outPath}`);
}

main();
