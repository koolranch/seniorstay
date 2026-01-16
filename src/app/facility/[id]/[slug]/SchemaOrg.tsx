"use client";

import * as React from 'react';
import { Community } from '@/data/facilities';
import { 
  generateCommunitySchema, 
  generateBreadcrumbSchema,
  SCHEMA_DEFAULTS 
} from '@/lib/seo/schema-generator';

interface SchemaOrgProps {
  community: Community;
  regionSlug?: string;
}

/**
 * SchemaOrg Component - Phase 2 SEO Recovery
 * Generates valid structured data for community detail pages
 * Fixes 438 Schema.org validation errors by ensuring all required fields
 */
export const SchemaOrg: React.FC<SchemaOrgProps> = ({ 
  community, 
  regionSlug = 'cleveland' 
}: SchemaOrgProps) => {
  // Generate validated schema using centralized generator
  const localBusinessSchema = generateCommunitySchema(community, {
    regionSlug,
    phone: SCHEMA_DEFAULTS.phone,
    includeAggregateRating: true,
  });

  const breadcrumbSchema = generateBreadcrumbSchema(community, {
    regionSlug,
    regionName: 'Greater Cleveland',
  });

  // Combine schemas
  const schemas = [localBusinessSchema, breadcrumbSchema];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
    />
  );
}; 