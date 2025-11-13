// Define the type for community data
export interface CommunityStaff {
  name: string;
  position: string;
}

export interface CommunityTestimonial {
  quote: string;
  author: string;
}

export interface Community {
  id: string;
  name: string;
  slug?: string; // URL slug for routing
  location: string;
  address?: string; // Full street address
  zip?: string; // 5-digit zip code
  coordinates?: {
    lat: number;
    lng: number;
  };
  images: string[];
  careTypes: string[];
  description?: string;
  amenities?: string[];
  staff?: {
    administrators: CommunityStaff[];
    caregivers: CommunityStaff[];
  };
  testimonials?: CommunityTestimonial[];
  rating?: number; // Optional rating property
  
  // CMS Certification and Official Data
  ccn?: string; // CMS Certification Number
  facilityType?: 'assisted-living' | 'skilled-nursing' | 'nursing-home' | 'memory-care';
  bedCount?: number;
  acceptsMedicare?: boolean;
  acceptsMedicaid?: boolean;
  
  // CMS Star Ratings (1-5)
  overallRating?: number;
  healthInspectionRating?: number;
  staffingRating?: number;
  qualityRating?: number;
  
  // Quality Flags
  abuseIcon?: boolean;
  specialFocusFacility?: boolean;
  lastInspectionDate?: string; // ISO date string
  
  // Source Tracking
  cmsLastUpdated?: string; // ISO datetime string
  careCompareUrl?: string;
  
  // Payer Mix (from cost reports, Phase 4)
  medicaidPercentage?: number;
}

// Export the community data
export const communityData: Community[] = [
  {
    id: "community-1",
    name: "The Woodlands by Heritage Retirement Communities",
    location: "Shaker Heights, OH",
    address: "16333 Chagrin Blvd, Shaker Heights, OH 44120",
    description: "The Woodlands by Heritage Retirement Communities offers a full continuum of care with independent living, assisted living, and memory care options. Our beautiful community features spacious apartments, chef-prepared dining, engaging activities, and a supportive environment.",
    careTypes: ["Independent Living", "Assisted Living", "Memory Care"],
    amenities: ["Fitness Center", "Swimming Pool", "Library", "Beauty Salon", "Restaurant-Style Dining"],
    coordinates: { lat: 41.4822, lng: -81.5697 },
    images: []  // Will use varied placeholders via getCommunityImage()
  },
  {
    id: "facility-1",
    name: "Westwood Place",
    location: "Cleveland, OH",
    address: "1375 W 25th St, Cleveland, OH 44113",
    coordinates: {
      lat: 41.4822,
      lng: -81.6697
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living"],
    amenities: ["24-Hour Staff", "Medication Management", "Restaurant-Style Dining", "Personal Care Assistance", "Social Activities", "Housekeeping Services", "Emergency Response System", "Transportation Services"],
    description: "Westwood Place provides personalized assisted living services in a comfortable environment. Our dedicated staff delivers 24-hour assistance with daily activities, medication management, and health monitoring while promoting dignity and independence."
  },
  {
    id: "facility-2",
    name: "Summit Point",
    location: "Macedonia, OH",
    address: "9633 Valley View Rd, Macedonia, OH 44056",
    coordinates: {
      lat: 41.3152,
      lng: -81.5045
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Independent Living", "Assisted Living", "Memory Care"],
    description: "Summit Point offers a full continuum of care with independent living, assisted living, and memory care options. Our beautiful community features spacious apartments, chef-prepared dining, engaging activities, and personalized care services tailored to each resident's unique needs and preferences."
  },
  {
    id: "facility-3",
    name: "Mount Alverna Village",
    location: "Parma, OH",
    address: "6765 State Rd, Parma, OH 44134",
    coordinates: {
      lat: 41.4048,
      lng: -81.7229
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Independent Living", "Assisted Living", "Memory Care", "Skilled Nursing", "Rehabilitation"],
    description: "Mount Alverna Village offers a full continuum of care with independent living, assisted living, and memory care options. Our beautiful community features spacious apartments, chef-prepared dining, engaging activities, and personalized care services tailored to each resident's unique needs and preferences."
  },
  {
    id: "facility-4",
    name: "Rose Senior Living at Beachwood",
    location: "Beachwood, OH",
    address: "23611 Harvard Rd, Beachwood, OH 44122",
    coordinates: {
      lat: 41.4639,
      lng: -81.5087
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Independent Living", "Assisted Living", "Memory Care"],
    description: "Rose Senior Living at Beachwood offers a full continuum of care with independent living, assisted living, and memory care options. Our beautiful community features spacious apartments, chef-prepared dining, engaging activities, and personalized care services tailored to each resident's unique needs and preferences."
  },
  {
    id: "facility-5",
    name: "Vitalia Rockside",
    location: "Seven Hills, OH",
    address: "6101 Lombardo Center, Seven Hills, OH 44131",
    coordinates: {
      lat: 41.3979,
      lng: -81.6756
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Independent Living", "Assisted Living", "Memory Care"],
    description: "Vitalia Rockside offers a full continuum of care with independent living, assisted living, and memory care options. Our beautiful community features spacious apartments, chef-prepared dining, engaging activities, and personalized care services tailored to each resident's unique needs and preferences."
  },
  {
    id: "facility-6",
    name: "StoryPoint Shaker Heights",
    location: "Shaker Heights, OH",
    address: "16300 Chagrin Blvd, Shaker Heights, OH 44120",
    coordinates: {
      lat: 41.4739,
      lng: -81.537
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Independent Living", "Assisted Living", "Memory Care"],
    description: "StoryPoint Shaker Heights offers a full continuum of care with independent living, assisted living, and memory care options. Our beautiful community features spacious apartments, chef-prepared dining, engaging activities, and personalized care services tailored to each resident's unique needs and preferences."
  },
  {
    id: "facility-7",
    name: "The Woodlands by Heritage Retirement Communities",
    location: "Shaker Heights, OH",
    address: "16333 Chagrin Blvd, Shaker Heights, OH 44120",
    coordinates: {
      lat: 41.4739,
      lng: -81.537
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Independent Living", "Assisted Living", "Memory Care"],
    description: "The Woodlands by Heritage Retirement Communities offers a full continuum of care with independent living, assisted living, and memory care options. Our beautiful community features spacious apartments, chef-prepared dining, engaging activities, and personalized care services tailored to each resident's unique needs and preferences."
  },
  {
    id: "facility-8",
    name: "Forest Hills Place",
    location: "Cleveland, OH",
    address: "3151 Mayfield Rd, Cleveland Heights, OH 44118",
    coordinates: {
      lat: 41.4822,
      lng: -81.6697
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living"],
    description: "Forest Hills Place provides personalized assisted living services in a comfortable environment. Our dedicated staff delivers 24-hour assistance with daily activities, medication management, and health monitoring while promoting dignity and independence."
  },
  {
    id: "facility-9",
    name: "Woodside Senior Living",
    location: "Bedford, OH",
    address: "19455 Rockside Rd, Bedford, OH 44146",
    coordinates: {
      lat: 41.3931,
      lng: -81.5368
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living"],
    description: "Woodside Senior Living provides personalized assisted living services in a comfortable environment. Our dedicated staff delivers 24-hour assistance with daily activities, medication management, and health monitoring while promoting dignity and independence."
  },
  {
    id: "facility-10",
    name: "Eliza Jennings",
    location: "Cleveland, OH",
    address: "10603 Detroit Ave, Cleveland, OH 44102 (main campus)",
    coordinates: {
      lat: 41.4821,
      lng: -81.6697
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Independent Living", "Assisted Living", "Skilled Nursing", "Rehabilitation"],
    description: "Eliza Jennings offers both independent and assisted living options in a vibrant community setting. Residents enjoy spacious apartments, restaurant-style dining, engaging activities, and access to personalized care services as their needs evolve."
  },
  {
    id: "facility-11",
    name: "Brooklyn Pointe Assisted Living and Memory Care",
    location: "Brooklyn, OH",
    address: "4800 Idlewood Dr, Brooklyn, OH 44144",
    coordinates: {
      lat: 41.4303,
      lng: -81.7468
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living", "Memory Care"],
    description: "Brooklyn Pointe Assisted Living and Memory Care provides compassionate assisted living and specialized memory care services in a supportive environment. Our dedicated care team offers 24-hour assistance, medication management, and innovative memory care programming to enhance quality of life for all residents."
  },
  {
    id: "facility-12",
    name: "HarborChase of Shaker Heights",
    location: "Shaker Heights, OH",
    address: "17050 Van Aken Blvd, Shaker Heights, OH 44120",
    coordinates: {
      lat: 41.474,
      lng: -81.537
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living", "Memory Care"],
    description: "HarborChase of Shaker Heights provides compassionate assisted living and specialized memory care services in a supportive environment. Our dedicated care team offers 24-hour assistance, medication management, and innovative memory care programming to enhance quality of life for all residents."
  },
  {
    id: "facility-13",
    name: "Marymount Place",
    location: "Garfield Heights, OH",
    address: "5100 Marymount Village Dr, Garfield Heights, OH 44125",
    coordinates: {
      lat: 41.4179,
      lng: -81.606
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living"],
    description: "Marymount Place provides personalized assisted living services in a comfortable environment. Our dedicated staff delivers 24-hour assistance with daily activities, medication management, and health monitoring while promoting dignity and independence."
  },
  {
    id: "facility-14",
    name: "Vista Springs Ravinia",
    location: "Independence, OH",
    address: "6046 Brecksville Rd, Independence, OH 44131",
    coordinates: {
      lat: 41.3976,
      lng: -81.6386
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living", "Memory Care"],
    description: "Vista Springs Ravinia provides compassionate assisted living and specialized memory care services in a supportive environment. Our dedicated care team offers 24-hour assistance, medication management, and innovative memory care programming to enhance quality of life for all residents."
  },
  {
    id: "facility-15",
    name: "Haven at Lakewood",
    location: "Lakewood, OH",
    address: "1341 Marlowe Ave, Lakewood, OH 44107",
    coordinates: {
      lat: 41.4824,
      lng: -81.7982
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living"],
    description: "Haven at Lakewood provides personalized assisted living services in a comfortable environment. Our dedicated staff delivers 24-hour assistance with daily activities, medication management, and health monitoring while promoting dignity and independence."
  },
  {
    id: "facility-16",
    name: "American House Macedonia",
    location: "Macedonia, OH",
    address: "8401 S Bedford Rd, Macedonia, OH 44056",
    coordinates: {
      lat: 41.3151,
      lng: -81.5045
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Independent Living", "Assisted Living"],
    description: "American House Macedonia offers both independent and assisted living options in a vibrant community setting. Residents enjoy spacious apartments, restaurant-style dining, engaging activities, and access to personalized care services as their needs evolve."
  },
  {
    id: "facility-17",
    name: "Arden Courts of Parma",
    location: "Parma, OH",
    address: "9205 W Sprague Rd, Parma, OH 44133",
    coordinates: {
      lat: 41.4048,
      lng: -81.7229
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living", "Memory Care"],
    description: "Arden Courts of Parma provides compassionate assisted living and specialized memory care services in a supportive environment. Our dedicated care team offers 24-hour assistance, medication management, and innovative memory care programming to enhance quality of life for all residents."
  },
  {
    id: "facility-18",
    name: "Berea Alzheimer's Care Center",
    location: "Berea, OH",
    address: "255 Front St, Berea, OH 44017",
    coordinates: {
      lat: 41.3662,
      lng: -81.8543
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living", "Memory Care"],
    description: "Berea Alzheimer's Care Center provides compassionate assisted living and specialized memory care services in a supportive environment. Our dedicated care team offers 24-hour assistance, medication management, and innovative memory care programming to enhance quality of life for all residents."
  },
  {
    id: "facility-19",
    name: "Bickford of Rocky River",
    location: "Rocky River, OH",
    address: "21600 Detroit Rd, Rocky River, OH 44116",
    coordinates: {
      lat: 41.4767,
      lng: -81.8423
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living", "Memory Care"],
    description: "Bickford of Rocky River provides compassionate assisted living and specialized memory care services in a supportive environment. Our dedicated care team offers 24-hour assistance, medication management, and innovative memory care programming to enhance quality of life for all residents."
  },
  {
    id: "facility-20",
    name: "Cardinal Court Alzheimer's Special Care Center",
    location: "Strongsville, OH",
    address: "18719 Drake Rd, Strongsville, OH 44136",
    coordinates: {
      lat: 41.3138,
      lng: -81.8365
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living", "Memory Care"],
    description: "Cardinal Court Alzheimer's Special Care Center provides compassionate assisted living and specialized memory care services in a supportive environment. Our dedicated care team offers 24-hour assistance, medication management, and innovative memory care programming to enhance quality of life for all residents."
  },
  {
    id: "facility-21",
    name: "Danbury Senior Living Brunswick",
    location: "Brunswick, OH",
    address: "3430 Brunswick Lake Pkwy, Brunswick, OH 44212",
    coordinates: {
      lat: 41.2383,
      lng: -81.8418
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Independent Living", "Assisted Living", "Memory Care"],
    description: "Danbury Senior Living Brunswick offers a full continuum of care with independent living, assisted living, and memory care options. Our beautiful community features spacious apartments, chef-prepared dining, engaging activities, and personalized care services tailored to each resident's unique needs and preferences."
  },
  {
    id: "facility-22",
    name: "Elmcroft of Sagamore Hills",
    location: "Northfield, OH",
    address: "997 W Aurora Rd, Northfield, OH 44067",
    coordinates: {
      lat: 41.3395,
      lng: -81.5285
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living", "Memory Care"],
    description: "Elmcroft of Sagamore Hills provides compassionate assisted living and specialized memory care services in a supportive environment. Our dedicated care team offers 24-hour assistance, medication management, and innovative memory care programming to enhance quality of life for all residents."
  },
  {
    id: "facility-23",
    name: "Kemper House Strongsville",
    location: "Strongsville, OH",
    address: "10890 Prospect Rd, Strongsville, OH 44149",
    coordinates: {
      lat: 41.3139,
      lng: -81.8365
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living", "Memory Care"],
    description: "Kemper House Strongsville provides compassionate assisted living and specialized memory care services in a supportive environment. Our dedicated care team offers 24-hour assistance, medication management, and innovative memory care programming to enhance quality of life for all residents."
  },
  {
    id: "facility-24",
    name: "Paramount Senior Living",
    location: "Middleburg Heights, OH",
    address: "15435 Bagley Rd, Middleburg Heights, OH 44130",
    coordinates: {
      lat: 41.3758,
      lng: -81.8143
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Independent Living", "Assisted Living"],
    description: "Paramount Senior Living offers both independent and assisted living options in a vibrant community setting. Residents enjoy spacious apartments, restaurant-style dining, engaging activities, and access to personalized care services as their needs evolve."
  },
  {
    id: "facility-25",
    name: "Sunrise of Westlake",
    location: "Westlake, OH",
    address: "27819 Center Ridge Rd, Westlake, OH 44145",
    coordinates: {
      lat: 41.4553,
      lng: -81.9178
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living", "Memory Care"],
    description: "Sunrise of Westlake provides compassionate assisted living and specialized memory care services in a supportive environment. Our dedicated care team offers 24-hour assistance, medication management, and innovative memory care programming to enhance quality of life for all residents."
  },
  {
    id: "facility-26",
    name: "The Grande at Middleburg Heights",
    location: "Middleburg Heights, OH",
    address: "7510 Pearl Rd, Middleburg Heights, OH 44130",
    coordinates: {
      lat: 41.3758,
      lng: -81.8143
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living"],
    description: "The Grande at Middleburg Heights provides personalized assisted living services in a comfortable environment. Our dedicated staff delivers 24-hour assistance with daily activities, medication management, and health monitoring while promoting dignity and independence."
  },
  {
    id: "facility-27",
    name: "The Grande at Westlake",
    location: "Westlake, OH",
    address: "28777 Detroit Rd, Westlake, OH 44145",
    coordinates: {
      lat: 41.4553,
      lng: -81.9179
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living"],
    description: "The Grande at Westlake provides personalized assisted living services in a comfortable environment. Our dedicated staff delivers 24-hour assistance with daily activities, medication management, and health monitoring while promoting dignity and independence."
  },
  {
    id: "facility-28",
    name: "Sunrise At Parma",
    location: "Parma, OH",
    address: "7766 Broadview Rd, Parma, OH 44134",
    coordinates: {
      lat: 41.4048,
      lng: -81.7228
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living", "Memory Care"],
    description: "Sunrise At Parma provides compassionate assisted living and specialized memory care services in a supportive environment. Our dedicated care team offers 24-hour assistance, medication management, and innovative memory care programming to enhance quality of life for all residents."
  },
  {
    id: "facility-29",
    name: "Legacy Place Parma",
    location: "Parma, OH",
    address: "7377 Ridge Rd, Parma, OH 44129",
    coordinates: {
      lat: 41.4048,
      lng: -81.7229
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living"],
    description: "Legacy Place Parma provides personalized assisted living services in a comfortable environment. Our dedicated staff delivers 24-hour assistance with daily activities, medication management, and health monitoring while promoting dignity and independence."
  },
  {
    id: "facility-30",
    name: "SHEVCHENKO MANOR",
    location: "Parma, OH",
    address: "2222 Westbrook Dr, Parma, OH 44134",
    coordinates: {
      lat: 41.4048,
      lng: -81.7229
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living"],
    description: "SHEVCHENKO MANOR provides personalized assisted living services in a comfortable environment. Our dedicated staff delivers 24-hour assistance with daily activities, medication management, and health monitoring while promoting dignity and independence."
  },
  {
    id: "facility-31",
    name: "StoryPoint Strongsville",
    location: "Strongsville, OH",
    address: "19205 Pearl Rd, Strongsville, OH 44136",
    coordinates: {
      lat: 41.3139,
      lng: -81.8365
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Independent Living", "Assisted Living", "Memory Care"],
    description: "StoryPoint Strongsville offers a full continuum of care with independent living, assisted living, and memory care options. Our beautiful community features spacious apartments, chef-prepared dining, engaging activities, and personalized care services tailored to each resident's unique needs and preferences."
  },
  {
    id: "facility-32",
    name: "Brookdale Westlake Village",
    location: "Westlake, OH",
    address: "28460 Westlake Village Dr, Westlake, OH 44145",
    coordinates: {
      lat: 41.4553,
      lng: -81.9179
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living", "Memory Care"],
    description: "Brookdale Westlake Village provides compassionate assisted living and specialized memory care services in a supportive environment. Our dedicated care team offers 24-hour assistance, medication management, and innovative memory care programming to enhance quality of life for all residents."
  },
  {
    id: "facility-33",
    name: "Brookdale Gardens at Westlake",
    location: "Westlake, OH",
    address: "27569 Detroit Rd, Westlake, OH 44145",
    coordinates: {
      lat: 41.4553,
      lng: -81.9179
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Independent Living"],
    description: "Brookdale Gardens at Westlake offers premium independent living for active seniors in a beautiful setting. Our community features spacious apartments, restaurant-style dining, engaging activities, and a wide range of amenities designed to support an active, maintenance-free lifestyle."
  },
  {
    id: "facility-34",
    name: "Fairmont of Westlake",
    location: "Westlake, OH",
    address: "27819 Center Ridge Rd, Westlake, OH 44145",
    coordinates: {
      lat: 41.4553,
      lng: -81.918
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living", "Memory Care"],
    description: "Fairmont of Westlake provides compassionate assisted living and specialized memory care services in a supportive environment. Our dedicated care team offers 24-hour assistance, medication management, and innovative memory care programming to enhance quality of life for all residents."
  },
  {
    id: "facility-35",
    name: "Light of Hearts Villa",
    location: "Bedford, OH",
    address: "283 Union St, Bedford, OH 44146",
    coordinates: {
      lat: 41.3931,
      lng: -81.5368
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living", "Memory Care"],
    description: "Light of Hearts Villa provides compassionate assisted living and specialized memory care services in a supportive environment. Our dedicated care team offers 24-hour assistance, medication management, and innovative memory care programming to enhance quality of life for all residents."
  },
  {
    id: "facility-36",
    name: "Arden Courts of Westlake",
    location: "Westlake, OH",
    address: "28400 Center Ridge Rd, Westlake, OH 44145",
    coordinates: {
      lat: 41.4553,
      lng: -81.9179
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living", "Memory Care"],
    description: "Arden Courts of Westlake provides compassionate assisted living and specialized memory care services in a supportive environment. Our dedicated care team offers 24-hour assistance, medication management, and innovative memory care programming to enhance quality of life for all residents."
  },
  {
    id: "facility-37",
    name: "Vitalia North Royalton",
    location: "North Royalton, OH",
    address: "8239 York Rd, North Royalton, OH 44133",
    coordinates: {
      lat: 41.3139,
      lng: -81.7248
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Independent Living", "Assisted Living", "Memory Care"],
    description: "Vitalia North Royalton offers a full continuum of care with independent living, assisted living, and memory care options. Our beautiful community features spacious apartments, chef-prepared dining, engaging activities, and personalized care services tailored to each resident's unique needs and preferences."
  },
  {
    id: "facility-38",
    name: "Vitalia Active Adult Community North Olmsted",
    location: "North Olmsted, OH",
    address: "29801 Lorain Rd, North Olmsted, OH 44070",
    coordinates: {
      lat: 41.4158,
      lng: -81.9235
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Independent Living"],
    description: "Vitalia Active Adult Community North Olmsted offers premium independent living for active seniors in a beautiful setting. Our community features spacious apartments, restaurant-style dining, engaging activities, and a wide range of amenities designed to support an active, maintenance-free lifestyle."
  },
  {
    id: "facility-39",
    name: "The Ganzhorn Suites of Avon",
    location: "Avon, OH",
    address: "33350 Colorado Ave, Avon, OH 44011",
    coordinates: {
      lat: 41.4517,
      lng: -82.0354
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living", "Memory Care"],
    description: "The Ganzhorn Suites of Avon provides compassionate assisted living and specialized memory care services in a supportive environment. Our dedicated care team offers 24-hour assistance, medication management, and innovative memory care programming to enhance quality of life for all residents."
  },
  {
    id: "facility-40",
    name: "Maplewood at Cuyahoga Falls",
    location: "Cuyahoga Falls, OH",
    address: "190 W Bath Rd, Cuyahoga Falls, OH 44223",
    coordinates: {
      lat: 41.1334,
      lng: -81.4844
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living", "Memory Care"],
    description: "Maplewood at Cuyahoga Falls provides compassionate assisted living and specialized memory care services in a supportive environment. Our dedicated care team offers 24-hour assistance, medication management, and innovative memory care programming to enhance quality of life for all residents."
  },
  {
    id: "facility-41",
    name: "Danbury Woods in Cuyahoga Falls",
    location: "Cuyahoga Falls, OH",
    address: "1691 Queens Gate Cir, Cuyahoga Falls, OH 44221",
    coordinates: {
      lat: 41.1335,
      lng: -81.4845
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living", "Memory Care"],
    description: "Danbury Woods in Cuyahoga Falls provides compassionate assisted living and specialized memory care services in a supportive environment. Our dedicated care team offers 24-hour assistance, medication management, and innovative memory care programming to enhance quality of life for all residents."
  },
  {
    id: "facility-42",
    name: "StoryPoint Medina",
    location: "Medina, OH",
    address: "100 High Point Dr, Medina, OH 44256",
    coordinates: {
      lat: 41.1434,
      lng: -81.8633
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Independent Living", "Assisted Living", "Memory Care"],
    description: "StoryPoint Medina offers a full continuum of care with independent living, assisted living, and memory care options. Our beautiful community features spacious apartments, chef-prepared dining, engaging activities, and personalized care services tailored to each resident's unique needs and preferences."
  },
  {
    id: "facility-43",
    name: "Brookdale Richmond Heights",
    location: "Richmond Heights, OH",
    address: "3 Homewood Way, Richmond Heights, OH 44143",
    coordinates: {
      lat: 41.562,
      lng: -81.5015
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living", "Memory Care"],
    description: "Brookdale Richmond Heights provides compassionate assisted living and specialized memory care services in a supportive environment. Our dedicated care team offers 24-hour assistance, medication management, and innovative memory care programming to enhance quality of life for all residents."
  },
  {
    id: "facility-44",
    name: "Waterford At Richmond Heights",
    location: "Richmond Heights, OH",
    address: "261 Richmond Rd, Richmond Heights, OH 44143",
    coordinates: {
      lat: 41.562,
      lng: -81.5015
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Independent Living", "Assisted Living"],
    description: "Waterford At Richmond Heights offers both independent and assisted living options in a vibrant community setting. Residents enjoy spacious apartments, restaurant-style dining, engaging activities, and access to personalized care services as their needs evolve."
  },
  {
    id: "facility-45",
    name: "South Franklin Circle",
    location: "Ohio, OH",
    address: "16575 S Franklin St, Chagrin Falls, OH 44023",
    coordinates: {
      lat: 41.4821,
      lng: -81.6697
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Independent Living", "Assisted Living", "Memory Care", "Skilled Nursing"],
    description: "South Franklin Circle offers a full continuum of care with independent living, assisted living, and memory care options. Our beautiful community features spacious apartments, chef-prepared dining, engaging activities, and personalized care services tailored to each resident's unique needs and preferences."
  },
  {
    id: "facility-46",
    name: "Maplewood at Chardon",
    location: "Chardon, OH",
    address: "12350 Bass Lake Rd, Chardon, OH 44024",
    coordinates: {
      lat: 41.5787,
      lng: -81.2013
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living", "Memory Care"],
    description: "Maplewood at Chardon provides compassionate assisted living and specialized memory care services in a supportive environment. Our dedicated care team offers 24-hour assistance, medication management, and innovative memory care programming to enhance quality of life for all residents."
  },
  {
    id: "facility-47",
    name: "The Winfield at Richmond Heights",
    location: "Richmond Heights, OH",
    address: "261 Richmond Rd, Richmond Heights, OH 44143",
    coordinates: {
      lat: 41.562,
      lng: -81.5015
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living", "Memory Care"],
    description: "The Winfield at Richmond Heights provides compassionate assisted living and specialized memory care services in a supportive environment. Our dedicated care team offers 24-hour assistance, medication management, and innovative memory care programming to enhance quality of life for all residents."
  },
  {
    id: "facility-48",
    name: "Saint Augustine Towers Assisted Living Residences",
    location: "Cleveland, OH",
    address: "7821 Lake Ave, Cleveland, OH 44102",
    coordinates: {
      lat: 41.4822,
      lng: -81.6697
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living"],
    description: "Saint Augustine Towers Assisted Living Residences provides personalized assisted living services in a comfortable environment. Our dedicated staff delivers 24-hour assistance with daily activities, medication management, and health monitoring while promoting dignity and independence."
  },
  {
    id: "facility-49",
    name: "Judson Manor",
    location: "Cleveland, OH",
    address: "1890 E 107th St, Cleveland, OH 44106",
    coordinates: {
      lat: 41.4822,
      lng: -81.6697
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Independent Living", "Assisted Living"],
    description: "Judson Manor offers both independent and assisted living options in a vibrant community setting. Residents enjoy spacious apartments, restaurant-style dining, engaging activities, and access to personalized care services as their needs evolve."
  },
  {
    id: "facility-50",
    name: "Rely's Adult Family Home",
    location: "Parma, OH",
    address: "7500 Big Creek Pkwy, Parma, OH 44130",
    coordinates: {
      lat: 41.4048,
      lng: -81.7229
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living"],
    description: "Rely's Adult Family Home provides personalized assisted living services in a comfortable environment. Our dedicated staff delivers 24-hour assistance with daily activities, medication management, and health monitoring while promoting dignity and independence."
  },
  {
    id: "facility-51",
    name: "Your Second Family",
    location: "Brooklyn, OH",
    address: "4667 Tiedeman Rd, Brooklyn, OH 44144",
    coordinates: {
      lat: 41.4303,
      lng: -81.7468
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living"],
    description: "Your Second Family provides personalized assisted living services in a comfortable environment. Our dedicated staff delivers 24-hour assistance with daily activities, medication management, and health monitoring while promoting dignity and independence."
  },
  {
    id: "facility-52",
    name: "O'Neill Healthcare Lakewood",
    location: "Lakewood, OH",
    address: "13900 Detroit Ave, Lakewood, OH 44107",
    coordinates: {
      lat: 41.4824,
      lng: -81.7982
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living", "Memory Care"],
    description: "O'Neill Healthcare Lakewood provides compassionate assisted living and specialized memory care services in a supportive environment. Our dedicated care team offers 24-hour assistance, medication management, and innovative memory care programming to enhance quality of life for all residents."
  },
  {
    id: "facility-53",
    name: "Danbury Senior Living Cuyahoga Falls",
    location: "Cuyahoga Falls, OH",
    address: "2645 Sackett Ave, Cuyahoga Falls, OH 44223",
    coordinates: {
      lat: 41.1335,
      lng: -81.4845
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living", "Memory Care"],
    description: "Danbury Senior Living Cuyahoga Falls provides quality senior living services in a comfortable, supportive environment. Our community offers personalized care plans, engaging activities, and a range of amenities to enhance quality of life for all residents."
  },
  {
    id: "facility-54",
    name: "Danbury Senior Living Mentor",
    location: "Mentor, OH",
    address: "9150 Lakeshore Blvd, Mentor, OH 44060",
    coordinates: {
      lat: 41.6661,
      lng: -81.3397
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living", "Memory Care"],
    description: "Danbury Senior Living Mentor provides compassionate assisted living and specialized memory care services in a supportive environment. Our dedicated care team offers 24-hour assistance, medication management, and innovative memory care programming to enhance quality of life for all residents."
  },
  {
    id: "facility-55",
    name: "Danbury Senior Living North Ridgeville",
    location: "North Ridgeville, OH",
    address: "33770 Bagley Rd, North Ridgeville, OH 44039",
    coordinates: {
      lat: 41.3892,
      lng: -82.019
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living", "Memory Care"],
    description: "Danbury Senior Living North Ridgeville provides compassionate assisted living and specialized memory care services in a supportive environment. Our dedicated care team offers 24-hour assistance, medication management, and innovative memory care programming to enhance quality of life for all residents."
  },
  {
    id: "facility-56",
    name: "Danbury Senior Living Wooster",
    location: "Wooster, OH",
    address: "939 Portage Rd, Wooster, OH 44691",
    coordinates: {
      lat: 40.8051,
      lng: -81.9351
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living", "Memory Care"],
    description: "Danbury Senior Living Wooster provides compassionate assisted living and specialized memory care services in a supportive environment. Our dedicated care team offers 24-hour assistance, medication management, and innovative memory care programming to enhance quality of life for all residents."
  },
  {
    id: "facility-57",
    name: "Brookdale Bath",
    location: "Akron, OH",
    address: "101 N Cleveland Massillon Rd, Akron, OH 44333",
    coordinates: {
      lat: 41.0814,
      lng: -81.5191
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living", "Memory Care"],
    description: "Brookdale Bath provides compassionate assisted living and specialized memory care services in a supportive environment. Our dedicated care team offers 24-hour assistance, medication management, and innovative memory care programming to enhance quality of life for all residents."
  },
  {
    id: "facility-58",
    name: "Brookdale Montrose",
    location: "Akron, OH",
    address: "4050 Jaclyns Way, Akron, OH 44333",
    coordinates: {
      lat: 41.0814,
      lng: -81.519
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living", "Memory Care"],
    description: "Brookdale Montrose provides compassionate assisted living and specialized memory care services in a supportive environment. Our dedicated care team offers 24-hour assistance, medication management, and innovative memory care programming to enhance quality of life for all residents."
  },
  {
    id: "facility-59",
    name: "Brookdale Medina South",
    location: "Medina, OH",
    address: "100 High Point Dr, Medina, OH 44256",
    coordinates: {
      lat: 41.1434,
      lng: -81.8632
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living", "Memory Care"],
    description: "Brookdale Medina South provides compassionate assisted living and specialized memory care services in a supportive environment. Our dedicated care team offers 24-hour assistance, medication management, and innovative memory care programming to enhance quality of life for all residents."
  },
  {
    id: "facility-60",
    name: "Brookdale Wickliffe",
    location: "Wickliffe, OH",
    address: "30630 Ridge Rd, Wickliffe, OH 44092",
    coordinates: {
      lat: 41.6042,
      lng: -81.4715
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living", "Memory Care"],
    description: "Brookdale Wickliffe provides compassionate assisted living and specialized memory care services in a supportive environment. Our dedicated care team offers 24-hour assistance, medication management, and innovative memory care programming to enhance quality of life for all residents."
  },
  {
    id: "facility-61",
    name: "Vitalia Mentor",
    location: "Mentor, OH",
    address: "8180 Mentor Hills Dr, Mentor, OH 44060",
    coordinates: {
      lat: 41.6661,
      lng: -81.3396
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Independent Living", "Assisted Living", "Memory Care"],
    description: "Vitalia Mentor offers a full continuum of care with independent living, assisted living, and memory care options. Our beautiful community features spacious apartments, chef-prepared dining, engaging activities, and personalized care services tailored to each resident's unique needs and preferences."
  },
  {
    id: "facility-62",
    name: "Vitalia Montrose",
    location: "Akron, OH",
    address: "4041 Heritage Center Dr, Akron, OH 44321",
    coordinates: {
      lat: 41.0814,
      lng: -81.519
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Independent Living", "Assisted Living", "Memory Care"],
    description: "Vitalia Montrose offers a full continuum of care with independent living, assisted living, and memory care options. Our beautiful community features spacious apartments, chef-prepared dining, engaging activities, and personalized care services tailored to each resident's unique needs and preferences."
  },
  {
    id: "facility-63",
    name: "Vitalia Solon",
    location: "Solon, OH",
    address: "6050 Kruse Dr, Solon, OH 44139",
    coordinates: {
      lat: 41.3897,
      lng: -81.441
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Independent Living", "Assisted Living", "Memory Care"],
    description: "Vitalia Solon offers a full continuum of care with independent living, assisted living, and memory care options. Our beautiful community features spacious apartments, chef-prepared dining, engaging activities, and personalized care services tailored to each resident's unique needs and preferences."
  },
  {
    id: "facility-64",
    name: "Vitalia Stow",
    location: "Stow, OH",
    address: "4291 Allen Rd, Stow, OH 44224",
    coordinates: {
      lat: 41.1595,
      lng: -81.4401
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Independent Living", "Assisted Living", "Memory Care"],
    description: "Vitalia Stow offers a full continuum of care with independent living, assisted living, and memory care options. Our beautiful community features spacious apartments, chef-prepared dining, engaging activities, and personalized care services tailored to each resident's unique needs and preferences."
  },
  {
    id: "facility-65",
    name: "StoryPoint Rockside",
    location: "Seven Hills, OH",
    address: "6100 Lombardo Center, Seven Hills, OH 44131",
    coordinates: {
      lat: 41.3978,
      lng: -81.6756
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Independent Living", "Assisted Living", "Memory Care"],
    description: "StoryPoint Rockside offers a full continuum of care with independent living, assisted living, and memory care options. Our beautiful community features spacious apartments, chef-prepared dining, engaging activities, and personalized care services tailored to each resident's unique needs and preferences."
  },
  {
    id: "facility-66",
    name: "StoryPoint Troy",
    location: "Troy, OH",
    address: "1840 Towne Park Dr, Troy, OH 45373",
    coordinates: {
      lat: 40.0392,
      lng: -84.2033
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living", "Memory Care"],
    description: "StoryPoint Troy provides compassionate assisted living and specialized memory care services in a supportive environment. Our dedicated care team offers 24-hour assistance, medication management, and innovative memory care programming to enhance quality of life for all residents."
  },
  {
    id: "facility-67",
    name: "Sunrise of Cuyahoga Falls",
    location: "Cuyahoga Falls, OH",
    address: "1500 State Rd, Cuyahoga Falls, OH 44223",
    coordinates: {
      lat: 41.1334,
      lng: -81.4845
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living", "Memory Care"],
    description: "Sunrise of Cuyahoga Falls provides compassionate assisted living and specialized memory care services in a supportive environment. Our dedicated care team offers 24-hour assistance, medication management, and innovative memory care programming to enhance quality of life for all residents."
  },
  {
    id: "facility-68",
    name: "Sunrise of Rocky River",
    location: "Rocky River, OH",
    address: "21600 Detroit Rd, Rocky River, OH 44116",
    coordinates: {
      lat: 41.4767,
      lng: -81.8422
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living", "Memory Care"],
    description: "Sunrise of Rocky River provides compassionate assisted living and specialized memory care services in a supportive environment. Our dedicated care team offers 24-hour assistance, medication management, and innovative memory care programming to enhance quality of life for all residents."
  },
  {
    id: "facility-69",
    name: "Sunrise of Shaker Heights",
    location: "Shaker Heights, OH",
    address: "16333 Chagrin Blvd, Shaker Heights, OH 44120",
    coordinates: {
      lat: 41.4739,
      lng: -81.537
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living", "Memory Care"],
    description: "Sunrise of Shaker Heights provides compassionate assisted living and specialized memory care services in a supportive environment. Our dedicated care team offers 24-hour assistance, medication management, and innovative memory care programming to enhance quality of life for all residents."
  },
  {
    id: "facility-70",
    name: "Sunrise of Poland",
    location: "Poland, OH",
    address: "335 W McKinley Way, Poland, OH 44514",
    coordinates: {
      lat: 41.0242,
      lng: -80.6145
    },
    images: [],  // Will use varied placeholders
    careTypes: ["Assisted Living", "Memory Care"],
    description: "Sunrise of Poland provides compassionate assisted living and specialized memory care services in a supportive environment. Our dedicated care team offers 24-hour assistance, medication management, and innovative memory care programming to enhance quality of life for all residents."
  }
];
