import { Metadata } from "next";
import { notFound } from "next/navigation";
import { communities } from "@/lib/data/communities";
import { slugify, getCityPath, getCommunityPath } from "@/lib/utils/formatSlug";
import CommunityContent from "./CommunityContent";

// Generate metadata for each community page
export async function generateMetadata({ 
  params 
}: { 
  params: { city: string; slug: string } 
}): Promise<Metadata> {
  const cityName = params.city.split("-").map((word: string) => 
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

export default function Page({ 
  params 
}: { 
  params: { city: string; slug: string } 
}) {
  const { city, slug } = params;
  const community = communities.find(
    community => 
      community.state === "OH" && 
      slugify(community.city) === city &&
      slugify(community.name) === slug
  );

  if (!community) {
    notFound();
  }

  const cityName = city.split("-").map((word: string) => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(" ");

  return (
    <div className="bg-[#FAFAF5] min-h-screen">
      <div className="container mx-auto px-6 md:px-10 lg:px-20 py-8">
        <CommunityContent 
          community={community} 
          cityName={cityName} 
        />
      </div>
    </div>
  );
} 