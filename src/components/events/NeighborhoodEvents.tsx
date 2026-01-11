'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Video, Users, Award, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SeniorEvent } from '@/types/events';

interface NeighborhoodEventsProps {
  neighborhood: string;
  limit?: number;
  showHeader?: boolean;
  className?: string;
}

// Expert badge color (Sage Green)
const SAGE_GREEN = '#8DA399';

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

// Format date for display
function formatEventDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function formatEventTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * NeighborhoodEvents Widget
 * 
 * A reusable component that displays upcoming events for a specific neighborhood.
 * Designed to be embedded on neighborhood/city silo pages.
 * 
 * Features:
 * - Fetches top 3 (or custom limit) upcoming events
 * - Expert webinar badge highlighting
 * - Links back to main events hub
 * - Responsive design
 */
export default function NeighborhoodEvents({ 
  neighborhood, 
  limit = 3, 
  showHeader = true,
  className = '' 
}: NeighborhoodEventsProps) {
  const [events, setEvents] = useState<SeniorEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch(
          `/api/events?neighborhood=${encodeURIComponent(neighborhood)}&limit=${limit}&upcoming=true`
        );
        
        if (!res.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const data = await res.json();
        setEvents(data.events || []);
      } catch (err) {
        console.error('Error fetching neighborhood events:', err);
        setError('Unable to load events');
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [neighborhood, limit]);

  if (loading) {
    return (
      <div className={`bg-white rounded-xl border shadow-sm p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 rounded w-1/2" />
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-slate-100 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || events.length === 0) {
    return (
      <div className={`bg-white rounded-xl border shadow-sm p-6 ${className}`}>
        {showHeader && (
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Upcoming Events in {neighborhood}
          </h3>
        )}
        <div className="text-center py-6 text-muted-foreground">
          <Calendar className="h-10 w-10 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No upcoming events in {neighborhood} at this time.</p>
          <Link href="/events" className="text-sm text-primary hover:underline mt-2 inline-block">
            View all Cleveland events →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl border shadow-sm overflow-hidden ${className}`}>
      {showHeader && (
        <div className="px-6 py-4 border-b bg-slate-50/50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Upcoming Events in {neighborhood}
            </h3>
            <Link href={`/events?neighborhood=${encodeURIComponent(neighborhood)}`}>
              <Badge variant="outline" className="hover:bg-primary/10 cursor-pointer">
                View All
              </Badge>
            </Link>
          </div>
        </div>
      )}

      <div className="divide-y">
        {events.map((event, index) => {
          const isMedicalWellness = event.event_type === 'medical_wellness';
          const isLuxuryShowcase = event.event_type === 'luxury_showcase';
          const eventSlug = generateSlug(event.title);
          
          return (
            <Link
              key={event.id}
              href={`/events/${eventSlug}`}
              className="block"
            >
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 hover:bg-slate-50/50 transition-colors cursor-pointer"
              >
                {/* Event Type Badge */}
                {isMedicalWellness && (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold mb-2 bg-blue-100 text-blue-700">
                    <Award className="h-3 w-3" />
                    Medical & Wellness
                  </div>
                )}
                {isLuxuryShowcase && (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold mb-2 bg-amber-100 text-amber-700">
                    <Award className="h-3 w-3" />
                    Luxury Showcase
                  </div>
                )}
                
                {/* Event Title */}
                <h4 className="font-medium text-foreground mb-2 line-clamp-1 group-hover:text-primary">
                  {event.title}
                </h4>
                
                {/* Event Details */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatEventDate(event.start_date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {formatEventTime(event.start_date)}
                  </span>
                  <Badge 
                    variant="secondary" 
                    className="text-xs py-0"
                  >
                    {event.is_virtual ? (
                      <>
                        <Video className="h-3 w-3 mr-1" />
                        Virtual
                      </>
                    ) : (
                      <>
                        <Users className="h-3 w-3 mr-1" />
                        In-Person
                      </>
                    )}
                  </Badge>
                </div>
                
                {/* Location */}
                {event.location_name && (
                  <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {event.location_name}
                  </p>
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div className="px-6 py-4 bg-slate-50/50 border-t">
        <Link href="/events" className="w-full">
          <Button variant="outline" className="w-full group">
            View All Cleveland Events
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

/**
 * Server-side prefetch function for SSR/SSG pages
 * Use this in page components that need events data at build time
 */
export async function prefetchNeighborhoodEvents(
  neighborhood: string, 
  limit: number = 3
): Promise<SeniorEvent[]> {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    const res = await fetch(
      `${baseUrl}/api/events?neighborhood=${encodeURIComponent(neighborhood)}&limit=${limit}&upcoming=true`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    
    if (!res.ok) {
      return [];
    }
    
    const data = await res.json();
    return data.events || [];
  } catch (error) {
    console.error('Error prefetching neighborhood events:', error);
    return [];
  }
}
