import { notFound } from "next/navigation";
import { communities, Community } from "@/lib/data/communities";
import { getCommunityPathFromObject } from "@/lib/utils/formatSlug";
import CommunityContent from "./CommunityContent";
import { prisma } from "@/lib/prisma";
import Link from 'next/link';
import { Metadata, ResolvingMetadata } from 'next';
import { slugify } from "@/lib/utils/formatSlug";

// Optimize for static generation, error on unknown paths
// export const dynamic = 'force-dynamic'; // Removed
export const dynamic = 'error'; 
// Consider adding revalidate if ISR is desired later:
// export const revalidate = 3600; // Revalidate every hour

// Define the page params interface
interface PageParams {
  city: string;
  slug: string;
}

// Define a type for the community object matching both the Prisma schema and CommunityContent props
interface SafeCommunity {
  id: string;
  name: string;
  city: string;
  state: string;
  slug: string;
  description?: string;
  address?: string;
  zipCode?: string | null;
  type?: string;
  amenities?: string[];
  rating?: number | undefined;
  reviewCount?: number | undefined;
  images?: string[];
  phone?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

// Safe metadata generation that avoids DB errors
export async function generateMetadata(
  { params }: { params: PageParams | undefined },
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Safety check for params
  if (!params || !params.city || !params.slug) {
    return {
      title: 'Community Not Found | Senior Living in Ohio',
      description: 'Information about this senior living community is not available.',
    };
  }

  // Format city and community name from params for the hardcoded fallback
  const cityFormatted = params.city
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  const communityFormatted = params.slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Return completely hardcoded metadata based only on params
  // This avoids calling getFallbackCommunity entirely in metadata generation
  return {
    title: `${communityFormatted} | Senior Living in ${cityFormatted}, Ohio (Info Unavailable)`,
    description: `Information about ${communityFormatted}, a senior living community located in ${cityFormatted}, Ohio. Please visit the page for details.`,
  };
  // Note: We removed the try/catch as this path is now synchronous and error-free
}

// Re-enable generateStaticParams with Prisma priority and fallback
export async function generateStaticParams(): Promise<PageParams[]> {
  let params: PageParams[] = [];
  let usingDb = false;

  try {
    // Attempt to connect and query the database
    if (prisma?.community) {
      console.log("Attempting to generate static params from database...");
      const dbCommunities = await prisma.community.findMany({
        where: { state: { equals: "Ohio", mode: 'insensitive' } },
        select: { city: true, slug: true },
      });

      if (dbCommunities && dbCommunities.length > 0) {
        params = dbCommunities.map(community => ({
          city: community.city.toLowerCase(), // Ensure lowercase for consistency
          slug: community.slug.toLowerCase(),
        }));
        usingDb = true;
        console.log(`Successfully generated ${params.length} static params from database.`);
      } else {
        console.warn("⚠️ No Ohio communities found in the database for static param generation.");
      }
    } else {
      console.warn("⚠️ Prisma client not available during static generation.");
    }
  } catch (dbError) {
    console.warn("⚠️ Database error during static param generation:", dbError);
    // Fallback strategy will be executed below if DB fails
  }

  // Fallback to local data ONLY if DB failed or returned no results
  if (!usingDb) {
    console.warn("Falling back to local data for static param generation.");
    try {
        params = communities
        .filter((community: Community) => community.state === "Ohio" || community.state === "OH")
        .map((community: Community) => {
          // Use the actual city/slug if available, format if needed
           const city = community.city?.toLowerCase() || 'unknown-city';
           const slug = community.slug?.toLowerCase() || 'unknown-slug';
           
           // Basic validation: Ensure city and slug are meaningful before including
           if (city !== 'unknown-city' && slug !== 'unknown-slug') {
               return { city, slug };
           }
           return null; // Skip invalid entries
        })
        .filter((p): p is PageParams => p !== null); // Type guard to filter out nulls and satisfy type

      console.log(`Generated ${params.length} static params from local fallback data.`);
    } catch (localError) {
      console.error("Error generating static params from local data:", localError);
      params = []; // Return empty array on error
    }
  }

  // Add a check for empty params before returning
  if (params.length === 0) {
    console.error("🚨 CRITICAL: No static params could be generated for Ohio communities from DB or fallback. Check data sources and DB connection.");
  }

  return params;
}

// Try to find a community in the static data array
function findCommunityInStaticData(city: string, slug: string): Community | null {
  try {
    console.log(`[${city}/${slug}] Attempting to find community in static data...`);
    
    // Normalize inputs for comparison
    const normalizedCity = city.toLowerCase();
    const normalizedSlug = slug.toLowerCase();
    
    // First, try to find by exact slug match
    let staticCommunity = communities.find(
      c => c.slug.toLowerCase() === normalizedSlug
    );
    
    // If not found by slug, try by city + name combination
    if (!staticCommunity) {
      staticCommunity = communities.find(
        c => c.city.toLowerCase() === normalizedCity && 
             slugify(c.name).toLowerCase() === normalizedSlug
      );
    }
    
    // One more attempt - more flexible matching
    if (!staticCommunity) {
      staticCommunity = communities.find(
        c => c.slug.toLowerCase().includes(normalizedSlug) || 
             normalizedSlug.includes(c.slug.toLowerCase())
      );
    }
    
    if (staticCommunity) {
      console.log(`[${city}/${slug}] Found community in static data: ${staticCommunity.name}`);
      return staticCommunity;
    }
    
    console.log(`[${city}/${slug}] No matching community found in static data.`);
    return null;
  } catch (error) {
    console.error(`[${city}/${slug}] Error searching static data:`, error);
    return null;
  }
}

// Convert a static Community to the SafeCommunity format
function convertToSafeCommunity(community: {
  id: number;
  name: string;
  city: string;
  state: string;
  slug: string;
  description?: string;
  address?: string;
  type?: string;
  services?: string[];
  amenities?: string[];
  rating?: number;
  reviewCount?: number;
  image?: string;
  phone?: string;
}): SafeCommunity {
  // Ensure all required fields have values with fallbacks
  const cityValue = community.city || "Unknown City";
  const stateValue = community.state || "OH";
  
  return {
    id: String(community.id),
    name: community.name || "Unknown Community",
    city: cityValue,
    state: stateValue,
    slug: community.slug || `unknown-${community.id}`,
    description: community.description || `Information about this community in ${cityValue}, ${stateValue} is currently being updated.`,
    address: community.address || `${cityValue}, ${stateValue}`,
    type: community.type || "Senior Living",
    // Ensure amenities is always an array
    amenities: Array.isArray(community.amenities) 
      ? community.amenities 
      : Array.isArray(community.services) 
        ? community.services 
        : [],
    rating: community.rating,
    reviewCount: community.reviewCount,
    // Ensure images is always an array
    images: community.image ? [community.image] : [],
    phone: community.phone || null,
  };
}

// Helper function to fetch data, returns SafeCommunity or null
async function fetchCommunityData(city: string, slug: string): Promise<SafeCommunity | null> {
    console.log(`[${city}/${slug}] Attempting to fetch community data...`);
    try {
      // First attempt to get from database
      if (prisma && prisma.community) {
        try {
          const dbCommunity = await prisma.community.findFirst({
            where: {
              // Ensure case-insensitive matching as slugs/cities might vary in casing
              slug: { equals: slug, mode: 'insensitive' },
              city: { equals: city, mode: 'insensitive' },
              state: { equals: "Ohio", mode: 'insensitive'}, // Added state check for safety
            },
          });

          if (dbCommunity && dbCommunity.name && dbCommunity.city && dbCommunity.state && dbCommunity.slug) {
            console.log(`[${city}/${slug}] Found community in database: ${dbCommunity.name}`);
            // Map Prisma result to SafeCommunity type
            const communityData: SafeCommunity = {
                id: String(dbCommunity.id), // Ensure ID is string
                name: dbCommunity.name,
                city: dbCommunity.city,
                state: dbCommunity.state,
                slug: dbCommunity.slug,
                description: dbCommunity.description ?? undefined,
                address: dbCommunity.address ?? undefined,
                zipCode: dbCommunity.zipCode ?? null,
                type: dbCommunity.type ?? undefined,
                amenities: dbCommunity.amenities ?? [],
                rating: dbCommunity.rating ?? undefined,
                reviewCount: dbCommunity.reviewCount ?? undefined,
                images: dbCommunity.images ?? [],
                phone: dbCommunity.phone ?? null,
                latitude: dbCommunity.latitude ?? null,
                longitude: dbCommunity.longitude ?? null,
            };
            return communityData;
          }
        } catch (dbError) {
          console.error(`[${city}/${slug}] Database error:`, dbError);
          // Fall through to static data fallback
        }
      } else {
        console.warn(`[${city}/${slug}] Prisma client not available, trying static data...`);
      }
      
      // Fallback to static data if database fetch failed or returned null
      const staticCommunity = findCommunityInStaticData(city, slug);
      if (staticCommunity) {
        console.log(`[${city}/${slug}] Using static data fallback for: ${staticCommunity.name}`);
        return convertToSafeCommunity(staticCommunity);
      }
      
      // If we reach here, we couldn't find the community in either source
      console.warn(`[${city}/${slug}] Community not found in database or static data.`);
      return null;
    } catch (error) {
      console.error(`[${city}/${slug}] Error fetching community data:`, error);
      
      // Last resort fallback to static data
      const staticCommunity = findCommunityInStaticData(city, slug);
      if (staticCommunity) {
        console.log(`[${city}/${slug}] Using static data last-resort fallback: ${staticCommunity.name}`);
        return convertToSafeCommunity(staticCommunity);
      }
      
      return null; // Return null only if all options fail
    }
}

// Refactored Page component
export default async function Page({ params }: { params: PageParams | undefined }) {
  
  console.log("Ohio community page: Rendering with params:", JSON.stringify(params, null, 2));

  // Validate params
  if (!params?.city || !params?.slug) {
    console.error("Ohio community page: Invalid or missing params.");
    notFound(); // Use Next.js notFound for invalid routes
  }
  
  const { city, slug } = params;

  // Fetch data using the helper function
  const communityData = await fetchCommunityData(city, slug);

  // If data fetch failed or community not found, trigger 404
  if (communityData === null) {
    console.log(`[${city}/${slug}] No valid community data found or fetch failed. Triggering notFound().`);
    notFound(); 
  }

  // Add safety checks to ensure required fields exist before rendering
  const safeData = {
    name: communityData.name || "Community Information",
    type: communityData.type || "Senior Living Community",
    description: communityData.description || "Information about this community is currently unavailable.",
    address: communityData.address || "Address information unavailable",
    amenities: Array.isArray(communityData.amenities) ? communityData.amenities : [],
    rating: communityData.rating,
    reviewCount: communityData.reviewCount,
    cityName: communityData.city || city.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
  };

  // Render the content if data is valid
  console.log(`[${city}/${slug}] Rendering CommunityContent with data for: ${safeData.name}`);
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-neutral-200 py-8">
        <div className="container mx-auto px-6 md:px-10 lg:px-20">
          {/* Pass sanitized data to the content component */}
          <CommunityContent 
            name={safeData.name}
            type={safeData.type}
            description={safeData.description}
            address={safeData.address}
            amenities={safeData.amenities}
            rating={safeData.rating}
            reviewCount={safeData.reviewCount}
            cityName={safeData.cityName} 
          />
        </div>
      </div>
    </div>
  );
} 