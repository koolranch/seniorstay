import { Metadata } from 'next';
import { communityData } from '@/data/facilities';

interface CommunityPageProps {
  params: {
    id: string;
    slug: string;
  };
}

export async function generateMetadata({ params }: CommunityPageProps): Promise<Metadata> {
  const { id, slug } = params;
  
  const community = communityData.find(
    (c) => c.id === id
  );

  if (!community) {
    return {
      title: 'Community Not Found',
      description: 'The requested community could not be found.',
    };
  }

  return {
    title: `${community.name} | Senior Living Community`,
    description: community.description,
    openGraph: {
      title: `${community.name} | Senior Living Community`,
      description: community.description,
      images: community.images,
    },
  };
} 