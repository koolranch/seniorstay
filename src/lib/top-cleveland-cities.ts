/** High-traffic suburbs plus Chagrin Valley locals for placement SEO. */
export const TOP_CLEVELAND_CITIES = [
  { name: 'Rocky River', slug: 'rocky-river' },
  { name: 'Shaker Heights', slug: 'shaker-heights' },
  { name: 'Beachwood', slug: 'beachwood' },
  { name: 'Lakewood', slug: 'lakewood' },
  { name: 'Westlake', slug: 'westlake' },
  { name: 'Parma', slug: 'parma' },
  { name: 'Chagrin Falls', slug: 'chagrin-falls' },
  { name: 'Solon', slug: 'solon' },
  { name: 'Aurora', slug: 'aurora' },
  { name: 'South Russell', slug: 'south-russell' },
] as const;

export const CLEVELAND_CARE_HUBS = [
  { label: 'Assisted Living', href: '/assisted-living-cleveland' },
  { label: 'Memory Care', href: '/memory-care-cleveland' },
  { label: 'Independent Living', href: '/independent-living-cleveland' },
  { label: '2026 Cost Guide', href: '/senior-living-costs-cleveland' },
] as const;

export function slugToCityName(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
