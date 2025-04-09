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
  }
]; 