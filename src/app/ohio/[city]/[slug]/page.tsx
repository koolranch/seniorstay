import { notFound } from "next/navigation";
import { communities } from "@/lib/data/communities";
import { getCommunityPathFromObject } from "@/lib/utils/formatSlug";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import CommunityContent from "./CommunityContent";

// Generate static params to pre-render valid paths
export async function generateStaticParams() {
  try {
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
export default function Page({ params }: { params: PageParams | undefined }) {
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
    
    // Try to find the community with proper error handling
    const community = communities.find((c) => {
      try {
        const path = getCommunityPathFromObject(c).toLowerCase();
        return (
          path.includes(city.toLowerCase()) &&
          path.includes(slug.toLowerCase())
        );
      } catch (error) {
        console.error(`Ohio community page: Error matching community path:`, error);
        return false;
      }
    });

    // If no community is found, show the not-found page
    if (!community) {
      console.error(`Ohio community page: Community not found for city=${city}, slug=${slug}`);
      return notFound();
    }

    console.log(`Ohio community page: Found community '${community.name}' for city=${city}, slug=${slug}`);

    // Safely format city name for display
    const formattedCityName = city
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Return the community page with the content
    return (
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
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