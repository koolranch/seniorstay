import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hncgnxbooghjhpncujzx.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Generate JSON-LD schema
function generateEventSchema(event: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description,
    startDate: event.start_date,
    eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: event.location_name || `${event.neighborhood} Community`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: event.neighborhood,
        addressRegion: 'OH',
        addressCountry: 'US',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: 'Guide for Seniors',
      url: 'https://guideforseniors.com',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: event.registration_url || 'https://guideforseniors.com/events',
    },
    isAccessibleForFree: true,
  };
}

// January 2026 seed events for immediate UI population
const SEED_EVENTS = [
  {
    title: 'Senior Fitness: Chair Yoga & Stretching',
    description: 'Gentle chair yoga and stretching class designed for seniors of all fitness levels. Improve flexibility, balance, and relaxation. Led by certified instructor. No experience necessary.',
    start_date: '2026-01-15T10:00:00.000Z',
    neighborhood: 'Westlake',
    event_type: 'community_hub',
    location_name: 'Westlake Senior Center',
    registration_url: 'https://www.cityofwestlake.org/o/cs/page/programs',
    source_url: 'https://www.cityofwestlake.org/o/cs/page/programs',
    source_name: 'Westlake Senior Services',
    is_virtual: false,
  },
  {
    title: 'Medicare 2026: Understanding Your Benefits',
    description: 'Free educational seminar on Medicare changes for 2026. Learn about Part A, Part B, Medicare Advantage, and supplemental plans. Q&A session with local healthcare experts from Cleveland Clinic.',
    start_date: '2026-01-18T14:00:00.000Z',
    neighborhood: 'Regional',
    event_type: 'medical_wellness',
    location_name: 'Cleveland Clinic Wellness Center',
    registration_url: 'https://my.clevelandclinic.org/departments/wellness/patient-resources/events',
    source_url: 'https://my.clevelandclinic.org/departments/wellness/patient-resources/events',
    source_name: 'Cleveland Clinic Wellness',
    is_virtual: false,
  },
  {
    title: 'Beachwood Senior Lunch & Learn: Fraud Prevention',
    description: 'Join us for lunch and learn how to protect yourself from common scams targeting seniors. Topics include phone scams, identity theft, and online safety. Lunch provided.',
    start_date: '2026-01-22T12:00:00.000Z',
    neighborhood: 'Beachwood',
    event_type: 'community_hub',
    location_name: 'Beachwood Community Center',
    registration_url: 'https://www.beachwoodohio.com/151/Senior-Programs',
    source_url: 'https://www.beachwoodohio.com/151/Senior-Programs',
    source_name: 'Beachwood Senior Programs',
    is_virtual: false,
  },
  {
    title: 'Vitalia Westlake: Winter Wine & Cheese Social',
    description: 'Experience the warmth of community at our elegant wine and cheese social. Tour our luxury senior living community, meet residents, and enjoy live piano music. Complimentary valet parking.',
    start_date: '2026-01-25T17:00:00.000Z',
    neighborhood: 'Westlake',
    event_type: 'luxury_showcase',
    location_name: 'Vitalia Westlake',
    registration_url: 'https://vitaliawestlake.com/event-entertainment/',
    source_url: 'https://vitaliawestlake.com/event-entertainment/',
    source_name: 'Vitalia Westlake',
    is_virtual: false,
  },
  {
    title: 'UH Age Well: Heart Health Screening Day',
    description: 'Free heart health screenings for seniors 60+. Includes blood pressure check, cholesterol screening, and one-on-one consultation with UH cardiologist. Appointments required.',
    start_date: '2026-01-28T09:00:00.000Z',
    neighborhood: 'Regional',
    event_type: 'medical_wellness',
    location_name: 'University Hospitals',
    registration_url: 'https://www.uhhospitals.org/events',
    source_url: 'https://www.uhhospitals.org/events',
    source_name: 'UH Age Well Events',
    is_virtual: false,
  },
  {
    title: 'Rocky River Seniors: Movie Matinee & Popcorn',
    description: 'Join fellow seniors for a classic movie matinee featuring a beloved film from the golden age of Hollywood. Free popcorn and refreshments. Discussion group follows.',
    start_date: '2026-01-30T13:30:00.000Z',
    neighborhood: 'Rocky River',
    event_type: 'community_hub',
    location_name: 'Rocky River Senior Center',
    registration_url: 'https://www.rockyriverohio.gov/s/January-Quill_Final.pdf',
    source_url: 'https://www.rockyriverohio.gov/s/January-Quill_Final.pdf',
    source_name: 'Rocky River (The Quill)',
    is_virtual: false,
  },
  // February events for fuller calendar
  {
    title: 'Solon Senior Center: Valentine\'s Day Dance',
    description: 'Celebrate Valentine\'s Day with dancing, refreshments, and good company. Live music by the Solon Swing Band. Singles and couples welcome. Semi-formal attire.',
    start_date: '2026-02-14T18:00:00.000Z',
    neighborhood: 'Solon',
    event_type: 'community_hub',
    location_name: 'Solon Senior Center',
    registration_url: 'https://www.solonohio.gov/1156/SSC-Programming',
    source_url: 'https://www.solonohio.gov/1156/SSC-Programming',
    source_name: 'Solon Senior Center',
    is_virtual: false,
  },
  {
    title: 'Rose Senior Living: Art & Appetizers Open House',
    description: 'Discover the artistry of senior living at Rose Senior Living Beachwood. View resident artwork, enjoy gourmet appetizers, and learn about our memory care and assisted living options.',
    start_date: '2026-02-20T16:00:00.000Z',
    neighborhood: 'Beachwood',
    event_type: 'luxury_showcase',
    location_name: 'Rose Senior Living Beachwood',
    registration_url: 'https://beachwood.roseseniorliving.com/about/news-events/',
    source_url: 'https://beachwood.roseseniorliving.com/about/news-events/',
    source_name: 'Rose Senior Living',
    is_virtual: false,
  },
];

export async function POST(request: Request) {
  // Verify authorization
  const authHeader = request.headers.get('authorization');
  const expectedKey = process.env.MANUAL_TRIGGER_KEY;
  
  const url = new URL(request.url);
  const manualKey = url.searchParams.get('key');
  
  const isAuthorized = 
    authHeader === `Bearer ${expectedKey}` || 
    manualKey === expectedKey ||
    process.env.NODE_ENV !== 'production';

  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!supabaseServiceKey) {
    return NextResponse.json(
      { error: 'Missing SUPABASE_SERVICE_ROLE_KEY' },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const results: { title: string; status: 'inserted' | 'updated' | 'error'; message?: string }[] = [];

  console.log(`[SEED] Inserting ${SEED_EVENTS.length} January events...`);

  for (const event of SEED_EVENTS) {
    const schemaJson = generateEventSchema(event);

    // Upsert using composite key [title, start_date]
    const { error } = await supabase
      .from('senior_events')
      .upsert(
        {
          ...event,
          schema_json: schemaJson,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'title,start_date',
          ignoreDuplicates: false,
        }
      );

    if (error) {
      results.push({ title: event.title, status: 'error', message: error.message });
      console.error(`[SEED ERROR] ${event.title}: ${error.message}`);
    } else {
      results.push({ title: event.title, status: 'inserted' });
      console.log(`[SEED] Inserted: ${event.title}`);
    }
  }

  const inserted = results.filter(r => r.status === 'inserted').length;
  const errors = results.filter(r => r.status === 'error').length;

  return NextResponse.json({
    success: errors === 0,
    timestamp: new Date().toISOString(),
    summary: {
      total: SEED_EVENTS.length,
      inserted,
      errors,
    },
    results,
  });
}

// GET handler to view seed data without inserting
export async function GET(request: Request) {
  return NextResponse.json({
    message: 'POST to this endpoint to seed events',
    eventCount: SEED_EVENTS.length,
    events: SEED_EVENTS.map(e => ({
      title: e.title,
      date: e.start_date,
      neighborhood: e.neighborhood,
      type: e.event_type,
    })),
  });
}
