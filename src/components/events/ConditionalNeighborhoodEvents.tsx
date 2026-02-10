'use client';

import React, { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import NeighborhoodEvents from './NeighborhoodEvents';

interface ConditionalNeighborhoodEventsProps {
  neighborhood: string;
  limit?: number;
}

/**
 * Wrapper that only renders the NeighborhoodEvents card if events actually exist.
 * Prevents showing an empty "No upcoming events" card on community pages.
 */
export default function ConditionalNeighborhoodEvents({
  neighborhood,
  limit = 2,
}: ConditionalNeighborhoodEventsProps) {
  const [hasEvents, setHasEvents] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkEvents() {
      try {
        const res = await fetch(
          `/api/events?neighborhood=${encodeURIComponent(neighborhood)}&limit=1&upcoming=true`
        );
        if (res.ok) {
          const data = await res.json();
          setHasEvents((data.events || []).length > 0);
        } else {
          setHasEvents(false);
        }
      } catch {
        setHasEvents(false);
      }
    }
    checkEvents();
  }, [neighborhood]);

  // Don't render anything while checking or if no events
  if (hasEvents === null || hasEvents === false) return null;

  return (
    <div className="rounded-2xl overflow-hidden border bg-white" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
      <div className="px-5 py-4 border-b" style={{ backgroundColor: 'rgba(141, 163, 153, 0.08)' }}>
        <h3 className="font-semibold flex items-center gap-2 text-slate-900">
          <Calendar className="h-5 w-5" style={{ color: '#8DA399' }} />
          Neighborhood Pulse
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">Upcoming events in {neighborhood}</p>
      </div>
      <NeighborhoodEvents
        neighborhood={neighborhood}
        limit={limit}
        showHeader={false}
        className="border-0 shadow-none rounded-none"
      />
    </div>
  );
}
