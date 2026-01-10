import { NextRequest, NextResponse } from 'next/server';
import { submitLead } from '@/app/actions/leads';

/**
 * Test endpoint to debug form submission
 * POST /api/test-form-submit
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    console.log('[TestFormSubmit] Received body:', JSON.stringify(body, null, 2));
    
    // Call the server action directly
    const result = await submitLead({
      fullName: body.fullName || 'Test User',
      email: body.email || 'test@example.com',
      pageType: 'homepage',
      sourceSlug: 'test-form-submit',
      notes: 'Test submission from API route',
      careType: 'Other',
      moveInTimeline: 'Just researching',
    });
    
    const duration = Date.now() - startTime;
    console.log('[TestFormSubmit] Result:', JSON.stringify(result, null, 2), `(${duration}ms)`);
    
    return NextResponse.json({
      test_timestamp: new Date().toISOString(),
      duration_ms: duration,
      result,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('[TestFormSubmit] Error:', error);
    
    return NextResponse.json({
      test_timestamp: new Date().toISOString(),
      duration_ms: duration,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 5),
      } : String(error),
    }, { status: 500 });
  }
}

// GET endpoint for simple testing
export async function GET() {
  return NextResponse.json({
    message: 'Use POST to test form submission',
    example: {
      method: 'POST',
      body: {
        fullName: 'Test User',
        email: 'test@example.com'
      }
    }
  });
}
