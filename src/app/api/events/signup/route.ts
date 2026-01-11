import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Event Signup API Route
 * Captures email for event reminders + cost report delivery
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hncgnxbooghjhpncujzx.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, eventId, eventTitle, eventDate, neighborhood } = body;

    // Validate required fields
    if (!email || !eventId) {
      return NextResponse.json(
        { error: 'Email and event ID are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Use service role key if available, otherwise anon key
    const supabaseKey = supabaseServiceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Insert signup (upsert to handle duplicates gracefully)
    const { data, error } = await supabase
      .from('event_signups')
      .upsert(
        {
          event_id: eventId,
          email: email.toLowerCase().trim(),
          event_title: eventTitle,
          event_date: eventDate,
          neighborhood: neighborhood,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'event_id,email',
          ignoreDuplicates: false,
        }
      )
      .select();

    if (error) {
      console.error('Error saving event signup:', error);
      return NextResponse.json(
        { error: 'Failed to save signup' },
        { status: 500 }
      );
    }

    // TODO: Trigger email with event reminder + cost report
    // This could integrate with SendGrid, Resend, or another email service

    return NextResponse.json({
      success: true,
      message: 'Signup successful! Check your email for the event reminder and cost report.',
      data,
    });

  } catch (error) {
    console.error('Event signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
