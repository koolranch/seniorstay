/**
 * Fetch Community Data from Supabase
 * Server-side and client-side utilities for fetching community information
 * Supports multi-region architecture with region_slug filtering
 */

import { supabase } from './supabase-client';
import { Community } from '@/data/facilities';
import { DEFAULT_REGION } from '@/data/regions';

/**
 * Fetch a single community by slug
 * @param slug - Community slug
 * @param regionSlug - Optional region filter (defaults to all regions)
 */
export async function fetchCommunityBySlug(slug: string, regionSlug?: string): Promise<Community | null> {
  try {
    let query = supabase
      .from('Community')
      .select('*')
      .eq('slug', slug);
    
    // Filter by region if specified
    if (regionSlug) {
      query = query.eq('region_slug', regionSlug);
    }
    
    const { data, error } = await query.single();

    if (error || !data) {
      console.warn(`No community found with slug: ${slug}${regionSlug ? ` in region: ${regionSlug}` : ''}`);
      return null;
    }

    return transformDatabaseToCommunity(data);
  } catch (error) {
    console.error('Error fetching community by slug:', error);
    return null;
  }
}

/**
 * Fetch a single community by ID
 * @param id - Community UUID
 * @param regionSlug - Optional region filter for validation
 */
export async function fetchCommunityById(id: string, regionSlug?: string): Promise<Community | null> {
  try {
    // Try to fetch by ID first
    let query = supabase
      .from('Community')
      .select('*')
      .eq('id', id);
    
    // Filter by region if specified
    if (regionSlug) {
      query = query.eq('region_slug', regionSlug);
    }
    
    const { data, error } = await query.single();

    // If not found by ID, try by old-style ID pattern (facility-1, facility-2, etc.)
    // This handles legacy URLs
    if (error && error.code === 'PGRST116') {
      console.warn(`No community found with id: ${id}${regionSlug ? ` in region: ${regionSlug}` : ''}, trying alternate lookups...`);
      
      // Try finding by combining name search (for old static data)
      // This is a graceful fallback for old URLs
      const { data: allData } = await supabase
        .from('Community')
        .select('*')
        .limit(500);
      
      // Return null if we can't find it
      if (!allData || allData.length === 0) {
        console.error('No communities found in database');
        return null;
      }
      
      // If ID looks like old static format, return null to trigger 404
      // The homepage should be updated to use correct UUIDs
      return null;
    }

    if (error) {
      console.error('Error fetching community from Supabase:', error);
      return null;
    }

    if (!data) {
      console.warn(`No community found with id: ${id}`);
      return null;
    }

    // Transform database format to Community interface format
    return transformDatabaseToCommunity(data);
  } catch (error) {
    console.error('Critical error fetching community:', error);
    return null;
  }
}

/**
 * Fetch all communities (across all regions)
 */
export async function fetchAllCommunities(): Promise<Community[]> {
  const { data, error } = await supabase
    .from('Community')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching communities:', error);
    return [];
  }

  return data.map(transformDatabaseToCommunity);
}

/**
 * Fetch communities by region
 * @param regionSlug - Region slug to filter by (e.g., 'cleveland', 'columbus')
 */
export async function fetchCommunitiesByRegion(regionSlug: string): Promise<Community[]> {
  const { data, error } = await supabase
    .from('Community')
    .select('*')
    .eq('region_slug', regionSlug)
    .order('name');

  if (error) {
    console.error(`Error fetching communities for region ${regionSlug}:`, error);
    return [];
  }

  return data.map(transformDatabaseToCommunity);
}

/**
 * Fetch communities by region and city
 * @param regionSlug - Region slug
 * @param cityName - City name to filter by
 */
export async function fetchCommunitiesByRegionAndCity(regionSlug: string, cityName: string): Promise<Community[]> {
  const { data, error } = await supabase
    .from('Community')
    .select('*')
    .eq('region_slug', regionSlug)
    .ilike('city', cityName)
    .order('name');

  if (error) {
    console.error(`Error fetching communities for ${cityName} in ${regionSlug}:`, error);
    return [];
  }

  return data.map(transformDatabaseToCommunity);
}

/**
 * Get unique cities for a region
 * @param regionSlug - Region slug
 */
export async function getUniqueCitiesForRegion(regionSlug: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('Community')
    .select('city')
    .eq('region_slug', regionSlug);

  if (error) {
    console.error(`Error fetching cities for region ${regionSlug}:`, error);
    return [];
  }

  // Get unique cities
  const uniqueCities = Array.from(new Set(
    data
      .filter(item => item.city)
      .map(item => item.city.trim())
  ));

  return uniqueCities;
}

/**
 * Transform database record to Community interface
 * SEO Phase 2: Added imageAlt field for accessibility
 */
function transformDatabaseToCommunity(data: any): Community {
  // Handle both snake_case (from Supabase) and camelCase fields
  return {
    id: data.id,
    slug: data.slug || undefined,
    name: data.name,
    location: `${data.city}, ${data.state}`,
    address: data.address || undefined,
    zip: data.zip || undefined,
    // Multi-region support
    regionSlug: data.region_slug || data.regionSlug || DEFAULT_REGION,
    // Map database lat/lng to coordinates object for Google Maps
    coordinates: (data.latitude && data.longitude) 
      ? { lat: parseFloat(data.latitude), lng: parseFloat(data.longitude) }
      : undefined,
    // Support photo galleries: prefer image_urls array, fallback to single image_url
    images: data.image_urls && data.image_urls.length > 0 
      ? data.image_urls 
      : (data.image_url || data.imageUrl) 
        ? [data.image_url || data.imageUrl] 
        : [],
    // SEO Phase 2: Image alt text from database
    imageAlt: data.image_alt || `${data.name} senior living facility in ${data.city}, Ohio`,
    careTypes: data.services?.split(',').map((s: string) => s.trim()) || [],
    description: data.description || undefined,
    amenities: undefined,
    staff: undefined,
    testimonials: undefined,
    rating: data.rating ? parseFloat(data.rating) : undefined,
    
    // CMS fields - handle both snake_case and camelCase
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

