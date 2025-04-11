import { notFound } from "next/navigation";
import { communities } from "@/lib/data/communities";
import { getCommunityPathFromObject } from "@/lib/utils/formatSlug";
import CommunityContent from "./CommunityContent";
import { prisma } from "@/lib/prisma";

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
    description: "Community information is temporarily unavailable."
  };
};

// Use a plain function component without type constraints
export default async function Page({ params }: { params: PageParams | undefined }) {
  try {
    console.log("Ohio community page: Rendering with params:", JSON.stringify(params, null, 2));
    
    // Check if params exist
    if (!params) {
      console.error("Ohio community page: Missing params object");
      return notFound();
    }
    
    // Destructure with default values for safety
    const city = params.city || "";
    const slug = params.slug || "";
    
    // Validate that we have the required params
    if (!city || !slug) {
      console.error(`Ohio community page: Invalid params: city=${city}, slug=${slug}`);
      return notFound();
    }
    
    let community;
    
    try {
      // Check if Prisma client is properly initialized
      if (!prisma?.community) {
        console.error("Ohio community page: Prisma client not initialized or database unreachable");
        // Instead of throwing, we'll use fallback data
        community = getFallbackCommunity(city, slug);
      } else {
        // Ensure you're handling community lookup safely
        community = await prisma.community.findFirst({
          where: {
            slug: params.slug,
            city: {
              equals: params.city,
              mode: 'insensitive',
            },
          },
        });
      }
    } catch (dbError) {
      console.error("Database query error:", dbError);
      // Use fallback data if database query fails
      community = getFallbackCommunity(city, slug);
    }

    // If no community found and no fallback used, return 404
    if (!community) {
      console.error("❌ Community not found:", params);
      return notFound();
    }

    // Helpful debug logs - ensure we're safely accessing properties
    console.log("Rendering community page:", {
      name: community?.name || "Unknown",
      city: community?.city || "Unknown",
    });

    // Safely format city name for display - use the community object or fallback to params
    const formattedCityName = (community?.city || city)
      .split('-')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Now render safely
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="bg-white border-b border-neutral-200 py-8">
          <div className="container mx-auto px-6 md:px-10 lg:px-20">
            <CommunityContent 
              community={community} 
              cityName={formattedCityName} 
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    // Catch any unexpected errors
    console.error("Ohio community page: Fatal error:", error);
    return notFound();
  }
} 