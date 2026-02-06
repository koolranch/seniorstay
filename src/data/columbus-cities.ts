import { CityInfo } from './cleveland-cities';

/**
 * ============================================================================
 * COLUMBUS CITIES DATA - Greater Columbus Metro Area
 * ============================================================================
 * City-specific information for Columbus regional pages.
 * Includes local healthcare, neighborhoods, and cost data.
 * ============================================================================
 */

export const columbusCitiesData: Record<string, CityInfo> = {
  'columbus': {
    name: 'Columbus',
    slug: 'columbus',
    description: 'As Ohio\'s capital and largest city, Columbus offers diverse senior living options from urban high-rises to quiet residential communities. The city is home to Ohio State University Wexner Medical Center and a thriving arts and culture scene.',
    highlights: [
      'Ohio State University Wexner Medical Center',
      'Short North Arts District and German Village',
      'Columbus Zoo and Aquarium',
      'COTA public transportation system',
      'Diverse dining and entertainment options'
    ],
    nearbyHospitals: [
      'Ohio State University Wexner Medical Center',
      'OhioHealth Riverside Methodist Hospital',
      'Mount Carmel East Hospital',
      'Grant Medical Center'
    ],
    neighborhoods: ['Short North', 'German Village', 'Clintonville', 'Grandview Heights', 'Victorian Village'],
    averageCost: {
      independentLiving: '$2,500 - $4,500',
      assistedLiving: '$3,500 - $6,000',
      memoryCare: '$5,000 - $8,000'
    },
    testimonials: [
      {
        text: "The proximity to Ohio State Wexner Medical Center was crucial for my father's care. Columbus has excellent healthcare options.",
        author: "Jennifer M.",
        community: "Downtown Columbus"
      },
      {
        text: "We love the cultural activities - from COSI to the Columbus Museum of Art, there's always something engaging to do.",
        author: "David K.",
        community: "Short North area"
      }
    ]
  },

  'dublin': {
    name: 'Dublin',
    slug: 'dublin',
    description: 'Dublin is an affluent northwestern suburb known for its Irish heritage, excellent schools, and high quality of life. The city features walkable Historic Dublin, award-winning parks, and easy access to premier healthcare facilities.',
    highlights: [
      'Historic Dublin with Irish heritage',
      'Dublin Arts Council and cultural events',
      'Award-winning parks and trails',
      'Top-rated schools and city services',
      'OhioHealth Dublin Methodist Hospital on-site'
    ],
    nearbyHospitals: [
      'OhioHealth Dublin Methodist Hospital',
      'Ohio State University Wexner Medical Center',
      'Mount Carmel St. Ann\'s',
      'OhioHealth Grady Memorial Hospital'
    ],
    neighborhoods: ['Historic Dublin', 'Bridge Park', 'Muirfield', 'Tartan Fields'],
    averageCost: {
      independentLiving: '$3,000 - $5,500',
      assistedLiving: '$4,500 - $7,500',
      memoryCare: '$6,000 - $9,500'
    },
    testimonials: [
      {
        text: "Sunrise of Dublin provides exceptional care in a beautiful setting. The staff treats residents like family.",
        author: "Patricia L.",
        community: "Sunrise of Dublin"
      },
      {
        text: "Having Dublin Methodist Hospital so close gives us peace of mind. The community programs keep Mom active and social.",
        author: "Robert H.",
        community: "Brookdale Muirfield"
      }
    ]
  },

  'westerville': {
    name: 'Westerville',
    slug: 'westerville',
    description: 'Westerville is a vibrant community known for Otterbein University and its charming Uptown district. The city offers excellent senior living options with strong community programming and convenient access to healthcare.',
    highlights: [
      'Charming Uptown Westerville shopping district',
      'Otterbein University campus and events',
      'Alum Creek State Park nearby',
      'Strong community programming for seniors',
      'Family-friendly atmosphere'
    ],
    nearbyHospitals: [
      'Mount Carmel St. Ann\'s',
      'OhioHealth Westerville Medical Campus',
      'Ohio State University Wexner Medical Center',
      'OhioHealth Riverside Methodist Hospital'
    ],
    neighborhoods: ['Uptown', 'Old Westerville', 'Genoa', 'Blendon Woods'],
    averageCost: {
      independentLiving: '$2,600 - $4,500',
      assistedLiving: '$3,800 - $6,500',
      memoryCare: '$5,200 - $8,500'
    },
    testimonials: [
      {
        text: "Danbury Westerville has been wonderful for Dad. The activities keep him engaged and the staff is incredibly caring.",
        author: "Susan T.",
        community: "Danbury Westerville"
      },
      {
        text: "The Gables offers a perfect balance of independence and care. Mom loves walking to Uptown shops.",
        author: "Michael R.",
        community: "The Gables of Westerville"
      }
    ]
  },

  'powell': {
    name: 'Powell',
    slug: 'powell',
    description: 'Powell is an affluent suburb known for the Columbus Zoo and Aquarium, excellent schools, and upscale neighborhoods. The city offers premium senior living communities in a safe, family-oriented environment.',
    highlights: [
      'Columbus Zoo and Aquarium',
      'Historic Downtown Powell',
      'Excellent city services and safety',
      'Award-winning parks and trails',
      'Close to Dublin Methodist Hospital'
    ],
    nearbyHospitals: [
      'OhioHealth Dublin Methodist Hospital',
      'OhioHealth Grady Memorial Hospital',
      'Ohio State University Wexner Medical Center',
      'Mount Carmel St. Ann\'s'
    ],
    averageCost: {
      independentLiving: '$3,200 - $5,500',
      assistedLiving: '$4,500 - $7,500',
      memoryCare: '$6,000 - $9,500'
    },
    testimonials: [
      {
        text: "StoryPoint Powell provides resort-like amenities with compassionate care. The memory care program is exceptional.",
        author: "Karen D.",
        community: "StoryPoint Powell"
      }
    ]
  },

  'upper-arlington': {
    name: 'Upper Arlington',
    slug: 'upper-arlington',
    description: 'Upper Arlington is a prestigious inner-ring suburb known for its tree-lined streets, excellent schools, and strong sense of community. The city offers upscale senior living options with convenient access to Ohio State and downtown Columbus.',
    highlights: [
      'Tree-lined streets and beautiful neighborhoods',
      'Close proximity to Ohio State campus',
      'Excellent city services',
      'Active senior programming',
      'Minutes from downtown Columbus'
    ],
    nearbyHospitals: [
      'Ohio State University Wexner Medical Center',
      'OhioHealth Riverside Methodist Hospital',
      'Mount Carmel West Hospital',
      'OhioHealth Grant Medical Center'
    ],
    neighborhoods: ['Tremont', 'Northwest', 'South of Lane'],
    averageCost: {
      independentLiving: '$3,000 - $5,200',
      assistedLiving: '$4,200 - $7,200',
      memoryCare: '$5,800 - $9,200'
    },
    testimonials: [
      {
        text: "The Coventry in Upper Arlington offers elegant surroundings with excellent care. It feels like home.",
        author: "Elizabeth M.",
        community: "The Coventry Senior Living"
      },
      {
        text: "Bickford of Upper Arlington provides personalized memory care. The staff really understands dementia.",
        author: "Thomas W.",
        community: "Bickford of Upper Arlington"
      }
    ]
  },

  'grove-city': {
    name: 'Grove City',
    slug: 'grove-city',
    description: 'Grove City is a growing southwestern suburb offering modern senior living facilities with convenient shopping and healthcare access. The city combines small-town charm with urban conveniences.',
    highlights: [
      'Grove City Town Center shopping',
      'Strong community events and festivals',
      'Easy I-71 and I-270 access',
      'Affordable housing options',
      'Mount Carmel Grove City nearby'
    ],
    nearbyHospitals: [
      'Mount Carmel Grove City',
      'OhioHealth Grant Medical Center',
      'Mount Carmel West Hospital',
      'Ohio State University Wexner Medical Center'
    ],
    averageCost: {
      independentLiving: '$2,400 - $4,000',
      assistedLiving: '$3,400 - $5,800',
      memoryCare: '$4,800 - $7,800'
    },
    testimonials: [
      {
        text: "StoryPoint Grove City exceeded our expectations. The community feel and care quality are outstanding.",
        author: "Nancy P.",
        community: "StoryPoint Grove City"
      },
      {
        text: "Brookdale Pinnacle provides excellent value with caring staff. Dad loves the activities.",
        author: "James K.",
        community: "Brookdale Pinnacle"
      }
    ]
  },

  'gahanna': {
    name: 'Gahanna',
    slug: 'gahanna',
    description: 'Gahanna is a vibrant eastern suburb known for Creekside Park and its walkable downtown district. The city offers quality senior living options with strong community connections.',
    highlights: [
      'Creekside Park and entertainment district',
      'Walkable downtown Gahanna',
      'Close to Port Columbus Airport',
      'Strong senior programming',
      'Excellent parks and recreation'
    ],
    nearbyHospitals: [
      'Mount Carmel East Hospital',
      'Ohio State University Wexner Medical Center',
      'OhioHealth Riverside Methodist Hospital',
      'Nationwide Children\'s Hospital'
    ],
    averageCost: {
      independentLiving: '$2,600 - $4,400',
      assistedLiving: '$3,600 - $6,200',
      memoryCare: '$5,000 - $8,200'
    },
    testimonials: [
      {
        text: "StoryPoint Gahanna Central offers beautiful facilities and compassionate staff. The Creekside area is wonderful for family visits.",
        author: "Linda S.",
        community: "StoryPoint Gahanna Central"
      }
    ]
  },

  'hilliard': {
    name: 'Hilliard',
    slug: 'hilliard',
    description: 'Hilliard is a western suburb known for its excellent schools, parks, and community spirit. The city offers quality senior living with convenient access to shopping and healthcare.',
    highlights: [
      'Historic Old Hilliard district',
      'Heritage Rail Trail for walking and biking',
      'Strong community programming',
      'Easy access to I-270',
      'Affordable cost of living'
    ],
    nearbyHospitals: [
      'OhioHealth Dublin Methodist Hospital',
      'Mount Carmel West Hospital',
      'OhioHealth Riverside Methodist Hospital',
      'Ohio State University Wexner Medical Center'
    ],
    averageCost: {
      independentLiving: '$2,500 - $4,200',
      assistedLiving: '$3,500 - $6,000',
      memoryCare: '$4,800 - $8,000'
    },
    testimonials: [
      {
        text: "Traditions of Hilliard offers wonderful care in a welcoming environment. The staff treats residents like family.",
        author: "Carol B.",
        community: "Traditions of Hilliard"
      }
    ]
  },

  'new-albany': {
    name: 'New Albany',
    slug: 'new-albany',
    description: 'New Albany is a planned community known for its Georgian architecture, beautiful landscapes, and high quality of life. The city offers premium senior living in an upscale, meticulously maintained environment.',
    highlights: [
      'Georgian-style architecture throughout',
      'New Albany Walking Classic trails',
      'Award-winning community planning',
      'Top-rated schools and services',
      'Growing healthcare corridor'
    ],
    nearbyHospitals: [
      'Mount Carmel St. Ann\'s',
      'Mount Carmel East Hospital',
      'Ohio State University Wexner Medical Center',
      'OhioHealth Riverside Methodist Hospital'
    ],
    averageCost: {
      independentLiving: '$3,500 - $6,000',
      assistedLiving: '$5,000 - $8,000',
      memoryCare: '$6,500 - $10,000'
    },
    testimonials: [
      {
        text: "The Avalon of New Albany offers luxury senior living at its finest. The attention to detail is remarkable.",
        author: "Margaret H.",
        community: "The Avalon of New Albany"
      }
    ]
  },

  'worthington': {
    name: 'Worthington',
    slug: 'worthington',
    description: 'Worthington is a charming inner-ring suburb known for its historic downtown, excellent schools, and vibrant arts scene. The city offers quality senior living with a strong sense of community.',
    highlights: [
      'Historic Downtown Worthington shopping',
      'Strong arts and culture scene',
      'Close to Ohio State campus',
      'Excellent city services',
      'Walkable neighborhoods'
    ],
    nearbyHospitals: [
      'OhioHealth Riverside Methodist Hospital',
      'Ohio State University Wexner Medical Center',
      'Mount Carmel St. Ann\'s',
      'OhioHealth Dublin Methodist Hospital'
    ],
    averageCost: {
      independentLiving: '$2,800 - $4,800',
      assistedLiving: '$4,000 - $6,800',
      memoryCare: '$5,500 - $8,800'
    },
    testimonials: [
      {
        text: "Bickford of Worthington provides personalized memory care with a home-like feel. The staff is exceptional.",
        author: "Richard G.",
        community: "Bickford of Worthington"
      }
    ]
  },

  'bexley': {
    name: 'Bexley',
    slug: 'bexley',
    description: 'Bexley is an affluent inner-ring suburb known as the "City of Homes." With tree-lined streets, Capital University, and a walkable downtown, Bexley offers an intimate community feel with quick access to downtown Columbus healthcare.',
    highlights: [
      'Capital University campus and events',
      'Walkable Main Street shopping and dining',
      'Beautiful tree-lined residential streets',
      'Minutes from downtown Columbus',
      'Strong community programming for all ages'
    ],
    nearbyHospitals: [
      'Mount Carmel East Hospital',
      'Ohio State University Wexner Medical Center',
      'OhioHealth Grant Medical Center',
      'Nationwide Children\'s Hospital'
    ],
    averageCost: {
      independentLiving: '$2,800 - $5,000',
      assistedLiving: '$4,000 - $7,000',
      memoryCare: '$5,500 - $9,000'
    },
    testimonials: [
      {
        text: "The walkability of Bexley and its close-knit community make it a wonderful place for senior living. Mom feels right at home.",
        author: "Andrea S.",
        community: "Bexley senior community"
      }
    ]
  }
};
