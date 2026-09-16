import { notFound, permanentRedirect } from 'next/navigation';
import { fetchCommunityById, fetchCommunityBySlug } from '@/lib/fetch-community';
import { DEFAULT_REGION, isValidRegion } from '@/data/regions';

export const revalidate = 300;

interface LegacyCommunityPageProps {
  params: { id: string; slug: string };
}

/**
 * Legacy /community/:id/:slug URLs predate the region-aware architecture.
 * 308 to /:region/community/:id/:slug so Google consolidates onto one URL.
 * Region comes from the community row so Columbus listings are not forced
 * onto /cleveland (the old next.config redirect did that).
 */
export default async function LegacyCommunityRedirect({
  params,
}: LegacyCommunityPageProps) {
  const { id, slug } = params;

  const community = (await fetchCommunityById(id)) ?? (await fetchCommunityBySlug(slug));

  if (!community) {
    notFound();
  }

  const regionSlug =
    community.regionSlug && isValidRegion(community.regionSlug)
      ? community.regionSlug
      : DEFAULT_REGION;

  permanentRedirect(`/${regionSlug}/community/${community.id}/${slug}`);
}
