/**
 * Neighborhood & Location Data for Cleveland Area Communities
 * Used to enrich community detail pages with hyper-local context
 */

export interface NearbyPlace {
  name: string;
  type: 'hospital' | 'grocery' | 'park' | 'pharmacy' | 'restaurant';
  distance: string;
  address?: string;
}

export interface NeighborhoodData {
  nearestHospital: {
    name: string;
    distance: string;
    address: string;
    phone?: string;
  };
  nearbyPlaces: NearbyPlace[];
  localDescription: string;
}

// Neighborhood data keyed by city slug
export const neighborhoodData: Record<string, NeighborhoodData> = {
  'brunswick': {
    nearestHospital: {
      name: 'Cleveland Clinic - Medina Hospital',
      distance: '2 miles',
      address: '1000 E Washington St, Medina, OH 44256',
      phone: '(330) 725-1000'
    },
    nearbyPlaces: [
      { name: 'Plum Creek Park', type: 'park', distance: '1.5 miles', address: '5765 Sleepy Hollow Rd' },
      { name: 'Meijer', type: 'grocery', distance: '0.7 miles', address: '3800 Center Rd' },
      { name: 'Giant Eagle', type: 'grocery', distance: '0.5 miles', address: '3440 Center Road' },
      { name: 'CVS Pharmacy', type: 'pharmacy', distance: '0.8 miles', address: '3336 Center Rd' }
    ],
    localDescription: 'Brunswick offers a peaceful suburban setting with easy access to healthcare and daily conveniences. The area features beautiful parks with senior-friendly walking trails and a thriving local community.'
  },
  'beachwood': {
    nearestHospital: {
      name: 'UH Ahuja Medical Center',
      distance: '1 mile',
      address: '3999 Richmond Rd, Beachwood, OH 44122',
      phone: '(216) 593-5500'
    },
    nearbyPlaces: [
      { name: 'Beachwood Place Mall', type: 'grocery', distance: '0.5 miles', address: '26300 Cedar Rd' },
      { name: 'Beachwood City Park', type: 'park', distance: '1 mile', address: '2700 Richmond Rd' },
      { name: 'Heinen\'s', type: 'grocery', distance: '1.2 miles', address: '25001 Chagrin Blvd' }
    ],
    localDescription: 'Beachwood is an upscale Cleveland suburb known for excellent healthcare access, premier shopping, and a strong sense of community for seniors.'
  },
  'parma': {
    nearestHospital: {
      name: 'UH Parma Medical Center',
      distance: '1.5 miles',
      address: '7007 Powers Blvd, Parma, OH 44129',
      phone: '(440) 743-3000'
    },
    nearbyPlaces: [
      { name: 'West Creek Reservation', type: 'park', distance: '2 miles', address: '2277 W Ridgewood Dr' },
      { name: 'Giant Eagle', type: 'grocery', distance: '0.8 miles', address: '7939 Day Dr' },
      { name: 'Marc\'s', type: 'grocery', distance: '1 mile', address: '5689 Pearl Rd' }
    ],
    localDescription: 'Parma offers affordable senior living with excellent healthcare access and a strong Polish-American heritage community.'
  },
  'westlake': {
    nearestHospital: {
      name: 'St. John Medical Center',
      distance: '1 mile',
      address: '29000 Center Ridge Rd, Westlake, OH 44145',
      phone: '(440) 835-8000'
    },
    nearbyPlaces: [
      { name: 'Crocker Park', type: 'grocery', distance: '1.5 miles', address: '239 Market St' },
      { name: 'Clague Park', type: 'park', distance: '0.8 miles', address: '1400 Clague Rd' },
      { name: 'Whole Foods', type: 'grocery', distance: '1.2 miles', address: '30275 Detroit Rd' }
    ],
    localDescription: 'Westlake combines suburban tranquility with urban conveniences, featuring excellent healthcare, upscale shopping at Crocker Park, and beautiful parks.'
  },
  'lakewood': {
    nearestHospital: {
      name: 'Cleveland Clinic Lakewood Family Health Center',
      distance: '0.5 miles',
      address: '14601 Detroit Ave, Lakewood, OH 44107',
      phone: '(216) 529-5000'
    },
    nearbyPlaces: [
      { name: 'Lakewood Park', type: 'park', distance: '0.8 miles', address: '14532 Lake Ave' },
      { name: 'Giant Eagle', type: 'grocery', distance: '0.5 miles', address: '14100 Detroit Ave' },
      { name: 'Downtown Lakewood', type: 'restaurant', distance: '0.3 miles', address: 'Detroit Ave' }
    ],
    localDescription: 'Lakewood offers walkable urban living with lake views, vibrant local shops, and easy access to Cleveland\'s cultural amenities.'
  },
  'strongsville': {
    nearestHospital: {
      name: 'Southwest General Health Center',
      distance: '3 miles',
      address: '18697 Bagley Rd, Middleburg Heights, OH 44130',
      phone: '(440) 816-8000'
    },
    nearbyPlaces: [
      { name: 'Mill Stream Run Reservation', type: 'park', distance: '1.5 miles', address: '16200 Valley Pkwy' },
      { name: 'SouthPark Mall', type: 'grocery', distance: '1 mile', address: '500 Southpark Center' },
      { name: 'Giant Eagle', type: 'grocery', distance: '0.8 miles', address: '18400 Royalton Rd' }
    ],
    localDescription: 'Strongsville offers excellent schools, beautiful parks, and convenient shopping with a strong community feel for active seniors.'
  }
};

/**
 * Get neighborhood data for a community based on its city
 */
export function getNeighborhoodData(cityOrLocation: string): NeighborhoodData | null {
  // Extract city name from location string (e.g., "Brunswick, OH" -> "brunswick")
  const city = cityOrLocation.split(',')[0].trim().toLowerCase().replace(/\s+/g, '-');
  return neighborhoodData[city] || null;
}



