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
  },
  'chagrin-falls': {
    nearestHospital: {
      name: 'Hillcrest Hospital',
      distance: '5 miles',
      address: '6780 Mayfield Rd, Mayfield Heights, OH 44124',
      phone: '(440) 312-4500'
    },
    nearbyPlaces: [
      { name: 'Chagrin Falls Village', type: 'restaurant', distance: '0.5 miles', address: 'Main St' },
      { name: 'Heinen\'s Chagrin Falls', type: 'grocery', distance: '0.3 miles', address: '17 N Main St' },
      { name: 'CVS Pharmacy', type: 'pharmacy', distance: '0.4 miles', address: '99 N Main St' },
      { name: 'Riverside Park', type: 'park', distance: '0.2 miles', address: 'E Washington St' }
    ],
    localDescription: 'Chagrin Falls is a charming village with a historic waterfall, boutique shops, and a tight-knit community atmosphere perfect for seniors who appreciate small-town living with upscale amenities.'
  },
  'hudson': {
    nearestHospital: {
      name: 'Western Reserve Hospital',
      distance: '4 miles',
      address: '1900 23rd St, Cuyahoga Falls, OH 44223',
      phone: '(330) 971-7000'
    },
    nearbyPlaces: [
      { name: 'Hudson Village', type: 'restaurant', distance: '0.5 miles', address: 'Main St' },
      { name: 'Acme Fresh Market', type: 'grocery', distance: '0.8 miles', address: '95 E Streetsboro St' },
      { name: 'Hudson Springs Park', type: 'park', distance: '1 mile', address: '7095 Stow Rd' },
      { name: 'CVS Pharmacy', type: 'pharmacy', distance: '0.5 miles', address: '5307 Darrow Rd' }
    ],
    localDescription: 'Hudson is an affluent Western Reserve community with a walkable downtown, historic architecture, and a strong sense of community that appeals to seniors seeking an upscale, culturally-rich environment.'
  },
  'seven-hills': {
    nearestHospital: {
      name: 'UH Parma Medical Center',
      distance: '4 miles',
      address: '7007 Powers Blvd, Parma, OH 44129',
      phone: '(440) 743-3000'
    },
    nearbyPlaces: [
      { name: 'Rockside Road Shopping', type: 'grocery', distance: '1 mile', address: 'Rockside Rd' },
      { name: 'Cuyahoga Valley National Park', type: 'park', distance: '5 miles', address: 'Canal Rd' },
      { name: 'Giant Eagle', type: 'grocery', distance: '2 miles', address: '6939 W 130th St' },
      { name: 'CVS Pharmacy', type: 'pharmacy', distance: '1.5 miles', address: 'Rockside Rd' }
    ],
    localDescription: 'Seven Hills is a quiet, safe suburb with excellent highway access and proximity to the Rockside business corridor. Residents enjoy low crime rates and a family-oriented community.'
  },
  'richmond-heights': {
    nearestHospital: {
      name: 'Hillcrest Hospital',
      distance: '2 miles',
      address: '6780 Mayfield Rd, Mayfield Heights, OH 44124',
      phone: '(440) 312-4500'
    },
    nearbyPlaces: [
      { name: 'Richmond Town Square', type: 'grocery', distance: '1 mile', address: 'Richmond Rd' },
      { name: 'Heinen\'s', type: 'grocery', distance: '2 miles', address: '1929 S Green Rd' },
      { name: 'Legacy Village', type: 'restaurant', distance: '3 miles', address: '25001 Cedar Rd' },
      { name: 'CVS Pharmacy', type: 'pharmacy', distance: '1 mile', address: 'Richmond Rd' }
    ],
    localDescription: 'Richmond Heights offers easy access to Hillcrest Hospital and east side amenities. The diverse, welcoming community provides affordable options close to shopping and healthcare.'
  },
  'bedford': {
    nearestHospital: {
      name: 'Marymount Hospital',
      distance: '3 miles',
      address: '12300 McCracken Rd, Garfield Heights, OH 44125',
      phone: '(216) 581-0500'
    },
    nearbyPlaces: [
      { name: 'Bedford Reservation Metroparks', type: 'park', distance: '1 mile', address: 'Gorge Pkwy' },
      { name: 'Giant Eagle', type: 'grocery', distance: '1.5 miles', address: '685 Broadway Ave' },
      { name: 'Tinkers Creek Gorge', type: 'park', distance: '2 miles', address: 'Gorge Pkwy' },
      { name: 'CVS Pharmacy', type: 'pharmacy', distance: '1 mile', address: 'Broadway Ave' }
    ],
    localDescription: 'Bedford is a historic community offering intimate, specialized senior care near the beautiful Bedford Reservation Metroparks. The city focuses on assisted living and memory care without skilled nursing facilities.'
  },
  'macedonia': {
    nearestHospital: {
      name: 'Cleveland Clinic Macedonia Family Health',
      distance: '2 miles',
      address: '8001 Macedonia Commons Blvd, Macedonia, OH 44056',
      phone: '(330) 468-6500'
    },
    nearbyPlaces: [
      { name: 'Macedonia Commons', type: 'grocery', distance: '1 mile', address: 'Macedonia Commons Blvd' },
      { name: 'Giant Eagle', type: 'grocery', distance: '0.5 miles', address: '499 E Aurora Rd' },
      { name: 'CVS Pharmacy', type: 'pharmacy', distance: '1 mile', address: 'E Aurora Rd' },
      { name: 'Cuyahoga Valley National Park', type: 'park', distance: '5 miles', address: 'Canal Rd' }
    ],
    localDescription: 'Macedonia is a growing Summit County suburb offering convenient access to both Cleveland and Akron. The city provides quality assisted living options with excellent shopping and dining nearby.'
  },
  'avon': {
    nearestHospital: {
      name: 'Cleveland Clinic Avon Hospital',
      distance: '3 miles',
      address: '33300 Cleveland Clinic Blvd, Avon, OH 44011',
      phone: '(440) 695-5000'
    },
    nearbyPlaces: [
      { name: 'Avon Commons', type: 'grocery', distance: '1 mile', address: 'Chester Rd' },
      { name: 'Giant Eagle', type: 'grocery', distance: '1.5 miles', address: '35925 Detroit Rd' },
      { name: 'CVS Pharmacy', type: 'pharmacy', distance: '0.5 miles', address: 'Detroit Rd' },
      { name: 'Cashelmara Park', type: 'park', distance: '2 miles', address: 'Detroit Rd' }
    ],
    localDescription: 'Avon is an affluent western suburb in Lorain County known for its excellent schools and the Avon Commons shopping area. The city offers upscale memory care options with outstanding medical access.'
  },
  'mentor': {
    nearestHospital: {
      name: 'Lake Health TriPoint Medical Center',
      distance: '3 miles',
      address: '7590 Auburn Rd, Concord Township, OH 44077',
      phone: '(440) 354-2400'
    },
    nearbyPlaces: [
      { name: 'Great Lakes Mall', type: 'grocery', distance: '2 miles', address: '7850 Mentor Ave' },
      { name: 'Giant Eagle', type: 'grocery', distance: '1 mile', address: '9350 Mentor Ave' },
      { name: 'CVS Pharmacy', type: 'pharmacy', distance: '0.5 miles', address: 'Mentor Ave' },
      { name: 'Headlands Beach State Park', type: 'park', distance: '5 miles', address: '9601 Headlands Rd' }
    ],
    localDescription: 'Mentor is Lake County\'s largest city, offering diverse senior living options from assisted living to memory care. The city features excellent shopping, parks, and strong Lake Health medical access.'
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










