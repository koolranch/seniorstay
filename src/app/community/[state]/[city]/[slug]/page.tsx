import type { Metadata } from "next";
// import { communities } from '@/lib/data/communities';
import { formatSlug, formatLocation } from '@/lib/utils/formatSlug';
import CommunityClient from './CommunityClient';
import Script from 'next/script';
import { notFound } from "next/navigation";
import Link from 'next/link';
import prisma from '@/lib/db'; // Import the shared Prisma instance
// Import the generated Community type
import type { Community } from '@prisma/client'; 
import fs from 'fs';
import path from 'path';

// Function to load fallback communities from JSON
async function loadFallbackCommunitiesForStaticParams() {
  try {
    console.log('Falling back to static community data for generateStaticParams...');
    const filePath = path.join(process.cwd(), 'src/lib/data/fallback-communities.json');
    
    if (!fs.existsSync(filePath)) {
      console.error('Fallback communities file not found:', filePath);
      return [];
    }
    
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const communities = JSON.parse(fileContents);
    
    if (!Array.isArray(communities)) {
      console.error('Fallback communities data is not an array.');
      return [];
    }
    
    console.log(`Loaded ${communities.length} communities from fallback JSON for static params.`);
    return communities;
  } catch (error) {
    console.error('Failed to load fallback communities from JSON:', error);
    return [];
  }
}

export async function generateStaticParams() {
  console.log('generateStaticParams: Fetching Ohio communities...');
  try {
    const communities = await prisma.community.findMany({
      where: {
        state: 'OH',
      },
      select: {
        slug: true,
        city: true,
        state: true,
      },
    });

    console.log(`generateStaticParams: Found ${communities.length} Ohio communities.`);

    const params = communities.map((community) => ({
      state: community.state.toLowerCase(),
      city: community.city.toLowerCase(),
      slug: community.slug,
    }));

    return params;
  } catch (error) {
    console.error('generateStaticParams: Failed to fetch communities from database:', error);
    
    // Instead of throwing an error, use fallback data
    const fallbackCommunities = await loadFallbackCommunitiesForStaticParams();
    
    // Filter for Ohio communities
    const ohioCommunities = fallbackCommunities.filter(
      (community) => community.state && community.state.toUpperCase() === 'OH'
    );
    
    console.log(`Using ${ohioCommunities.length} fallback Ohio communities for static paths.`);
    
    const params = ohioCommunities.map((community) => ({
      state: community.state.toLowerCase(),
      city: community.city.toLowerCase(),
      slug: community.slug,
    }));
    
    return params;
  }
}

interface PageParams {
  state: string;
  city: string;
  slug: string;
}

interface Props {
  params: Promise<PageParams>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  let resolvedParams: PageParams;
  let community: Community | null = null; // Initialize community as potentially null
  try {
    resolvedParams = await params; // Resolve the promise
    console.log('Metadata: Looking for community with params:', JSON.stringify(resolvedParams, null, 2));

    if (!resolvedParams || !resolvedParams.state || !resolvedParams.city || !resolvedParams.slug) {
      console.error("Metadata Error: Missing required route params:", JSON.stringify(resolvedParams, null, 2));
      return {
        title: "Community Not Found | SeniorStay",
        description: "The requested senior living community could not be found.",
      };
    }

    // Fetch the specific community using Prisma with the unique slug
    community = await prisma.community.findUnique({
      where: {
        slug: resolvedParams.slug, // Use the unique slug field for lookup
      },
    });

    if (!community) {
      console.error('Metadata Error: Community not found for params:',
        `state=${resolvedParams.state}, city=${resolvedParams.city}, slug=${resolvedParams.slug}`);
      // Use notFound() for App Router instead of returning metadata for a non-existent page
      return notFound();
    }

    // Add safety checks for community properties
    if (!community.name || !community.city || !community.state) {
       console.error('Metadata Error: Community is missing required properties:',
         JSON.stringify({
           hasName: !!community.name,
           hasCity: !!community.city,
           hasState: !!community.state
         }, null, 2));
     }

    // Access community.services (should exist now)
    const services = community.services || "various services"; 

    const title = `${community.name} | Senior Living in ${community.city}, ${community.state} | SeniorStay`;
    const description = `Learn more about ${community.name}, offering ${services} in ${community.city}, ${community.state}. Schedule a tour or request pricing today.`;
    const imageUrl = community.imageUrl || "";
    const canonicalUrl = `https://seniorstay.com/community/${resolvedParams.state}/${resolvedParams.city}/${resolvedParams.slug}`;

    // Generate structured data for rich search results with safe property access
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": community.name || "",
      "description": description, // Use generated description
      "image": imageUrl,
      "url": `https://seniorstay.com/community/${resolvedParams.state}/${resolvedParams.city}/${resolvedParams.slug}`,
      "telephone": community.phone || "",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": community.address || "",
        "addressLocality": community.city || "",
        "addressRegion": community.state || "",
        "postalCode": community.zip || "",
        "addressCountry": "US"
      },
      "offers": {
        "@type": "Offer",
        "category": services
      }
      // Add other fields back if they exist in your schema (rating, amenities, etc.)
    };

    console.log('Metadata: Successfully generated for community:', community.name);

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `${community.name} senior living community in ${community.city}, ${community.state}`
          }
        ],
        type: 'website',
        url: `https://seniorstay.com/community/${resolvedParams.state}/${resolvedParams.city}/${resolvedParams.slug}`,
        siteName: 'SeniorStay'
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl]
      },
      alternates: {
        canonical: `https://seniorstay.com/community/${resolvedParams.state}/${resolvedParams.city}/${resolvedParams.slug}`
      }
    };
  } catch (error) {
    console.error("Metadata Fatal Error:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace available");
    // Propagate the error or return generic error metadata
     return {
       title: "Error Loading Community | SeniorStay",
       description: "There was an error loading the metadata for this community.",
     };
  }
}

export default async function Page(props: Props) {
  let resolvedParams: PageParams;
  let community: Community | null = null; // Initialize community
  try {
    resolvedParams = await props.params;
    console.log('Community Page: Starting render with params:', JSON.stringify(resolvedParams, null, 2));

    if (!resolvedParams || !resolvedParams.state || !resolvedParams.city || !resolvedParams.slug) {
      console.error("Community Page Error: Missing required route params:", JSON.stringify(resolvedParams, null, 2));
      return notFound();
    }

    console.log('Community Page: Looking for community with params:',
      `state=${resolvedParams.state}, city=${resolvedParams.city}, slug=${resolvedParams.slug}`);

    // Fetch the specific community using Prisma
    community = await prisma.community.findUnique({
       where: {
         slug: resolvedParams.slug, // Use unique slug
       },
    });

    if (!community) {
      console.error('Community Page Error: Community not found for params:',
        `state=${resolvedParams.state}, city=${resolvedParams.city}, slug=${resolvedParams.slug}`);
      return notFound();
    }

    // Generate structured data with safe fallbacks for all properties
    const structuredData = {
       "@context": "https://schema.org",
       "@type": "LocalBusiness", 
       "name": community.name || "",
       "description": `Learn more about ${community.name || "this community"}, offering ${community.services || "various services"} in ${community.city || ""}, ${community.state || ""}.`,
       "image": community.imageUrl || "",
       "url": `https://seniorstay.com/community/${resolvedParams.state}/${resolvedParams.city}/${resolvedParams.slug}`,
       "telephone": community.phone || "",
       "address": {
         "@type": "PostalAddress",
         "streetAddress": community.address || "",
         "addressLocality": community.city || "",
         "addressRegion": community.state || "",
         "postalCode": community.zip || "",
         "addressCountry": "US"
       },
       "offers": {
         "@type": "Offer",
         "category": community.services || ""
       }
    };

    console.log('Community Page: Rendering community client with valid data');

    return (
      <>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {/* Pass the fetched community data correctly */}
        <CommunityClient community={community} /> 
      </>
    );
  } catch (error) {
    console.error("Community Page Fatal Error:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace available");
    return notFound(); // Use notFound for errors during page generation
  }
} 