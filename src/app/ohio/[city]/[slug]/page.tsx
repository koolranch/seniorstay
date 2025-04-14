'use client';

export const dynamic = 'force-dynamic';

import { notFound } from "next/navigation";
import { communities, Community } from "@/lib/data/communities";
import { getCommunityPathFromObject } from "@/lib/utils/formatSlug";
import CommunityContent from "./CommunityContent";
import { prisma } from "@/lib/prisma";
import Link from 'next/link';
import { Metadata, ResolvingMetadata } from 'next';
import { slugify } from "@/lib/utils/formatSlug";
import { PrismaClientInitializationError } from "@prisma/client/runtime/library";
import path from 'path';
import fs from 'fs';
import React, { useState, useEffect } from 'react';
import ModalForm from '@/components/ModalForm';

// Optimize for static generation, error on unknown paths
export const dynamicParams = false; // Tell Next.js not to generate pages for paths not in generateStaticParams
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

// Define fallback community interface matching JSON structure
interface FallbackCommunity {
  id: number;
  name: string;
  city: string;
  state: string;
  slug: string;
}

// Function to load fallback communities from JSON file
function loadFallbackCommunities(): FallbackCommunity[] {
  try {
    const filePath = path.join(process.cwd(), 'src', 'lib', 'fallbackCommunities.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents) as FallbackCommunity[];
    
    console.warn('Using fallback communities data from JSON file');
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Failed to load fallback communities from JSON:', error);
    return [];
  }
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
      try {
        const dbCommunities = await prisma.community.findMany({
          where: { state: { equals: "Ohio", mode: 'insensitive' } },
          select: { city: true, slug: true },
        });

        if (dbCommunities && Array.isArray(dbCommunities) && dbCommunities.length > 0) {
          params = dbCommunities
            .filter(community => community && community.city && community.slug)
            .map((community: { city: string; slug: string }) => ({
              city: community.city.toLowerCase(), // Ensure lowercase for consistency
              slug: community.slug.toLowerCase(),
            }));
          
          if (params.length > 0) {
            usingDb = true;
            console.log(`Successfully generated ${params.length} static params from database.`);
          } else {
            console.warn("⚠️ Database returned communities but none had valid city/slug.");
          }
        } else {
          console.warn("⚠️ No Ohio communities found in the database for static param generation.");
        }
      } catch (innerDbError) {
        console.error("Error querying database:", innerDbError);
      }
    } else {
      console.warn("⚠️ Prisma client not available during static generation.");
    }
  } catch (dbError) {
    // Specifically check for Prisma initialization errors
    if (dbError instanceof PrismaClientInitializationError) {
      console.warn("⚠️ Prisma connection error during static param generation:", dbError.message);
      console.warn("Will use fallback JSON data instead");
    } else {
      console.warn("⚠️ Database error during static param generation:", dbError);
    }
    // Fallback strategy will be executed below if DB fails
  }

  // Fallback to JSON file if DB connection failed
  if (!usingDb || params.length === 0) {
    console.warn("Falling back to JSON file for static param generation.");
    try {
      const fallbackCommunities = loadFallbackCommunities();
      
      if (fallbackCommunities && Array.isArray(fallbackCommunities) && fallbackCommunities.length > 0) {
        const ohioCommunities = fallbackCommunities.filter(
          (community: FallbackCommunity) => 
            community && community.state &&
            (community.state === "Ohio" || community.state === "OH")
        );
        
        if (ohioCommunities.length > 0) {
          const jsonParams = ohioCommunities
            .filter(community => community && community.city && community.slug)
            .map((community: FallbackCommunity) => ({
              city: community.city.toLowerCase(), // Ensure lowercase for consistency
              slug: community.slug.toLowerCase(),
            }));
            
          params = params.concat(jsonParams);
          console.warn(`Added ${jsonParams.length} static params from fallback JSON data.`);
        } else {
          console.warn("No Ohio communities found in fallback JSON data.");
        }
      } else {
        console.warn("Fallback JSON file empty or not properly loaded.");
      }
    } catch (jsonError) {
      console.error("Error processing fallback JSON data:", jsonError);
    }
    
    // If JSON fallback failed or no Ohio communities in JSON, try static data as last resort
    if (params.length === 0) {
      console.warn("Falling back to local static data for static param generation.");
      try {
        if (Array.isArray(communities)) {
          const staticParams = communities
            .filter((community: Community) => 
              community && community.state && 
              (community.state === "Ohio" || community.state === "OH")
            )
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

          if (staticParams.length > 0) {
            params = params.concat(staticParams);
            console.log(`Added ${staticParams.length} static params from local fallback data.`);
          }
        } else {
          console.warn("Communities data is not properly initialized as an array");
        }
      } catch (localError) {
        console.error("Error generating static params from local data:", localError);
      }
    }
  }

  // Add a check for empty params before returning
  if (params.length === 0) {
    console.error("🚨 CRITICAL: No static params could be generated for Ohio communities from DB or fallbacks.");
    // Provide at least one hardcoded path to prevent build failure
    console.warn("Adding fallback hardcoded path for /ohio/cleveland/westview-manor");
    params = [{ city: 'cleveland', slug: 'westview-manor' }];
  }

  return params;
}

// Try to find a community in the static data array
function findCommunityInStaticData(city: string, slug: string): Community | null {
  if (!city || !slug || !Array.isArray(communities)) {
    console.warn(`[${city}/${slug}] Invalid parameters or communities data for findCommunityInStaticData`);
    return null;
  }
  
  try {
    console.log(`[${city}/${slug}] Attempting to find community in static data...`);
    
    // Normalize inputs for comparison
    const normalizedCity = city.toLowerCase();
    const normalizedSlug = slug.toLowerCase();
    
    // First, try to find by exact slug match
    let staticCommunity = communities.find(
      c => c && c.slug && c.slug.toLowerCase() === normalizedSlug
    );
    
    // If not found by slug, try by city + name combination
    if (!staticCommunity) {
      staticCommunity = communities.find(
        c => c && c.city && c.name && 
             c.city.toLowerCase() === normalizedCity && 
             slugify(c.name).toLowerCase() === normalizedSlug
      );
    }
    
    // One more attempt - more flexible matching
    if (!staticCommunity) {
      staticCommunity = communities.find(
        c => c && c.slug && normalizedSlug && (
             c.slug.toLowerCase().includes(normalizedSlug) || 
             normalizedSlug.includes(c.slug.toLowerCase())
        )
      );
    }
    
    if (staticCommunity && staticCommunity.name) {
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
  id?: number;
  name?: string;
  city?: string;
  state?: string;
  slug?: string;
  description?: string;
  address?: string;
  type?: string;
  services?: string[];
  amenities?: string[];
  rating?: number;
  reviewCount?: number;
  image?: string;
  phone?: string;
} | null): SafeCommunity {
  if (!community) {
    // Return a default SafeCommunity object if input is null
    return {
      id: 'unknown',
      name: 'Unknown Community',
      city: 'Unknown City',
      state: 'OH',
      slug: 'unknown-community',
      description: 'Information about this community is currently unavailable.',
      address: 'Address unavailable',
      type: 'Senior Living',
      amenities: [],
    };
  }
  
  // Ensure all required fields have values with fallbacks
  const cityValue = community.city || "Unknown City";
  const stateValue = community.state || "OH";
  const idValue = community.id || 0;
  
  return {
    id: String(idValue),
    name: community.name || "Unknown Community",
    city: cityValue,
    state: stateValue,
    slug: community.slug || `unknown-${idValue}`,
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
    if (!city || !slug) {
      console.warn(`Invalid parameters for fetchCommunityData: city=${city}, slug=${slug}`);
      return null;
    }
    
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

          // More explicit check to handle undefined/null responses
          if (dbCommunity && 
              typeof dbCommunity === 'object' && 
              dbCommunity.name && 
              dbCommunity.city && 
              dbCommunity.state && 
              dbCommunity.slug) {
            console.log(`[${city}/${slug}] Found community in database: ${dbCommunity.name}`);
            // Map Prisma result to SafeCommunity type with additional safety checks
            const communityData: SafeCommunity = {
                id: String(dbCommunity.id || 'unknown'), // Ensure ID is string
                name: dbCommunity.name || 'Unknown Community',
                city: dbCommunity.city || city,
                state: dbCommunity.state || 'OH',
                slug: dbCommunity.slug || slug,
                description: dbCommunity.description ?? undefined,
                address: dbCommunity.address ?? undefined,
                zipCode: dbCommunity.zip ?? null,
                type: "Senior Living",
                amenities: [],
                phone: dbCommunity.phone ?? null,
            };
            return communityData;
          } else {
            console.warn(`[${city}/${slug}] Database returned incomplete or invalid community data`);
            // Fall through to fallbacks
          }
        } catch (dbError) {
          if (dbError instanceof PrismaClientInitializationError) {
            console.warn(`[${city}/${slug}] Prisma connection error:`, dbError.message);
            console.warn(`[${city}/${slug}] Will use fallback JSON data instead`);
          } else {
            console.error(`[${city}/${slug}] Database error:`, dbError);
          }
          // Fall through to fallback data
        }
      } else {
        console.warn(`[${city}/${slug}] Prisma client not available, trying fallback data...`);
      }
      
      // Try fallback JSON file first
      try {
        const fallbackCommunities = loadFallbackCommunities();
        const fallbackCommunity = fallbackCommunities.find(
          (community: FallbackCommunity) => 
            community && community.slug && community.city &&
            community.slug.toLowerCase() === slug.toLowerCase() &&
            community.city.toLowerCase() === city.toLowerCase()
        );
        
        if (fallbackCommunity) {
          console.warn(`[${city}/${slug}] Using fallback JSON data for: ${fallbackCommunity.name}`);

          // *** ADD EXPLICIT CHECKS ***
          if (typeof fallbackCommunity.city !== 'string' || 
              typeof fallbackCommunity.state !== 'string' || 
              typeof fallbackCommunity.slug !== 'string' || 
              typeof fallbackCommunity.name !== 'string') {
             console.error(`[${city}/${slug}] Fallback JSON data for ${fallbackCommunity.id || 'unknown ID'} is malformed (missing/invalid city, state, slug, or name). Skipping JSON fallback.`);
             // Let execution continue to the next fallback (static data)
          } else {
             // Existing code to construct safeCommunity - now safe to access properties
             const safeCommunity: SafeCommunity = {
               id: String(fallbackCommunity.id || 'unknown'),
               name: fallbackCommunity.name, 
               city: fallbackCommunity.city, 
               state: fallbackCommunity.state, 
               slug: fallbackCommunity.slug, 
               description: `Information about ${fallbackCommunity.name} in ${fallbackCommunity.city}, ${fallbackCommunity.state} is currently being updated.`,
               address: `${fallbackCommunity.city}, ${fallbackCommunity.state}`,
               type: "Senior Living",
               amenities: [],
             };
             return safeCommunity; // Return the valid object
          }
        }
      } catch (jsonError) {
        console.error(`[${city}/${slug}] Error processing fallback JSON data:`, jsonError);
        // Fall through to static data
      }
      
      // Fallback to static data if JSON fetch failed or returned null
      try {
        const staticCommunity = findCommunityInStaticData(city, slug);
        if (staticCommunity) {
          console.log(`[${city}/${slug}] Using static data fallback for: ${staticCommunity.name}`);
          return convertToSafeCommunity(staticCommunity);
        }
      } catch (staticError) {
        console.error(`[${city}/${slug}] Error processing static data:`, staticError);
        // Fall through to return null
      }
      
      // If we reach here, we couldn't find the community in any source
      console.warn(`[${city}/${slug}] Community not found in database, JSON, or static data.`);
      return null;
    } catch (error) {
      console.error(`[${city}/${slug}] Error fetching community data:`, error);
      
      // Last resort fallback to static data
      try {
        const staticCommunity = findCommunityInStaticData(city, slug);
        if (staticCommunity) {
          console.log(`[${city}/${slug}] Using static data last-resort fallback: ${staticCommunity.name}`);
          return convertToSafeCommunity(staticCommunity);
        }
      } catch (e) {
        console.error(`[${city}/${slug}] Failed last-resort static data attempt:`, e);
      }
      
      return null; // Return null only if all options fail
    }
}

// Helper function to render a fallback UI when community isn't found or data is invalid
function renderFallbackUI(title: string, message: string, cityParam?: string) {
  const fallbackMessage = cityParam 
    ? `We couldn't find information for this senior living community in ${cityParam.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}, Ohio.` 
    : message;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-neutral-200 py-8">
        <div className="container mx-auto px-6 md:px-10 lg:px-20">
          <div className="max-w-3xl mx-auto text-center py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{title}</h1>
            <p className="text-lg text-gray-600 mb-8">{fallbackMessage}</p>
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <Link
                href="/ohio"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Browse Ohio Communities
              </Link>
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Refactored Page component - Now a Client Component
export default function Page({ params }: { params: PageParams | undefined }) {
  const [communityData, setCommunityData] = useState<SafeCommunity | null | 'loading' | 'error'>('loading');
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);
  const formspreeEndpoint = "https://formspree.io/f/xnnpaply"; // Add your endpoint here

  useEffect(() => {
    if (!params?.city || !params?.slug) {
      console.error("Ohio community page: Invalid or missing params.");
      setCommunityData('error');
      return;
    }

    const { city, slug } = params;
    let isMounted = true; // Prevent state update on unmounted component

    const loadData = async () => {
      console.log(`[${city}/${slug}] Starting data fetch...`);
      try {
        const fetchedData = await fetchCommunityData(city, slug);
        if (isMounted) {
          if (fetchedData) {
            console.log(`[${city}/${slug}] Data fetch successful:`, JSON.stringify(fetchedData, null, 2));
            setCommunityData(fetchedData);
          } else {
            console.warn(`[${city}/${slug}] No valid community data found or fetch failed.`);
            setCommunityData(null); // Explicitly set to null for 'not found' state
          }
        }
      } catch (error) {
        console.error(`[${city}/${slug}] Error in loadData:`, error);
        if (isMounted) {
          setCommunityData('error');
        }
      }
    };

    loadData();

    return () => {
      isMounted = false; // Cleanup function
    };
  }, [params]); // Rerun effect if params change

  // Loading state
  if (communityData === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-600">Loading community details...</p>
        {/* You could add a spinner here */}
      </div>
    );
  }

  // Error state
  if (communityData === 'error') {
     return renderFallbackUI("Error Loading Community", "We encountered an error trying to load the community details. Please try again later.", params?.city);
  }

  // Not found state
  if (!communityData) {
    return renderFallbackUI(
      "Community Not Found", 
      "", // Default message is overridden by cityParam
      params?.city // Pass the validated city param
    );
  }

  // --- Render the content if data is valid ---
  const currentCommunityName = communityData.name || "Unknown Community";

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-neutral-200 py-8">
        <div className="container mx-auto px-6 md:px-10 lg:px-20">
          {/* Pass sanitized data directly to the content component */}
          <CommunityContent 
            name={communityData.name || "Community Information"}
            type={communityData.type || "Senior Living Community"}
            description={communityData.description || "Information about this community is currently unavailable."}
            address={communityData.address || "Address information unavailable"}
            amenities={Array.isArray(communityData.amenities) ? communityData.amenities : []}
            rating={communityData.rating}
            reviewCount={communityData.reviewCount}
            cityName={communityData.city || "Fallback City Name"} 
          />

          {/* --- Add CTA Buttons Below Community Details --- */}
          <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setIsPricingModalOpen(true)}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              Get Pricing
            </button>
            <button
              onClick={() => setIsTourModalOpen(true)}
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              Schedule a Tour
            </button>
          </div>
        </div>
      </div>

      {/* --- Render Modals Conditionally --- */}
      <ModalForm
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        title={`Get Pricing for ${currentCommunityName}`}
        buttonText="Request Pricing Info"
        defaultSubject={`Pricing Request for ${currentCommunityName}`}
        communityName={currentCommunityName}
        formspreeUrl={formspreeEndpoint}
      />

      <ModalForm
        isOpen={isTourModalOpen}
        onClose={() => setIsTourModalOpen(false)}
        title={`Schedule a Tour at ${currentCommunityName}`}
        buttonText="Request Tour Appointment"
        defaultSubject={`Tour Request for ${currentCommunityName}`}
        communityName={currentCommunityName}
        formspreeUrl={formspreeEndpoint}
      />
    </div>
  );
}