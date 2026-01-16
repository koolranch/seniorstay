/**
 * Alt Text Generator - Phase 2 Accessibility Recovery
 * Generates SEO-friendly and accessible alt text for community images
 * 
 * Fixes 712 missing alt text errors by providing consistent, descriptive alt text
 */

import { Community } from '@/data/facilities';

/**
 * Clean and normalize community name for alt text
 */
function normalizeForAlt(text: string): string {
  return text
    .replace(/[,\-–—]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\bOH\b/i, 'Ohio')
    .trim();
}

/**
 * Extract primary care type for alt text
 */
function getPrimaryCareType(careTypes: string[] | undefined): string {
  if (!careTypes || careTypes.length === 0) return 'senior living';
  
  // Priority order for most specific type
  if (careTypes.includes('Memory Care')) return 'memory care';
  if (careTypes.includes('Assisted Living')) return 'assisted living';
  if (careTypes.includes('Independent Living')) return 'independent living';
  if (careTypes.includes('Skilled Nursing')) return 'skilled nursing';
  
  return careTypes[0].toLowerCase();
}

/**
 * Generate primary alt text for community hero/main image
 * Pattern: "[Community Name] [care type] facility in [City, State]"
 */
export function generatePrimaryAlt(
  community: Partial<Community> & { name: string },
  city?: string,
  state: string = 'Ohio'
): string {
  const cityName = city || extractCityFromLocation(community.location);
  const careType = getPrimaryCareType(community.careTypes);
  
  return `${normalizeForAlt(community.name)} ${careType} facility in ${cityName}, ${state}`;
}

/**
 * Generate alt text for gallery images
 * Pattern: "[Community Name] - [Image context] in [City]"
 */
export function generateGalleryAlt(
  community: Partial<Community> & { name: string },
  imageIndex: number,
  totalImages: number,
  context?: string
): string {
  const cleanName = normalizeForAlt(community.name);
  
  // Generate contextual description based on index
  const contextMap: Record<number, string> = {
    0: 'exterior view',
    1: 'interior common area',
    2: 'dining room',
    3: 'resident room',
    4: 'outdoor space',
    5: 'activity room',
    6: 'entrance',
    7: 'amenities'
  };
  
  const imageContext = context || contextMap[imageIndex] || `view ${imageIndex + 1} of ${totalImages}`;
  
  return `${cleanName} - ${imageContext}`;
}

/**
 * Generate alt text for listing card thumbnail
 * Pattern: "Senior living in [City] - [Community Name]"
 */
export function generateListingAlt(
  community: Partial<Community> & { name: string }
): string {
  const cityName = extractCityFromLocation(community.location);
  const careType = getPrimaryCareType(community.careTypes);
  
  return `${capitalizeFirst(careType)} in ${cityName} - ${normalizeForAlt(community.name)}`;
}

/**
 * Generate alt text for map marker popup
 */
export function generateMapAlt(
  community: Partial<Community> & { name: string }
): string {
  const cityName = extractCityFromLocation(community.location);
  return `${normalizeForAlt(community.name)} location in ${cityName}`;
}

/**
 * Extract city name from location string
 */
function extractCityFromLocation(location?: string): string {
  if (!location) return 'Cleveland area';
  const parts = location.split(',');
  return parts[0]?.trim() || 'Cleveland area';
}

/**
 * Capitalize first letter
 */
function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generate SQL-safe alt text for bulk database updates
 * Returns escaped string ready for SQL insertion
 */
export function generateAltForDatabase(
  name: string,
  city: string,
  state: string = 'OH'
): string {
  const stateFull = state === 'OH' ? 'Ohio' : state;
  const cleanName = name.replace(/'/g, "''"); // Escape single quotes for SQL
  const cleanCity = city.replace(/'/g, "''");
  
  return `${cleanName} senior living facility in ${cleanCity}, ${stateFull}`;
}

/**
 * Batch generate alt text data for SQL migration
 */
export function generateBulkAltTextSQL(
  communities: Array<{ id: string; name: string; city: string; state?: string }>
): string {
  const updates = communities.map(c => {
    const alt = generateAltForDatabase(c.name, c.city, c.state);
    return `WHEN id = '${c.id}' THEN '${alt}'`;
  });
  
  return `
UPDATE "Community"
SET image_alt = CASE
  ${updates.join('\n  ')}
  ELSE image_alt
END
WHERE id IN (${communities.map(c => `'${c.id}'`).join(', ')});
  `.trim();
}
