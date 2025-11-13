/**
 * Utility to extract and parse zip codes from addresses
 */

import { Community } from '@/data/facilities';

/**
 * Extract zip code from address string
 * Matches 5-digit US zip codes
 */
export function extractZipFromAddress(address?: string): string | undefined {
  if (!address) return undefined;
  
  const zipMatch = address.match(/\b\d{5}\b/);
  return zipMatch ? zipMatch[0] : undefined;
}

/**
 * Map of Cleveland-area cities to their primary zip codes
 * Used as fallback when address doesn't contain zip
 */
const CITY_TO_ZIP: Record<string, string> = {
  'Cleveland': '44114',
  'Shaker Heights': '44120',
  'Beachwood': '44122',
  'Parma': '44134',
  'Lakewood': '44107',
  'Westlake': '44145',
  'Strongsville': '44136',
  'Independence': '44131',
  'Seven Hills': '44131',
  'Rocky River': '44116',
  'North Olmsted': '44070',
  'Mayfield Heights': '44124',
  'Richmond Heights': '44143',
  'Solon': '44139',
  'Macedonia': '44056',
  'Bedford': '44146',
  'Garfield Heights': '44125',
  'Maple Heights': '44137',
  'Middleburg Heights': '44130',
  'Brook Park': '44142',
  'Berea': '44017',
  'Lyndhurst': '44124',
  'Mentor': '44060',
  'Akron': '44308',
  'Cuyahoga Falls': '44221',
  'Medina': '44256',
  'Brunswick': '44212',
  'Avon': '44011',
  'North Royalton': '44133',
  'Broadview Heights': '44147',
  'Brecksville': '44141',
  'Wickliffe': '44092',
  'Willoughby': '44094',
  'Euclid': '44123',
  'Cleveland Heights': '44118',
  'University Heights': '44118',
  'South Euclid': '44121',
  'East Cleveland': '44112',
  'Warrensville Heights': '44128',
  'Brooklyn': '44144',
  'Olmsted Falls': '44138',
  'Northfield': '44067',
  'Twinsburg': '44087',
  'Stow': '44224',
  'Hudson': '44236',
  'Streetsboro': '44241',
  'Wooster': '44691',
  'Chardon': '44024',
  'Painesville': '44077',
  'Ashtabula': '44004',
  'Elyria': '44035',
  'Lorain': '44052',
  'North Ridgeville': '44039',
  'Amherst': '44001',
  'Grafton': '44044',
  'Columbia Station': '44028',
  'Sheffield Lake': '44054',
  'Vermilion': '44089',
  'Poland': '44514',
  'Boardman': '44512',
  'Canfield': '44406',
  'Austintown': '44515',
  'Cortland': '44410',
  'Warren': '44483',
  'Niles': '44446',
  'Girard': '44420',
  'Youngstown': '44505',
  'Dover': '44622',
  'New Philadelphia': '44663',
  'Troy': '45373',
};

/**
 * Extract zip code from location string (city, state format)
 */
export function extractZipFromLocation(location: string): string | undefined {
  // Location format: "City Name, OH" or "City Name, State"
  const cityMatch = location.match(/^([^,]+)/);
  if (!cityMatch) return undefined;
  
  const city = cityMatch[1].trim();
  return CITY_TO_ZIP[city];
}

/**
 * Get zip code for a community from address or location
 */
export function getZipForCommunity(community: Community): string | undefined {
  // Try address first
  const zipFromAddress = extractZipFromAddress(community.address);
  if (zipFromAddress) return zipFromAddress;
  
  // Fallback to location-based lookup
  return extractZipFromLocation(community.location);
}

/**
 * Add zip codes to all communities in array
 */
export function enrichCommunitiesWithZips(communities: Community[]): Community[] {
  return communities.map(community => ({
    ...community,
    zip: community.zip || getZipForCommunity(community),
  }));
}

