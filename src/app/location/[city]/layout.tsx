import { Metadata } from 'next';
import { supabase } from '@/lib/supabase-client';
import { clevelandCitiesData } from '@/data/cleveland-cities';

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
  },
  'westlake': {
    titleSuffix: 'Assisted Living & Memory Care Communities',
    keywords: 'sunrise of westlake, brookdale westlake, arden courts westlake, assisted living westlake ohio',
    descriptionExtra: 'Top-rated senior communities near Crocker Park and St. John Medical Center.'
  }
};

/**
 * Fetch city-specific metrics from Supabase for dynamic metadata
 */
async function getCityMetrics(citySlug: string) {
  const cityName = formatCityName(citySlug);
  
  // Query communities for this city
  const { data: communities, error } = await supabase
    .from('Community')
    .select('id, rating, bed_count, services')
    .ilike('city', cityName);
  
  if (error || !communities || communities.length === 0) {
    return {
      communityCount: 0,
      averageRating: null,
      totalBeds: 0,
      hasMemoryCare: false,
      hasAssistedLiving: false
    };
  }
  
  // Calculate metrics
  const ratingsWithValues = communities.filter(c => c.rating && parseFloat(c.rating) > 0);
  const averageRating = ratingsWithValues.length > 0 
    ? ratingsWithValues.reduce((sum, c) => sum + parseFloat(c.rating), 0) / ratingsWithValues.length
    : null;
  
  const totalBeds = communities.reduce((sum, c) => sum + (c.bed_count || 0), 0);
  
  // Check for care types
  const allServices = communities.map(c => c.services || '').join(',').toLowerCase();
  const hasMemoryCare = allServices.includes('memory care');
  const hasAssistedLiving = allServices.includes('assisted living');
  
  return {
    communityCount: communities.length,
    averageRating: averageRating ? parseFloat(averageRating.toFixed(1)) : null,
    totalBeds,
    hasMemoryCare,
    hasAssistedLiving
  };
}

// Generate metadata for each city page dynamically
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const cityName = formatCityName(city);
  
  // Fetch real-time metrics from database
  const metrics = await getCityMetrics(city);
  
  // Get city-specific SEO enhancements if available
  const citySEO = citySpecificSEO[city];
  const cityData = clevelandCitiesData[city];
  
  // Build high-CTR dynamic title with real data
  let title: string;
  if (metrics.communityCount > 0) {
    const ratingText = metrics.averageRating ? ` (Rated ${metrics.averageRating}/5)` : '';
    title = `Top ${metrics.communityCount} Assisted Living Communities in ${cityName}, OH${ratingText} | Guide for Seniors`;
  } else if (citySEO) {
    title = `${cityName}, OH ${citySEO.titleSuffix} | Guide for Seniors`;
  } else {
    title = `Senior Living in ${cityName}, OH | Guide for Seniors`;
  }
  
  // Build optimized description with real metrics
  let description: string;
  if (metrics.communityCount > 0) {
    const memoryCareText = metrics.hasMemoryCare ? ', memory care' : '';
    const costRange = cityData?.averageCost?.assistedLiving || '$3,500 - $6,500';
    description = `Compare ${metrics.communityCount} assisted living${memoryCareText} communities in ${cityName}, Ohio. Average costs: ${costRange}/mo. ` +
      `${citySEO?.descriptionExtra || `Find the perfect senior living option with our free comparison tool.`}`;
  } else if (citySEO) {
    description = `Find ${citySEO.titleSuffix.toLowerCase()} in ${cityName}, Ohio. ${citySEO.descriptionExtra} Compare prices, amenities, and care levels.`;
  } else {
    description = `Discover top-rated senior living communities in ${cityName}, Ohio with Guide for Seniors. Compare prices, amenities, and care levels for independent living, assisted living, and memory care facilities.`;
  }
  
  // Build optimized keywords
  const baseKeywords = `senior living ${cityName}, assisted living ${cityName}, memory care ${cityName}, retirement communities ${cityName}`;
  const keywords = citySEO 
    ? `${citySEO.keywords}, ${baseKeywords}`
    : `${baseKeywords}, elder care ${cityName}, senior housing ${cityName}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `https://guideforseniors.com/location/${city}`,
    },
    openGraph: {
      title: metrics.communityCount > 0 
        ? `${metrics.communityCount} Senior Living Communities in ${cityName}, OH | Guide for Seniors`
        : citySEO 
          ? `${citySEO.titleSuffix} in ${cityName}, Ohio | Guide for Seniors`
          : `Senior Living Options in ${cityName}, Ohio | Guide for Seniors`,
      description,
      url: `https://guideforseniors.com/location/${city}`,
      siteName: 'Guide for Seniors',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: 'https://guideforseniors.com/og-image.png',
          width: 1200,
          height: 630,
          alt: `Senior Living in ${cityName}, Ohio`,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    }
  };
}

export default async function CityLayout({ params, children }: Props) {
  const { city } = await params;
  return children;
}
