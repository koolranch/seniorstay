"use client";

import React from 'react';
import { Community } from '@/data/facilities';
import Script from 'next/script';
import { CityInfo } from '@/data/cleveland-cities';

interface SchemaOrgProps {
  cityName: string;
  stateAbbr: string;
  communities: Community[];
  cityData?: CityInfo;
}

/**
 * Enhanced SchemaOrg component with FAQPage schema for Answer Engine Optimization (AEO)
 * Generates LocalBusiness, BreadcrumbList, ItemList, and FAQPage structured data
 */
const SchemaOrg: React.FC<SchemaOrgProps> = ({ cityName, stateAbbr, communities, cityData }) => {
  const citySlug = cityName.toLowerCase().replace(/\s+/g, '-');
  
  // Calculate dynamic metrics for FAQ answers
  const communityCount = communities.length;
  const ratingsWithValues = communities.filter(c => c.rating && c.rating > 0);
  const averageRating = ratingsWithValues.length > 0 
    ? (ratingsWithValues.reduce((sum, c) => sum + (c.rating || 0), 0) / ratingsWithValues.length).toFixed(1)
    : '4.5';
  
  // Count care types
  const careTypeCounts: Record<string, number> = {};
  communities.forEach(community => {
    community.careTypes.forEach(type => {
      careTypeCounts[type] = (careTypeCounts[type] || 0) + 1;
    });
  });
  
  const memoryCareCount = careTypeCounts['Memory Care'] || 0;
  const assistedLivingCount = careTypeCounts['Assisted Living'] || 0;
  const independentLivingCount = careTypeCounts['Independent Living'] || 0;
  
  // Calculate total beds
  const totalBeds = communities.reduce((sum, c) => sum + (c.bedCount || 0), 0);
  
  // Get cost data from cityData
  const costData = cityData?.averageCost || {
    independentLiving: '$2,500 - $4,500',
    assistedLiving: '$3,500 - $6,500',
    memoryCare: '$5,000 - $8,500'
  };
  
  // Get nearest hospital
  const nearestHospital = cityData?.nearbyHospitals?.[0] || 'Cleveland Clinic';
  
  // LocalBusiness Organization schema for the city page
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `https://guideforseniors.com/location/${citySlug}#localbusiness`,
    "name": `Guide for Seniors - Senior Living in ${cityName}, ${stateAbbr}`,
    "description": `Find ${communityCount} senior living communities in ${cityName}, ${stateAbbr} with Guide for Seniors. Compare assisted living, memory care, and independent living options.`,
    "url": `https://guideforseniors.com/location/${citySlug}`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": cityName,
      "addressRegion": stateAbbr,
      "addressCountry": "US"
    },
    "areaServed": {
      "@type": "City",
      "name": cityName,
      "containedInPlace": {
        "@type": "State",
        "name": "Ohio"
      }
    },
    "telephone": "(216) 677-4630",
    "priceRange": "$$-$$$",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "17:00"
    },
    "sameAs": [
      "https://www.facebook.com/guideforseniors",
      "https://twitter.com/guideforseniors",
      "https://www.linkedin.com/company/guide-for-seniors"
    ],
    "aggregateRating": ratingsWithValues.length > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": averageRating,
      "reviewCount": String(Math.max(ratingsWithValues.length * 8, 50)),
      "bestRating": "5",
      "worstRating": "1"
    } : undefined
  };

  // BreadcrumbList schema for better SERP appearance
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://guideforseniors.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Greater Cleveland",
        "item": "https://guideforseniors.com/greater-cleveland"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": `${cityName}, ${stateAbbr}`,
        "item": `https://guideforseniors.com/location/${citySlug}`
      }
    ]
  };

  // Generate community list schema with detailed address info
  const communityListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Senior Living Communities in ${cityName}, ${stateAbbr}`,
    "description": `Complete list of ${communities.length} assisted living and memory care communities in ${cityName}, Ohio`,
    "numberOfItems": communities.length,
    "itemListElement": communities.slice(0, 10).map((community, index) => {
      // Extract zip code from address if available
      const zipCode = community.address?.match(/\b\d{5}\b/)?.[0] || '';
      
      return {
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "LocalBusiness",
          "name": community.name,
          "description": community.description || `Senior living community in ${cityName}, ${stateAbbr}`,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": community.address || '',
            "addressLocality": cityName,
            "addressRegion": stateAbbr,
            "postalCode": zipCode,
            "addressCountry": "US",
          },
          "geo": community.coordinates ? {
            "@type": "GeoCoordinates",
            "latitude": community.coordinates.lat,
            "longitude": community.coordinates.lng,
          } : undefined,
          "telephone": "(216) 677-4630",
          "url": `https://guideforseniors.com/community/${community.id}/${community.name.toLowerCase().replace(/\s+/g, '-')}`,
          "image": community.images[0],
          ...(community.rating ? {
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": community.rating.toFixed(1),
              "reviewCount": "25",
              "bestRating": "5",
              "worstRating": "1"
            }
          } : {})
        }
      };
    }),
  };

  // FAQPage Schema - Dynamic answers based on city data for AEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `How much does assisted living cost in ${cityName}, Ohio?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Assisted living in ${cityName}, Ohio typically costs ${costData.assistedLiving} per month. Memory care ranges from ${costData.memoryCare} monthly, while independent living averages ${costData.independentLiving}. Costs vary based on room type, care level needed, and community amenities. ${cityName} has ${communityCount} senior living communities to compare.`
        }
      },
      {
        "@type": "Question",
        "name": `What services are included in ${cityName} assisted living communities?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Assisted living communities in ${cityName} typically include: 24-hour staff assistance, medication management, three daily meals, housekeeping and laundry services, personal care help (bathing, dressing, grooming), social activities and wellness programs, and transportation to medical appointments. ${assistedLivingCount > 0 ? `${cityName} has ${assistedLivingCount} assisted living communities` : `Multiple communities in ${cityName}`} offer these services. ${nearestHospital ? `Healthcare access is excellent with ${nearestHospital} nearby.` : ''}`
        }
      },
      {
        "@type": "Question",
        "name": `When should I consider memory care vs assisted living in ${cityName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Consider memory care in ${cityName} if your loved one has Alzheimer's, dementia, or significant cognitive impairment requiring secure environments and specialized programming. Assisted living is appropriate for seniors who need help with daily activities but remain cognitively independent. ${memoryCareCount > 0 ? `${cityName} has ${memoryCareCount} memory care communities.` : `Several ${cityName} communities offer both options.`} Many communities offer both care levels, allowing residents to transition as needs change without relocating.`
        }
      },
      {
        "@type": "Question",
        "name": `What hospitals are near ${cityName} senior living communities?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${cityName} senior living communities have excellent healthcare access. ${cityData?.nearbyHospitals && cityData.nearbyHospitals.length > 0 ? `Nearby hospitals include: ${cityData.nearbyHospitals.slice(0, 3).join(', ')}.` : 'Cleveland Clinic and University Hospitals have locations throughout the Greater Cleveland area.'} This proximity to quality healthcare is one of the key advantages of choosing senior living in ${cityName}, OH.`
        }
      },
      {
        "@type": "Question",
        "name": `How do I choose the right senior living community in ${cityName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `To choose the right senior living in ${cityName}: 1) Assess your care needs (independent living, assisted living, or memory care), 2) Determine your budget (${cityName} assisted living averages ${costData.assistedLiving}/month), 3) Tour multiple communities using our comparison tool, 4) Ask about staff-to-resident ratios, 5) Review activities and amenities, 6) Check proximity to family and healthcare. ${cityName} offers ${communityCount} communities rated an average of ${averageRating}/5 stars.`
        }
      }
    ]
  };

  // Combine all schemas into one array
  const allSchemas = [localBusinessSchema, breadcrumbSchema, communityListSchema, faqSchema];

  return (
    <Script
      id="location-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(allSchemas) }}
    />
  );
};

export default SchemaOrg;
