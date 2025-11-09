/**
 * API Route: Import PBJ Staffing Data
 * Endpoint to trigger automated PBJ CSV download and import
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchLatestPBJData } from '@/lib/etl/fetch-pbj-csv';
import { importPBJStaffing } from '@/lib/etl/cms-pbj-staffing';

export const maxDuration = 300; // 5 minutes for large CSV processing
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    const searchParams = request.nextUrl.searchParams;
    const secretParam = searchParams.get('secret');

    const isAuthorized =
      (authHeader && authHeader === `Bearer ${cronSecret}`) ||
      (secretParam && secretParam === cronSecret);

    if (!isAuthorized && cronSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting PBJ Staffing import via API...');
    console.log('This may take 2-5 minutes to download and parse CSV files...');
    
    // Fetch latest 2 quarters of PBJ data (automated discovery and download)
    const pbjRecords = await fetchLatestPBJData();
    
    if (pbjRecords.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No PBJ data found or downloaded',
        stats: { processed: 0, inserted: 0, updated: 0, skipped: 0, errors: 0 },
      });
    }

    console.log(`Downloaded ${pbjRecords.length} PBJ records for Cleveland facilities`);
    
    // Pass to existing import function which computes 90-day averages
    const result = await importPBJStaffing(pbjRecords);

    return NextResponse.json({
      success: result.success,
      message: result.success
        ? 'PBJ Staffing import completed successfully'
        : 'PBJ Staffing import completed with errors',
      stats: {
        dailyRecordsProcessed: pbjRecords.length,
        facilitiesProcessed: result.recordsProcessed,
        inserted: result.recordsInserted,
        updated: result.recordsUpdated,
        skipped: result.recordsSkipped,
        errors: result.errors.length,
      },
      duration: result.duration,
      timestamp: result.endTime.toISOString(),
    });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}

