import { Community } from '@/data/facilities';
import { matchesBudgetFilter, BudgetFilter } from '@/lib/community-pricing';

const PLACEHOLDER_PATTERNS = ['placeholder', 'no-image', 'default-community', 'generic', 'missing'];

export function hasRealCommunityImage(community: Community): boolean {
  const url = community.images?.[0];
  if (!url || typeof url !== 'string') return false;
  const lower = url.trim().toLowerCase();
  if (!lower || lower.startsWith('data:image/svg')) return false;
  return !PLACEHOLDER_PATTERNS.some((p) => lower.includes(p));
}

export type CareTypeFilter =
  | 'all'
  | 'assisted-living'
  | 'memory-care'
  | 'independent-living'
  | 'skilled-nursing';

export interface ListingFilters {
  careType: CareTypeFilter;
  budget: BudgetFilter;
  photosOnly: boolean;
}

export const DEFAULT_LISTING_FILTERS: ListingFilters = {
  careType: 'all',
  budget: 'all',
  photosOnly: false,
};

function matchesCareType(community: Community, filter: CareTypeFilter): boolean {
  if (filter === 'all') return true;
  const types = community.careTypes.map((t) => t.toLowerCase());
  switch (filter) {
    case 'assisted-living':
      return types.some((t) => t.includes('assisted living'));
    case 'memory-care':
      return types.some((t) => t.includes('memory'));
    case 'independent-living':
      return types.some((t) => t.includes('independent'));
    case 'skilled-nursing':
      return types.some((t) => t.includes('skilled nursing') || t.includes('nursing'));
    default:
      return true;
  }
}

export function filterCommunities(communities: Community[], filters: ListingFilters): Community[] {
  return communities.filter((c) => {
    if (!matchesCareType(c, filters.careType)) return false;
    if (!matchesBudgetFilter(c, filters.budget)) return false;
    if (filters.photosOnly && !hasRealCommunityImage(c)) return false;
    return true;
  });
}

/** Prefer real photos, then confirmed pricing, then CMS rating */
export function sortCommunitiesForDisplay(communities: Community[]): Community[] {
  return [...communities].sort((a, b) => {
    const aPhoto = hasRealCommunityImage(a) ? 1 : 0;
    const bPhoto = hasRealCommunityImage(b) ? 1 : 0;
    if (bPhoto !== aPhoto) return bPhoto - aPhoto;

    const aPrice = a.startingPriceMonthly ? 1 : 0;
    const bPrice = b.startingPriceMonthly ? 1 : 0;
    if (bPrice !== aPrice) return bPrice - aPrice;

    const aRating = a.overallRating ?? 0;
    const bRating = b.overallRating ?? 0;
    if (bRating !== aRating) return bRating - aRating;

    return a.name.localeCompare(b.name);
  });
}

export function getFeaturedCommunities(communities: Community[], limit = 9): Community[] {
  return sortCommunitiesForDisplay(
    communities.filter(
      (c) =>
        c.careTypes.some(
          (t) =>
            t.toLowerCase().includes('assisted living') || t.toLowerCase().includes('memory care')
        ) && (c.description || hasRealCommunityImage(c))
    )
  ).slice(0, limit);
}
