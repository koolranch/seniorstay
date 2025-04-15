import { Metadata } from "next";
import Link from "next/link";
import { communities } from "@/lib/data/staticCommunities";
import { FiMapPin, FiArrowRight } from "react-icons/fi";
import { slugify, getCityPath } from "@/lib/utils/formatSlug";

export const metadata: Metadata = {
  title: "Senior Living Communities in Ohio",
  description: "Browse top-rated senior living communities across Ohio cities including Parma, Mentor, Westlake, and more. Compare amenities, care types, and request a tour today.",
  alternates: {
    canonical: "/ohio",
  },
};

export default function OhioIndexPage() {
  // Group communities by city (Ohio only)
  const cityGroups = communities
    .filter((community) => community.state === "OH")
    .reduce((acc, community) => {
      const city = community.city;
      if (!acc[city]) {
        acc[city] = {
          count: 0,
          communities: [],
        };
      }
      acc[city].count++;
      acc[city].communities.push(community);
      return acc;
    }, {} as Record<string, { count: number; communities: typeof communities }>);

  // Convert to array, filter for cities with 2+ communities, and sort alphabetically
  const citiesWithCommunities = Object.entries(cityGroups)
    .filter(([_, data]) => data.count >= 2)
    .map(([city, data]) => ({
      city,
      count: data.count,
      topRatedCommunity: data.communities.reduce(
        (top, current) => (current.rating > (top?.rating || 0) ? current : top),
        null as typeof communities[0] | null
      ),
    }))
    .sort((a, b) => a.city.localeCompare(b.city));

  // Get total communities in Ohio
  const totalCommunities = communities.filter(
    (community) => community.state === "OH"
  ).length;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 py-10">
        <div className="container mx-auto px-6 md:px-10 lg:px-20">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1b4d70] mb-4">
            Senior Living Communities in Ohio
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Find senior living options across top cities in Ohio. Click below to explore local communities and request a tour.
          </p>
        </div>
      </div>

      {/* Regional Banner */}
      <div className="py-12 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-6 md:px-10 lg:px-20">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/3 mb-4 md:mb-0">
                <div className="bg-[#f1f6f0] rounded-lg p-4 text-center">
                  <div className="text-4xl font-bold text-[#1b4d70]">{totalCommunities}</div>
                  <div className="text-gray-600">Communities</div>
                </div>
              </div>
              <div className="md:w-2/3 md:pl-6">
                <h2 className="text-xl font-semibold text-[#1b4d70] mb-2">
                  Ohio Senior Living Directory
                </h2>
                <p className="text-gray-600">
                  Explore {citiesWithCommunities.length} cities across Ohio with senior living communities. 
                  Each city page provides detailed information about local options, amenities, and care types.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cities Grid */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-6 md:px-10 lg:px-20">
          <h2 className="text-2xl font-semibold text-[#1b4d70] mb-6">
            Cities in Ohio
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {citiesWithCommunities.map((cityData) => {
              const cityPath = getCityPath("OH", cityData.city);
              return (
                <Link
                  key={cityData.city}
                  href={cityPath}
                  className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
                >
                  <div className="flex items-center mb-2">
                    <FiMapPin className="text-[#1b4d70] mr-2" />
                    <h3 className="text-lg font-medium text-[#1b4d70]">
                      {cityData.city}, OH
                    </h3>
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    {cityData.count} {cityData.count === 1 ? "community" : "communities"}
                  </div>
                  {cityData.topRatedCommunity && (
                    <div className="text-sm text-gray-700 mb-4">
                      <div className="font-medium">
                        Top Rated: {cityData.topRatedCommunity.name}
                      </div>
                      <div className="text-gray-500">
                        Rated {cityData.topRatedCommunity.rating.toFixed(1)} out of 5
                      </div>
                    </div>
                  )}
                  <div className="text-[#1b4d70] font-medium flex items-center">
                    <span>View Communities</span>
                    <FiArrowRight className="ml-2" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* SEO Content */}
      <div className="py-12 bg-white border-t border-neutral-200">
        <div className="container mx-auto px-6 md:px-10 lg:px-20">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-[#1b4d70] mb-4">
              Senior Living Options in Ohio
            </h2>
            <div className="prose max-w-none text-gray-600">
              <p>
                Ohio offers a diverse range of senior living communities to meet various needs and preferences. 
                From independent living for active seniors to assisted living and memory care for those requiring more support, 
                you'll find options across the state's major metropolitan areas and charming smaller cities.
              </p>
              <p>
                Popular regions include the Cleveland metropolitan area, with communities in Parma, Westlake, and Mentor; 
                the Akron region with options in Cuyahoga Falls and Medina; and the Columbus area with communities in Westerville and surrounding suburbs.
              </p>
              <p>
                Each community offers unique amenities, care services, and living arrangements. Use our directory to explore options by city, 
                compare features, and connect with communities that match your specific requirements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 