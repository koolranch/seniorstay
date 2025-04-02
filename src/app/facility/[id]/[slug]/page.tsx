import { facilityData } from '@/data/facilities';
import { notFound } from 'next/navigation';
import CommunityClient from './CommunityClient';
import { Metadata } from 'next';

interface PageProps {
  params: {
    id: string;
    slug: string;
  };
}

export default function CommunityPage({ params }: PageProps) {
  const community = facilityData.find(
    (community) => community.id === params.id
  );

  if (!community) {
    notFound();
  }

  return (
    <main>
      <CommunityClient community={community} />
    </main>
  );
}

// Generate metadata for all communities
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const community = facilityData.find(
    (community) => community.id === params.id
  );

  if (!community) {
    return {
      title: 'Community Not Found',
    };
  }

  const title = `${community.name} | Senior Living in ${community.location} | Cleveland Senior Guide`;
  const description = `View detailed information about ${community.name}, a senior living community in ${community.location}. Compare amenities, care levels, and pricing for assisted living, memory care, and independent living options.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      siteName: 'Cleveland Senior Guide',
      images: community.images?.length ? [
        {
          url: community.images[0],
          width: 1200,
          height: 630,
          alt: `${community.name} - Senior Living Community`,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: community.images?.length ? [community.images[0]] : undefined,
    },
    alternates: {
      canonical: `/facility/${community.id}/${community.name.toLowerCase().replace(/\s+/g, '-')}`,
    },
  };
}

// Generate structured data for the facility
export async function generateStructuredData({ params }: PageProps) {
  const community = facilityData.find(
    (community) => community.id === params.id
  );

  if (!community) {
    return null;
  }

  const facilitySchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": community.name,
    "description": community.description || `${community.name} is a senior living community located in ${community.location}`,
    "url": `https://guideforseniors.com/facility/${community.id}/${community.name.toLowerCase().replace(/\s+/g, '-')}`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": community.address?.split(',')[0] || "",
      "addressLocality": community.location.split(',')[0],
      "addressRegion": community.location.split(',')[1]?.trim() || "OH",
      "postalCode": community.address?.match(/\d{5}(?:-\d{4})?/)?.[0] || "",
      "addressCountry": "US"
    },
    "geo": community.coordinates ? {
      "@type": "GeoCoordinates",
      "latitude": community.coordinates.lat,
      "longitude": community.coordinates.lng
    } : undefined,
    "telephone": "(800) 555-1234",
    "openingHours": "Mo-Su 00:00-24:00",
    "priceRange": "$$",
    "amenityFeature": community.amenities?.map(amenity => ({
      "@type": "LocationFeatureSpecification",
      "name": amenity
    })) || [],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Senior Living Services",
      "itemListElement": community.careTypes.map((type, index) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": type,
          "description": `Professional ${type} services provided at ${community.name}`
        }
      }))
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "124",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(facilitySchema) }}
    />
  );
}
