import { notFound } from "next/navigation";
import { communities } from "@/lib/data/communities";
import { getCommunityPathFromObject } from "@/lib/utils/formatSlug";
import CommunityContent from "./CommunityContent";
import { prisma } from "@/lib/prisma";
import Link from 'next/link';
import { Metadata, ResolvingMetadata } from 'next';

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

// Generate static params to pre-render valid paths
export async function generateStaticParams() {
  try {
    // Check if we can access the database during build
    try {
      if (!prisma?.community) {
        console.warn("⚠️ Prisma client not initialized during static generation, falling back to local data");
        // Continue with local data
      }
    } catch (dbError) {
      console.warn("⚠️ Database unreachable during build, using local data for static paths:", dbError);
      // Continue with local data
    }

    // Create combinations of city/slug from communities data
    return communities
      .filter(community => community.state === "Ohio" || community.state === "OH")
      .map((community) => {
        const path = getCommunityPathFromObject(community);
        const pathParts = path.split('/');
        
        // Safely get city and slug from the path
        if (pathParts.length >= 2) {
          return {
            city: pathParts[pathParts.length - 2].toLowerCase(),
            slug: pathParts[pathParts.length - 1].toLowerCase()
          };
        }
        return null;
      })
      .filter(Boolean); // Remove any null entries
  } catch (error) {
    console.error("Error generating static params for Ohio communities:", error);
    return [];
  }
}

// Fallback data for when database is unreachable
const getFallbackCommunity = (city: string, slug: string): SafeCommunity => {
  console.warn(`⚠️ Using fallback community data for ${city}/${slug}`); // Add warning
  try {
    // Try to find a match in local data first (less likely now, but keep as secondary fallback)
    const localFallback = communities.find(c => 
      c.slug?.toLowerCase() === slug.toLowerCase() && 
      c.city?.toLowerCase() === city.toLowerCase()
    );
    
    if (localFallback) {
      console.log("Using fallback community data from local source:", localFallback.name);
      // Ensure local fallback also has necessary fields
      return {
        id: (localFallback.id ? String(localFallback.id) : `local-${slug}`),
        name: localFallback.name || "Community Name Unavailable",
        city: localFallback.city || city.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        state: localFallback.state || "Ohio",
        slug: localFallback.slug || slug,
        description: localFallback.description || "Community information is temporarily unavailable.",
        address: localFallback.address || "Address unavailable",
        zipCode: null, 
        type: localFallback.type || "Senior Living Community",
        amenities: localFallback.amenities || [],
        rating: localFallback.rating ?? undefined,
        reviewCount: localFallback.reviewCount ?? undefined,
        // Use 'image' if available, otherwise default to empty array for 'images'
        images: localFallback.image ? [localFallback.image] : [], 
        phone: localFallback.phone || null,
        latitude: null, 
        longitude: null, 
        // Add any other fields from your Prisma schema with defaults
      };
    }
    
    // If no local match, create a comprehensive placeholder
    return {
      id: `fallback-${slug}`,
      name: slug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), // Generate name from slug
      city: city.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), // Generate city from param
      state: "Ohio",
      slug: slug,
      description: "Community information is temporarily unavailable due to a connection issue. Please try again later.",
      address: "Address unavailable",
      zipCode: null,
      type: "Senior Living Community",
      amenities: [],
      rating: undefined,
      reviewCount: undefined,
      images: [],
      phone: null,
      latitude: null,
      longitude: null,
      // Add any other fields from your Prisma schema with defaults
    };
  } catch (error) {
    console.error("Error creating fallback community:", error);
    // Return absolute minimum safe data in case of error during fallback creation
    return {
      id: "error-fallback",
      name: "Community Information Error",
      city: city || "Unknown City",
      state: "Ohio",
      slug: slug || "unknown",
      description: "Could not load community information due to an error.",
      address: "Address unavailable",
      zipCode: null,
      type: "Senior Living Community",
      amenities: [],
      rating: undefined,
      reviewCount: undefined,
      images: [],
      phone: null,
      latitude: null,
      longitude: null,
    };
  }
};

// Error fallback component when community data can't be loaded
const CommunityErrorFallback = ({ cityName }: { cityName: string }) => {
  return (
    <div className="bg-white border-b border-neutral-200 py-8">
      <div className="container mx-auto px-6 md:px-10 lg:px-20">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1b4d70] mb-4">
          Community Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          We couldn't load this community information for {cityName}, Ohio. Please try again later.
        </p>
        <Link href="/ohio" className="text-[#1b4d70] hover:underline">
          View all Ohio communities
        </Link>
      </div>
    </div>
  );
};

// Use a plain function component without type constraints
export default async function Page({ params }: { params: PageParams | undefined }) {
  // Wrap the entire function in try/catch for maximum safety
  try {
    console.log("Ohio community page: Rendering with params:", JSON.stringify(params, null, 2));
    
    // Check if params exist
    if (!params) {
      console.error("Ohio community page: Missing params object");
      return <CommunityErrorFallback cityName="Unknown" />;
    }
    
    // Destructure with default values for safety
    const city = params.city || "";
    const slug = params.slug || "";
    
    // Validate that we have the required params
    if (!city || !slug) {
      console.error(`Ohio community page: Invalid params: city=${city}, slug=${slug}`);
      return <CommunityErrorFallback cityName={city || "Unknown"} />;
    }
    
    // Format city name just in case needed for error fallback
    const formattedCityName = city
      .split('-')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Initialize community directly with a guaranteed safe fallback object
    // We might not need this if we always return ErrorFallback on fail/missing
    // const community: SafeCommunity = getFallbackCommunity(city, slug);
    let communityData: SafeCommunity | null = null; // Use null initially
    
    try {
      // Safely check Prisma availability 
      if (!prisma || !prisma.community) {
        console.warn("⚠️ Ohio community page: Prisma client not initialized or database unreachable");
        throw new Error("Database connection unavailable");
      }
      
      // Attempt database query
      console.log(`Attempting DB query for ${city}/${slug}...`);
      const dbCommunity = await prisma.community.findFirst({
        where: {
          slug: { equals: slug, mode: 'insensitive' },
          city: { equals: city, mode: 'insensitive' },
        },
      });
      console.log(`DB query result for ${city}/${slug}:`, dbCommunity ? `Found ID ${dbCommunity.id}` : "Not Found");
      
      // If community NOT found in DB, render the error fallback immediately
      if (!dbCommunity) {
        console.warn(`Community not found in database: ${city}/${slug}. Rendering error fallback.`);
        return <CommunityErrorFallback cityName={formattedCityName} />;
      }

      // If community found, process it into the SafeCommunity format
      if (dbCommunity.name && dbCommunity.city) { // Basic validation
          communityData = {
            // Start with a minimal safe structure
            id: String(dbCommunity.id),
            name: dbCommunity.name,
            city: dbCommunity.city,
            state: dbCommunity.state,
            slug: dbCommunity.slug,
            // Fill in optional fields safely
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
      } else {
           console.error(`❌ DB record for ${city}/${slug} missing critical fields (name/city). Rendering error fallback.`);
           return <CommunityErrorFallback cityName={formattedCityName} />;
      }

    } catch (dbError) {
      // If ANY database error occurs, render the error fallback immediately
      console.error("Database connection or query error:", dbError);
      console.warn(`Rendering error fallback for ${city}/${slug} due to DB error.`);
      return <CommunityErrorFallback cityName={formattedCityName} />;
    }

    // If we reach here, communityData MUST be valid (not null)
    if (!communityData) {
        // This should be theoretically unreachable due to the checks above, but acts as a final safeguard
        console.error("❌ Fatal Error: communityData is null despite checks. Params:", params);
        return <CommunityErrorFallback cityName={formattedCityName || "Unknown"} />;
    }

    // Helpful debug logs - using safe access pattern
    console.log("Rendering community page with DB data:", {
      name: communityData.name,
      city: communityData.city
    });

    // Render CommunityContent ONLY with successful DB data
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="bg-white border-b border-neutral-200 py-8">
          <div className="container mx-auto px-6 md:px-10 lg:px-20">
            <CommunityContent 
              name={communityData.name}
              type={communityData.type}
              description={communityData.description}
              address={communityData.address}
              amenities={communityData.amenities}
              rating={communityData.rating}
              reviewCount={communityData.reviewCount}
              cityName={communityData.city} 
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    // Catch any unexpected errors
    console.error("Ohio community page: Fatal error:", error);
    return <CommunityErrorFallback cityName={params?.city ? params.city.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : "Unknown"} />;
  }
} 