import { Metadata } from "next";
import { notFound } from "next/navigation";
import { communities } from "@/lib/data/communities";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { slugify, getCityPath, getCommunityPath } from "@/lib/utils/formatSlug";

// Generate metadata for each community page
export async function generateMetadata({ 
  params 
}: { 
  params: { city: string; slug: string } 
}): Promise<Metadata> {
  const cityName = params.city.split("-").map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(" ");
  
  const community = communities.find(
    community => 
      community.state === "OH" && 
      slugify(community.city) === params.city &&
      slugify(community.name) === params.slug
  );

  if (!community) {
    return {
      title: "Community Not Found | SeniorStay",
      description: "The requested senior living community could not be found.",
    };
  }

  // Create structured data for the community
  const communityStructuredData = {
    "@context": "https://schema.org",
    "@type": "AssistedLivingFacility",
    name: community.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: community.address,
      addressLocality: community.city,
      addressRegion: community.state,
      addressCountry: "US"
    },
    url: `https://www.guideforseniors.com${getCommunityPath(community.state, community.city, community.name)}`,
    description: community.description,
    telephone: community.phone || undefined,
    aggregateRating: community.rating ? {
      "@type": "AggregateRating",
      ratingValue: community.rating.toFixed(1),
      reviewCount: community.reviewCount || 1
    } : undefined,
    amenityFeature: community.amenities?.map(amenity => ({
      "@type": "LocationFeatureSpecification",
      name: amenity
    }))
  };

  // Create breadcrumb structured data
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Senior Living Directory",
        "item": "https://www.guideforseniors.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Ohio",
        "item": "https://www.guideforseniors.com/ohio"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": `${cityName}, OH`,
        "item": `https://www.guideforseniors.com${getCityPath("OH", cityName)}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": community.name
      }
    ]
  };

  return {
    title: `${community.name} | Senior Living in ${cityName}, Ohio`,
    description: community.description,
    alternates: {
      canonical: getCommunityPath(community.state, community.city, community.name),
    },
    other: {
      'application/ld+json': JSON.stringify([communityStructuredData, breadcrumbStructuredData])
    }
  };
}

// Generate static paths for all communities
export async function generateStaticParams() {
  return communities
    .filter(community => community.state === "OH")
    .map(community => ({
      city: slugify(community.city),
      slug: slugify(community.name)
    }));
}

export default function CommunityPage({ 
  params 
}: { 
  params: { city: string; slug: string } 
}) {
  const community = communities.find(
    community => 
      community.state === "OH" && 
      slugify(community.city) === params.city &&
      slugify(community.name) === params.slug
  );

  if (!community) {
    notFound();
  }

  const cityName = params.city.split("-").map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(" ");

  return (
    <div className="bg-[#FAFAF5] min-h-screen">
      <div className="container mx-auto px-6 md:px-10 lg:px-20 py-8">
        {/* Back Link */}
        <Link 
          href={getCityPath("OH", cityName)}
          className="inline-flex items-center text-[#1b4d70] mb-6 hover:underline"
        >
          <FiArrowLeft className="mr-2" />
          Back to {cityName} Communities
        </Link>

        {/* Community Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1b4d70] mb-4">
            {community.name}
          </h1>
          <p className="text-lg text-gray-600">
            {community.type} in {cityName}, Ohio
          </p>
        </div>

        {/* Community Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-[#1b4d70] mb-4">
                About {community.name}
              </h2>
              <p className="text-gray-600 mb-4">
                {community.description}
              </p>
              <div className="flex items-center text-gray-600">
                <span className="mr-2">Address:</span>
                <span>{community.address}, {cityName}, OH</span>
              </div>
            </div>

            {/* Amenities */}
            {community.amenities && community.amenities.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold text-[#1b4d70] mb-4">
                  Amenities & Services
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {community.amenities.map((amenity, index) => (
                    <div 
                      key={index}
                      className="flex items-center text-gray-600"
                    >
                      <span className="mr-2">•</span>
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-[#1b4d70] mb-4">
                Community Details
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700">Type</h3>
                  <p className="text-gray-600">{community.type}</p>
                </div>
                {community.rating > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-700">Rating</h3>
                    <p className="text-gray-600">
                      {community.rating.toFixed(1)} out of 5
                      {community.reviewCount && ` (${community.reviewCount} reviews)`}
                    </p>
                  </div>
                )}
                <div>
                  <h3 className="font-medium text-gray-700">Location</h3>
                  <p className="text-gray-600">{cityName}, Ohio</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 