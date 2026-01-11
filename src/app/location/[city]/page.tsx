import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CityLocationClient from './CityLocationClient';
import { supabase } from '@/lib/supabase-client';
import { fetchAllCommunities } from '@/lib/fetch-community';
import { Community } from '@/data/facilities';
import { getNearestHospitalForCity } from '@/lib/hospital-proximity';

// Revalidate every 24 hours
export const revalidate = 86400;

// Neighborhood-specific data for enhanced OG descriptions
const NEIGHBORHOOD_OG_DATA: Record<string, {
  hook: string;
  landmark: string;
  imageDescription: string;
}> = {
  'westlake': {
    hook: 'Discover top-rated senior communities minutes from UH St. John Medical Center',
    landmark: 'Crocker Park',
    imageDescription: 'Aerial view of Westlake, Ohio senior living neighborhood near Crocker Park',
  },
  'beachwood': {
    hook: 'Explore luxury assisted living near Cleveland Clinic and UH Ahuja',
    landmark: 'La Place shopping district',
    imageDescription: 'Beachwood, Ohio senior living community near La Place shopping district',
  },
  'rocky-river': {
    hook: 'Charming lakefront senior living with walkable downtown and Fairview Hospital access',
    landmark: 'Rocky River Reservation',
    imageDescription: 'Rocky River, Ohio waterfront senior community near Lake Erie',
  },
  'solon': {
    hook: 'Family-friendly senior communities with quick access to UH Ahuja Medical Center',
    landmark: 'Solon Community Park',
    imageDescription: 'Solon, Ohio senior living community in suburban Cleveland',
  },
  'chagrin-falls': {
    hook: 'Boutique assisted living in a picturesque village setting',
    landmark: 'Chagrin Falls waterfall',
    imageDescription: 'Chagrin Falls, Ohio historic village senior living area',
  },
  'hudson': {
    hook: 'Upscale senior living in a historic Western Reserve community',
    landmark: 'Hudson Green',
    imageDescription: 'Hudson, Ohio historic downtown senior living neighborhood',
  },
  'pepper-pike': {
    hook: 'Exclusive senior residences in Cleveland\'s most prestigious suburb',
    landmark: 'Gates Mills corridor',
    imageDescription: 'Pepper Pike, Ohio luxury senior living community',
  },
  'bay-village': {
    hook: 'Peaceful lakefront senior living with small-town charm',
    landmark: 'Huntington Beach',
    imageDescription: 'Bay Village, Ohio lakefront senior living near Huntington Beach',
  },
  'north-olmsted': {
    hook: 'Affordable senior care options near Great Northern Mall',
    landmark: 'North Olmsted Recreation Complex',
    imageDescription: 'North Olmsted, Ohio senior living community',
  },
  'strongsville': {
    hook: 'Growing senior living hub with excellent Southwest General access',
    landmark: 'SouthPark Mall',
    imageDescription: 'Strongsville, Ohio senior living near Southwest General Hospital',
  },
};

// Dynamic metadata generation for location pages
export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const citySlug = params.city;
  const slugCityName = citySlug.replace(/-/g, ' ');
  
  // Fetch communities to get count and determine care types available
  const allCommunities = await fetchAllCommunities();
  const communities = allCommunities.filter(community => {
    if (!community.location) return false;
    const communityCity = community.location.split(',')[0].trim().toLowerCase();
    return communityCity === slugCityName.toLowerCase();
  });
  
  if (communities.length === 0) {
    return {
      title: 'Location Not Found | Guide for Seniors',
      description: 'The requested senior living location could not be found.',
    };
  }
  
  // Get proper city name from data
  const rawCityName = communities[0].location.split(',')[0].trim();
  const cityName = rawCityName
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  // Determine available care types
  const hasMemoryCare = communities.some(c => c.careTypes?.includes('Memory Care'));
  const hasAssistedLiving = communities.some(c => c.careTypes?.includes('Assisted Living'));
  const hasIndependentLiving = communities.some(c => c.careTypes?.includes('Independent Living'));
  
  const careTypesList = [
    hasAssistedLiving && 'assisted living',
    hasMemoryCare && 'memory care',
    hasIndependentLiving && 'independent living',
  ].filter(Boolean).join(', ');
  
  // Get hospital for proximity context
  const nearestHospital = getNearestHospitalForCity(citySlug);
  
  // Get neighborhood-specific data or use defaults
  const neighborhoodData = NEIGHBORHOOD_OG_DATA[citySlug] || {
    hook: `Explore ${communities.length}+ senior living communities in ${cityName}`,
    landmark: 'local amenities',
    imageDescription: `${cityName}, Ohio senior living community`,
  };
  
  // Find the best image from communities (prioritize those with real images)
  const communityWithImage = communities.find(c => 
    c.images?.[0] && 
    !c.images[0].includes('placeholder') && 
    !c.images[0].includes('default')
  );
  const ogImage = communityWithImage?.images?.[0] || 'https://www.guideforseniors.com/og-cleveland-senior-living.jpg';
  
  const currentYear = new Date().getFullYear();
  const baseUrl = 'https://www.guideforseniors.com';
  const canonicalUrl = `${baseUrl}/location/${citySlug}`;
  
  // OG Title: Under 60 chars, format: [Neighborhood] Senior Care | [Context]
  const ogTitle = `${cityName} Senior Living | ${communities.length}+ Communities Near ${nearestHospital}`;
  
  // OG Description: 110-160 chars, benefit-driven hook
  const ogDescription = `${neighborhoodData.hook}. Compare ${communities.length} verified ${careTypesList} options. Free ${currentYear} Cost Report & placement help.`;
  
  // SEO Title (can be longer)
  const seoTitle = `Senior Living in ${cityName}, OH (${currentYear}) | ${communities.length}+ Communities Near ${nearestHospital}`;
  
  // SEO Description (can be longer)
  const seoDescription = `Explore ${communities.length}+ senior living communities in ${cityName}, Ohio. Find ${careTypesList} near ${nearestHospital}. Get verified pricing, virtual tours, and free placement assistance from Guide for Seniors.`;
  
  return {
    title: seoTitle,
    description: seoDescription,
    keywords: `senior living ${cityName} ohio, ${careTypesList} ${cityName}, senior care near ${nearestHospital}, ${cityName} assisted living costs ${currentYear}`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: ogTitle.slice(0, 60),
      description: ogDescription.slice(0, 160),
      url: canonicalUrl,
      siteName: 'Guide for Seniors',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: neighborhoodData.imageDescription,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle.slice(0, 60),
      description: ogDescription.slice(0, 160),
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large' as const,
    },
  };
}

// Generate static params for all cities with communities
export async function generateStaticParams() {
  // Use Supabase to get unique cities instead of static file
  // This ensures we catch all cities including new ones
  const { data } = await supabase
    .from('Community')
    .select('city');
    
  if (!data) return [];
  
  // Get unique cities
  const uniqueCities = Array.from(new Set(
    data
      .filter(item => item.city)
      .map(item => item.city.trim())
  ));
  
  return uniqueCities.map((city) => ({
    city: city.toLowerCase().replace(/\s+/g, '-'),
  }));
}

export default async function LocationPage({ params }: { params: { city: string } }) {
  const { city } = params;
  
  // Convert slug back to city name for display (approximate)
  // We'll rely on the actual data for precise filtering
  const slugCityName = city.replace(/-/g, ' ').toLowerCase();

  // Fetch all communities and filter on the server
  // This is efficient enough for <1000 records and avoids creating new indexes yet
  const allCommunities = await fetchAllCommunities();
  
  // Filter communities by city (case insensitive)
  const communities = allCommunities.filter(community => {
    if (!community.location) return false;
    const communityCity = community.location.split(',')[0].trim().toLowerCase();
    return communityCity === slugCityName;
  });

  if (communities.length === 0) {
    notFound();
  }

  // Get the proper display name from the first match (e.g. "North Olmsted" instead of "north-olmsted")
  // Convert to title case to handle ALL CAPS entries in database
  const rawCityName = communities[0].location.split(',')[0].trim();
  const displayCityName = rawCityName
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <CityLocationClient
      cityName={displayCityName}
      stateAbbr="OH"
      communities={communities}
    />
  );
}
