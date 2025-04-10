import { Metadata } from "next";
import { notFound } from "next/navigation";
import { communities } from "@/lib/data/communities";
import ProviderCard from "@/components/ProviderCard";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { slugify, getCityPath } from "@/lib/utils/formatSlug";

// Generate metadata for each city page
export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const cityName = params.city.split("-").map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(" ");
  
  const cityCommunities = communities.filter(
    community => community.state === "OH" && 
    slugify(community.city) === params.city
  );

  if (cityCommunities.length === 0) {
    return {
      title: "City Not Found | SeniorStay",
      description: "The requested city page could not be found.",
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
    description: `Explore ${cityCommunities.length} senior living communities in ${cityName}, Ohio including assisted living, memory care, and independent living options.`,
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${cityName}, OH`)}`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: (cityCommunities.reduce((sum, community) => sum + community.rating, 0) / cityCommunities.length).toFixed(1),
      reviewCount: cityCommunities.length
    }
  };

  return {
    title: `Senior Living in ${cityName} | Guide for Seniors`,
    description: `Explore assisted living, memory care, and independent living in ${cityName}, Ohio. See reviews, amenities, and request a tour.`,
    alternates: {
      canonical: `/ohio/${params.city}`,
    },
    other: {
      'application/ld+json': JSON.stringify(cityStructuredData)
    }
  };
}

// Generate static paths for all Ohio cities with communities
export async function generateStaticParams() {
  // Get unique cities in Ohio with 2+ communities
  const cityGroups = communities
    .filter(community => community.state === "OH")
    .reduce((acc, community) => {
      const city = community.city;
      if (!acc[city]) {
        acc[city] = 0;
      }
      acc[city]++;
      return acc;
    }, {} as Record<string, number>);

  // Convert to array of params, filtering for cities with 2+ communities
  return Object.entries(cityGroups)
    .filter(([_, count]) => count >= 2)
    .map(([city]) => ({
      city: slugify(city),
    }));
}

export default function CityPage({ params }: { params: { city: string } }) {
  // Filter communities for this city
  const cityCommunities = communities.filter(
    community => community.state === "OH" && 
    slugify(community.city) === params.city
  );

  // If no communities found, show 404
  if (cityCommunities.length === 0) {
    notFound();
  }

  // Get city name for display (capitalize each word)
  const cityName = params.city.split("-").map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(" ");

  // Get nearby cities (cities with 2+ communities)
  const nearbyCities = communities
    .filter(community => 
      community.state === "OH" && 
      community.city !== cityName &&
      slugify(community.city) !== params.city
    )
    .reduce((acc, community) => {
      const city = community.city;
      if (!acc[city]) {
        acc[city] = 0;
      }
      acc[city]++;
      return acc;
    }, {} as Record<string, number>);

  const nearbyCitiesList = Object.entries(nearbyCities)
    .filter(([_, count]) => count >= 2)
    .map(([city]) => ({
      name: city,
      slug: slugify(city),
    }))
    .slice(0, 5); // Show top 5 nearby cities

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

      {/* Communities Grid */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-6 md:px-10 lg:px-20">
          <h2 className="text-2xl font-semibold text-[#1b4d70] mb-6">
            Communities in {cityName}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cityCommunities.map((community) => (
              <ProviderCard
                key={community.id}
                id={community.id}
                slug={community.slug}
                name={community.name}
                city={community.city}
                state={community.state}
                type={community.type}
                image={community.image}
                rating={community.rating}
                amenities={community.services}
              />
            ))}
          </div>
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