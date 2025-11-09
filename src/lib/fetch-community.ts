/**
 * Fetch Community Data from Supabase
 * Server-side and client-side utilities for fetching community information
 */

import { supabase } from './supabase-client';
import { Community } from '@/data/facilities';

/**
 * Fetch a single community by ID
 */
export async function fetchCommunityById(id: string): Promise<Community | null> {
  try {
    const { data, error } = await supabase
      .from('Community')
      .select('*')
      .eq('id', id)
      .single();

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
 * Fetch all communities
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
 * Transform database record to Community interface
 */
function transformDatabaseToCommunity(data: any): Community {
  // Handle both snake_case (from Supabase) and camelCase fields
  return {
    id: data.id,
    slug: data.slug || undefined,
    name: data.name,
    location: `${data.city}, ${data.state}`,
    address: data.address || undefined,
    coordinates: undefined, // TODO: Add lat/lng from location field if needed
    images: data.imageUrl ? [data.imageUrl] : [], // Use imageUrl from database
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

