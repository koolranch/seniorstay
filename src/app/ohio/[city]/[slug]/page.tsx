export const dynamic = 'force-dynamic';

import { notFound } from "next/navigation";
import { generateSEOContentForCommunities, getAllCommunities as getAllCommunitiesData } from "@/lib/data/communities";
import { communities, Community } from "@/lib/data/staticCommunities";
import { getCommunityPathFromObject } from "@/lib/utils/formatSlug";
import CommunityContent from "./CommunityContent";
import { prisma } from "@/lib/prisma";
import Link from 'next/link';
import { Metadata, ResolvingMetadata } from 'next';
import { slugify } from "@/lib/utils/formatSlug";
import { PrismaClientInitializationError } from "@prisma/client/runtime/library";
import path from 'path';
import fs from 'fs';
import React, { cache } from 'react';
import CommunityActions from '../../../../components/CommunityActions';

// Optimize for static generation, error on unknown paths
export const dynamicParams = false; // Tell Next.js not to generate pages for paths not in generateStaticParams
// Consider adding revalidate if ISR is desired later:
// export const revalidate = 3600; // Revalidate every hour

// Define the page params interface
interface PageParams {
  city: string;
  slug: string;
}

// Updated SafeCommunity interface for JSON-LD fields
interface SafeCommunity {
  id: string;
  name: string;
  city: string;
  state: string; // e.g., "OH"
  slug: string;
  description?: string | null; // Allow null
  address?: string | null;     // Full address string from DB
  zipCode?: string | null;
  type?: string;
  amenities?: string[]; // Derived from services
  services?: string[]; // Parsed from DB services string
  images?: string[];
  phone?: string | null;
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
    if (!fs.existsSync(filePath)) {
        console.error('Fallback JSON file not found:', filePath);
        return [];
    }
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents) as FallbackCommunity[];
    
    console.warn('Using fallback communities data from JSON file');
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Failed to load fallback communities from JSON:', error);
    return [];
  }
}

// SeoDataItem interface
interface SeoDataItem {
  slug: string;
  seo: {
    titleTag: string;
    metaDescription: string;
    h1: string;
    h2: string;
  };
}

const getCachedSeoData = cache(async (): Promise<SeoDataItem[]> => {
  console.log("Fetching and caching SEO data for all communities...");
  try {
    const seoData = await generateSEOContentForCommunities(); 
    console.log(`Successfully fetched SEO data for ${seoData.length} communities.`);
    return seoData;
  } catch (error) {
    console.error("Error fetching SEO data:", error);
    return [];
  }
});

// Add a cached fetcher for all community data needed for related links
const getCachedAllCommunities = cache(async (): Promise<SafeCommunity[]> => {
  console.log("Fetching and caching all communities data...");
  try {
    // This should fetch data suitable for SafeCommunity interface (or adapt it)
    // It needs id, name, city, state, slug, services
    // Option 1: Use the existing getAllCommunitiesData if it returns the right shape
    // Option 2: Create a dedicated fetcher or adapt getAllCommunitiesData return type
    
    // Assuming getAllCommunitiesData returns InternalCommunity[], adapt it:
    const internalCommunities = await getAllCommunitiesData(); 
    const safeCommunities = internalCommunities.map(c => {
        // Minimal conversion needed for related links
        const servicesArray = parseServices(c.services?.join(',')); // Assuming services is array in InternalCommunity
        return {
            id: c.id,
            name: c.name,
            city: c.city,
            state: c.state,
            slug: c.slug,
            // Add services if needed for filtering, ensure it's string[]
            services: servicesArray,
            // Other fields can be omitted if only needed for links
        } as SafeCommunity; // Cast or build full SafeCommunity if required elsewhere
    });
    
    console.log(`Successfully fetched and adapted data for ${safeCommunities.length} communities.`);
    return safeCommunities;
  } catch (error) {
    console.error("Error fetching all communities data:", error);
    return []; // Return empty array on error
  }
});

// Helper functions
function parseServices(services: string | null | undefined): string[] {
  if (!services) return [];
  return services.split(',').map(s => s.trim()).filter(s => s.length > 0);
}
function determineType(services: string[]): string {
  // Simplified logic based on communities.ts, adapt as needed
  if (services.includes('Independent Living') && services.includes('Assisted Living')) return 'Continuing Care';
  if (services.includes('Independent Living')) return 'Independent Living';
  if (services.includes('Assisted Living')) return 'Assisted Living';
  if (services.includes('Memory Care')) return 'Memory Care';
  return 'Senior Living';
}
function generateAmenities(services: string[]): string[] {
  // Simplified logic based on communities.ts, adapt as needed
  const base = ["24/7 Staff", "Dining Options", "Activities"];
  if (services.includes('Assisted Living')) base.push("Personal Care");
  if (services.includes('Memory Care')) base.push("Secure Environment");
  return [...new Set(base)];
}

// UPDATED fetchCommunityData with fallback logic
async function fetchCommunityData(city: string, slug: string): Promise<SafeCommunity | null> {
  if (!city || !slug) return null;
  console.log(`[${city}/${slug}] fetchCommunityData: Fetching...`);
  let communityData: SafeCommunity | null = null;

  try {
    // Try fetching from database first
    const dbCommunity = await prisma.community.findFirst({
      where: { 
        slug: { equals: slug, mode: 'insensitive' },
      },
      select: { 
        id: true,
        name: true,
        city: true,
        state: true,
        slug: true,
        description: true,
        address: true,
        zip: true,
        phone: true,
        services: true,
      }
    });

    if (dbCommunity) {
      console.log(`[${city}/${slug}] fetchCommunityData: Found in DB: ${dbCommunity.name}`);
      const servicesArray = parseServices(dbCommunity.services);
      const derivedType = determineType(servicesArray);
      const derivedAmenities = generateAmenities(servicesArray); 

      communityData = {
        id: dbCommunity.id,
        name: dbCommunity.name,
        city: dbCommunity.city,
        state: dbCommunity.state,
        slug: dbCommunity.slug,
        description: dbCommunity.description,
        address: dbCommunity.address,
        zipCode: dbCommunity.zip,
        type: derivedType,
        amenities: derivedAmenities,
        services: servicesArray,
        phone: dbCommunity.phone,
      };
      return communityData;
    } else {
      console.warn(`[${city}/${slug}] fetchCommunityData: Not found in DB. Attempting fallback to static data...`);
      // Fallback to static data if not found in DB
      const staticCommunity = findCommunityInStaticData(city, slug);
      if (staticCommunity) {
        console.log(`[${city}/${slug}] fetchCommunityData: Found in static data: ${staticCommunity.name}`);
        communityData = convertToSafeCommunity(staticCommunity);
        return communityData;
      } else {
        console.warn(`[${city}/${slug}] fetchCommunityData: Not found in static data either.`);
        return null; // Not found in DB or static data
      }
    }
  } catch (error) {
    // If database connection fails, attempt fallback
    if (error instanceof PrismaClientInitializationError) {
      console.warn(`[${city}/${slug}] fetchCommunityData: Prisma connection error. Attempting fallback to static data...`, error.message);
    } else {
      console.error(`[${city}/${slug}] fetchCommunityData: DB error occurred. Attempting fallback to static data...`, error);
    }
    
    // Attempt fallback to static data on any DB error
    try {
      const staticCommunity = findCommunityInStaticData(city, slug);
      if (staticCommunity) {
        console.log(`[${city}/${slug}] fetchCommunityData: Found in static data after DB error: ${staticCommunity.name}`);
        communityData = convertToSafeCommunity(staticCommunity);
        return communityData;
      } else {
        console.warn(`[${city}/${slug}] fetchCommunityData: Not found in static data after DB error.`);
        return null; // Not found in static data after error
      }
    } catch (fallbackError) {
      console.error(`[${city}/${slug}] fetchCommunityData: Error during static data fallback:`, fallbackError);
      return null; // Error during fallback attempt
    }
  }
}

// Updated generateMetadata to ONLY handle title and description
export async function generateMetadata(
  { params }: { params: PageParams | undefined },
  parent: ResolvingMetadata
): Promise<Metadata> {
  if (!params?.city || !params.slug) {
    return { title: 'Community Not Found', description: 'Community data unavailable.' };
  }

  const { city, slug } = params;
  const defaultTitle = `${slug.replace(/-/g, ' ')} | Senior Living in ${city.replace(/-/g, ' ')}, OH`;
  const defaultDescription = `Find information about ${slug.replace(/-/g, ' ')} in ${city.replace(/-/g, ' ')}, Ohio.`;

  try {
    // Fetch necessary data
    const communityData = await fetchCommunityData(city, slug); 
    const allSeoData = await getCachedSeoData();
    const currentSeoData = allSeoData.find(item => item.slug === slug);

    // Determine Title and Description
    const title = currentSeoData?.seo?.titleTag || communityData?.name || defaultTitle;
    const description = currentSeoData?.seo?.metaDescription || communityData?.description || defaultDescription;
    
    // Return only title and description
    return {
      title,
      description,
    };

  } catch (error) {
    console.error(`[${city}/${slug}] Error generating metadata:`, error);
    return { title: defaultTitle, description: defaultDescription }; // Fallback metadata
  }
}

// Re-enable generateStaticParams using the new safe getAllCommunitiesData
export async function generateStaticParams(): Promise<PageParams[]> {
  try {
    console.log("Generating static params using getAllCommunitiesData...");
    const allCommunities = await getAllCommunitiesData(); // Fetches from DB or Fallback

    if (!allCommunities || allCommunities.length === 0) {
      console.error("🚨 CRITICAL: No communities found from getAllCommunitiesData for generateStaticParams.");
      // Return a minimal fallback or throw error to fail build
      return [{ city: 'cleveland', slug: 'westwood-place' }]; 
    }

    const params = allCommunities
      // Filter for valid Ohio communities with necessary data
      .filter(community => 
         community && 
         community.city && 
         community.slug && 
         community.state && 
         (community.state.toUpperCase() === 'OH')
      )
      .map(community => ({
        // Ensure city parameter is correctly slugified for URL matching
        city: slugify(community.city).toLowerCase(), 
        slug: community.slug.toLowerCase(),
      }));

    if (params.length === 0) {
      console.warn("⚠️ No valid Ohio communities found to generate static params after filtering.");
      // Consider fallback if needed
      return [{ city: 'cleveland', slug: 'westwood-place' }];
    }

    // Deduplicate params
    const uniqueParams = Array.from(new Map(params.map(p => [`${p.city}-${p.slug}`, p])).values());
    console.log(`Successfully generated ${uniqueParams.length} unique static params.`);
    return uniqueParams;

  } catch (error) {
    console.error("🚨 CRITICAL: Error occurred during generateStaticParams:", error);
    // Provide a minimal fallback to prevent build failure if possible
    console.warn("Providing minimal fallback static params due to error.");
    return [{ city: 'cleveland', slug: 'westwood-place' }];
  }
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
function convertToSafeCommunity(community: Community | null): SafeCommunity {
  if (!community) {
    return {
      id: 'unknown', name: 'Unknown Community', city: 'Unknown City', state: 'OH', slug: 'unknown-community',
      description: 'Information about this community is currently unavailable.', address: 'Address unavailable',
      type: 'Senior Living', amenities: [], services: [],
    };
  }
  const cityValue = community.city || "Unknown City";
  const stateValue = community.state || "OH";
  const idValue = community.id || 0;
  const nameValue = community.name || "Unknown Community";
  const servicesArray = community.services || [];
  
  return {
    id: String(idValue),
    name: nameValue,
    city: cityValue,
    state: stateValue,
    slug: community.slug || slugify(`${nameValue}-${cityValue}-${stateValue}`),
    description: community.description || `Info about ${nameValue} in ${cityValue}, ${stateValue}.`,
    address: community.address || `${cityValue}, ${stateValue}`,
    zipCode: undefined, // Static data likely doesn't have zip
    type: community.type || determineType(servicesArray),
    amenities: Array.isArray(community.amenities) ? community.amenities : generateAmenities(servicesArray),
    services: servicesArray, // Store parsed/available services
    images: community.image ? [community.image] : [],
    phone: community.phone || null,
  };
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

// Updated Page component
export default async function Page({ params }: { params: PageParams | undefined }) {
  if (!params?.city || !params?.slug) {
    console.error("Ohio community page: Invalid or missing params.");
    return renderFallbackUI("Invalid Page Request", "The requested community page URL is invalid.", undefined);
  }

  const { city, slug } = params;
  let communityData: SafeCommunity | null = null;
  let seoContent: SeoDataItem['seo'] | null = null; 
  let allCommunitiesDataForRelated: SafeCommunity[] = []; // Variable for related communities
  let errorOccurred = false;

  console.log(`[${city}/${slug}] Starting server-side fetch for page...`);
  try {
    // Fetch main data, SEO data, and all communities data in parallel
    const [fetchedData, allSeoData, allCommunities] = await Promise.all([
        fetchCommunityData(city, slug),       // Fetches specific community
        getCachedSeoData(),                // Fetches SEO data (cached)
        getCachedAllCommunities()          // Fetches all communities (cached)
    ]);
    
    communityData = fetchedData;
    allCommunitiesDataForRelated = allCommunities; // Store fetched data

    // Process SEO data
    const currentSeoData = allSeoData.find(item => item.slug === slug);
    if (currentSeoData?.seo) {
        seoContent = currentSeoData.seo;
    } else {
         console.warn(`[${city}/${slug}] SEO content not found.`);
    }

    if (!communityData) {
        console.warn(`[${city}/${slug}] No valid community data found.`);
    }
  } catch (error) {
    console.error(`[${city}/${slug}] Error fetching page data:`, error);
    errorOccurred = true; 
  }

  // Error state
  if (errorOccurred) {
     return renderFallbackUI("Error Loading Community", "We encountered an error trying to load the community details.", city);
  }

  // Not found state
  if (!communityData) {
    const fallbackTitle = seoContent?.h1 || "Community Not Found";
    return renderFallbackUI(fallbackTitle, "", city);
  }

  // --- Filter Related Communities --- 
  const relatedCommunities = allCommunitiesDataForRelated
      // Ensure communityData and its services are valid before filtering
      .filter(c => c.slug !== communityData!.slug && communityData?.services)
      .filter(c => 
          c.city === communityData!.city || 
          // Check if services exist on `c` before trying to access them
          (c.services && c.services.some(s => communityData!.services!.includes(s)))
      )
      .slice(0, 4); // Limit to top 4

  // --- Construct JSON-LD --- 
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: communityData.name,
    description:
      communityData.description ??
      `Learn about ${communityData.name}, a senior living community in ${communityData.city}, OH.`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: communityData.address || undefined, // Omit if null/empty
      addressLocality: communityData.city,
      addressRegion: communityData.state, // Use state from data (e.g., "OH")
      postalCode: communityData.zipCode || undefined, // Omit if null/empty
      addressCountry: 'US',
    },
    url: `https://www.seniorstay.com/ohio/${slugify(communityData.city).toLowerCase()}/${communityData.slug}`,
    telephone: communityData.phone || undefined, // Omit if null/empty
    // aggregateRating omitted as rating is not available
    // Map directly over services array (already string[])
    amenityFeature: (communityData.services && communityData.services.length > 0) 
      ? communityData.services.map((service) => ({
          '@type': 'LocationFeatureSpecification',
          name: service.trim(),
          value: true,
        }))
      : undefined, // Omit if no services
  };

  // Clean up undefined properties more robustly (optional but good practice)
  if (!jsonLd.address.streetAddress) delete jsonLd.address.streetAddress;
  if (!jsonLd.address.postalCode) delete jsonLd.address.postalCode;
  if (!jsonLd.telephone) delete jsonLd.telephone;
  if (!jsonLd.amenityFeature) delete jsonLd.amenityFeature;

  // --- Prepare page content --- 
  const h1Text = seoContent?.h1 || communityData.name;
  const h2Text = seoContent?.h2 || `${communityData.type || "Senior Living"} Community in ${communityData.city}`;

  return (
    <>
      {/* Inject JSON-LD Script */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        key="community-jsonld"
      />

      {/* Main Page Structure */}
      <div className="bg-gray-50 min-h-screen">
        <div className="bg-white border-b border-neutral-200 py-8">
          <div className="container mx-auto px-6 md:px-10 lg:px-20">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{h1Text}</h1>
            <h2 className="text-xl md:text-2xl text-blue-600 font-semibold mb-6">{h2Text}</h2>
            <CommunityContent
              name={communityData.name}
              type={communityData.type || "Senior Living"}
              description={communityData.description || ""}
              address={communityData.address || ""}
              amenities={communityData.amenities || []}
              cityName={communityData.city}
            />
            <div className="mt-8 pt-8 border-t border-gray-200">
              <CommunityActions communityName={communityData.name} />
            </div>

            {/* --- Related Communities Section --- */}
            {relatedCommunities.length > 0 && (
              <section className="mt-16 pt-10 border-t border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Nearby Senior Living Options</h2>
                <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {relatedCommunities.map((community) => (
                    <li key={community.slug} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                      <Link
                        // Ensure city part of URL is slugified
                        href={`/ohio/${slugify(community.city).toLowerCase()}/${community.slug}`}
                        className="block p-4"
                      >
                        <h3 className="text-lg font-semibold text-blue-700 hover:underline mb-1 truncate">{community.name}</h3>
                        <p className="text-sm text-gray-600">{community.city}, {community.state}</p>
                        {/* Optional: Add type or a key service snippet */} 
                        {/* <p className="text-xs text-gray-500 mt-1">{determineType(community.services || [])}</p> */} 
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </div>
    </>
  );
}