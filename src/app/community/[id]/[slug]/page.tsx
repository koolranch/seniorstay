import { facilityData } from '@/data/facilities';
import { notFound } from 'next/navigation';
import CommunityClient from './CommunityClient';

interface PageProps {
  params: {
    id: string;
    slug: string;
  };
}

export default function CommunityPage({ params }: PageProps) {
  const community = facilityData.find(
    (community) => community.id === params.id
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
export async function generateMetadata({ params }: PageProps) {
  const community = facilityData.find(
    (community) => community.id === params.id
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
