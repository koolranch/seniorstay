/**
 * Hospital Proximity Data for Cleveland Area Communities
 * Used for AEO (Answer Engine Optimization) and E-E-A-T signals
 */

export interface HospitalData {
  name: string;
  shortName: string;
  address: string;
  coordinates: { lat: number; lng: number };
  type: 'major_system' | 'regional' | 'specialty';
  medicalSystem: 'Cleveland Clinic' | 'University Hospitals' | 'MetroHealth' | 'Southwest General' | 'Other';
}

// Major Cleveland-area hospital coordinates
export const CLEVELAND_HOSPITALS: HospitalData[] = [
  {
    name: 'Cleveland Clinic Main Campus',
    shortName: 'Cleveland Clinic',
    address: '9500 Euclid Ave, Cleveland, OH 44195',
    coordinates: { lat: 41.5014, lng: -81.6219 },
    type: 'major_system',
    medicalSystem: 'Cleveland Clinic',
  },
  {
    name: 'University Hospitals Cleveland Medical Center',
    shortName: 'UH Cleveland',
    address: '11100 Euclid Ave, Cleveland, OH 44106',
    coordinates: { lat: 41.5063, lng: -81.6048 },
    type: 'major_system',
    medicalSystem: 'University Hospitals',
  },
  {
    name: 'University Hospitals Ahuja Medical Center',
    shortName: 'UH Ahuja',
    address: '3999 Richmond Rd, Beachwood, OH 44122',
    coordinates: { lat: 41.4625, lng: -81.4944 },
    type: 'major_system',
    medicalSystem: 'University Hospitals',
  },
  {
    name: 'Cleveland Clinic Fairview Hospital',
    shortName: 'Fairview Hospital',
    address: '18101 Lorain Ave, Cleveland, OH 44111',
    coordinates: { lat: 41.4550, lng: -81.8097 },
    type: 'major_system',
    medicalSystem: 'Cleveland Clinic',
  },
  {
    name: 'St. John Medical Center',
    shortName: 'St. John Medical',
    address: '29000 Center Ridge Rd, Westlake, OH 44145',
    coordinates: { lat: 41.4563, lng: -81.9297 },
    type: 'regional',
    medicalSystem: 'University Hospitals',
  },
  {
    name: 'Cleveland Clinic Hillcrest Hospital',
    shortName: 'Hillcrest Hospital',
    address: '6780 Mayfield Rd, Mayfield Heights, OH 44124',
    coordinates: { lat: 41.5181, lng: -81.4556 },
    type: 'major_system',
    medicalSystem: 'Cleveland Clinic',
  },
  {
    name: 'Southwest General Health Center',
    shortName: 'Southwest General',
    address: '18697 E Bagley Rd, Middleburg Heights, OH 44130',
    coordinates: { lat: 41.3617, lng: -81.8117 },
    type: 'regional',
    medicalSystem: 'Southwest General',
  },
  {
    name: 'MetroHealth Medical Center',
    shortName: 'MetroHealth',
    address: '2500 MetroHealth Dr, Cleveland, OH 44109',
    coordinates: { lat: 41.4456, lng: -81.7033 },
    type: 'major_system',
    medicalSystem: 'MetroHealth',
  },
  {
    name: 'Cleveland Clinic Avon Hospital',
    shortName: 'Cleveland Clinic Avon',
    address: '33300 Cleveland Clinic Blvd, Avon, OH 44011',
    coordinates: { lat: 41.4386, lng: -82.0097 },
    type: 'major_system',
    medicalSystem: 'Cleveland Clinic',
  },
  {
    name: 'Cleveland Clinic Beachwood Family Health Center',
    shortName: 'CC Beachwood',
    address: '26900 Cedar Rd, Beachwood, OH 44122',
    coordinates: { lat: 41.4781, lng: -81.4953 },
    type: 'specialty',
    medicalSystem: 'Cleveland Clinic',
  },
  {
    name: 'Cleveland Clinic Richard E. Jacobs Health Center',
    shortName: 'CC Jacobs Health Center',
    address: '33100 Cleveland Clinic Blvd, Avon, OH 44011',
    coordinates: { lat: 41.4375, lng: -82.0089 },
    type: 'specialty',
    medicalSystem: 'Cleveland Clinic',
  },
];

// City-to-hospital mapping for quick lookups (primary hospitals per city)
export const CITY_HOSPITAL_MAP: Record<string, string[]> = {
  'westlake': ['St. John Medical Center', 'Cleveland Clinic Avon Hospital', 'Fairview Hospital'],
  'beachwood': ['University Hospitals Ahuja Medical Center', 'Cleveland Clinic Beachwood Family Health Center', 'Cleveland Clinic Hillcrest Hospital'],
  'shaker-heights': ['University Hospitals Cleveland Medical Center', 'Cleveland Clinic Main Campus'],
  'cleveland': ['Cleveland Clinic Main Campus', 'University Hospitals Cleveland Medical Center', 'MetroHealth Medical Center'],
  'parma': ['Southwest General Health Center', 'MetroHealth Medical Center', 'Fairview Hospital'],
  'strongsville': ['Southwest General Health Center', 'Cleveland Clinic Avon Hospital'],
  'lakewood': ['Fairview Hospital', 'MetroHealth Medical Center'],
  'rocky-river': ['Fairview Hospital', 'St. John Medical Center'],
  'mentor': ['Cleveland Clinic Hillcrest Hospital', 'Lake Health Mentor'],
  'solon': ['University Hospitals Ahuja Medical Center', 'Cleveland Clinic Hillcrest Hospital'],
  'independence': ['Southwest General Health Center', 'MetroHealth Medical Center'],
  'avon': ['Cleveland Clinic Avon Hospital', 'St. John Medical Center'],
  'north-olmsted': ['Fairview Hospital', 'St. John Medical Center'],
  'bay-village': ['St. John Medical Center', 'Fairview Hospital'],
};

/**
 * Calculate distance between two coordinates using Haversine formula
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3958.8; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Find the nearest hospital to a given location
 */
export function findNearestHospital(
  lat: number,
  lng: number,
  filterType?: 'major_system' | 'regional' | 'specialty'
): { hospital: HospitalData; distance: number } | null {
  let hospitals = CLEVELAND_HOSPITALS;
  
  if (filterType) {
    hospitals = hospitals.filter(h => h.type === filterType);
  }
  
  if (hospitals.length === 0) return null;
  
  let nearest: HospitalData | null = null;
  let minDistance = Infinity;
  
  for (const hospital of hospitals) {
    const distance = calculateDistance(lat, lng, hospital.coordinates.lat, hospital.coordinates.lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = hospital;
    }
  }
  
  return nearest ? { hospital: nearest, distance: Math.round(minDistance * 10) / 10 } : null;
}

/**
 * Get hospital data for a city slug
 */
export function getCityHospitals(citySlug: string): HospitalData[] {
  const hospitalNames = CITY_HOSPITAL_MAP[citySlug] || CITY_HOSPITAL_MAP['cleveland'];
  return CLEVELAND_HOSPITALS.filter(h => hospitalNames.includes(h.name));
}

/**
 * Get nearest hospital name for a city (for quick metadata)
 */
export function getNearestHospitalForCity(citySlug: string): string {
  const hospitals = getCityHospitals(citySlug);
  return hospitals[0]?.shortName || 'Cleveland Clinic';
}

/**
 * Generate hospital proximity sentence for AEO content
 */
export function generateHospitalProximitySentence(
  communityName: string,
  lat?: number,
  lng?: number,
  citySlug?: string
): string {
  if (lat && lng) {
    const nearest = findNearestHospital(lat, lng, 'major_system');
    if (nearest) {
      return `${communityName} is located just ${nearest.distance} miles from ${nearest.hospital.name}, part of the ${nearest.hospital.medicalSystem} network.`;
    }
  }
  
  if (citySlug) {
    const hospital = getNearestHospitalForCity(citySlug);
    return `${communityName} offers convenient access to ${hospital} and the Greater Cleveland healthcare network.`;
  }
  
  return `${communityName} is located in Greater Cleveland with easy access to world-class healthcare facilities including Cleveland Clinic and University Hospitals.`;
}

/**
 * Generate conversational metadata for GEO optimization
 */
export function generateConversationalTitle(
  cityName: string,
  communityCount: number,
  nearestHospital: string,
  averageRating?: number
): string {
  const ratingText = averageRating ? `—verified ${new Date().getFullYear()} pricing and clinical data` : '';
  
  if (communityCount > 0) {
    return `Compare the top ${communityCount} ${cityName} assisted living communities near ${nearestHospital}${ratingText}`;
  }
  
  return `Find verified senior living communities in ${cityName}, OH near ${nearestHospital}`;
}

/**
 * Generate conversational description for GEO optimization
 */
export function generateConversationalDescription(
  cityName: string,
  communityCount: number,
  hospitals: string[],
  costRange?: string,
  hasMemoryCare?: boolean
): string {
  const hospitalText = hospitals.slice(0, 2).join(' and ');
  const careTypes = hasMemoryCare ? 'assisted living and memory care' : 'assisted living';
  const year = new Date().getFullYear();
  
  return `${year} guide: Compare ${communityCount > 0 ? communityCount : 'verified'} ${careTypes} communities in ${cityName}, Ohio. ` +
    `Prices from ${costRange || '$3,500-$7,000'}/mo. Near ${hospitalText}. ` +
    `Expert advisors help Cleveland families find the right senior care—free consultations available.`;
}

