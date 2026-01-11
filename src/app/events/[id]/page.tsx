import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Video, Users, Award, ArrowLeft, ExternalLink, Share2 } from 'lucide-react';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { SeniorEvent } from '@/types/events';
import NeighborhoodEvents from '@/components/events/NeighborhoodEvents';

// Expert badge color (Sage Green)
const SAGE_GREEN = '#8DA399';

// Edge caching
export const revalidate = 3600;

async function getEvent(id: string): Promise<SeniorEvent | null> {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    // Fetch single event from API (we'll need to add this endpoint)
    // For now, fetch all and filter
    const res = await fetch(`${baseUrl}/api/events?limit=100&upcoming=false`, {
      next: { revalidate: 3600 },
    });
    
    if (!res.ok) return null;
    
    const data = await res.json();
    const event = data.events?.find((e: SeniorEvent) => e.id === id);
    return event || null;
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
}

// Dynamic metadata
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const event = await getEvent(params.id);
  
  if (!event) {
    return {
      title: 'Event Not Found | Guide for Seniors',
    };
  }
  
  const eventDate = new Date(event.start_date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const location = event.neighborhood || 'Cleveland';
  
  return {
    title: `${event.title} | ${location} Senior Event | Guide for Seniors`,
    description: event.description || `Join us for ${event.title} on ${eventDate} in ${location}, Ohio. Free senior event for Cleveland area residents.`,
    keywords: `${event.title}, senior event ${location} ohio, ${event.event_type === 'expert_webinar' ? 'senior webinar cleveland' : 'senior community event cleveland'}`,
    openGraph: {
      title: event.title,
      description: event.description || `Senior event in ${location}, Ohio on ${eventDate}`,
      url: `https://guideforseniors.com/events/${event.id}`,
      siteName: 'Guide for Seniors',
      locale: 'en_US',
      type: 'website',
      images: event.image_url ? [{ url: event.image_url }] : [],
    },
    alternates: {
      canonical: `https://guideforseniors.com/events/${event.id}`,
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

export default async function EventPage({ params }: { params: { id: string } }) {
  const event = await getEvent(params.id);
  
  if (!event) {
    notFound();
  }
  
  const isExpertWebinar = event.event_type === 'expert_webinar';
  const neighborhoodSlug = event.neighborhood?.toLowerCase().replace(/\s+/g, '-');

  return (
    <>
      {/* Inject JSON-LD Schema */}
      {event.schema_json && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(event.schema_json),
          }}
        />
      )}

      <main className="min-h-screen flex flex-col bg-slate-50">
        <Header />

        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                Home
              </Link>
              <span className="text-muted-foreground">/</span>
              <Link href="/events" className="text-muted-foreground hover:text-foreground">
                Events
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground font-medium truncate max-w-[200px]">
                {event.title}
              </span>
            </nav>
          </div>
        </div>

        {/* Event Content */}
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Back Link */}
              <Link href="/events" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />
                Back to Events
              </Link>

              {/* Event Card */}
              <Card className="overflow-hidden">
                {/* Expert Webinar Banner */}
                {isExpertWebinar && (
                  <div 
                    className="px-6 py-3 flex items-center gap-2"
                    style={{ backgroundColor: SAGE_GREEN }}
                  >
                    <Award className="h-5 w-5 text-white" />
                    <span className="text-white font-semibold">
                      Led by a 20-Year Regional Director & Hospice Liaison
                    </span>
                  </div>
                )}

                <CardContent className="p-6 md:p-8">
                  {/* Title */}
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    {event.title}
                  </h1>

                  {/* Event Meta */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    <Badge 
                      variant={event.is_virtual ? 'secondary' : 'outline'}
                      className="text-sm py-1 px-3"
                    >
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
                    <Badge variant="outline" className="text-sm py-1 px-3">
                      {isExpertWebinar ? 'Expert Webinar' : 'Community Event'}
                    </Badge>
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-semibold">{formatEventDate(event.start_date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p className="font-semibold">{formatEventTime(event.start_date)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-3 mb-6 p-4 bg-slate-50 rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-semibold">{event.location_name || 'TBD'}</p>
                      {event.neighborhood && (
                        <Link 
                          href={`/location/${neighborhoodSlug}`}
                          className="text-sm text-primary hover:underline"
                        >
                          {event.neighborhood}, Ohio
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {event.description && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold mb-3">About This Event</h2>
                      <p className="text-muted-foreground leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  )}

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t">
                    {event.location_url && (
                      <a href={event.location_url} target="_blank" rel="noopener noreferrer">
                        <Button className="gap-2">
                          Register / Learn More
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </a>
                    )}
                    <Button variant="outline" className="gap-2">
                      <Share2 className="h-4 w-4" />
                      Share Event
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Source Attribution */}
              {event.source_name && (
                <p className="text-sm text-muted-foreground">
                  Event sourced from{' '}
                  {event.source_url ? (
                    <a 
                      href={event.source_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {event.source_name}
                    </a>
                  ) : (
                    event.source_name
                  )}
                </p>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* More Events in Neighborhood */}
              {event.neighborhood && (
                <NeighborhoodEvents 
                  neighborhood={event.neighborhood}
                  limit={3}
                  showHeader={true}
                />
              )}

              {/* Expert CTA */}
              <Card className="bg-primary text-white">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-2">Questions About Senior Care?</h3>
                  <p className="text-white/80 text-sm mb-4">
                    Our Cleveland advisors provide free guidance on assisted living, memory care, and more.
                  </p>
                  <Link href="/contact">
                    <Button variant="secondary" className="w-full">
                      Get Free Expert Help
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Internal Links */}
              {event.neighborhood && (
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-3">Explore {event.neighborhood}</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <Link 
                          href={`/location/${neighborhoodSlug}`}
                          className="text-primary hover:underline"
                        >
                          Senior Living in {event.neighborhood} →
                        </Link>
                      </li>
                      <li>
                        <Link 
                          href={`/events?neighborhood=${encodeURIComponent(event.neighborhood)}`}
                          className="text-primary hover:underline"
                        >
                          All {event.neighborhood} Events →
                        </Link>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              )}
            </aside>
          </div>
        </div>

        <Footer />
      </main>
    </>
  );
}
