/**
 * API Route: /api/events/scrape
 * 
 * Triggers the senior events scraper.
 * Protected by a secret key for cron jobs.
 * 
 * Usage: Call this endpoint weekly via Vercel Cron or external scheduler
 */

import { NextRequest, NextResponse } from 'next/server';

// Vercel Edge Runtime for better performance
export const runtime = 'edge';

// Firecrawl API configuration
const FIRECRAWL_API_URL = 'https://api.firecrawl.dev/v1';

interface EventSource {
  name: string;
  url: string;
  neighborhood: string | null;
  eventType: 'community_event' | 'expert_webinar';
}

const EVENT_SOURCES: EventSource[] = [
  {
    name: 'Cuyahoga County Library',
    url: 'https://cuyahogalibrary.org/events?category=Seniors',
    neighborhood: null,
    eventType: 'community_event',
  },
  {
    name: 'City of Westlake',
    url: 'https://www.cityofwestlake.org/calendar',
    neighborhood: 'Westlake',
    eventType: 'community_event',
  },
  {
    name: 'City of Beachwood',
    url: 'https://www.beachwoodohio.com/calendar',
    neighborhood: 'Beachwood',
    eventType: 'community_event',
  },
  {
    name: 'Parma Senior Center',
    url: 'https://www.cityofparma-oh.gov/senior-center/calendar',
    neighborhood: 'Parma',
    eventType: 'community_event',
  },
];

// Hospital keywords for medical-intent SEO
const HOSPITAL_KEYWORDS = [
  'Cleveland Clinic',
  'St. John Medical',
  'St. John West Shore',
  'University Hospitals',
  'MetroHealth',
  'Southwest General',
  'Fairview Hospital',
];

function parseEventDate(dateString: string): string | null {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) ? date.toISOString() : null;
  } catch {
    return null;
  }
}

function containsHospitalKeywords(text: string): boolean {
  const lowerText = text.toLowerCase();
  return HOSPITAL_KEYWORDS.some(keyword => lowerText.includes(keyword.toLowerCase()));
}

function isVirtualEvent(title: string, description: string): boolean {
  const text = `${title} ${description}`.toLowerCase();
  const virtualKeywords = ['virtual', 'online', 'webinar', 'zoom', 'video call', 'livestream'];
  return virtualKeywords.some(keyword => text.includes(keyword));
}

function generateEventSchema(event: {
  title: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  neighborhood: string | null;
  is_virtual: boolean;
  location_name: string | null;
  location_url: string | null;
  source_name: string;
  source_url: string;
  image_url: string | null;
}): object {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description || `Senior event in Cleveland: ${event.title}`,
    startDate: event.start_date,
    endDate: event.end_date || event.start_date,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: event.is_virtual
      ? 'https://schema.org/OnlineEventAttendanceMode'
      : 'https://schema.org/OfflineEventAttendanceMode',
    organizer: {
      '@type': 'Organization',
      name: event.source_name,
      url: event.source_url,
    },
    audience: {
      '@type': 'Audience',
      audienceType: 'Seniors',
    },
    areaServed: {
      '@type': 'City',
      name: event.neighborhood || 'Cleveland',
      containedInPlace: { '@type': 'State', name: 'Ohio' },
    },
  };

  if (event.is_virtual) {
    schema.location = {
      '@type': 'VirtualLocation',
      url: event.location_url || event.source_url,
    };
  } else if (event.location_name) {
    schema.location = {
      '@type': 'Place',
      name: event.location_name,
      address: {
        '@type': 'PostalAddress',
        addressLocality: event.neighborhood || 'Cleveland',
        addressRegion: 'OH',
        addressCountry: 'US',
      },
    };
  }

  if (event.image_url) {
    schema.image = event.image_url;
  }

  return schema;
}

export async function POST(request: NextRequest) {
  // Verify authorization
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hncgnxbooghjhpncujzx.supabase.co';
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

  if (!FIRECRAWL_API_KEY) {
    return NextResponse.json({ error: 'Firecrawl API key not configured' }, { status: 500 });
  }

  if (!SUPABASE_SERVICE_KEY) {
    return NextResponse.json({ error: 'Supabase service key not configured' }, { status: 500 });
  }

  const results: { source: string; events: number; error?: string }[] = [];

  for (const source of EVENT_SOURCES) {
    try {
      // Use Firecrawl extract to get structured event data
      const extractResponse = await fetch(`${FIRECRAWL_API_URL}/extract`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
        },
        body: JSON.stringify({
          urls: [source.url],
          prompt: `Extract all events from this page, focusing on senior-related events. For each event extract: title, date (in ISO format if possible), description, location name, and any link to details.`,
          schema: {
            type: 'object',
            properties: {
              events: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    date: { type: 'string' },
                    description: { type: 'string' },
                    location: { type: 'string' },
                    link: { type: 'string' },
                  },
                  required: ['title', 'date'],
                },
              },
            },
          },
        }),
      });

      if (!extractResponse.ok) {
        throw new Error(`Firecrawl error: ${extractResponse.statusText}`);
      }

      const extractData = await extractResponse.json();
      const extractedEvents = extractData.data?.events || [];

      // Process and save events
      let savedCount = 0;
      for (const e of extractedEvents) {
        if (!e.title || !e.date) continue;

        const startDate = parseEventDate(e.date);
        if (!startDate) continue;

        const description = e.description || '';
        const isWebinar = e.title.toLowerCase().includes('webinar') || containsHospitalKeywords(description);

        const event = {
          title: e.title.trim(),
          description: description.trim() || null,
          start_date: startDate,
          end_date: null,
          neighborhood: source.neighborhood,
          event_type: isWebinar ? 'expert_webinar' : source.eventType,
          location_name: e.location?.trim() || source.name,
          location_url: e.link || source.url,
          is_virtual: isVirtualEvent(e.title, description),
          image_url: null,
          source_url: source.url,
          source_name: source.name,
        };

        const schemaJson = generateEventSchema(event);

        // Insert into Supabase
        const insertResponse = await fetch(`${SUPABASE_URL}/rest/v1/senior_events`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'Prefer': 'resolution=merge-duplicates',
          },
          body: JSON.stringify({
            ...event,
            schema_json: schemaJson,
            updated_at: new Date().toISOString(),
          }),
        });

        if (insertResponse.ok) {
          savedCount++;
        }
      }

      results.push({ source: source.name, events: savedCount });
    } catch (error) {
      results.push({
        source: source.name,
        events: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  const totalEvents = results.reduce((sum, r) => sum + r.events, 0);

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    totalEvents,
    results,
  });
}

// GET for health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/events/scrape',
    method: 'POST',
    description: 'Triggers the senior events scraper',
  });
}
