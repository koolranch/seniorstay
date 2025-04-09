import type { Metadata } from "next";
import { communities } from '@/lib/data/communities';
import { formatSlug, formatLocation } from '@/lib/utils/formatSlug';
import CommunityClient from './CommunityClient';

export async function generateStaticParams() {
  return communities.map((community) => ({
    state: community.state.toLowerCase(),
    city: community.city.toLowerCase(),
    slug: community.slug
  }));
}

interface PageParams {
  state: string;
  city: string;
  slug: string;
}

interface Props {
  params: Promise<PageParams>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const community = communities.find(
    (c) =>
      c.state.toLowerCase() === resolvedParams.state &&
      c.city.toLowerCase() === resolvedParams.city &&
      c.slug === resolvedParams.slug
  );

  if (!community) {
    return {
      title: "Community Not Found",
      description: "The requested senior living community could not be found.",
    };
  }

  return {
    title: `${community.name} - Senior Living Community`,
    description: community.description,
  };
}

export default async function Page(props: Props) {
  const params = await props.params;
  return <CommunityClient params={params} communities={communities} />;
} 