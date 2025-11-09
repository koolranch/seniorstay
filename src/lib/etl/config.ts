/**
 * ETL Configuration
 * Cleveland 6-county area filter and CMS data source endpoints
 */

// Cleveland metropolitan area counties (Ohio FIPS codes)
export const CLEVELAND_COUNTIES = {
  CUYAHOGA: '39035',
  LAKE: '39085',
  LORAIN: '39093',
  GEAUGA: '39055',
  MEDINA: '39103',
  SUMMIT: '39153',
} as const;

export const CLEVELAND_COUNTY_CODES = Object.values(CLEVELAND_COUNTIES);

// County codes without state prefix (used for CMS API filtering)
export const CLEVELAND_COUNTY_CODES_SHORT = ['035', '085', '093', '055', '103', '153'];

// CMS Provider Data Catalog endpoints
// Note: Using direct dataset download URLs as the API query endpoint has limitations
export const CMS_ENDPOINTS = {
  // Nursing Home Provider Information - download CSV
  PROVIDER_INFO_CSV: 'https://data.cms.gov/provider-data/sites/default/files/resources/092256becd267d9eeccf73bf1845c7.csv',
  // Alternative: Use the actual API endpoint for nursing homes
  PROVIDER_INFO: 'https://data.cms.gov/provider-data/api/1/datastore/query/4pq5-n9py/0',
  OWNERSHIP: 'https://data.cms.gov/provider-data/api/1/datastore/query/q5iq-5g6h/0',
  DEFICIENCIES: 'https://data.cms.gov/provider-data/api/1/datastore/query/r5xi-yzqa/0',
  PENALTIES: 'https://data.cms.gov/provider-data/api/1/datastore/query/g6vv-u9sr/0',
} as const;

// CMS field mappings for Provider Info
export const PROVIDER_INFO_FIELDS = {
  federal_provider_number: 'ccn',
  provider_name: 'name',
  provider_address: 'address',
  provider_city: 'city',
  provider_state: 'state',
  provider_zip_code: 'zip',
  provider_phone_number: 'phone',
  county_name: 'county_name',
  county_code: 'county_code',
  number_of_certified_beds: 'bed_count',
  
  // Medicare/Medicaid participation
  provider_type: 'provider_type',
  accepts_medicare: 'accepts_medicare',
  accepts_medicaid: 'accepts_medicaid',
  
  // Star ratings
  overall_rating: 'overall_rating',
  health_inspection_rating: 'health_inspection_rating',
  staffing_rating: 'staffing_rating',
  quality_measure_rating: 'quality_rating',
  
  // Quality flags
  abuse_icon: 'abuse_icon',
  reported_allegations_of_resident_abuse: 'abuse_icon',
  special_focus_facility: 'special_focus_facility',
  
  // Inspection dates
  standard_health_inspection_date: 'last_inspection_date',
  
  // Location
  location: 'location',
} as const;

// Refresh cadences (in days)
export const REFRESH_CADENCE = {
  PROVIDER_INFO: 7, // Weekly
  OWNERSHIP: 7, // Weekly
  DEFICIENCIES: 7, // Weekly
  STAFFING: 90, // Quarterly
  QUALITY: 90, // Quarterly
  VBP: 365, // Annually
  COST_REPORTS: 365, // Annually
} as const;

// Rate limiting
export const RATE_LIMIT = {
  MAX_REQUESTS_PER_MINUTE: 30,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 1000,
} as const;

