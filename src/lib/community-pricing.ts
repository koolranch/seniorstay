import { Community } from '@/data/facilities';

/** 2026 Cleveland-area monthly estimate ranges by city (Genworth / market research) */
export const PRICING_RANGES: Record<
  string,
  {
    assisted_living: [number, number];
    memory_care: [number, number];
    independent_living?: [number, number];
  }
> = {
  beachwood: { assisted_living: [5500, 8200], memory_care: [6500, 9500] },
  // Westlake ranges must match the CityAdvisorDeepDive pricing table
  westlake: {
    independent_living: [2400, 4300],
    assisted_living: [4300, 6900],
    memory_care: [5600, 8500],
  },
  'shaker heights': { assisted_living: [5200, 7800], memory_care: [6200, 9000] },
  'rocky river': { assisted_living: [4600, 7000], memory_care: [5800, 8500] },
  parma: { assisted_living: [3800, 5800], memory_care: [5000, 7500] },
  lakewood: { assisted_living: [4200, 6500], memory_care: [5500, 8000] },
  strongsville: { assisted_living: [4400, 6800], memory_care: [5600, 8200] },
  mentor: { assisted_living: [4000, 6200], memory_care: [5200, 7800] },
  solon: { assisted_living: [4800, 7200], memory_care: [6000, 8600] },
  cleveland: { assisted_living: [3500, 6500], memory_care: [4800, 8000] },
  independence: { assisted_living: [4200, 6500], memory_care: [5400, 7800] },
  'seven hills': { assisted_living: [3800, 5800], memory_care: [5000, 7200] },
};

export interface CommunityPriceEstimate {
  low: number;
  high: number;
  label: string;
  isEstimate: true;
  /** When advisor/partner confirmed a starting price */
  confirmedStarting?: number;
}

function getCityFromLocation(location: string): string {
  return location.split(',')[0].trim().toLowerCase();
}

export function getPricingForCommunity(community: Community): CommunityPriceEstimate {
  if (community.startingPriceMonthly) {
    const start = community.startingPriceMonthly;
    return {
      low: start,
      high: Math.round(start * 1.35),
      label: community.careTypes.some((t) => t.toLowerCase().includes('memory'))
        ? 'Memory Care'
        : 'Assisted Living',
      isEstimate: true,
      confirmedStarting: start,
    };
  }

  const city = getCityFromLocation(community.location);
  const pricing = PRICING_RANGES[city] || PRICING_RANGES.cleveland;
  const types = community.careTypes.map((t) => t.toLowerCase());
  const hasMemoryCare = types.some((t) => t.includes('memory'));
  const independentOnly =
    types.some((t) => t.includes('independent')) &&
    !types.some((t) => t.includes('assisted') || t.includes('memory'));

  if (independentOnly) {
    const il = pricing.independent_living || CLEVELAND_IL_FALLBACK;
    return { low: il[0], high: il[1], label: 'Independent Living', isEstimate: true };
  }
  if (hasMemoryCare) {
    return { low: pricing.memory_care[0], high: pricing.memory_care[1], label: 'Memory Care', isEstimate: true };
  }
  return { low: pricing.assisted_living[0], high: pricing.assisted_living[1], label: 'Assisted Living', isEstimate: true };
}

/** Metro-wide independent living range when a city has no specific IL data */
const CLEVELAND_IL_FALLBACK: [number, number] = [2400, 4800];

export function formatPriceRange(low: number, high: number): string {
  const fmt = (n: number) => `$${n.toLocaleString()}`;
  return `${fmt(low)}–${fmt(high)}/mo`;
}

export function formatPriceEstimate(community: Community): string {
  const p = getPricingForCommunity(community);
  if (p.confirmedStarting) {
    return `From $${p.confirmedStarting.toLocaleString()}/mo`;
  }
  return formatPriceRange(p.low, p.high);
}

export type BudgetFilter = 'all' | 'under-5k' | '5k-7k' | '7k-plus';

export function matchesBudgetFilter(community: Community, budget: BudgetFilter): boolean {
  if (budget === 'all') return true;
  const { low, high } = getPricingForCommunity(community);
  const mid = (low + high) / 2;
  if (budget === 'under-5k') return high <= 5500 || mid < 5000;
  if (budget === '5k-7k') return mid >= 4500 && mid <= 7500;
  if (budget === '7k-plus') return low >= 6500 || mid >= 7000;
  return true;
}
