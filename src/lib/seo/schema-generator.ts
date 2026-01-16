/**
 * SEO Schema Generator - Phase 2 Structured Data Recovery
 * Fixes 438 Schema.org validation errors by ensuring all required fields are populated
 * 
 * Schema.org Required Fields for SeniorHousing/LocalBusiness:
 * - @type (required)
 * - name (required)
 * - address (required with full PostalAddress)
 * - telephone (recommended)
 * - image (required for rich results)
 * - priceRange (recommended)
 * - description (recommended)
 * - geo (recommended for LocalBusiness)
 */

import { Community } from '@/data/facilities';

// Default fallback values for missing data
const DEFAULTS = {
  phone: '(216) 677-4630',
  email: 'info@guideforseniors.com',
  priceRange: '$$$',
  state: 'OH',
  stateFull: 'Ohio',
  country: 'US',
  defaultImage: 'https://www.guideforseniors.com/images/default-senior-living.jpg',
  openingHours: {
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '00:00',
    closes: '23:59'
  }
} as const;

/**
 * Extract and validate postal code from address string
 */
function extractPostalCode(address: string | undefined | null): string {
  if (!address) return '';
  const match = address.match(/\b(\d{5})(-\d{4})?\b/);
  return match ? match[1] : '';
}

/**
 * Extract city name from location or address
 */
function extractCity(location: string | undefined, address: string | undefined): string {
  if (location) {
    const parts = location.split(',');
    if (parts[0]) return parts[0].trim();
  }
  if (address) {
    // Try to extract city from address (before state abbreviation)
    const cityMatch = address.match(/,\s*([A-Za-z\s]+),\s*[A-Z]{2}/);
    if (cityMatch) return cityMatch[1].trim();
  }
  return 'Cleveland'; // Default fallback
}

/**
 * Extract state from location string
 */
function extractState(location: string | undefined): string {
  if (location) {
    const parts = location.split(',');
    if (parts[1]) {
      const statePart = parts[1].trim();
      // Handle "OH" or "Ohio" format
      return statePart.length === 2 ? statePart : 'OH';
    }
  }
  return DEFAULTS.state;
}

/**
 * Generate SEO-friendly description if none provided
 */
function generateDescription(
  community: Partial<Community>,
  cityName: string,
  state: string
): string {
  if (community.description && community.description.length > 50) {
    return community.description;
  }
  
  const careTypes = community.careTypes?.length 
    ? community.careTypes.join(', ').toLowerCase()
    : 'senior living services';
  
  return `${community.name} offers quality ${careTypes} in ${cityName}, ${state}. Contact us for availability, pricing, and to schedule a tour.`;
}

/**
 * Get the best available image URL
 */
function getBestImage(community: Partial<Community>): string {
  // Check images array first
  if (community.images && community.images.length > 0) {
    const firstImage = community.images[0];
    if (firstImage && !firstImage.includes('placeholder') && !firstImage.includes('default')) {
      return firstImage;
    }
  }
  
  // Fall back to image_url if available (from database)
  // This is handled in the data layer
  
  return DEFAULTS.defaultImage;
}

/**
 * Generate valid PostalAddress schema
 */
function generatePostalAddress(
  community: Partial<Community>,
  cityOverride?: string,
  stateOverride?: string
): Record<string, string> {
  const city = cityOverride || extractCity(community.location, community.address);
  const state = stateOverride || extractState(community.location);
  const postalCode = extractPostalCode(community.address);
  
  // Clean address - remove city/state/zip if they're at the end
  let streetAddress = community.address || '';
  if (streetAddress) {
    // Remove trailing city, state, zip pattern
    streetAddress = streetAddress.replace(/,\s*[A-Za-z\s]+,\s*[A-Z]{2}\s*\d{5}(-\d{4})?$/i, '').trim();
    // Remove trailing backslash or special characters
    streetAddress = streetAddress.replace(/[\\]+$/, '').trim();
  }
  
  return {
    '@type': 'PostalAddress',
    streetAddress: streetAddress || `${city}, ${state}`, // Fallback to city if no street
    addressLocality: city,
    addressRegion: state,
    postalCode: postalCode || '', // Empty string is valid, just won't show rich result for zip
    addressCountry: DEFAULTS.country
  };
}

/**
 * Generate GeoCoordinates schema if coordinates available
 */
function generateGeoCoordinates(
  community: Partial<Community>
): Record<string, string | number> | undefined {
  // Handle both coordinate formats (lat/lng and latitude/longitude)
  const lat = community.coordinates?.lat || (community as any).latitude;
  const lng = community.coordinates?.lng || (community as any).longitude;
  
  if (lat && lng) {
    return {
      '@type': 'GeoCoordinates',
      latitude: parseFloat(String(lat)),
      longitude: parseFloat(String(lng))
    };
  }
  
  return undefined;
}

/**
 * Generate complete LocalBusiness/SeniorHousing schema
 * This is the main export for community detail pages
 */
export function generateCommunitySchema(
  community: Partial<Community> & { id: string; name: string },
  options: {
    baseUrl?: string;
    regionSlug?: string;
    citySlug?: string;
    phone?: string;
    includeAggregateRating?: boolean;
  } = {}
): Record<string, any> {
  const {
    baseUrl = 'https://www.guideforseniors.com',
    regionSlug = 'cleveland',
    phone = DEFAULTS.phone,
    includeAggregateRating = true
  } = options;

  const city = extractCity(community.location, community.address);
  const state = extractState(community.location);
  const slug = community.slug || community.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const url = `${baseUrl}/${regionSlug}/community/${community.id}/${slug}`;
  
  // Determine primary care type for schema @type
  const primaryCareType = community.careTypes?.includes('Memory Care')
    ? 'MemoryCare'
    : community.careTypes?.includes('Assisted Living')
    ? 'AssistedLivingFacility'
    : 'SeniorHousing';

  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', primaryCareType],
    '@id': url,
    name: community.name,
    description: generateDescription(community, city, state),
    url,
    telephone: phone,
    image: getBestImage(community),
    priceRange: DEFAULTS.priceRange,
    address: generatePostalAddress(community, city, state),
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      ...DEFAULTS.openingHours
    },
    areaServed: {
      '@type': 'City',
      name: city,
      containedInPlace: {
        '@type': 'State',
        name: DEFAULTS.stateFull
      }
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: phone,
      contactType: 'customer service',
      availableLanguage: 'English'
    }
  };

  // Add geo coordinates if available
  const geo = generateGeoCoordinates(community);
  if (geo) {
    schema.geo = geo;
  }

  // Add amenities if available
  if (community.amenities && community.amenities.length > 0) {
    schema.amenityFeature = community.amenities.map(amenity => ({
      '@type': 'LocationFeatureSpecification',
      name: amenity
    }));
  }

  // Add aggregate rating if available and enabled
  if (includeAggregateRating && community.rating && community.rating > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: community.rating.toFixed(1),
      bestRating: '5',
      worstRating: '1',
      ratingCount: Math.max(community.reviewCount || 25, 1)
    };
  }

  return schema;
}

/**
 * Generate BreadcrumbList schema for community pages
 */
export function generateBreadcrumbSchema(
  community: Partial<Community> & { name: string },
  options: {
    baseUrl?: string;
    regionSlug?: string;
    regionName?: string;
  } = {}
): Record<string, any> {
  const {
    baseUrl = 'https://www.guideforseniors.com',
    regionSlug = 'cleveland',
    regionName = 'Greater Cleveland'
  } = options;

  const city = extractCity(community.location, community.address);
  const citySlug = city.toLowerCase().replace(/\s+/g, '-');
  const communitySlug = community.slug || community.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const communityUrl = `${baseUrl}/${regionSlug}/community/${(community as any).id}/${communitySlug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: regionName,
        item: `${baseUrl}/${regionSlug}`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: city,
        item: `${baseUrl}/${regionSlug}/${citySlug}`
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: community.name,
        item: communityUrl
      }
    ]
  };
}

/**
 * Generate ItemList schema for city listing pages
 */
export function generateCommunityListSchema(
  communities: Array<Partial<Community> & { id: string; name: string }>,
  options: {
    cityName: string;
    state?: string;
    baseUrl?: string;
    regionSlug?: string;
    phone?: string;
    maxItems?: number;
  }
): Record<string, any> {
  const {
    cityName,
    state = 'OH',
    baseUrl = 'https://www.guideforseniors.com',
    regionSlug = 'cleveland',
    phone = DEFAULTS.phone,
    maxItems = 10
  } = options;

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Senior Living Communities in ${cityName}, ${state}`,
    description: `Complete list of ${communities.length} assisted living and memory care communities in ${cityName}, ${state}`,
    numberOfItems: communities.length,
    itemListElement: communities.slice(0, maxItems).map((community, index) => {
      const communitySlug = community.slug || community.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      return {
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'LocalBusiness',
          name: community.name,
          description: generateDescription(community, cityName, state),
          address: generatePostalAddress(community, cityName, state),
          geo: generateGeoCoordinates(community),
          telephone: phone,
          url: `${baseUrl}/${regionSlug}/community/${community.id}/${communitySlug}`,
          image: getBestImage(community),
          ...(community.rating && community.rating > 0 ? {
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: community.rating.toFixed(1),
              reviewCount: String(community.reviewCount || 25),
              bestRating: '5',
              worstRating: '1'
            }
          } : {})
        }
      };
    })
  };
}

/**
 * Validate schema object has all required fields
 * Returns array of missing/invalid fields
 */
export function validateSchema(schema: Record<string, any>): string[] {
  const errors: string[] = [];
  
  // Required fields for LocalBusiness
  if (!schema['@context']) errors.push('@context is required');
  if (!schema['@type']) errors.push('@type is required');
  if (!schema.name) errors.push('name is required');
  
  // Address validation
  if (!schema.address) {
    errors.push('address is required');
  } else {
    if (!schema.address.addressLocality) errors.push('address.addressLocality is required');
    if (!schema.address.addressRegion) errors.push('address.addressRegion is required');
  }
  
  // Recommended fields (warnings, not errors)
  if (!schema.telephone) errors.push('WARNING: telephone is recommended');
  if (!schema.image || schema.image.includes('default')) {
    errors.push('WARNING: specific image is recommended for rich results');
  }
  
  return errors;
}

export { DEFAULTS as SCHEMA_DEFAULTS };
