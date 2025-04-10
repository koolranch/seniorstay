import { Community } from "@/lib/data/communities";
import ProviderCard from "./ProviderCard";

interface CommunityGridProps {
  communities: Community[];
  filterByCategory?: string | null;
}

export default function CommunityGrid({ communities, filterByCategory = null }: CommunityGridProps) {
  const filteredCommunities = filterByCategory
    ? communities.filter((community) => community.type === filterByCategory || community.services.includes(filterByCategory))
    : communities;

  return (
    <div className="bg-neutral-50 pt-12 border-t border-neutral-200">
      <div className="container mx-auto px-6 md:px-10 lg:px-20 py-4">
        <h2 className="text-2xl font-semibold text-[#1b4d70] mb-6">
          Senior Living Communities
          <span className="text-gray-500 text-lg ml-2">
            ({filteredCommunities.length} communities)
          </span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCommunities.map((community) => (
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
  );
} 