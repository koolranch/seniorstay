import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CityLocationClient from './CityLocationClient';
import { fetchCommunitiesByRegion } from '@/lib/fetch-community';
import { getNearestHospitalForCity } from '@/lib/hospital-proximity';
import { 
  getAllRegionSlugs, 
  getRegionConfig, 
  getRegionCitySlugs, 
  isValidRegion, 
  isCityInRegion,
  getRegionPhoneNumber,
  getCityInfo
} from '@/data/regions';

// Revalidate every 24 hours
export const revalidate = 86400;

interface CityPageProps {
  params: { region: string; city: string };
}

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
};

// Generate static params for all regions and their cities
export async function generateStaticParams() {
  const params: { region: string; city: string }[] = [];
  
  for (const regionSlug of getAllRegionSlugs()) {
    const citySlugs = getRegionCitySlugs(regionSlug);
    for (const citySlug of citySlugs) {
      params.push({ region: regionSlug, city: citySlug });
    }
  }
  
  return params;
}

// Dynamic metadata generation for location pages
export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { region, city: citySlug } = params;
  
  // Validate region
  if (!isValidRegion(region)) {
    return {
      title: 'Region Not Found | Guide for Seniors',
      description: 'The requested region could not be found.',
    };
  }
  
  const regionConfig = getRegionConfig(region);
  const slugCityName = citySlug.replace(/-/g, ' ');
  
  // Fetch communities to get count
  const allCommunities = await fetchCommunitiesByRegion(region);
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
    imageDescription: `${cityName}, ${regionConfig?.stateAbbr || 'OH'} senior living community`,
  };
  
  // Find the best image from communities
  const communityWithImage = communities.find(c => 
    c.images?.[0] && 
    !c.images[0].includes('placeholder') && 
    !c.images[0].includes('default')
  );
  const ogImage = communityWithImage?.images?.[0] || 'https://www.guideforseniors.com/og-cleveland-senior-living.jpg';
  
  const currentYear = new Date().getFullYear();
  const baseUrl = 'https://www.guideforseniors.com';
  const canonicalUrl = `${baseUrl}/${region}/${citySlug}`;
  
  // Region-aware metadata
  const regionDisplayName = regionConfig?.displayName || 'Greater Cleveland';
  const stateAbbr = regionConfig?.stateAbbr || 'OH';
  
  // OG Title: Under 60 chars
  const ogTitle = `${cityName} Senior Living | ${communities.length}+ Communities Near ${nearestHospital}`;
  
  // OG Description: 110-160 chars
  const ogDescription = `${neighborhoodData.hook}. Compare ${communities.length} verified ${careTypesList} options. Free ${currentYear} Cost Report & placement help.`;
  
  // SEO Title
  const seoTitle = `Senior Living in ${cityName}, ${stateAbbr} (${currentYear}) | ${communities.length}+ Communities Near ${nearestHospital}`;
  
  // SEO Description
  const seoDescription = `Explore ${communities.length}+ senior living communities in ${cityName}, ${stateAbbr}. Find ${careTypesList} near ${nearestHospital}. Get verified pricing, virtual tours, and free placement assistance from Guide for Seniors.`;
  
  return {
    title: seoTitle,
    description: seoDescription,
    keywords: `senior living ${cityName} ${stateAbbr.toLowerCase()}, ${careTypesList} ${cityName}, senior care near ${nearestHospital}, ${cityName} assisted living costs ${currentYear}, ${regionDisplayName} senior living`,
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

export default async function CityPage({ params }: CityPageProps) {
  const { region, city } = params;
  
  // Validate region
  if (!isValidRegion(region)) {
    notFound();
  }
  
  const regionConfig = getRegionConfig(region);
  if (!regionConfig) {
    notFound();
  }
  
  // Convert slug back to city name for display
  const slugCityName = city.replace(/-/g, ' ').toLowerCase();

  // Fetch communities for this region and filter by city
  const allCommunities = await fetchCommunitiesByRegion(region);
  
  // Filter communities by city (case insensitive)
  const communities = allCommunities.filter(community => {
    if (!community.location) return false;
    const communityCity = community.location.split(',')[0].trim().toLowerCase();
    return communityCity === slugCityName;
  });

  if (communities.length === 0) {
    notFound();
  }

  // Get the proper display name from the first match
  const rawCityName = communities[0].location.split(',')[0].trim();
  const displayCityName = rawCityName
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <CityLocationClient
      cityName={displayCityName}
      stateAbbr={regionConfig.stateAbbr}
      communities={communities}
      regionSlug={region}
      regionConfig={regionConfig}
    />
  );
}
