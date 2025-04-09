// Helper function to generate slug from name
function generateSlug(name: string, city: string, state: string): string {
  return `${name} ${city} ${state}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Helper function to parse services
function parseServices(services: string): string[] {
  return services.split(',').map(service => service.trim());
}

// Helper function to generate description
function generateDescription(name: string, services: string[]): string {
  const serviceList = services.join(', ');
  return `${name} offers a welcoming environment with ${serviceList.toLowerCase()} services, providing personalized care and support for residents in a comfortable, community-focused setting.`;
}

// Helper function to extract city and state from address
function extractLocation(address: string): { city: string; state: string } {
  const match = address.match(/, ([^,]+), ([A-Z]{2})/);
  if (match) {
    return {
      city: match[1].trim(),
      state: match[2].trim()
    };
  }
  return { city: '', state: '' };
}

// Helper function to determine type based on services
function determineType(services: string[]): string {
  if (services.includes('Independent Living') && services.includes('Assisted Living')) {
    return 'Continuing Care';
  } else if (services.includes('Independent Living')) {
    return 'Independent Living';
  } else if (services.includes('Assisted Living')) {
    return 'Assisted Living';
  } else if (services.includes('Memory Care')) {
    return 'Memory Care';
  }
  return 'Senior Living';
}

// Helper function to generate amenities based on services
function generateAmenities(services: string[]): string[] {
  const baseAmenities = [
    "24/7 Staff",
    "Housekeeping",
    "Transportation Services",
    "Emergency Response System",
    "Maintenance"
  ];

  type ServiceAmenities = {
    [key: string]: string[];
  };

  const serviceAmenities: ServiceAmenities = {
    "Independent Living": [
      "Fitness Center",
      "Swimming Pool",
      "Social Activities",
      "Library",
      "Game Room"
    ],
    "Assisted Living": [
      "Medication Management",
      "Personal Care Assistance",
      "Dining Services",
      "Activity Programs"
    ],
    "Memory Care": [
      "Secure Environment",
      "Specialized Care",
      "Memory-Enhancing Activities",
      "Family Support Programs"
    ]
  };

  let amenities = [...baseAmenities];
  services.forEach(service => {
    if (serviceAmenities[service]) {
      amenities = [...amenities, ...serviceAmenities[service]];
    }
  });

  return [...new Set(amenities)];
}

export interface Community {
  id: number;
  name: string;
  slug: string;
  address: string;
  city: string;
  state: string;
  type: string;
  services: string[];
  amenities: string[];
  rating: number;
  description: string;
  image: string;
  phone: string;
}

export const communities: Community[] = [
  {
    id: 1,
    name: "Westwood Place",
    slug: "westwood-place-cleveland-oh",
    address: "Cleveland, OH",
    city: "Cleveland",
    state: "OH",
    type: "Assisted Living",
    services: ["Assisted Living"],
    amenities: generateAmenities(["Assisted Living"]),
    rating: 4.2,
    description: generateDescription("Westwood Place", ["Assisted Living"]),
    image: "https://source.unsplash.com/random/800x600/?senior,living",
    phone: "(800) 555-1001"
  },
  {
    id: 2,
    name: "Summit Point",
    slug: "summit-point-macedonia-oh",
    address: "9633 Valley View Rd, Macedonia, OH 44056",
    city: "Macedonia",
    state: "OH",
    type: "Continuing Care",
    services: ["Independent Living", "Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Independent Living", "Assisted Living", "Memory Care"]),
    rating: 4.5,
    description: generateDescription("Summit Point", ["Independent Living", "Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,community",
    phone: "(800) 555-1002"
  },
  {
    id: 3,
    name: "Mount Alverna Village",
    slug: "mount-alverna-village-parma-oh",
    address: "6765 State Rd, Parma, OH 44134",
    city: "Parma",
    state: "OH",
    type: "Continuing Care",
    services: ["Independent Living", "Assisted Living", "Memory Care", "Skilled Nursing", "Rehabilitation"],
    amenities: generateAmenities(["Independent Living", "Assisted Living", "Memory Care"]),
    rating: 4.7,
    description: generateDescription("Mount Alverna Village", ["Independent Living", "Assisted Living", "Memory Care", "Skilled Nursing", "Rehabilitation"]),
    image: "https://source.unsplash.com/random/800x600/?retirement,home",
    phone: "(800) 555-1003"
  },
  {
    id: 4,
    name: "Rose Senior Living at Beachwood",
    slug: "rose-senior-living-beachwood-oh",
    address: "23611 Harvard Rd, Beachwood, OH 44122",
    city: "Beachwood",
    state: "OH",
    type: "Continuing Care",
    services: ["Independent Living", "Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Independent Living", "Assisted Living", "Memory Care"]),
    rating: 4.6,
    description: generateDescription("Rose Senior Living at Beachwood", ["Independent Living", "Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,residence",
    phone: "(800) 555-1004"
  },
  {
    id: 5,
    name: "Vitalia Rockside",
    slug: "vitalia-rockside-seven-hills-oh",
    address: "6101 Lombardo Center, Seven Hills, OH 44131",
    city: "Seven Hills",
    state: "OH",
    type: "Continuing Care",
    services: ["Independent Living", "Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Independent Living", "Assisted Living", "Memory Care"]),
    rating: 4.4,
    description: generateDescription("Vitalia Rockside", ["Independent Living", "Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,apartment",
    phone: "(800) 555-1005"
  },
  {
    id: 6,
    name: "StoryPoint Shaker Heights",
    slug: "storypoint-shaker-heights-shaker-heights-oh",
    address: "16300 Chagrin Blvd, Shaker Heights, OH 44120",
    city: "Shaker Heights",
    state: "OH",
    type: "Continuing Care",
    services: ["Independent Living", "Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Independent Living", "Assisted Living", "Memory Care"]),
    rating: 4.8,
    description: generateDescription("StoryPoint Shaker Heights", ["Independent Living", "Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,community",
    phone: "(800) 555-1006"
  },
  {
    id: 7,
    name: "The Woodlands by Heritage Retirement Communities",
    slug: "woodlands-heritage-retirement-shaker-heights-oh",
    address: "16333 Chagrin Blvd, Shaker Heights, OH 44120",
    city: "Shaker Heights",
    state: "OH",
    type: "Independent Living",
    services: ["Independent Living", "Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Independent Living", "Assisted Living", "Memory Care"]),
    rating: 4.5,
    description: generateDescription("The Woodlands by Heritage Retirement Communities", ["Independent Living", "Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?retirement,community",
    phone: "(800) 555-1007"
  },
  {
    id: 8,
    name: "Forest Hills Place",
    slug: "forest-hills-place-cleveland-oh",
    address: "3151 Mayfield Rd, Cleveland Heights, OH 44118",
    city: "Cleveland Heights",
    state: "OH",
    type: "Assisted Living",
    services: ["Assisted Living"],
    amenities: generateAmenities(["Assisted Living"]),
    rating: 4.3,
    description: generateDescription("Forest Hills Place", ["Assisted Living"]),
    image: "https://source.unsplash.com/random/800x600/?senior,living",
    phone: "(800) 555-1008"
  },
  {
    id: 9,
    name: "Woodside Senior Living",
    slug: "woodside-senior-living-bedford-oh",
    address: "19455 Rockside Rd, Bedford, OH 44146",
    city: "Bedford",
    state: "OH",
    type: "Assisted Living",
    services: ["Assisted Living"],
    amenities: generateAmenities(["Assisted Living"]),
    rating: 4.4,
    description: generateDescription("Woodside Senior Living", ["Assisted Living"]),
    image: "https://source.unsplash.com/random/800x600/?senior,residence",
    phone: "(800) 555-1009"
  },
  {
    id: 10,
    name: "Eliza Jennings",
    slug: "eliza-jennings-cleveland-oh",
    address: "10603 Detroit Ave, Cleveland, OH 44102",
    city: "Cleveland",
    state: "OH",
    type: "Continuing Care",
    services: ["Independent Living", "Assisted Living", "Skilled Nursing", "Rehabilitation"],
    amenities: generateAmenities(["Independent Living", "Assisted Living"]),
    rating: 4.7,
    description: generateDescription("Eliza Jennings", ["Independent Living", "Assisted Living", "Skilled Nursing", "Rehabilitation"]),
    image: "https://source.unsplash.com/random/800x600/?senior,community",
    phone: "(800) 555-1010"
  },
  {
    id: 11,
    name: "Brooklyn Pointe Assisted Living and Memory Care",
    slug: "brooklyn-pointe-assisted-living-brooklyn-oh",
    address: "4800 Idlewood Dr, Brooklyn, OH 44144",
    city: "Brooklyn",
    state: "OH",
    type: "Continuing Care",
    services: ["Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Assisted Living", "Memory Care"]),
    rating: 4.5,
    description: generateDescription("Brooklyn Pointe Assisted Living and Memory Care", ["Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,living",
    phone: "(800) 555-1011"
  },
  {
    id: 12,
    name: "HarborChase of Shaker Heights",
    slug: "harborchase-shaker-heights-shaker-heights-oh",
    address: "17050 Van Aken Blvd, Shaker Heights, OH 44120",
    city: "Shaker Heights",
    state: "OH",
    type: "Continuing Care",
    services: ["Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Assisted Living", "Memory Care"]),
    rating: 4.6,
    description: generateDescription("HarborChase of Shaker Heights", ["Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,residence",
    phone: "(800) 555-1012"
  },
  {
    id: 13,
    name: "Marymount Place",
    slug: "marymount-place-garfield-heights-oh",
    address: "5100 Marymount Village Dr, Garfield Heights, OH 44125",
    city: "Garfield Heights",
    state: "OH",
    type: "Assisted Living",
    services: ["Assisted Living"],
    amenities: generateAmenities(["Assisted Living"]),
    rating: 4.4,
    description: generateDescription("Marymount Place", ["Assisted Living"]),
    image: "https://source.unsplash.com/random/800x600/?senior,community",
    phone: "(800) 555-1013"
  },
  {
    id: 14,
    name: "Vista Springs Ravinia",
    slug: "vista-springs-ravinia-independence-oh",
    address: "6046 Brecksville Rd, Independence, OH 44131",
    city: "Independence",
    state: "OH",
    type: "Continuing Care",
    services: ["Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Assisted Living", "Memory Care"]),
    rating: 4.7,
    description: generateDescription("Vista Springs Ravinia", ["Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,living",
    phone: "(800) 555-1014"
  },
  {
    id: 15,
    name: "Haven at Lakewood",
    slug: "haven-at-lakewood-lakewood-oh",
    address: "1341 Marlowe Ave, Lakewood, OH 44107",
    city: "Lakewood",
    state: "OH",
    type: "Assisted Living",
    services: ["Assisted Living"],
    amenities: generateAmenities(["Assisted Living"]),
    rating: 4.3,
    description: generateDescription("Haven at Lakewood", ["Assisted Living"]),
    image: "https://source.unsplash.com/random/800x600/?senior,residence",
    phone: "(800) 555-1015"
  },
  {
    id: 16,
    name: "American House Macedonia",
    slug: "american-house-macedonia-macedonia-oh",
    address: "8401 S Bedford Rd, Macedonia, OH 44056",
    city: "Macedonia",
    state: "OH",
    type: "Continuing Care",
    services: ["Independent Living", "Assisted Living"],
    amenities: generateAmenities(["Independent Living", "Assisted Living"]),
    rating: 4.5,
    description: generateDescription("American House Macedonia", ["Independent Living", "Assisted Living"]),
    image: "https://source.unsplash.com/random/800x600/?senior,community",
    phone: "(800) 555-1016"
  },
  {
    id: 17,
    name: "Arden Courts of Parma",
    slug: "arden-courts-parma-parma-oh",
    address: "9205 W Sprague Rd, Parma, OH 44133",
    city: "Parma",
    state: "OH",
    type: "Memory Care",
    services: ["Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Assisted Living", "Memory Care"]),
    rating: 4.6,
    description: generateDescription("Arden Courts of Parma", ["Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,living",
    phone: "(800) 555-1017"
  },
  {
    id: 18,
    name: "Berea Alzheimer's Care Center",
    slug: "berea-alzheimers-care-center-berea-oh",
    address: "255 Front St, Berea, OH 44017",
    city: "Berea",
    state: "OH",
    type: "Memory Care",
    services: ["Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Assisted Living", "Memory Care"]),
    rating: 4.4,
    description: generateDescription("Berea Alzheimer's Care Center", ["Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,care",
    phone: "(800) 555-1018"
  },
  {
    id: 19,
    name: "Bickford of Rocky River",
    slug: "bickford-rocky-river-rocky-river-oh",
    address: "21600 Detroit Rd, Rocky River, OH 44116",
    city: "Rocky River",
    state: "OH",
    type: "Continuing Care",
    services: ["Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Assisted Living", "Memory Care"]),
    rating: 4.7,
    description: generateDescription("Bickford of Rocky River", ["Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,residence",
    phone: "(800) 555-1019"
  },
  {
    id: 20,
    name: "Cardinal Court Alzheimer's Special Care Center",
    slug: "cardinal-court-alzheimers-strongsville-oh",
    address: "18719 Drake Rd, Strongsville, OH 44136",
    city: "Strongsville",
    state: "OH",
    type: "Memory Care",
    services: ["Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Assisted Living", "Memory Care"]),
    rating: 4.5,
    description: generateDescription("Cardinal Court Alzheimer's Special Care Center", ["Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,care",
    phone: "(800) 555-1020"
  },
  {
    id: 21,
    name: "Danbury Senior Living Brunswick",
    slug: "danbury-senior-living-brunswick-brunswick-oh",
    address: "3430 Brunswick Lake Pkwy, Brunswick, OH 44212",
    city: "Brunswick",
    state: "OH",
    type: "Continuing Care",
    services: ["Independent Living", "Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Independent Living", "Assisted Living", "Memory Care"]),
    rating: 4.8,
    description: generateDescription("Danbury Senior Living Brunswick", ["Independent Living", "Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,community",
    phone: "(800) 555-1021"
  },
  {
    id: 22,
    name: "Elmcroft of Sagamore Hills",
    slug: "elmcroft-sagamore-hills-northfield-oh",
    address: "997 W Aurora Rd, Northfield, OH 44067",
    city: "Northfield",
    state: "OH",
    type: "Continuing Care",
    services: ["Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Assisted Living", "Memory Care"]),
    rating: 4.4,
    description: generateDescription("Elmcroft of Sagamore Hills", ["Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,living",
    phone: "(800) 555-1022"
  },
  {
    id: 23,
    name: "Kemper House Strongsville",
    slug: "kemper-house-strongsville-strongsville-oh",
    address: "10890 Prospect Rd, Strongsville, OH 44149",
    city: "Strongsville",
    state: "OH",
    type: "Continuing Care",
    services: ["Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Assisted Living", "Memory Care"]),
    rating: 4.6,
    description: generateDescription("Kemper House Strongsville", ["Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,residence",
    phone: "(800) 555-1023"
  },
  {
    id: 24,
    name: "Paramount Senior Living",
    slug: "paramount-senior-living-middleburg-heights-oh",
    address: "15435 Bagley Rd, Middleburg Heights, OH 44130",
    city: "Middleburg Heights",
    state: "OH",
    type: "Continuing Care",
    services: ["Independent Living", "Assisted Living"],
    amenities: generateAmenities(["Independent Living", "Assisted Living"]),
    rating: 4.5,
    description: generateDescription("Paramount Senior Living", ["Independent Living", "Assisted Living"]),
    image: "https://source.unsplash.com/random/800x600/?senior,community",
    phone: "(800) 555-1024"
  },
  {
    id: 25,
    name: "Sunrise of Westlake",
    slug: "sunrise-westlake-westlake-oh",
    address: "27819 Center Ridge Rd, Westlake, OH 44145",
    city: "Westlake",
    state: "OH",
    type: "Continuing Care",
    services: ["Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Assisted Living", "Memory Care"]),
    rating: 4.7,
    description: generateDescription("Sunrise of Westlake", ["Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,living",
    phone: "(800) 555-1025"
  },
  {
    id: 26,
    name: "The Grande at Middleburg Heights",
    slug: "grande-middleburg-heights-middleburg-heights-oh",
    address: "7510 Pearl Rd, Middleburg Heights, OH 44130",
    city: "Middleburg Heights",
    state: "OH",
    type: "Assisted Living",
    services: ["Assisted Living"],
    amenities: generateAmenities(["Assisted Living"]),
    rating: 4.4,
    description: generateDescription("The Grande at Middleburg Heights", ["Assisted Living"]),
    image: "https://source.unsplash.com/random/800x600/?senior,residence",
    phone: "(800) 555-1026"
  },
  {
    id: 27,
    name: "The Grande at Westlake",
    slug: "grande-westlake-westlake-oh",
    address: "28777 Detroit Rd, Westlake, OH 44145",
    city: "Westlake",
    state: "OH",
    type: "Assisted Living",
    services: ["Assisted Living"],
    amenities: generateAmenities(["Assisted Living"]),
    rating: 4.4,
    description: generateDescription("The Grande at Westlake", ["Assisted Living"]),
    image: "https://source.unsplash.com/random/800x600/?senior,residence",
    phone: "(800) 555-1027"
  },
  {
    id: 28,
    name: "Sunrise At Parma",
    slug: "sunrise-parma-parma-oh",
    address: "7766 Broadview Rd, Parma, OH 44134",
    city: "Parma",
    state: "OH",
    type: "Continuing Care",
    services: ["Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Assisted Living", "Memory Care"]),
    rating: 4.7,
    description: generateDescription("Sunrise At Parma", ["Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,living",
    phone: "(800) 555-1028"
  },
  {
    id: 29,
    name: "Legacy Place Parma",
    slug: "legacy-place-parma-parma-oh",
    address: "7377 Ridge Rd, Parma, OH 44129",
    city: "Parma",
    state: "OH",
    type: "Assisted Living",
    services: ["Assisted Living"],
    amenities: generateAmenities(["Assisted Living"]),
    rating: 4.3,
    description: generateDescription("Legacy Place Parma", ["Assisted Living"]),
    image: "https://source.unsplash.com/random/800x600/?senior,residence",
    phone: "(800) 555-1029"
  },
  {
    id: 30,
    name: "SHEVCHENKO MANOR",
    slug: "shevchenko-manor-parma-oh",
    address: "2222 Westbrook Dr, Parma, OH 44134",
    city: "Parma",
    state: "OH",
    type: "Assisted Living",
    services: ["Assisted Living"],
    amenities: generateAmenities(["Assisted Living"]),
    rating: 4.2,
    description: generateDescription("SHEVCHENKO MANOR", ["Assisted Living"]),
    image: "https://source.unsplash.com/random/800x600/?senior,living",
    phone: "(800) 555-1030"
  },
  {
    id: 31,
    name: "StoryPoint Strongsville",
    slug: "storypoint-strongsville-strongsville-oh",
    address: "19205 Pearl Rd, Strongsville, OH 44136",
    city: "Strongsville",
    state: "OH",
    type: "Continuing Care",
    services: ["Independent Living", "Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Independent Living", "Assisted Living", "Memory Care"]),
    rating: 4.8,
    description: generateDescription("StoryPoint Strongsville", ["Independent Living", "Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,community",
    phone: "(800) 555-1031"
  },
  {
    id: 32,
    name: "Brookdale Westlake Village",
    slug: "brookdale-westlake-village-westlake-oh",
    address: "28460 Westlake Village Dr, Westlake, OH 44145",
    city: "Westlake",
    state: "OH",
    type: "Continuing Care",
    services: ["Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Assisted Living", "Memory Care"]),
    rating: 4.6,
    description: generateDescription("Brookdale Westlake Village", ["Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,residence",
    phone: "(800) 555-1032"
  },
  {
    id: 33,
    name: "Brookdale Gardens at Westlake",
    slug: "brookdale-gardens-westlake-westlake-oh",
    address: "27569 Detroit Rd, Westlake, OH 44145",
    city: "Westlake",
    state: "OH",
    type: "Independent Living",
    services: ["Independent Living"],
    amenities: generateAmenities(["Independent Living"]),
    rating: 4.5,
    description: generateDescription("Brookdale Gardens at Westlake", ["Independent Living"]),
    image: "https://source.unsplash.com/random/800x600/?senior,community",
    phone: "(800) 555-1033"
  },
  {
    id: 34,
    name: "Fairmont of Westlake",
    slug: "fairmont-westlake-westlake-oh",
    address: "27819 Center Ridge Rd, Westlake, OH 44145",
    city: "Westlake",
    state: "OH",
    type: "Continuing Care",
    services: ["Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Assisted Living", "Memory Care"]),
    rating: 4.4,
    description: generateDescription("Fairmont of Westlake", ["Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,living",
    phone: "(800) 555-1034"
  },
  {
    id: 35,
    name: "Light of Hearts Villa",
    slug: "light-hearts-villa-bedford-oh",
    address: "283 Union St, Bedford, OH 44146",
    city: "Bedford",
    state: "OH",
    type: "Continuing Care",
    services: ["Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Assisted Living", "Memory Care"]),
    rating: 4.7,
    description: generateDescription("Light of Hearts Villa", ["Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,residence",
    phone: "(800) 555-1035"
  },
  {
    id: 36,
    name: "Arden Courts of Westlake",
    slug: "arden-courts-westlake-westlake-oh",
    address: "28400 Center Ridge Rd, Westlake, OH 44145",
    city: "Westlake",
    state: "OH",
    type: "Memory Care",
    services: ["Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Assisted Living", "Memory Care"]),
    rating: 4.6,
    description: generateDescription("Arden Courts of Westlake", ["Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,living",
    phone: "(800) 555-1036"
  },
  {
    id: 37,
    name: "Vitalia North Royalton",
    slug: "vitalia-north-royalton-north-royalton-oh",
    address: "8239 York Rd, North Royalton, OH 44133",
    city: "North Royalton",
    state: "OH",
    type: "Continuing Care",
    services: ["Independent Living", "Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Independent Living", "Assisted Living", "Memory Care"]),
    rating: 4.5,
    description: generateDescription("Vitalia North Royalton", ["Independent Living", "Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,community",
    phone: "(800) 555-1037"
  },
  {
    id: 38,
    name: "Vitalia Active Adult Community North Olmsted",
    slug: "vitalia-active-adult-community-north-olmsted-oh",
    address: "29801 Lorain Rd, North Olmsted, OH 44070",
    city: "North Olmsted",
    state: "OH",
    type: "Independent Living",
    services: ["Independent Living"],
    amenities: generateAmenities(["Independent Living"]),
    rating: 4.4,
    description: generateDescription("Vitalia Active Adult Community North Olmsted", ["Independent Living"]),
    image: "https://source.unsplash.com/random/800x600/?senior,residence",
    phone: "(800) 555-1038"
  },
  {
    id: 39,
    name: "The Ganzhorn Suites of Avon",
    slug: "ganzhorn-suites-avon-avon-oh",
    address: "33350 Colorado Ave, Avon, OH 44011",
    city: "Avon",
    state: "OH",
    type: "Memory Care",
    services: ["Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Assisted Living", "Memory Care"]),
    rating: 4.7,
    description: generateDescription("The Ganzhorn Suites of Avon", ["Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,living",
    phone: "(800) 555-1039"
  },
  {
    id: 40,
    name: "Maplewood at Cuyahoga Falls",
    slug: "maplewood-cuyahoga-falls-cuyahoga-falls-oh",
    address: "190 W Bath Rd, Cuyahoga Falls, OH 44223",
    city: "Cuyahoga Falls",
    state: "OH",
    type: "Continuing Care",
    services: ["Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Assisted Living", "Memory Care"]),
    rating: 4.6,
    description: generateDescription("Maplewood at Cuyahoga Falls", ["Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,residence",
    phone: "(800) 555-1040"
  },
  {
    id: 41,
    name: "Danbury Woods in Cuyahoga Falls",
    slug: "danbury-woods-cuyahoga-falls-cuyahoga-falls-oh",
    address: "1691 Queens Gate Cir, Cuyahoga Falls, OH 44221",
    city: "Cuyahoga Falls",
    state: "OH",
    type: "Continuing Care",
    services: ["Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Assisted Living", "Memory Care"]),
    rating: 4.8,
    description: generateDescription("Danbury Woods in Cuyahoga Falls", ["Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,community",
    phone: "(800) 555-1041"
  },
  {
    id: 42,
    name: "StoryPoint Medina",
    slug: "storypoint-medina-medina-oh",
    address: "100 High Point Dr, Medina, OH 44256",
    city: "Medina",
    state: "OH",
    type: "Continuing Care",
    services: ["Independent Living", "Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Independent Living", "Assisted Living", "Memory Care"]),
    rating: 4.7,
    description: generateDescription("StoryPoint Medina", ["Independent Living", "Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,residence",
    phone: "(800) 555-1042"
  },
  {
    id: 43,
    name: "Brookdale Richmond Heights",
    slug: "brookdale-richmond-heights-richmond-heights-oh",
    address: "3 Homewood Way, Richmond Heights, OH 44143",
    city: "Richmond Heights",
    state: "OH",
    type: "Continuing Care",
    services: ["Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Assisted Living", "Memory Care"]),
    rating: 4.5,
    description: generateDescription("Brookdale Richmond Heights", ["Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,living",
    phone: "(800) 555-1043"
  },
  {
    id: 44,
    name: "Waterford At Richmond Heights",
    slug: "waterford-richmond-heights-richmond-heights-oh",
    address: "261 Richmond Rd, Richmond Heights, OH 44143",
    city: "Richmond Heights",
    state: "OH",
    type: "Continuing Care",
    services: ["Independent Living", "Assisted Living"],
    amenities: generateAmenities(["Independent Living", "Assisted Living"]),
    rating: 4.4,
    description: generateDescription("Waterford At Richmond Heights", ["Independent Living", "Assisted Living"]),
    image: "https://source.unsplash.com/random/800x600/?senior,residence",
    phone: "(800) 555-1044"
  },
  {
    id: 45,
    name: "South Franklin Circle",
    slug: "south-franklin-circle-chagrin-falls-oh",
    address: "16575 S Franklin St, Chagrin Falls, OH 44023",
    city: "Chagrin Falls",
    state: "OH",
    type: "Continuing Care",
    services: ["Independent Living", "Assisted Living", "Memory Care", "Skilled Nursing"],
    amenities: generateAmenities(["Independent Living", "Assisted Living", "Memory Care"]),
    rating: 4.8,
    description: generateDescription("South Franklin Circle", ["Independent Living", "Assisted Living", "Memory Care", "Skilled Nursing"]),
    image: "https://source.unsplash.com/random/800x600/?senior,community",
    phone: "(800) 555-1045"
  },
  {
    id: 46,
    name: "Maplewood at Chardon",
    slug: "maplewood-chardon-chardon-oh",
    address: "12350 Bass Lake Rd, Chardon, OH 44024",
    city: "Chardon",
    state: "OH",
    type: "Continuing Care",
    services: ["Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Assisted Living", "Memory Care"]),
    rating: 4.6,
    description: generateDescription("Maplewood at Chardon", ["Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,residence",
    phone: "(800) 555-1046"
  },
  {
    id: 47,
    name: "The Winfield at Richmond Heights",
    slug: "winfield-richmond-heights-richmond-heights-oh",
    address: "261 Richmond Rd, Richmond Heights, OH 44143",
    city: "Richmond Heights",
    state: "OH",
    type: "Continuing Care",
    services: ["Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Assisted Living", "Memory Care"]),
    rating: 4.5,
    description: generateDescription("The Winfield at Richmond Heights", ["Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,living",
    phone: "(800) 555-1047"
  },
  {
    id: 48,
    name: "Saint Augustine Towers Assisted Living Residences",
    slug: "saint-augustine-towers-cleveland-oh",
    address: "7821 Lake Ave, Cleveland, OH 44102",
    city: "Cleveland",
    state: "OH",
    type: "Assisted Living",
    services: ["Assisted Living"],
    amenities: generateAmenities(["Assisted Living"]),
    rating: 4.3,
    description: generateDescription("Saint Augustine Towers Assisted Living Residences", ["Assisted Living"]),
    image: "https://source.unsplash.com/random/800x600/?senior,residence",
    phone: "(800) 555-1048"
  },
  {
    id: 49,
    name: "Rely's Adult Family Home",
    slug: "relys-adult-family-home-parma-oh",
    address: "7500 Big Creek Pkwy, Parma, OH 44130",
    city: "Parma",
    state: "OH",
    type: "Assisted Living",
    services: ["Assisted Living"],
    amenities: generateAmenities(["Assisted Living"]),
    rating: 4.2,
    description: generateDescription("Rely's Adult Family Home", ["Assisted Living"]),
    image: "https://source.unsplash.com/random/800x600/?senior,living",
    phone: "(800) 555-1049"
  },
  {
    id: 50,
    name: "Your Second Family",
    slug: "your-second-family-brooklyn-oh",
    address: "4667 Tiedeman Rd, Brooklyn, OH 44144",
    city: "Brooklyn",
    state: "OH",
    type: "Assisted Living",
    services: ["Assisted Living"],
    amenities: generateAmenities(["Assisted Living"]),
    rating: 4.4,
    description: generateDescription("Your Second Family", ["Assisted Living"]),
    image: "https://source.unsplash.com/random/800x600/?senior,residence",
    phone: "(800) 555-1050"
  },
  {
    id: 51,
    name: "O'Neill Healthcare Lakewood",
    slug: "oneill-healthcare-lakewood-lakewood-oh",
    address: "13900 Detroit Ave, Lakewood, OH 44107",
    city: "Lakewood",
    state: "OH",
    type: "Continuing Care",
    services: ["Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Assisted Living", "Memory Care"]),
    rating: 4.5,
    description: generateDescription("O'Neill Healthcare Lakewood", ["Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,living",
    phone: "(800) 555-1051"
  },
  {
    id: 52,
    name: "Danbury Senior Living Cuyahoga Falls",
    slug: "danbury-senior-living-cuyahoga-falls-cuyahoga-falls-oh",
    address: "2645 Sackett Ave, Cuyahoga Falls, OH 44223",
    city: "Cuyahoga Falls",
    state: "OH",
    type: "Continuing Care",
    services: ["Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Assisted Living", "Memory Care"]),
    rating: 4.7,
    description: generateDescription("Danbury Senior Living Cuyahoga Falls", ["Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,residence",
    phone: "(800) 555-1052"
  },
  {
    id: 53,
    name: "Danbury Senior Living Mentor",
    slug: "danbury-senior-living-mentor-mentor-oh",
    address: "9150 Lakeshore Blvd, Mentor, OH 44060",
    city: "Mentor",
    state: "OH",
    type: "Continuing Care",
    services: ["Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Assisted Living", "Memory Care"]),
    rating: 4.7,
    description: generateDescription("Danbury Senior Living Mentor", ["Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,residence",
    phone: "(800) 555-1053"
  },
  {
    id: 54,
    name: "Danbury Senior Living North Ridgeville",
    slug: "danbury-senior-living-north-ridgeville-north-ridgeville-oh",
    address: "33770 Bagley Rd, North Ridgeville, OH 44039",
    city: "North Ridgeville",
    state: "OH",
    type: "Continuing Care",
    services: ["Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Assisted Living", "Memory Care"]),
    rating: 4.6,
    description: generateDescription("Danbury Senior Living North Ridgeville", ["Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,living",
    phone: "(800) 555-1054"
  },
  {
    id: 55,
    name: "Danbury Senior Living Wooster",
    slug: "danbury-senior-living-wooster-wooster-oh",
    address: "939 Portage Rd, Wooster, OH 44691",
    city: "Wooster",
    state: "OH",
    type: "Continuing Care",
    services: ["Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Assisted Living", "Memory Care"]),
    rating: 4.8,
    description: generateDescription("Danbury Senior Living Wooster", ["Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,community",
    phone: "(800) 555-1055"
  },
  {
    id: 56,
    name: "Brookdale Bath",
    slug: "brookdale-bath-akron-oh",
    address: "101 N Cleveland Massillon Rd, Akron, OH 44333",
    city: "Akron",
    state: "OH",
    type: "Continuing Care",
    services: ["Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Assisted Living", "Memory Care"]),
    rating: 4.5,
    description: generateDescription("Brookdale Bath", ["Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,residence",
    phone: "(800) 555-1056"
  },
  {
    id: 57,
    name: "Brookdale Montrose",
    slug: "brookdale-montrose-akron-oh",
    address: "4050 Jaclyns Way, Akron, OH 44333",
    city: "Akron",
    state: "OH",
    type: "Continuing Care",
    services: ["Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Assisted Living", "Memory Care"]),
    rating: 4.4,
    description: generateDescription("Brookdale Montrose", ["Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,living",
    phone: "(800) 555-1057"
  },
  {
    id: 58,
    name: "Brookdale Medina South",
    slug: "brookdale-medina-south-medina-oh",
    address: "100 High Point Dr, Medina, OH 44256",
    city: "Medina",
    state: "OH",
    type: "Continuing Care",
    services: ["Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Assisted Living", "Memory Care"]),
    rating: 4.6,
    description: generateDescription("Brookdale Medina South", ["Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,residence",
    phone: "(800) 555-1058"
  },
  {
    id: 59,
    name: "Brookdale Wickliffe",
    slug: "brookdale-wickliffe-wickliffe-oh",
    address: "30630 Ridge Rd, Wickliffe, OH 44092",
    city: "Wickliffe",
    state: "OH",
    type: "Continuing Care",
    services: ["Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Assisted Living", "Memory Care"]),
    rating: 4.5,
    description: generateDescription("Brookdale Wickliffe", ["Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,community",
    phone: "(800) 555-1059"
  },
  {
    id: 60,
    name: "Vitalia Mentor",
    slug: "vitalia-mentor-mentor-oh",
    address: "8180 Mentor Hills Dr, Mentor, OH 44060",
    city: "Mentor",
    state: "OH",
    type: "Continuing Care",
    services: ["Independent Living", "Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Independent Living", "Assisted Living", "Memory Care"]),
    rating: 4.7,
    description: generateDescription("Vitalia Mentor", ["Independent Living", "Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,residence",
    phone: "(800) 555-1060"
  },
  {
    id: 61,
    name: "Vitalia Montrose",
    slug: "vitalia-montrose-akron-oh",
    address: "4041 Heritage Center Dr, Akron, OH 44321",
    city: "Akron",
    state: "OH",
    type: "Continuing Care",
    services: ["Independent Living", "Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Independent Living", "Assisted Living", "Memory Care"]),
    rating: 4.6,
    description: generateDescription("Vitalia Montrose", ["Independent Living", "Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,living",
    phone: "(800) 555-1061"
  },
  {
    id: 62,
    name: "Vitalia Solon",
    slug: "vitalia-solon-solon-oh",
    address: "6050 Kruse Dr, Solon, OH 44139",
    city: "Solon",
    state: "OH",
    type: "Continuing Care",
    services: ["Independent Living", "Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Independent Living", "Assisted Living", "Memory Care"]),
    rating: 4.8,
    description: generateDescription("Vitalia Solon", ["Independent Living", "Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,community",
    phone: "(800) 555-1062"
  },
  {
    id: 63,
    name: "Vitalia Stow",
    slug: "vitalia-stow-stow-oh",
    address: "4291 Allen Rd, Stow, OH 44224",
    city: "Stow",
    state: "OH",
    type: "Continuing Care",
    services: ["Independent Living", "Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Independent Living", "Assisted Living", "Memory Care"]),
    rating: 4.5,
    description: generateDescription("Vitalia Stow", ["Independent Living", "Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,residence",
    phone: "(800) 555-1063"
  },
  {
    id: 64,
    name: "StoryPoint Rockside",
    slug: "storypoint-rockside-seven-hills-oh",
    address: "6100 Lombardo Center, Seven Hills, OH 44131",
    city: "Seven Hills",
    state: "OH",
    type: "Continuing Care",
    services: ["Independent Living", "Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Independent Living", "Assisted Living", "Memory Care"]),
    rating: 4.7,
    description: generateDescription("StoryPoint Rockside", ["Independent Living", "Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,living",
    phone: "(800) 555-1064"
  },
  {
    id: 65,
    name: "StoryPoint Troy",
    slug: "storypoint-troy-troy-oh",
    address: "1840 Towne Park Dr, Troy, OH 45373",
    city: "Troy",
    state: "OH",
    type: "Continuing Care",
    services: ["Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Assisted Living", "Memory Care"]),
    rating: 4.6,
    description: generateDescription("StoryPoint Troy", ["Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,residence",
    phone: "(800) 555-1065"
  },
  {
    id: 66,
    name: "Sunrise of Cuyahoga Falls",
    slug: "sunrise-cuyahoga-falls-cuyahoga-falls-oh",
    address: "1500 State Rd, Cuyahoga Falls, OH 44223",
    city: "Cuyahoga Falls",
    state: "OH",
    type: "Continuing Care",
    services: ["Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Assisted Living", "Memory Care"]),
    rating: 4.5,
    description: generateDescription("Sunrise of Cuyahoga Falls", ["Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,community",
    phone: "(800) 555-1066"
  },
  {
    id: 67,
    name: "Sunrise of Rocky River",
    slug: "sunrise-rocky-river-rocky-river-oh",
    address: "21600 Detroit Rd, Rocky River, OH 44116",
    city: "Rocky River",
    state: "OH",
    type: "Continuing Care",
    services: ["Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Assisted Living", "Memory Care"]),
    rating: 4.8,
    description: generateDescription("Sunrise of Rocky River", ["Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,residence",
    phone: "(800) 555-1067"
  },
  {
    id: 68,
    name: "Sunrise of Shaker Heights",
    slug: "sunrise-shaker-heights-shaker-heights-oh",
    address: "16333 Chagrin Blvd, Shaker Heights, OH 44120",
    city: "Shaker Heights",
    state: "OH",
    type: "Continuing Care",
    services: ["Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Assisted Living", "Memory Care"]),
    rating: 4.7,
    description: generateDescription("Sunrise of Shaker Heights", ["Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,living",
    phone: "(800) 555-1068"
  },
  {
    id: 69,
    name: "Sunrise of Poland",
    slug: "sunrise-poland-poland-oh",
    address: "335 W McKinley Way, Poland, OH 44514",
    city: "Poland",
    state: "OH",
    type: "Continuing Care",
    services: ["Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Assisted Living", "Memory Care"]),
    rating: 4.6,
    description: generateDescription("Sunrise of Poland", ["Assisted Living", "Memory Care"]),
    image: "https://source.unsplash.com/random/800x600/?senior,residence",
    phone: "(800) 555-1069"
  }
]; 