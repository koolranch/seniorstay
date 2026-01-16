/**
 * Canonical URL Generator - Phase 2 SEO Recovery
 * Ensures consistent canonical URLs across all pages
 * 
 * Fixes 9 duplicate pages without canonicals and ensures
 * all internal links point to canonical versions
 */

const BASE_URL = 'https://www.guideforseniors.com';
const DEFAULT_REGION = 'cleveland';

/**
 * Generate canonical URL for a community page
 */
export function getCommunityCanonicalUrl(
  communityId: string,
  slug: string,
  regionSlug: string = DEFAULT_REGION
): string {
  const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '');
  return `${BASE_URL}/${regionSlug}/community/${communityId}/${cleanSlug}`;
}

/**
 * Generate canonical URL for a city/location page
 */
export function getCityCanonicalUrl(
  citySlug: string,
  regionSlug: string = DEFAULT_REGION
): string {
  const cleanSlug = citySlug.toLowerCase().replace(/\s+/g, '-');
  return `${BASE_URL}/${regionSlug}/${cleanSlug}`;
}

/**
 * Generate canonical URL for blog posts
 */
export function getBlogCanonicalUrl(slug: string): string {
  return `${BASE_URL}/blog/${slug}`;
}

/**
 * Generate canonical URL for events
 */
export function getEventCanonicalUrl(
  slug: string,
  regionSlug: string = DEFAULT_REGION
): string {
  return `${BASE_URL}/${regionSlug}/events/${slug}`;
}

/**
 * Generate canonical URL for resource pages
 */
export function getResourceCanonicalUrl(slug: string): string {
  return `${BASE_URL}/resources/${slug}`;
}

/**
 * Generate canonical URL for any page path
 * Normalizes the URL to ensure consistency
 */
export function getCanonicalUrl(path: string): string {
  // Remove trailing slashes
  let cleanPath = path.replace(/\/+$/, '');
  
  // Ensure path starts with /
  if (!cleanPath.startsWith('/')) {
    cleanPath = '/' + cleanPath;
  }
  
  // Handle legacy URL patterns - redirect to canonical versions
  const legacyPatterns: Record<string, string> = {
    '/greater-cleveland': '/cleveland',
    '/location/': '/cleveland/',
    '/community/': '/cleveland/community/',
    '/events': '/cleveland/events',
  };
  
  for (const [legacy, canonical] of Object.entries(legacyPatterns)) {
    if (cleanPath.startsWith(legacy)) {
      cleanPath = cleanPath.replace(legacy, canonical);
    }
  }
  
  return `${BASE_URL}${cleanPath}`;
}

/**
 * Check if a URL needs to be canonicalized
 * Returns the canonical version if different, null if already canonical
 */
export function checkCanonical(currentUrl: string): string | null {
  const canonical = getCanonicalUrl(currentUrl);
  const cleanCurrent = currentUrl.replace(/https?:\/\/[^/]+/, BASE_URL);
  
  if (canonical !== cleanCurrent) {
    return canonical;
  }
  
  return null;
}

/**
 * Generate metadata alternates object for Next.js pages
 */
export function generateAlternates(canonicalPath: string) {
  return {
    canonical: getCanonicalUrl(canonicalPath),
  };
}

export { BASE_URL, DEFAULT_REGION };
