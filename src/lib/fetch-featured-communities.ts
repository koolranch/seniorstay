/**
 * Fetch Featured Communities from Supabase
 * Filters for high-quality communities with descriptions and real images
 * Prioritizes Tier 1 cities (Westlake, Beachwood, Shaker Heights, Rocky River, Solon)
 */

import { supabase } from './supabase-client';
import { Community } from '@/data/facilities';

// Tier 1 Premium Cities - Highest value leads
const TIER_1_CITIES = ['Westlake', 'Beachwood', 'Shaker Heights', 'Rocky River', 'Solon'];

// Tier 2 Volume Cities
const TIER_2_CITIES = ['Parma', 'Strongsville', 'Lakewood', 'Mentor', 'Independence'];

// All Cleveland-area cities
const CLEVELAND_CITIES = [
  ...TIER_1_CITIES,
  ...TIER_2_CITIES,
  'Cleveland', 'North Olmsted', 'Richmond Heights', 'Seven Hills',
  'Brooklyn', 'Bedford', 'Avon', 'Brunswick', 'Macedonia', 'Berea', 'Chardon',
  'North Ridgeville', 'Medina', 'Cuyahoga Falls', 'Akron'
];

/**
 * Transform database record to Community interface
 */
function transformDatabaseToCommunity(data: any): Community {
  return {
    id: data.id,
    slug: data.slug || undefined,
    name: data.name,
    location: `${data.city}, ${data.state}`,
    address: data.address || undefined,
    coordinates: undefined,
    images: data.image_urls && data.image_urls.length > 0 
      ? data.image_urls 
      : (data.image_url || data.imageUrl) 
        ? [data.image_url || data.imageUrl] 
        : [],
    careTypes: data.services?.split(',').map((s: string) => s.trim()) || [],
    description: data.description || undefined,
    amenities: undefined,
    staff: undefined,
    testimonials: undefined,
    rating: data.rating ? parseFloat(data.rating) : undefined,
    ccn: data.ccn || undefined,
    facilityType: data.facility_type || data.facilityType || undefined,
    bedCount: data.bed_count || data.bedCount || undefined,
    acceptsMedicare: data.accepts_medicare || data.acceptsMedicare || undefined,
    acceptsMedicaid: data.accepts_medicaid || data.acceptsMedicaid || undefined,
    overallRating: data.overall_rating ? parseFloat(data.overall_rating) : 
                   data.overallRating ? parseFloat(data.overallRating) : undefined,
    healthInspectionRating: data.health_inspection_rating ? parseFloat(data.health_inspection_rating) : 
                           data.healthInspectionRating ? parseFloat(data.healthInspectionRating) : undefined,
    staffingRating: data.staffing_rating ? parseFloat(data.staffing_rating) : 
                   data.staffingRating ? parseFloat(data.staffingRating) : undefined,
    qualityRating: data.quality_rating ? parseFloat(data.quality_rating) : 
                  data.qualityRating ? parseFloat(data.qualityRating) : undefined,
    abuseIcon: data.abuse_icon || data.abuseIcon || false,
    specialFocusFacility: data.special_focus_facility || data.specialFocusFacility || false,
    lastInspectionDate: data.last_inspection_date || data.lastInspectionDate || undefined,
    cmsLastUpdated: data.cms_last_updated || data.cmsLastUpdated || undefined,
    careCompareUrl: data.care_compare_url || data.careCompareUrl || undefined,
    medicaidPercentage: data.medicaid_percentage ? parseFloat(data.medicaid_percentage) : 
                       data.medicaidPercentage ? parseFloat(data.medicaidPercentage) : undefined,
  };
}

/**
 * Check if image URL is a placeholder
 */
function isPlaceholderImage(imageUrl: string | null | undefined): boolean {
  if (!imageUrl) return true;
  const placeholderPatterns = [
    'placeholder',
    'no-image',
    'default-community',
    'generic',
    'missing',
  ];
  return placeholderPatterns.some(pattern => 
    imageUrl.toLowerCase().includes(pattern)
  );
}

/**
 * Get city tier (1, 2, or 3 for others)
 */
function getCityTier(city: string): number {
  if (TIER_1_CITIES.some(t1 => city.toLowerCase().includes(t1.toLowerCase()))) return 1;
  if (TIER_2_CITIES.some(t2 => city.toLowerCase().includes(t2.toLowerCase()))) return 2;
  return 3;
}

/**
 * Fetch featured communities for homepage
 * - Filters: description NOT NULL, image NOT placeholder
 * - Prioritizes: Tier 1 > Tier 2 > Other cities
 * - Prioritizes: Memory Care > Assisted Living
 */
export async function fetchFeaturedCommunities(limit: number = 8): Promise<Community[]> {
  try {
    // Fetch all Cleveland-area communities
    const { data, error } = await supabase
      .from('Community')
      .select('*')
      .not('description', 'is', null)
      .order('name');

    if (error) {
      console.error('Error fetching featured communities:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Transform and filter
    const communities = data
      .map(transformDatabaseToCommunity)
      .filter((c) => {
        // Must be in Cleveland area
        const isInCleveland = CLEVELAND_CITIES.some(city => 
          c.location.toLowerCase().includes(city.toLowerCase())
        );
        if (!isInCleveland) return false;

        // Must have description
        if (!c.description || c.description.trim().length < 50) return false;

        // Must have non-placeholder image
        const imageUrl = c.images?.[0];
        if (isPlaceholderImage(imageUrl)) return false;

        // Must offer Assisted Living or Memory Care
        const hasQualifyingCare = c.careTypes.some(type => 
          type.toLowerCase().includes('assisted living') || 
          type.toLowerCase().includes('memory care')
        );
        if (!hasQualifyingCare) return false;

        // Exclude skilled-nursing-only facilities
        const isOnlySkilledNursing = c.careTypes.every(type => 
          type.toLowerCase().includes('skilled nursing')
        );
        if (isOnlySkilledNursing) return false;

        return true;
      });

    // Sort by priority: Tier 1 first, then Memory Care, then rating
    const sorted = communities.sort((a, b) => {
      // Tier priority
      const tierA = getCityTier(a.location);
      const tierB = getCityTier(b.location);
      if (tierA !== tierB) return tierA - tierB;

      // Memory Care priority
      const aHasMemoryCare = a.careTypes.some(t => t.toLowerCase().includes('memory care'));
      const bHasMemoryCare = b.careTypes.some(t => t.toLowerCase().includes('memory care'));
      if (aHasMemoryCare && !bHasMemoryCare) return -1;
      if (!aHasMemoryCare && bHasMemoryCare) return 1;

      // Rating priority
      const ratingA = a.overallRating || a.rating || 0;
      const ratingB = b.overallRating || b.rating || 0;
      return ratingB - ratingA;
    });

    return sorted.slice(0, limit);
  } catch (error) {
    console.error('Error in fetchFeaturedCommunities:', error);
    return [];
  }
}

/**
 * Get total count of quality communities for display
 */
export async function getQualityCommunityCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('Community')
      .select('*', { count: 'exact', head: true })
      .not('description', 'is', null);

    if (error) {
      console.error('Error counting communities:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Error in getQualityCommunityCount:', error);
    return 0;
  }
}

