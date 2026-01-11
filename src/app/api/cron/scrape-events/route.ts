import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Extended runtime for high-intensity scraping all 12 targets
export const maxDuration = 120; // 2 minutes for deep scraping
export const dynamic = 'force-dynamic';

// Firecrawl configuration
const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
const FIRECRAWL_BASE_URL = 'https://api.firecrawl.dev/v1';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hncgnxbooghjhpncujzx.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Event type mapping
type EventTypeEnum = 'community_hub' | 'medical_wellness' | 'luxury_showcase';

// All 12 high-intensity scrape targets
const SCRAPE_TARGETS: {
  url: string;
  sourceName: string;
  neighborhood: string;
  eventType: EventTypeEnum;
  isPdf?: boolean;
  selectors?: string[]; // CSS selectors to target
}[] = [
  // Community Hubs (Senior Centers)
  {
    url: 'https://www.cityofwestlake.org/o/cs/page/programs',
    sourceName: 'Westlake Senior Services',
    neighborhood: 'Westlake',
    eventType: 'community_hub',
    selectors: ['.rec1-event', '.event-item', '.program-item'],
  },
  {
    url: 'https://www.beachwoodohio.com/151/Senior-Programs',
    sourceName: 'Beachwood Senior Programs',
    neighborhood: 'Beachwood',
    eventType: 'community_hub',
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
  
  // Rocky River PDF (Quill Newsletter)
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

// High-intensity scrape with browser actions
async function scrapeEventsFromUrl(target: typeof SCRAPE_TARGETS[0]): Promise<any[]> {
  if (!FIRECRAWL_API_KEY) {
    console.log(`[SKIP] No Firecrawl API key, skipping ${target.sourceName}`);
    return [];
  }

  try {
    console.log(`[SCRAPE] Starting high-intensity: ${target.sourceName} - ${target.url}`);

    // Build request body based on source type
    const requestBody: any = {
      url: target.url,
      formats: ['markdown', 'html'], // Include HTML for hidden elements
      onlyMainContent: false, // Get all content including iframes
      waitFor: 7000, // Extended wait for dynamic content
      mobile: true, // Mobile view often has cleaner layouts
      actions: [
        { type: 'wait', milliseconds: 5000 },
        { type: 'scroll', direction: 'down' },
        { type: 'wait', milliseconds: 2000 },
        { type: 'scroll', direction: 'down' },
        { type: 'scrape' },
      ],
    };

    // PDF parsing for Rocky River Quill
    if (target.isPdf) {
      requestBody.formats = ['markdown'];
      requestBody.parsers = [{ type: 'pdf', maxPages: 10 }];
      delete requestBody.actions; // PDFs don't need browser actions
      delete requestBody.mobile;
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
    
    // Log content length for debugging
    console.log(`[CONTENT] ${target.sourceName}: ${markdown.length} chars markdown, ${html.length} chars html`);

    // Extract events from both markdown and HTML
    const events = extractEventsFromContent(markdown, html, target);
    console.log(`[SUCCESS] ${target.sourceName}: Found ${events.length} events`);

    return events;
  } catch (error) {
    console.error(`[ERROR] Scraping ${target.sourceName}:`, error);
    return [];
  }
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
    // Full month names
    /(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+(?:2025|2026)/gi,
    // Abbreviated months
    /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\.?\s+\d{1,2},?\s+(?:2025|2026)/gi,
    // MM/DD/YYYY or MM/DD/YY
    /(?:0?[1-9]|1[0-2])\/(?:0?[1-9]|[12]\d|3[01])\/(?:2025|2026|25|26)/g,
    // YYYY-MM-DD (ISO)
    /(?:2025|2026)-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])/g,
    // Day of week + Month Date
    /(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}/gi,
  ];

  // Time patterns
  const timePattern = /\d{1,2}:\d{2}\s*(?:AM|PM|am|pm|a\.m\.|p\.m\.)?/gi;

  // Combine content sources, prioritizing markdown
  const content = markdown + '\n\n' + cleanHtml(html);
  
  // Look for rec1-event and iframe content specifically
  const iframeContent = extractIframeContent(html);
  const rec1Events = extractRec1Events(html);
  
  // Split content into potential event blocks
  const blocks = content.split(/\n\n+|\r\n\r\n+|(?=#{1,3}\s)|(?=\*\*[A-Z])/);
  
  // Add iframe and rec1 blocks
  blocks.push(...iframeContent, ...rec1Events);

  for (const block of blocks) {
    if (block.length < 15 || block.length > 3000) continue;

    // Look for dates in the block
    let foundDate: Date | null = null;
    for (const pattern of datePatterns) {
      const matches = block.match(pattern);
      if (matches && matches.length > 0) {
        for (const match of matches) {
          let parsed: Date;
          
          // Handle 2-digit years
          let dateStr = match;
          if (/\/2[56]$/.test(dateStr)) {
            dateStr = dateStr.replace(/\/(\d{2})$/, '/20$1');
          }
          
          parsed = new Date(dateStr);
          
          // Try alternative parsing for day-of-week format
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

    // Extract time if available
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

    // Extract title with multiple strategies
    let title = '';
    
    // Strategy 1: Headers
    const headerMatch = block.match(/^#+\s*(.+?)(?:\n|$)/m);
    if (headerMatch) {
      title = headerMatch[1];
    }
    
    // Strategy 2: Bold text
    if (!title || title.length < 5) {
      const boldMatch = block.match(/\*\*(.{5,100}?)\*\*/);
      if (boldMatch) title = boldMatch[1];
    }
    
    // Strategy 3: First substantial line
    if (!title || title.length < 5) {
      const lines = block.split('\n').filter(l => l.trim().length > 5);
      for (const line of lines) {
        // Skip date-only lines
        if (!/^\d{1,2}[\/\-]/.test(line.trim()) && !/^(?:January|Feb|Mar)/i.test(line.trim())) {
          title = line.trim();
          break;
        }
      }
    }

    // Clean title
    title = title
      .replace(/[#*_\[\]]/g, '')
      .replace(/\s+/g, ' ')
      .replace(/^\d+[.\)]\s*/, '') // Remove list numbering
      .trim()
      .slice(0, 200);

    if (!title || title.length < 5) continue;

    // Skip non-event content
    const skipKeywords = [
      'copyright', 'privacy', 'terms', 'login', 'sign up', 'subscribe', 
      'cookie', 'footer', 'header', 'navigation', 'menu', 'search',
      'contact us', 'about us', 'home', 'site map', 'accessibility'
    ];
    if (skipKeywords.some(kw => title.toLowerCase().includes(kw))) continue;

    // Senior-related keyword boost (helps filter relevant events)
    const seniorKeywords = [
      'senior', 'elder', 'aging', 'retirement', 'medicare', 'social security',
      'wellness', 'fitness', 'health', 'lunch', 'bingo', 'cards', 'crafts',
      'trip', 'tour', 'class', 'workshop', 'seminar', 'support', 'group',
      'exercise', 'yoga', 'tai chi', 'dance', 'music', 'art', 'movie'
    ];
    const hasSeniorKeyword = seniorKeywords.some(kw => 
      block.toLowerCase().includes(kw)
    );

    // Extract description
    let description = block
      .replace(/^#+\s*.+?\n/m, '') // Remove header
      .replace(/\*\*(.+?)\*\*/g, '$1') // Clean bold
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

    // Extract registration URL if present
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
      _relevanceScore: hasSeniorKeyword ? 2 : 1, // Internal scoring
    });
  }

  // Sort by relevance and deduplicate
  events.sort((a, b) => (b._relevanceScore || 0) - (a._relevanceScore || 0));
  
  const uniqueEvents: any[] = [];
  for (const event of events) {
    delete event._relevanceScore;
    
    const isDuplicate = uniqueEvents.some(e => {
      const titleLower = e.title.toLowerCase();
      const eventTitleLower = event.title.toLowerCase();
      
      // Exact match
      if (titleLower === eventTitleLower) return true;
      
      // Significant overlap (first 20 chars)
      if (titleLower.length > 20 && eventTitleLower.length > 20) {
        if (titleLower.slice(0, 20) === eventTitleLower.slice(0, 20)) return true;
      }
      
      // Same date and similar title start
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

  return uniqueEvents.slice(0, 25); // Max 25 events per source
}

// Extract content from rec1-event containers (common in city websites)
function extractRec1Events(html: string): string[] {
  const blocks: string[] = [];
  
  // Look for rec1 event containers
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
  
  // Also look for event-item, event-card patterns
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

// Extract content from iframes (embedded calendars)
function extractIframeContent(html: string): string[] {
  const blocks: string[] = [];
  
  // Look for iframe src URLs we might want to follow
  const iframePattern = /<iframe[^>]*src="([^"]+)"[^>]*>/gi;
  let match;
  
  while ((match = iframePattern.exec(html)) !== null) {
    // Log iframe URLs for debugging
    console.log(`[IFRAME] Found embedded content: ${match[1]}`);
  }
  
  return blocks;
}

// Clean HTML to extract text content
function cleanHtml(html: string): string {
  return html
    // Remove scripts and styles
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    // Remove HTML tags but keep content
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    // Clean up whitespace
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

// Main handler
export async function GET(request: Request) {
  const url = new URL(request.url);
  
  // Check for manual trigger: ?manual=true&key=YOUR_KEY
  const isManual = url.searchParams.get('manual') === 'true';
  const manualKey = url.searchParams.get('key');
  const expectedKey = process.env.MANUAL_TRIGGER_KEY;
  
  // Force fresh pull for manual triggers (bypass any edge caching)
  const headers: HeadersInit = {};
  if (isManual) {
    headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
  }
  
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

  console.log(`[START] High-intensity scraping ${SCRAPE_TARGETS.length} sources...`);
  console.log(`[MODE] ${isManual ? 'Manual trigger (fresh pull)' : 'Cron job'}`);

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
    console.log(`[PROGRESS] ${target.sourceName}: ${sourceResult.found} found, ${sourceResult.inserted} inserted`);

    // Delay between sources to avoid rate limits (longer for high-intensity)
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Summary
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
}

// Support POST for Vercel Cron compatibility
export async function POST(request: Request) {
  return GET(request);
}
