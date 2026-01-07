import { Metadata } from 'next';
import { supabase } from '@/lib/supabase-client';
import { clevelandCitiesData } from '@/data/cleveland-cities';
import { 
  getNearestHospitalForCity, 
  generateConversationalTitle, 
  generateConversationalDescription,
  getCityHospitals 
} from '@/lib/hospital-proximity';

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

// City-specific SEO optimizations based on high-intent long-tail keyword opportunities
const citySpecificSEO: Record<string, { 
  titleSuffix: string; 
  keywords: string; 
  descriptionExtra: string;
  longTailTitle?: string;
  longTailDescription?: string;
}> = {
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
    titleSuffix: 'Memory Care Near UH Ahuja Medical Center',
    keywords: 'memory care near UH Ahuja Medical Center, Beachwood skilled nursing for dementia, rose senior living beachwood, luxury senior living beachwood, assisted living beachwood ohio, dementia care beachwood, alzheimers care beachwood ohio',
    descriptionExtra: 'Clinical excellence in memory care and dementia services near UH Ahuja Medical Center.',
    longTailTitle: 'Memory Care Near UH Ahuja Medical Center | Beachwood Skilled Nursing for Dementia',
    longTailDescription: '2026 guide: Find specialized memory care and skilled nursing for dementia near UH Ahuja Medical Center in Beachwood, OH. Expert clinical teams, secure environments, and direct hospital access. Free family consultations.'
  },
  'westlake': {
    titleSuffix: 'Assisted Living for Hospital Discharge',
    keywords: 'assisted living in Westlake OH for hospital discharge, Westlake senior living costs 2026, sunrise of westlake, brookdale westlake, arden courts westlake, hospital discharge senior living westlake, st john medical center assisted living',
    descriptionExtra: 'Specialized in hospital discharge transitions near St. John Medical Center.',
    longTailTitle: 'Assisted Living in Westlake OH for Hospital Discharge | 2026 Costs & Options',
    longTailDescription: '2026 guide: Find assisted living in Westlake, OH for hospital discharge from St. John Medical Center. Same-week move-ins, rehabilitation support, and verified pricing. Free discharge planning consultations.'
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

// Generate metadata for each city page dynamically - GEO-Ready for Answer Engine Optimization
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const cityName = formatCityName(city);
  
  // Fetch real-time metrics from database
  const metrics = await getCityMetrics(city);
  
  // Get city-specific SEO enhancements if available
  const citySEO = citySpecificSEO[city];
  const cityData = clevelandCitiesData[city];
  
  // Get nearest hospital for GEO-ready conversational metadata
  const nearestHospital = getNearestHospitalForCity(city);
  const cityHospitals = getCityHospitals(city);
  const hospitalNames = cityHospitals.map(h => h.shortName);
  const costRange = cityData?.averageCost?.assistedLiving || '$3,500 - $6,500';
  
  // HIGH-INTENT LONG-TAIL: Use city-specific optimized titles for Westlake & Beachwood
  // These target specific high-value keywords: "hospital discharge", "UH Ahuja", "dementia", "2026 costs"
  let title: string;
  if (citySEO?.longTailTitle) {
    // Use the optimized long-tail title for high-intent pages (Westlake, Beachwood)
    title = citySEO.longTailTitle;
  } else if (metrics.communityCount > 0) {
    title = generateConversationalTitle(
      cityName, 
      metrics.communityCount, 
      nearestHospital,
      metrics.averageRating || undefined
    );
  } else if (citySEO) {
    title = `${cityName}, OH ${citySEO.titleSuffix} Near ${nearestHospital} | Guide for Seniors`;
  } else {
    title = `Find Senior Living in ${cityName}, OH Near ${nearestHospital} | Guide for Seniors`;
  }
  
  // HIGH-INTENT LONG-TAIL: Use city-specific optimized descriptions
  let description: string;
  if (citySEO?.longTailDescription) {
    // Use the optimized long-tail description for high-intent pages
    description = citySEO.longTailDescription;
  } else if (metrics.communityCount > 0) {
    description = generateConversationalDescription(
      cityName,
      metrics.communityCount,
      hospitalNames,
      costRange,
      metrics.hasMemoryCare
    );
  } else if (citySEO) {
    description = `${new Date().getFullYear()} guide: Find ${citySEO.titleSuffix.toLowerCase()} in ${cityName}, Ohio near ${nearestHospital}. ${citySEO.descriptionExtra} Free expert consultations.`;
  } else {
    description = `${new Date().getFullYear()} guide: Discover verified senior living communities in ${cityName}, Ohio near ${nearestHospital}. Compare prices, amenities, and care levels. Free consultations from Cleveland senior care experts.`;
  }
  
  // Enhanced keywords for GEO and traditional SEO
  const hospitalKeywords = hospitalNames.slice(0, 2).map(h => `senior living near ${h}`).join(', ');
  const baseKeywords = `senior living ${cityName}, assisted living ${cityName}, memory care ${cityName}, retirement communities ${cityName}`;
  const geoKeywords = `${cityName} senior living costs ${new Date().getFullYear()}, best assisted living ${cityName} Ohio, ${hospitalKeywords}`;
  const keywords = citySEO 
    ? `${citySEO.keywords}, ${baseKeywords}, ${geoKeywords}`
    : `${baseKeywords}, ${geoKeywords}, elder care ${cityName}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `https://guideforseniors.com/location/${city}`,
    },
    openGraph: {
      title: metrics.communityCount > 0 
        ? `Compare ${metrics.communityCount} Senior Living Communities in ${cityName} Near ${nearestHospital}`
        : citySEO 
          ? `${citySEO.titleSuffix} in ${cityName}, Ohio | Guide for Seniors`
          : `Senior Living Options in ${cityName}, Ohio Near ${nearestHospital}`,
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
          alt: `Senior Living in ${cityName}, Ohio - Near ${nearestHospital}`,
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
