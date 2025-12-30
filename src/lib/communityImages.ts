/**
 * Community Image Utilities
 * Handles image URL management and fallback generation
 * Updated: 2025-12-30 - Improved fallback system with inline SVG placeholders
 */

/**
 * Generate an inline SVG placeholder for communities without images
 * This creates a branded, professional-looking placeholder instantly (no external requests)
 */
function generateSVGPlaceholder(communityId: string, communityName?: string): string {
  // Color palette for senior living communities
  const colors = [
    { bg: '#1e3a5f', accent: '#3b82f6' }, // Navy blue
    { bg: '#065f46', accent: '#10b981' }, // Green
    { bg: '#7c2d12', accent: '#f97316' }, // Warm brown
    { bg: '#4c1d95', accent: '#8b5cf6' }, // Purple
    { bg: '#0f766e', accent: '#14b8a6' }, // Teal
    { bg: '#9a3412', accent: '#fb923c' }, // Orange
  ];
  
  const hash = communityId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorSet = colors[hash % colors.length];
  
  const name = communityName || 'Community';
  const initials = name
    .split(/[\s,]+/)
    .slice(0, 2)
    .map(word => word[0]?.toUpperCase() || '')
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:${colorSet.bg}"/><stop offset="100%" style="stop-color:${colorSet.accent};stop-opacity:0.8"/></linearGradient></defs><rect width="800" height="600" fill="url(#g)"/><g transform="translate(400,250)"><circle r="70" fill="white" fill-opacity="0.15"/><path d="M-35 15 L0 -25 L35 15 L35 40 L-35 40 Z" fill="white" fill-opacity="0.9"/><rect x="-12" y="22" width="24" height="18" fill="${colorSet.bg}" fill-opacity="0.5"/></g><text x="400" y="380" text-anchor="middle" fill="white" font-family="system-ui" font-size="28" font-weight="600" opacity="0.9">${initials}</text><text x="400" y="520" text-anchor="middle" fill="white" font-family="system-ui" font-size="14" opacity="0.6">Senior Living Community</text></svg>`;
  
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * Get a consistent placeholder image for a community based on its ID
 * Uses inline SVG data URLs for instant loading (no external requests)
 */
export function getPlaceholderImage(communityId: string, communityName?: string): string {
  return generateSVGPlaceholder(communityId, communityName);
}

/**
 * Validate and normalize image URL
 * Returns null if URL is invalid or likely to fail
 */
function validateImageUrl(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  
  const trimmed = url.trim();
  if (!trimmed) return null;
  
  // Check for valid URL patterns
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
    return trimmed;
  }
  
  return null;
}

/**
 * Get community image URL with fallback to SVG placeholder
 * @param imageUrl - The image URL from database (can be null/undefined)
 * @param communityId - The community ID for consistent placeholder selection
 * @param communityName - Optional community name for placeholder initials
 * @returns Valid image URL (either actual image or SVG data URL placeholder)
 */
export function getCommunityImage(
  imageUrl: string | null | undefined, 
  communityId: string,
  communityName?: string
): string {
  const validUrl = validateImageUrl(imageUrl || '');
  
  if (validUrl) {
    // If URL starts with /community-images/, prepend Supabase URL
    if (validUrl.startsWith('/community-images/')) {
      return `https://hncgnxbooghjhpncujzx.supabase.co/storage/v1/object/public${validUrl}`;
    }
    return validUrl;
  }
  
  // Return SVG placeholder for communities without images
  return getPlaceholderImage(communityId, communityName);
}

