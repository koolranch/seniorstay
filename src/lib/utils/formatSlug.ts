import type { Community } from "@/lib/data/staticCommunities";

/**
 * Formats a string into a URL-friendly slug
 * - Converts to lowercase
 * - Replaces spaces with hyphens
 * - Removes special characters
 * - Trims leading/trailing hyphens
 * 
 * @param text The text to convert to a slug
 * @returns A URL-friendly slug
 */
export function slugify(text: string): string {
  if (!text) return '';
  
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')        // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple hyphens with single hyphen
    .replace(/^-+/, '')          // Trim hyphens from start
    .replace(/-+$/, '');         // Trim hyphens from end
}

/**
 * Converts a slug back into a more readable string.
 * - Replaces hyphens with spaces
 * - Capitalizes the first letter of each word
 */
export const unslugify = (slug: string): string => {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Formats a path for community URLs
 * 
 * @param state The state name or abbreviation
 * @param city The city name
 * @param slug The community slug
 * @returns A formatted path for community URLs
 */
export function getCommunityPath(state: string, city: string, slug: string): string {
  const stateSlug = slugify(state);
  const citySlug = slugify(city);
  const communitySlug = slugify(slug);
  
  return `/ohio/${citySlug}/${communitySlug}`;
}

/**
 * Formats a path for city/region URLs
 * 
 * @param state The state name or abbreviation
 * @param city The city name
 * @returns A formatted path for city/region URLs
 */
export function getCityPath(state: string, city: string): string {
  const stateSlug = slugify(state);
  const citySlug = slugify(city);
  
  return `/ohio/${citySlug}`;
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use slugify instead
 */
export function formatSlug(text: string): string {
  return slugify(text);
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use slugify instead
 */
export function formatLocation(text: string): string {
  return slugify(text);
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use getCommunityPath(state, city, slug) instead
 */
export function getCommunityPathFromObject(community: Community): string {
  return getCommunityPath(community.state, community.city, community.name);
} 