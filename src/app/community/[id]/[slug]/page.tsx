import type { Metadata } from "next";
import CommunityClient from "./CommunityClient";
import { communities } from "@/data/communities";

type Props = {
  params: {
    id: string;
    slug: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Find the community based on the id
  const communityId = Number.parseInt(params.id);
  const community = communities.find((c) => c.id === communityId);

  if (!community) {
    return {
      title: "Community Not Found",
      description: "The requested senior living community could not be found.",
    };
  }

  return {
    title: `${community.name} | Senior Living Community in ${community.city}, ${community.state}`,
    description: community.description || `Learn about ${community.name}, a ${community.type} community located in ${community.city}, ${community.state}.`,
  };
}

export default function CommunityPage({ params }: Props) {
  const communityId = Number.parseInt(params.id);
  const community = communities.find((c) => c.id === communityId);

  if (!community) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Community Not Found</h1>
        <p className="mb-8">The senior living community you are looking for does not exist.</p>
        <a href="/" className="text-blue-600 hover:underline">
          Return to home page
        </a>
      </div>
    );
  }

  return <CommunityClient community={community} />;
}
