import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import EventsHubClient from '@/app/events/EventsHubClient';
import GlobalHeader from '@/components/home/GlobalHeader';
import Footer from '@/components/footer/Footer';
import { SeniorEvent } from '@/types/events';
import { getRegionConfig, isValidRegion, getAllRegionSlugs } from '@/data/regions';

interface RegionEventsPageProps {
  params: { region: string };
}

// Generate static params for all regions
export async function generateStaticParams() {
  return getAllRegionSlugs().map((region) => ({
    region,
  }));
}

// Generate dynamic metadata based on region
export async function generateMetadata({ params }: RegionEventsPageProps): Promise<Metadata> {
  const { region } = params;
  const regionConfig = getRegionConfig(region);
  
  if (!regionConfig) {
    return {
      title: 'Events Not Found | Guide for Seniors',
      description: 'The requested events page could not be found.',
    };
  }

  const baseUrl = 'https://www.guideforseniors.com';
  const canonicalUrl = `${baseUrl}/${region}/events`;

  return {
    title: `${regionConfig.displayName} Senior Events Calendar | Free Community & Expert Events | Guide for Seniors`,
    description: `Discover senior events in ${regionConfig.displayName}. Free workshops, webinars led by healthcare experts, and community activities across ${regionConfig.metroName}.`,
    keywords: `${regionConfig.primaryCity.toLowerCase()} senior events, senior activities ${regionConfig.primaryCity.toLowerCase()} ohio, senior webinars ${regionConfig.primaryCity.toLowerCase()}, elder care workshops ${regionConfig.primaryCity.toLowerCase()}, senior community events ohio`,
    openGraph: {
      title: `${regionConfig.displayName} Senior Events Hub | Guide for Seniors`,
      description: `Free senior events, expert webinars, and community activities across ${regionConfig.displayName}. Find events in your neighborhood today.`,
      url: canonicalUrl,
      siteName: 'Guide for Seniors',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/og-events.jpg`,
          width: 1200,
          height: 630,
          alt: `${regionConfig.displayName} Senior Events Calendar`,
        },
      ],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

// Direct Supabase client for server-side fetching
const supabaseUrl = 'https://hncgnxbooghjhpncujzx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuY2dueGJvb2doamhwbmN1anp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMTI0ODIsImV4cCI6MjA1OTc4ODQ4Mn0.mdAL87W0h4PN7Xu8ESjjDxzjW_H3YH55i-FqAE5SXcs';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Dynamic rendering for fresh data
export const dynamic = 'force-dynamic';

async function getEvents(): Promise<SeniorEvent[]> {
  try {
    // Fetch directly from Supabase for reliability
    // Note: For now, all events are Cleveland-region events
    // When we add more regions, we'll filter by region_slug
    const { data: events, error } = await supabase
      .from('senior_events')
      .select('*')
      .gte('start_date', new Date().toISOString())
      .order('start_date', { ascending: true })
      .limit(50);
    
    if (error) {
      console.error('Failed to fetch events:', error.message);
      return [];
    }
    
    return (events as SeniorEvent[]) || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

// Generate aggregated schema for the events page
function generateEventsListSchema(events: SeniorEvent[], regionConfig: NonNullable<ReturnType<typeof getRegionConfig>>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${regionConfig.displayName} Senior Events`,
    description: `Upcoming senior events, workshops, and webinars in ${regionConfig.displayName}, Ohio`,
    numberOfItems: events.length,
    itemListElement: events.slice(0, 10).map((event, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: event.schema_json || {
        '@type': 'Event',
        name: event.title,
        startDate: event.start_date,
        location: {
          '@type': 'Place',
          name: event.location_name || `${regionConfig.primaryCity}, OH`,
          address: {
            '@type': 'PostalAddress',
            addressLocality: event.neighborhood || regionConfig.primaryCity,
            addressRegion: 'OH',
          },
        },
      },
    })),
  };
}

export default async function RegionEventsPage({ params }: RegionEventsPageProps) {
  const { region } = params;
  
  // Validate region
  if (!isValidRegion(region)) {
    notFound();
  }
  
  const regionConfig = getRegionConfig(region);
  if (!regionConfig) {
    notFound();
  }

  const events = await getEvents();
  const eventsListSchema = generateEventsListSchema(events, regionConfig);

  return (
    <>
      {/* Structured Data for Events Hub */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(eventsListSchema),
        }}
      />

      <main className="min-h-screen flex flex-col">
        <GlobalHeader />
        
        {/* Hero Section - Matching Homepage Style */}
        <section className="relative bg-gradient-to-b from-slate-50 via-white to-slate-50 py-16 md:py-24 overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-[0.02]">
            <div 
              className="absolute inset-0" 
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23334155' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }} 
            />
          </div>

          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-teal-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 text-teal-700 text-sm font-medium mb-6 border border-teal-100">
                <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
                Updated Weekly
              </span>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 leading-tight tracking-tight">
                {regionConfig.displayName} Senior Events—
                <span className="text-teal-600">Your Local Hub</span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Community centers, luxury showcases, and wellness events 
                across {regionConfig.displayName}. Find events in your neighborhood.
              </p>

              {/* Trust indicators - matching new event types */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full" />
                  <span>Community Hubs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>Medical & Wellness</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full" />
                  <span>Luxury Showcases</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Events Content */}
        <EventsHubClient initialEvents={events} regionSlug={region} />

        <Footer />
      </main>
    </>
  );
}
