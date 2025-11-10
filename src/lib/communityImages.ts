/**
 * Community Image Utilities
 * Handles varied placeholders and image URL management
 */

// 8 varied high-quality placeholder images for senior living communities
const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1519974719765-e6559eac2575?q=80&w=800&auto=format&fit=crop", // Modern senior living exterior
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop", // Professional building exterior
  "https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=800&auto=format&fit=crop", // Healthcare facility
  "https://images.unsplash.com/photo-1564731071754-8f8cd0ba8f30?q=80&w=800&auto=format&fit=crop", // Medical center
  "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=800&auto=format&fit=crop", // Modern medical building
  "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=800&auto=format&fit=crop", // Healthcare building
  "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=800&auto=format&fit=crop", // Care facility exterior
  "https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=800&auto=format&fit=crop", // Professional building
];

/**
 * Get a consistent placeholder image for a community based on its ID
 * Uses hash of ID to ensure same community always gets same placeholder
 */
export function getPlaceholderImage(communityId: string): string {
  const hash = communityId.split('').reduce((acc, char) => 
    acc + char.charCodeAt(0), 0);
  return PLACEHOLDER_IMAGES[hash % PLACEHOLDER_IMAGES.length];
}

/**
 * Get community image URL with fallback to varied placeholder
 * @param imageUrl - The image URL from database (can be null/undefined)
 * @param communityId - The community ID for consistent placeholder selection
 * @returns Valid image URL
 */
export function getCommunityImage(imageUrl: string | null | undefined, communityId: string): string {
  if (imageUrl) {
    // If URL starts with /community-images/, prepend Supabase URL
    if (imageUrl.startsWith('/community-images/')) {
      return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public${imageUrl}`;
    }
    return imageUrl;
  }
  
  // Return consistent placeholder based on community ID
  return getPlaceholderImage(communityId);
}

