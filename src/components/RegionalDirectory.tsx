import Link from 'next/link';
import { FiMapPin } from 'react-icons/fi';
import { communities } from '@/lib/data/staticCommunities';

type RegionalDirectoryProps = {
  className?: string;
};

export default function RegionalDirectory({ className = "" }: RegionalDirectoryProps) {
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

  // Convert to array, filter for cities with 2+ communities, and sort by count (descending)
  const citiesWithCommunities = Object.entries(cityGroups)
    .filter(([_, data]) => data.count >= 2)
    .map(([city, data]) => ({
      city,
      count: data.count,
      // Use a consistent city slug for all links
      city_slug: city.toLowerCase().replace(/ /g, '-'),
      topRatedCommunity: data.communities.reduce(
        (top, current) => (current.rating > (top?.rating || 0) ? current : top),
        null as typeof communities[0] | null
      ),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6); // Show top 6 cities by community count

  return (
    <section className={`bg-[#f9fafb] py-12 ${className}`}>
      <div className="container mx-auto px-6 md:px-10 lg:px-20">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            Browse Senior Living by City
          </h2>
          <p className="mt-2 text-gray-600">
            Quickly find senior living options in your area.
          </p>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {citiesWithCommunities.map((cityData) => (
            <div
              key={cityData.city}
              className="bg-white rounded-lg shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 py-3 px-4 border border-gray-100 text-center flex flex-col"
            >
              <div className="flex items-center justify-center mb-2">
                <FiMapPin className="text-[#1b4d70] mr-2 flex-shrink-0" />
                <h3 className="text-lg font-medium text-[#1b4d70] truncate">
                  {cityData.city}, OH
                </h3>
              </div>
              <div className="text-sm text-gray-600">
                {cityData.count} {cityData.count === 1 ? "community" : "communities"}
              </div>
              {cityData.topRatedCommunity && (
                <div className="text-sm text-gray-700 mt-2">
                  <div className="font-medium truncate">
                    Top: {cityData.topRatedCommunity.name}
                  </div>
                  <div className="text-gray-500">
                    Rated {cityData.topRatedCommunity.rating.toFixed(1)}/5
                  </div>
                </div>
              )}
              <Link
                href={`/ohio/${cityData.city_slug}`}
                className="inline-block mt-4 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Browse {cityData.city}
              </Link>
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-8">
          <Link
            href="/ohio"
            className="inline-flex items-center text-[#1b4d70] font-medium hover:underline"
          >
            View all cities in Ohio
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
} 