import { Metadata } from "next";
import { notFound } from "next/navigation";
// import { communities } from "@/lib/data/staticCommunities"; // Remove static import
import { prisma } from "@/lib/prisma"; // Import Prisma client
import ProviderCard from "@/components/ProviderCard";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { slugify, getCityPath } from "@/lib/utils/formatSlug";
import type { Community } from "@prisma/client"; // Import Prisma Community type

// Helper function to parse services (assuming it might be a string)
const parseServices = (services: string | string[] | null | undefined): string[] => {
  if (Array.isArray(services)) {
    return services;
  }
  if (typeof services === 'string') {
    try {
      // Attempt to parse if it's a JSON string array
      const parsed = JSON.parse(services);
      if (Array.isArray(parsed)) {
        return parsed.filter(item => typeof item === 'string');
      }
    } catch (e) {
      // If parsing fails, treat as comma-separated or single string
      return services.split(',').map(s => s.trim()).filter(Boolean);
    }
  }
  return []; // Return empty array if null, undefined, or unexpected type
};


// Generate metadata for each city page
export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const cityName = params.city.split("-").map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(" ");

  // Fetch communities for metadata generation
  const cityCommunities = await prisma.community.findMany({
    where: { 
      state: 'OH',
      city: { equals: cityName, mode: 'insensitive' } 
    },
     select: { 
      name: true,
      id: true,
    },
  });

  const totalCommunities = cityCommunities.length;

  if (totalCommunities === 0) {
    return {
      title: `Senior Living in ${cityName} | Not Found | Guide for Seniors`,
      description: `No senior living communities found for ${cityName}, Ohio.`,
    };
  }
  
  // Create structured data for the city
  const cityStructuredData = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: `Senior Living in ${cityName}, Ohio`,
    address: {
      "@type": "PostalAddress",
      addressLocality: cityName,
      addressRegion: "OH",
      addressCountry: "US"
    },
    url: `https://www.guideforseniors.com/ohio/${params.city}`, 
    description: `Explore ${totalCommunities} senior living communities in ${cityName}, Ohio including assisted living, memory care, and independent living options.`,
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${cityName}, OH`)}`,
  };

  return {
    title: `Senior Living in ${cityName} | Guide for Seniors`,
    description: `Explore ${totalCommunities} assisted living, memory care, and independent living options in ${cityName}, Ohio. See reviews, amenities, and request a tour.`,
    alternates: {
      canonical: `/ohio/${params.city}`,
    },
    other: {
      'application/ld+json': JSON.stringify(cityStructuredData, null, 2) 
    }
  };
}

// Generate static paths for all Ohio cities with communities FROM DB
export async function generateStaticParams() {
  const ohioCommunities = await prisma.community.findMany({
    where: { state: 'OH' },
    select: { city: true }, // Only select city
    distinct: ['city'], // Get distinct cities
  });

  // Ensure cities are valid strings before slugifying
  const validCities = ohioCommunities
    .map(c => c.city)
    .filter((city): city is string => typeof city === 'string' && city.trim() !== ''); 

  // Count occurrences or just generate paths for existing cities
   // We might still want the count >= 2 logic depending on requirements
   // For now, let's generate for all distinct cities found in DB for Ohio
  return validCities.map(city => ({
    city: slugify(city), // Slugify the actual city name from DB
  }));

  /* // Optional: Re-implement count logic if needed
  const cityGroups = await prisma.community.groupBy({
    by: ['city'],
    where: { state: 'OH' },
    _count: { city: true },
  });

  return cityGroups
    .filter(group => group._count.city >= 2 && group.city) // Ensure city exists
    .map(group => ({
      city: slugify(group.city!), // Slugify the non-null city name
    }));
  */
}

// Make the component async to use await for prisma query
export default async function CityPage({ params }: { params: { city: string } }) {
  const cityName = params.city.split("-").map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(" ");

  // Fetch communities for this city from the database
  const cityCommunities = await prisma.community.findMany({
    where: {
      state: 'OH',
      city: { equals: cityName, mode: 'insensitive' } 
    },
     select: {
      id: true,
      name: true,
      slug: true,
      city: true,
      state: true,
      imageUrl: true, 
      services: true, 
      address: true, 
      description: true,
    }
  });

  // if (cityCommunities.length === 0) {
  //   notFound();
  // }

  // Get nearby cities (Optional: Fetch from DB as well or keep static logic)
  // Keeping static logic for nearby cities for now, might need adjustment
  // Need to import static 'communities' again if using this part
  /* 
  const nearbyCities = communities 
    .filter(community => 
      community.state === "OH" && 
      community.city !== cityName &&
      slugify(community.city) !== params.city
    )
    // ... rest of nearby cities logic ...
  */
   // Simplified nearby cities logic (example - fetches distinct Ohio cities excluding current)
   const allOhioCities = await prisma.community.findMany({
     where: { 
       state: 'OH',
       NOT: { city: { equals: cityName, mode: 'insensitive' } } // Exclude current city
     },
     select: { city: true },
     distinct: ['city']
   });
   
   const nearbyCitiesList = allOhioCities
     .map(c => c.city)
     .filter((city): city is string => typeof city === 'string' && city.trim() !== '') // Type guard
     .slice(0, 5) // Limit to 5
     .map(city => ({
       name: city,
       slug: slugify(city),
     }));

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 py-8">
        <div className="container mx-auto px-6 md:px-10 lg:px-20">
          {/* Back Link */}
          <Link 
            href="/ohio" 
            className="inline-flex items-center text-[#1b4d70] mb-6 hover:underline"
          >
            <FiArrowLeft className="mr-2" />
            Back to Ohio Communities
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-[#1b4d70] mb-4">
            Senior Living in {cityName}, Ohio
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Explore {cityCommunities.length} senior living communities in {cityName}. 
            Compare amenities, care types, and request a tour today.
          </p>
        </div>
      </div>

      {/* Communities Grid / No Communities Message */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-6 md:px-10 lg:px-20">
          {cityCommunities.length > 0 ? (
            <>
              <h2 className="text-2xl font-semibold text-[#1b4d70] mb-6">
                Communities in {cityName}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                {cityCommunities.map((community) => {
                  const amenitiesList = parseServices(community.services);
                  // ... rest of ProviderCard mapping
                  const derivedType = community.description?.includes("Memory Care") ? "Memory Care" : 
                                    community.description?.includes("Assisted Living") ? "Assisted Living" :
                                    community.description?.includes("Independent Living") ? "Independent Living" :
                                    "Senior Living"; // Default fallback

                  return (
                    <ProviderCard
                      key={community.id}
                      id={community.id}
                      slug={community.slug ?? undefined}
                      name={community.name ?? 'Unnamed Community'}
                      city={community.city ?? undefined}
                      state={community.state ?? 'N/A'}
                      type={derivedType}
                      image={community.imageUrl ?? "/placeholder-image.png"}
                      rating={0}
                      amenities={amenitiesList}
                    />
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-10 px-6 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">
                No Communities Listed Yet
              </h2>
              <p className="text-gray-600 mb-6">
                We couldn't find any senior living communities listed for {cityName}, Ohio at this time. 
                Please check back later or explore other cities.
              </p>
              {/* Optional: Link back to the main Ohio page or search */}
              <Link 
                href="/ohio" 
                className="text-blue-600 hover:underline"
              >
                Explore other Ohio cities
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Nearby Cities */}
      {nearbyCitiesList.length > 0 && (
        <div className="py-12 bg-white border-t border-neutral-200">
          <div className="container mx-auto px-6 md:px-10 lg:px-20">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-[#1b4d70] mb-4">
                Explore Nearby Cities
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {nearbyCitiesList.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/ohio/${city.slug}`}
                    className="text-[#1b4d70] hover:underline"
                  >
                    {city.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Local SEO Content */}
      <div className="py-12 bg-gray-50 border-t border-neutral-200">
        <div className="container mx-auto px-6 md:px-10 lg:px-20">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">
              Senior Living Options in {cityName}
            </h2>
            <p>
              {cityName} offers a variety of senior living communities to meet different needs and preferences. 
              From independent living for active seniors to assisted living and memory care for those requiring more support, 
              you'll find options that match your specific requirements.
            </p>
            <p>
              Each community in {cityName} provides unique amenities, care services, and living arrangements. 
              Use our directory to compare features, read reviews, and connect with communities that align with your needs.
            </p>
            <p>
              Whether you're looking for a vibrant social environment, specialized memory care, or a peaceful retirement setting, 
              {cityName}'s senior living communities offer diverse options to support your lifestyle and care needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 