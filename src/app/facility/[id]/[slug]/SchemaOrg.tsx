"use client";

import * as React from 'react';
import { Community } from '@/data/facilities';

interface SchemaOrgProps {
  community: Community;
}

export const SchemaOrg: React.FC<SchemaOrgProps> = ({ community }: SchemaOrgProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SeniorHousing",
    "name": community.name,
    "description": community.description,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": community.address,
      "addressLocality": community.city,
      "addressRegion": community.state,
      "postalCode": community.zip,
      "addressCountry": "US"
    },
    "telephone": community.phone,
    "email": community.email,
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