/**
 * CMS PBJ (Payroll-Based Journal) Staffing ETL
 * Imports daily nurse staffing data and computes 90-day rolling averages
 * 
 * NOTE: PBJ data is typically downloaded as large CSV files from:
 * https://data.cms.gov/quality-of-care/payroll-based-journal-daily-nurse-staffing
 * 
 * This implementation provides the infrastructure to process PBJ data.
 * Full implementation requires handling large CSV files (~100MB+).
 */

import { supabaseAdmin } from './supabase-client';
import { CLEVELAND_COUNTY_CODES } from './config';
import { ETLResult, ETLError } from './types';
import {
  createETLResult,
  logETLResult,
  chunkArray,
} from './utils';

interface PBJDailyRecord {
  provnum: string; // CCN
  work_date: string;
  mdscensus: number; // Resident census
  hrs_rndir: number; // RN hours (direct care)
  hrs_rnoth: number; // RN hours (other)
  hrs_lpndir: number; // LPN hours (direct care)
  hrs_lpnoth: number; // LPN hours (other)
  hrs_cnadir: number; // CNA hours (direct care)
  hrs_cnaoth: number; // CNA hours (other)
  is_weekend?: boolean; // Weekend flag
}

interface StaffingAggregate {
  ccn: string;
  avg_rn_hprd: number;
  avg_lpn_hprd: number;
  avg_cna_hprd: number;
  avg_total_nurse_hprd: number;
  weekend_rn_delta: number;
  weekend_total_delta: number;
  quarter_ending: string;
}

/**
 * Calculate HPRD (Hours Per Resident Day)
 */
function calculateHPRD(totalHours: number, totalCensus: number): number {
  if (totalCensus === 0) return 0;
  return totalHours / totalCensus;
}

/**
 * Compute 90-day rolling averages from daily PBJ data
 */
function compute90DayAverages(dailyRecords: PBJDailyRecord[]): StaffingAggregate[] {
  const facilityMap = new Map<string, PBJDailyRecord[]>();

  // Group records by CCN
  for (const record of dailyRecords) {
    const existing = facilityMap.get(record.provnum) || [];
    existing.push(record);
    facilityMap.set(record.provnum, existing);
  }

  const aggregates: StaffingAggregate[] = [];

  // Process each facility
  for (const [ccn, records] of facilityMap.entries()) {
    // Sort by date
    records.sort((a, b) => new Date(a.work_date).getTime() - new Date(b.work_date).getTime());

    // Get last 90 days
    const last90Days = records.slice(-90);
    if (last90Days.length < 30) {
      // Need at least 30 days of data
      console.warn(`Skipping ${ccn}: insufficient data (${last90Days.length} days)`);
      continue;
    }

    // Separate weekday and weekend records
    const weekdayRecords = last90Days.filter(r => !r.is_weekend);
    const weekendRecords = last90Days.filter(r => r.is_weekend);

    // Calculate totals
    let totalRnHours = 0;
    let totalLpnHours = 0;
    let totalCnaHours = 0;
    let totalCensus = 0;

    let weekdayRnHours = 0;
    let weekdayTotalHours = 0;
    let weekdayCensus = 0;

    let weekendRnHours = 0;
    let weekendTotalHours = 0;
    let weekendCensus = 0;

    for (const record of last90Days) {
      const rnHours = (record.hrs_rndir || 0) + (record.hrs_rnoth || 0);
      const lpnHours = (record.hrs_lpndir || 0) + (record.hrs_lpnoth || 0);
      const cnaHours = (record.hrs_cnadir || 0) + (record.hrs_cnaoth || 0);
      const totalHours = rnHours + lpnHours + cnaHours;

      totalRnHours += rnHours;
      totalLpnHours += lpnHours;
      totalCnaHours += cnaHours;
      totalCensus += record.mdscensus;

      if (record.is_weekend) {
        weekendRnHours += rnHours;
        weekendTotalHours += totalHours;
        weekendCensus += record.mdscensus;
      } else {
        weekdayRnHours += rnHours;
        weekdayTotalHours += totalHours;
        weekdayCensus += record.mdscensus;
      }
    }

    // Calculate averages
    const avgRnHprd = calculateHPRD(totalRnHours, totalCensus);
    const avgLpnHprd = calculateHPRD(totalLpnHours, totalCensus);
    const avgCnaHprd = calculateHPRD(totalCnaHours, totalCensus);
    const avgTotalHprd = avgRnHprd + avgLpnHprd + avgCnaHprd;

    // Calculate weekend deltas
    const weekdayRnHprd = calculateHPRD(weekdayRnHours, weekdayCensus);
    const weekendRnHprd = calculateHPRD(weekendRnHours, weekendCensus);
    const weekdayTotalHprd = calculateHPRD(weekdayTotalHours, weekdayCensus);
    const weekendTotalHprd = calculateHPRD(weekendTotalHours, weekendCensus);

    const weekendRnDelta = weekdayRnHprd > 0
      ? ((weekendRnHprd - weekdayRnHprd) / weekdayRnHprd) * 100
      : 0;

    const weekendTotalDelta = weekdayTotalHprd > 0
      ? ((weekendTotalHprd - weekdayTotalHprd) / weekdayTotalHprd) * 100
      : 0;

    // Determine quarter ending date (last day of data)
    const quarterEnding = last90Days[last90Days.length - 1].work_date;

    aggregates.push({
      ccn,
      avg_rn_hprd: Math.round(avgRnHprd * 100) / 100,
      avg_lpn_hprd: Math.round(avgLpnHprd * 100) / 100,
      avg_cna_hprd: Math.round(avgCnaHprd * 100) / 100,
      avg_total_nurse_hprd: Math.round(avgTotalHprd * 100) / 100,
      weekend_rn_delta: Math.round(weekendRnDelta * 100) / 100,
      weekend_total_delta: Math.round(weekendTotalDelta * 100) / 100,
      quarter_ending: quarterEnding,
    });
  }

  return aggregates;
}

/**
 * Upsert staffing aggregate to database
 */
async function upsertStaffingAggregate(data: StaffingAggregate): Promise<'inserted' | 'updated' | 'skipped'> {
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
      .from('CommunityStaffing')
      .select('id')
      .eq('ccn', data.ccn)
      .eq('quarter_ending', data.quarter_ending)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      throw selectError;
    }

    const staffingData = {
      community_id: community.id,
      ccn: data.ccn,
      avg_rn_hprd: data.avg_rn_hprd,
      avg_lpn_hprd: data.avg_lpn_hprd,
      avg_cna_hprd: data.avg_cna_hprd,
      avg_total_nurse_hprd: data.avg_total_nurse_hprd,
      weekend_rn_delta: data.weekend_rn_delta,
      weekend_total_delta: data.weekend_total_delta,
      quarter_ending: data.quarter_ending,
      updated_at: new Date().toISOString(),
    };

    if (existing) {
      // Update
      const { error: updateError } = await supabaseAdmin
        .from('CommunityStaffing')
        .update(staffingData)
        .eq('id', existing.id);

      if (updateError) throw updateError;
      return 'updated';
    } else {
      // Insert
      const { error: insertError } = await supabaseAdmin
        .from('CommunityStaffing')
        .insert(staffingData);

      if (insertError) throw insertError;
      return 'inserted';
    }
  } catch (error) {
    console.error('Error upserting staffing data:', error, data);
    throw error;
  }
}

/**
 * Main ETL function to import PBJ staffing data
 * 
 * NOTE: This is a scaffold implementation. In production, you would:
 * 1. Download the latest PBJ CSV from CMS
 * 2. Filter by Cleveland county facilities (using provider info)
 * 3. Parse CSV rows into PBJDailyRecord format
 * 4. Add weekend flag based on work_date
 * 5. Pass to compute90DayAverages()
 */
export async function importPBJStaffing(dailyRecords?: PBJDailyRecord[]): Promise<ETLResult> {
  const startTime = new Date();
  const errors: ETLError[] = [];
  let processed = 0;
  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  try {
    console.log('Starting PBJ Staffing import...');

    // In production, fetch/parse PBJ CSV here
    if (!dailyRecords || dailyRecords.length === 0) {
      return createETLResult(startTime, 0, 0, 0, 0, [{
        message: 'No PBJ daily records provided. This ETL requires PBJ CSV data to be downloaded and parsed.',
        timestamp: new Date(),
      }]);
    }

    console.log(`Processing ${dailyRecords.length} daily records...`);

    // Compute 90-day rolling averages
    const aggregates = compute90DayAverages(dailyRecords);
    console.log(`Computed aggregates for ${aggregates.length} facilities`);

    // Upsert aggregates in batches
    const batches = chunkArray(aggregates, 50);

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`Processing batch ${i + 1}/${batches.length}...`);

      for (const aggregate of batch) {
        try {
          const result = await upsertStaffingAggregate(aggregate);
          processed++;

          if (result === 'inserted') inserted++;
          else if (result === 'updated') updated++;
          else skipped++;
        } catch (error) {
          errors.push({
            record: aggregate,
            message: `Upsert error: ${(error as Error).message}`,
            timestamp: new Date(),
          });
          processed++;
          skipped++;
        }
      }
    }

    const result = createETLResult(startTime, processed, inserted, updated, skipped, errors);
    logETLResult('PBJ Staffing', result);
    return result;
  } catch (error) {
    const criticalError: ETLError = {
      message: `Critical error: ${(error as Error).message}`,
      timestamp: new Date(),
    };
    errors.push(criticalError);

    const result = createETLResult(startTime, processed, inserted, updated, skipped, errors);
    logETLResult('PBJ Staffing', result);
    return result;
  }
}

