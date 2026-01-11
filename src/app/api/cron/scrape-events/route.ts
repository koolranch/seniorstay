import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * ============================================================================
 * AUTOMATED CRON DISABLED - January 2026
 * ============================================================================
 * Switching to manual boutique curation for higher lead quality.
 * 
 * The scraping functions below are preserved for manual triggering if needed.
 * To manually trigger: GET /api/cron/scrape-events?manual=true&key=[MANUAL_TRIGGER_KEY]
 * 
 * Current strategy: Hand-curated events seeded directly via Supabase MCP
 * for verified, high-intent senior events in Cleveland area.
 * ============================================================================
 */

// Extended runtime for high-intensity scraping all 12 targets
// export const maxDuration = 120; // 2 minutes for deep scraping - DISABLED
export const dynamic = 'force-dynamic';

// Firecrawl configuration
const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
const FIRECRAWL_BASE_URL = 'https://api.firecrawl.dev/v1';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hncgnxbooghjhpncujzx.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Event type mapping
type EventTypeEnum = 'community_hub' | 'medical_wellness' | 'luxury_showcase';

// All 12 high-intensity scrape targets with enhanced config
const SCRAPE_TARGETS: {
  url: string;
  sourceName: string;
  neighborhood: string;
  eventType: EventTypeEnum;
  isPdf?: boolean;
  extendedWait?: boolean; // For sites needing 8000ms wait
  clickSelectors?: string[]; // Session handling: buttons to click
  selectors?: string[];
}[] = [
  // Community Hubs (Senior Centers)
  {
    url: 'https://www.cityofwestlake.org/o/cs/page/programs',
    sourceName: 'Westlake Senior Services',
    neighborhood: 'Westlake',
    eventType: 'community_hub',
    extendedWait: true, // 8000ms for this portal
    clickSelectors: ['[data-tab="calendar"]', 'button:contains("Calendar")', 'a:contains("Activities")'],
    selectors: ['.rec1-event', '.event-item', '.program-item'],
  },
  {
    url: 'https://www.beachwoodohio.com/151/Senior-Programs',
    sourceName: 'Beachwood Senior Programs',
    neighborhood: 'Beachwood',
    eventType: 'community_hub',
    extendedWait: true, // 8000ms for this portal
    clickSelectors: ['button:contains("Calendar")', 'a:contains("Events")', '.calendar-tab'],
    selectors: ['.event-listing', '.program-card'],
  },
  {
    url: 'https://www.solonohio.gov/1156/SSC-Programming',
    sourceName: 'Solon Senior Center',
    neighborhood: 'Solon',
    eventType: 'community_hub',
    selectors: ['.event-item', '.calendar-event'],
  },
  {
    url: 'https://cityofparma-oh.gov/calendar.aspx',
    sourceName: 'Parma Senior Center',
    neighborhood: 'Parma',
    eventType: 'community_hub',
    selectors: ['.calendar-item', '.event-container'],
  },
  {
    url: 'https://www.orangerec.com/page/orange-senior-center',
    sourceName: 'Orange Senior Center',
    neighborhood: 'Orange/Pepper Pike',
    eventType: 'community_hub',
    selectors: ['.event-block', '.program-listing'],
  },
  {
    url: 'https://attend.cuyahogalibrary.org/events?a=adults',
    sourceName: 'Cuyahoga County Library',
    neighborhood: 'Regional',
    eventType: 'community_hub',
    selectors: ['.event-card', '.events-list-item', '[data-event]'],
  },
  
  // Rocky River PDF (Quill Newsletter) - Enhanced PDF extraction
  {
    url: 'https://www.rockyriverohio.gov/s/January-Quill_Final.pdf',
    sourceName: 'Rocky River (The Quill)',
    neighborhood: 'Rocky River',
    eventType: 'community_hub',
    isPdf: true,
  },

  // Medical & Wellness (Hospital Systems)
  {
    url: 'https://www.uhhospitals.org/events',
    sourceName: 'UH Age Well Events',
    neighborhood: 'Regional',
    eventType: 'medical_wellness',
    clickSelectors: ['button:contains("Senior")', 'a:contains("Wellness")'],
    selectors: ['.event-item', '.events-container', '[data-event-id]'],
  },
  {
    url: 'https://my.clevelandclinic.org/departments/wellness/patient-resources/events',
    sourceName: 'Cleveland Clinic Wellness',
    neighborhood: 'Regional',
    eventType: 'medical_wellness',
    selectors: ['.event-listing', '.wellness-event', '.class-item'],
  },

  // Luxury Showcases (Senior Living Communities)
  {
    url: 'https://vitaliawestlake.com/event-entertainment/',
    sourceName: 'Vitalia Westlake',
    neighborhood: 'Westlake',
    eventType: 'luxury_showcase',
    selectors: ['.event-item', '.entertainment-event', '.calendar-entry'],
  },
  {
    url: 'https://beachwood.roseseniorliving.com/about/news-events/',
    sourceName: 'Rose Senior Living',
    neighborhood: 'Beachwood',
    eventType: 'luxury_showcase',
    selectors: ['.news-event', '.event-post', '.event-card'],
  },
  {
    url: 'https://thenormandy.com/lifestyle/activities/',
    sourceName: 'The Normandy',
    neighborhood: 'Rocky River',
    eventType: 'luxury_showcase',
    selectors: ['.activity-item', '.event-listing', '.lifestyle-event'],
  },
];

// Extraction prompt for LLM-assisted parsing
const EXTRACTION_PROMPT = `Identify any event mentions in this content. For each event found, extract:
- title: The name of the event
- date: The date in YYYY-MM-DD format (assume 2026 if year not specified)
- time: The time if available (HH:MM AM/PM format)
- description: A brief summary of the event
- neighborhood: The location/area if mentioned

Focus on senior-related events: fitness classes, social gatherings, health screenings, trips, workshops, etc.
Return events as a JSON array.`;

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

// High-intensity scrape with browser actions and session handling
async function scrapeEventsFromUrl(target: typeof SCRAPE_TARGETS[0]): Promise<any[]> {
  if (!FIRECRAWL_API_KEY) {
    console.log(`[SKIP] No Firecrawl API key, skipping ${target.sourceName}`);
    return [];
  }

  try {
    console.log(`[SCRAPE] Starting high-intensity: ${target.sourceName} - ${target.url}`);

    // Determine wait time based on target config
    const waitTime = target.extendedWait ? 8000 : 7000;

    // Build browser actions with session handling
    const actions: any[] = [
      { type: 'wait', milliseconds: 5000 },
    ];

    // Add click actions for session handling (try to click Calendar/Activities buttons)
    if (target.clickSelectors && target.clickSelectors.length > 0) {
      // Try each selector - Firecrawl will skip if not found
      for (const selector of target.clickSelectors) {
        actions.push({ type: 'click', selector });
        actions.push({ type: 'wait', milliseconds: 2000 });
      }
    }

    // Standard scroll and scrape
    actions.push(
      { type: 'scroll', direction: 'down' },
      { type: 'wait', milliseconds: 2000 },
      { type: 'scroll', direction: 'down' },
      { type: 'scrape' }
    );

    // Build request body based on source type
    const requestBody: any = {
      url: target.url,
      formats: ['markdown', 'html'],
      onlyMainContent: false,
      waitFor: waitTime,
      mobile: true,
      actions,
    };

    // PDF parsing for Rocky River Quill - Enhanced with LLM extraction
    if (target.isPdf) {
      requestBody.formats = [
        'markdown',
        {
          type: 'json',
          prompt: EXTRACTION_PROMPT,
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
                    time: { type: 'string' },
                    description: { type: 'string' },
                    neighborhood: { type: 'string' },
                  },
                  required: ['title', 'date'],
                },
              },
            },
          },
        },
      ];
      requestBody.parsers = [{ type: 'pdf', maxPages: 15 }];
      delete requestBody.actions;
      delete requestBody.mobile;
      delete requestBody.waitFor;
    }

    const response = await fetch(`${FIRECRAWL_BASE_URL}/scrape`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[ERROR] Firecrawl failed for ${target.sourceName}: ${response.status} - ${errorText}`);
      return [];
    }

    const data = await response.json();
    const markdown = data.data?.markdown || '';
    const html = data.data?.html || '';
    const extractedJson = data.data?.json; // LLM-extracted JSON for PDFs
    
    console.log(`[CONTENT] ${target.sourceName}: ${markdown.length} chars markdown, ${html.length} chars html`);

    // For PDFs, use LLM-extracted events if available
    if (target.isPdf && extractedJson?.events && Array.isArray(extractedJson.events)) {
      console.log(`[PDF] ${target.sourceName}: LLM extracted ${extractedJson.events.length} events`);
      return extractedJson.events.map((e: any) => formatExtractedEvent(e, target));
    }

    // For web pages, extract events from markdown and HTML
    const events = extractEventsFromContent(markdown, html, target);
    
    // If initial scrape yields 0, log for debugging
    if (events.length === 0) {
      console.log(`[ZERO] ${target.sourceName}: No events found. Content preview: ${markdown.slice(0, 500)}`);
    }
    
    console.log(`[SUCCESS] ${target.sourceName}: Found ${events.length} events`);
    return events;
  } catch (error) {
    console.error(`[ERROR] Scraping ${target.sourceName}:`, error);
    return [];
  }
}

// Format LLM-extracted events (from PDF)
function formatExtractedEvent(extracted: any, target: typeof SCRAPE_TARGETS[0]): any {
  // Parse date - assume 2026 if not specified
  let startDate: Date;
  try {
    const dateStr = extracted.date || '';
    if (dateStr.includes('2026') || dateStr.includes('2025')) {
      startDate = new Date(dateStr);
    } else {
      startDate = new Date(`${dateStr} 2026`);
    }
    
    // Add time if provided
    if (extracted.time) {
      const timeMatch = extracted.time.match(/(\d{1,2}):?(\d{2})?\s*(AM|PM|am|pm)?/);
      if (timeMatch) {
        let hours = parseInt(timeMatch[1]);
        const minutes = parseInt(timeMatch[2] || '0');
        const period = timeMatch[3]?.toLowerCase();
        
        if (period === 'pm' && hours < 12) hours += 12;
        if (period === 'am' && hours === 12) hours = 0;
        
        startDate.setHours(hours, minutes);
      }
    }
  } catch {
    startDate = new Date(); // Fallback to now
    startDate.setMonth(startDate.getMonth() + 1); // Default to next month
  }

  return {
    title: extracted.title?.slice(0, 200) || 'Senior Event',
    description: extracted.description?.slice(0, 500) || `Senior event at ${target.sourceName} in ${target.neighborhood}.`,
    start_date: startDate.toISOString(),
    neighborhood: extracted.neighborhood || target.neighborhood,
    event_type: target.eventType,
    location_name: target.sourceName,
    registration_url: target.url,
    source_url: target.url,
    source_name: target.sourceName,
    is_virtual: false,
  };
}

// Enhanced event extraction with HTML parsing for hidden elements
function extractEventsFromContent(
  markdown: string, 
  html: string, 
  target: typeof SCRAPE_TARGETS[0]
): any[] {
  const events: any[] = [];
  const now = new Date();
  const threeMonthsFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

  // Common date patterns (2025-2026 focused)
  const datePatterns = [
    /(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+(?:2025|2026)/gi,
    /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\.?\s+\d{1,2},?\s+(?:2025|2026)/gi,
    /(?:0?[1-9]|1[0-2])\/(?:0?[1-9]|[12]\d|3[01])\/(?:2025|2026|25|26)/g,
    /(?:2025|2026)-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])/g,
    /(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}/gi,
  ];

  const timePattern = /\d{1,2}:\d{2}\s*(?:AM|PM|am|pm|a\.m\.|p\.m\.)?/gi;

  const content = markdown + '\n\n' + cleanHtml(html);
  const iframeContent = extractIframeContent(html);
  const rec1Events = extractRec1Events(html);
  
  const blocks = content.split(/\n\n+|\r\n\r\n+|(?=#{1,3}\s)|(?=\*\*[A-Z])/);
  blocks.push(...iframeContent, ...rec1Events);

  for (const block of blocks) {
    if (block.length < 15 || block.length > 3000) continue;

    let foundDate: Date | null = null;
    for (const pattern of datePatterns) {
      const matches = block.match(pattern);
      if (matches && matches.length > 0) {
        for (const match of matches) {
          let dateStr = match;
          if (/\/2[56]$/.test(dateStr)) {
            dateStr = dateStr.replace(/\/(\d{2})$/, '/20$1');
          }
          
          let parsed = new Date(dateStr);
          
          if (isNaN(parsed.getTime())) {
            const monthDayMatch = match.match(/(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}/i);
            if (monthDayMatch) {
              parsed = new Date(`${monthDayMatch[0]}, 2026`);
            }
          }
          
          if (!isNaN(parsed.getTime()) && parsed > now && parsed < threeMonthsFromNow) {
            foundDate = parsed;
            break;
          }
        }
        if (foundDate) break;
      }
    }

    if (!foundDate) continue;

    const timeMatches = block.match(timePattern);
    if (timeMatches && timeMatches.length > 0) {
      const timeStr = timeMatches[0].replace(/\./g, '');
      const timeParts = timeStr.replace(/\s*(AM|PM|am|pm)/i, '').split(':');
      let hour = parseInt(timeParts[0]);
      const minutes = parseInt(timeParts[1]) || 0;
      
      if (timeStr.toLowerCase().includes('pm') && hour < 12) hour += 12;
      if (timeStr.toLowerCase().includes('am') && hour === 12) hour = 0;
      
      foundDate.setHours(hour, minutes);
    }

    let title = '';
    const headerMatch = block.match(/^#+\s*(.+?)(?:\n|$)/m);
    if (headerMatch) title = headerMatch[1];
    
    if (!title || title.length < 5) {
      const boldMatch = block.match(/\*\*(.{5,100}?)\*\*/);
      if (boldMatch) title = boldMatch[1];
    }
    
    if (!title || title.length < 5) {
      const lines = block.split('\n').filter(l => l.trim().length > 5);
      for (const line of lines) {
        if (!/^\d{1,2}[\/\-]/.test(line.trim()) && !/^(?:January|Feb|Mar)/i.test(line.trim())) {
          title = line.trim();
          break;
        }
      }
    }

    title = title
      .replace(/[#*_\[\]]/g, '')
      .replace(/\s+/g, ' ')
      .replace(/^\d+[.\)]\s*/, '')
      .trim()
      .slice(0, 200);

    if (!title || title.length < 5) continue;

    const skipKeywords = [
      'copyright', 'privacy', 'terms', 'login', 'sign up', 'subscribe', 
      'cookie', 'footer', 'header', 'navigation', 'menu', 'search',
      'contact us', 'about us', 'home', 'site map', 'accessibility'
    ];
    if (skipKeywords.some(kw => title.toLowerCase().includes(kw))) continue;

    const seniorKeywords = [
      'senior', 'elder', 'aging', 'retirement', 'medicare', 'social security',
      'wellness', 'fitness', 'health', 'lunch', 'bingo', 'cards', 'crafts',
      'trip', 'tour', 'class', 'workshop', 'seminar', 'support', 'group',
      'exercise', 'yoga', 'tai chi', 'dance', 'music', 'art', 'movie'
    ];
    const hasSeniorKeyword = seniorKeywords.some(kw => block.toLowerCase().includes(kw));

    let description = block
      .replace(/^#+\s*.+?\n/m, '')
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/[#*_\[\]]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 500);

    if (!description || description.length < 10) {
      description = `${target.eventType === 'medical_wellness' 
        ? 'Health and wellness event' 
        : target.eventType === 'luxury_showcase' 
          ? 'Community showcase event' 
          : 'Senior community event'} at ${target.sourceName} in ${target.neighborhood}.`;
    }

    const urlMatch = block.match(/https?:\/\/[^\s\])"'<>]+/);
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
      is_virtual: false,
      _relevanceScore: hasSeniorKeyword ? 2 : 1,
    });
  }

  events.sort((a, b) => (b._relevanceScore || 0) - (a._relevanceScore || 0));
  
  const uniqueEvents: any[] = [];
  for (const event of events) {
    delete event._relevanceScore;
    
    const isDuplicate = uniqueEvents.some(e => {
      const titleLower = e.title.toLowerCase();
      const eventTitleLower = event.title.toLowerCase();
      
      if (titleLower === eventTitleLower) return true;
      
      if (titleLower.length > 20 && eventTitleLower.length > 20) {
        if (titleLower.slice(0, 20) === eventTitleLower.slice(0, 20)) return true;
      }
      
      if (e.start_date === event.start_date && 
          titleLower.slice(0, 10) === eventTitleLower.slice(0, 10)) {
        return true;
      }
      
      return false;
    });
    
    if (!isDuplicate) {
      uniqueEvents.push(event);
    }
  }

  return uniqueEvents.slice(0, 25);
}

function extractRec1Events(html: string): string[] {
  const blocks: string[] = [];
  
  const rec1Pattern = /<div[^>]*class="[^"]*rec1-event[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;
  let match;
  
  while ((match = rec1Pattern.exec(html)) !== null) {
    const content = match[1]
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (content.length > 20) {
      blocks.push(content);
    }
  }
  
  const eventPatterns = [
    /<div[^>]*class="[^"]*event-item[^"]*"[^>]*>([\s\S]*?)<\/div>/gi,
    /<div[^>]*class="[^"]*event-card[^"]*"[^>]*>([\s\S]*?)<\/div>/gi,
    /<article[^>]*class="[^"]*event[^"]*"[^>]*>([\s\S]*?)<\/article>/gi,
    /<li[^>]*class="[^"]*event[^"]*"[^>]*>([\s\S]*?)<\/li>/gi,
  ];
  
  for (const pattern of eventPatterns) {
    while ((match = pattern.exec(html)) !== null) {
      const content = match[1]
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      if (content.length > 20) {
        blocks.push(content);
      }
    }
  }
  
  return blocks;
}

function extractIframeContent(html: string): string[] {
  const blocks: string[] = [];
  const iframePattern = /<iframe[^>]*src="([^"]+)"[^>]*>/gi;
  let match;
  
  while ((match = iframePattern.exec(html)) !== null) {
    console.log(`[IFRAME] Found embedded content: ${match[1]}`);
  }
  
  return blocks;
}

function cleanHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

// Main handler
export async function GET(request: Request) {
  /**
   * ============================================================================
   * AUTOMATED SCRAPING DISABLED - January 2026
   * ============================================================================
   * Returning status message instead of running scraper.
   * Events are now manually curated via Supabase MCP for higher lead quality.
   * 
   * To re-enable: Uncomment the scraping logic below and maxDuration export.
   * ============================================================================
   */
  
  return NextResponse.json({
    success: false,
    message: 'Automated cron disabled Jan 2026. Switching to manual boutique curation for higher lead quality.',
    timestamp: new Date().toISOString(),
    status: 'disabled',
    note: 'Events are now manually curated via Supabase MCP. Contact admin to re-enable automated scraping.',
  }, { status: 200 });

  /* ============================================================================
   * ORIGINAL SCRAPING LOGIC - PRESERVED FOR MANUAL USE IF NEEDED
   * ============================================================================
   * To re-enable automated scraping:
   * 1. Remove the return statement above
   * 2. Uncomment maxDuration export at top of file
   * 3. Uncomment the cron entry in vercel.json
   * ============================================================================
  
  const url = new URL(request.url);
  
  const isManual = url.searchParams.get('manual') === 'true';
  const manualKey = url.searchParams.get('key');
  const expectedKey = process.env.MANUAL_TRIGGER_KEY;
  
  const headers: HeadersInit = {};
  if (isManual) {
    headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
  }
  
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

  console.log(`[START] High-intensity scraping ${SCRAPE_TARGETS.length} sources...`);
  console.log(`[MODE] ${isManual ? 'Manual trigger (fresh pull)' : 'Cron job'}`);

  for (const target of SCRAPE_TARGETS) {
    const sourceResult = { source: target.sourceName, found: 0, inserted: 0, errors: [] as string[] };

    try {
      const events = await scrapeEventsFromUrl(target);
      sourceResult.found = events.length;

      for (const event of events) {
        const schemaJson = generateEventSchema(event);

        // Upsert using composite key [title, start_date] for deduplication
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
    console.log(`[PROGRESS] ${target.sourceName}: ${sourceResult.found} found, ${sourceResult.inserted} inserted`);

    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  const totalFound = results.reduce((sum, r) => sum + r.found, 0);
  const totalInserted = results.reduce((sum, r) => sum + r.inserted, 0);
  const sourcesWithEvents = results.filter(r => r.found > 0);
  const sourcesWithErrors = results.filter(r => r.errors.length > 0);

  console.log(`[COMPLETE] Found: ${totalFound}, Inserted: ${totalInserted}`);
  console.log(`[COMPLETE] Sources with events: ${sourcesWithEvents.length}/${SCRAPE_TARGETS.length}`);

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    mode: isManual ? 'manual' : 'cron',
    summary: {
      totalSources: SCRAPE_TARGETS.length,
      sourcesWithEvents: sourcesWithEvents.length,
      totalFound,
      totalInserted,
      sourcesWithErrors: sourcesWithErrors.length,
    },
    results,
  }, { headers });
  
  */ // END OF COMMENTED SCRAPING LOGIC
}

export async function POST(request: Request) {
  return GET(request);
}
