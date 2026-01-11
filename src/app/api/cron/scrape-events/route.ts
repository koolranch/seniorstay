import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Extended runtime for scraping all targets
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

// Firecrawl configuration
const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
const FIRECRAWL_BASE_URL = 'https://api.firecrawl.dev/v1';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hncgnxbooghjhpncujzx.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Event type mapping
type EventTypeEnum = 'community_hub' | 'medical_wellness' | 'luxury_showcase';

// All 11 scrape targets with neighborhood and event type mapping
const SCRAPE_TARGETS: {
  url: string;
  sourceName: string;
  neighborhood: string;
  eventType: EventTypeEnum;
}[] = [
  // Community Hubs (Senior Centers)
  {
    url: 'https://www.cityofwestlake.org/o/cs/page/programs',
    sourceName: 'Westlake Senior Center',
    neighborhood: 'Westlake',
    eventType: 'community_hub',
  },
  {
    url: 'https://www.beachwoodohio.com/151/Senior-Programs',
    sourceName: 'Beachwood Senior Programs',
    neighborhood: 'Beachwood',
    eventType: 'community_hub',
  },
  {
    url: 'https://www.solonohio.gov/1156/SSC-Programming',
    sourceName: 'Solon Senior Center',
    neighborhood: 'Solon',
    eventType: 'community_hub',
  },
  {
    url: 'https://www.orangerec.com/page/orange-senior-center',
    sourceName: 'Orange Senior Center',
    neighborhood: 'Orange',
    eventType: 'community_hub',
  },
  {
    url: 'https://the-senior-center.org/calendar',
    sourceName: 'The Senior Center',
    neighborhood: 'Cleveland',
    eventType: 'community_hub',
  },
  {
    url: 'https://attend.cuyahogalibrary.org/events?a=adults',
    sourceName: 'Cuyahoga County Library',
    neighborhood: 'Cleveland',
    eventType: 'community_hub',
  },

  // Luxury Showcases (Senior Living Communities)
  {
    url: 'https://vitaliawestlake.com/event-entertainment/',
    sourceName: 'Vitalia Westlake',
    neighborhood: 'Westlake',
    eventType: 'luxury_showcase',
  },
  {
    url: 'https://beachwood.roseseniorliving.com/about/news-events/',
    sourceName: 'Rose Senior Living Beachwood',
    neighborhood: 'Beachwood',
    eventType: 'luxury_showcase',
  },
  {
    url: 'https://thenormandy.com/lifestyle/activities/',
    sourceName: 'The Normandy',
    neighborhood: 'Rocky River',
    eventType: 'luxury_showcase',
  },

  // Medical & Wellness (Hospital Systems)
  {
    url: 'https://my.clevelandclinic.org/departments/wellness/patient-resources/events',
    sourceName: 'Cleveland Clinic Wellness',
    neighborhood: 'Cleveland',
    eventType: 'medical_wellness',
  },
  {
    url: 'https://www.uhhospitals.org/events',
    sourceName: 'University Hospitals',
    neighborhood: 'Cleveland',
    eventType: 'medical_wellness',
  },
];

// Generate JSON-LD schema for an event (per Google/Schema.org spec)
function generateEventSchema(event: {
  title: string;
  description: string;
  start_date: string;
  neighborhood: string;
  location_name?: string;
  registration_url?: string;
}) {
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

// Extract events using Firecrawl
async function scrapeEventsFromUrl(target: typeof SCRAPE_TARGETS[0]): Promise<any[]> {
  if (!FIRECRAWL_API_KEY) {
    console.log(`[SKIP] No Firecrawl API key, skipping ${target.sourceName}`);
    return [];
  }

  try {
    console.log(`[SCRAPE] Starting: ${target.sourceName} - ${target.url}`);

    const response = await fetch(`${FIRECRAWL_BASE_URL}/scrape`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
      },
      body: JSON.stringify({
        url: target.url,
        formats: ['markdown'],
        onlyMainContent: true,
        waitFor: 5000, // Wait 5s for dynamic content
      }),
    });

    if (!response.ok) {
      console.error(`[ERROR] Firecrawl failed for ${target.sourceName}: ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    const content = data.data?.markdown || '';

    // Extract events using pattern matching
    const events = extractEventsFromContent(content, target);
    console.log(`[SUCCESS] ${target.sourceName}: Found ${events.length} events`);

    return events;
  } catch (error) {
    console.error(`[ERROR] Scraping ${target.sourceName}:`, error);
    return [];
  }
}

// Parse events from scraped content
function extractEventsFromContent(content: string, target: typeof SCRAPE_TARGETS[0]): any[] {
  const events: any[] = [];
  const now = new Date();
  const threeMonthsFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

  // Common date patterns
  const datePatterns = [
    /(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},?\s+\d{4}/gi,
    /\d{1,2}\/\d{1,2}\/\d{2,4}/g,
    /\d{4}-\d{2}-\d{2}/g,
  ];

  // Time patterns
  const timePattern = /\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?/gi;

  // Split content into potential event blocks
  const blocks = content.split(/\n\n+|\r\n\r\n+|(?=#{1,3}\s)/);

  for (const block of blocks) {
    if (block.length < 20 || block.length > 2000) continue;

    // Look for dates in the block
    let foundDate: Date | null = null;
    for (const pattern of datePatterns) {
      const matches = block.match(pattern);
      if (matches && matches.length > 0) {
        const parsed = new Date(matches[0]);
        if (!isNaN(parsed.getTime()) && parsed > now && parsed < threeMonthsFromNow) {
          foundDate = parsed;
          break;
        }
      }
    }

    if (!foundDate) continue;

    // Extract time if available
    const timeMatches = block.match(timePattern);
    if (timeMatches && timeMatches.length > 0) {
      const timeStr = timeMatches[0];
      const [hours, minutes] = timeStr.replace(/\s*(AM|PM|am|pm)/i, '').split(':');
      let hour = parseInt(hours);
      if (timeStr.toLowerCase().includes('pm') && hour < 12) hour += 12;
      if (timeStr.toLowerCase().includes('am') && hour === 12) hour = 0;
      foundDate.setHours(hour, parseInt(minutes) || 0);
    }

    // Extract title
    let title = '';
    const titleMatch = block.match(/^#+\s*(.+?)(?:\n|$)/m) || 
                       block.match(/\*\*(.+?)\*\*/m) ||
                       block.match(/^(.+?)(?:\n|$)/m);
    if (titleMatch) {
      title = titleMatch[1]
        .replace(/[#*_]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 200);
    }

    if (!title || title.length < 5) continue;

    // Skip non-event content
    const skipKeywords = ['copyright', 'privacy', 'terms', 'login', 'sign up', 'subscribe', 'cookie'];
    if (skipKeywords.some(kw => title.toLowerCase().includes(kw))) continue;

    // Extract description
    const description = block
      .replace(titleMatch?.[0] || '', '')
      .replace(/[#*_]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 500) || `${target.eventType === 'medical_wellness' ? 'Health and wellness event' : target.eventType === 'luxury_showcase' ? 'Community showcase event' : 'Senior community event'} at ${target.sourceName}`;

    // Extract registration URL if present
    const urlMatch = block.match(/https?:\/\/[^\s\])"']+/);
    const registrationUrl = urlMatch ? urlMatch[0] : target.url;

    events.push({
      title,
      description,
      start_date: foundDate.toISOString(),
      neighborhood: target.neighborhood,
      event_type: target.eventType,
      location_name: target.sourceName,
      registration_url: registrationUrl,
      source_url: target.url,
      source_name: target.sourceName,
    });
  }

  // Deduplicate by title similarity
  const uniqueEvents: any[] = [];
  for (const event of events) {
    const isDuplicate = uniqueEvents.some(
      e => e.title.toLowerCase() === event.title.toLowerCase() ||
           (e.title.length > 10 && event.title.toLowerCase().includes(e.title.toLowerCase().slice(0, 10)))
    );
    if (!isDuplicate) {
      uniqueEvents.push(event);
    }
  }

  return uniqueEvents.slice(0, 20); // Max 20 events per source
}

// Main handler
export async function GET(request: Request) {
  const url = new URL(request.url);
  
  // Check for manual trigger: ?manual=true&key=YOUR_KEY
  const isManual = url.searchParams.get('manual') === 'true';
  const manualKey = url.searchParams.get('key');
  const expectedKey = process.env.MANUAL_TRIGGER_KEY;
  
  // Verify authentication
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  const isValidCron = authHeader === `Bearer ${cronSecret}`;
  const isValidManual = isManual && manualKey === expectedKey;

  if (!isValidCron && !isValidManual && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!supabaseServiceKey) {
    return NextResponse.json(
      { error: 'Missing SUPABASE_SERVICE_ROLE_KEY' },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const results: { source: string; found: number; inserted: number; errors: string[] }[] = [];

  console.log(`[START] Scraping ${SCRAPE_TARGETS.length} sources...`);

  // Process all targets sequentially
  for (const target of SCRAPE_TARGETS) {
    const sourceResult = { source: target.sourceName, found: 0, inserted: 0, errors: [] as string[] };

    try {
      const events = await scrapeEventsFromUrl(target);
      sourceResult.found = events.length;

      for (const event of events) {
        // Generate JSON-LD schema
        const schemaJson = generateEventSchema(event);

        // Upsert using title + start_date for deduplication
        const { error } = await supabase
          .from('senior_events')
          .upsert(
            {
              ...event,
              schema_json: schemaJson,
              updated_at: new Date().toISOString(),
            },
            {
              onConflict: 'title,start_date',
              ignoreDuplicates: false,
            }
          );

        if (error) {
          sourceResult.errors.push(`Insert error: ${error.message}`);
        } else {
          sourceResult.inserted++;
        }
      }
    } catch (error) {
      sourceResult.errors.push(`Scrape error: ${error instanceof Error ? error.message : 'Unknown'}`);
    }

    results.push(sourceResult);

    // Small delay between sources to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  // Summary
  const totalFound = results.reduce((sum, r) => sum + r.found, 0);
  const totalInserted = results.reduce((sum, r) => sum + r.inserted, 0);
  const sourcesWithErrors = results.filter(r => r.errors.length > 0);

  console.log(`[COMPLETE] Found: ${totalFound}, Inserted: ${totalInserted}, Sources with errors: ${sourcesWithErrors.length}`);

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    summary: {
      totalSources: SCRAPE_TARGETS.length,
      totalFound,
      totalInserted,
      sourcesWithErrors: sourcesWithErrors.length,
    },
    results,
  });
}

// Support POST for Vercel Cron compatibility
export async function POST(request: Request) {
  return GET(request);
}
