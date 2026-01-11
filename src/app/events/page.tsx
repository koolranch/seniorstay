import { Metadata } from 'next';
import EventsHubClient from './EventsHubClient';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { SeniorEvent } from '@/types/events';

export const metadata: Metadata = {
  title: 'Cleveland Senior Events Calendar | Free Community & Expert Events | Guide for Seniors',
  description: 'Discover senior events in Cleveland, OH. Free workshops, webinars led by 20-year healthcare experts, and community activities. Westlake, Beachwood, Parma, and more.',
  keywords: 'cleveland senior events, senior activities cleveland ohio, senior webinars cleveland, elder care workshops cleveland, senior community events ohio',
  openGraph: {
    title: 'Cleveland Senior Events Hub | Guide for Seniors',
    description: 'Free senior events, expert webinars, and community activities across Greater Cleveland. Find events in your neighborhood today.',
    url: 'https://guideforseniors.com/events',
    siteName: 'Guide for Seniors',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://guideforseniors.com/og-events.jpg',
        width: 1200,
        height: 630,
        alt: 'Cleveland Senior Events Calendar',
      },
    ],
  },
  alternates: {
    canonical: 'https://guideforseniors.com/events',
  },
};

// Edge caching configuration
export const revalidate = 3600; // Revalidate every hour

async function getEvents(): Promise<SeniorEvent[]> {
  try {
    // Server-side fetch with absolute URL for production
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    const res = await fetch(`${baseUrl}/api/events?limit=50&upcoming=true`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    
    if (!res.ok) {
      console.error('Failed to fetch events:', res.statusText);
      return [];
    }
    
    const data = await res.json();
    return data.events || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

// Generate aggregated schema for the events page
function generateEventsListSchema(events: SeniorEvent[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Cleveland Senior Events',
    description: 'Upcoming senior events, workshops, and webinars in Greater Cleveland, Ohio',
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
          name: event.location_name || 'Cleveland, OH',
          address: {
            '@type': 'PostalAddress',
            addressLocality: event.neighborhood || 'Cleveland',
            addressRegion: 'OH',
          },
        },
      },
    })),
  };
}

export default async function EventsPage() {
  const events = await getEvents();
  const eventsListSchema = generateEventsListSchema(events);

  return (
    <>
      {/* Structured Data for Events Hub */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(eventsListSchema),
        }}
      />

      <main className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
        <Header />
        
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-[#1a365d] via-[#234876] to-[#2d5a8a] py-16 md:py-20">
          <div className="absolute inset-0 bg-[url('/images/pattern-dots.svg')] opacity-5" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/90 text-sm font-medium mb-4 backdrop-blur-sm">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                Updated Weekly
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
                Cleveland Senior Events Hub
              </h1>
              <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl">
                Free community events, expert-led webinars, and activities for seniors 
                across Greater Cleveland. Find events in Westlake, Beachwood, Parma, and beyond.
              </p>
            </div>
          </div>
          
          {/* Decorative wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
              <path d="M0 80L60 74.7C120 69 240 59 360 53.3C480 48 600 48 720 53.3C840 59 960 69 1080 69.3C1200 69 1320 59 1380 53.3L1440 48V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="#f8fafc"/>
            </svg>
          </div>
        </section>

        {/* Events Content */}
        <EventsHubClient initialEvents={events} />

        <Footer />
      </main>
    </>
  );
}
