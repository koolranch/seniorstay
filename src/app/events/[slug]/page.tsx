import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  Users, 
  Award, 
  ArrowLeft, 
  ExternalLink, 
  Share2,
  Download,
  Phone,
  Heart,
  Home as HomeIcon,
  DollarSign,
  ChevronRight,
  AlertCircle,
  CalendarCheck,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  MapPinned,
  Shield,
  Building2
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { fetchQualityCommunitiesByCity } from '@/lib/fetch-featured-communities';
import GlobalHeader from '@/components/home/GlobalHeader';
import EventReminderForm from '@/components/events/EventReminderForm';
import Footer from '@/components/footer/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SeniorEvent } from '@/types/events';

/**
 * ============================================================================
 * DYNAMIC EVENT LANDING PAGES - Boutique Theme (Navy/Sage)
 * ============================================================================
 * SEO-optimized event detail pages with:
 * - Dynamic metadata for each event
 * - JSON-LD Event schema injection
 * - Lead-gen CTA for Cost Report download
 * - Related Events in neighborhood section
 * ============================================================================
 */

// Boutique Theme Colors
const NAVY = '#1e3a5f';
const SAGE_GREEN = '#8DA399';
const SAGE_LIGHT = '#a8c4b8';

// Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hncgnxbooghjhpncujzx.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuY2dueGJvb2doamhwbmN1anp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMTI0ODIsImV4cCI6MjA1OTc4ODQ4Mn0.mdAL87W0h4PN7Xu8ESjjDxzjW_H3YH55i-FqAE5SXcs';

// Generate URL-friendly slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove consecutive hyphens
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .slice(0, 80); // Limit length
}

// Fetch event by slug (matches against generated slug from title)
async function getEventBySlug(slug: string): Promise<SeniorEvent | null> {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Fetch all events and find matching slug
    const { data: events, error } = await supabase
      .from('senior_events')
      .select('*')
      .order('start_date', { ascending: true });
    
    if (error || !events) {
      console.error('Error fetching events:', error);
      return null;
    }
    
    // Find event where generated slug matches
    const event = events.find((e: SeniorEvent) => generateSlug(e.title) === slug);
    return event || null;
  } catch (error) {
    console.error('Error in getEventBySlug:', error);
    return null;
  }
}

// Fetch related events in the same neighborhood (upcoming only)
async function getRelatedEvents(neighborhood: string, excludeId: string): Promise<SeniorEvent[]> {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    const { data: events, error } = await supabase
      .from('senior_events')
      .select('*')
      .eq('neighborhood', neighborhood)
      .neq('id', excludeId)
      .gte('start_date', new Date().toISOString())
      .order('start_date', { ascending: true })
      .limit(4);
    
    if (error) {
      console.error('Error fetching related events:', error);
      return [];
    }
    
    return events || [];
  } catch (error) {
    console.error('Error in getRelatedEvents:', error);
    return [];
  }
}

// Fetch upcoming active events (for past event pages)
async function getUpcomingActiveEvents(excludeId: string): Promise<SeniorEvent[]> {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    const { data: events, error } = await supabase
      .from('senior_events')
      .select('*')
      .neq('id', excludeId)
      .gte('start_date', new Date().toISOString())
      .order('start_date', { ascending: true })
      .limit(6);
    
    if (error) {
      console.error('Error fetching upcoming events:', error);
      return [];
    }
    
    return events || [];
  } catch (error) {
    console.error('Error in getUpcomingActiveEvents:', error);
    return [];
  }
}

// Check if event is in the past
function isEventPast(startDate: string): boolean {
  return new Date(startDate) < new Date();
}

// Fetch nearby communities for "Communities Near This Event" section
async function getNearbyCommunities(neighborhood: string | null) {
  if (!neighborhood) return [];
  
  try {
    // Map event neighborhood names to city names used in Community table
    const cityMapping: Record<string, string> = {
      'Westlake': 'Westlake',
      'Beachwood': 'Beachwood',
      'Solon': 'Solon',
      'Rocky River': 'Rocky River',
      'Parma': 'Parma',
      'Regional': 'Cleveland', // For regional events, show Cleveland communities
      'Orange/Pepper Pike': 'Pepper Pike',
    };
    
    const city = cityMapping[neighborhood] || neighborhood;
    const communities = await fetchQualityCommunitiesByCity(city, 4, false);
    
    // If no communities found in exact city, try broader Cleveland area
    if (communities.length === 0 && neighborhood !== 'Regional') {
      return await fetchQualityCommunitiesByCity('Cleveland', 4, false);
    }
    
    return communities;
  } catch (error) {
    console.error('Error fetching nearby communities:', error);
    return [];
  }
}

// Neighborhood data for "Why Seniors Love It" section and FAQ generation
const NEIGHBORHOOD_DATA: Record<string, {
  avgCost: number;
  costComparison: string;
  hospitals: string[];
  highlight: string;
  communityCount: number;
}> = {
  'Westlake': {
    avgCost: 4200,
    costComparison: '12% below Cleveland metro average',
    hospitals: ['St. John Medical Center', 'Cleveland Clinic Avon'],
    highlight: 'Consistently ranked among Ohio\'s safest cities',
    communityCount: 8
  },
  'Beachwood': {
    avgCost: 5100,
    costComparison: '8% above Cleveland metro average',
    hospitals: ['UH Ahuja Medical Center', 'Cleveland Clinic'],
    highlight: 'Premier East Side location with upscale amenities',
    communityCount: 12
  },
  'Solon': {
    avgCost: 4800,
    costComparison: '2% above Cleveland metro average',
    hospitals: ['UH Ahuja Medical Center', 'Cleveland Clinic Hillcrest'],
    highlight: 'Top-rated schools and family-friendly atmosphere',
    communityCount: 6
  },
  'Rocky River': {
    avgCost: 4500,
    costComparison: '5% below Cleveland metro average',
    hospitals: ['Fairview Hospital', 'St. John Medical Center'],
    highlight: 'Charming lakefront community with walkable downtown',
    communityCount: 5
  },
  'Parma': {
    avgCost: 3800,
    costComparison: '20% below Cleveland metro average',
    hospitals: ['UH Parma Medical Center', 'MetroHealth'],
    highlight: 'Affordable options with strong community ties',
    communityCount: 10
  },
  'Regional': {
    avgCost: 4700,
    costComparison: 'Cleveland metro average',
    hospitals: ['Cleveland Clinic Main Campus', 'UH Cleveland Medical Center'],
    highlight: 'World-class healthcare within 30 minutes',
    communityCount: 150
  }
};

// Generate FAQ Schema for SEO (targets "People Also Ask")
function generateFAQSchema(event: SeniorEvent) {
  const neighborhood = event.neighborhood || 'Cleveland';
  const neighborhoodData = NEIGHBORHOOD_DATA[neighborhood] || NEIGHBORHOOD_DATA['Regional'];
  
  const faqs = [
    {
      question: `What senior living options are near ${event.location_name || neighborhood}?`,
      answer: `There are ${neighborhoodData.communityCount}+ senior living communities in ${neighborhood}, including assisted living, memory care, and independent living options. The average monthly cost is $${neighborhoodData.avgCost.toLocaleString()}, which is ${neighborhoodData.costComparison}. Guide for Seniors offers free placement assistance to help you find the right fit.`
    },
    {
      question: `How much does assisted living cost in ${neighborhood}, Ohio?`,
      answer: `Assisted living in ${neighborhood} averages $${neighborhoodData.avgCost.toLocaleString()} per month, ${neighborhoodData.costComparison}. Costs vary based on care level, room type, and amenities. Download our free ${neighborhood} Senior Cost Report for detailed pricing comparisons.`
    },
    {
      question: `Is this event wheelchair accessible?`,
      answer: `Most senior events in ${neighborhood} are held at ADA-compliant venues. ${event.location_name ? `${event.location_name} typically offers` : 'Venues typically offer'} accessible parking, ramps, and restrooms. Contact the venue directly or call Guide for Seniors at (216) 677-4630 for specific accessibility information.`
    },
    {
      question: `Can I bring a family member who needs care assistance?`,
      answer: `Yes, family members and caregivers are welcome at most senior events. These gatherings are designed to be inclusive for seniors at all care levels. If you need help finding care options in ${neighborhood}, our placement specialists offer free consultations.`
    },
    {
      question: `What hospitals are near ${neighborhood} for seniors?`,
      answer: `${neighborhood} has excellent healthcare access, including ${neighborhoodData.hospitals.join(' and ')}. ${neighborhoodData.highlight}. This makes it an ideal location for seniors who want quality medical care nearby.`
    }
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

// Generate calendar URLs for Add to Calendar feature
function generateCalendarUrls(event: SeniorEvent, eventSlug: string) {
  const title = encodeURIComponent(event.title);
  const description = encodeURIComponent(
    `${event.description || `Senior event in ${event.neighborhood || 'Cleveland'}`}\n\nMore info: https://guideforseniors.com/events/${eventSlug}`
  );
  const location = encodeURIComponent(
    event.location_name 
      ? `${event.location_name}, ${event.neighborhood || 'Cleveland'}, OH`
      : `${event.neighborhood || 'Cleveland'}, OH`
  );
  
  const startDate = new Date(event.start_date);
  const endDate = event.end_date ? new Date(event.end_date) : new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Default 2 hours
  
  // Format for Google Calendar (YYYYMMDDTHHMMSS format)
  const formatGoogleDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  };
  
  // Format for ICS file (YYYYMMDDTHHMMSSZ format)
  const formatICSDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  };
  
  const googleStart = formatGoogleDate(startDate);
  const googleEnd = formatGoogleDate(endDate);
  
  return {
    google: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${googleStart}/${googleEnd}&details=${description}&location=${location}&sf=true&output=xml`,
    
    // For Apple/Outlook, we'll generate a data URL for an ICS file
    ics: `data:text/calendar;charset=utf-8,BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Guide for Seniors//Events//EN
BEGIN:VEVENT
DTSTART:${formatICSDate(startDate)}
DTEND:${formatICSDate(endDate)}
SUMMARY:${event.title}
DESCRIPTION:${event.description || ''}\\n\\nMore info: https://guideforseniors.com/events/${eventSlug}
LOCATION:${event.location_name ? `${event.location_name}, ${event.neighborhood || 'Cleveland'}, OH` : `${event.neighborhood || 'Cleveland'}, OH`}
URL:https://guideforseniors.com/events/${eventSlug}
END:VEVENT
END:VCALENDAR`.replace(/\n/g, '%0A').replace(/ /g, '%20')
  };
}

// Calculate days until event
function getDaysUntilEvent(startDate: string): number {
  const eventDate = new Date(startDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);
  const diffTime = eventDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Generate BreadcrumbList Schema for SEO
function generateBreadcrumbSchema(event: SeniorEvent, eventSlug: string) {
  const items = [
    { name: 'Home', url: 'https://guideforseniors.com' },
    { name: 'Local Events', url: 'https://guideforseniors.com/events' }
  ];

  if (event.neighborhood) {
    items.push({
      name: `${event.neighborhood} Events`,
      url: `https://guideforseniors.com/events?neighborhood=${encodeURIComponent(event.neighborhood)}`
    });
  }

  items.push({
    name: event.title,
    url: `https://guideforseniors.com/events/${eventSlug}`
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

// Generate static params for all events
export async function generateStaticParams() {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    const { data: events } = await supabase
      .from('senior_events')
      .select('title')
      .order('start_date', { ascending: true });
    
    if (!events) return [];
    
    return events.map((event: { title: string }) => ({
      slug: generateSlug(event.title),
    }));
  } catch {
    return [];
  }
}

// Dynamic SEO metadata
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const event = await getEventBySlug(params.slug);
  
  if (!event) {
    return {
      title: 'Event Not Found | Guide for Seniors',
      description: 'The requested event could not be found.',
    };
  }
  
  const eventDate = new Date(event.start_date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const location = event.neighborhood || 'Cleveland';
  const eventSlug = generateSlug(event.title);
  const isPast = isEventPast(event.start_date);
  
  // Event type specific keywords
  let eventTypeKeyword = 'senior community event cleveland';
  if (event.event_type === 'medical_wellness') {
    eventTypeKeyword = 'senior health wellness event cleveland';
  } else if (event.event_type === 'luxury_showcase') {
    eventTypeKeyword = 'luxury senior living showcase cleveland';
  }
  
  // Override description for past events
  const description = isPast
    ? `Looking for information on ${event.title}? This event has passed, but Guide for Seniors provides year-round placement advocacy in ${location}.`
    : event.description 
      ? `${event.description.slice(0, 150)}...` 
      : `Join us for ${event.title} on ${eventDate} in ${location}, Ohio. Free senior event for Cleveland area residents.`;
  
  const title = isPast 
    ? `${event.title} (Past Event) | ${location} | Guide for Seniors`
    : `Senior Event: ${event.title} in ${location} | Guide for Seniors`;
  
  return {
    title,
    description,
    keywords: `${event.title}, senior event ${location} ohio, ${eventTypeKeyword}, free senior events cleveland 2026`,
    openGraph: {
      title: isPast ? `${event.title} (Past Event)` : `${event.title} | ${location} Senior Event`,
      description,
      url: `https://guideforseniors.com/events/${eventSlug}`,
      siteName: 'Guide for Seniors',
      locale: 'en_US',
      type: 'website',
      images: event.image_url 
        ? [{ url: event.image_url, width: 1200, height: 630, alt: event.title }] 
        : [{ url: 'https://guideforseniors.com/og-events.jpg', width: 1200, height: 630, alt: 'Cleveland Senior Events' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: isPast ? `${event.title} (Past Event)` : `${event.title} | Senior Event in ${location}`,
      description,
    },
    alternates: {
      canonical: `https://guideforseniors.com/events/${eventSlug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// Format helpers
function formatEventDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatEventTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function formatShortDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

// Generate complete JSON-LD Event schema
function generateEventSchema(event: SeniorEvent) {
  const eventDate = new Date(event.start_date);
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description || `Senior event in ${event.neighborhood || 'Cleveland'}, Ohio`,
    startDate: event.start_date,
    endDate: event.end_date || event.start_date,
    eventAttendanceMode: event.is_virtual 
      ? 'https://schema.org/OnlineEventAttendanceMode' 
      : 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: event.is_virtual 
      ? {
          '@type': 'VirtualLocation',
          url: event.registration_url || 'https://guideforseniors.com/events',
        }
      : {
          '@type': 'Place',
          name: event.location_name || `${event.neighborhood || 'Cleveland'} Community Center`,
          address: {
            '@type': 'PostalAddress',
            addressLocality: event.neighborhood || 'Cleveland',
            addressRegion: 'OH',
            addressCountry: 'US',
          },
        },
    organizer: {
      '@type': 'Organization',
      name: 'Guide for Seniors',
      url: 'https://guideforseniors.com',
      logo: 'https://guideforseniors.com/logo.png',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+1-216-677-4630',
        contactType: 'customer service',
      },
    },
    performer: event.source_name 
      ? { '@type': 'Organization', name: event.source_name } 
      : undefined,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: event.registration_url || `https://guideforseniors.com/events/${generateSlug(event.title)}`,
      validFrom: new Date().toISOString(),
    },
    isAccessibleForFree: true,
    audience: {
      '@type': 'Audience',
      audienceType: 'Seniors',
      geographicArea: {
        '@type': 'City',
        name: 'Cleveland',
        containedInPlace: {
          '@type': 'State',
          name: 'Ohio',
        },
      },
    },
    image: event.image_url || 'https://guideforseniors.com/og-events.jpg',
  };
}

// Main Page Component
export default async function EventSlugPage({ params }: { params: { slug: string } }) {
  const event = await getEventBySlug(params.slug);
  
  if (!event) {
    notFound();
  }
  
  // Check if event is in the past
  const isPastEvent = isEventPast(event.start_date);
  
  // Fetch related events based on whether event is past or upcoming
  const relatedEvents = event.neighborhood 
    ? await getRelatedEvents(event.neighborhood, event.id) 
    : [];
  
  // For past events, also fetch upcoming active events to show at bottom
  const upcomingActiveEvents = isPastEvent 
    ? await getUpcomingActiveEvents(event.id) 
    : [];
  
  // Fetch nearby senior living communities for lead generation
  const nearbyCommunities = await getNearbyCommunities(event.neighborhood);
  
  const isMedicalWellness = event.event_type === 'medical_wellness';
  const isLuxuryShowcase = event.event_type === 'luxury_showcase';
  const neighborhoodSlug = event.neighborhood?.toLowerCase().replace(/\s+/g, '-');
  const eventSlug = generateSlug(event.title);
  
  // Event type styling
  let eventTypeColor = 'bg-teal-600';
  let eventTypeIcon = <HomeIcon className="h-5 w-5 text-white" />;
  let eventTypeText = 'Community Hub';
  let badgeStyle = 'bg-teal-100 text-teal-700';
  
  if (isMedicalWellness) {
    eventTypeColor = 'bg-blue-600';
    eventTypeIcon = <Heart className="h-5 w-5 text-white" />;
    eventTypeText = 'Medical & Wellness';
    badgeStyle = 'bg-blue-100 text-blue-700';
  } else if (isLuxuryShowcase) {
    eventTypeColor = 'bg-amber-600';
    eventTypeIcon = <DollarSign className="h-5 w-5 text-white" />;
    eventTypeText = 'Luxury Showcase';
    badgeStyle = 'bg-amber-100 text-amber-700';
  }
  
  // Override styling for past events
  if (isPastEvent) {
    eventTypeColor = 'bg-slate-500';
  }
  
  // Generate JSON-LD schema (with past event status if applicable)
  const eventSchema = generateEventSchema(event);
  if (isPastEvent) {
    eventSchema.eventStatus = 'https://schema.org/EventCancelled'; // Or EventPostponed for accuracy
  }
  
  // Generate FAQ and Breadcrumb schemas for enhanced SEO
  const faqSchema = generateFAQSchema(event);
  const breadcrumbSchema = generateBreadcrumbSchema(event, eventSlug);
  
  // Get neighborhood data for "Why Seniors Love It" section
  const neighborhoodData = NEIGHBORHOOD_DATA[event.neighborhood || 'Regional'] || NEIGHBORHOOD_DATA['Regional'];
  
  // Generate calendar URLs for "Add to Calendar" feature
  const calendarUrls = generateCalendarUrls(event, eventSlug);
  
  // Calculate days until event for urgency indicator
  const daysUntil = getDaysUntilEvent(event.start_date);
  const urgencyText = daysUntil === 0 ? 'Today!' : daysUntil === 1 ? 'Tomorrow' : `In ${daysUntil} days`;

  return (
    <>
      {/* Inject JSON-LD Event Schema for Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(eventSchema),
        }}
      />
      
      {/* Inject BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      
      {/* Inject FAQ Schema for "People Also Ask" */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <main className="min-h-screen flex flex-col bg-slate-50">
        <GlobalHeader />

        {/* Past Event Banner */}
        {isPastEvent && (
          <div className="bg-slate-700 text-white">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center gap-3 justify-center">
                <AlertCircle className="h-5 w-5 text-amber-300 shrink-0" />
                <p className="text-center text-sm md:text-base">
                  <span className="font-semibold">This community event has passed</span>
                  <span className="hidden sm:inline">, but we can still help you find the right resources.</span>
                </p>
                <Link 
                  href="/contact" 
                  className="ml-2 inline-flex items-center gap-1 bg-white text-slate-700 px-3 py-1 rounded-full text-sm font-semibold hover:bg-slate-100 transition-colors shrink-0"
                >
                  Get Help
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Breadcrumb Navigation */}
        <div className="bg-white border-b border-slate-200">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
              <Link href="/" className="text-slate-500 hover:text-slate-700 transition-colors">
                Home
              </Link>
              <ChevronRight className="h-4 w-4 text-slate-400" />
              <Link href="/events" className="text-slate-500 hover:text-slate-700 transition-colors">
                Local Events
              </Link>
              <ChevronRight className="h-4 w-4 text-slate-400" />
              {event.neighborhood && (
                <>
                  <Link 
                    href={`/events?neighborhood=${encodeURIComponent(event.neighborhood)}`} 
                    className="text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    {event.neighborhood}
                  </Link>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </>
              )}
              <span className="text-slate-900 font-medium truncate max-w-[200px]">
                {event.title}
              </span>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Event Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Back Link */}
              <Link 
                href="/events" 
                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to All Events
              </Link>

              {/* Event Card - Boutique Theme */}
              <Card className="overflow-hidden shadow-lg border-0">
                {/* Event Type Banner */}
                <div className={`px-6 py-4 flex items-center gap-3 ${eventTypeColor}`}>
                  {eventTypeIcon}
                  <span className="text-white font-semibold text-lg">
                    {eventTypeText}
                  </span>
                  {event.is_virtual && (
                    <Badge variant="secondary" className="ml-auto bg-white/20 text-white border-0">
                      <Video className="h-3 w-3 mr-1" />
                      Virtual
                    </Badge>
                  )}
                </div>

                <CardContent className="p-6 md:p-8">
                  {/* Event Title */}
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                    {event.title}
                  </h1>

                  {/* Event Meta Badges */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    {/* Urgency Indicator - For Upcoming Events */}
                    {!isPastEvent && daysUntil <= 7 && (
                      <Badge 
                        variant="secondary" 
                        className={`text-sm py-1.5 px-3 font-bold animate-pulse ${
                          daysUntil === 0 ? 'bg-red-100 text-red-700' : 
                          daysUntil <= 3 ? 'bg-orange-100 text-orange-700' : 
                          'bg-amber-100 text-amber-700'
                        }`}
                      >
                        <Clock className="h-4 w-4 mr-1.5" />
                        {urgencyText}
                      </Badge>
                    )}
                    {/* Past Event Badge */}
                    {isPastEvent && (
                      <Badge variant="secondary" className="text-sm py-1.5 px-3 bg-slate-200 text-slate-600">
                        <CalendarCheck className="h-4 w-4 mr-1.5" />
                        Past Event
                      </Badge>
                    )}
                    <Badge variant="secondary" className={`text-sm py-1.5 px-3 ${isPastEvent ? 'bg-slate-100 text-slate-500' : badgeStyle}`}>
                      {eventTypeText}
                    </Badge>
                    <Badge variant="outline" className={`text-sm py-1.5 px-3 ${isPastEvent ? 'opacity-60' : ''}`}>
                      {event.is_virtual ? (
                        <>
                          <Video className="h-4 w-4 mr-1.5" />
                          Virtual Event
                        </>
                      ) : (
                        <>
                          <Users className="h-4 w-4 mr-1.5" />
                          In-Person Event
                        </>
                      )}
                    </Badge>
                    {!isPastEvent && (
                      <Badge variant="outline" className="text-sm py-1.5 px-3 bg-green-50 text-green-700 border-green-200">
                        Free Admission
                      </Badge>
                    )}
                  </div>

                  {/* Date & Time - Navy/Sage Accent */}
                  <div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-5 rounded-xl"
                    style={{ backgroundColor: '#f8fafb', borderLeft: `4px solid ${SAGE_GREEN}` }}
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: SAGE_GREEN }}
                      >
                        <Calendar className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 font-medium">Date</p>
                        <p className="font-bold text-slate-900">{formatEventDate(event.start_date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div 
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: NAVY }}
                      >
                        <Clock className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 font-medium">Time</p>
                        <p className="font-bold text-slate-900">{formatEventTime(event.start_date)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div 
                    className="flex items-start gap-4 mb-6 p-5 rounded-xl"
                    style={{ backgroundColor: '#f8fafb', borderLeft: `4px solid ${NAVY}` }}
                  >
                    <div 
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: NAVY }}
                    >
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium">Location</p>
                      <p className="font-bold text-slate-900">{event.location_name || 'TBD'}</p>
                      {event.neighborhood && (
                        <Link 
                          href={`/location/${neighborhoodSlug}`}
                          className="text-sm hover:underline transition-colors"
                          style={{ color: SAGE_GREEN }}
                        >
                          {event.neighborhood}, Ohio →
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {event.description && (
                    <div className="mb-8">
                      <h2 className="text-xl font-bold text-slate-900 mb-3">About This Event</h2>
                      <p className="text-slate-600 leading-relaxed text-lg">
                        {event.description}
                      </p>
                    </div>
                  )}

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap gap-4 pt-6 border-t border-slate-200">
                    {isPastEvent ? (
                      <>
                        {/* Past Event - Speak with Specialist CTA */}
                        <Link href="/contact">
                          <Button 
                            size="lg"
                            className="gap-2 font-bold bg-teal-600 hover:bg-teal-700"
                          >
                            <MessageCircle className="h-4 w-4" />
                            Speak with a Placement Specialist
                          </Button>
                        </Link>
                        <a href="tel:+12166774630">
                          <Button variant="outline" size="lg" className="gap-2">
                            <Phone className="h-4 w-4" />
                            Call (216) 677-4630
                          </Button>
                        </a>
                      </>
                    ) : (
                      <>
                        {/* Upcoming Event - Registration CTA */}
                        {event.registration_url && (
                          <a href={event.registration_url} target="_blank" rel="noopener noreferrer">
                            <Button 
                              size="lg"
                              className="gap-2 font-bold"
                              style={{ backgroundColor: NAVY }}
                            >
                              Register / Learn More
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </a>
                        )}
                        
                        {/* Add to Calendar Dropdown */}
                        <div className="relative group">
                          <Button variant="outline" size="lg" className="gap-2">
                            <Calendar className="h-4 w-4" />
                            Add to Calendar
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                          <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                            <a 
                              href={calendarUrls.google}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors rounded-t-lg"
                            >
                              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10z" fill="#fff"/>
                                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.89 14.5H7.11V7.5h9.78v9z" fill="#4285F4"/>
                                <path d="M16.89 16.5H12V12h4.89v4.5z" fill="#34A853"/>
                                <path d="M12 16.5H7.11V12H12v4.5z" fill="#FBBC05"/>
                                <path d="M12 12H7.11V7.5H12V12z" fill="#EA4335"/>
                              </svg>
                              <span className="text-sm font-medium text-slate-700">Google Calendar</span>
                            </a>
                            <a 
                              href={calendarUrls.ics}
                              download={`${eventSlug}.ics`}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                            >
                              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                                <rect width="24" height="24" rx="5" fill="#000"/>
                                <path d="M6 4h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z" fill="#fff"/>
                                <path d="M8 11h8M8 14h5" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
                              </svg>
                              <span className="text-sm font-medium text-slate-700">Apple Calendar</span>
                            </a>
                            <a 
                              href={calendarUrls.ics}
                              download={`${eventSlug}.ics`}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors rounded-b-lg"
                            >
                              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                                <rect width="24" height="24" rx="3" fill="#0078D4"/>
                                <path d="M6 8h12v10H6V8z" fill="#fff"/>
                                <path d="M6 6h12v2H6V6z" fill="#fff"/>
                              </svg>
                              <span className="text-sm font-medium text-slate-700">Outlook</span>
                            </a>
                          </div>
                        </div>

                        {/* Share with Family Dropdown */}
                        <div className="relative group">
                          <Button variant="outline" size="lg" className="gap-2">
                            <Share2 className="h-4 w-4" />
                            Share with Family
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                          <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                            <div className="p-3 border-b border-slate-100">
                              <p className="text-xs text-slate-500 flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                Planning senior care is a family decision
                              </p>
                            </div>
                            <a 
                              href={`mailto:?subject=${encodeURIComponent(`Senior Event: ${event.title}`)}&body=${encodeURIComponent(`I found this event that might interest our family:\n\n${event.title}\n${formatEventDate(event.start_date)} at ${formatEventTime(event.start_date)}\n${event.location_name || event.neighborhood || 'Cleveland'}, OH\n\nLearn more: https://guideforseniors.com/events/${eventSlug}`)}`}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                            >
                              <svg className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span className="text-sm font-medium text-slate-700">Email to Family Member</span>
                            </a>
                            <a 
                              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://guideforseniors.com/events/${eventSlug}`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                            >
                              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#1877F2">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                              </svg>
                              <span className="text-sm font-medium text-slate-700">Share on Facebook</span>
                            </a>
                            <a 
                              href={`https://guideforseniors.com/events/${eventSlug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors rounded-b-lg"
                              title="Right-click to copy link"
                            >
                              <svg className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                              </svg>
                              <span className="text-sm font-medium text-slate-700">Copy Link</span>
                            </a>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Social Proof Testimonial - For Upcoming Events */}
                  {!isPastEvent && (
                    <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-start gap-3">
                        <div className="shrink-0 w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                          <Users className="h-5 w-5 text-teal-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-600 italic leading-relaxed">
                            &ldquo;I shared this with my sister and we attended together. Guide for Seniors 
                            helped us find the perfect place for Mom in {event.neighborhood || 'Cleveland'}.&rdquo;
                          </p>
                          <p className="text-xs text-slate-500 mt-2 font-medium">
                            — Jennifer M., {event.neighborhood || 'Cleveland'} Family
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Source Attribution */}
              {event.source_name && (
                <p className="text-sm text-slate-500">
                  Event information from{' '}
                  {event.source_url ? (
                    <a 
                      href={event.source_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline"
                      style={{ color: SAGE_GREEN }}
                    >
                      {event.source_name}
                    </a>
                  ) : (
                    <span className="font-medium">{event.source_name}</span>
                  )}
                </p>
              )}

              {/* Why Seniors Love [Neighborhood] Section */}
              {event.neighborhood && (
                <Card className="mt-6 overflow-hidden border-0 shadow-md">
                  <div 
                    className="px-6 py-4 flex items-center gap-3"
                    style={{ backgroundColor: SAGE_GREEN }}
                  >
                    <MapPinned className="h-5 w-5 text-white" />
                    <span className="text-white font-semibold text-lg">
                      Why Seniors Love {event.neighborhood}
                    </span>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-slate-600 leading-relaxed mb-4">
                      {neighborhoodData.highlight}. With {neighborhoodData.communityCount}+ senior living 
                      communities and excellent healthcare access including{' '}
                      <span className="font-medium">{neighborhoodData.hospitals.join(' and ')}</span>, 
                      {event.neighborhood} is a top choice for Cleveland-area seniors.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-slate-50 rounded-lg">
                        <p className="text-2xl font-bold" style={{ color: NAVY }}>
                          ${neighborhoodData.avgCost.toLocaleString()}
                        </p>
                        <p className="text-xs text-slate-500">Avg. Monthly Cost</p>
                      </div>
                      <div className="text-center p-3 bg-slate-50 rounded-lg">
                        <p className="text-2xl font-bold" style={{ color: NAVY }}>
                          {neighborhoodData.communityCount}+
                        </p>
                        <p className="text-xs text-slate-500">Communities</p>
                      </div>
                      <div className="text-center p-3 bg-slate-50 rounded-lg col-span-2 md:col-span-1">
                        <p className="text-2xl font-bold" style={{ color: NAVY }}>
                          {neighborhoodData.hospitals.length}
                        </p>
                        <p className="text-xs text-slate-500">Major Hospitals</p>
                      </div>
                    </div>
                    <Link 
                      href={`/location/${neighborhoodSlug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold hover:underline"
                      style={{ color: SAGE_GREEN }}
                    >
                      <Building2 className="h-4 w-4" />
                      Explore Senior Living in {event.neighborhood} →
                    </Link>
                  </CardContent>
                </Card>
              )}

              {/* FAQ Section - Targets "People Also Ask" */}
              <Card className="mt-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" style={{ color: SAGE_GREEN }} />
                    Frequently Asked Questions
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="divide-y divide-slate-100">
                    {/* FAQ 1 */}
                    <details className="group py-4">
                      <summary className="flex items-center justify-between cursor-pointer list-none">
                        <span className="font-medium text-slate-900 pr-4">
                          What senior living options are near {event.location_name || event.neighborhood || 'this event'}?
                        </span>
                        <ChevronDown className="h-5 w-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0" />
                      </summary>
                      <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                        There are {neighborhoodData.communityCount}+ senior living communities in {event.neighborhood || 'Greater Cleveland'}, 
                        including assisted living, memory care, and independent living options. The average monthly cost 
                        is ${neighborhoodData.avgCost.toLocaleString()}, which is {neighborhoodData.costComparison}.{' '}
                        <Link href="/contact" className="font-medium hover:underline" style={{ color: SAGE_GREEN }}>
                          Get free placement assistance →
                        </Link>
                      </p>
                    </details>

                    {/* FAQ 2 */}
                    <details className="group py-4">
                      <summary className="flex items-center justify-between cursor-pointer list-none">
                        <span className="font-medium text-slate-900 pr-4">
                          How much does assisted living cost in {event.neighborhood || 'Cleveland'}, Ohio?
                        </span>
                        <ChevronDown className="h-5 w-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0" />
                      </summary>
                      <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                        Assisted living in {event.neighborhood || 'Cleveland'} averages ${neighborhoodData.avgCost.toLocaleString()} per month, 
                        {neighborhoodData.costComparison}. Costs vary based on care level, room type, and amenities.{' '}
                        <Link 
                          href={`/senior-living-costs-cleveland${neighborhoodSlug ? `?neighborhood=${neighborhoodSlug}` : ''}`} 
                          className="font-medium hover:underline" 
                          style={{ color: SAGE_GREEN }}
                        >
                          Download our free Cost Report →
                        </Link>
                      </p>
                    </details>

                    {/* FAQ 3 */}
                    <details className="group py-4">
                      <summary className="flex items-center justify-between cursor-pointer list-none">
                        <span className="font-medium text-slate-900 pr-4">
                          Is this event wheelchair accessible?
                        </span>
                        <ChevronDown className="h-5 w-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0" />
                      </summary>
                      <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                        Most senior events in {event.neighborhood || 'Cleveland'} are held at ADA-compliant venues. 
                        {event.location_name ? ` ${event.location_name} typically offers` : ' Venues typically offer'} accessible 
                        parking, ramps, and restrooms. For specific accessibility information, call us at{' '}
                        <a href="tel:+12166774630" className="font-medium hover:underline" style={{ color: SAGE_GREEN }}>
                          (216) 677-4630
                        </a>.
                      </p>
                    </details>

                    {/* FAQ 4 */}
                    <details className="group py-4">
                      <summary className="flex items-center justify-between cursor-pointer list-none">
                        <span className="font-medium text-slate-900 pr-4">
                          Can I bring a family member who needs care assistance?
                        </span>
                        <ChevronDown className="h-5 w-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0" />
                      </summary>
                      <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                        Yes, family members and caregivers are welcome at most senior events. These gatherings are designed 
                        to be inclusive for seniors at all care levels. If you need help finding care options, our{' '}
                        <Link href="/contact" className="font-medium hover:underline" style={{ color: SAGE_GREEN }}>
                          placement specialists offer free consultations
                        </Link>.
                      </p>
                    </details>

                    {/* FAQ 5 */}
                    <details className="group py-4">
                      <summary className="flex items-center justify-between cursor-pointer list-none">
                        <span className="font-medium text-slate-900 pr-4">
                          What hospitals are near {event.neighborhood || 'Cleveland'} for seniors?
                        </span>
                        <ChevronDown className="h-5 w-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0" />
                      </summary>
                      <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                        {event.neighborhood || 'Cleveland'} has excellent healthcare access, including{' '}
                        <span className="font-medium">{neighborhoodData.hospitals.join(' and ')}</span>. 
                        {neighborhoodData.highlight}. This makes it an ideal location for seniors who want quality medical care nearby.
                      </p>
                    </details>
                  </div>
                </CardContent>
              </Card>

              {/* Related Events in Neighborhood */}
              {relatedEvents.length > 0 && event.neighborhood && (
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-slate-900">
                      More Events in {event.neighborhood}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                      {relatedEvents.map((relatedEvent) => {
                        const relatedSlug = generateSlug(relatedEvent.title);
                        let relatedBadgeStyle = 'bg-teal-100 text-teal-700';
                        let relatedTypeText = 'Community';
                        
                        if (relatedEvent.event_type === 'medical_wellness') {
                          relatedBadgeStyle = 'bg-blue-100 text-blue-700';
                          relatedTypeText = 'Medical';
                        } else if (relatedEvent.event_type === 'luxury_showcase') {
                          relatedBadgeStyle = 'bg-amber-100 text-amber-700';
                          relatedTypeText = 'Luxury';
                        }
                        
                        return (
                          <Link 
                            key={relatedEvent.id}
                            href={`/events/${relatedSlug}`}
                            className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors"
                          >
                            <div 
                              className="flex flex-col items-center justify-center w-14 h-14 rounded-lg text-white font-bold"
                              style={{ backgroundColor: SAGE_GREEN }}
                            >
                              <span className="text-xs uppercase">{formatShortDate(relatedEvent.start_date).split(' ')[0]}</span>
                              <span className="text-lg">{formatShortDate(relatedEvent.start_date).split(' ')[1]}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-slate-900 truncate">
                                {relatedEvent.title}
                              </h4>
                              <p className="text-sm text-slate-500">
                                {formatEventTime(relatedEvent.start_date)} • {relatedEvent.location_name}
                              </p>
                            </div>
                            <Badge variant="secondary" className={`shrink-0 ${relatedBadgeStyle}`}>
                              {relatedTypeText}
                            </Badge>
                          </Link>
                        );
                      })}
                    </div>
                    <div className="p-4 border-t border-slate-100">
                      <Link 
                        href={`/events?neighborhood=${encodeURIComponent(event.neighborhood)}`}
                        className="text-sm font-semibold hover:underline"
                        style={{ color: NAVY }}
                      >
                        View all {event.neighborhood} events →
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Sidebar */}
            <aside className="space-y-6">
              {/* Lead-Gen CTA - Different for Past vs Upcoming Events */}
              {isPastEvent ? (
                /* Past Event - Placement Specialist CTA */
                <Card 
                  className="overflow-hidden border-0 shadow-lg"
                  style={{ background: `linear-gradient(135deg, #0d9488 0%, #0f766e 100%)` }}
                >
                  <CardContent className="pt-6 text-white">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageCircle className="h-5 w-5" />
                      <span className="text-sm font-medium uppercase tracking-wide opacity-90">Free Consultation</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3">
                      Missed This Event?
                    </h3>
                    <p className="text-white/90 text-sm mb-4 leading-relaxed">
                      Our Cleveland placement specialists can help you find senior living options 
                      {event.neighborhood ? ` in ${event.neighborhood}` : ''} — no event attendance required.
                    </p>
                    <Link href="/contact">
                      <Button 
                        variant="secondary" 
                        className="w-full font-bold text-slate-900 bg-white hover:bg-slate-100"
                        size="lg"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Speak with a Specialist
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                /* Upcoming Event - Cost Report Download */
                event.neighborhood && (
                  <Card 
                    className="overflow-hidden border-0 shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #2d4a6f 100%)` }}
                  >
                    <CardContent className="pt-6 text-white">
                      <div className="flex items-center gap-2 mb-3">
                        <Download className="h-5 w-5" />
                        <span className="text-sm font-medium uppercase tracking-wide opacity-90">Free Download</span>
                      </div>
                      <h3 className="text-xl font-bold mb-3">
                        Attending this event?
                      </h3>
                      <p className="text-white/80 text-sm mb-4 leading-relaxed">
                        Get our comprehensive <strong>{event.neighborhood} Senior Cost Report</strong> — 
                        pricing, amenities, and insider tips for choosing the right community.
                      </p>
                      <Link href={`/senior-living-costs-cleveland?neighborhood=${neighborhoodSlug}`}>
                        <Button 
                          variant="secondary" 
                          className="w-full font-bold text-slate-900 bg-white hover:bg-slate-100"
                          size="lg"
                        >
                          Download {event.neighborhood} Cost Report
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )
              )}

              {/* Expert Help CTA */}
              <Card 
                className="overflow-hidden border-0 shadow-lg"
                style={{ background: `linear-gradient(135deg, ${SAGE_GREEN} 0%, ${SAGE_LIGHT} 100%)` }}
              >
                <CardContent className="pt-6 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <Phone className="h-5 w-5" />
                    <span className="text-sm font-medium uppercase tracking-wide opacity-90">Free Consultation</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">
                    Questions About Senior Care?
                  </h3>
                  <p className="text-white/90 text-sm mb-4 leading-relaxed">
                    Our Cleveland advisors provide free, personalized guidance on assisted living, 
                    memory care, and independent living options.
                  </p>
                  <a href="tel:+12166774630">
                    <Button 
                      variant="secondary" 
                      className="w-full font-bold text-slate-900 bg-white hover:bg-slate-100"
                      size="lg"
                    >
                      Call (216) 677-4630
                    </Button>
                  </a>
                </CardContent>
              </Card>

              {/* Event Reminder Signup - For Upcoming Events Only */}
              {!isPastEvent && (
                <Card className="border border-slate-200">
                  <CardContent className="pt-6">
                    <EventReminderForm 
                      eventId={event.id}
                      eventTitle={event.title}
                      eventDate={event.start_date}
                      neighborhood={event.neighborhood}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Communities Near This Event - High Conversion Section */}
              {nearbyCommunities.length > 0 && (
                <Card className="border border-slate-200 overflow-hidden">
                  <div 
                    className="px-4 py-3 flex items-center gap-2"
                    style={{ backgroundColor: NAVY }}
                  >
                    <Building2 className="h-4 w-4 text-white" />
                    <span className="text-white font-semibold text-sm">
                      Senior Living Near This Event
                    </span>
                  </div>
                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                      {nearbyCommunities.slice(0, 4).map((community) => {
                        const communitySlug = community.name
                          .toLowerCase()
                          .replace(/[^a-z0-9\s-]/g, '')
                          .replace(/\s+/g, '-');
                        
                        return (
                          <Link 
                            key={community.id}
                            href={`/community/${community.id}/${communitySlug}`}
                            className="flex items-start gap-3 p-3 hover:bg-slate-50 transition-colors"
                          >
                            {/* Community Image */}
                            <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                              {community.images && community.images.length > 0 ? (
                                <img 
                                  src={community.images[0]} 
                                  alt={community.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Building2 className="h-6 w-6 text-slate-300" />
                                </div>
                              )}
                            </div>
                            
                            {/* Community Info */}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-slate-900 text-sm truncate">
                                {community.name}
                              </h4>
                              <p className="text-xs text-slate-500 mb-1">
                                {community.location}
                              </p>
                              {community.rating && parseFloat(String(community.rating)) > 0 && (
                                <div className="flex items-center gap-1">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <svg
                                        key={i}
                                        className={`h-3 w-3 ${
                                          i < Math.round(parseFloat(String(community.rating)))
                                            ? 'text-amber-400'
                                            : 'text-slate-200'
                                        }`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                    ))}
                                  </div>
                                  <span className="text-xs text-slate-500">
                                    {parseFloat(String(community.rating)).toFixed(1)}
                                  </span>
                                </div>
                              )}
                              {community.careTypes && community.careTypes.length > 0 && (
                                <p className="text-xs text-teal-600 mt-1 truncate">
                                  {community.careTypes.slice(0, 2).join(' • ')}
                                </p>
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                    <div className="p-3 border-t border-slate-100 bg-slate-50">
                      <Link 
                        href={`/location/${neighborhoodSlug}`}
                        className="text-sm font-semibold hover:underline flex items-center justify-center gap-1"
                        style={{ color: NAVY }}
                      >
                        View All {event.neighborhood} Communities
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Internal Links - Neighborhood Exploration */}
              {event.neighborhood && (
                <Card className="border border-slate-200">
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">
                      Explore {event.neighborhood}
                    </h3>
                    <ul className="space-y-3">
                      <li>
                        <Link 
                          href={`/location/${neighborhoodSlug}`}
                          className="flex items-center gap-2 text-sm font-medium hover:underline"
                          style={{ color: NAVY }}
                        >
                          <HomeIcon className="h-4 w-4" />
                          Senior Living in {event.neighborhood}
                        </Link>
                      </li>
                      <li>
                        <Link 
                          href={`/events?neighborhood=${encodeURIComponent(event.neighborhood)}`}
                          className="flex items-center gap-2 text-sm font-medium hover:underline"
                          style={{ color: NAVY }}
                        >
                          <Calendar className="h-4 w-4" />
                          All {event.neighborhood} Events
                        </Link>
                      </li>
                      <li>
                        <Link 
                          href="/senior-living-costs-cleveland"
                          className="flex items-center gap-2 text-sm font-medium hover:underline"
                          style={{ color: NAVY }}
                        >
                          <DollarSign className="h-4 w-4" />
                          Cleveland Senior Living Costs
                        </Link>
                      </li>
                      <li>
                        <Link 
                          href="/assessment"
                          className="flex items-center gap-2 text-sm font-medium hover:underline"
                          style={{ color: NAVY }}
                        >
                          <Award className="h-4 w-4" />
                          Take Care Assessment
                        </Link>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Trust Signals */}
              <div className="text-center text-sm text-slate-500 space-y-2">
                <p className="flex items-center justify-center gap-2">
                  <Award className="h-4 w-4" style={{ color: SAGE_GREEN }} />
                  <span>20+ Years Cleveland Senior Care Experience</span>
                </p>
                <p className="flex items-center justify-center gap-2">
                  <Users className="h-4 w-4" style={{ color: SAGE_GREEN }} />
                  <span>500+ Families Helped</span>
                </p>
              </div>
            </aside>
          </div>
        </div>

        {/* Related Active Events Section - For Past Events */}
        {isPastEvent && upcomingActiveEvents.length > 0 && (
          <section className="border-t border-slate-200 bg-white py-12">
            <div className="container mx-auto px-4">
              <div className="text-center mb-8">
                <Badge variant="secondary" className="mb-3 bg-teal-100 text-teal-700">
                  <Calendar className="h-3 w-3 mr-1" />
                  Upcoming Events
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                  Discover Active Events Near You
                </h2>
                <p className="text-slate-600 max-w-2xl mx-auto">
                  This event has passed, but there are many more opportunities to connect with 
                  the senior community in Greater Cleveland.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingActiveEvents.map((activeEvent) => {
                  const activeEventSlug = generateSlug(activeEvent.title);
                  let activeBadgeStyle = 'bg-teal-100 text-teal-700';
                  let activeTypeText = 'Community';
                  
                  if (activeEvent.event_type === 'medical_wellness') {
                    activeBadgeStyle = 'bg-blue-100 text-blue-700';
                    activeTypeText = 'Medical';
                  } else if (activeEvent.event_type === 'luxury_showcase') {
                    activeBadgeStyle = 'bg-amber-100 text-amber-700';
                    activeTypeText = 'Luxury';
                  }
                  
                  return (
                    <Link 
                      key={activeEvent.id}
                      href={`/events/${activeEventSlug}`}
                      className="group"
                    >
                      <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-teal-500 group-hover:border-l-teal-600">
                        <CardContent className="p-5">
                          <div className="flex items-start gap-4">
                            <div 
                              className="flex flex-col items-center justify-center w-14 h-14 rounded-lg text-white font-bold shrink-0"
                              style={{ backgroundColor: SAGE_GREEN }}
                            >
                              <span className="text-xs uppercase">{formatShortDate(activeEvent.start_date).split(' ')[0]}</span>
                              <span className="text-lg">{formatShortDate(activeEvent.start_date).split(' ')[1]}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <Badge variant="secondary" className={`text-xs mb-2 ${activeBadgeStyle}`}>
                                {activeTypeText}
                              </Badge>
                              <h3 className="font-semibold text-slate-900 group-hover:text-teal-600 transition-colors line-clamp-2 mb-1">
                                {activeEvent.title}
                              </h3>
                              <p className="text-sm text-slate-500">
                                {activeEvent.neighborhood || 'Cleveland Area'}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
              
              <div className="text-center mt-8">
                <Link href="/events">
                  <Button size="lg" className="gap-2 font-bold" style={{ backgroundColor: NAVY }}>
                    View All Upcoming Events
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        <Footer />
      </main>
    </>
  );
}
