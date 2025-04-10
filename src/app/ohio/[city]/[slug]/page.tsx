import { notFound } from "next/navigation";
import { communities } from "@/lib/data/communities";
import { getCommunityPathFromObject } from "@/lib/utils/formatSlug";

// Define the page params interface
interface PageParams {
  city: string;
  slug: string;
}

// Use a plain function component without type constraints
// @ts-expect-error - Params typing is incompatible with Next.js generated types
export default function Page({ params }: { params: PageParams }) {
  // Destructure once we have the values
  const { city, slug } = params;
  
  const community = communities.find((c) => {
    const path = getCommunityPathFromObject(c).toLowerCase();
    return (
      path.includes(city.toLowerCase()) &&
      path.includes(slug.toLowerCase())
    );
  });

  if (!community) {
    notFound();
  }

  // Simple presentation without the CommunityCard component
  return (
    <div className="container mx-auto px-6 py-8 bg-[#FAFAF5]">
      <h1 className="text-3xl font-bold mb-4 text-[#1b4d70]">{community.name}</h1>
      <p className="text-lg mb-6">{community.type} in {community.city}, {community.state}</p>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="mb-4">{community.description}</p>
        <p className="text-gray-700">{community.address}</p>
      </div>
    </div>
  );
} 