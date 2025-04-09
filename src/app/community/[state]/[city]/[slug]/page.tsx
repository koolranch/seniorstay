import { notFound } from "next/navigation";
import { Metadata } from "next";
import { communities } from "@/lib/data/communities";
import { formatSlug, formatLocation } from "@/lib/utils/formatSlug";
import CommunityClient from "./CommunityClient";

interface CommunityPageProps {
  params: {
    state: string;
    city: string;
    slug: string;
  };
}

export async function generateStaticParams() {
  return communities.map((community) => ({
    state: formatLocation(community.state),
    city: formatLocation(community.city),
    slug: formatSlug(community.name),
  }));
}

export async function generateMetadata({
  params,
}: CommunityPageProps): Promise<Metadata> {
  const community = communities.find(
    (c) =>
      formatLocation(c.state) === params.state &&
      formatLocation(c.city) === params.city &&
      formatSlug(c.name) === params.slug
  );

  if (!community) {
    return {
      title: "Community Not Found",
      description: "The requested senior living community could not be found.",
    };
  }

  return {
    title: `${community.name} | Senior Living in ${community.city}, ${community.state}`,
    description: community.description,
    openGraph: {
      title: `${community.name} | Senior Living in ${community.city}, ${community.state}`,
      description: community.description,
      images: [community.image],
    },
  };
}

export default function CommunityPage({ params }: CommunityPageProps) {
  const community = communities.find(
    (c) =>
      formatLocation(c.state) === params.state &&
      formatLocation(c.city) === params.city &&
      formatSlug(c.name) === params.slug
  );

  if (!community) {
    notFound();
  }

  return <CommunityClient community={community} />;
} 