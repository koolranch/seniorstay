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
    
    // Check if Prisma client is properly initialized
    if (!prisma?.community) {
      console.error("Ohio community page: Prisma client not initialized or database unreachable");
      throw new Error("Database connection error: Prisma client not initialized");
    }
    
    // Ensure you're handling community lookup safely
    const community = await prisma.community.findFirst({
      where: {
        slug: params.slug,
        city: {
          equals: params.city,
          mode: 'insensitive',
        },
      },
    });

    if (!community) {
      console.error("❌ Community not found:", params);
      return notFound();
    }

    // Helpful debug logs
    console.log("Rendering community page:", {
      name: community.name,
      city: community.city,
    });

    // Safely format city name for display
    const formattedCityName = city
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
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