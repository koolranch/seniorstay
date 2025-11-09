/**
 * CMS Health Deficiencies ETL
 * Imports inspection deficiencies and penalties from CMS Provider Data Catalog
 */

import { supabaseAdmin } from './supabase-client';
import { CMS_ENDPOINTS } from './config';
import { ETLResult, ETLError } from './types';
import {
  createETLResult,
  logETLResult,
  fetchWithRetry,
  chunkArray,
  parseCMSDate,
} from './utils';

interface CMSDeficiencyRaw {
  federal_provider_number: string; // CCN
  survey_date_output: string;
  standard_survey_date: string;
  survey_type: string;
  deficiency_tag: string;
  scope_severity_code: string;
  deficiency_corrected_date?: string;
  inspection_text?: string;
  filedate?: string;
}

interface DeficiencyData {
  ccn: string;
  community_id: string;
  survey_date: string;
  survey_type: string;
  deficiency_tag: string;
  scope_severity: string;
  deficiency_description?: string;
  correction_date?: string;
  fine_amount?: number;
  penalty_type?: string;
}

/**
 * Fetch deficiencies from CMS API
 */
async function fetchCMSDeficiencies(
  ccns: string[],
  offset: number = 0,
  limit: number = 1000
): Promise<CMSDeficiencyRaw[]> {
  // Build query to filter by our CCNs
  const params = new URLSearchParams({
    offset: offset.toString(),
    limit: limit.toString(),
  });

  const url = `${CMS_ENDPOINTS.DEFICIENCIES}?${params}`;
  
  console.log(`Fetching CMS deficiencies (offset: ${offset})...`);
  
  try {
    const response = await fetchWithRetry(url);
    const data = await response.json();
    
    if (data.results && Array.isArray(data.results)) {
      // Filter to only our Cleveland facilities
      const filtered = data.results.filter((record: CMSDeficiencyRaw) => {
        return ccns.includes(record.federal_provider_number);
      });
      
      console.log(`Fetched ${data.results.length} total deficiencies, ${filtered.length} for Cleveland facilities`);
      return filtered;
    }
    
    return [];
  } catch (error) {
    console.error('Failed to fetch deficiencies:', error);
    throw error;
  }
}

/**
 * Fetch all deficiencies with pagination
 */
async function fetchAllDeficiencies(ccns: string[]): Promise<CMSDeficiencyRaw[]> {
  const allRecords: CMSDeficiencyRaw[] = [];
  let offset = 0;
  const limit = 1000;
  let hasMore = true;
  let emptyPages = 0;

  while (hasMore && emptyPages < 3) {
    const records = await fetchCMSDeficiencies(ccns, offset, limit);
    
    if (records.length === 0) {
      emptyPages++;
      offset += limit;
      continue;
    }
    
    allRecords.push(...records);
    emptyPages = 0; // Reset counter
    offset += limit;
    
    // Stop if we got fewer than requested
    if (records.length < limit / 10) {
      hasMore = false;
    }
    
    // Safety: Don't fetch more than 50k records total
    if (offset > 50000) {
      console.warn('Reached safety limit of 50k records');
      hasMore = false;
    }
  }

  console.log(`Total deficiencies fetched: ${allRecords.length}`);
  return allRecords;
}

/**
 * Transform deficiency raw data
 */
function transformDeficiency(raw: CMSDeficiencyRaw, communityId: string): DeficiencyData | null {
  try {
    const ccn = raw.federal_provider_number?.trim();
    const surveyDate = parseCMSDate(raw.survey_date_output || raw.standard_survey_date);
    
    if (!ccn || !surveyDate) {
      return null;
    }

    return {
      ccn,
      community_id: communityId,
      survey_date: surveyDate,
      survey_type: raw.survey_type || 'standard',
      deficiency_tag: raw.deficiency_tag || '',
      scope_severity: raw.scope_severity_code || '',
      deficiency_description: raw.inspection_text,
      correction_date: parseCMSDate(raw.deficiency_corrected_date),
      fine_amount: undefined, // Will come from penalties dataset
      penalty_type: undefined,
    };
  } catch (error) {
    console.error('Error transforming deficiency:', error);
    return null;
  }
}

/**
 * Upsert deficiency to database
 */
async function upsertDeficiency(data: DeficiencyData): Promise<'inserted' | 'updated' | 'skipped'> {
  try {
    // Check if this exact deficiency already exists
    const { data: existing, error: selectError } = await supabaseAdmin
      .from('CommunityDeficiency')
      .select('id')
      .eq('ccn', data.ccn)
      .eq('survey_date', data.survey_date)
      .eq('deficiency_tag', data.deficiency_tag)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      throw selectError;
    }

    if (existing) {
      // Update existing
      const { error: updateError } = await supabaseAdmin
        .from('CommunityDeficiency')
        .update({
          survey_type: data.survey_type,
          scope_severity: data.scope_severity,
          deficiency_description: data.deficiency_description,
          correction_date: data.correction_date,
        })
        .eq('id', existing.id);

      if (updateError) throw updateError;
      return 'updated';
    } else {
      // Insert new
      const { error: insertError } = await supabaseAdmin
        .from('CommunityDeficiency')
        .insert(data);

      if (insertError) throw insertError;
      return 'inserted';
    }
  } catch (error) {
    console.error('Error upserting deficiency:', error);
    throw error;
  }
}

/**
 * Main ETL function to import deficiencies
 */
export async function importCMSDeficiencies(): Promise<ETLResult> {
  const startTime = new Date();
  const errors: ETLError[] = [];
  let processed = 0;
  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  try {
    console.log('Starting CMS Deficiencies import...');

    // First, get all Cleveland CCNs from the database
    const { data: communities, error: commError } = await supabaseAdmin
      .from('Community')
      .select('id, ccn')
      .not('ccn', 'is', null);

    if (commError || !communities || communities.length === 0) {
      return createETLResult(startTime, 0, 0, 0, 0, [{
        message: 'No communities with CCNs found in database',
        timestamp: new Date(),
      }]);
    }

    const ccnMap = new Map(communities.map(c => [c.ccn!, c.id]));
    const ccns = Array.from(ccnMap.keys());
    
    console.log(`Found ${ccns.length} facilities with CCNs`);

    // Fetch all deficiencies for our facilities
    const rawDeficiencies = await fetchAllDeficiencies(ccns);

    if (rawDeficiencies.length === 0) {
      console.warn('No deficiencies fetched from CMS API');
      return createETLResult(startTime, 0, 0, 0, 0, []);
    }

    // Transform and filter to last 3 years only
    const threeYearsAgo = new Date();
    threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);

    const transformedDeficiencies = rawDeficiencies
      .map(raw => {
        const communityId = ccnMap.get(raw.federal_provider_number);
        if (!communityId) return null;
        return transformDeficiency(raw, communityId);
      })
      .filter((d): d is DeficiencyData => {
        if (!d) return false;
        const surveyDate = new Date(d.survey_date);
        return surveyDate >= threeYearsAgo;
      });

    console.log(`Transformed ${transformedDeficiencies.length} deficiencies from last 3 years`);

    // Upsert in batches
    const batches = chunkArray(transformedDeficiencies, 50);

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`Processing batch ${i + 1}/${batches.length}...`);

      for (const deficiency of batch) {
        try {
          const result = await upsertDeficiency(deficiency);
          processed++;

          if (result === 'inserted') inserted++;
          else if (result === 'updated') updated++;
          else skipped++;
        } catch (error) {
          errors.push({
            record: deficiency,
            message: `Upsert error: ${(error as Error).message}`,
            timestamp: new Date(),
          });
          processed++;
          skipped++;
        }
      }
    }

    const result = createETLResult(startTime, processed, inserted, updated, skipped, errors);
    logETLResult('CMS Deficiencies', result);
    return result;
  } catch (error) {
    const criticalError: ETLError = {
      message: `Critical error: ${(error as Error).message}`,
      timestamp: new Date(),
    };
    errors.push(criticalError);

    const result = createETLResult(startTime, processed, inserted, updated, skipped, errors);
    logETLResult('CMS Deficiencies', result);
    return result;
  }
}

