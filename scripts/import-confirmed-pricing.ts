/**
 * Import advisor-confirmed starting_price_monthly from CSV.
 *
 * CSV must include columns: id, advisor_confirmed_price
 * (export from scripts/export-featured-pricing-review.ts after advisor fills prices)
 *
 * Usage:
 *   npx tsx scripts/import-confirmed-pricing.ts uploads/featured-pricing-review.csv
 *   npx tsx scripts/import-confirmed-pricing.ts uploads/featured-pricing-review.csv --dry-run
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const dryRun = process.argv.includes('--dry-run');
const csvPath = process.argv.find((a) => a.endsWith('.csv'));

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

async function main() {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  if (!csvPath) {
    console.error('Usage: npx tsx scripts/import-confirmed-pricing.ts <path.csv> [--dry-run]');
    process.exit(1);
  }

  const content = readFileSync(csvPath, 'utf-8');
  const lines = content.trim().split('\n');
  const headers = parseCsvLine(lines[0]);
  const idIdx = headers.indexOf('id');
  const priceIdx = headers.indexOf('advisor_confirmed_price');

  if (idIdx === -1 || priceIdx === -1) {
    console.error('CSV must include id and advisor_confirmed_price columns');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  let updated = 0;
  let skipped = 0;

  for (const line of lines.slice(1)) {
    if (!line.trim()) continue;
    const cols = parseCsvLine(line);
    const id = cols[idIdx]?.trim();
    const priceRaw = cols[priceIdx]?.trim();

    if (!id || !priceRaw) {
      skipped++;
      continue;
    }

    const price = parseInt(priceRaw.replace(/[^0-9]/g, ''), 10);
    if (!price || price < 1000) {
      console.log(`  skip ${id}: invalid price "${priceRaw}"`);
      skipped++;
      continue;
    }

    console.log(`  ${dryRun ? '[dry-run] ' : ''}${id} → $${price}/mo`);

    if (!dryRun) {
      const { error } = await supabase
        .from('Community')
        .update({ starting_price_monthly: price })
        .eq('id', id);

      if (error) {
        console.error(`    ✗ ${error.message}`);
        continue;
      }
    }
    updated++;
  }

  console.log(`\nDone. Updated: ${updated}, Skipped: ${skipped}${dryRun ? ' (dry run)' : ''}`);
}

main();
