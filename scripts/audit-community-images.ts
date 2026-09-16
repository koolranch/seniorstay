/**
 * Audit every Community image_url / image_urls entry and optionally
 * strip dead URLs so the site never renders a broken photo.
 *
 *   npx tsx scripts/audit-community-images.ts
 *   npx tsx scripts/audit-community-images.ts --fix
 */

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.production.local' });
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const googleApiKey = process.env.GOOGLE_PLACES_API_KEY || '';
const fix = process.argv.includes('--fix');

type CommunityRow = {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string | null;
  services: string | null;
  region_slug: string | null;
  image_url: string | null;
  image_urls: string[] | null;
};

type CheckResult = {
  url: string;
  ok: boolean;
  reason: string;
  status?: number;
  contentType?: string;
};

const PLACEHOLDER_PATTERNS = ['placeholder', 'no-image', 'default-community', 'generic', 'missing'];

function isPlaceholderUrl(url: string): boolean {
  const lower = url.toLowerCase();
  return (
    lower.startsWith('data:image') ||
    lower.startsWith('/community-images/') ||
    PLACEHOLDER_PATTERNS.some((p) => lower.includes(p))
  );
}

function isPlacesApiUrl(url: string): boolean {
  return url.includes('maps.googleapis.com/maps/api/place/photo');
}

function collectUrls(row: CommunityRow): string[] {
  const urls: string[] = [];
  if (row.image_url?.trim()) urls.push(row.image_url.trim());
  for (const extra of row.image_urls || []) {
    if (extra?.trim()) urls.push(extra.trim());
  }
  return [...new Set(urls)];
}

async function checkUrl(url: string): Promise<CheckResult> {
  if (isPlacesApiUrl(url)) {
    return { url, ok: false, reason: 'places-api-expired' };
  }
  if (isPlaceholderUrl(url)) {
    return { url, ok: false, reason: 'placeholder' };
  }
  if (url.startsWith('/')) {
    return { url, ok: false, reason: 'local-path-missing' };
  }
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return { url, ok: false, reason: 'invalid-scheme' };
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        Accept: 'image/avif,image/webp,image/*,*/*;q=0.8',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
    });
    clearTimeout(timer);

    const contentType = response.headers.get('content-type') || '';
    if (!response.ok) {
      return { url, ok: false, reason: `http-${response.status}`, status: response.status, contentType };
    }
    if (contentType && !contentType.startsWith('image/') && !contentType.includes('octet-stream')) {
      return { url, ok: false, reason: `not-image:${contentType.split(';')[0]}`, status: response.status, contentType };
    }
    return { url, ok: true, reason: 'ok', status: response.status, contentType };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { url, ok: false, reason: message.includes('abort') ? 'timeout' : `fetch-error:${message}` };
  }
}

async function worksViaSiteOptimizer(url: string): Promise<boolean> {
  if (!url.startsWith('https://')) return false;
  const optimizer = `https://www.guideforseniors.com/_next/image?url=${encodeURIComponent(url)}&w=640&q=75`;
  try {
    const response = await fetch(optimizer, { method: 'GET', redirect: 'follow' });
    const contentType = response.headers.get('content-type') || '';
    return response.ok && contentType.startsWith('image/');
  } catch {
    return false;
  }
}

function isPlacementCareType(services: string | null, name: string): boolean {
  const joined = (services || '').toLowerCase();
  const nameLower = name.toLowerCase();
  if (joined.includes('skilled nursing') && !joined.includes('assisted') && !joined.includes('memory') && !joined.includes('independent')) {
    return false;
  }
  if (joined.includes('assisted') || joined.includes('memory') || joined.includes('independent')) {
    return true;
  }
  return (
    nameLower.includes('assisted living') ||
    nameLower.includes('memory care') ||
    nameLower.includes('independent living') ||
    nameLower.includes('senior living') ||
    nameLower.includes('retirement')
  );
}

function cleanPlaceName(name: string): string {
  return name
    .replace(/, [A-Za-z ]+, OH - .+$/i, '')
    .replace(/, [A-Za-z ]+, OH$/i, '')
    .trim();
}

async function findStablePlacePhoto(query: string): Promise<string | null> {
  if (!googleApiKey) return null;
  const searchUrl =
    `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?` +
    `input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id,photos&key=${googleApiKey}`;
  const searchResponse = await fetch(searchUrl);
  const searchData = await searchResponse.json();
  if (searchData.status !== 'OK' || !searchData.candidates?.length) return null;
  const photo = searchData.candidates[0]?.photos?.[0];
  if (!photo) return null;
  const photoApiUrl =
    `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photoreference=${photo.photo_reference}&key=${googleApiKey}`;
  const photoResponse = await fetch(photoApiUrl, { redirect: 'follow' });
  if (!photoResponse.ok) return null;
  if (photoResponse.url.includes('maps.googleapis.com')) return null;
  const live = await checkUrl(photoResponse.url);
  return live.ok ? photoResponse.url : null;
}

async function refreshPhoto(row: CommunityRow): Promise<string | null> {
  const cleanName = cleanPlaceName(row.name);
  const cityState = `${row.city}, ${row.state}`;
  const attempts = [
    row.address ? `${cleanName} ${row.address}, ${cityState}` : null,
    `${cleanName} ${cityState}`,
    cleanName,
  ].filter(Boolean) as string[];

  for (const query of attempts) {
    const photo = await findStablePlacePhoto(query);
    if (photo) return photo;
    await new Promise((r) => setTimeout(r, 120));
  }
  return null;
}

async function main() {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { data, error } = await supabase
    .from('Community')
    .select('id, name, city, state, address, services, region_slug, image_url, image_urls')
    .order('name');

  if (error || !data) {
    console.error('Failed to fetch communities:', error?.message);
    process.exit(1);
  }

  const communities = data as CommunityRow[];
  const uniqueUrls = [...new Set(communities.flatMap(collectUrls))];
  console.log(`Auditing ${uniqueUrls.length} unique URLs across ${communities.length} communities`);

  const checks = new Map<string, CheckResult>();
  const concurrency = 8;
  for (let i = 0; i < uniqueUrls.length; i += concurrency) {
    const batch = uniqueUrls.slice(i, i + concurrency);
    const results = await Promise.all(batch.map(checkUrl));
    for (const result of results) {
      const retryable = result.reason.startsWith('http-403') || result.reason.startsWith('http-50') || result.reason.startsWith('fetch-error');
      if (!result.ok && retryable && (await worksViaSiteOptimizer(result.url))) {
        checks.set(result.url, { ...result, ok: true, reason: 'ok-via-optimizer' });
        continue;
      }
      checks.set(result.url, result);
    }
    process.stdout.write(`  checked ${Math.min(i + concurrency, uniqueUrls.length)}/${uniqueUrls.length}\n`);
  }

  const live = [...checks.values()].filter((c) => c.ok);
  const dead = [...checks.values()].filter((c) => !c.ok);
  const reasonCounts = dead.reduce<Record<string, number>>((acc, item) => {
    acc[item.reason] = (acc[item.reason] || 0) + 1;
    return acc;
  }, {});

  const affected = communities
    .map((row) => {
      const urls = collectUrls(row);
      const deadUrls = urls.filter((url) => !checks.get(url)?.ok);
      const liveUrls = urls.filter((url) => checks.get(url)?.ok);
      return { row, urls, deadUrls, liveUrls };
    })
    .filter((item) => item.deadUrls.length > 0);

  const report = {
    generatedAt: new Date().toISOString(),
    uniqueUrls: uniqueUrls.length,
    live: live.length,
    dead: dead.length,
    reasonCounts,
    affectedCommunities: affected.length,
    deadDetails: dead.map((item) => ({
      ...item,
      url: item.url.replace(/([?&]key=)[^&]+/i, '$1REDACTED'),
    })),
    affected: affected.map(({ row, deadUrls, liveUrls }) => ({
      id: row.id,
      name: row.name,
      city: row.city,
      region: row.region_slug,
      deadUrls: deadUrls.map((url) => url.replace(/([?&]key=)[^&]+/i, '$1REDACTED')),
      liveUrls,
    })),
  };

  const reportPath = join(process.cwd(), 'scripts/output/community-image-audit.json');
  writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\nLive: ${live.length}  Dead: ${dead.length}  Communities with dead URLs: ${affected.length}`);
  console.log('Reasons:', reasonCounts);
  console.log(`Wrote ${reportPath}`);

  if (!fix) {
    console.log('\nRe-run with --fix to strip dead URLs and refresh placement photos.');
    return;
  }

  let cleared = 0;
  let promoted = 0;
  let refreshed = 0;
  let refreshFailed = 0;

  for (const item of affected) {
    const nextUrls = item.liveUrls;
    const nextPrimary = nextUrls[0] || null;
    const patch: Record<string, unknown> = {
      image_url: nextPrimary,
      image_urls: nextUrls.length ? nextUrls : null,
      photos_last_updated: new Date().toISOString(),
    };
    if (!nextPrimary) patch.photos_source = 'cleared_dead';
    else if (nextPrimary !== item.row.image_url) patch.photos_source = 'audit_promoted';

    const { error: updateError } = await supabase
      .from('Community')
      .update(patch)
      .eq('id', item.row.id);

    if (updateError) {
      console.log(`  ✗ ${item.row.name}: ${updateError.message}`);
      continue;
    }

    if (nextPrimary && nextPrimary !== item.row.image_url) {
      promoted++;
      console.log(`  ✓ ${item.row.name}: promoted live gallery URL`);
    } else if (!nextPrimary) {
      cleared++;
      console.log(`  ✓ ${item.row.name}: cleared dead photo`);
    }
  }

  const { data: afterClear } = await supabase
    .from('Community')
    .select('id, name, city, state, address, services, region_slug, image_url, image_urls');

  const refreshTargets = ((afterClear || []) as CommunityRow[]).filter(
    (row) => isPlacementCareType(row.services, row.name) && (!row.image_url || isPlaceholderUrl(row.image_url) || isPlacesApiUrl(row.image_url))
  );

  console.log(`\nRefreshing photos for ${refreshTargets.length} placement communities missing a live image`);
  for (const row of refreshTargets) {
    if (!googleApiKey) {
      refreshFailed++;
      continue;
    }
    try {
      const photo = await refreshPhoto(row);
      if (!photo) {
        refreshFailed++;
        console.log(`  ✗ ${row.name}: no replacement photo`);
        continue;
      }
      const { error: updateError } = await supabase
        .from('Community')
        .update({
          image_url: photo,
          image_urls: [photo],
          photos_source: 'google_places',
          photos_last_updated: new Date().toISOString(),
        })
        .eq('id', row.id);
      if (updateError) {
        refreshFailed++;
        console.log(`  ✗ ${row.name}: ${updateError.message}`);
      } else {
        refreshed++;
        console.log(`  ✓ ${row.name}: refreshed`);
      }
      await new Promise((r) => setTimeout(r, 200));
    } catch (error) {
      refreshFailed++;
      console.log(`  ✗ ${row.name}: ${error}`);
    }
  }

  console.log(`\nFix complete. Cleared: ${cleared}, Promoted: ${promoted}, Refreshed: ${refreshed}, Refresh failed: ${refreshFailed}`);
}

main();
