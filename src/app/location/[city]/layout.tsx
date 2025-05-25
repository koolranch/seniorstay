import { Metadata } from 'next';

type Props = {
  params: Promise<{ city: string }>;
  children: React.ReactNode;
};

// Format city slug into readable name
const formatCityName = (slug: string): string => {
  if (!slug) return 'Unknown City';

  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Generate metadata for each city page dynamically
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Make sure to get params asynchronously
  const { city } = await params;
  const cityName = formatCityName(city);

  return {
          title: `Senior Living in ${cityName}, OH | Guide for Seniors`,
      description: `Discover top-rated senior living communities in ${cityName}, Ohio with Guide for Seniors. Compare prices, amenities, and care levels for independent living, assisted living, and memory care facilities.`,
    keywords: `senior living ${cityName}, assisted living ${cityName}, memory care ${cityName}, retirement communities ${cityName}, elder care ${cityName}, senior housing ${cityName}`,
    openGraph: {
      title: `Senior Living Options in ${cityName}, Ohio | Guide for Seniors`,
      description: `Find the perfect senior living community in ${cityName} with Guide for Seniors. Browse assisted living, memory care, and independent living options.`,
      url: `https://guideforseniors.com/location/${city}`,
      siteName: 'Guide for Seniors',
      locale: 'en_US',
      type: 'website',
    },
  };
}

export default async function CityLayout({ params, children }: Props) {
  const { city } = await params;
  return children;
}
