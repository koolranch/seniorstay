import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Helper function to generate slug from name
function generateSlug(name: string, city: string, state: string): string {
  return `${name}-${city}-${state}`
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
  reviewCount?: number;
  description: string;
  image: string;
  phone?: string;
}

// Define the shape of the community data we'll work with internally
// Use string for ID as it comes from Prisma
interface InternalCommunity {
  id: string; // Changed to string to match Prisma
  name: string;
  city: string;
  slug: string;
  state: string;
  type: string; // Type will be derived or defaulted
  services?: string[]; // Keep services if needed later
}

// Function to load fallback communities from JSON file
// This still uses the old structure, so we need to adapt its output
function loadFallbackCommunities(): InternalCommunity[] {
  try {
    const filePath = path.join(process.cwd(), 'src', 'lib', 'fallbackCommunities.json');
    if (!fs.existsSync(filePath)) {
      console.error('Fallback communities file not found:', filePath);
      return [];
    }
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);

    if (!Array.isArray(data)) {
      console.error('Fallback communities data is not an array.');
      return [];
    }

    // Adapt the JSON data (assuming id is number) to InternalCommunity
    return data.map((item: any) => {
      const fallbackId = item.id ? String(item.id) : `fallback-${Math.random().toString(36).substring(7)}`; // Convert or generate ID
      const fallbackType = item.type || "Senior Living"; // Default type if missing
      return {
        id: fallbackId,
        name: item.name || "Unknown Community",
        city: item.city || "Unknown City",
        slug: item.slug || generateSlug(item.name || "Unknown", item.city || "Unknown", item.state || "XX"),
        state: item.state || "Unknown State",
        type: fallbackType, // Use provided type or default
      };
    });
  } catch (error) {
    console.error('Failed to load or parse fallback communities from JSON:', error);
    return [];
  }
}

// Initialize Prisma Client
const prisma = new PrismaClient();

// Fetches all communities, trying the database first, then fallback JSON
export async function getAllCommunities(): Promise<InternalCommunity[]> {
  try {
    const dbCommunities = await prisma.community.findMany({
      select: {
        id: true, // id is string in schema
        name: true,
        city: true,
        state: true,
        slug: true,
        services: true, // Fetch services string instead of type
      },
    });

    if (dbCommunities && dbCommunities.length > 0) {
      console.log(`Fetched ${dbCommunities.length} communities from database.`);
      // Map Prisma result to InternalCommunity structure
      return dbCommunities.map(dbCommunity => {
          // Parse services string into an array
          const servicesArray = dbCommunity.services ? parseServices(dbCommunity.services) : [];
          // Determine type based on services
          const derivedType = determineType(servicesArray); // Use existing helper

          return {
              id: dbCommunity.id, // Already a string
              name: dbCommunity.name,
              city: dbCommunity.city,
              state: dbCommunity.state, // Assuming state is stored correctly (e.g., "OH")
              slug: dbCommunity.slug,
              type: derivedType, // Use derived type
              services: servicesArray, // Optionally keep the parsed services
          };
      });
    } else {
      console.log("No communities found in database, attempting to load from fallback JSON.");
      return loadFallbackCommunities();
    }
  } catch (error) {
    console.error("Error fetching communities from database:", error);
    console.log("Attempting to load communities from fallback JSON due to database error.");
    return loadFallbackCommunities();
  } finally {
    await prisma.$disconnect().catch(e => console.error("Failed to disconnect Prisma client:", e));
  }
}

// Generates SEO content for all communities
export async function generateSEOContentForCommunities() {
  const communities = await getAllCommunities(); // Now returns Promise<InternalCommunity[]>

  if (!communities || communities.length === 0) {
      console.warn("No communities found to generate SEO content.");
      return [];
  }

  const seoData = communities.map((community) => {
    // Use fields from InternalCommunity
    const name = community.name; // Already defaulted if necessary in getAllCommunities/loadFallback
    const city = community.city;
    const state = community.state;
    const type = community.type; // Now correctly derived or defaulted
    const slug = community.slug;

    const cityState = `${city}, ${state}`;

    // 1. SEO Title Tag (under 60 characters ideally)
    let titleTag = `${name} - ${type} in ${cityState}`;
    if (titleTag.length > 60) {
        // Attempt to shorten if too long
        titleTag = `${name}, ${cityState} | ${type}`;
        if (titleTag.length > 60) {
             // Further shorten if still needed
             titleTag = `${name}, ${cityState}`;
        }
        // Log warning if still too long after shortening
        if (titleTag.length > 60) {
            console.warn(`Generated title tag for ${slug} exceeds 60 characters: "${titleTag}"`);
        }
    }

    // 2. Meta Description (around 150–160 characters)
    let metaDescription = `${name} offers compassionate ${type.toLowerCase()} services in ${city}. Schedule a tour or request pricing for quality care.`;
    // Ensure meta description isn't excessively long or short
    if (metaDescription.length > 160) {
        metaDescription = metaDescription.substring(0, 157) + '...'; // Truncate cleanly
        console.warn(`Generated meta description for ${slug} truncated to 160 characters.`);
    } else if (metaDescription.length < 100) {
        // Add a bit more detail if too short
        metaDescription = `${name} in ${cityState} offers quality ${type.toLowerCase()} care options. Discover our services and amenities. Schedule a tour today!`;
        // Re-check length after modification
        if (metaDescription.length > 160) {
            metaDescription = metaDescription.substring(0, 157) + '...';
        }
    }

    // 3. H1 (main page heading)
    const h1 = `${name}`;

    // 4. H2 (supporting heading, local SEO benefit)
    const h2 = `${type} Community in ${cityState}`;

    return {
      slug: slug,
      seo: {
        titleTag,
        metaDescription,
        h1,
        h2,
      },
    };
  });

  return seoData;
}

export const communities: Community[] = [
  {
    id: 1,
    name: "Westwood Place",
    slug: generateSlug("Westwood Place", "Cleveland", "OH"),
    address: "Cleveland, OH",
    city: "Cleveland",
    state: "OH",
    type: "Assisted Living",
    services: ["Assisted Living"],
    amenities: generateAmenities(["Assisted Living"]),
    rating: 4.2,
    description: generateDescription("Westwood Place", ["Assisted Living"]),
    image: "https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=2074&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Summit Point",
    slug: generateSlug("Summit Point", "Macedonia", "OH"),
    address: "9633 Valley View Rd, Macedonia, OH 44056",
    city: "Macedonia",
    state: "OH",
    type: "Continuing Care",
    services: ["Independent Living", "Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Independent Living", "Assisted Living", "Memory Care"]),
    rating: 4.5,
    description: generateDescription("Summit Point", ["Independent Living", "Assisted Living", "Memory Care"]),
    image: "https://images.unsplash.com/photo-1556155092-490a1ba16284?q=80&w=2070&auto=format&fit=crop"
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
  },
  {
    id: 68,
    name: "Sunrise of Hudson",
    slug: "sunrise-of-hudson-hudson-oh",
    address: "5900 Hudson Drive, Hudson, OH 44236",
    city: "Hudson",
    state: "OH",
    type: "Assisted Living",
    services: ["Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Assisted Living", "Memory Care"]),
    rating: 4.3,
    description: generateDescription("Sunrise of Hudson", ["Assisted Living", "Memory Care"]),
    image: "https://images.unsplash.com/photo-1582719471384-894fbb07a271?q=80&w=2187&auto=format&fit=crop"
  },
  {
    id: 69,
    name: "Sunrise of Solon",
    slug: "sunrise-of-solon-solon-oh",
    address: "33333 Aurora Road, Solon, OH 44139",
    city: "Solon",
    state: "OH",
    type: "Assisted Living",
    services: ["Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Assisted Living", "Memory Care"]),
    rating: 4.4,
    description: generateDescription("Sunrise of Solon", ["Assisted Living", "Memory Care"]),
    image: "https://images.unsplash.com/photo-1568939571043-88fceafce24f?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 70,
    name: "The Landing of Stow",
    slug: "the-landing-of-stow-stow-oh",
    address: "5511 Fishcreek Road, Stow, OH 44224",
    city: "Stow",
    state: "OH",
    type: "Assisted Living",
    services: ["Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Assisted Living", "Memory Care"]),
    rating: 4.6,
    description: generateDescription("The Landing of Stow", ["Assisted Living", "Memory Care"]),
    image: "https://images.unsplash.com/photo-1600607687126-8a3414349a51?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 71,
    name: "The Landing of Canton",
    slug: "the-landing-of-canton-canton-oh",
    address: "4550 Hills and Dales Road NW, Canton, OH 44708",
    city: "Canton",
    state: "OH",
    type: "Assisted Living",
    services: ["Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Assisted Living", "Memory Care"]),
    rating: 4.5,
    description: generateDescription("The Landing of Canton", ["Assisted Living", "Memory Care"]),
    image: "https://images.unsplash.com/photo-1519974719765-e6559eac2575?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 72,
    name: "The Landing of Worthington",
    slug: "the-landing-of-worthington-worthington-oh",
    address: "1650 N. High Street, Worthington, OH 43085",
    city: "Worthington",
    state: "OH",
    type: "Assisted Living",
    services: ["Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Assisted Living", "Memory Care"]),
    rating: 4.7,
    description: generateDescription("The Landing of Worthington", ["Assisted Living", "Memory Care"]),
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 73,
    name: "The Landing of Hamilton",
    slug: "the-landing-of-hamilton-hamilton-oh",
    address: "1800 Riverchase Drive, Hamilton, OH 45011",
    city: "Hamilton",
    state: "OH",
    type: "Assisted Living",
    services: ["Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Assisted Living", "Memory Care"]),
    rating: 4.4,
    description: generateDescription("The Landing of Hamilton", ["Assisted Living", "Memory Care"]),
    image: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 74,
    name: "The Landing of Middleburg Heights",
    slug: "the-landing-of-middleburg-heights-middleburg-heights-oh",
    address: "15435 Bagley Road, Middleburg Heights, OH 44130",
    city: "Middleburg Heights",
    state: "OH",
    type: "Assisted Living",
    services: ["Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Assisted Living", "Memory Care"]),
    rating: 4.5,
    description: generateDescription("The Landing of Middleburg Heights", ["Assisted Living", "Memory Care"]),
    image: "https://images.unsplash.com/photo-1579377677747-44a9b1ce2f17?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 75,
    name: "The Landing of Westerville",
    slug: "the-landing-of-westerville-westerville-oh",
    address: "690 Cooper Road, Westerville, OH 43081",
    city: "Westerville",
    state: "OH",
    type: "Assisted Living",
    services: ["Assisted Living", "Memory Care"],
    amenities: generateAmenities(["Assisted Living", "Memory Care"]),
    rating: 4.6,
    description: generateDescription("The Landing of Westerville", ["Assisted Living", "Memory Care"]),
    image: "https://images.unsplash.com/photo-1505577058444-a3dab90d4253?q=80&w=2070&auto=format&fit=crop"
  }
]; 