import { communities, Community } from "@/lib/data/staticCommunities";
import { prisma } from "@/lib/prisma";

/**
 * Manually format a string into a URL-friendly slug
 */
function formatSlug(text: string): string {
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
 * Synchronizes communities data between the static array and database.
 * This ensures consistency in slug generation and community data.
 */
export async function syncCommunitiesData() {
  console.log("Starting communities data synchronization...");
  
  // Results tracking
  const results = {
    totalProcessed: 0,
    created: 0,
    updated: 0,
    failed: 0,
    errors: [] as { id: number; name: string; error: string }[],
  };

  try {
    // Check if Prisma client is available
    if (!prisma || !prisma.community) {
      throw new Error("Prisma client not available or Community model not accessible");
    }
    
    // Process each community in the static array
    for (const community of communities) {
      try {
        results.totalProcessed++;
        
        // Ensure consistent slug formatting using the formatSlug function
        const formattedSlug = formatSlug(community.slug || community.name);
        // Create city_slug for exact matching
        const citySlug = community.city.toLowerCase().replace(/\s+/g, '-');
        
        // Try to find the community in the database
        const existingCommunity = await prisma.community.findFirst({
          where: {
            OR: [
              // Match by name (case insensitive)
              { name: { equals: community.name, mode: 'insensitive' } },
              // Or by slug (if it exists in the database)
              { slug: { equals: formattedSlug, mode: 'insensitive' } }
            ]
          }
        });

        if (existingCommunity) {
          // Update the existing record to ensure consistency
          await prisma.community.update({
            where: { id: existingCommunity.id },
            data: {
              // Ensure these critical fields are consistent
              slug: formattedSlug,
              city: community.city,
              city_slug: citySlug,
              state: community.state === "OH" ? "Ohio" : community.state, // Normalize state
              
              // Update other fields if they've changed
              name: community.name,
              type: community.type,
              description: community.description,
              rating: community.rating || undefined,
              reviewCount: community.reviewCount || undefined,
              address: community.address,
              amenities: Array.isArray(community.amenities) ? community.amenities : [], // Ensure it's an array
              // Only update images if they exist in the static data
              ...(community.image ? { 
                images: [community.image] // Convert single image to array for db schema
              } : {}),
              phone: community.phone || null,
            }
          });
          
          results.updated++;
          console.log(`Updated community: ${community.name} (ID: ${existingCommunity.id})`);
        } else {
          // Create a new record
          await prisma.community.create({
            data: {
              // Required fields
              name: community.name,
              slug: formattedSlug,
              city: community.city,
              city_slug: citySlug,
              state: community.state === "OH" ? "Ohio" : community.state, // Normalize state
              
              // Optional fields
              type: community.type,
              description: community.description,
              rating: community.rating || undefined,
              reviewCount: community.reviewCount || undefined,
              address: community.address,
              amenities: Array.isArray(community.amenities) ? community.amenities : [], // Ensure it's an array
              images: [community.image], // Convert single image to array for db schema
              phone: community.phone || null,
            }
          });
          
          results.created++;
          console.log(`Created community: ${community.name}`);
        }
      } catch (error) {
        results.failed++;
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        results.errors.push({
          id: community.id,
          name: community.name,
          error: errorMessage
        });
        
        console.error(`Error processing community ${community.name}:`, error);
      }
    }

    // Create a summary
    const summary = {
      success: results.failed === 0,
      totalProcessed: results.totalProcessed,
      created: results.created,
      updated: results.updated,
      failed: results.failed,
      errorCount: results.errors.length,
      errors: results.errors
    };
    
    console.log("Community data synchronization complete:", summary);
    return summary;
  } catch (error) {
    console.error("Error synchronizing community data:", error);
    return {
      success: false,
      error: "Synchronization process failed",
      details: error instanceof Error ? error.message : String(error)
    };
  }
} 