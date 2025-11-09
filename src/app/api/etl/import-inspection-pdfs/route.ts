/**
 * API Route: Import Inspection PDFs
 * Endpoint to create links to inspection report PDFs
 */

import { NextRequest, NextResponse } from 'next/server';
import { importInspectionPDFs } from '@/lib/etl/cms-inspection-pdfs';

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

    console.log('Starting Inspection PDF linking via API...');
    
    const result = await importInspectionPDFs();

    return NextResponse.json({
      success: result.success,
      message: result.success
        ? 'Inspection PDF linking completed successfully'
        : 'Inspection PDF linking completed with errors',
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

