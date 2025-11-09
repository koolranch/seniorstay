/**
 * Supabase Client for ETL Operations
 * Server-side only client for data imports
 */

import { createClient } from '@supabase/supabase-js';

// Ensure we have the required environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseServiceKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
}

// Create a Supabase client with service role key for ETL operations
// This bypasses RLS policies and should only be used server-side
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

/**
 * Test database connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin.from('Community').select('id').limit(1);
    return !error;
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return false;
  }
}

