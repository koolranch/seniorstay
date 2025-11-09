/**
 * API Route: Import CMS Provider Info
 * Endpoint to trigger CMS Provider Information import
 * Protected by cron secret for scheduled execution
 */

import { NextRequest, NextResponse } from 'next/server';
import { importCMSProviderInfo } from '@/lib/etl/cms-provider-info';

export const maxDuration = 300; // 5 minutes timeout for Vercel
export const dynamic = 'force-dynamic';

/**
 * POST /api/etl/import-cms-provider-info
 * Triggers the CMS Provider Info import
 * 
 * Authorization: Requires CRON_SECRET in header or query param
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authorization (cron secret or manual trigger)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    const searchParams = request.nextUrl.searchParams;
    const secretParam = searchParams.get('secret');

    // Check if authorized
    const isAuthorized =
      (authHeader && authHeader === `Bearer ${cronSecret}`) ||
      (secretParam && secretParam === cronSecret);

    if (!isAuthorized && cronSecret) {
      console.warn('Unauthorized ETL import attempt');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Starting CMS Provider Info import via API...');
    
    // Run the import
    const result = await importCMSProviderInfo();

    // Return result
    return NextResponse.json({
      success: result.success,
      message: result.success
        ? 'CMS Provider Info import completed successfully'
        : 'CMS Provider Info import completed with errors',
      stats: {
        processed: result.recordsProcessed,
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
      {
        error: 'Internal server error',
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/etl/import-cms-provider-info
 * Manual trigger via browser (with secret)
 */
export async function GET(request: NextRequest) {
  return POST(request);
}

