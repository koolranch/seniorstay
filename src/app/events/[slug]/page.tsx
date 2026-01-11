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
  ChevronRight
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import GlobalHeader from '@/components/home/GlobalHeader';
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

// Fetch related events in the same neighborhood
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
  
  // Event type specific keywords
  let eventTypeKeyword = 'senior community event cleveland';
  if (event.event_type === 'medical_wellness') {
    eventTypeKeyword = 'senior health wellness event cleveland';
  } else if (event.event_type === 'luxury_showcase') {
    eventTypeKeyword = 'luxury senior living showcase cleveland';
  }
  
  return {
    title: `Senior Event: ${event.title} in ${location} | Guide for Seniors`,
    description: event.description 
      ? `${event.description.slice(0, 150)}...` 
      : `Join us for ${event.title} on ${eventDate} in ${location}, Ohio. Free senior event for Cleveland area residents.`,
    keywords: `${event.title}, senior event ${location} ohio, ${eventTypeKeyword}, free senior events cleveland 2026`,
    openGraph: {
      title: `${event.title} | ${location} Senior Event`,
      description: event.description || `Senior event in ${location}, Ohio on ${eventDate}. Free for Cleveland area seniors.`,
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
      title: `${event.title} | Senior Event in ${location}`,
      description: event.description || `Free senior event on ${eventDate}`,
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
  
  const relatedEvents = event.neighborhood 
    ? await getRelatedEvents(event.neighborhood, event.id) 
    : [];
  
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
  
  // Generate JSON-LD schema
  const eventSchema = generateEventSchema(event);

  return (
    <>
      {/* Inject JSON-LD Event Schema for Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(eventSchema),
        }}
      />

      <main className="min-h-screen flex flex-col bg-slate-50">
        <GlobalHeader />

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
                    <Badge variant="secondary" className={`text-sm py-1.5 px-3 ${badgeStyle}`}>
                      {eventTypeText}
                    </Badge>
                    <Badge variant="outline" className="text-sm py-1.5 px-3">
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
                    <Badge variant="outline" className="text-sm py-1.5 px-3 bg-green-50 text-green-700 border-green-200">
                      Free Admission
                    </Badge>
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
                    <Button variant="outline" size="lg" className="gap-2">
                      <Share2 className="h-4 w-4" />
                      Share Event
                    </Button>
                  </div>
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
              {/* Lead-Gen CTA - Cost Report Download */}
              {event.neighborhood && (
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

        <Footer />
      </main>
    </>
  );
}
