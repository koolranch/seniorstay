import { Metadata } from 'next';

type Props = {
  params: { city: string }
  children: React.ReactNode
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
  const citySlug = params?.city || '';
  const cityName = formatCityName(citySlug);

  return {
    title: `Senior Living in ${cityName}, OH | Cleveland Senior Guide`,
    description: `Discover top-rated senior living communities in ${cityName}, Ohio with Cleveland Senior Guide. Compare prices, amenities, and care levels for independent living, assisted living, and memory care facilities.`,
    keywords: `senior living ${cityName}, assisted living ${cityName}, memory care ${cityName}, retirement communities ${cityName}, elder care ${cityName}, senior housing ${cityName}`,
    openGraph: {
      title: `Senior Living Options in ${cityName}, Ohio | Cleveland Senior Guide`,
      description: `Find the perfect senior living community in ${cityName} with Cleveland Senior Guide. Browse assisted living, memory care, and independent living options.`,
      url: `https://rayseniorplacement.com/location/${citySlug}`,
      siteName: 'Cleveland Senior Guide',
      locale: 'en_US',
      type: 'website',
    },
  };
}

export default function CityLayout({ children }: { children: React.ReactNode }) {
  return children;
}
