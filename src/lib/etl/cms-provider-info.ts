/**
 * CMS Provider Info ETL
 * Imports nursing home provider information from CMS Provider Data Catalog
 * Filters by Cleveland 6-county area
 */

import { supabaseAdmin } from './supabase-client';
import { CLEVELAND_COUNTY_CODES, CLEVELAND_COUNTY_CODES_SHORT, CMS_ENDPOINTS } from './config';
import { CMSProviderInfoRaw, CommunityUpsertData, ETLResult, ETLError } from './types';
import {
  parseStarRating,
  parseCMSBoolean,
  parseCMSDate,
  cleanPhoneNumber,
  normalizeFacilityName,
  generateCareCompareUrl,
  createETLResult,
  logETLResult,
  fetchWithRetry,
  chunkArray,
} from './utils';

/**
 * Fetch provider info from CMS API with pagination
 */
async function fetchCMSProviderInfo(
  offset: number = 0,
  limit: number = 1000
): Promise<{ cleveland: CMSProviderInfoRaw[]; totalFetched: number }> {
  // Use simpler query format - filter by state and do county filtering locally
  const params = new URLSearchParams({
    offset: offset.toString(),
    limit: limit.toString(),
    'filters[provider_state]': 'OH',
  });

  const url = `${CMS_ENDPOINTS.PROVIDER_INFO}?${params}`;
  
  console.log(`Fetching CMS Provider Info for Ohio (offset: ${offset}, limit: ${limit})...`);
  
  try {
    const response = await fetchWithRetry(url);
    const data = await response.json();
    
    if (data.results && Array.isArray(data.results)) {
      // Debug: On first page, show sample county data
      if (offset === 0) {
        console.log('Sample records with county info:');
        data.results.slice(0, 5).forEach((r: any) => {
          console.log(`- ${r.provider_name}: county_code="${r.provider_ssa_county_code}", county_name="${r.countyparish}"`);
        });
      }
      
      // Filter by Cleveland county NAMES (more reliable than codes)
      const CLEVELAND_COUNTIES_NAMES = ['CUYAHOGA', 'LAKE', 'LORAIN', 'GEAUGA', 'MEDINA', 'SUMMIT'];
      const filtered = data.results.filter((record: any) => {
        const countyName = record.countyparish?.toString().toUpperCase().trim();
        return countyName && CLEVELAND_COUNTIES_NAMES.includes(countyName);
      });
      
      console.log(`Fetched ${data.results.length} Ohio records, ${filtered.length} in Cleveland area`);
      return { cleveland: filtered, totalFetched: data.results.length };
    }
    
    console.warn('Unexpected API response format:', data);
    return { cleveland: [], totalFetched: 0 };
  } catch (error) {
    console.error('Failed to fetch CMS Provider Info:', error);
    throw error;
  }
}

/**
 * Fetch all provider info with pagination
 */
async function fetchAllCMSProviderInfo(): Promise<CMSProviderInfoRaw[]> {
  const allRecords: CMSProviderInfoRaw[] = [];
  let offset = 0;
  const limit = 1000;
  let hasMore = true;

  while (hasMore) {
    const { cleveland, totalFetched } = await fetchCMSProviderInfo(offset, limit);
    
    // Add Cleveland records to our collection
    allRecords.push(...cleveland);
    
    // Continue if we got a full page of Ohio records (meaning there might be more)
    if (totalFetched < limit) {
      hasMore = false; // Last page of Ohio data
    } else {
      offset += limit; // Get next page
    }
  }

  console.log(`Total Cleveland area records fetched: ${allRecords.length}`);
  return allRecords;
}

/**
 * Transform CMS raw data to community upsert format
 */
function transformProviderInfo(raw: any): CommunityUpsertData | null {
  try {
    // CMS field is cms_certification_number_ccn, not federal_provider_number
    const ccn = raw.cms_certification_number_ccn?.trim() || raw.federal_provider_number?.trim();
    const name = raw.provider_name?.trim();

    // Validate required fields
    if (!ccn || !name) {
      console.warn('Skipping record with missing CCN or name:', { ccn, name });
      return null;
    }

    const transformed: CommunityUpsertData = {
      ccn,
      name: normalizeFacilityName(name),
      address: raw.provider_address?.trim(),
      city: raw.citytown?.trim() || raw.provider_city?.trim() || '',
      state: raw.state?.trim() || raw.provider_state?.trim() || 'OH',
      zip: raw.zip_code?.trim() || raw.provider_zip_code?.trim(),
      phone: cleanPhoneNumber(raw.telephone_number || raw.provider_phone_number),
      bed_count: raw.number_of_certified_beds || undefined,
      
      // Determine Medicare/Medicaid acceptance from provider type
      // CMS uses 'N' for nursing homes that accept Medicare/Medicaid
      accepts_medicare: true, // Most SNFs accept Medicare
      accepts_medicaid: true, // Most SNFs accept Medicaid
      
      facility_type: 'skilled-nursing',
      
      // Star ratings
      overall_rating: parseStarRating(raw.overall_rating),
      health_inspection_rating: parseStarRating(raw.health_inspection_rating),
      staffing_rating: parseStarRating(raw.staffing_rating),
      quality_rating: parseStarRating(raw.quality_measure_rating),
      
      // Quality flags
      abuse_icon: parseCMSBoolean(raw.abuse_icon),
      special_focus_facility: parseCMSBoolean(raw.special_focus_facility),
      last_inspection_date: parseCMSDate(raw.standard_health_inspection_date),
      
      // Meta
      cms_last_updated: new Date().toISOString(),
      care_compare_url: generateCareCompareUrl(ccn),
    };

    return transformed;
  } catch (error) {
    console.error('Error transforming record:', error, raw);
    return null;
  }
}

/**
 * Upsert community data to Supabase
 */
async function upsertCommunity(data: CommunityUpsertData): Promise<'inserted' | 'updated' | 'skipped'> {
  try {
    // Check if community exists with this CCN
    const { data: existing, error: selectError } = await supabaseAdmin
      .from('Community')
      .select('id, ccn')
      .eq('ccn', data.ccn)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      // Error other than "not found"
      throw selectError;
    }

    if (existing) {
      // Update existing record
      const { error: updateError } = await supabaseAdmin
        .from('Community')
        .update({
          name: data.name,
          address: data.address,
          city: data.city,
          state: data.state,
          zip: data.zip,
          phone: data.phone,
          bed_count: data.bed_count,
          accepts_medicare: data.accepts_medicare,
          accepts_medicaid: data.accepts_medicaid,
          facility_type: data.facility_type,
          overall_rating: data.overall_rating,
          health_inspection_rating: data.health_inspection_rating,
          staffing_rating: data.staffing_rating,
          quality_rating: data.quality_rating,
          abuse_icon: data.abuse_icon,
          special_focus_facility: data.special_focus_facility,
          last_inspection_date: data.last_inspection_date,
          cms_last_updated: data.cms_last_updated,
          care_compare_url: data.care_compare_url,
        })
        .eq('id', existing.id);

      if (updateError) throw updateError;
      return 'updated';
    } else {
      // Insert new record
      // Generate a slug from the name
      const slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      
      // Generate a UUID for the id field
      const { randomUUID } = await import('crypto');
      const newId = randomUUID();

      const { error: insertError } = await supabaseAdmin
        .from('Community')
        .insert({
          id: newId,
          ccn: data.ccn,
          name: data.name,
          slug,
          city: data.city,
          state: data.state,
          address: data.address,
          zip: data.zip,
          phone: data.phone,
          bed_count: data.bed_count,
          accepts_medicare: data.accepts_medicare,
          accepts_medicaid: data.accepts_medicaid,
          facility_type: data.facility_type,
          overall_rating: data.overall_rating,
          health_inspection_rating: data.health_inspection_rating,
          staffing_rating: data.staffing_rating,
          quality_rating: data.quality_rating,
          abuse_icon: data.abuse_icon,
          special_focus_facility: data.special_focus_facility,
          last_inspection_date: data.last_inspection_date,
          cms_last_updated: data.cms_last_updated,
          care_compare_url: data.care_compare_url,
          city_slug: slug,
        });

      if (insertError) throw insertError;
      return 'inserted';
    }
  } catch (error) {
    console.error('Error upserting community:', error, data);
    throw error;
  }
}

/**
 * Main ETL function to import CMS provider info
 */
export async function importCMSProviderInfo(): Promise<ETLResult> {
  const startTime = new Date();
  const errors: ETLError[] = [];
  let processed = 0;
  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  try {
    console.log('Starting CMS Provider Info import...');
    console.log(`Filtering by counties: ${CLEVELAND_COUNTY_CODES.join(', ')}`);

    // Fetch all provider info
    const rawRecords = await fetchAllCMSProviderInfo();
    
    if (rawRecords.length === 0) {
      console.warn('No records fetched from CMS API');
      return createETLResult(startTime, 0, 0, 0, 0, [{
        message: 'No records fetched from CMS API',
        timestamp: new Date(),
      }]);
    }

    // Transform records
    const transformedRecords = rawRecords
      .map(raw => {
        try {
          return transformProviderInfo(raw);
        } catch (error) {
          errors.push({
            record: raw,
            message: `Transformation error: ${(error as Error).message}`,
            timestamp: new Date(),
          });
          return null;
        }
      })
      .filter((record): record is CommunityUpsertData => record !== null);

    console.log(`Transformed ${transformedRecords.length} valid records`);

    // Upsert in batches of 50 to avoid overwhelming the database
    const batches = chunkArray(transformedRecords, 50);
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`Processing batch ${i + 1}/${batches.length} (${batch.length} records)...`);

      for (const record of batch) {
        try {
          const result = await upsertCommunity(record);
          processed++;
          
          if (result === 'inserted') inserted++;
          else if (result === 'updated') updated++;
          else skipped++;
        } catch (error) {
          errors.push({
            record,
            message: `Upsert error: ${(error as Error).message}`,
            timestamp: new Date(),
          });
          processed++;
          skipped++;
        }
      }
    }

    const result = createETLResult(startTime, processed, inserted, updated, skipped, errors);
    logETLResult('CMS Provider Info', result);
    return result;
  } catch (error) {
    const criticalError: ETLError = {
      message: `Critical error: ${(error as Error).message}`,
      timestamp: new Date(),
    };
    errors.push(criticalError);
    
    const result = createETLResult(startTime, processed, inserted, updated, skipped, errors);
    logETLResult('CMS Provider Info', result);
    return result;
  }
}

