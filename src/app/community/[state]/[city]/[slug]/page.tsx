import type { Metadata } from "next";
import { communities } from '@/lib/data/communities';
import { formatSlug, formatLocation } from '@/lib/utils/formatSlug';
import CommunityClient from './CommunityClient';
import Script from 'next/script';
import { notFound } from "next/navigation";
import Link from 'next/link';

export async function generateStaticParams() {
  return communities.map((community) => ({
    state: community.state.toLowerCase(),
    city: community.city.toLowerCase(),
    slug: community.slug
  }));
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
  try {
    const resolvedParams = await params;
    console.log('Metadata: Looking for community with params:', JSON.stringify(resolvedParams, null, 2));
    
    // Validate params
    if (!resolvedParams || !resolvedParams.state || !resolvedParams.city || !resolvedParams.slug) {
      console.error("Metadata Error: Missing required route params:", JSON.stringify(resolvedParams, null, 2));
      return {
        title: "Community Not Found | SeniorStay",
        description: "The requested senior living community could not be found.",
      };
    }
    
    const community = communities.find(
      (c) =>
        c.state.toLowerCase() === resolvedParams.state.toLowerCase() &&
        c.city.toLowerCase() === resolvedParams.city.toLowerCase() &&
        c.slug === resolvedParams.slug
    );

    if (!community) {
      console.error('Metadata Error: Community not found for params:', 
        `state=${resolvedParams.state}, city=${resolvedParams.city}, slug=${resolvedParams.slug}`);
      return {
        title: "Community Not Found | SeniorStay",
        description: "The requested senior living community could not be found.",
      };
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

    // Create a more SEO-friendly title and description with fallbacks
    const name = community.name || "Senior Living Community";
    const type = community.type || "Senior Living";
    const city = community.city || "";
    const state = community.state || "";
    const services = (community.services || []).join(', ');
    
    const title = `${name} | ${type} in ${city}${city && state ? ', ' : ''}${state} | SeniorStay`;
    const description = `Learn more about ${name}, offering ${services} in ${city}${city && state ? ', ' : ''}${state}. Schedule a tour or request pricing today.`;
    const imageUrl = community.image || "";
    const canonicalUrl = `https://seniorstay.com/community/${resolvedParams.state}/${resolvedParams.city}/${resolvedParams.slug}`;

    // Generate structured data for rich search results with safe property access
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": name,
      "description": description,
      "image": imageUrl,
      "url": canonicalUrl,
      "telephone": "(216) 232-3354", 
      "address": {
        "@type": "PostalAddress",
        "streetAddress": community.address ? community.address.split(',')[0] : "",
        "addressLocality": city,
        "addressRegion": state,
        "postalCode": community.address ? (community.address.match(/\d{5}/)?.[0] || "") : "",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "", 
        "longitude": "" 
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": community.rating || 0,
        "reviewCount": community.reviewCount || "10"
      },
      "amenityFeature": (community.amenities || []).map(amenity => ({
        "@type": "LocationFeatureSpecification",
        "name": amenity
      })),
      "offers": {
        "@type": "Offer",
        "category": (community.services || []).join(", ")
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "00:00",
        "closes": "23:59"
      }
    };

    console.log('Metadata: Successfully generated for community:', name);

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
            alt: `${name} senior living community in ${city}${city && state ? ', ' : ''}${state}`
          }
        ],
        type: 'website',
        url: canonicalUrl,
        siteName: 'SeniorStay'
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl]
      },
      alternates: {
        canonical: canonicalUrl
      }
    };
  } catch (error) {
    console.error("Metadata Fatal Error:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace available");
    return {
      title: "Error Loading Community | SeniorStay",
      description: "There was an error loading this community.",
    };
  }
}

export default async function Page(props: Props) {
  try {
    // Add more detailed logging for debugging
    console.log('Community Page: Starting render with props:', JSON.stringify(props, null, 2));
    
    const params = await props.params;
    console.log('Community Page: Resolved params:', JSON.stringify(params, null, 2));
    
    // Validate params
    if (!params || !params.state || !params.city || !params.slug) {
      console.error("Community Page Error: Missing required route params:", JSON.stringify(params, null, 2));
      return notFound();
    }
    
    // Try to find the community
    console.log('Community Page: Looking for community with params:', 
      `state=${params.state}, city=${params.city}, slug=${params.slug}`);
    
    const community = communities.find(
      (c) =>
        c.state.toLowerCase() === params.state.toLowerCase() &&
        c.city.toLowerCase() === params.city.toLowerCase() &&
        c.slug === params.slug
    );

    // Log whether community was found or not
    if (community) {
      console.log('Community Page: Found community:', community.name);
    } else {
      console.error('Community Page Error: Community not found for params:', 
        `state=${params.state}, city=${params.city}, slug=${params.slug}`);
      return notFound();
    }

    // Ensure community has all required properties
    if (!community.name || !community.city || !community.state || !community.services || !community.amenities) {
      console.error('Community Page Error: Community is missing required properties:', 
        JSON.stringify({
          hasName: !!community.name,
          hasCity: !!community.city, 
          hasState: !!community.state,
          hasServices: !!community.services,
          hasAmenities: !!community.amenities
        }, null, 2));
      
      // Continue with fallbacks instead of returning notFound()
    }

    // Generate structured data with safe fallbacks for all properties
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": community.name || "",
      "description": `Learn more about ${community.name || "this community"}, offering ${(community.services || []).join(', ')} in ${community.city || ""}, ${community.state || ""}.`,
      "image": community.image || "",
      "url": `https://seniorstay.com/community/${params.state}/${params.city}/${params.slug}`,
      "telephone": "(216) 232-3354", 
      "address": {
        "@type": "PostalAddress",
        "streetAddress": community.address ? community.address.split(',')[0] : "",
        "addressLocality": community.city || "",
        "addressRegion": community.state || "",
        "postalCode": community.address ? (community.address.match(/\d{5}/)?.[0] || "") : "",
        "addressCountry": "US"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": community.rating || 0,
        "reviewCount": community.reviewCount || "10"
      },
      "amenityFeature": (community.amenities || []).map(amenity => ({
        "@type": "LocationFeatureSpecification",
        "name": amenity
      })),
      "offers": {
        "@type": "Offer",
        "category": (community.services || []).join(", ")
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
        <CommunityClient params={params} communities={communities} />
      </>
    );
  } catch (error) {
    // Log the full error details for debugging
    console.error("Community Page Fatal Error:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace available");
    
    // For unexpected errors, still use notFound() to avoid leaking error details to the client
    return notFound();
  }
} 