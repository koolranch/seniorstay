/**
 * ============================================================================
 * REGIONS CONFIG - Multi-City Architecture Support
 * ============================================================================
 * Central configuration for all supported metro regions.
 * Enables scalable expansion to new cities while maintaining
 * hyper-local SEO authority for each region.
 * ============================================================================
 */

import { CityInfo, clevelandCitiesData } from './cleveland-cities';

export type { CityInfo };

/**
 * Region configuration interface
 */
export interface RegionConfig {
  slug: string;
  displayName: string;
  metroName: string;
  state: string;
  stateAbbr: string;
  primaryCity: string;
  phoneNumber: string;
  tagline: string;
  description: string;
  counties: string[];
  cities: Record<string, CityInfo>;
  // SEO metadata
  seo: {
    titleSuffix: string;
    defaultDescription: string;
    keywords: string[];
  };
}

/**
 * Greater Cleveland region configuration
 */
const clevelandRegion: RegionConfig = {
  slug: 'cleveland',
  displayName: 'Greater Cleveland',
  metroName: 'Cleveland Metro',
  state: 'Ohio',
  stateAbbr: 'OH',
  primaryCity: 'Cleveland',
  phoneNumber: '(216) 677-4630',
  tagline: 'Cleveland Senior Living Experts',
  description: 'Find senior living communities across Greater Cleveland including Cleveland, Beachwood, Shaker Heights, Westlake, and more.',
  counties: ['Cuyahoga', 'Lake', 'Lorain', 'Medina', 'Summit', 'Geauga'],
  cities: clevelandCitiesData,
  seo: {
    titleSuffix: 'Greater Cleveland',
    defaultDescription: 'Explore 150+ senior living communities across Greater Cleveland. Find assisted living, memory care, and independent living in your preferred neighborhood.',
    keywords: [
      'Greater Cleveland senior living',
      'Cleveland metro senior care',
      'Cuyahoga County assisted living',
      'Northeast Ohio senior communities',
    ],
  },
};

/**
 * Greater Columbus region configuration (placeholder for expansion)
 */
const columbusRegion: RegionConfig = {
  slug: 'columbus',
  displayName: 'Greater Columbus',
  metroName: 'Columbus Metro',
  state: 'Ohio',
  stateAbbr: 'OH',
  primaryCity: 'Columbus',
  phoneNumber: '(614) 555-0000', // Placeholder
  tagline: 'Columbus Senior Living Experts',
  description: 'Find senior living communities across Greater Columbus including Columbus, Dublin, Westerville, and more.',
  counties: ['Franklin', 'Delaware', 'Licking', 'Fairfield', 'Pickaway'],
  cities: {
    // Placeholder cities - to be populated with actual data
    'columbus': {
      name: 'Columbus',
      slug: 'columbus',
      description: 'Ohio\'s capital and largest city offers diverse senior living options with excellent healthcare facilities and cultural amenities.',
      highlights: [
        'Ohio State University Wexner Medical Center',
        'Short North Arts District',
        'German Village and historic neighborhoods',
        'Columbus Zoo and Aquarium',
        'Diverse dining and entertainment options',
      ],
      nearbyHospitals: [
        'Ohio State University Wexner Medical Center',
        'OhioHealth Riverside Methodist Hospital',
        'Mount Carmel Health System',
        'Nationwide Children\'s Hospital',
      ],
      averageCost: {
        independentLiving: '$2,500 - $4,500',
        assistedLiving: '$3,500 - $6,000',
        memoryCare: '$5,000 - $8,000',
      },
    },
    'dublin': {
      name: 'Dublin',
      slug: 'dublin',
      description: 'Dublin is an affluent northwestern suburb known for its Irish heritage, excellent schools, and high quality of life.',
      highlights: [
        'Historic downtown with Irish heritage',
        'Dublin Arts Council',
        'Excellent city services',
        'Top-rated schools',
        'Close to major healthcare',
      ],
      nearbyHospitals: [
        'OhioHealth Dublin Methodist Hospital',
        'Ohio State University Wexner Medical Center',
        'Mount Carmel St. Ann\'s',
      ],
      averageCost: {
        independentLiving: '$3,000 - $5,500',
        assistedLiving: '$4,500 - $7,500',
        memoryCare: '$6,000 - $9,500',
      },
    },
    'westerville': {
      name: 'Westerville',
      slug: 'westerville',
      description: 'Westerville is a vibrant community in northeastern Columbus known for Otterbein University and its charming uptown area.',
      highlights: [
        'Otterbein University campus',
        'Charming Uptown Westerville',
        'Alum Creek State Park nearby',
        'Strong community programming',
        'Family-friendly atmosphere',
      ],
      nearbyHospitals: [
        'Mount Carmel St. Ann\'s',
        'OhioHealth Westerville Medical Campus',
        'Ohio State University Wexner Medical Center',
      ],
      averageCost: {
        independentLiving: '$2,600 - $4,500',
        assistedLiving: '$3,800 - $6,500',
        memoryCare: '$5,200 - $8,500',
      },
    },
  },
  seo: {
    titleSuffix: 'Greater Columbus',
    defaultDescription: 'Explore senior living communities across Greater Columbus. Find assisted living, memory care, and independent living in Central Ohio.',
    keywords: [
      'Greater Columbus senior living',
      'Columbus metro senior care',
      'Franklin County assisted living',
      'Central Ohio senior communities',
    ],
  },
};

/**
 * All supported regions
 */
export const REGIONS: Record<string, RegionConfig> = {
  'cleveland': clevelandRegion,
  'columbus': columbusRegion,
};

/**
 * Default region slug
 */
export const DEFAULT_REGION = 'cleveland';

/**
 * Get all region slugs
 */
export function getAllRegionSlugs(): string[] {
  return Object.keys(REGIONS);
}

/**
 * Get region config by slug
 */
export function getRegionConfig(regionSlug: string): RegionConfig | null {
  return REGIONS[regionSlug] || null;
}

/**
 * Get region display name
 */
export function getRegionDisplayName(regionSlug: string): string {
  return REGIONS[regionSlug]?.displayName || 'Unknown Region';
}

/**
 * Get region metro name
 */
export function getRegionMetroName(regionSlug: string): string {
  return REGIONS[regionSlug]?.metroName || 'Unknown Metro';
}

/**
 * Get cities for a region
 */
export function getRegionCities(regionSlug: string): Record<string, CityInfo> {
  return REGIONS[regionSlug]?.cities || {};
}

/**
 * Get city info within a region
 */
export function getCityInfo(regionSlug: string, citySlug: string): CityInfo | null {
  const region = REGIONS[regionSlug];
  if (!region) return null;
  return region.cities[citySlug] || null;
}

/**
 * Get all city slugs for a region
 */
export function getRegionCitySlugs(regionSlug: string): string[] {
  const region = REGIONS[regionSlug];
  if (!region) return [];
  return Object.keys(region.cities);
}

/**
 * Get region phone number
 */
export function getRegionPhoneNumber(regionSlug: string): string {
  return REGIONS[regionSlug]?.phoneNumber || '(216) 677-4630'; // Default to Cleveland
}

/**
 * Get region tagline
 */
export function getRegionTagline(regionSlug: string): string {
  return REGIONS[regionSlug]?.tagline || 'Senior Living Experts';
}

/**
 * Check if a region slug is valid
 */
export function isValidRegion(regionSlug: string): boolean {
  return regionSlug in REGIONS;
}

/**
 * Check if a city exists in a region
 */
export function isCityInRegion(regionSlug: string, citySlug: string): boolean {
  const region = REGIONS[regionSlug];
  if (!region) return false;
  return citySlug in region.cities;
}

/**
 * Get region SEO data
 */
export function getRegionSEO(regionSlug: string) {
  return REGIONS[regionSlug]?.seo || {
    titleSuffix: 'Senior Living',
    defaultDescription: 'Find senior living communities near you.',
    keywords: ['senior living', 'assisted living', 'memory care'],
  };
}

/**
 * Generate metadata title for a region
 */
export function generateRegionTitle(regionSlug: string, pageTitle?: string): string {
  const region = REGIONS[regionSlug];
  if (!region) return pageTitle || 'Guide for Seniors';
  
  if (pageTitle) {
    return `${pageTitle} | ${region.seo.titleSuffix} | Guide for Seniors`;
  }
  return `Senior Living in ${region.displayName} | Guide for Seniors`;
}

/**
 * Hub page cities list for region hub pages
 * These are the cities displayed on the regional hub page with counts
 */
export interface HubCity {
  name: string;
  description: string;
  clinicalAnchor?: string;
  tier?: number;
}

export function getHubCities(regionSlug: string): HubCity[] {
  const region = REGIONS[regionSlug];
  if (!region) return [];
  
  // Return formatted hub city data from region cities
  return Object.values(region.cities).map(city => ({
    name: city.name,
    description: city.description.substring(0, 100) + '...',
    clinicalAnchor: city.nearbyHospitals[0],
    tier: ['beachwood', 'shaker-heights', 'westlake', 'chagrin-falls', 'hudson', 'rocky-river', 'solon'].includes(city.slug) ? 1 : undefined,
  }));
}
