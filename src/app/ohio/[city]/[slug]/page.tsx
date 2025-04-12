import { notFound } from "next/navigation";
import { communities } from "@/lib/data/communities";
import { getCommunityPathFromObject } from "@/lib/utils/formatSlug";
import CommunityContent from "./CommunityContent";
import { prisma } from "@/lib/prisma";
import Link from 'next/link';

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

// Define the page params interface
interface PageParams {
  city: string;
  slug: string;
}

// Fallback data for when database is unreachable
const getFallbackCommunity = (city: string, slug: string) => {
  try {
    // Try to find a match in local data
    const fallbackCommunity = communities.find(c => 
      c.slug?.toLowerCase() === slug.toLowerCase() && 
      c.city?.toLowerCase() === city.toLowerCase()
    );
    
    if (fallbackCommunity) {
      console.log("Using fallback community data from local source:", fallbackCommunity.name);
      return fallbackCommunity;
    }
    
    // If no match found, create a minimal placeholder
    return {
      id: "local-fallback",
      name: slug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      city: city.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      state: "Ohio",
      slug: slug,
      description: "Community information is temporarily unavailable.",
      address: "Address unavailable",
      type: "Senior Living Community"
    };
  } catch (error) {
    console.error("Error creating fallback community:", error);
    // Return absolute minimum data to prevent crashes
    return {
      id: "error-fallback",
      name: "Community Information",
      city: city || "Unknown City",
      state: "Ohio",
      slug: slug || "unknown",
      description: "Community information is temporarily unavailable.",
      address: "Address unavailable",
      type: "Senior Living Community"
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
    
    let community = null;
    
    try {
      // Safely check Prisma availability with double protection
      if (!prisma || !prisma.community) {
        console.warn("⚠️ Ohio community page: Prisma client not initialized or database unreachable");
        throw new Error("Database connection unavailable");
      }
      
      // Attempt database query with proper error handling
      community = await prisma.community.findFirst({
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
      
      // If no community found in DB, use fallback
      if (!community) {
        console.warn(`Community not found in database: ${city}/${slug}, using fallback data`);
        community = getFallbackCommunity(city, slug);
      }
    } catch (dbError) {
      // Detailed error logging for all database-related issues
      console.error("Database connection or query error:", dbError);
      console.warn("Using fallback community data due to database error");
      community = getFallbackCommunity(city, slug);
    }

    // Final safety check - if we still don't have community data, show error UI
    if (!community) {
      console.error("❌ Failed to load or create community data:", params);
      return <CommunityErrorFallback cityName={formattedCityName} />;
    }

    // Helpful debug logs - ensure we're safely accessing properties
    console.log("Rendering community page:", {
      name: community?.name || "Unknown",
      city: community?.city || "Unknown",
    });

    // Safely format city name from community data or from params
    const displayCityName = (community?.city || formattedCityName);

    // Now render safely with complete community object
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="bg-white border-b border-neutral-200 py-8">
          <div className="container mx-auto px-6 md:px-10 lg:px-20">
            <CommunityContent 
              community={community} 
              cityName={displayCityName} 
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    // Catch any unexpected errors
    console.error("Ohio community page: Fatal error:", error);
    return <CommunityErrorFallback cityName={params?.city?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || "Unknown"} />;
  }
} 