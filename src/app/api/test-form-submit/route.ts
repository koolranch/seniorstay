import { NextRequest, NextResponse } from 'next/server';
import { submitLead } from '@/app/actions/leads';
import { LeadSchema } from '@/app/actions/lead-types';

/**
 * Test endpoint to debug form submission
 * POST /api/test-form-submit
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const diagnostics: Record<string, unknown> = {
    step: 'init',
    timestamp: new Date().toISOString(),
  };
  
  try {
    const body = await request.json();
    diagnostics.step = 'body_parsed';
    diagnostics.body = body;
    
    // Test if LeadSchema is available
    diagnostics.schema_available = typeof LeadSchema !== 'undefined';
    diagnostics.schema_type = typeof LeadSchema;
    
    // Test validation
    const testData = {
      fullName: body.fullName || 'Test User',
      email: body.email || 'test@example.com',
      pageType: 'homepage',
      sourceSlug: 'test-form-submit',
      notes: 'Test submission from API route',
      careType: 'Other',
      moveInTimeline: 'Just researching',
    };
    
    diagnostics.step = 'validating';
    const validationResult = LeadSchema.safeParse(testData);
    diagnostics.validation_success = validationResult.success;
    if (!validationResult.success) {
      diagnostics.validation_errors = validationResult.error.issues;
    }
    
    // Call the server action
    diagnostics.step = 'calling_submitLead';
    const result = await submitLead(testData);
    diagnostics.step = 'submitLead_complete';
    
    const duration = Date.now() - startTime;
    
    return NextResponse.json({
      test_timestamp: new Date().toISOString(),
      duration_ms: duration,
      diagnostics,
      result,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    diagnostics.step = 'error_caught';
    diagnostics.error = error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 10),
    } : String(error);
    
    return NextResponse.json({
      test_timestamp: new Date().toISOString(),
      duration_ms: duration,
      diagnostics,
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
