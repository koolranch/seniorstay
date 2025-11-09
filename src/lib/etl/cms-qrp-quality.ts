/**
 * CMS SNF QRP (Quality Reporting Program) ETL
 * Imports facility-level quality measures
 * 
 * Data source: https://data.cms.gov/provider-data/topics/nursing-homes/quality-measures
 */

import { supabaseAdmin } from './supabase-client';
import { CLEVELAND_COUNTY_CODES } from './config';
import { ETLResult, ETLError } from './types';
import {
  createETLResult,
  logETLResult,
  fetchWithRetry,
  chunkArray,
} from './utils';

interface QRPMeasureRecord {
  federal_provider_number: string; // CCN
  measure_code: string;
  measure_description: string;
  score?: number | string;
  score_footnote?: string;
  quarter_ending?: string;
}

interface QualityMeasureData {
  ccn: string;
  pressure_ulcers_percent?: number;
  falls_with_injury_percent?: number;
  antipsychotic_use_percent?: number;
  hospitalization_rate?: number;
  emergency_room_visits_rate?: number;
  catheter_infections_rate?: number;
  uti_rate?: number;
  function_decline_percent?: number;
  improved_function_percent?: number;
  quarter_ending: string;
}

// Map of CMS measure codes to our database fields
const MEASURE_CODE_MAP: Record<string, keyof QualityMeasureData> = {
  '401': 'pressure_ulcers_percent', // Pressure Ulcers That Are New or Worsened
  '402': 'falls_with_injury_percent', // Falls with Major Injury
  '408': 'antipsychotic_use_percent', // Antipsychotic Medication Use
  '419': 'hospitalization_rate', // Hospitalization (per 1000 resident days)
  '424': 'emergency_room_visits_rate', // ED Visits (per 1000 resident days)
  '434': 'catheter_infections_rate', // Catheter-Associated UTI
  '435': 'uti_rate', // Urinary Tract Infection
  '451': 'function_decline_percent', // Percent of Residents Experiencing Functional Decline
  '452': 'improved_function_percent', // Percent of Residents Who Improved in Function
};

/**
 * Parse score value (handle various formats)
 */
function parseScore(score: number | string | undefined): number | undefined {
  if (score === undefined || score === null || score === '') return undefined;
  if (typeof score === 'number') return score;
  
  const cleaned = String(score).replace('%', '').trim();
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? undefined : parsed;
}

/**
 * Transform QRP records into quality measure data
 */
function transformQRPRecords(records: QRPMeasureRecord[]): QualityMeasureData[] {
  const facilityMap = new Map<string, Partial<QualityMeasureData>>();

  for (const record of records) {
    const ccn = record.federal_provider_number;
    const measureField = MEASURE_CODE_MAP[record.measure_code];

    if (!measureField) {
      // Measure code not in our map, skip
      continue;
    }

    const score = parseScore(record.score);
    if (score === undefined) {
      // Invalid or missing score
      continue;
    }

    // Get or create facility entry
    const facilityData = facilityMap.get(ccn) || {
      ccn,
      quarter_ending: record.quarter_ending || new Date().toISOString().split('T')[0],
    };

    // Set the measure value (using type assertion for dynamic key assignment)
    (facilityData as any)[measureField] = score;

    facilityMap.set(ccn, facilityData);
  }

  // Convert to array
  return Array.from(facilityMap.values()).map(data => ({
    ccn: data.ccn!,
    pressure_ulcers_percent: data.pressure_ulcers_percent,
    falls_with_injury_percent: data.falls_with_injury_percent,
    antipsychotic_use_percent: data.antipsychotic_use_percent,
    hospitalization_rate: data.hospitalization_rate,
    emergency_room_visits_rate: data.emergency_room_visits_rate,
    catheter_infections_rate: data.catheter_infections_rate,
    uti_rate: data.uti_rate,
    function_decline_percent: data.function_decline_percent,
    improved_function_percent: data.improved_function_percent,
    quarter_ending: data.quarter_ending!,
  }));
}

/**
 * Fetch QRP data from CMS API
 * NOTE: Requires specific CMS API endpoint and filtering
 */
async function fetchQRPData(): Promise<QRPMeasureRecord[]> {
  console.log('Fetching QRP quality measures...');
  
  // NOTE: This is a placeholder. In production, you would:
  // 1. Use the actual CMS QRP API endpoint
  // 2. Filter by our Cleveland facilities (using CCNs from Community table)
  // 3. Parse the response format
  
  console.warn('QRP data fetch not yet implemented - requires CMS API integration');
  return [];
}

/**
 * Upsert quality measure data to database
 */
async function upsertQualityMeasures(data: QualityMeasureData): Promise<'inserted' | 'updated' | 'skipped'> {
  try {
    // Find community by CCN
    const { data: community, error: findError } = await supabaseAdmin
      .from('Community')
      .select('id')
      .eq('ccn', data.ccn)
      .single();

    if (findError || !community) {
      console.warn(`Community not found for CCN ${data.ccn}`);
      return 'skipped';
    }

    // Check if record exists
    const { data: existing, error: selectError } = await supabaseAdmin
      .from('CommunityQualityMeasures')
      .select('id')
      .eq('ccn', data.ccn)
      .eq('quarter_ending', data.quarter_ending)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      throw selectError;
    }

    const qualityData = {
      community_id: community.id,
      ccn: data.ccn,
      pressure_ulcers_percent: data.pressure_ulcers_percent,
      falls_with_injury_percent: data.falls_with_injury_percent,
      antipsychotic_use_percent: data.antipsychotic_use_percent,
      hospitalization_rate: data.hospitalization_rate,
      emergency_room_visits_rate: data.emergency_room_visits_rate,
      catheter_infections_rate: data.catheter_infections_rate,
      uti_rate: data.uti_rate,
      function_decline_percent: data.function_decline_percent,
      improved_function_percent: data.improved_function_percent,
      quarter_ending: data.quarter_ending,
      updated_at: new Date().toISOString(),
    };

    if (existing) {
      // Update
      const { error: updateError } = await supabaseAdmin
        .from('CommunityQualityMeasures')
        .update(qualityData)
        .eq('id', existing.id);

      if (updateError) throw updateError;
      return 'updated';
    } else {
      // Insert
      const { error: insertError } = await supabaseAdmin
        .from('CommunityQualityMeasures')
        .insert(qualityData);

      if (insertError) throw insertError;
      return 'inserted';
    }
  } catch (error) {
    console.error('Error upserting quality measures:', error, data);
    throw error;
  }
}

/**
 * Main ETL function to import QRP quality measures
 */
export async function importQRPQuality(records?: QRPMeasureRecord[]): Promise<ETLResult> {
  const startTime = new Date();
  const errors: ETLError[] = [];
  let processed = 0;
  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  try {
    console.log('Starting QRP Quality Measures import...');

    // Fetch or use provided records
    const rawRecords = records || await fetchQRPData();

    if (rawRecords.length === 0) {
      return createETLResult(startTime, 0, 0, 0, 0, [{
        message: 'No QRP records available. This ETL requires CMS QRP API integration or CSV data.',
        timestamp: new Date(),
      }]);
    }

    console.log(`Processing ${rawRecords.length} QRP measure records...`);

    // Transform records
    const qualityData = transformQRPRecords(rawRecords);
    console.log(`Transformed data for ${qualityData.length} facilities`);

    // Upsert in batches
    const batches = chunkArray(qualityData, 50);

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`Processing batch ${i + 1}/${batches.length}...`);

      for (const data of batch) {
        try {
          const result = await upsertQualityMeasures(data);
          processed++;

          if (result === 'inserted') inserted++;
          else if (result === 'updated') updated++;
          else skipped++;
        } catch (error) {
          errors.push({
            record: data,
            message: `Upsert error: ${(error as Error).message}`,
            timestamp: new Date(),
          });
          processed++;
          skipped++;
        }
      }
    }

    const result = createETLResult(startTime, processed, inserted, updated, skipped, errors);
    logETLResult('QRP Quality Measures', result);
    return result;
  } catch (error) {
    const criticalError: ETLError = {
      message: `Critical error: ${(error as Error).message}`,
      timestamp: new Date(),
    };
    errors.push(criticalError);

    const result = createETLResult(startTime, processed, inserted, updated, skipped, errors);
    logETLResult('QRP Quality Measures', result);
    return result;
  }
}

