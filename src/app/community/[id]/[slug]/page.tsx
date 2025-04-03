import { facilityData } from '@/data/facilities';
import { notFound } from 'next/navigation';
import CommunityClient from './CommunityClient';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{
    id: string;
    slug: string;
  }>;
}

export default async function CommunityPage({ params }: PageProps) {
  const { id, slug } = await params;
  
  const community = facilityData.find(
    (community) => community.id === id
  );

  if (!community) {
    notFound();
  }

  return (
    <main>
      <CommunityClient community={community} />
    </main>
  );
}

// Generate metadata for all communities
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id, slug } = await params;
  
  const community = facilityData.find(
    (community) => community.id === id
  );

  if (!community) {
    return {
      title: 'Community Not Found',
    };
  }

  return {
    title: `${community.name} | Cleveland Senior Guide`,
    description: `View details about ${community.name}, a senior living community located in ${community.location}.`,
  };
}
