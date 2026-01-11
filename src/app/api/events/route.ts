/**
 * API Route: /api/events
 * 
 * Fetches senior events with Vercel Edge Caching for sub-2s performance.
 * Supports filtering by neighborhood and pagination.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use Edge Runtime for optimal caching
export const runtime = 'edge';

// Supabase client (using anon key for read-only operations)
const supabaseUrl = 'https://hncgnxbooghjhpncujzx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuY2dueGJvb2doamhwbmN1anp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMTI0ODIsImV4cCI6MjA1OTc4ODQ4Mn0.mdAL87W0h4PN7Xu8ESjjDxzjW_H3YH55i-FqAE5SXcs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SeniorEvent {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  neighborhood: string | null;
  event_type: 'community_hub' | 'medical_wellness' | 'luxury_showcase';
  location_name: string | null;
  location_url: string | null;
  registration_url: string | null;
  is_virtual: boolean;
  image_url: string | null;
  schema_json: object | null;
  source_url: string | null;
  source_name: string | null;
  created_at: string;
  updated_at: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  // Query parameters
  const neighborhood = searchParams.get('neighborhood');
  const eventType = searchParams.get('type');
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
  const offset = parseInt(searchParams.get('offset') || '0');
  const upcoming = searchParams.get('upcoming') !== 'false'; // Default to upcoming only
  const month = searchParams.get('month'); // Format: YYYY-MM
  
  // Build query
  let query = supabase
    .from('senior_events')
    .select('*', { count: 'exact' });
  
  // Filter upcoming events by default
  if (upcoming) {
    query = query.gte('start_date', new Date().toISOString());
  }
  
  // Filter by neighborhood
  if (neighborhood) {
    query = query.ilike('neighborhood', neighborhood);
  }
  
  // Filter by event type
  if (eventType && (eventType === 'community_hub' || eventType === 'medical_wellness' || eventType === 'luxury_showcase')) {
    query = query.eq('event_type', eventType);
  }
  
  // Filter by month
  if (month) {
    const [year, monthNum] = month.split('-');
    const startOfMonth = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
    const endOfMonth = new Date(parseInt(year), parseInt(monthNum), 0, 23, 59, 59);
    query = query
      .gte('start_date', startOfMonth.toISOString())
      .lte('start_date', endOfMonth.toISOString());
  }
  
  // Order by date and apply pagination
  query = query
    .order('start_date', { ascending: true })
    .range(offset, offset + limit - 1);
  
  const { data: events, error, count } = await query;
  
  if (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
  
  // Build response with cache headers
  const response = NextResponse.json({
    events: events || [],
    total: count || 0,
    pagination: {
      limit,
      offset,
      hasMore: count ? offset + limit < count : false,
    },
  });
  
  // Set cache headers for Vercel Edge Caching
  // Cache for 1 hour, stale-while-revalidate for 24 hours
  response.headers.set(
    'Cache-Control',
    's-maxage=3600, stale-while-revalidate=86400'
  );
  
  return response;
}
