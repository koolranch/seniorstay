import type { Metadata } from "next";
import { communities } from '@/lib/data/communities';
import { formatSlug, formatLocation } from '@/lib/utils/formatSlug';
import CommunityClient from './CommunityClient';
import Script from 'next/script';

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
  const resolvedParams = await params;
  console.log('Looking for community with params:', resolvedParams);
  
  const community = communities.find(
    (c) =>
      c.state.toLowerCase() === resolvedParams.state.toLowerCase() &&
      c.city.toLowerCase() === resolvedParams.city.toLowerCase() &&
      c.slug === resolvedParams.slug
  );

  if (!community) {
    console.log('Community not found for params:', resolvedParams);
    return {
      title: "Community Not Found",
      description: "The requested senior living community could not be found.",
    };
  }

  // Create a more SEO-friendly title and description
  const title = `${community.name} | ${community.type} in ${community.city}, ${community.state} | SeniorStay`;
  const description = `Learn more about ${community.name}, offering ${community.services.join(', ')} in ${community.city}, ${community.state}. Schedule a tour or request pricing today.`;
  const imageUrl = community.image;
  const canonicalUrl = `https://seniorstay.com/community/${resolvedParams.state}/${resolvedParams.city}/${resolvedParams.slug}`;

  // Generate structured data for rich search results
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": community.name,
    "description": description,
    "image": imageUrl,
    "url": canonicalUrl,
    "telephone": "+1-800-555-1234", // This would be replaced with actual phone number
    "address": {
      "@type": "PostalAddress",
      "streetAddress": community.address.split(',')[0],
      "addressLocality": community.city,
      "addressRegion": community.state,
      "postalCode": community.address.match(/\d{5}/)?.[0] || "",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "", // Would need to be added to community data
      "longitude": "" // Would need to be added to community data
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": community.rating,
      "reviewCount": community.reviewCount || "10" // Would need to be added to community data
    },
    "amenityFeature": community.amenities.map(amenity => ({
      "@type": "LocationFeatureSpecification",
      "name": amenity
    })),
    "offers": {
      "@type": "Offer",
      "category": community.services.join(", ")
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
}

export default async function Page(props: Props) {
  const params = await props.params;
  console.log('Page component looking for community with params:', params);
  
  const community = communities.find(
    (c) =>
      c.state.toLowerCase() === params.state.toLowerCase() &&
      c.city.toLowerCase() === params.city.toLowerCase() &&
      c.slug === params.slug
  );

  if (!community) {
    console.log('Community not found in Page component for params:', params);
    return <CommunityClient params={params} communities={communities} />;
  }

  // Generate structured data for rich search results
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": community.name,
    "description": `Learn more about ${community.name}, offering ${community.services.join(', ')} in ${community.city}, ${community.state}.`,
    "image": community.image,
    "url": `https://seniorstay.com/community/${params.state}/${params.city}/${params.slug}`,
    "telephone": "+1-800-555-1234", // This would be replaced with actual phone number
    "address": {
      "@type": "PostalAddress",
      "streetAddress": community.address.split(',')[0],
      "addressLocality": community.city,
      "addressRegion": community.state,
      "postalCode": community.address.match(/\d{5}/)?.[0] || "",
      "addressCountry": "US"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": community.rating,
      "reviewCount": community.reviewCount || "10"
    },
    "amenityFeature": community.amenities.map(amenity => ({
      "@type": "LocationFeatureSpecification",
      "name": amenity
    })),
    "offers": {
      "@type": "Offer",
      "category": community.services.join(", ")
    }
  };

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
} 