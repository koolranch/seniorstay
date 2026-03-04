import { redirect, notFound } from 'next/navigation';
import { findCommunityByLegacySlug } from '@/lib/fetch-community';
import { getAllRegionSlugs, isCityInRegion } from '@/data/regions';

/**
 * Handles legacy /ohio/:city/:slug URLs (and similar state-based patterns)
 * that return 404. Redirects to canonical /[region]/community/:id/:slug.
 *
 * These URLs are indexed by search engines and linked externally - redirecting
 * preserves SEO equity and fixes the user experience.
 */
export default async function LegacyCommunityRedirect({
  params,
}: {
  params: Promise<{ region: string; city: string; slug: string }>;
}) {
  const { region, city, slug } = await params;

  // Map state-based "ohio" to the metro region that contains this city
  let targetRegion = region.toLowerCase();
  if (targetRegion === 'ohio') {
    targetRegion = isCityInRegion('cleveland', city)
      ? 'cleveland'
      : isCityInRegion('columbus', city)
        ? 'columbus'
        : 'cleveland'; // fallback for unknown cities
  }
  const validRegions = getAllRegionSlugs();
  if (!validRegions.includes(targetRegion)) {
    notFound();
  }

  const community = await findCommunityByLegacySlug(slug, city, targetRegion);

  if (community) {
    const canonicalSlug = community.slug || community.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    redirect(`/${targetRegion}/community/${community.id}/${canonicalSlug}`);
  }

  // No community found: redirect to city page so user lands on working content
  redirect(`/${targetRegion}/${city}`);
}
