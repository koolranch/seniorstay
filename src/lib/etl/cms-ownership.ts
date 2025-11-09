/**
 * CMS Ownership ETL
 * Imports facility ownership information (operators, owners, chains)
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

interface CMSOwnershipRaw {
  provnum: string; // CCN
  provider_name: string;
  ownership_type: string;
  role_description: string; // "OPERATOR", "OWNER", etc.
  owner_name: string;
  association_date?: string;
  organization_name?: string; // Chain name
}

interface OwnershipData {
  ccn: string;
  community_id: string;
  operator_name?: string;
  owner_name?: string;
  chain_name?: string;
  ownership_type?: string;
  effective_date: string;
}

/**
 * Fetch ownership data from CMS API
 */
async function fetchCMSOwnership(
  ccns: string[],
  offset: number = 0,
  limit: number = 1000
): Promise<CMSOwnershipRaw[]> {
  const params = new URLSearchParams({
    offset: offset.toString(),
    limit: limit.toString(),
  });

  const url = `${CMS_ENDPOINTS.OWNERSHIP}?${params}`;
  
  console.log(`Fetching CMS ownership (offset: ${offset})...`);
  
  try {
    const response = await fetchWithRetry(url);
    const data = await response.json();
    
    if (data.results && Array.isArray(data.results)) {
      const filtered = data.results.filter((record: CMSOwnershipRaw) => {
        return ccns.includes(record.provnum);
      });
      
      console.log(`Fetched ${data.results.length} total ownership records, ${filtered.length} for Cleveland`);
      return filtered;
    }
    
    return [];
  } catch (error) {
    console.error('Failed to fetch ownership:', error);
    throw error;
  }
}

/**
 * Fetch all ownership data with pagination
 */
async function fetchAllOwnership(ccns: string[]): Promise<CMSOwnershipRaw[]> {
  const allRecords: CMSOwnershipRaw[] = [];
  let offset = 0;
  const limit = 1000;
  let hasMore = true;
  let emptyPages = 0;

  while (hasMore && emptyPages < 3) {
    const records = await fetchCMSOwnership(ccns, offset, limit);
    
    if (records.length === 0) {
      emptyPages++;
      offset += limit;
      continue;
    }
    
    allRecords.push(...records);
    emptyPages = 0;
    offset += limit;
    
    if (records.length < limit / 10) {
      hasMore = false;
    }
    
    if (offset > 50000) {
      console.warn('Reached safety limit');
      hasMore = false;
    }
  }

  console.log(`Total ownership records fetched: ${allRecords.length}`);
  return allRecords;
}

/**
 * Consolidate ownership records by facility
 */
function consolidateOwnershipByCCN(records: CMSOwnershipRaw[]): Map<string, OwnershipData> {
  const ownershipMap = new Map<string, OwnershipData>();

  for (const record of records) {
    const ccn = record.provnum;
    const existing = ownershipMap.get(ccn) || {
      ccn,
      community_id: '',
      effective_date: new Date().toISOString().split('T')[0],
    };

    // Extract operator name
    if (record.role_description?.toUpperCase().includes('OPERATOR')) {
      existing.operator_name = record.owner_name || record.provider_name;
    }

    // Extract owner name
    if (record.role_description?.toUpperCase().includes('OWNER')) {
      existing.owner_name = record.owner_name;
    }

    // Extract chain name
    if (record.organization_name && record.organization_name !== record.provider_name) {
      existing.chain_name = record.organization_name;
    }

    // Set ownership type
    if (record.ownership_type) {
      const type = record.ownership_type.toLowerCase();
      if (type.includes('profit') && !type.includes('non')) {
        existing.ownership_type = 'for-profit';
      } else if (type.includes('non-profit') || type.includes('nonprofit')) {
        existing.ownership_type = 'non-profit';
      } else if (type.includes('government')) {
        existing.ownership_type = 'government';
      } else {
        existing.ownership_type = record.ownership_type;
      }
    }

    ownershipMap.set(ccn, existing);
  }

  return ownershipMap;
}

/**
 * Upsert ownership to database
 */
async function upsertOwnership(data: OwnershipData): Promise<'inserted' | 'updated' | 'skipped'> {
  try {
    // Check if ownership exists for this CCN and date
    const { data: existing, error: selectError } = await supabaseAdmin
      .from('CommunityOwnership')
      .select('id')
      .eq('ccn', data.ccn)
      .eq('effective_date', data.effective_date)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      throw selectError;
    }

    if (existing) {
      // Update
      const { error: updateError } = await supabaseAdmin
        .from('CommunityOwnership')
        .update({
          operator_name: data.operator_name,
          owner_name: data.owner_name,
          chain_name: data.chain_name,
          ownership_type: data.ownership_type,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);

      if (updateError) throw updateError;
      return 'updated';
    } else {
      // Insert
      const { error: insertError } = await supabaseAdmin
        .from('CommunityOwnership')
        .insert(data);

      if (insertError) throw insertError;
      return 'inserted';
    }
  } catch (error) {
    console.error('Error upserting ownership:', error);
    throw error;
  }
}

/**
 * Main ETL function to import ownership
 */
export async function importCMSOwnership(): Promise<ETLResult> {
  const startTime = new Date();
  const errors: ETLError[] = [];
  let processed = 0;
  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  try {
    console.log('Starting CMS Ownership import...');

    // Get all Cleveland CCNs
    const { data: communities, error: commError } = await supabaseAdmin
      .from('Community')
      .select('id, ccn')
      .not('ccn', 'is', null);

    if (commError || !communities || communities.length === 0) {
      return createETLResult(startTime, 0, 0, 0, 0, [{
        message: 'No communities with CCNs found',
        timestamp: new Date(),
      }]);
    }

    const ccnMap = new Map(communities.map(c => [c.ccn!, c.id]));
    const ccns = Array.from(ccnMap.keys());
    
    console.log(`Found ${ccns.length} facilities`);

    // Fetch ownership data
    const rawOwnership = await fetchAllOwnership(ccns);

    if (rawOwnership.length === 0) {
      console.warn('No ownership data fetched');
      return createETLResult(startTime, 0, 0, 0, 0, []);
    }

    // Consolidate by CCN
    const ownershipMap = consolidateOwnershipByCCN(rawOwnership);
    
    // Add community IDs
    const ownershipData = Array.from(ownershipMap.values()).map(ownership => ({
      ...ownership,
      community_id: ccnMap.get(ownership.ccn) || '',
    })).filter(o => o.community_id);

    console.log(`Consolidated to ${ownershipData.length} ownership records`);

    // Upsert in batches
    const batches = chunkArray(ownershipData, 50);

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`Processing batch ${i + 1}/${batches.length}...`);

      for (const ownership of batch) {
        try {
          const result = await upsertOwnership(ownership);
          processed++;

          if (result === 'inserted') inserted++;
          else if (result === 'updated') updated++;
          else skipped++;
        } catch (error) {
          errors.push({
            record: ownership,
            message: `Upsert error: ${(error as Error).message}`,
            timestamp: new Date(),
          });
          processed++;
          skipped++;
        }
      }
    }

    const result = createETLResult(startTime, processed, inserted, updated, skipped, errors);
    logETLResult('CMS Ownership', result);
    return result;
  } catch (error) {
    const criticalError: ETLError = {
      message: `Critical error: ${(error as Error).message}`,
      timestamp: new Date(),
    };
    errors.push(criticalError);

    const result = createETLResult(startTime, processed, inserted, updated, skipped, errors);
    logETLResult('CMS Ownership', result);
    return result;
  }
}

