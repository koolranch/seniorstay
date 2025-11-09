/**
 * API Route: Import CMS Deficiencies
 * Endpoint to trigger CMS health deficiencies import
 */

import { NextRequest, NextResponse } from 'next/server';
import { importCMSDeficiencies } from '@/lib/etl/cms-deficiencies';

export const maxDuration = 300; // 5 minutes
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

    console.log('Starting CMS Deficiencies import via API...');
    
    const result = await importCMSDeficiencies();

    return NextResponse.json({
      success: result.success,
      message: result.success
        ? 'CMS Deficiencies import completed successfully'
        : 'CMS Deficiencies import completed with errors',
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
      { error: 'Internal server error', message: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}

