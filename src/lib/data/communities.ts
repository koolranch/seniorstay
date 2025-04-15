import { PrismaClient } from '@prisma/client';
import { InternalCommunity } from '@/lib/types/community';

// Updated Helper function to parse services (handles null/undefined)
function parseServices(services: string | null | undefined): string[] {
  if (!services) {
    return []; // Return empty array if input is null, undefined, or empty string
  }
  // Split, trim, and filter out any empty strings that might result
  return services.split(',').map(service => service.trim()).filter(Boolean);
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

// Initialize Prisma Client globally again
const prisma = new PrismaClient();

// NEW function to fetch data with fallback
export async function getAllCommunitiesData(): Promise<InternalCommunity[]> {
  try {
    console.log("Attempting to fetch communities from database for getAllCommunitiesData...");
    const rawDbCommunities = await prisma.community.findMany({
      select: {
        id: true,
        name: true,
        city: true,
        state: true, // Ensure state is selected
        slug: true,
        services: true,
      },
    });

    if (rawDbCommunities && rawDbCommunities.length > 0) {
       console.log(`Fetched ${rawDbCommunities.length} communities from database.`);
       return rawDbCommunities.map((c) => {
            const servicesArray = parseServices(c.services);
            const derivedType = determineType(servicesArray);
            return {
                id: String(c.id), // Ensure ID is string
                name: c.name,
                city: c.city,
                state: c.state, // Include state
                slug: c.slug,
                services: servicesArray, // Use parsed services
                type: derivedType, // Use derived type
            };
       });
    } else {
        console.warn("⚠️ No communities found in database via getAllCommunitiesData. Falling back...");
        // Fall through to catch block logic is not ideal, let's call fallback directly
        const { loadFallbackCommunities } = await import('@/lib/server-only/loadFallbackCommunities');
        return loadFallbackCommunities();
    }
  } catch (err) {
    console.error("❌ Error fetching communities from database:", err);
    console.warn("⚠️ Falling back to JSON community data");
    // Dynamically import and load fallback data only on server
    if (typeof window === 'undefined') {
        try {
            const { loadFallbackCommunities } = await import('@/lib/server-only/loadFallbackCommunities');
            return loadFallbackCommunities(); // returns InternalCommunity[]
        } catch (importError) {
            console.error("🚨 Failed to dynamically import or load fallback communities:", importError);
            return []; // Return empty array on critical fallback failure
        }
    } else {
        console.error("🚨 Cannot load fallback communities in browser context during DB error.");
        return []; // Cannot fallback on client
    }
  } finally {
      // Ensure prisma disconnect is called
      await prisma.$disconnect().catch((e: Error) => console.error("Failed to disconnect Prisma client:", e));
  }
}

// Fetches all communities, trying the database first, then dynamically loading fallback JSON
// Consider refactoring this to use getAllCommunitiesData? For now, keeping separate as per analysis.
export async function getAllCommunities(): Promise<InternalCommunity[]> {
  let dbCommunities: InternalCommunity[] = [];
  let fallbackCommunities: InternalCommunity[] = [];
  let useFallback = false;

  try {
    console.log("Attempting to fetch communities from database...");
    const rawDbCommunities = await prisma.community.findMany({
      select: {
        id: true, 
        name: true,
        city: true,
        state: true,
        slug: true,
        services: true, 
      },
    });

    if (rawDbCommunities && rawDbCommunities.length > 0) {
      console.log(`Fetched ${rawDbCommunities.length} communities from database.`);
      dbCommunities = rawDbCommunities.map((dbCommunity: { id: string; name: string; city: string; state: string; slug: string; services: string | null }) => {
          const servicesArray = parseServices(dbCommunity.services);
          const derivedType = determineType(servicesArray);
          return {
              id: dbCommunity.id, 
              name: dbCommunity.name,
              city: dbCommunity.city,
              state: dbCommunity.state, 
              slug: dbCommunity.slug,
              type: derivedType, 
              services: servicesArray, 
          };
      });
      return dbCommunities; // Return DB results if successful
    } else {
      console.log("No communities found in database, preparing to use fallback.");
      useFallback = true;
    }
  } catch (error) {
    console.error("Error fetching communities from database:", error);
    console.log("Preparing to use fallback due to database error.");
    useFallback = true;
  }

  // Dynamically load fallback data only if needed (and on server)
  if (useFallback && typeof window === 'undefined') {
      try {
          console.log("Dynamically importing loadFallbackCommunities...");
          // Dynamic import - only runs on server
          const { loadFallbackCommunities } = await import('@/lib/server-only/loadFallbackCommunities');
          fallbackCommunities = loadFallbackCommunities();
          console.log(`Loaded ${fallbackCommunities.length} communities from fallback JSON.`);
          return fallbackCommunities;
      } catch (importError) {
          console.error("Failed to dynamically import or load fallback communities:", importError);
          // Continue to disconnect Prisma, return empty array
      }
  } else if (useFallback) {
      console.warn("Cannot load fallback communities in browser context.");
  }

  // Disconnect Prisma client if it was potentially used
  if (prisma) {
      await prisma.$disconnect().catch((e: Error) => console.error("Failed to disconnect Prisma client:", e));
  }
  
  // Return empty array if DB failed and fallback couldn't be loaded
  return []; 
}

// Generates SEO content for all communities (uses getAllCommunities)
export async function generateSEOContentForCommunities() {
  const communities = await getAllCommunities(); // pull from DB or fallback

  if (!communities || communities.length === 0) {
      console.warn("No communities found to generate SEO content.");
      return [];
  }

  const seoData = communities.map((community) => {
    const name = community.name; 
    const city = community.city;
    const state = community.state;
    const type = community.type; 
    const slug = community.slug;

    const cityState = `${city}, ${state}`;

    let titleTag = `${name} - ${type} in ${cityState}`;
     if (titleTag.length > 60) {
        titleTag = `${name}, ${cityState} | ${type}`;
        if (titleTag.length > 60) {
             titleTag = `${name}, ${cityState}`;
        }
        if (titleTag.length > 60) {
            console.warn(`Generated title tag for ${slug} exceeds 60 characters: "${titleTag}"`);
        }
    }

    let metaDescription = `${name} offers compassionate ${type.toLowerCase()} services in ${city}. Schedule a tour or request pricing for quality care.`;
    if (metaDescription.length > 160) {
        metaDescription = metaDescription.substring(0, 157) + '...'; 
        console.warn(`Generated meta description for ${slug} truncated to 160 characters.`);
    } else if (metaDescription.length < 100) {
        metaDescription = `${name} in ${cityState} offers quality ${type.toLowerCase()} care options. Discover our services and amenities. Schedule a tour today!`;
        if (metaDescription.length > 160) {
            metaDescription = metaDescription.substring(0, 157) + '...';
        }
    }

    const h1 = `${name}`;
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

// export const communities: Community[] = [ ... ]; // REMOVED

// ... rest of file ... 