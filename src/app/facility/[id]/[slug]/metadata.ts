import { Metadata } from 'next';
import { communityData } from '@/data/facilities';

interface CommunityPageProps {
  params: {
    id: string;
    slug: string;
  };
}

export async function generateMetadata({ params }: CommunityPageProps): Promise<Metadata> {
  const { id, slug } = params;
  
  const community = communityData.find(
    (c) => c.id === id
  );

  if (!community) {
    return {
      title: 'Facility Not Found',
      description: 'The requested facility could not be found.',
    };
  }

  const title = `${community.name} | Senior Living Community`;
  const description = community.description;

  const structuredData = {
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
    "telephone": "(216) 677-4630",
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
    }
  };

  // SEO SAFETY: Check if profile is "incomplete" (no description or placeholder image)
  // Incomplete profiles should NOT be indexed to protect site authority
  const hasDescription = community.description && community.description.trim().length > 50;
  const imageUrl = community.images?.[0] || '';
  const hasPlaceholderImage = !imageUrl || 
    imageUrl.toLowerCase().includes('placeholder') ||
    imageUrl.toLowerCase().includes('no-image') ||
    imageUrl.toLowerCase().includes('default-community');
  const isIncompleteProfile = !hasDescription || hasPlaceholderImage;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      siteName: 'Guide for Seniors',
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
    // SEO SAFETY: noindex incomplete profiles to protect site authority
    robots: isIncompleteProfile 
      ? { index: false, follow: true, noarchive: true }
      : { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' as const },
    other: {
      'application/ld+json': JSON.stringify(structuredData)
    }
  };
} 