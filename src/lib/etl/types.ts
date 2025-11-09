/**
 * TypeScript types for ETL operations
 */

// CMS Provider Info raw data structure
export interface CMSProviderInfoRaw {
  federal_provider_number: string;
  provider_name: string;
  provider_address: string;
  provider_city: string;
  provider_state: string;
  provider_zip_code: string;
  provider_phone_number?: string;
  county_name?: string;
  county_code?: string;
  number_of_certified_beds?: number;
  
  // Medicare/Medicaid participation
  provider_type?: string;
  
  // Star ratings (as strings in API, need conversion)
  overall_rating?: string | number;
  health_inspection_rating?: string | number;
  staffing_rating?: string | number;
  quality_measure_rating?: string | number;
  
  // Quality flags
  abuse_icon?: string | boolean;
  special_focus_facility?: string | boolean;
  
  // Dates
  standard_health_inspection_date?: string;
  
  // Location (latitude/longitude)
  location?: {
    coordinates: [number, number];
  };
}

// Normalized community data for database upsert
export interface CommunityUpsertData {
  ccn: string;
  name: string;
  address?: string;
  city: string;
  state: string;
  zip?: string;
  phone?: string;
  bed_count?: number;
  
  accepts_medicare?: boolean;
  accepts_medicaid?: boolean;
  
  facility_type?: string;
  
  overall_rating?: number;
  health_inspection_rating?: number;
  staffing_rating?: number;
  quality_rating?: number;
  
  abuse_icon?: boolean;
  special_focus_facility?: boolean;
  last_inspection_date?: string;
  
  cms_last_updated?: string;
  care_compare_url?: string;
}

// ETL job result
export interface ETLResult {
  success: boolean;
  recordsProcessed: number;
  recordsInserted: number;
  recordsUpdated: number;
  recordsSkipped: number;
  errors: ETLError[];
  startTime: Date;
  endTime: Date;
  duration: number;
}

// ETL error tracking
export interface ETLError {
  record?: any;
  field?: string;
  message: string;
  timestamp: Date;
}

// CMS API response structure
export interface CMSAPIResponse<T> {
  results: T[];
  count: number;
  facets?: any;
}

