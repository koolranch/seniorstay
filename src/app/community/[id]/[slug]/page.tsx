import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchCommunityById, fetchCommunityBySlug } from '@/lib/fetch-community';
import { findNearestHospital, getNearestHospitalForCity } from '@/lib/hospital-proximity';
import CommunityHeader from '@/components/community/CommunityHeader';
import CommunityOverview from '@/components/community/CommunityOverview';
import CommunityQualityMetrics from '@/components/community/CommunityQualityMetrics';
import CommunityInsurance from '@/components/community/CommunityInsurance';
import CommunityAmenities from '@/components/community/CommunityAmenities';
import CommunityCareTypes from '@/components/community/CommunityCareTypes';
import CommunityStaff from '@/components/community/CommunityStaff';
import CommunityTestimonials from '@/components/community/CommunityTestimonials';
import CommunityContact from '@/components/community/CommunityContact';
import SimilarCommunities from '@/components/community/SimilarCommunities';
import NeighborhoodSection from '@/components/community/NeighborhoodSection';
import WhyChooseSection from '@/components/community/WhyChooseSection';
import StickyMobileCTA from '@/components/community/StickyMobileCTA';
import StickyTourButton from '@/components/tour/StickyTourButton';
import ClinicalProximityBadge from '@/components/community/ClinicalProximityBadge';

// ISR: Revalidate every hour
export const revalidate = 3600;

interface CommunityPageProps {
  params: { id: string; slug: string };
}

// Generate metadata with absolute canonical URL
export async function generateMetadata({ params }: CommunityPageProps): Promise<Metadata> {
  const { id, slug } = params;
  
  let community = await fetchCommunityById(id);
  if (!community) {
    community = await fetchCommunityBySlug(slug);
  }

  if (!community) {
    return {
      title: 'Community Not Found | Guide for Seniors',
      description: 'The requested senior living community could not be found.',
    };
  }

  const city = community.location.split(',')[0].trim();
  const citySlug = city.toLowerCase().replace(/\s+/g, '-');
  const baseUrl = 'https://www.guideforseniors.com';
  const canonicalUrl = `${baseUrl}/community/${id}/${slug}`;
  const currentYear = new Date().getFullYear();
  
  // Determine care type for title
  const primaryCareType = community.careTypes.includes('Memory Care') 
    ? 'Memory Care' 
    : community.careTypes.includes('Assisted Living') 
      ? 'Assisted Living' 
      : 'Senior Living';
  
  // GEO-READY: Get nearest hospital for conversational metadata
  let nearestHospitalName = getNearestHospitalForCity(citySlug);
  let hospitalDistance = '';
  
  if (community.coordinates) {
    const nearestHospital = findNearestHospital(community.coordinates.lat, community.coordinates.lng, 'major_system');
    if (nearestHospital) {
      nearestHospitalName = nearestHospital.hospital.shortName;
      hospitalDistance = `${nearestHospital.distance} miles from `;
    }
  }
  
  // SEO SAFETY: Check if profile is "incomplete" (no description or placeholder image)
  const hasDescription = community.description && community.description.trim().length > 50;
  const imageUrl = community.images?.[0] || '';
  const hasPlaceholderImage = !imageUrl || 
    imageUrl.toLowerCase().includes('placeholder') ||
    imageUrl.toLowerCase().includes('no-image') ||
    imageUrl.toLowerCase().includes('default-community');
  const isIncompleteProfile = !hasDescription || hasPlaceholderImage;
  
  // GEO-READY: Conversational title optimized for AI overviews
  const title = `${community.name} | ${primaryCareType} in ${city}, OH Near ${nearestHospitalName}`;
  
  // GEO-READY: Conversational description with clinical context
  const description = community.description 
    ? `${currentYear} guide: ${community.name} offers ${primaryCareType.toLowerCase()} in ${city}, Ohio—${hospitalDistance}${nearestHospitalName}. ${community.description.substring(0, 120)}... Free consultation available.`
    : `${currentYear} guide: Explore ${community.name}, a ${primaryCareType.toLowerCase()} community in ${city}, OH near ${nearestHospitalName}. Get verified pricing, schedule tours, and compare with similar communities.`;
  
  // Enhanced keywords for GEO
  const geoKeywords = `${community.name} reviews, ${primaryCareType.toLowerCase()} near ${nearestHospitalName}, ${city} ${primaryCareType.toLowerCase()} costs ${currentYear}`;
  const keywords = `${community.name}, ${primaryCareType.toLowerCase()} ${city} ohio, senior living ${city}, ${community.careTypes.join(', ').toLowerCase()}, ${geoKeywords}`;
  
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${community.name} | ${primaryCareType} Near ${nearestHospitalName} in ${city}`,
      description,
      images: community.images?.[0] ? [community.images[0]] : [],
      url: canonicalUrl,
      siteName: 'Guide for Seniors',
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${community.name} | ${primaryCareType} in ${city}`,
      description,
    },
    // SEO SAFETY: noindex incomplete profiles to protect site authority
    robots: isIncompleteProfile 
      ? { index: false, follow: true, noarchive: true }
      : { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' as const },
  };
}

export default async function CommunityPage({ params }: CommunityPageProps) {
  const { id, slug } = params;
  
  // Fetch community data (server-side)
  let community = await fetchCommunityById(id);
  
  // Fallback to slug if ID not found
  if (!community) {
    community = await fetchCommunityBySlug(slug);
  }
  
  if (!community) {
    notFound();
  }

  const cityName = community.location.split(',')[0].trim();

  // Check if this is a skilled nursing-only facility
  const isOnlySkilledNursing = community.careTypes.every(type => 
    type.toLowerCase().includes('skilled nursing')
  ) && !community.careTypes.some(type =>
    type.toLowerCase().includes('assisted living') ||
    type.toLowerCase().includes('memory care')
  );

  // Determine primary care type for schema
  const primaryCareType = community.careTypes.includes('Memory Care') 
    ? 'MemoryCare' 
    : community.careTypes.includes('Assisted Living') 
      ? 'AssistedLivingFacility' 
      : 'SeniorLivingCommunity';

  // JSON-LD Schema for AssistedLiving / SeniorCare
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", primaryCareType],
    "@id": `https://www.guideforseniors.com/community/${id}/${slug}`,
    "name": community.name,
    "description": community.description || `Quality senior living community in ${cityName}, Ohio offering ${community.careTypes.join(', ').toLowerCase()}.`,
    "url": `https://www.guideforseniors.com/community/${id}/${slug}`,
    "telephone": "(216) 677-4630",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": community.address || "",
      "addressLocality": cityName,
      "addressRegion": "OH",
      "postalCode": community.zip || "",
      "addressCountry": "US"
    },
    "geo": community.coordinates ? {
      "@type": "GeoCoordinates",
      "latitude": community.coordinates.lat,
      "longitude": community.coordinates.lng
    } : undefined,
    "image": community.images?.[0] || "https://www.guideforseniors.com/images/default-community.jpg",
    "priceRange": "$$$",
    "amenityFeature": community.amenities?.map(amenity => ({
      "@type": "LocationFeatureSpecification",
      "name": amenity
    })) || [],
    "areaServed": {
      "@type": "City",
      "name": cityName,
      "containedInPlace": {
        "@type": "State",
        "name": "Ohio"
      }
    },
    "aggregateRating": community.overallRating ? {
      "@type": "AggregateRating",
      "ratingValue": community.overallRating,
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": 1
    } : undefined,
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "00:00",
      "closes": "23:59"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "(216) 677-4630",
      "contactType": "customer service",
      "availableLanguage": "English"
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <CommunityHeader community={community} isOnlySkilledNursing={isOnlySkilledNursing} />
      
      {/* Clinical Proximity Banner - E-E-A-T Signal for AEO */}
      <ClinicalProximityBadge 
        communityName={community.name}
        coordinates={community.coordinates}
        citySlug={cityName.toLowerCase().replace(/\s+/g, '-')}
        variant="banner"
      />
      
      <div className="container mx-auto px-4 py-8">
        {isOnlySkilledNursing && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              <strong>Note:</strong> Guide for Seniors specializes in assisted living and memory care communities. 
              For information about this skilled nursing facility, please contact them directly.
            </p>
          </div>
        )}

        <CommunityOverview community={community} />
        
        {/* Why Choose Section - SEO-rich content */}
        {!isOnlySkilledNursing && (
          <WhyChooseSection 
            community={community} 
            cityName={cityName} 
          />
        )}
        
        {/* Neighborhood & Location Section */}
        <NeighborhoodSection 
          communityName={community.name} 
          location={community.location} 
        />
        
        {/* CMS Official Data Sections */}
        <CommunityQualityMetrics community={community} />
        <CommunityInsurance community={community} />
        
        {/* Community Features */}
        <CommunityAmenities community={community} />
        <CommunityCareTypes community={community} />
        <CommunityStaff community={community} />
        <CommunityTestimonials community={community} />
        {!isOnlySkilledNursing && <CommunityContact community={community} />}
      </div>

      <SimilarCommunities community={community} />
      
      {/* Mobile Sticky CTA - NEW */}
      {!isOnlySkilledNursing && (
        <StickyMobileCTA 
          communityName={community.name} 
          cityName={cityName} 
        />
      )}
      
      {/* Desktop Sticky Tour Button */}
      {!isOnlySkilledNursing && <StickyTourButton />}
      
    </div>
  );
}
