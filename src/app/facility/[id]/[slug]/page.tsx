"use client";

import React from 'react';
import { communityData } from '@/data/facilities';
import { notFound } from 'next/navigation';
import CommunityHeader from '@/components/community/CommunityHeader';
import CommunityOverview from '@/components/community/CommunityOverview';
import CommunityAmenities from '@/components/community/CommunityAmenities';
import CommunityCareTypes from '@/components/community/CommunityCareTypes';
import CommunityStaff from '@/components/community/CommunityStaff';
import CommunityTestimonials from '@/components/community/CommunityTestimonials';
import CommunityContact from '@/components/community/CommunityContact';
import SchemaOrg from './SchemaOrg';
import { Metadata } from 'next';

interface CommunityPageProps {
  params: {
    id: string;
    slug: string;
  };
}

export default function CommunityPage({ params }: CommunityPageProps) {
  const { id, slug } = params;

  // Find the community by ID
  const community = communityData.find(
    community => community.id === id
  );

  if (!community) {
    notFound();
  }

  // Verify the slug matches the community name
  const expectedSlug = community.name.toLowerCase().replace(/\s+/g, '-');
  if (slug !== expectedSlug) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CommunityHeader community={community} />
      <div className="container mx-auto px-4 py-8">
        <CommunityOverview community={community} />
        <CommunityAmenities community={community} />
        <CommunityCareTypes community={community} />
        <CommunityStaff community={community} />
        <CommunityTestimonials community={community} />
        <CommunityContact community={community} />
      </div>
      <SchemaOrg community={community} />
    </div>
  );
}

// Generate metadata for all communities
export async function generateMetadata({ params }: CommunityPageProps): Promise<Metadata> {
  const { id, slug } = params;
  
  const community = communityData.find(
    (community) => community.id === id
  );

  if (!community) {
    return {
      title: 'Community Not Found',
      description: 'The requested community could not be found.',
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
    }
  };

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
    other: {
      'application/ld+json': JSON.stringify(structuredData)
    }
  };
}
