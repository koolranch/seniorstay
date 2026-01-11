/**
 * Cleveland Senior Events Scraper
 * 
 * Automated scraping of senior events from local sources:
 * - Cuyahoga County Library
 * - City of Westlake
 * - City of Beachwood
 * - Parma Senior Center
 * 
 * Run weekly via cron or Vercel scheduled function
 */

import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://hncgnxbooghjhpncujzx.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

// Initialize Supabase client with service role for inserts
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Firecrawl API configuration
const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY || '';
const FIRECRAWL_API_URL = 'https://api.firecrawl.dev/v1';

// Event source configurations
interface EventSource {
  name: string;
  url: string;
  neighborhood: string | null;
  eventType: 'community_event' | 'expert_webinar';
  selectors: {
    eventContainer: string;
    title: string;
    date: string;
    description: string;
    location?: string;
    link?: string;
  };
}

const EVENT_SOURCES: EventSource[] = [
  {
    name: 'Cuyahoga County Library',
    url: 'https://cuyahogalibrary.org/events?category=Seniors',
    neighborhood: null, // Multi-location
    eventType: 'community_event',
    selectors: {
      eventContainer: '.event-card, .event-item, article',
      title: 'h2, h3, .event-title',
      date: '.event-date, .date, time',
      description: '.event-description, .description, p',
      location: '.event-location, .location',
      link: 'a[href*="event"]',
    },
  },
  {
    name: 'City of Westlake',
    url: 'https://www.cityofwestlake.org/calendar',
    neighborhood: 'Westlake',
    eventType: 'community_event',
    selectors: {
      eventContainer: '.calendar-event, .event-item, .list-item',
      title: 'h2, h3, .event-title, .title',
      date: '.event-date, .date, time',
      description: '.event-description, .description',
      location: '.location, .venue',
      link: 'a',
    },
  },
  {
    name: 'City of Beachwood',
    url: 'https://www.beachwoodohio.com/calendar',
    neighborhood: 'Beachwood',
    eventType: 'community_event',
    selectors: {
      eventContainer: '.calendar-item, .event, article',
      title: 'h2, h3, .title',
      date: '.date, time, .event-date',
      description: '.description, .summary, p',
      location: '.location, .venue',
      link: 'a',
    },
  },
  {
    name: 'Parma Senior Center',
    url: 'https://www.cityofparma-oh.gov/senior-center/calendar',
    neighborhood: 'Parma',
    eventType: 'community_event',
    selectors: {
      eventContainer: '.event, .calendar-event, article',
      title: 'h2, h3, .event-title',
      date: '.date, time',
      description: '.description, .details, p',
      location: '.location',
      link: 'a',
    },
  },
];

// Hospital keywords for medical-intent SEO boost
const HOSPITAL_KEYWORDS = [
  'Cleveland Clinic',
  'St. John Medical',
  'St. John West Shore',
  'University Hospitals',
  'UH',
  'MetroHealth',
  'Southwest General',
  'Fairview Hospital',
];

interface ScrapedEvent {
  title: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  neighborhood: string | null;
  event_type: 'community_event' | 'expert_webinar';
  location_name: string | null;
  location_url: string | null;
  is_virtual: boolean;
  image_url: string | null;
  source_url: string;
  source_name: string;
}

/**
 * Generate JSON-LD Schema for an event
 */
function generateEventSchema(event: ScrapedEvent): object {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description || `Senior event in Cleveland area: ${event.title}`,
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
  };

  // Add location based on virtual/in-person
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

  // Add image if available
  if (event.image_url) {
    schema.image = event.image_url;
  }

  // Add audience
  schema.audience = {
    '@type': 'Audience',
    audienceType: 'Seniors',
  };

  // Add area served for local SEO
  schema.areaServed = {
    '@type': 'City',
    name: event.neighborhood || 'Cleveland',
    containedInPlace: {
      '@type': 'State',
      name: 'Ohio',
    },
  };

  return schema;
}

/**
 * Parse date string into ISO format
 */
function parseEventDate(dateString: string): string | null {
  if (!dateString) return null;
  
  try {
    // Clean up the date string
    const cleaned = dateString.trim().replace(/\s+/g, ' ');
    
    // Try to parse various date formats
    const date = new Date(cleaned);
    
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
    
    // Try common formats manually
    const patterns = [
      // "January 15, 2026 at 2:00 PM"
      /(\w+)\s+(\d{1,2}),?\s+(\d{4})\s+(?:at\s+)?(\d{1,2}):(\d{2})\s*(AM|PM)?/i,
      // "01/15/2026 2:00 PM"
      /(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})\s*(AM|PM)?/i,
      // "2026-01-15T14:00"
      /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/,
    ];
    
    for (const pattern of patterns) {
      const match = cleaned.match(pattern);
      if (match) {
        const parsedDate = new Date(cleaned);
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate.toISOString();
        }
      }
    }
    
    return null;
  } catch {
    console.error('Failed to parse date:', dateString);
    return null;
  }
}

/**
 * Check if event description contains hospital keywords
 */
function containsHospitalKeywords(text: string): boolean {
  const lowerText = text.toLowerCase();
  return HOSPITAL_KEYWORDS.some(keyword => 
    lowerText.includes(keyword.toLowerCase())
  );
}

/**
 * Determine if event is virtual based on content
 */
function isVirtualEvent(title: string, description: string): boolean {
  const text = `${title} ${description}`.toLowerCase();
  const virtualKeywords = ['virtual', 'online', 'webinar', 'zoom', 'video call', 'livestream', 'remote'];
  return virtualKeywords.some(keyword => text.includes(keyword));
}

/**
 * Scrape events from a single source using Firecrawl
 */
async function scrapeSource(source: EventSource): Promise<ScrapedEvent[]> {
  console.log(`Scraping events from: ${source.name}`);
  
  try {
    // Use Firecrawl to scrape the page
    const response = await fetch(`${FIRECRAWL_API_URL}/scrape`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
      },
      body: JSON.stringify({
        url: source.url,
        formats: ['markdown', 'html'],
        onlyMainContent: true,
        waitFor: 3000, // Wait for dynamic content
      }),
    });

    if (!response.ok) {
      throw new Error(`Firecrawl API error: ${response.statusText}`);
    }

    const data = await response.json();
    const markdown = data.data?.markdown || '';
    const html = data.data?.html || '';
    
    // Extract events using AI extraction
    const extractResponse = await fetch(`${FIRECRAWL_API_URL}/extract`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
      },
      body: JSON.stringify({
        urls: [source.url],
        prompt: `Extract all senior-related events from this page. For each event, extract:
          - title: The event name
          - date: The event date and time
          - description: A brief description
          - location: Where the event takes place
          - link: URL to more details if available
          
          Focus on events relevant to seniors, older adults, caregivers, or aging services.
          Return as a JSON array of events.`,
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
      console.warn(`Extraction failed for ${source.name}, falling back to markdown parsing`);
      return parseMarkdownForEvents(markdown, source);
    }

    const extractData = await extractResponse.json();
    const extractedEvents = extractData.data?.events || [];

    // Transform extracted events to our format
    const events: ScrapedEvent[] = extractedEvents
      .filter((e: { title?: string; date?: string }) => e.title && e.date)
      .map((e: { title: string; date: string; description?: string; location?: string; link?: string }) => {
        const startDate = parseEventDate(e.date);
        if (!startDate) return null;

        const description = e.description || '';
        const isWebinar = e.title.toLowerCase().includes('webinar') || 
                         containsHospitalKeywords(description);

        return {
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
      })
      .filter((e: ScrapedEvent | null): e is ScrapedEvent => e !== null);

    console.log(`Found ${events.length} events from ${source.name}`);
    return events;

  } catch (error) {
    console.error(`Error scraping ${source.name}:`, error);
    return [];
  }
}

/**
 * Fallback: Parse markdown content for events
 */
function parseMarkdownForEvents(markdown: string, source: EventSource): ScrapedEvent[] {
  const events: ScrapedEvent[] = [];
  
  // Simple pattern matching for event-like content
  const lines = markdown.split('\n');
  let currentEvent: Partial<ScrapedEvent> = {};
  
  for (const line of lines) {
    // Look for headers as potential event titles
    if (line.startsWith('## ') || line.startsWith('### ')) {
      if (currentEvent.title) {
        const startDate = parseEventDate(currentEvent.start_date || '');
        if (startDate) {
          events.push({
            title: currentEvent.title,
            description: currentEvent.description || null,
            start_date: startDate,
            end_date: null,
            neighborhood: source.neighborhood,
            event_type: source.eventType,
            location_name: source.name,
            location_url: source.url,
            is_virtual: false,
            image_url: null,
            source_url: source.url,
            source_name: source.name,
          });
        }
      }
      currentEvent = { title: line.replace(/^#+\s*/, '') };
    }
    
    // Look for date patterns
    const dateMatch = line.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4}/i);
    if (dateMatch && currentEvent.title) {
      currentEvent.start_date = dateMatch[0];
    }
    
    // Accumulate description
    if (currentEvent.title && !line.startsWith('#') && line.trim()) {
      currentEvent.description = (currentEvent.description || '') + ' ' + line.trim();
    }
  }
  
  return events;
}

/**
 * Save events to Supabase with deduplication
 */
async function saveEvents(events: ScrapedEvent[]): Promise<{ inserted: number; skipped: number }> {
  let inserted = 0;
  let skipped = 0;

  for (const event of events) {
    // Generate schema JSON
    const schemaJson = generateEventSchema(event);

    try {
      // Use upsert to handle duplicates
      const { error } = await supabase
        .from('senior_events')
        .upsert(
          {
            title: event.title,
            description: event.description,
            start_date: event.start_date,
            end_date: event.end_date,
            neighborhood: event.neighborhood,
            event_type: event.event_type,
            location_name: event.location_name,
            location_url: event.location_url,
            is_virtual: event.is_virtual,
            image_url: event.image_url,
            schema_json: schemaJson,
            source_url: event.source_url,
            source_name: event.source_name,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'title,start_date',
            ignoreDuplicates: false,
          }
        );

      if (error) {
        if (error.code === '23505') { // Unique violation
          skipped++;
        } else {
          console.error('Error saving event:', error);
        }
      } else {
        inserted++;
      }
    } catch (err) {
      console.error('Failed to save event:', event.title, err);
      skipped++;
    }
  }

  return { inserted, skipped };
}

/**
 * Clean up old events (past events older than 30 days)
 */
async function cleanupOldEvents(): Promise<number> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data, error } = await supabase
    .from('senior_events')
    .delete()
    .lt('end_date', thirtyDaysAgo.toISOString())
    .select('id');

  if (error) {
    console.error('Error cleaning up old events:', error);
    return 0;
  }

  return data?.length || 0;
}

/**
 * Main scraping function
 */
export async function scrapeSeniorEvents(): Promise<{
  success: boolean;
  totalEvents: number;
  inserted: number;
  skipped: number;
  cleaned: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let allEvents: ScrapedEvent[] = [];

  console.log('Starting Cleveland Senior Events scrape...');
  console.log(`Processing ${EVENT_SOURCES.length} sources`);

  // Scrape all sources
  for (const source of EVENT_SOURCES) {
    try {
      const events = await scrapeSource(source);
      allEvents = allEvents.concat(events);
    } catch (error) {
      const errorMsg = `Failed to scrape ${source.name}: ${error}`;
      console.error(errorMsg);
      errors.push(errorMsg);
    }
  }

  console.log(`Total events scraped: ${allEvents.length}`);

  // Save to Supabase
  const { inserted, skipped } = await saveEvents(allEvents);
  console.log(`Inserted: ${inserted}, Skipped: ${skipped}`);

  // Cleanup old events
  const cleaned = await cleanupOldEvents();
  console.log(`Cleaned up ${cleaned} old events`);

  return {
    success: errors.length === 0,
    totalEvents: allEvents.length,
    inserted,
    skipped,
    cleaned,
    errors,
  };
}

// CLI execution
if (require.main === module) {
  scrapeSeniorEvents()
    .then(result => {
      console.log('\n=== Scrape Complete ===');
      console.log(JSON.stringify(result, null, 2));
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Scrape failed:', error);
      process.exit(1);
    });
}

export default scrapeSeniorEvents;
