import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, Clock, MapPin, Video, Users, Award, ArrowLeft, 
  ExternalLink, Phone, Heart, DollarSign, ChevronRight,
  AlertCircle, CalendarCheck, Building2
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
import { 
  isValidRegion, 
  getRegionConfig, 
  getAllRegionSlugs,
  getRegionPhoneNumber 
} from '@/data/regions';

// Boutique Theme Colors
const NAVY = '#1e3a5f';
const SAGE_GREEN = '#8DA399';

// Supabase client - hardcoded for reliability during SSR
const supabaseUrl = 'https://hncgnxbooghjhpncujzx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuY2dueGJvb2doamhwbmN1anp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMTI0ODIsImV4cCI6MjA1OTc4ODQ4Mn0.mdAL87W0h4PN7Xu8ESjjDxzjW_H3YH55i-FqAE5SXcs';

// Generate URL-friendly slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

// Fetch event by slug with optional region filter - direct database query
async function getEventBySlug(slug: string, regionSlug?: string): Promise<SeniorEvent | null> {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Query directly by slug column (more efficient and reliable)
    let query = supabase
      .from('senior_events')
      .select('*')
      .eq('slug', slug);
    
    // Filter by region if provided
    if (regionSlug) {
      query = query.eq('region_slug', regionSlug);
    }
    
    const { data: events, error } = await query.limit(1);
    
    if (error) {
      console.error('[Event Page] Error fetching event:', error);
      return null;
    }
    
    return events && events.length > 0 ? (events[0] as SeniorEvent) : null;
  } catch (error) {
    console.error('[Event Page] Error in getEventBySlug:', error);
    return null;
  }
}

// Fetch related events
async function getRelatedEvents(neighborhood: string, excludeId: string, regionSlug?: string): Promise<SeniorEvent[]> {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const today = new Date().toISOString().split('T')[0];
    
    let query = supabase
      .from('senior_events')
      .select('*')
      .gte('start_date', today)
      .neq('id', excludeId)
      .order('start_date', { ascending: true })
      .limit(3);
    
    if (regionSlug) {
      query = query.eq('region_slug', regionSlug);
    }
    
    const { data, error } = await query;
    
    if (error || !data) return [];
    return data as SeniorEvent[];
  } catch {
    return [];
  }
}

interface EventPageProps {
  params: { region: string; slug: string };
}

// Dynamic rendering to ensure fresh event data
export const dynamic = 'force-dynamic';

// Generate metadata
export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { region, slug } = params;
  
  if (!isValidRegion(region)) {
    return { title: 'Region Not Found | Guide for Seniors' };
  }
  
  const regionConfig = getRegionConfig(region);
  const event = await getEventBySlug(slug, region);
  
  if (!event) {
    return { title: 'Event Not Found | Guide for Seniors' };
  }
  
  const location = event.neighborhood || event.location_name || regionConfig?.displayName || 'Cleveland';
  const eventDate = new Date(event.start_date);
  const isPast = eventDate < new Date();
  const baseUrl = 'https://www.guideforseniors.com';
  const canonicalUrl = `${baseUrl}/${region}/events/${slug}`;
  
  const seoTitle = isPast 
    ? `${event.title} (Past Event) | ${location} | Guide for Seniors`
    : `Senior Event: ${event.title} in ${location} | Guide for Seniors`;
  
  const seoDescription = isPast
    ? `This senior event in ${location} has passed. Browse upcoming senior events and activities in ${regionConfig?.displayName || 'your area'}.`
    : `${event.title} - ${eventDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} in ${location}. ${event.description?.slice(0, 100) || 'Join us for this senior community event.'}...`;
  
  return {
    title: seoTitle,
    description: seoDescription,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: canonicalUrl,
      siteName: 'Guide for Seniors',
      type: 'article',
    },
    robots: isPast 
      ? { index: false, follow: true }
      : { index: true, follow: true },
  };
}

export default async function EventSlugPage({ params }: EventPageProps) {
  const { region, slug } = params;
  
  // Validate region
  if (!isValidRegion(region)) {
    notFound();
  }
  
  const regionConfig = getRegionConfig(region);
  if (!regionConfig) {
    notFound();
  }
  
  const event = await getEventBySlug(slug, region);
  
  if (!event) {
    notFound();
  }
  
  const phoneNumber = getRegionPhoneNumber(region);
  const eventDate = new Date(event.start_date);
  const isPast = eventDate < new Date();
  const location = event.neighborhood || event.location_name || regionConfig.displayName;
  const citySlug = (event.neighborhood || '').toLowerCase().replace(/\s+/g, '-');
  
  // Fetch related content
  const [relatedEvents, nearbyCommunities] = await Promise.all([
    getRelatedEvents(event.neighborhood || '', event.id || '', region),
    event.neighborhood ? fetchQualityCommunitiesByCity(event.neighborhood) : Promise.resolve([])
  ]);
  
  // JSON-LD Event Schema
  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.title,
    "description": event.description,
    "startDate": event.start_date,
    "endDate": event.end_date,
    "eventStatus": isPast ? "https://schema.org/EventCancelled" : "https://schema.org/EventScheduled",
    "eventAttendanceMode": event.is_virtual 
      ? "https://schema.org/OnlineEventAttendanceMode" 
      : "https://schema.org/OfflineEventAttendanceMode",
    "location": event.is_virtual 
      ? { "@type": "VirtualLocation", "url": event.registration_url }
      : { "@type": "Place", "name": event.location_name || location, "address": { "@type": "PostalAddress", "addressLocality": event.neighborhood || location, "addressRegion": regionConfig.stateAbbr } },
    "organizer": { "@type": "Organization", "name": event.source_name || "Guide for Seniors" },
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "availability": "https://schema.org/InStock" }
  };
  
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.guideforseniors.com" },
      { "@type": "ListItem", "position": 2, "name": regionConfig.displayName, "item": `https://www.guideforseniors.com/${region}` },
      { "@type": "ListItem", "position": 3, "name": "Events", "item": `https://www.guideforseniors.com/${region}/events` },
      { "@type": "ListItem", "position": 4, "name": event.title }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([eventSchema, breadcrumbSchema]) }} />
      
      <GlobalHeader />
      
      {/* Hero Section */}
      <section className="relative py-12 md:py-16" style={{ backgroundColor: NAVY }}>
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-white/70">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <ChevronRight className="h-4 w-4" />
              <li><Link href={`/${region}`} className="hover:text-white">{regionConfig.displayName}</Link></li>
              <ChevronRight className="h-4 w-4" />
              <li><Link href={`/${region}/events`} className="hover:text-white">Events</Link></li>
              <ChevronRight className="h-4 w-4" />
              <li className="text-white/90 truncate max-w-[200px]">{event.title}</li>
            </ol>
          </nav>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Event Details */}
            <div className="md:col-span-2">
              {isPast && (
                <Badge variant="destructive" className="mb-4">
                  <AlertCircle className="h-3 w-3 mr-1" /> This event has passed
                </Badge>
              )}
              
              <div className="flex flex-wrap gap-2 mb-4">
                {event.event_type && (
                  <Badge className="text-white" style={{ backgroundColor: SAGE_GREEN }}>
                    {event.event_type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  </Badge>
                )}
                {event.is_virtual && (
                  <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                    <Video className="h-3 w-3 mr-1" /> Virtual Event
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {event.title}
              </h1>
              
              <div className="flex flex-wrap gap-4 text-white/80">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" style={{ color: SAGE_GREEN }} />
                  <span>{eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" style={{ color: SAGE_GREEN }} />
                  <span>{eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                </div>
                {!event.is_virtual && event.location_name && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" style={{ color: SAGE_GREEN }} />
                    <span>{event.location_name}{event.neighborhood ? `, ${event.neighborhood}` : ''}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* CTA Card */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              {isPast ? (
                <div className="text-center">
                  <CalendarCheck className="h-12 w-12 mx-auto mb-3" style={{ color: SAGE_GREEN }} />
                  <h3 className="font-semibold text-slate-900 mb-2">Event Has Passed</h3>
                  <p className="text-sm text-slate-600 mb-4">Browse upcoming events in {regionConfig.displayName}</p>
                  <Link href={`/${region}/events`}>
                    <Button className="w-full" style={{ backgroundColor: SAGE_GREEN }}>
                      View Upcoming Events
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <CalendarCheck className="h-5 w-5" style={{ color: SAGE_GREEN }} />
                    Get Event Reminder
                  </h3>
                  <EventReminderForm 
                    eventId={event.id}
                    eventTitle={event.title}
                    eventDate={event.start_date}
                    neighborhood={event.neighborhood}
                  />
                  
                  {event.registration_url && (
                    <a href={event.registration_url} target="_blank" rel="noopener noreferrer" className="mt-4 block">
                      <Button variant="outline" className="w-full">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Register for Event
                      </Button>
                    </a>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Description */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" style={{ color: SAGE_GREEN }} />
                    About This Event
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-slate max-w-none">
                  {event.description ? (
                    <p className="whitespace-pre-wrap">{event.description}</p>
                  ) : (
                    <p className="text-slate-600">
                      Join us for {event.title} in {location}. This event is designed for seniors and their families.
                    </p>
                  )}
                  
                  {event.source_name && (
                    <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-600">
                        <strong>Organized by:</strong> {event.source_name}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Nearby Communities */}
              {nearbyCommunities.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" style={{ color: SAGE_GREEN }} />
                      Senior Living in {event.neighborhood || location}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-4">
                      Explore senior living communities near this event location.
                    </p>
                    <div className="grid gap-3">
                      {nearbyCommunities.slice(0, 3).map((community, i) => (
                        <Link 
                          key={i}
                          href={`/${region}/community/${community.id}/${community.name.toLowerCase().replace(/\s+/g, '-')}`}
                          className="flex items-center gap-3 p-3 rounded-lg border hover:border-teal-500 transition-colors"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-slate-900">{community.name}</p>
                            <p className="text-sm text-slate-600">{community.location}</p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-slate-400" />
                        </Link>
                      ))}
                    </div>
                    <Link href={`/${region}/${citySlug}`} className="mt-4 inline-block">
                      <Button variant="outline" size="sm">
                        View All Communities in {event.neighborhood || location}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Related Events */}
              {relatedEvents.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Upcoming Events</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {relatedEvents.map((relatedEvent, i) => (
                      <Link 
                        key={i}
                        href={`/${region}/events/${generateSlug(relatedEvent.title)}`}
                        className="block p-3 rounded-lg border hover:border-teal-500 transition-colors"
                      >
                        <p className="font-medium text-slate-900 text-sm line-clamp-2">{relatedEvent.title}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(relatedEvent.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </Link>
                    ))}
                    <Link href={`/${region}/events`}>
                      <Button variant="ghost" size="sm" className="w-full">
                        View All Events
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
              
              {/* Need Help Card */}
              <Card style={{ backgroundColor: NAVY }}>
                <CardContent className="p-6 text-center">
                  <Heart className="h-10 w-10 mx-auto mb-3" style={{ color: SAGE_GREEN }} />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Need Help Finding Senior Care?
                  </h3>
                  <p className="text-sm text-white/80 mb-4">
                    Our {regionConfig.displayName} advisors are here to help—free of charge.
                  </p>
                  <a href={`tel:${phoneNumber.replace(/[^0-9+]/g, '')}`}>
                    <Button className="w-full bg-white hover:bg-slate-100" style={{ color: NAVY }}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call {phoneNumber}
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
