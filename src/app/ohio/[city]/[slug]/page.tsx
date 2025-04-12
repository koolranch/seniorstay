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
  rating?: number | null;
  reviewCount?: number | null;
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
  try {
    // Safety check for params
    if (!params || !params.city || !params.slug) {
      return {
        title: 'Community Not Found | Senior Living in Ohio',
        description: 'Information about this senior living community is not available.',
      };
    }

    // Get city and slug with explicit defaults for maximum safety
    const city = params.city || "";
    const slug = params.slug || "";

    // Create a guaranteed safe community object using our fallback function
    // This avoids any database access which can fail during build
    const safeCommunity = getFallbackCommunity(city, slug);

    // Now we can safely use the community's data for metadata
    return {
      title: `${safeCommunity.name} | Senior Living in ${safeCommunity.city}, Ohio`,
      description: safeCommunity.description || 
        `Information about ${safeCommunity.name}, a senior living community in ${safeCommunity.city}, Ohio.`,
    };
  } catch (error) {
    // Ultimate fallback for metadata in case of any errors
    console.error('Error generating metadata:', error);
    return {
      title: 'Senior Living Community | Ohio',
      description: 'Information about senior living communities in Ohio.',
    };
  }
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
        zipCode: null, // zipCode not available in local data
        type: localFallback.type || "Senior Living Community",
        amenities: localFallback.amenities || [],
        rating: localFallback.rating || null,
        reviewCount: localFallback.reviewCount || null,
        // Use 'image' if available, otherwise default to empty array for 'images'
        images: localFallback.image ? [localFallback.image] : [], 
        phone: localFallback.phone || null,
        latitude: null, // latitude not available in local data
        longitude: null, // longitude not available in local data
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
      rating: null,
      reviewCount: null,
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
      rating: null,
      reviewCount: null,
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
    
    // Format city name for display - needed for both error and success cases
    const formattedCityName = city
      .split('-')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // Initialize community with explicit safe default values to ensure no undefined properties
    let community: SafeCommunity = {
      id: `safe-default-${slug}`,
      name: slug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      city: formattedCityName,
      state: "Ohio",
      slug: slug,
      description: "Community information is temporarily unavailable.",
      address: "Address unavailable",
      zipCode: null,
      type: "Senior Living Community",
      amenities: [],
      rating: null,
      reviewCount: null,
      images: [],
      phone: null,
      latitude: null,
      longitude: null,
    };
    
    try {
      // Safely check Prisma availability with double protection
      if (!prisma || !prisma.community) {
        console.warn("⚠️ Ohio community page: Prisma client not initialized or database unreachable");
        throw new Error("Database connection unavailable");
      }
      
      // Attempt database query with proper error handling
      const dbCommunity = await prisma.community.findFirst({
        where: {
          slug: {
            equals: slug,
            mode: 'insensitive',
          },
          city: {
            equals: city,
            mode: 'insensitive',
          },
        },
      });
      
      // If community found in DB, use it (overwriting our safe default)
      if (dbCommunity) {
        community = dbCommunity;
      } else {
        console.warn(`Community not found in database: ${city}/${slug}, using fallback data`);
        const fallbackCommunity = getFallbackCommunity(city, slug);
        // Only overwrite our safe default if fallback returns valid data
        if (fallbackCommunity && fallbackCommunity.name) {
          community = fallbackCommunity;
        }
      }
    } catch (dbError) {
      // Detailed error logging for all database-related issues
      console.error("Database connection or query error:", dbError);
      console.warn("Using fallback community data due to database error");
      const fallbackCommunity = getFallbackCommunity(city, slug);
      // Only overwrite our safe default if fallback returns valid data
      if (fallbackCommunity && fallbackCommunity.name) {
        community = fallbackCommunity;
      }
    }

    // Helpful debug logs - using safe access pattern
    console.log("Rendering community page:", {
      name: community.name,
      city: community.city
    });

    // Now render with our guaranteed safe community object
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="bg-white border-b border-neutral-200 py-8">
          <div className="container mx-auto px-6 md:px-10 lg:px-20">
            <CommunityContent 
              community={{
                name: community.name,
                type: community.type,
                description: community.description,
                address: community.address,
                amenities: community.amenities,
                rating: community.rating === null ? undefined : community.rating,
                reviewCount: community.reviewCount === null ? undefined : community.reviewCount
              }} 
              cityName={community.city} 
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