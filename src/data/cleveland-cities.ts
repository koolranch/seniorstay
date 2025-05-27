export interface CityInfo {
  name: string;
  slug: string;
  description: string;
  highlights: string[];
  nearbyHospitals: string[];
  averageCost?: {
    independentLiving: string;
    assistedLiving: string;
    memoryCare: string;
  };
  neighborhoods?: string[];
}

export const clevelandCitiesData: Record<string, CityInfo> = {
  'cleveland': {
    name: 'Cleveland',
    slug: 'cleveland',
    description: 'As Ohio\'s second-largest city, Cleveland offers diverse senior living options from urban high-rises to quiet residential communities. The city is home to world-renowned healthcare facilities and cultural attractions.',
    highlights: [
      'Home to Cleveland Clinic and University Hospitals',
      'Access to Playhouse Square and cultural district',
      'Lake Erie waterfront activities',
      'Public transportation via RTA',
      'Diverse dining and entertainment options'
    ],
    nearbyHospitals: [
      'Cleveland Clinic Main Campus',
      'University Hospitals Cleveland Medical Center',
      'MetroHealth Medical Center',
      'St. Vincent Charity Medical Center'
    ],
    neighborhoods: ['Downtown', 'University Circle', 'Tremont', 'Ohio City', 'Shaker Square']
  },
  
  'beachwood': {
    name: 'Beachwood',
    slug: 'beachwood',
    description: 'Beachwood is an upscale eastern suburb known for its shopping, dining, and high-quality senior living communities. The city offers a perfect blend of suburban tranquility and urban conveniences.',
    highlights: [
      'Legacy Village and Beachwood Place shopping',
      'Highly rated healthcare facilities nearby',
      'Beautiful parks and green spaces',
      'Active senior community programs',
      'Convenient to I-271 and I-480'
    ],
    nearbyHospitals: [
      'University Hospitals Ahuja Medical Center',
      'Cleveland Clinic - Beachwood Family Health',
      'Hillcrest Hospital (nearby Mayfield Heights)'
    ]
  },
  
  'shaker-heights': {
    name: 'Shaker Heights',
    slug: 'shaker-heights',
    description: 'Historic Shaker Heights combines architectural beauty with modern senior care facilities. This planned community offers tree-lined streets, beautiful homes, and excellent senior services.',
    highlights: [
      'Historic architecture and tree-lined streets',
      'Shaker Lakes and Nature Center',
      'RTA Rapid Transit access to downtown',
      'Highly rated city services',
      'Walkable Van Aken District'
    ],
    nearbyHospitals: [
      'University Hospitals Cleveland Medical Center',
      'Cleveland Clinic Main Campus',
      'VA Northeast Ohio Healthcare System'
    ],
    neighborhoods: ['Shaker Square', 'Van Aken District', 'Fernway', 'Moreland']
  },
  
  'westlake': {
    name: 'Westlake',
    slug: 'westlake',
    description: 'Westlake is a thriving western suburb offering modern senior living facilities with easy access to healthcare and shopping. The city is known for its excellent services and high quality of life.',
    highlights: [
      'Crocker Park mixed-use development',
      'St. John Medical Center on-site',
      'Excellent city recreation programs',
      'Low crime rates and safe neighborhoods',
      'Convenient highway access'
    ],
    nearbyHospitals: [
      'St. John Medical Center',
      'Cleveland Clinic Avon Hospital',
      'Fairview Hospital'
    ]
  },
  
  'independence': {
    name: 'Independence',
    slug: 'independence',
    description: 'Centrally located Independence offers convenient access to all of Greater Cleveland. The city features modern senior communities and is home to many medical offices and healthcare services.',
    highlights: [
      'Central location at I-77 and I-480',
      'Cleveland Clinic Independence Family Health Center',
      'Quiet residential neighborhoods',
      'Close to Cuyahoga Valley National Park',
      'Active senior center programs'
    ],
    nearbyHospitals: [
      'Cleveland Clinic Independence Family Health Center',
      'Parma Hospital',
      'Marymount Hospital'
    ]
  },
  
  'strongsville': {
    name: 'Strongsville',
    slug: 'strongsville',
    description: 'Strongsville offers a perfect balance of suburban comfort and accessibility. The city features several senior living communities with a range of care options in a family-friendly environment.',
    highlights: [
      'SouthPark Mall shopping',
      'Cleveland Metroparks nearby',
      'Strong community services',
      'Excellent emergency services',
      'Growing senior population with dedicated programs'
    ],
    nearbyHospitals: [
      'Southwest General Health Center',
      'Cleveland Clinic Strongsville Family Health',
      'Parma Hospital'
    ]
  }
}; 