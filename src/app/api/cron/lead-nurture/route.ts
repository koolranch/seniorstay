import { NextRequest, NextResponse } from 'next/server';
import { processDueNurtureEmails } from '@/lib/lead-nurture-store';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function isAuthorized(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return process.env.NODE_ENV !== 'production';
  }

  const authHeader = request.headers.get('authorization');
  const secretParam = request.nextUrl.searchParams.get('secret');
  return authHeader === `Bearer ${cronSecret}` || secretParam === cronSecret;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await processDueNurtureEmails();
    return NextResponse.json({
      success: true,
      timezone: 'America/New_York',
      ...result,
    });
  } catch (error) {
    console.error('[Nurture cron] Failed:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
