import { communities, Community } from "@/lib/data/communities";
import { prisma } from "@/lib/prisma";

/**
 * This function validates that communities in the static array have matching 
 * entries in the database with consistent slugs and city names.
 */
export async function validateCommunityData() {
  console.log("Starting community data validation...");
  
  const results = {
    totalInStaticData: communities.length,
    validatedSuccessfully: 0,
    missingInDatabase: [] as { id: number; name: string; city: string; slug: string }[],
    slugMismatches: [] as { id: number; name: string; staticSlug: string; dbSlug: string }[],
    cityMismatches: [] as { id: number; name: string; staticCity: string; dbCity: string }[],
  };

  try {
    // First check if Prisma is available
    if (!prisma || !prisma.community) {
      console.error("Prisma client not available or Community model not accessible");
      return {
        success: false,
        error: "Prisma client not available",
        details: "Cannot access database to validate communities",
      };
    }

    // For each community in the static array, check if it exists in the database with matching slug/city
    for (const community of communities) {
      try {
        // Use findFirst with case-insensitive search on name which should be consistent
        const dbCommunity = await prisma.community.findFirst({
          where: {
            name: { equals: community.name, mode: 'insensitive' },
          },
        });

        if (!dbCommunity) {
          results.missingInDatabase.push({
            id: community.id,
            name: community.name,
            city: community.city,
            slug: community.slug,
          });
          continue;
        }

        // Check if the slugs match
        if (dbCommunity.slug.toLowerCase() !== community.slug.toLowerCase()) {
          results.slugMismatches.push({
            id: community.id,
            name: community.name,
            staticSlug: community.slug,
            dbSlug: dbCommunity.slug,
          });
        }

        // Check if the cities match
        if (dbCommunity.city.toLowerCase() !== community.city.toLowerCase()) {
          results.cityMismatches.push({
            id: community.id,
            name: community.name,
            staticCity: community.city,
            dbCity: dbCommunity.city,
          });
        }

        // If both match, increment the success counter
        if (
          dbCommunity.slug.toLowerCase() === community.slug.toLowerCase() &&
          dbCommunity.city.toLowerCase() === community.city.toLowerCase()
        ) {
          results.validatedSuccessfully++;
        }
      } catch (communityError) {
        console.error(`Error validating community ${community.name}:`, communityError);
      }
    }

    // Create a summary of the validation
    const summary = {
      success: true,
      totalCommunities: results.totalInStaticData,
      validatedSuccessfully: results.validatedSuccessfully,
      missingInDatabase: results.missingInDatabase.length,
      slugMismatches: results.slugMismatches.length,
      cityMismatches: results.cityMismatches.length,
      details: results,
    };

    console.log("Community validation complete:", summary);
    return summary;
  } catch (error) {
    console.error("Error in validation process:", error);
    return {
      success: false,
      error: "Validation process failed",
      details: error,
    };
  }
} 