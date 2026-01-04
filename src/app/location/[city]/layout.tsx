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

// City-specific SEO optimizations based on keyword opportunities
const citySpecificSEO: Record<string, { titleSuffix: string; keywords: string; descriptionExtra: string }> = {
  'shaker-heights': {
    titleSuffix: 'Heritage Assisted Living & Memory Care',
    keywords: 'american heritage assisted living, heritage retirement communities shaker heights, woodlands shaker heights',
    descriptionExtra: 'Home to heritage retirement communities including The Woodlands.'
  },
  'rocky-river': {
    titleSuffix: 'Bickford & Sunrise Assisted Living',
    keywords: 'bickford of rocky river, sunrise rocky river, rocky river senior center, assisted living rocky river',
    descriptionExtra: 'Featuring Bickford Senior Living and Sunrise of Rocky River.'
  },
  'cleveland': {
    titleSuffix: 'Independent Living & Assisted Living',
    keywords: 'independent living cleveland, cleveland senior living, assisted living cleveland ohio, senior housing cleveland',
    descriptionExtra: 'Greater Cleveland\'s most comprehensive senior living directory.'
  },
  'beachwood': {
    titleSuffix: 'Luxury Senior Living & Memory Care',
    keywords: 'rose senior living beachwood, luxury senior living beachwood, assisted living beachwood ohio',
    descriptionExtra: 'Premium senior communities near Legacy Village.'
  }
};

// Generate metadata for each city page dynamically
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Make sure to get params asynchronously
  const { city } = await params;
  const cityName = formatCityName(city);
  
  // Get city-specific SEO enhancements if available
  const citySEO = citySpecificSEO[city];
  
  // Build optimized title
  const title = citySEO 
    ? `${cityName}, OH ${citySEO.titleSuffix} | Guide for Seniors`
    : `Senior Living in ${cityName}, OH | Guide for Seniors`;
  
  // Build optimized description
  const description = citySEO
    ? `Find ${citySEO.titleSuffix.toLowerCase()} in ${cityName}, Ohio. ${citySEO.descriptionExtra} Compare prices, amenities, and care levels.`
    : `Discover top-rated senior living communities in ${cityName}, Ohio with Guide for Seniors. Compare prices, amenities, and care levels for independent living, assisted living, and memory care facilities.`;
  
  // Build optimized keywords
  const baseKeywords = `senior living ${cityName}, assisted living ${cityName}, memory care ${cityName}, retirement communities ${cityName}`;
  const keywords = citySEO 
    ? `${citySEO.keywords}, ${baseKeywords}`
    : `${baseKeywords}, elder care ${cityName}, senior housing ${cityName}`;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title: citySEO 
        ? `${citySEO.titleSuffix} in ${cityName}, Ohio | Guide for Seniors`
        : `Senior Living Options in ${cityName}, Ohio | Guide for Seniors`,
      description,
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
