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
    description: 'Historic Shaker Heights is home to premier assisted living and heritage retirement communities including The Woodlands by Heritage Retirement Communities. This planned community combines architectural beauty with modern senior care facilities, tree-lined streets, beautiful homes, and excellent senior services.',
    highlights: [
      'Heritage retirement communities with full continuum of care',
      'Historic architecture and tree-lined streets',
      'Shaker Lakes and Nature Center',
      'RTA Rapid Transit access to downtown Cleveland Clinic',
      'Highly rated city services and walkable Van Aken District'
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
    description: 'Rocky River is an affluent western suburb known for its excellent schools, parks, and quality of life. The city offers upscale senior living options with scenic views and top-notch amenities. Located along the shores of Lake Erie and adjacent to the Rocky River Reservation Metroparks, residents enjoy a perfect blend of natural beauty and urban convenience.',
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
    neighborhoods: ['Old Detroit Road', 'Wagar Beach', 'Parkwood', 'Downtown Rocky River'],
    averageCost: {
      independentLiving: '$3,000 - $5,200',
      assistedLiving: '$4,200 - $7,200',
      memoryCare: '$5,800 - $9,500'
    },
    testimonials: [
      {
        text: "The Metroparks right outside the door provide beautiful scenery and walking paths for residents. The staff at Bickford treats my mother like family.",
        author: "Susan B.",
        community: "Bickford of Rocky River"
      },
      {
        text: "As a Cleveland native, I thought I knew all the senior living options. I was wrong! They showed us communities I'd never heard of that were perfect for what we needed.",
        author: "Patricia L.",
        community: "Rocky River"
      },
      {
        text: "The memory care program at Sunrise has been wonderful for my father. The specialized dementia programming keeps him engaged and the staff really understands his needs.",
        author: "Michael R.",
        community: "Sunrise of Rocky River"
      },
      {
        text: "Moving mom to Rocky River was the best decision. She loves being close to the lake and the community activities keep her social and happy.",
        author: "Jennifer K.",
        community: "Rocky River assisted living"
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
  },
  
  'chagrin-falls': {
    name: 'Chagrin Falls',
    slug: 'chagrin-falls',
    description: 'Chagrin Falls is a picturesque village known for its historic downtown, stunning waterfall, and charming New England atmosphere. The area offers premium senior living options in a serene, upscale setting with easy access to Cleveland\'s east side amenities.',
    highlights: [
      'Historic downtown with waterfall centerpiece',
      'Luxury senior communities including Hamlet at Chagrin Falls',
      'Close to Chagrin Valley trails and parks',
      'Upscale dining and boutique shopping',
      'Strong sense of community and safety'
    ],
    nearbyHospitals: [
      'Hillcrest Hospital',
      'UH Ahuja Medical Center',
      'Cleveland Clinic Beachwood'
    ],
    averageCost: {
      independentLiving: '$3,500 - $6,000',
      assistedLiving: '$5,000 - $8,000',
      memoryCare: '$6,500 - $10,000'
    },
    testimonials: [
      {
        text: "The Hamlet at Chagrin Falls offers a resort-like experience. Mom loves the activities and the beautiful surroundings.",
        author: "Karen D.",
        community: "Hamlet at Chagrin Falls"
      },
      {
        text: "The village atmosphere makes visits feel special. We grab coffee downtown after seeing Dad.",
        author: "Tom R.",
        community: "Chagrin Falls area"
      }
    ]
  },
  
  'hudson': {
    name: 'Hudson',
    slug: 'hudson',
    description: 'Hudson is an affluent community known for its excellent schools, historic Western Reserve architecture, and high quality of life. The city offers upscale assisted living and memory care options in a safe, family-oriented environment.',
    highlights: [
      'Historic Western Reserve architecture',
      'Walkable downtown with shops and restaurants',
      'Near Cuyahoga Valley National Park',
      'Top-rated city services and safety',
      'Strong community programming for seniors'
    ],
    nearbyHospitals: [
      'Western Reserve Hospital',
      'Summa Health Akron Campus',
      'Cleveland Clinic Akron General'
    ],
    averageCost: {
      independentLiving: '$3,200 - $5,500',
      assistedLiving: '$4,500 - $7,500',
      memoryCare: '$6,000 - $9,500'
    },
    testimonials: [
      {
        text: "Hudson's walkable downtown means Dad can still enjoy independence while having care nearby.",
        author: "Michelle S.",
        community: "Hudson area"
      }
    ]
  },
  
  'richmond-heights': {
    name: 'Richmond Heights',
    slug: 'richmond-heights',
    description: 'Richmond Heights is a diverse east side community offering quality assisted living and memory care near major shopping and healthcare corridors. The city provides affordable options with excellent highway access.',
    highlights: [
      'Near Richmond Town Square shopping',
      'Easy I-271 and I-480 access',
      'Close to Hillcrest Hospital',
      'Diverse and welcoming community',
      'Affordable senior care options'
    ],
    nearbyHospitals: [
      'Hillcrest Hospital',
      'UH Ahuja Medical Center',
      'Cleveland Clinic Beachwood'
    ],
    averageCost: {
      independentLiving: '$2,400 - $4,000',
      assistedLiving: '$3,200 - $5,500',
      memoryCare: '$4,500 - $7,500'
    },
    testimonials: [
      {
        text: "The Winfield at Richmond Heights exceeded our expectations. The staff treats residents like family.",
        author: "Angela M.",
        community: "Winfield at Richmond Heights"
      }
    ]
  },
  
  'bedford': {
    name: 'Bedford',
    slug: 'bedford',
    description: 'Bedford is a historic community with deep roots in Cleveland\'s history. The city offers specialized assisted living and memory care options in a close-knit community setting, with no skilled nursing facilities - pure residential senior care.',
    highlights: [
      'Historic downtown with character',
      'Bedford Reservation Metroparks',
      'Specialized AL/MC communities',
      'Close-knit community atmosphere',
      'Convenient to I-271 and I-480'
    ],
    nearbyHospitals: [
      'Marymount Hospital',
      'Cleveland Clinic Hillcrest',
      'UH Bedford Medical Center'
    ],
    averageCost: {
      independentLiving: '$2,200 - $3,800',
      assistedLiving: '$3,000 - $5,200',
      memoryCare: '$4,200 - $7,000'
    },
    testimonials: [
      {
        text: "Light of Hearts Villa has been a blessing. The sisters and staff provide care with genuine compassion.",
        author: "Patricia N.",
        community: "Light of Hearts Villa"
      },
      {
        text: "Woodside Senior Living feels like home. The smaller size means personalized attention.",
        author: "Robert G.",
        community: "Woodside Senior Living"
      }
    ]
  },
  
  'macedonia': {
    name: 'Macedonia',
    slug: 'macedonia',
    description: 'Macedonia is a growing Summit County suburb offering quality assisted living options in a convenient location between Cleveland and Akron. The city provides easy highway access and a suburban atmosphere.',
    highlights: [
      'Convenient I-271 and I-480 access',
      'Growing retail and dining options',
      'Close to Cuyahoga Valley National Park',
      'Summit and Cuyahoga County border',
      'Family-oriented community'
    ],
    nearbyHospitals: [
      'Cleveland Clinic Macedonia Family Health Center',
      'Summa Health System',
      'University Hospitals Bedford Medical Center',
      'Cleveland Clinic Hillcrest'
    ],
    averageCost: {
      independentLiving: '$2,500 - $4,200',
      assistedLiving: '$3,400 - $5,800',
      memoryCare: '$4,800 - $8,000'
    },
    testimonials: [
      {
        text: "Summit Point has been wonderful for Mom. The location between Cleveland and Akron makes it easy for family to visit.",
        author: "David L.",
        community: "Summit Point Macedonia"
      },
      {
        text: "American House Macedonia offers great value with caring staff. Dad loves the activities.",
        author: "Susan M.",
        community: "American House Macedonia"
      }
    ]
  },
  
  'avon': {
    name: 'Avon',
    slug: 'avon',
    description: 'Avon is an affluent western suburb in Lorain County known for its excellent schools, safe neighborhoods, and the Avon Commons shopping area. The city offers upscale memory care options for families seeking quality dementia care.',
    highlights: [
      'Avon Commons premier shopping',
      'Excellent city services and safety',
      'Close to I-90 for easy access',
      'Growing medical corridor',
      'Family-friendly atmosphere'
    ],
    nearbyHospitals: [
      'UH Avon Rehabilitation Hospital',
      'Cleveland Clinic Avon Hospital',
      'UH St. John Medical Center',
      'Mercy Regional Medical Center'
    ],
    averageCost: {
      independentLiving: '$2,800 - $4,500',
      assistedLiving: '$3,800 - $6,200',
      memoryCare: '$5,500 - $9,000'
    },
    testimonials: [
      {
        text: "Ganzhorn Suites provides exceptional memory care. The specialized dementia programming gives us peace of mind.",
        author: "Jennifer W.",
        community: "Ganzhorn Suites of Avon"
      }
    ]
  },
  
  'brunswick': {
    name: 'Brunswick',
    slug: 'brunswick',
    description: 'Brunswick is a thriving Medina County city offering affordable senior living options with convenient access to both Cleveland and Akron. The city features excellent parks and a strong sense of community.',
    highlights: [
      'Affordable housing options',
      'Brunswick Lake and parks',
      'Close to I-71 and Route 303',
      'Strong community programming',
      'Medina County seat access'
    ],
    nearbyHospitals: [
      'Southwest General Health Center',
      'Cleveland Clinic Medina Hospital',
      'UH Parma Medical Center',
      'Akron General Medical Center'
    ],
    averageCost: {
      independentLiving: '$2,200 - $3,800',
      assistedLiving: '$3,200 - $5,400',
      memoryCare: '$4,400 - $7,200'
    },
    testimonials: [
      {
        text: "Danbury Brunswick offers everything we needed - IL, AL, and memory care all in one place as Dad's needs changed.",
        author: "Mark T.",
        community: "Danbury Senior Living Brunswick"
      }
    ]
  },
  
  'berea': {
    name: 'Berea',
    slug: 'berea',
    description: 'Berea is a charming southwest suburb known as the home of Baldwin Wallace University. This tight-knit community offers affordable senior living options with easy access to Cleveland Metroparks and quality healthcare.',
    highlights: [
      'Home to Baldwin Wallace University',
      'Cleveland Metroparks Rocky River Reservation nearby',
      'Affordable cost of living',
      'Historic downtown with local shops and dining',
      'Easy I-71 access to Cleveland and Akron'
    ],
    nearbyHospitals: [
      'Southwest General Health Center',
      'UH St. John Medical Center',
      'Cleveland Clinic Fairview Hospital',
      'MetroHealth Medical Center'
    ],
    averageCost: {
      independentLiving: '$2,200 - $3,800',
      assistedLiving: '$3,200 - $5,500',
      memoryCare: '$4,500 - $7,500'
    },
    testimonials: [
      {
        text: "The smaller-town feel of Berea combined with proximity to Cleveland's hospitals made it the right choice for our family.",
        author: "Nancy D.",
        community: "Berea senior community"
      }
    ]
  },
  
  'akron': {
    name: 'Akron',
    slug: 'akron',
    description: 'Akron, the Rubber City, is Summit County\'s largest city with 15+ senior living communities. Home to Summa Health and Akron General, Akron offers diverse and affordable care options from urban facilities to quiet suburban settings.',
    highlights: [
      'Home to Summa Health System and Akron General',
      'Affordable cost of living compared to Cleveland proper',
      'Cuyahoga Valley National Park nearby',
      'University of Akron and cultural amenities',
      'Strong public transportation via METRO RTA'
    ],
    nearbyHospitals: [
      'Summa Health Akron Campus',
      'Cleveland Clinic Akron General',
      'Akron Children\'s Hospital',
      'Western Reserve Hospital'
    ],
    averageCost: {
      independentLiving: '$2,000 - $3,500',
      assistedLiving: '$3,000 - $5,200',
      memoryCare: '$4,200 - $7,000'
    },
    testimonials: [
      {
        text: "Akron offers great value for senior care. The proximity to Cuyahoga Valley National Park is a wonderful bonus for family outings.",
        author: "Carol T.",
        community: "Akron senior community"
      }
    ]
  },
  
  'medina': {
    name: 'Medina',
    slug: 'medina',
    description: 'Medina is a charming county seat known for its historic town square and strong community values. With 9 senior living communities, it offers a small-town atmosphere with easy access to Cleveland and Akron healthcare systems.',
    highlights: [
      'Historic Medina Square with shops and dining',
      'Medina County seat with excellent services',
      'Cleveland Clinic Medina Hospital',
      'Beautiful parks and recreational areas',
      'Easy I-71 access to Cleveland and Akron'
    ],
    nearbyHospitals: [
      'Cleveland Clinic Medina Hospital',
      'Summa Health Wadsworth-Rittman',
      'Southwest General Health Center'
    ],
    averageCost: {
      independentLiving: '$2,100 - $3,600',
      assistedLiving: '$3,100 - $5,300',
      memoryCare: '$4,400 - $7,200'
    },
    testimonials: [
      {
        text: "The small-town charm of Medina combined with modern healthcare makes it ideal for our parents.",
        author: "Steven R.",
        community: "Medina senior community"
      }
    ]
  },
  
  'cuyahoga-falls': {
    name: 'Cuyahoga Falls',
    slug: 'cuyahoga-falls',
    description: 'Cuyahoga Falls is a vibrant Summit County city bordering Akron with 8 senior living communities. Known for its beautiful falls on the Cuyahoga River and proximity to Cuyahoga Valley National Park, it offers nature-rich senior living.',
    highlights: [
      'Cuyahoga River gorge and waterfall',
      'Adjacent to Cuyahoga Valley National Park',
      'Blossom Music Center nearby',
      'Strong community recreation programs',
      'Convenient to Akron healthcare'
    ],
    nearbyHospitals: [
      'Western Reserve Hospital',
      'Summa Health Akron Campus',
      'Cleveland Clinic Akron General'
    ],
    averageCost: {
      independentLiving: '$2,100 - $3,600',
      assistedLiving: '$3,200 - $5,400',
      memoryCare: '$4,500 - $7,500'
    },
    testimonials: [
      {
        text: "The natural beauty around Cuyahoga Falls makes every day feel like a retreat. Mom loves the park views.",
        author: "Janet P.",
        community: "Cuyahoga Falls senior community"
      }
    ]
  },
  
  'middleburg-heights': {
    name: 'Middleburg Heights',
    slug: 'middleburg-heights',
    description: 'Middleburg Heights is a centrally located southwest suburb with 6 senior living communities. Its convenient position near I-71 and I-480 provides easy access to hospitals, shopping, and family throughout Greater Cleveland.',
    highlights: [
      'Central location at I-71 and I-480 interchange',
      'Southwest General Health Center nearby',
      'Southland Shopping Center',
      'Strong community services',
      'Safe residential neighborhoods'
    ],
    nearbyHospitals: [
      'Southwest General Health Center',
      'Cleveland Clinic Fairview Hospital',
      'UH Parma Medical Center'
    ],
    averageCost: {
      independentLiving: '$2,300 - $4,000',
      assistedLiving: '$3,300 - $5,700',
      memoryCare: '$4,700 - $7,800'
    },
    testimonials: [
      {
        text: "The central location means all of our family can visit easily, no matter which side of Cleveland they live on.",
        author: "Frank M.",
        community: "Middleburg Heights senior community"
      }
    ]
  },
  
  'stow': {
    name: 'Stow',
    slug: 'stow',
    description: 'Stow is a family-friendly Summit County city with 5 senior living communities. Known for its excellent parks system and proximity to both Cuyahoga Valley National Park and Akron healthcare, it offers a peaceful suburban setting.',
    highlights: [
      'Adjacent to Cuyahoga Valley National Park',
      'Excellent Stow-Munroe Falls school district',
      'Silver Springs Park and recreation',
      'Close to Akron healthcare corridor',
      'Growing retail and dining options'
    ],
    nearbyHospitals: [
      'Western Reserve Hospital',
      'Summa Health Akron Campus',
      'Cleveland Clinic Akron General'
    ],
    averageCost: {
      independentLiving: '$2,200 - $3,800',
      assistedLiving: '$3,200 - $5,500',
      memoryCare: '$4,500 - $7,500'
    },
    testimonials: [
      {
        text: "Stow's peaceful atmosphere and beautiful parks make it a wonderful place for senior living.",
        author: "Barbara K.",
        community: "Stow senior community"
      }
    ]
  },
  
  'chardon': {
    name: 'Chardon',
    slug: 'chardon',
    description: 'Chardon is the Geauga County seat, known for its charming town square and rural character. With 4 senior living communities, it offers a quieter pace of life while maintaining access to Cleveland\'s healthcare systems.',
    highlights: [
      'Charming historic town square',
      'Geauga County seat with excellent services',
      'Maple syrup capital of Ohio',
      'Beautiful rural and wooded landscapes',
      'Close to Lake County healthcare'
    ],
    nearbyHospitals: [
      'UH Geauga Medical Center',
      'Lake Health TriPoint Medical Center',
      'Cleveland Clinic Hillcrest Hospital'
    ],
    averageCost: {
      independentLiving: '$2,000 - $3,500',
      assistedLiving: '$3,000 - $5,200',
      memoryCare: '$4,200 - $7,000'
    },
    testimonials: [
      {
        text: "The peaceful, rural setting of Chardon is exactly what Dad wanted. He loves the slower pace and friendly community.",
        author: "Mary W.",
        community: "Chardon senior community"
      }
    ]
  },
  
  'north-ridgeville': {
    name: 'North Ridgeville',
    slug: 'north-ridgeville',
    description: 'North Ridgeville is one of the fastest-growing cities in Lorain County with 4 senior living communities. Its location along I-480 and Route 83 provides convenient access to both Cleveland and Elyria healthcare.',
    highlights: [
      'One of Ohio\'s fastest-growing cities',
      'Convenient I-480 and Route 83 access',
      'Growing retail and dining corridor',
      'Safe residential neighborhoods',
      'Strong community programs'
    ],
    nearbyHospitals: [
      'UH St. John Medical Center',
      'Cleveland Clinic Avon Hospital',
      'UH Elyria Medical Center'
    ],
    averageCost: {
      independentLiving: '$2,300 - $4,000',
      assistedLiving: '$3,200 - $5,500',
      memoryCare: '$4,500 - $7,500'
    },
    testimonials: [
      {
        text: "North Ridgeville gives us the best of both worlds — suburban quiet with easy access to Cleveland hospitals.",
        author: "Dennis H.",
        community: "North Ridgeville senior community"
      }
    ]
  },
  
  'lorain': {
    name: 'Lorain',
    slug: 'lorain',
    description: 'Lorain is a diverse Lake Erie port city and Lorain County seat with 4 senior living communities. It offers affordable senior care options with waterfront living and a rich multicultural heritage.',
    highlights: [
      'Lake Erie waterfront and Lakeview Park',
      'Lorain County seat with full services',
      'Diverse multicultural community',
      'Affordable cost of living',
      'Rich industrial and maritime heritage'
    ],
    nearbyHospitals: [
      'UH Elyria Medical Center',
      'Mercy Regional Medical Center',
      'Cleveland Clinic Avon Hospital'
    ],
    averageCost: {
      independentLiving: '$1,800 - $3,200',
      assistedLiving: '$2,800 - $4,800',
      memoryCare: '$4,000 - $6,500'
    },
    testimonials: [
      {
        text: "The waterfront setting and affordable pricing made Lorain a great choice for our family.",
        author: "Rosa M.",
        community: "Lorain senior community"
      }
    ]
  },
  
  'euclid': {
    name: 'Euclid',
    slug: 'euclid',
    description: 'Euclid is a diverse east-side suburb with 4 senior living communities along the Lake Erie shore. Its location provides convenient access to Cleveland Clinic and University Hospitals east-side campuses.',
    highlights: [
      'Lake Erie shoreline and Sims Park',
      'Euclid Avenue historic corridor',
      'Convenient to Cleveland Clinic east-side',
      'Shore Cultural Centre activities',
      'Affordable east-side option'
    ],
    nearbyHospitals: [
      'Cleveland Clinic Euclid Hospital',
      'UH Richmond Medical Center',
      'Cleveland Clinic Hillcrest Hospital'
    ],
    averageCost: {
      independentLiving: '$2,000 - $3,500',
      assistedLiving: '$3,000 - $5,000',
      memoryCare: '$4,200 - $7,000'
    },
    testimonials: [
      {
        text: "Having Euclid Hospital right here in the neighborhood gives us peace of mind for Mom's care.",
        author: "James L.",
        community: "Euclid senior community"
      }
    ]
  },
  
  'tallmadge': {
    name: 'Tallmadge',
    slug: 'tallmadge',
    description: 'Tallmadge is a historic Summit County city with 4 senior living communities, known for its New England-style town green. It offers a charming small-town setting with convenient access to Akron healthcare.',
    highlights: [
      'Historic New England-style town circle',
      'Close to Akron healthcare systems',
      'Strong community programming',
      'Safe residential neighborhoods',
      'Convenient to I-76 and Route 91'
    ],
    nearbyHospitals: [
      'Summa Health Akron Campus',
      'Cleveland Clinic Akron General',
      'Western Reserve Hospital'
    ],
    averageCost: {
      independentLiving: '$2,100 - $3,600',
      assistedLiving: '$3,100 - $5,300',
      memoryCare: '$4,400 - $7,200'
    },
    testimonials: [
      {
        text: "Tallmadge's small-town atmosphere and historic charm make it a wonderful place for Dad to enjoy his retirement.",
        author: "Lisa G.",
        community: "Tallmadge senior community"
      }
    ]
  },
  
  'mentor': {
    name: 'Mentor',
    slug: 'mentor',
    description: 'Mentor is the largest city in Lake County, offering diverse senior living options from assisted living to memory care. The city features the Great Lakes Mall, numerous parks, and excellent healthcare access.',
    highlights: [
      'Great Lakes Mall shopping',
      'Headlands Beach State Park',
      'Strong Lake County hospital system',
      'Diverse senior care options',
      'Growing medical corridor'
    ],
    nearbyHospitals: [
      'Lake Health TriPoint Medical Center',
      'Lake Health West Medical Center',
      'UH Mentor Health Center',
      'Cleveland Clinic Mentor'
    ],
    averageCost: {
      independentLiving: '$2,400 - $4,000',
      assistedLiving: '$3,400 - $5,600',
      memoryCare: '$4,600 - $7,800'
    },
    testimonials: [
      {
        text: "Danbury Mentor has been excellent. The memory care staff truly understands dementia and treats Mom with dignity.",
        author: "Carol B.",
        community: "Danbury Senior Living Mentor"
      },
      {
        text: "Vitalia Mentor offers a beautiful facility with compassionate care. The rehabilitation services were top-notch.",
        author: "James R.",
        community: "Vitalia Mentor"
      }
    ]
  }
}; 