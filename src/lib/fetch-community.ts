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
  const { data, error } = await supabase
    .from('Community')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching community:', error);
    return null;
  }

  if (!data) return null;

  // Transform database format to Community interface format
  return transformDatabaseToCommunity(data);
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
  return {
    id: data.id,
    name: data.name,
    location: `${data.city}, ${data.state}`,
    address: data.address || undefined,
    coordinates: undefined, // TODO: Add lat/lng from location field if needed
    images: [], // TODO: Add image URLs if available
    careTypes: data.services?.split(',').map((s: string) => s.trim()) || [],
    description: data.description || undefined,
    amenities: undefined,
    staff: undefined,
    testimonials: undefined,
    rating: data.rating ? parseFloat(data.rating) : undefined,
    
    // CMS fields
    ccn: data.ccn || undefined,
    facilityType: data.facility_type || undefined,
    bedCount: data.bed_count || undefined,
    acceptsMedicare: data.accepts_medicare || undefined,
    acceptsMedicaid: data.accepts_medicaid || undefined,
    
    overallRating: data.overall_rating ? parseFloat(data.overall_rating) : undefined,
    healthInspectionRating: data.health_inspection_rating ? parseFloat(data.health_inspection_rating) : undefined,
    staffingRating: data.staffing_rating ? parseFloat(data.staffing_rating) : undefined,
    qualityRating: data.quality_rating ? parseFloat(data.quality_rating) : undefined,
    
    abuseIcon: data.abuse_icon || false,
    specialFocusFacility: data.special_focus_facility || false,
    lastInspectionDate: data.last_inspection_date || undefined,
    
    cmsLastUpdated: data.cms_last_updated || undefined,
    careCompareUrl: data.care_compare_url || undefined,
    medicaidPercentage: data.medicaid_percentage ? parseFloat(data.medicaid_percentage) : undefined,
  };
}

