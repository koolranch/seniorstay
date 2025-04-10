import { notFound } from "next/navigation";
import { communities } from "@/lib/data/communities";
import { getCommunityPathFromObject } from "@/lib/utils/formatSlug";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

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
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 py-8">
        <div className="container mx-auto px-6 md:px-10 lg:px-20">
          <Link 
            href={`/ohio/${city}`} 
            className="inline-flex items-center text-[#1b4d70] mb-6 hover:underline"
          >
            <FiArrowLeft className="mr-2" />
            Back to {city.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Communities
          </Link>

          <h1 className="text-3xl font-bold mb-4 text-[#1b4d70]">{community.name}</h1>
          <p className="text-lg mb-6">{community.type} in {community.city}, {community.state}</p>
        </div>
      </div>

      {/* Community Details */}
      <div className="py-12">
        <div className="container mx-auto px-6 md:px-10 lg:px-20">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="mb-4">{community.description || "Detailed information about this community coming soon."}</p>
            <p className="text-gray-700">{community.address || ""}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 