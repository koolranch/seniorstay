/**
 * CMS Inspection PDF Linker
 * Links to CMS-2567 inspection report PDFs from Care Compare
 */

import { supabaseAdmin } from './supabase-client';
import { ETLResult, ETLError } from './types';
import {
  createETLResult,
  logETLResult,
  chunkArray,
  sleep,
} from './utils';

interface InspectionPDFData {
  ccn: string;
  community_id: string;
  survey_date: string;
  survey_type: string;
  pdf_url: string;
}

/**
 * Generate Care Compare inspection report URL for a facility
 * This is the page that lists all inspection reports
 */
function generateCareCompareInspectionUrl(ccn: string): string {
  return `https://www.medicare.gov/care-compare/profile/nursing-home/${ccn}/inspection-reports`;
}

/**
 * Generate likely PDF URL patterns based on survey data
 * Note: Actual PDF URLs may vary - this creates links to the inspection reports page
 */
function createInspectionPDFRecords(
  ccn: string,
  communityId: string,
  deficiencies: any[]
): InspectionPDFData[] {
  // Group deficiencies by survey_date and survey_type
  const surveyMap = new Map<string, { date: string; type: string }>();

  for (const def of deficiencies) {
    const key = `${def.survey_date}-${def.survey_type}`;
    if (!surveyMap.has(key)) {
      surveyMap.set(key, {
        date: def.survey_date,
        type: def.survey_type || 'standard',
      });
    }
  }

  // Create PDF records (pointing to Care Compare inspection reports page)
  return Array.from(surveyMap.values()).map(survey => ({
    ccn,
    community_id: communityId,
    survey_date: survey.date,
    survey_type: survey.type,
    pdf_url: generateCareCompareInspectionUrl(ccn),
  }));
}

/**
 * Upsert inspection PDF link
 */
async function upsertInspectionPDF(data: InspectionPDFData): Promise<'inserted' | 'updated' | 'skipped'> {
  try {
    const { data: existing, error: selectError } = await supabaseAdmin
      .from('InspectionReport')
      .select('id')
      .eq('ccn', data.ccn)
      .eq('survey_date', data.survey_date)
      .eq('survey_type', data.survey_type)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      throw selectError;
    }

    if (existing) {
      // Update URL if changed
      const { error: updateError } = await supabaseAdmin
        .from('InspectionReport')
        .update({ pdf_url: data.pdf_url })
        .eq('id', existing.id);

      if (updateError) throw updateError;
      return 'updated';
    } else {
      // Insert
      const { error: insertError } = await supabaseAdmin
        .from('InspectionReport')
        .insert(data);

      if (insertError) throw insertError;
      return 'inserted';
    }
  } catch (error) {
    console.error('Error upserting inspection PDF:', error);
    throw error;
  }
}

/**
 * Main ETL function to create inspection PDF links
 */
export async function importInspectionPDFs(): Promise<ETLResult> {
  const startTime = new Date();
  const errors: ETLError[] = [];
  let processed = 0;
  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  try {
    console.log('Starting Inspection PDF linking...');

    // Get communities with CCNs
    const { data: communities, error: commError } = await supabaseAdmin
      .from('Community')
      .select('id, ccn')
      .not('ccn', 'is', null);

    if (commError || !communities || communities.length === 0) {
      return createETLResult(startTime, 0, 0, 0, 0, [{
        message: 'No communities found',
        timestamp: new Date(),
      }]);
    }

    console.log(`Found ${communities.length} facilities with CCNs`);

    // For each facility, get their deficiencies to know what inspections exist
    const allPDFRecords: InspectionPDFData[] = [];

    for (const community of communities) {
      const { data: deficiencies } = await supabaseAdmin
        .from('CommunityDeficiency')
        .select('survey_date, survey_type')
        .eq('ccn', community.ccn);

      if (deficiencies && deficiencies.length > 0) {
        const pdfRecords = createInspectionPDFRecords(
          community.ccn!,
          community.id,
          deficiencies
        );
        allPDFRecords.push(...pdfRecords);
      }

      // Rate limiting: 10 facilities per second
      if (communities.indexOf(community) % 10 === 9) {
        await sleep(1000);
      }
    }

    console.log(`Created ${allPDFRecords.length} inspection PDF links`);

    // Upsert in batches
    const batches = chunkArray(allPDFRecords, 50);

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`Processing batch ${i + 1}/${batches.length}...`);

      for (const pdf of batch) {
        try {
          const result = await upsertInspectionPDF(pdf);
          processed++;

          if (result === 'inserted') inserted++;
          else if (result === 'updated') updated++;
          else skipped++;
        } catch (error) {
          errors.push({
            record: pdf,
            message: `Upsert error: ${(error as Error).message}`,
            timestamp: new Date(),
          });
          processed++;
          skipped++;
        }
      }
    }

    const result = createETLResult(startTime, processed, inserted, updated, skipped, errors);
    logETLResult('Inspection PDFs', result);
    return result;
  } catch (error) {
    const criticalError: ETLError = {
      message: `Critical error: ${(error as Error).message}`,
      timestamp: new Date(),
    };
    errors.push(criticalError);

    const result = createETLResult(startTime, processed, inserted, updated, skipped, errors);
    logETLResult('Inspection PDFs', result);
    return result;
  }
}

