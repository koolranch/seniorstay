import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with environment variables
// You'll need to set these in your .env or .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create the Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey); 