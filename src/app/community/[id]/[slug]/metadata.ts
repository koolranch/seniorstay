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

  const city = community.location.split(',')[0].trim();
  
  const canonicalUrl = `/community/${id}/${slug}`;
  
  return {
    title: `${community.name} | Senior Living in ${city}, OH | Guide for Seniors`,
    description: `Discover ${community.name} in ${city}, Ohio. ${community.description || 'Offering quality senior living services.'} Contact us for pricing, tours, and availability.`,
    keywords: `${community.name}, senior living ${city}, assisted living ${city}, ${community.careTypes.join(', ')}`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${community.name} | Senior Living in ${city}, OH`,
      description: community.description,
      images: community.images,
      url: `https://www.guideforseniors.com${canonicalUrl}`,
      siteName: 'Guide for Seniors',
      locale: 'en_US',
      type: 'website',
    },
  };
} 