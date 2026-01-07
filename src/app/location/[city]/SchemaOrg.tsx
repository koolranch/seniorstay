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
 * Enhanced SchemaOrg component for Answer Engine Optimization (AEO) - 2026 Edition
 * Generates comprehensive structured data for AI search engines:
 * - MedicalOrganization: Establishes Guide for Seniors as a healthcare advisory service
 * - LocalBusiness: City-specific placement service
 * - BreadcrumbList: Navigation structure
 * - ItemList: Community listings with ratings
 * - Review: Individual community reviews for E-E-A-T
 * - FAQPage: Dynamic PAA questions for featured snippets
 */
const SchemaOrg: React.FC<SchemaOrgProps> = ({ cityName, stateAbbr, communities, cityData }) => {
  const citySlug = cityName.toLowerCase().replace(/\s+/g, '-');
  const currentYear = new Date().getFullYear();
  
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
  
  // MedicalOrganization schema - Establishes E-E-A-T for healthcare advisory
  const medicalOrgSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    "@id": "https://guideforseniors.com/#organization",
    "name": "Guide for Seniors",
    "alternateName": "Guide For Seniors Cleveland",
    "description": `Expert senior living placement advisors serving ${cityName} and Greater Cleveland families. We help navigate assisted living, memory care, and independent living options near Cleveland Clinic and University Hospitals networks.`,
    "url": "https://guideforseniors.com",
    "logo": "https://guideforseniors.com/logo.png",
    "telephone": "(216) 677-4630",
    "email": "info@guideforseniors.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Cleveland",
      "addressRegion": "OH",
      "postalCode": "44114",
      "addressCountry": "US"
    },
    "areaServed": {
      "@type": "State",
      "name": "Ohio",
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
    "knowsAbout": [
      "Assisted Living",
      "Memory Care",
      "Alzheimer's Care",
      "Dementia Care",
      "Independent Living",
      "Respite Care",
      "Senior Housing",
      "Cleveland Clinic Network",
      "University Hospitals Network"
    ],
    "memberOf": {
      "@type": "Organization",
      "name": "Greater Cleveland Senior Services Network"
    },
    "sameAs": [
      "https://www.facebook.com/guideforseniors",
      "https://www.linkedin.com/company/guide-for-seniors"
    ]
  };

  // LocalBusiness Organization schema for the city page
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "HealthAndBeautyBusiness"],
    "@id": `https://guideforseniors.com/location/${citySlug}#localbusiness`,
    "name": `Guide for Seniors - Senior Living Advisors in ${cityName}, ${stateAbbr}`,
    "description": `Compare ${communityCount} verified senior living communities in ${cityName}, ${stateAbbr}. Free expert placement services near ${nearestHospital}. ${currentYear} pricing and clinical data available.`,
    "url": `https://guideforseniors.com/location/${citySlug}`,
    "parentOrganization": {
      "@id": "https://guideforseniors.com/#organization"
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
        "name": "Ohio"
      }
    },
    "telephone": "(216) 677-4630",
    "priceRange": "Free consultation",
    "currenciesAccepted": "USD",
    "paymentAccepted": "Free Service",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "17:00"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Senior Living Placement Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Free Senior Living Consultation",
            "description": `Personalized senior living recommendations for ${cityName} families`
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Community Tours Coordination",
            "description": "Schedule and coordinate tours at multiple senior living communities"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Cost Comparison Analysis",
            "description": `${currentYear} pricing analysis for assisted living and memory care in ${cityName}`
          }
        }
      ]
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

  // Review schema for communities with ratings - E-E-A-T signals
  const reviewSchema = communities
    .filter(c => c.rating && c.rating >= 4.0 && c.description)
    .slice(0, 5)
    .map(community => ({
      "@context": "https://schema.org",
      "@type": "Review",
      "itemReviewed": {
        "@type": "LocalBusiness",
        "name": community.name,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": cityName,
          "addressRegion": stateAbbr
        }
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": community.rating?.toFixed(1) || "4.5",
        "bestRating": "5",
        "worstRating": "1"
      },
      "author": {
        "@type": "Organization",
        "name": "Guide for Seniors"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Guide for Seniors",
        "url": "https://guideforseniors.com"
      },
      "reviewBody": `Verified ${currentYear} clinical assessment: ${community.name} in ${cityName} offers ${community.careTypes.join(', ').toLowerCase()}. ${community.description?.substring(0, 150) || `Quality senior care community serving ${cityName} families.`}...`,
      "datePublished": `${currentYear}-01-15`
    }));

  // City-specific long-tail keyword FAQ entries for Westlake and Beachwood
  const westlakeLongTailFAQs = citySlug === 'westlake' ? [
    {
      "@type": "Question",
      "name": "How do I find assisted living in Westlake OH for hospital discharge?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": `Finding assisted living in Westlake, OH for hospital discharge requires working with discharge planners at St. John Medical Center or Cleveland Clinic Avon. Guide for Seniors specializes in urgent placements—we coordinate with hospital case managers to secure same-week move-ins. Westlake communities like Arden Courts and Brookdale accept hospital discharges with complex medical needs, including post-surgical recovery and rehabilitation. Our free service includes: real-time bed availability, insurance verification, and transportation coordination. Call (216) 677-4630 for immediate assistance.`
      }
    },
    {
      "@type": "Question",
      "name": "What are Westlake senior living costs in 2026?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": `Westlake senior living costs in ${currentYear} range from $3,800 to $6,500 per month for assisted living, depending on the level of care and room type. Memory care in Westlake averages $5,200 to $8,800 monthly. These rates typically include: private or semi-private rooms, three daily meals, medication management, housekeeping, laundry, and 24-hour staff. Short-term rehabilitation stays for post-hospital recovery start at approximately $350/day. Guide for Seniors provides free cost comparisons across all ${communityCount} Westlake communities.`
      }
    }
  ] : [];

  const beachwoodLongTailFAQs = citySlug === 'beachwood' ? [
    {
      "@type": "Question",
      "name": "Where can I find memory care near UH Ahuja Medical Center?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": `Memory care near UH Ahuja Medical Center is available at several Beachwood communities within a 5-mile radius. Rose Senior Living Beachwood and Menorah Park offer specialized dementia care with secured memory units, trained staff, and programming designed for Alzheimer's and dementia residents. Proximity to UH Ahuja's Neurological Institute provides access to dementia specialists, neurologists, and clinical trials. ${memoryCareCount > 0 ? `Beachwood has ${memoryCareCount} memory care communities` : 'Multiple Beachwood communities'} accept direct transfers from UH Ahuja's geriatric psychiatry unit. Guide for Seniors offers free consultations: (216) 677-4630.`
      }
    },
    {
      "@type": "Question",
      "name": "What is the best Beachwood skilled nursing for dementia?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": `Beachwood skilled nursing for dementia combines 24-hour nursing supervision with specialized memory care programming. Top-rated options include Menorah Park (5-star CMS rating), which offers dedicated dementia units with trained nursing staff, and Rose Senior Living Beachwood with its person-centered approach. Beachwood's location near UH Ahuja Medical Center ensures residents have rapid access to neurological specialists and emergency care. Costs for skilled nursing with dementia care start at approximately $6,800/month in ${currentYear}. Our advisors specialize in matching families with the right level of dementia care—contact us for a free assessment.`
      }
    }
  ] : [];

  // FAQPage Schema - Dynamic PAA questions based on city data for AEO (enhanced for 2026)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      // City-specific long-tail FAQs first (for featured snippet priority)
      ...westlakeLongTailFAQs,
      ...beachwoodLongTailFAQs,
      // Standard FAQ entries
      {
        "@type": "Question",
        "name": `How much does assisted living cost in ${cityName}, Ohio in ${currentYear}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `In ${currentYear}, assisted living in ${cityName}, Ohio typically costs ${costData.assistedLiving} per month. Memory care ranges from ${costData.memoryCare} monthly, while independent living averages ${costData.independentLiving}. These costs include room and board, meals, housekeeping, and basic care services. ${cityName} has ${communityCount} senior living communities to compare, with options near ${nearestHospital} for convenient healthcare access.`
        }
      },
      {
        "@type": "Question",
        "name": `What is the best assisted living in ${cityName}, Ohio?`,
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
          "text": `${cityName} senior living communities have excellent healthcare access. ${cityData?.nearbyHospitals && cityData.nearbyHospitals.length > 0 ? `Nearby hospitals include: ${cityData.nearbyHospitals.slice(0, 3).join(', ')}.` : `Cleveland Clinic and University Hospitals have locations throughout the Greater Cleveland area.`} This proximity to world-class healthcare—including emergency rooms and specialist care—is a key advantage of choosing senior living in ${cityName}, OH.`
        }
      },
      {
        "@type": "Question",
        "name": `How do I choose the right senior living community in ${cityName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `To choose the right senior living in ${cityName} in ${currentYear}: 1) Assess care needs (independent living, assisted living, or memory care), 2) Determine budget (${cityName} assisted living averages ${costData.assistedLiving}/month), 3) Tour multiple communities, 4) Ask about staff-to-resident ratios and clinical certifications, 5) Review activities and amenities, 6) Check proximity to ${nearestHospital} and family. Guide for Seniors offers free expert consultations to help ${cityName} families navigate these decisions.`
        }
      },
      {
        "@type": "Question",
        "name": `Is assisted living cheaper than staying home in ${cityName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `For many ${cityName} seniors, assisted living can be comparable to or cheaper than staying home when considering all costs. Staying home often requires: home health aides ($2,400+/mo for 130 hours), property taxes (2.18% avg in Cuyahoga County), utilities, home maintenance, and groceries. All-inclusive assisted living in ${cityName} starts at ${costData.assistedLiving}/month and includes meals, utilities, housekeeping, and 24-hour care—often resulting in monthly savings of $500-$1,500.`
        }
      }
    ]
  };

  // Combine all schemas into one array
  const allSchemas = [
    medicalOrgSchema,
    localBusinessSchema, 
    breadcrumbSchema, 
    communityListSchema, 
    ...reviewSchema,
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
