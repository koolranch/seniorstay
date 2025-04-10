import { notFound } from "next/navigation";
import { communities } from "@/data/communities";
import CommunityCard from "@/components/CommunityCard";
import { getCommunityPath } from "@/lib/utils/formatSlug";

export default function Page({
  params,
}: {
  params: {
    city: string;
    slug: string;
  };
}) {
  const { city, slug } = params;

  const community = communities.find((c) => {
    const path = getCommunityPath(c).toLowerCase();
    return (
      path.includes(city.toLowerCase()) &&
      path.includes(slug.toLowerCase())
    );
  });

  if (!community) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CommunityCard community={community} showDetails showRequestButton />
    </div>
  );
} 