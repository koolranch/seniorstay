/**
 * Export featured AL/MC communities in top-traffic suburbs for advisor pricing review.
 * Does NOT write to the database — outputs CSV for manual confirmation of starting_price_monthly.
 *
 * Usage:
 *   npx tsx scripts/export-featured-pricing-review.ts
 *   npx tsx scripts/export-featured-pricing-review.ts --output uploads/pricing-review.csv
 */

import { createClient } from '@supabase/supabase-js';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { TOP_CLEVELAND_CITIES } from '../src/lib/top-cleveland-cities';
import { PRICING_RANGES } from '../src/lib/community-pricing';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const args = process.argv.slice(2);
const outputArg = args.find((_, i) => args[i - 1] === '--output');
const outputPath = outputArg || 'uploads/featured-pricing-review.csv';

function cityKey(city: string): string {
  return city.trim().toLowerCase();
}

function estimateLow(city: string, services: string | null): number | null {
  const key = cityKey(city);
  const ranges = PRICING_RANGES[key] || PRICING_RANGES.cleveland;
  const isMemory = services?.toLowerCase().includes('memory') ?? false;
  return isMemory ? ranges.memory_care[0] : ranges.assisted_living[0];
}

function isPlacementCommunity(services: string | null): boolean {
  if (!services) return true;
  const s = services.toLowerCase();
  if (s.includes('skilled nursing') && !s.includes('assisted') && !s.includes('memory')) {
    return false;
  }
  return s.includes('assisted') || s.includes('memory') || s.includes('independent');
}

async function main() {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const cities = TOP_CLEVELAND_CITIES.map((c) => c.name);

  const { data, error } = await supabase
    .from('Community')
    .select('id, name, city, services, starting_price_monthly, website')
    .in('city', cities)
    .order('city')
    .order('name');

  if (error) {
    console.error(error.message);
    process.exit(1);
  }

  const rows = (data || [])
    .filter((c) => isPlacementCommunity(c.services))
    .slice(0, 60);

  const header = [
    'id',
    'name',
    'city',
    'care_types',
    'current_starting_price_monthly',
    'suggested_review_low_estimate',
    'advisor_confirmed_price',
    'website',
  ].join(',');

  const lines = rows.map((c) => {
    const confirmed = c.starting_price_monthly ?? '';
    const suggested = estimateLow(c.city, c.services) ?? '';
    const care = (c.services || '').replace(/,/g, ';');
    const name = `"${c.name.replace(/"/g, '""')}"`;
    return [c.id, name, c.city, `"${care}"`, confirmed, suggested, '', c.website || ''].join(',');
  });

  const csv = [header, ...lines].join('\n');
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, csv);
  console.log(`Wrote ${rows.length} communities to ${outputPath}`);
  console.log('Fill advisor_confirmed_price column, then import via admin (do not use estimates as confirmed).');
}

main();
