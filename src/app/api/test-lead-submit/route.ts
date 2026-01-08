import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface DiagnosticResult {
  success: boolean;
  error?: string;
  code?: string;
  hint?: string;
  details?: string;
  rows_found?: number;
  inserted_id?: string;
  cleaned_up?: boolean;
}

interface Diagnostics {
  timestamp: string;
  environment: string | undefined;
  env_check?: {
    NEXT_PUBLIC_SUPABASE_URL: boolean;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: boolean;
    SUPABASE_SERVICE_ROLE_KEY: boolean;
    has_service_key: boolean;
  };
  error?: string;
  table_read_test?: DiagnosticResult;
  table_insert_test?: DiagnosticResult;
  schema_check?: DiagnosticResult;
}

/**
 * Diagnostic endpoint to test Supabase lead submission
 * GET /api/test-lead-submit
 */
export async function GET() {
  const diagnostics: Diagnostics = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  };

  // Check environment variables
  diagnostics.env_check = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    has_service_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  };

  // Test Supabase connection
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hncgnxbooghjhpncujzx.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseKey) {
    diagnostics.error = 'No Supabase key available';
    return NextResponse.json(diagnostics, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  // Test 1: Check if Lead table exists and is accessible
  try {
    const { data, error } = await supabase
      .from('Lead')
      .select('id')
      .limit(1);

    if (error) {
      diagnostics.table_read_test = {
        success: false,
        error: error.message,
        code: error.code,
        hint: error.hint,
      };
    } else {
      diagnostics.table_read_test = {
        success: true,
        rows_found: data?.length || 0,
      };
    }
  } catch (e) {
    diagnostics.table_read_test = {
      success: false,
      error: e instanceof Error ? e.message : 'Unknown error',
    };
  }

  // Test 2: Try a test insert (will be deleted immediately)
  try {
    const testData = {
      fullName: 'TEST_DIAGNOSTIC_ENTRY',
      email: 'test@diagnostic.local',
      phone: '000-000-0000',
      careType: 'Assisted Living',
      notes: 'Diagnostic test - safe to delete',
      pageType: 'other',
      urgencyScore: 0,
      priority: 'low',
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { data: insertData, error: insertError } = await supabase
      .from('Lead')
      .insert(testData)
      .select('id')
      .single();

    if (insertError) {
      diagnostics.table_insert_test = {
        success: false,
        error: insertError.message,
        code: insertError.code,
        hint: insertError.hint,
        details: insertError.details,
      };
    } else {
      diagnostics.table_insert_test = {
        success: true,
        inserted_id: insertData?.id,
      };

      // Clean up test entry
      if (insertData?.id) {
        await supabase
          .from('Lead')
          .delete()
          .eq('id', insertData.id);
        diagnostics.table_insert_test.cleaned_up = true;
      }
    }
  } catch (e) {
    diagnostics.table_insert_test = {
      success: false,
      error: e instanceof Error ? e.message : 'Unknown error',
    };
  }

  // Test 3: Check table schema
  try {
    const { data: schemaData, error: schemaError } = await supabase
      .from('Lead')
      .select('*')
      .limit(0);

    diagnostics.schema_check = {
      success: !schemaError,
      error: schemaError?.message,
    };
  } catch (e) {
    diagnostics.schema_check = {
      success: false,
      error: e instanceof Error ? e.message : 'Unknown error',
    };
  }

  const allPassed = 
    diagnostics.table_read_test?.success === true && 
    diagnostics.table_insert_test?.success === true;

  return NextResponse.json({
    ...diagnostics,
    overall_status: allPassed ? 'HEALTHY' : 'ISSUES_DETECTED',
    recommendation: allPassed 
      ? 'Supabase connection is working correctly'
      : diagnostics.env_check?.has_service_key === true
        ? 'Check RLS policies or table schema'
        : 'Add SUPABASE_SERVICE_ROLE_KEY to Vercel environment variables',
  }, { 
    status: allPassed ? 200 : 500 
  });
}

