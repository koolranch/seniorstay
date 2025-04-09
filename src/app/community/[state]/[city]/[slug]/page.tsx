import type { Metadata } from "next";
import { communities } from '@/lib/data/communities';
import { formatSlug, formatLocation } from '@/lib/utils/formatSlug';
import CommunityClient from './CommunityClient';

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
  const community = communities.find(
    (c) =>
      c.state.toLowerCase() === resolvedParams.state &&
      c.city.toLowerCase() === resolvedParams.city &&
      c.slug === resolvedParams.slug
  );

  if (!community) {
    return {
      title: "Community Not Found",
      description: "The requested senior living community could not be found.",
    };
  }

  const title = `${community.name} - Senior Living Community in ${community.city}, ${community.state}`;
  const description = community.description;
  const imageUrl = community.image;
  const canonicalUrl = `https://seniorstay.com/community/${resolvedParams.state}/${resolvedParams.city}/${resolvedParams.slug}`;

  // Generate structured data for rich search results
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SeniorLivingCommunity",
    "name": community.name,
    "description": description,
    "image": imageUrl,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": community.address.split(',')[0],
      "addressLocality": community.city,
      "addressRegion": community.state,
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
      "reviewCount": "10" // Would need to be added to community data
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
          alt: community.name
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
    },
    other: {
      'structured-data': JSON.stringify(structuredData)
    }
  };
}

export default async function Page(props: Props) {
  const params = await props.params;
  return <CommunityClient params={params} communities={communities} />;
} 