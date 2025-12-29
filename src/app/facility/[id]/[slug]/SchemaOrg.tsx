"use client";

import * as React from 'react';
import { Community } from '@/data/facilities';

interface SchemaOrgProps {
  community: Community;
}

export const SchemaOrg: React.FC<SchemaOrgProps> = ({ community }: SchemaOrgProps) => {
  // Extract city, state, and zip from location and address
  const locationParts = community.location.split(',');
  const city = locationParts[0]?.trim() || '';
  const state = locationParts[1]?.trim() || '';
  
  // Extract zip from address if available
  let zip = '';
  if (community.address) {
    const zipMatch = community.address.match(/\b\d{5}(-\d{4})?\b/);
    if (zipMatch) {
      zip = zipMatch[0];
    }
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "SeniorHousing",
    "name": community.name,
    "description": community.description,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": community.address,
      "addressLocality": city,
      "addressRegion": state,
      "postalCode": zip,
      "addressCountry": "US"
    },
    "telephone": "(216) 677-4630", // Default phone number since it's not in the Community type
    "email": "info@example.com", // Default email since it's not in the Community type
    "amenityFeature": community.amenities?.map(amenity => ({
      "@type": "LocationFeatureSpecification",
      "name": amenity
    })),
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}; 