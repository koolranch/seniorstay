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
  testimonials?: {
    text: string;
    author: string;
    community?: string;
  }[];
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
    neighborhoods: ['Downtown', 'University Circle', 'Tremont', 'Ohio City', 'Shaker Square'],
    averageCost: {
      independentLiving: '$2,500 - $4,500',
      assistedLiving: '$3,500 - $6,000',
      memoryCare: '$5,000 - $8,500'
    },
    testimonials: [
      {
        text: "The proximity to Cleveland Clinic was a major factor in our decision. The care has been exceptional.",
        author: "Sarah M.",
        community: "Downtown Cleveland"
      },
      {
        text: "We love the cultural activities available - from the Orchestra to the museums, there's always something to do.",
        author: "Robert K.",
        community: "University Circle"
      }
    ]
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
    ],
    averageCost: {
      independentLiving: '$3,000 - $5,500',
      assistedLiving: '$4,500 - $7,500',
      memoryCare: '$6,000 - $9,500'
    },
    testimonials: [
      {
        text: "The quality of care in Beachwood is outstanding. The staff truly cares about each resident.",
        author: "Linda P.",
        community: "Rose Senior Living"
      },
      {
        text: "Being close to shopping and restaurants while having top-notch medical care nearby gives us peace of mind.",
        author: "Michael T."
      }
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
    neighborhoods: ['Shaker Square', 'Van Aken District', 'Fernway', 'Moreland'],
    averageCost: {
      independentLiving: '$2,800 - $5,000',
      assistedLiving: '$4,000 - $7,000',
      memoryCare: '$5,500 - $9,000'
    },
    testimonials: [
      {
        text: "The beauty of Shaker Heights combined with excellent care makes this the perfect place for my mother.",
        author: "Jennifer R.",
        community: "StoryPoint Shaker Heights"
      },
      {
        text: "The Rapid transit access means our kids can visit easily from downtown. Location is everything!",
        author: "David and Carol S."
      }
    ]
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
    ],
    averageCost: {
      independentLiving: '$2,700 - $4,800',
      assistedLiving: '$3,800 - $6,500',
      memoryCare: '$5,200 - $8,800'
    },
    testimonials: [
      {
        text: "Having St. John Medical Center right here in Westlake has been a blessing for my husband's care.",
        author: "Patricia L.",
        community: "Westlake Village"
      }
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
    ],
    averageCost: {
      independentLiving: '$2,400 - $4,200',
      assistedLiving: '$3,400 - $5,800',
      memoryCare: '$4,800 - $8,000'
    },
    testimonials: [
      {
        text: "The central location makes it easy for family from all over Cleveland to visit.",
        author: "Thomas W.",
        community: "Independence community"
      }
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
    ],
    averageCost: {
      independentLiving: '$2,600 - $4,500',
      assistedLiving: '$3,600 - $6,200',
      memoryCare: '$5,000 - $8,500'
    },
    testimonials: [
      {
        text: "Southwest General is excellent, and the Metroparks give us beautiful places to walk with mom.",
        author: "Karen H.",
        community: "Strongsville area"
      }
    ]
  },
  
  'parma': {
    name: 'Parma',
    slug: 'parma',
    description: 'Parma is one of Ohio\'s largest suburbs, offering affordable senior living options with easy access to healthcare and amenities. The city has a strong Polish heritage and tight-knit community feel.',
    highlights: [
      'Parma Hospital and UH Parma Medical Center',
      'Multiple shopping centers and restaurants',
      'Excellent senior center programs',
      'Close to Cleveland Metroparks',
      'Affordable cost of living'
    ],
    nearbyHospitals: [
      'UH Parma Medical Center',
      'Parma Hospital',
      'Southwest General Health Center',
      'Cleveland Clinic Parma Family Health'
    ],
    neighborhoods: ['Old Brooklyn', 'Pleasant Valley', 'Ridgewood', 'State Road'],
    averageCost: {
      independentLiving: '$2,200 - $3,800',
      assistedLiving: '$3,200 - $5,500',
      memoryCare: '$4,500 - $7,500'
    },
    testimonials: [
      {
        text: "The combination of quality care and affordable pricing made Parma the perfect choice for us.",
        author: "Margaret F.",
        community: "Mount Alverna Village"
      },
      {
        text: "UH Parma is excellent and only minutes away. That peace of mind is priceless.",
        author: "Joseph K."
      }
    ]
  },
  
  'lakewood': {
    name: 'Lakewood',
    slug: 'lakewood',
    description: 'Lakewood is a vibrant, walkable community on Cleveland\'s west side with Lake Erie access. Known for its diverse population and active lifestyle, it offers quality senior care in an urban suburban setting.',
    highlights: [
      'Lake Erie waterfront and Lakewood Park',
      'Walkable downtown with shops and restaurants',
      'Lakewood Hospital legacy and strong healthcare',
      'RTA public transportation',
      'Active arts and culture scene'
    ],
    nearbyHospitals: [
      'Cleveland Clinic Lakewood Family Health Center',
      'Fairview Hospital',
      'MetroHealth Medical Center',
      'St. John Medical Center'
    ],
    averageCost: {
      independentLiving: '$2,400 - $4,200',
      assistedLiving: '$3,400 - $5,800',
      memoryCare: '$4,800 - $8,200'
    },
    testimonials: [
      {
        text: "The walkability of Lakewood means mom can still enjoy the neighborhood feel she's always loved.",
        author: "Emily R.",
        community: "Lakewood senior community"
      }
    ]
  },
  
  'seven-hills': {
    name: 'Seven Hills',
    slug: 'seven-hills',
    description: 'Seven Hills is a quiet residential suburb offering peaceful senior living communities with easy highway access to all of Cleveland. The city provides a safe, family-friendly environment.',
    highlights: [
      'Quiet residential neighborhoods',
      'Easy I-77 and I-480 access',
      'Low crime rates',
      'Close to shopping and dining',
      'Proximity to Cuyahoga Valley National Park'
    ],
    nearbyHospitals: [
      'Parma Hospital',
      'Cleveland Clinic Independence',
      'Southwest General Health Center',
      'MetroHealth Brecksville Health Center'
    ],
    averageCost: {
      independentLiving: '$2,500 - $4,300',
      assistedLiving: '$3,500 - $6,000',
      memoryCare: '$4,900 - $8,300'
    },
    testimonials: [
      {
        text: "Seven Hills offers the perfect balance - quiet and safe, but close to everything we need.",
        author: "Richard S.",
        community: "Vitalia Rockside"
      }
    ]
  },
  
  'rocky-river': {
    name: 'Rocky River',
    slug: 'rocky-river',
    description: 'Rocky River is an affluent western suburb known for its excellent schools, parks, and quality of life. The city offers upscale senior living options with scenic views and top-notch amenities.',
    highlights: [
      'Rocky River Reservation (Metroparks)',
      'Lake Erie access and marina',
      'Safe, walkable neighborhoods',
      'Excellent city services',
      'Close to Crocker Park and shopping'
    ],
    nearbyHospitals: [
      'Fairview Hospital',
      'St. John Medical Center',
      'Cleveland Clinic Fairview Hospital',
      'Lutheran Hospital'
    ],
    averageCost: {
      independentLiving: '$3,000 - $5,200',
      assistedLiving: '$4,200 - $7,200',
      memoryCare: '$5,800 - $9,500'
    },
    testimonials: [
      {
        text: "The Metroparks right outside the door provide beautiful scenery and walking paths for residents.",
        author: "Susan B.",
        community: "Bickford of Rocky River"
      }
    ]
  },
  
  'north-olmsted': {
    name: 'North Olmsted',
    slug: 'north-olmsted',
    description: 'North Olmsted is a growing western suburb offering modern senior living facilities with convenient shopping and healthcare access. The city balances suburban comfort with urban conveniences.',
    highlights: [
      'Great Northern Shopping Center',
      'Cleveland Metroparks close by',
      'I-480 access to all of Cleveland',
      'Strong community programs',
      'Affordable housing and services'
    ],
    nearbyHospitals: [
      'Southwest General Health Center',
      'Fairview Hospital',
      'St. John Medical Center',
      'Lutheran Hospital'
    ],
    averageCost: {
      independentLiving: '$2,400 - $4,100',
      assistedLiving: '$3,300 - $5,700',
      memoryCare: '$4,700 - $7,900'
    },
    testimonials: [
      {
        text: "The Great Northern area has everything - shopping, dining, and healthcare all within minutes.",
        author: "James P.",
        community: "North Olmsted community"
      }
    ]
  }
}; 