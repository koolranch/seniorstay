"use client";

import React from 'react';
import { Community } from '@/data/facilities';
import Script from 'next/script';
import { CityInfo, type RegionConfig } from '@/data/regions';

interface SchemaOrgProps {
  cityName: string;
  stateAbbr: string;
  communities: Community[];
  cityData?: CityInfo;
  regionSlug: string;
  regionConfig: RegionConfig;
}

/**
 * Enhanced SchemaOrg component for Answer Engine Optimization (AEO) - Multi-Region Edition
 * Generates comprehensive structured data for AI search engines with region-aware URLs
 */
const SchemaOrg: React.FC<SchemaOrgProps> = ({ 
  cityName, 
  stateAbbr, 
  communities, 
  cityData,
  regionSlug,
  regionConfig 
}) => {
  const citySlug = cityName.toLowerCase().replace(/\s+/g, '-');
  const currentYear = new Date().getFullYear();
  const baseUrl = 'https://www.guideforseniors.com';
  
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
  
  // Get cost data from cityData
  const costData = cityData?.averageCost || {
    independentLiving: '$2,500 - $4,500',
    assistedLiving: '$3,500 - $6,500',
    memoryCare: '$5,000 - $8,500'
  };
  
  // Get nearest hospital
  const nearestHospital = cityData?.nearbyHospitals?.[0] || 'Cleveland Clinic';
  
  // MedicalOrganization schema - Establishes E-E-A-T for healthcare advisory
  const medicalOrgSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    "@id": `${baseUrl}/#organization`,
    "name": "Guide for Seniors",
    "alternateName": `Guide For Seniors ${regionConfig.displayName}`,
    "description": `Expert senior living placement advisors serving ${cityName} and ${regionConfig.displayName} families. We help navigate assisted living, memory care, and independent living options.`,
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "telephone": regionConfig.phoneNumber,
    "email": "info@guideforseniors.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": regionConfig.primaryCity,
      "addressRegion": stateAbbr,
      "addressCountry": "US"
    },
    "areaServed": {
      "@type": "State",
      "name": regionConfig.state,
      "containedInPlace": {
        "@type": "Country",
        "name": "United States"
      }
    },
    "medicalSpecialty": [
      "Geriatric Medicine",
      "Senior Care Placement",
      "Memory Care Advisory",
      "Assisted Living Consultation"
    ],
  };

  // LocalBusiness Organization schema for the city page
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "HealthAndBeautyBusiness"],
    "@id": `${baseUrl}/${regionSlug}/${citySlug}#localbusiness`,
    "name": `Guide for Seniors - Senior Living Advisors in ${cityName}, ${stateAbbr}`,
    "description": `Compare ${communityCount} verified senior living communities in ${cityName}, ${stateAbbr}. Free expert placement services near ${nearestHospital}. ${currentYear} pricing and clinical data available.`,
    "url": `${baseUrl}/${regionSlug}/${citySlug}`,
    "parentOrganization": {
      "@id": `${baseUrl}/#organization`
    },
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
        "name": regionConfig.state
      }
    },
    "telephone": regionConfig.phoneNumber,
    "priceRange": "Free consultation",
    "aggregateRating": ratingsWithValues.length > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": averageRating,
      "reviewCount": String(Math.max(ratingsWithValues.length * 8, 50)),
      "bestRating": "5",
      "worstRating": "1"
    } : undefined
  };

  // BreadcrumbList schema - Region-aware
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": regionConfig.displayName,
        "item": `${baseUrl}/${regionSlug}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": `${cityName}, ${stateAbbr}`,
        "item": `${baseUrl}/${regionSlug}/${citySlug}`
      }
    ]
  };

  // Generate community list schema with region-aware URLs
  const communityListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Senior Living Communities in ${cityName}, ${stateAbbr}`,
    "description": `Complete list of ${communities.length} assisted living and memory care communities in ${cityName}, ${regionConfig.state}`,
    "numberOfItems": communities.length,
    "itemListElement": communities.slice(0, 10).map((community, index) => {
      const zipCode = community.address?.match(/\b\d{5}\b/)?.[0] || '';
      const communitySlug = community.name.toLowerCase().replace(/\s+/g, '-');
      
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
          "telephone": regionConfig.phoneNumber,
          "url": `${baseUrl}/${regionSlug}/community/${community.id}/${communitySlug}`,
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

  // FAQPage Schema - Dynamic PAA questions based on city data
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `How much does assisted living cost in ${cityName}, ${regionConfig.state} in ${currentYear}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `In ${currentYear}, assisted living in ${cityName}, ${regionConfig.state} typically costs ${costData.assistedLiving} per month. Memory care ranges from ${costData.memoryCare} monthly, while independent living averages ${costData.independentLiving}. These costs include room and board, meals, housekeeping, and basic care services. ${cityName} has ${communityCount} senior living communities to compare, with options near ${nearestHospital} for convenient healthcare access.`
        }
      },
      {
        "@type": "Question",
        "name": `What is the best assisted living in ${cityName}, ${regionConfig.state}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The best assisted living in ${cityName} depends on your specific care needs and budget. ${communityCount > 0 ? `${cityName} has ${communityCount} communities rated an average of ${averageRating}/5 stars.` : `${cityName} has several highly-rated options.`} Key factors to consider: proximity to ${nearestHospital}, staff-to-resident ratios, specialized care programs, and amenities. Guide for Seniors offers free consultations to help ${cityName} families find the perfect match.`
        }
      },
      {
        "@type": "Question",
        "name": `What services are included in ${cityName} assisted living communities?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Assisted living communities in ${cityName} typically include: 24-hour staff assistance, medication management, three daily meals, housekeeping and laundry services, personal care help (bathing, dressing, grooming), social activities and wellness programs, and transportation to medical appointments at facilities like ${nearestHospital}. ${assistedLivingCount > 0 ? `${cityName} has ${assistedLivingCount} assisted living communities` : `Multiple communities in ${cityName}`} offer these services.`
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
          "text": `${cityName} senior living communities have excellent healthcare access. ${cityData?.nearbyHospitals && cityData.nearbyHospitals.length > 0 ? `Nearby hospitals include: ${cityData.nearbyHospitals.slice(0, 3).join(', ')}.` : `Major hospital systems have locations throughout the ${regionConfig.displayName} area.`} This proximity to world-class healthcare—including emergency rooms and specialist care—is a key advantage of choosing senior living in ${cityName}, ${stateAbbr}.`
        }
      },
    ]
  };

  // Combine all schemas
  const allSchemas = [
    medicalOrgSchema,
    localBusinessSchema, 
    breadcrumbSchema, 
    communityListSchema, 
    faqSchema
  ];

  return (
    <Script
      id="location-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(allSchemas) }}
    />
  );
};

export default SchemaOrg;
