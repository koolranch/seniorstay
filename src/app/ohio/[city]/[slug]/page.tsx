import { notFound } from "next/navigation";
import { communities } from "@/lib/data/communities";
import CommunityContent from "./CommunityContent";
import { getCommunityPathFromObject, slugify } from "@/lib/utils/formatSlug";

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
    const path = getCommunityPathFromObject(c).toLowerCase();
    return path.includes(city.toLowerCase()) && path.includes(slug.toLowerCase());
  });

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