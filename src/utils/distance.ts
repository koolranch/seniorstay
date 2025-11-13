/**
 * Distance calculation utilities for proximity-based community search
 */

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in miles
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Simple zip code to approximate coordinates lookup
 * Uses center points of major Cleveland-area zip codes
 */
const ZIP_COORDINATES: Record<string, { lat: number; lng: number }> = {
  // Cleveland proper
  '44102': { lat: 41.4784, lng: -81.7034 },
  '44103': { lat: 41.5034, lng: -81.6306 },
  '44104': { lat: 41.4851, lng: -81.6234 },
  '44105': { lat: 41.4645, lng: -81.6190 },
  '44106': { lat: 41.5067, lng: -81.6073 },
  '44107': { lat: 41.4823, lng: -81.7979 }, // Lakewood
  '44108': { lat: 41.5273, lng: -81.6190 },
  '44109': { lat: 41.4445, lng: -81.6973 },
  '44110': { lat: 41.5484, lng: -81.5556 },
  '44111': { lat: 41.4506, lng: -81.7640 },
  '44112': { lat: 41.5306, lng: -81.5867 }, // East Cleveland
  '44113': { lat: 41.4823, lng: -81.7034 },
  '44114': { lat: 41.5006, lng: -81.6940 },
  '44115': { lat: 41.4973, lng: -81.6473 },
  '44116': { lat: 41.4756, lng: -81.8412 }, // Rocky River
  '44117': { lat: 41.5234, lng: -81.5556 }, // Euclid
  '44118': { lat: 41.5123, lng: -81.5673 }, // Cleveland Heights
  '44119': { lat: 41.5067, lng: -81.5290 },
  '44120': { lat: 41.4739, lng: -81.5667 }, // Shaker Heights
  '44121': { lat: 41.5234, lng: -81.5373 }, // South Euclid
  '44122': { lat: 41.4756, lng: -81.5090 }, // Beachwood
  '44123': { lat: 41.5856, lng: -81.5167 }, // Euclid
  '44124': { lat: 41.5634, lng: -81.4673 }, // Lyndhurst/Mayfield Heights
  '44125': { lat: 41.4173, lng: -81.6012 }, // Garfield Heights
  '44126': { lat: 41.4506, lng: -81.8356 }, // Fairview Park
  '44127': { lat: 41.4506, lng: -81.6123 },
  '44128': { lat: 41.4734, lng: -81.5167 }, // Warrensville Heights
  '44129': { lat: 41.3934, lng: -81.7456 }, // Parma
  '44130': { lat: 41.3634, lng: -81.8190 }, // Middleburg Heights
  '44131': { lat: 41.3773, lng: -81.6762 }, // Independence/Seven Hills
  '44132': { lat: 41.5895, lng: -81.4790 }, // Euclid
  '44133': { lat: 41.3134, lng: -81.7234 }, // North Royalton
  '44134': { lat: 41.3912, lng: -81.7234 }, // Parma
  '44135': { lat: 41.4245, lng: -81.7690 },
  '44136': { lat: 41.3145, lng: -81.8356 }, // Strongsville
  '44137': { lat: 41.4156, lng: -81.5623 }, // Maple Heights
  '44138': { lat: 41.3712, lng: -81.9090 }, // Olmsted Falls
  '44139': { lat: 41.3890, lng: -81.4412 }, // Solon
  '44140': { lat: 41.3634, lng: -81.6012 }, // Bay Village
  '44141': { lat: 41.3134, lng: -81.6262 }, // Brecksville
  '44142': { lat: 41.4067, lng: -81.8223 }, // Brook Park
  '44143': { lat: 41.5534, lng: -81.5034 }, // Richmond Heights
  '44144': { lat: 41.4423, lng: -81.7334 }, // Brooklyn
  '44145': { lat: 41.4556, lng: -81.9179 }, // Westlake
  '44146': { lat: 41.3912, lng: -81.5334 }, // Bedford
  '44147': { lat: 41.3145, lng: -81.6673 }, // Broadview Heights
  
  // Suburbs
  '44017': { lat: 41.3662, lng: -81.8543 }, // Berea
  '44056': { lat: 41.3079, lng: -81.5090 }, // Macedonia
  '44060': { lat: 41.6662, lng: -81.3395 }, // Mentor
  '44070': { lat: 41.4162, lng: -81.9234 }, // North Olmsted
  '44092': { lat: 41.6123, lng: -81.4690 }, // Wickliffe
  '44094': { lat: 41.6395, lng: -81.4067 }, // Willoughby
  
  // Akron area
  '44221': { lat: 41.1434, lng: -81.4812 }, // Cuyahoga Falls
  '44256': { lat: 41.1434, lng: -81.8643 }, // Medina
  '44308': { lat: 41.0814, lng: -81.5190 }, // Akron
  
  // Additional
  '44067': { lat: 41.3645, lng: -81.5623 }, // Northfield
  '44212': { lat: 41.2379, lng: -81.8023 }, // Brunswick
  '44224': { lat: 41.1590, lng: -81.4401 }, // Stow
  '44011': { lat: 41.4512, lng: -82.0312 }, // Avon
  '44039': { lat: 41.3873, lng: -82.0190 }, // North Ridgeville
};

/**
 * Get coordinates for a zip code
 * Returns undefined if zip not in database
 */
export function getCoordinatesFromZip(zip: string): { lat: number; lng: number } | undefined {
  return ZIP_COORDINATES[zip];
}

/**
 * Calculate distance between user zip and community
 * Returns distance in miles, or undefined if coordinates unavailable
 */
export function getDistanceToCommunity(
  userZip: string,
  community: { coordinates?: { lat: number; lng: number }; zip?: string }
): number | undefined {
  const userCoords = getCoordinatesFromZip(userZip);
  if (!userCoords) return undefined;
  
  const communityCoords = community.coordinates;
  if (!communityCoords) return undefined;
  
  return calculateDistance(
    userCoords.lat,
    userCoords.lng,
    communityCoords.lat,
    communityCoords.lng
  );
}

/**
 * Format distance for display
 */
export function formatDistance(miles: number): string {
  if (miles < 1) {
    return `${Math.round(miles * 10) / 10} mi`;
  }
  return `${Math.round(miles * 10) / 10} mi`;
}

/**
 * Sort communities by distance from user zip
 */
export function sortByDistance<T extends { coordinates?: { lat: number; lng: number }; zip?: string }>(
  communities: T[],
  userZip: string
): (T & { distance?: number })[] {
  return communities
    .map(community => ({
      ...community,
      distance: getDistanceToCommunity(userZip, community),
    }))
    .filter(c => c.distance !== undefined) // Remove communities without distance
    .sort((a, b) => (a.distance || 0) - (b.distance || 0));
}

/**
 * Get nearby communities within radius
 */
export function getNearbyCommunities<T extends { coordinates?: { lat: number; lng: number }; zip?: string }>(
  communities: T[],
  userZip: string,
  maxDistanceMiles: number = 20,
  limit: number = 5
): (T & { distance: number })[] {
  const sorted = sortByDistance(communities, userZip);
  
  return sorted
    .filter(c => c.distance !== undefined && c.distance <= maxDistanceMiles)
    .slice(0, limit) as (T & { distance: number })[];
}

/**
 * Validate US zip code format
 */
export function isValidZipCode(zip: string): boolean {
  return /^\d{5}$/.test(zip);
}

/**
 * Format zip code as user types (##### format)
 */
export function formatZipCode(input: string): string {
  // Remove non-digits
  const digits = input.replace(/\D/g, '');
  
  // Limit to 5 digits
  return digits.slice(0, 5);
}

