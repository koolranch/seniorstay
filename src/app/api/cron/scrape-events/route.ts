import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Extended runtime for scraping all 10 targets
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

// Firecrawl configuration
const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
const FIRECRAWL_BASE_URL = 'https://api.firecrawl.dev/v1';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hncgnxbooghjhpncujzx.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// All 10 scrape targets with neighborhood mapping
const SCRAPE_TARGETS = [
  {
    url: 'https://attend.cuyahogalibrary.org/events?a=adults',
    sourceName: 'Cuyahoga County Library',
    neighborhood: 'Cleveland', // Regional, default to Cleveland
    eventType: 'community_event' as const,
  },
  {
    url: 'https://www.cityofwestlake.org/calendar',
    sourceName: 'City of Westlake',
    neighborhood: 'Westlake',
    eventType: 'community_event' as const,
  },
  {
    url: 'https://www.beachwoodohio.com/calendar',
    sourceName: 'City of Beachwood',
    neighborhood: 'Beachwood',
    eventType: 'community_event' as const,
  },
  {
    url: 'https://cityofparma-oh.gov/calendar.aspx',
    sourceName: 'City of Parma',
    neighborhood: 'Parma',
    eventType: 'community_event' as const,
  },
  {
    url: 'https://www.solonohio.gov/1348/Senior-Center-Calendar',
    sourceName: 'Solon Senior Center',
    neighborhood: 'Solon',
    eventType: 'community_event' as const,
  },
  {
    url: 'https://mentorseniorcenter.com/programs-activities/',
    sourceName: 'Mentor Senior Center',
    neighborhood: 'Mentor',
    eventType: 'community_event' as const,
  },
  {
    url: 'https://www.lakewoodoh.gov/senior-services/',
    sourceName: 'Lakewood Senior Services',
    neighborhood: 'Lakewood',
    eventType: 'community_event' as const,
  },
  {
    url: 'https://www.rriver.com/senior-center',
    sourceName: 'Rocky River Senior Center',
    neighborhood: 'Rocky River',
    eventType: 'community_event' as const,
  },
  {
    url: 'https://www.benrose.org/events/',
    sourceName: 'Benjamin Rose Institute',
    neighborhood: 'Cleveland',
    eventType: 'expert_webinar' as const, // Often educational/expert content
  },
  {
    url: 'https://www.north-olmsted.com/senior-center/',
    sourceName: 'North Olmsted Senior Center',
    neighborhood: 'North Olmsted',
    eventType: 'community_event' as const,
  },
];

// Generate JSON-LD schema for an event
function generateEventSchema(event: {
  title: string;
  description: string;
  start_date: string;
  end_date?: string;
  neighborhood: string;
  location_name?: string;
  registration_url?: string;
  is_virtual?: boolean;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description,
    startDate: event.start_date,
    endDate: event.end_date || event.start_date,
    eventAttendanceMode: event.is_virtual
      ? 'https://schema.org/OnlineEventAttendanceMode'
      : 'https://schema.org/OfflineEventAttendanceMode',
    location: event.is_virtual
      ? {
          '@type': 'VirtualLocation',
          url: event.registration_url || '',
        }
      : {
          '@type': 'Place',
          name: event.location_name || `${event.neighborhood} Senior Center`,
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
        formats: ['markdown', 'html'],
        onlyMainContent: true,
        waitFor: 3000, // Wait for dynamic content
      }),
    });

    if (!response.ok) {
      console.error(`[ERROR] Firecrawl failed for ${target.sourceName}: ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    const content = data.data?.markdown || data.data?.html || '';

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
    // "January 15, 2026" or "Jan 15, 2026"
    /(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},?\s+\d{4}/gi,
    // "01/15/2026" or "1/15/26"
    /\d{1,2}\/\d{1,2}\/\d{2,4}/g,
    // "2026-01-15"
    /\d{4}-\d{2}-\d{2}/g,
  ];

  // Time patterns
  const timePattern = /\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?/gi;

  // Split content into potential event blocks (paragraphs, list items)
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

    // Extract title (first line or bold text)
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
    const skipKeywords = ['copyright', 'privacy', 'terms', 'login', 'sign up', 'subscribe'];
    if (skipKeywords.some(kw => title.toLowerCase().includes(kw))) continue;

    // Extract description
    const description = block
      .replace(titleMatch?.[0] || '', '')
      .replace(/[#*_]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 500);

    // Check if virtual
    const isVirtual = /virtual|online|zoom|webinar|teams|meet/i.test(block);

    // Extract registration URL if present
    const urlMatch = block.match(/https?:\/\/[^\s\])"']+/);
    const registrationUrl = urlMatch ? urlMatch[0] : target.url;

    events.push({
      title,
      description: description || `${target.eventType === 'expert_webinar' ? 'Expert webinar' : 'Community event'} at ${target.sourceName}`,
      start_date: foundDate.toISOString(),
      neighborhood: target.neighborhood,
      event_type: target.eventType,
      location_name: target.sourceName,
      registration_url: registrationUrl,
      is_virtual: isVirtual,
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
  // Verify authentication
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  const manualKey = process.env.MANUAL_TRIGGER_KEY;

  const isValidCron = authHeader === `Bearer ${cronSecret}`;
  const isValidManual = new URL(request.url).searchParams.get('key') === manualKey;

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

  // Process all targets (sequentially to avoid rate limits)
  for (const target of SCRAPE_TARGETS) {
    const sourceResult = { source: target.sourceName, found: 0, inserted: 0, errors: [] as string[] };

    try {
      const events = await scrapeEventsFromUrl(target);
      sourceResult.found = events.length;

      for (const event of events) {
        // Generate JSON-LD schema
        const schemaJson = generateEventSchema(event);

        // Upsert to prevent duplicates (using title + start_date)
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

    // Small delay between sources
    await new Promise(resolve => setTimeout(resolve, 1000));
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

// Also support POST for Vercel Cron compatibility
export async function POST(request: Request) {
  return GET(request);
}
