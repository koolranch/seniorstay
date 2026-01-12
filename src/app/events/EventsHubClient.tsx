'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Calendar, List, MapPin, Clock, Video, Users, ChevronLeft, ChevronRight, ExternalLink, Award, Phone, FileText, Building2, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SeniorEvent, CLEVELAND_NEIGHBORHOODS } from '@/types/events';

interface EventsHubClientProps {
  initialEvents: SeniorEvent[];
}

// Brand colors (matching homepage)
const SAGE_GREEN = '#8DA399';
const TEAL_600 = '#0d9488';
const TEAL_700 = '#0f766e';
const MEDICAL_BLUE = '#3b82f6';
const LUXURY_GOLD = '#d97706';

// Event type display config
const EVENT_TYPE_CONFIG = {
  community_hub: {
    label: 'Community Hub',
    color: TEAL_600,
    bgClass: 'bg-teal-100 text-teal-700',
    borderClass: 'border-l-teal-500',
    icon: Users,
  },
  medical_wellness: {
    label: 'Medical & Wellness',
    color: MEDICAL_BLUE,
    bgClass: 'bg-blue-100 text-blue-700',
    borderClass: 'border-l-blue-500',
    icon: Award,
  },
  luxury_showcase: {
    label: 'Luxury Showcase',
    color: LUXURY_GOLD,
    bgClass: 'bg-amber-100 text-amber-700',
    borderClass: 'border-l-amber-500',
    icon: ExternalLink,
  },
};

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

// Get month and year string
function getMonthYear(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

// Get days in month
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

// Get first day of month (0 = Sunday)
function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

// Event Card Component with Lead Hook CTA
function EventCard({ event, compact = false }: { event: SeniorEvent; compact?: boolean }) {
  const typeConfig = EVENT_TYPE_CONFIG[event.event_type] || EVENT_TYPE_CONFIG.community_hub;
  const neighborhoodSlug = event.neighborhood?.toLowerCase().replace(/\s+/g, '-');
  const eventSlug = generateSlug(event.title);
  const isMedical = event.event_type === 'medical_wellness';
  const isLuxury = event.event_type === 'luxury_showcase';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`group hover:shadow-lg transition-all duration-300 border-l-4 ${typeConfig.borderClass} ${compact ? 'p-3' : ''}`}>
        <CardHeader className={compact ? 'p-0 pb-2' : ''}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              {/* Event Type Badge */}
              <div 
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-2 ${typeConfig.bgClass}`}
              >
                {isMedical && <Heart className="h-3.5 w-3.5" />}
                {isLuxury && <Building2 className="h-3.5 w-3.5" />}
                {!isMedical && !isLuxury && <Users className="h-3.5 w-3.5" />}
                {typeConfig.label}
              </div>
              
              <CardTitle className={`${compact ? 'text-base' : 'text-lg'} group-hover:text-teal-600 transition-colors line-clamp-2`}>
                <Link href={`/events/${eventSlug}`} className="hover:underline">
                  {event.title}
                </Link>
              </CardTitle>
            </div>
            
            {/* Virtual/In-Person Badge */}
            <Badge 
              variant={event.is_virtual ? 'secondary' : 'outline'}
              className="shrink-0"
            >
              {event.is_virtual ? (
                <>
                  <Video className="h-3 w-3 mr-1" />
                  Virtual
                </>
              ) : (
                <>
                  <MapPin className="h-3 w-3 mr-1" />
                  In-Person
                </>
              )}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className={compact ? 'p-0' : ''}>
          {/* Date & Time */}
          <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-teal-600" />
              <span className="font-medium">{formatEventDate(event.start_date)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-teal-600" />
              <span>{formatEventTime(event.start_date)}</span>
            </div>
          </div>
          
          {/* Description */}
          {!compact && event.description && (
            <p className="text-sm text-slate-600 mb-3 line-clamp-2">
              {event.description}
            </p>
          )}
          
          {/* Location & Neighborhood Link */}
          <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
            <div className="flex items-center gap-1.5 text-sm">
              <MapPin className="h-4 w-4 text-slate-400" />
              {event.neighborhood ? (
                <Link 
                  href={`/cleveland/${neighborhoodSlug}`}
                  className="text-teal-600 hover:underline font-medium"
                >
                  {event.neighborhood}
                </Link>
              ) : (
                <span className="text-slate-500">Cleveland Area</span>
              )}
              {event.location_name && (
                <span className="text-slate-500">
                  · {event.location_name}
                </span>
              )}
            </div>
            
            {/* Event Link */}
            <Link 
              href={`/events/${eventSlug}`}
              className="text-sm text-teal-600 hover:underline inline-flex items-center gap-1 font-medium"
            >
              View Details →
            </Link>
          </div>
          
          {/* Lead Hook CTA - Links to 2026 Cost Report */}
          {!compact && event.neighborhood && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <Link 
                href={`/senior-living-costs-cleveland?neighborhood=${encodeURIComponent(event.neighborhood)}`}
                className="flex items-center gap-2 text-sm bg-gradient-to-r from-teal-50 to-blue-50 hover:from-teal-100 hover:to-blue-100 p-2 rounded-lg transition-colors group/cta"
              >
                <FileText className="h-4 w-4 text-teal-600 group-hover/cta:text-teal-700" />
                <span className="text-slate-700 group-hover/cta:text-slate-900">
                  Need help finding care in <strong className="text-teal-600">{event.neighborhood}</strong>?
                </span>
                <span className="ml-auto text-xs text-teal-600 font-semibold">
                  Free 2026 Cost Report →
                </span>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Calendar View Component
function CalendarView({ events, currentDate, onDateChange }: {
  events: SeniorEvent[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
}) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  // Group events by date
  const eventsByDate = useMemo(() => {
    const grouped: Record<string, SeniorEvent[]> = {};
    events.forEach(event => {
      const dateKey = new Date(event.start_date).toDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });
    return grouped;
  }, [events]);
  
  const days = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Add empty cells for days before the first of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-24 bg-slate-50/50" />);
  }
  
  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateKey = date.toDateString();
    const dayEvents = eventsByDate[dateKey] || [];
    const isToday = new Date().toDateString() === dateKey;
    
    days.push(
      <div 
        key={day} 
        className={`h-24 border border-slate-100 p-1 overflow-hidden hover:bg-slate-50 transition-colors ${
          isToday ? 'bg-teal-50 border-teal-200' : ''
        }`}
      >
        <div className={`text-sm font-medium mb-1 ${isToday ? 'text-teal-600' : 'text-slate-600'}`}>
          {day}
        </div>
        <div className="space-y-0.5">
          {dayEvents.slice(0, 2).map(event => {
            const config = EVENT_TYPE_CONFIG[event.event_type] || EVENT_TYPE_CONFIG.community_hub;
            return (
              <div
                key={event.id}
                className={`text-xs px-1.5 py-0.5 rounded truncate cursor-pointer hover:opacity-80 ${config.bgClass}`}
                title={event.title}
              >
                {event.title}
              </div>
            );
          })}
          {dayEvents.length > 2 && (
            <div className="text-xs text-slate-500 px-1.5">
              +{dayEvents.length - 2} more
            </div>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      {/* Calendar Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDateChange(new Date(year, month - 1, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-semibold">{getMonthYear(currentDate)}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDateChange(new Date(year, month + 1, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Day Names */}
      <div className="grid grid-cols-7 bg-slate-50/50">
        {dayNames.map(name => (
          <div key={name} className="text-center py-2 text-sm font-medium text-slate-500">
            {name}
          </div>
        ))}
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {days}
      </div>
      
      {/* Legend */}
      <div className="flex items-center gap-4 px-4 py-3 border-t bg-slate-50/50 text-sm flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-teal-100" />
          <span className="text-slate-600">Community Hub</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-100" />
          <span className="text-slate-600">Medical & Wellness</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-amber-100" />
          <span className="text-slate-600">Luxury Showcase</span>
        </div>
      </div>
    </div>
  );
}

// List View Component
function ListView({ events }: { events: SeniorEvent[] }) {
  // Group events by date
  const groupedEvents = useMemo(() => {
    const groups: { date: string; events: SeniorEvent[] }[] = [];
    let currentDate = '';
    
    events.forEach(event => {
      const eventDate = formatEventDate(event.start_date);
      if (eventDate !== currentDate) {
        currentDate = eventDate;
        groups.push({ date: eventDate, events: [] });
      }
      groups[groups.length - 1].events.push(event);
    });
    
    return groups;
  }, [events]);
  
  if (events.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm">
        <Calendar className="h-12 w-12 mx-auto text-slate-400 mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">No upcoming events</h3>
        <p className="text-slate-600">Check back soon for new events in your area.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <AnimatePresence mode="popLayout">
        {groupedEvents.map(group => (
          <motion.div
            key={group.date}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3 sticky top-0 bg-gradient-to-r from-slate-50/95 to-white/95 backdrop-blur-sm py-2 z-10">
              {group.date}
            </h3>
            <div className="space-y-3">
              {group.events.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default function EventsHubClient({ initialEvents }: EventsHubClientProps) {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  // Filter events
  const filteredEvents = useMemo(() => {
    return initialEvents.filter(event => {
      if (selectedNeighborhood && event.neighborhood !== selectedNeighborhood) {
        return false;
      }
      if (selectedType && event.event_type !== selectedType) {
        return false;
      }
      return true;
    });
  }, [initialEvents, selectedNeighborhood, selectedType]);
  
  // Get unique neighborhoods from events
  const eventNeighborhoods = useMemo(() => {
    const neighborhoods = new Set<string>();
    initialEvents.forEach(event => {
      if (event.neighborhood) {
        neighborhoods.add(event.neighborhood);
      }
    });
    return Array.from(neighborhoods).sort();
  }, [initialEvents]);
  
  return (
    <section className="py-8 md:py-12 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 p-1 shadow-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView('list')}
              className={`gap-2 rounded-lg ${view === 'list' ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800' : 'text-slate-600 hover:text-teal-600'}`}
            >
              <List className="h-4 w-4" />
              List
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView('calendar')}
              className={`gap-2 rounded-lg ${view === 'calendar' ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800' : 'text-slate-600 hover:text-teal-600'}`}
            >
              <Calendar className="h-4 w-4" />
              Calendar
            </Button>
          </div>
          
          {/* Neighborhood Filter */}
          <div className="flex-1">
            <Tabs 
              value={selectedNeighborhood || 'all'} 
              onValueChange={(v) => setSelectedNeighborhood(v === 'all' ? null : v)}
              className="w-full"
            >
              <TabsList className="w-full justify-start overflow-x-auto flex-nowrap bg-white border border-slate-200 h-auto p-1 rounded-xl shadow-sm">
                <TabsTrigger value="all" className="shrink-0 data-[state=active]:bg-teal-600 data-[state=active]:text-white rounded-lg">
                  All Areas
                </TabsTrigger>
                {eventNeighborhoods.map(hood => (
                  <TabsTrigger key={hood} value={hood} className="shrink-0 data-[state=active]:bg-teal-600 data-[state=active]:text-white rounded-lg">
                    {hood}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          
          {/* Event Type Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedType(null)}
              className={`rounded-lg border ${selectedType === null ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white border-teal-600' : 'border-slate-200 text-slate-600 hover:text-teal-600 hover:border-teal-200'}`}
            >
              All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedType('community_hub')}
              className={`rounded-lg border ${selectedType === 'community_hub' ? 'bg-teal-100 text-teal-700 border-teal-300' : 'border-slate-200 text-slate-600 hover:text-teal-600 hover:border-teal-200'}`}
            >
              <Users className="h-4 w-4 mr-1" />
              Community
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedType('medical_wellness')}
              className={`rounded-lg border ${selectedType === 'medical_wellness' ? 'bg-blue-100 text-blue-700 border-blue-300' : 'border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200'}`}
            >
              <Heart className="h-4 w-4 mr-1" />
              Medical
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedType('luxury_showcase')}
              className={`rounded-lg border ${selectedType === 'luxury_showcase' ? 'bg-amber-100 text-amber-700 border-amber-300' : 'border-slate-200 text-slate-600 hover:text-amber-600 hover:border-amber-200'}`}
            >
              <Building2 className="h-4 w-4 mr-1" />
              Luxury
            </Button>
          </div>
        </div>
        
        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-600">
            Showing <span className="font-semibold text-slate-900">{filteredEvents.length}</span> upcoming events
            {selectedNeighborhood && (
              <> in <span className="font-semibold text-slate-900">{selectedNeighborhood}</span></>
            )}
          </p>
        </div>
        
        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {view === 'list' ? (
              <ListView events={filteredEvents} />
            ) : (
              <CalendarView 
                events={filteredEvents}
                currentDate={currentDate}
                onDateChange={setCurrentDate}
              />
            )}
          </div>
          
          {/* Sidebar */}
          <aside className="space-y-6">
            {/* 2026 Cost Report CTA - Lead Magnet */}
            <Card className="border-2 border-teal-200 shadow-md bg-gradient-to-br from-teal-50 to-white">
              <CardHeader>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-2 w-fit bg-teal-600 text-white">
                  <FileText className="h-3.5 w-3.5" />
                  Free Download
                </div>
                <CardTitle className="text-lg text-slate-900">2026 Cleveland Senior Living Cost Report</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-4">
                  Neighborhood-by-neighborhood pricing breakdown for assisted living, memory care, 
                  and independent living in Greater Cleveland.
                </p>
                <ul className="text-sm space-y-2 mb-4 text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 mt-0.5">✓</span>
                    <span>Average costs by neighborhood</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 mt-0.5">✓</span>
                    <span>VA & Medicaid eligibility info</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 mt-0.5">✓</span>
                    <span>Hidden fees checklist</span>
                  </li>
                </ul>
                <Link href="/senior-living-costs-cleveland">
                  <Button className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white">
                    Get Your Free Report
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            {/* Medical & Wellness Events */}
            <Card className="border-2 border-blue-200 shadow-md">
              <CardHeader>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-2 w-fit bg-blue-100 text-blue-700">
                  <Heart className="h-3.5 w-3.5" />
                  Medical & Wellness
                </div>
                <CardTitle className="text-lg text-slate-900">Cleveland Clinic & UH Events</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-4">
                  Health screenings, wellness workshops, and educational seminars from 
                  Cleveland&apos;s top healthcare systems.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                  onClick={() => setSelectedType('medical_wellness')}
                >
                  View Medical Events
                </Button>
              </CardContent>
            </Card>
            
            {/* Quick Links to Neighborhood Pages */}
            <Card className="shadow-md border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-slate-900">
                  <MapPin className="h-5 w-5 text-teal-600" />
                  Explore Neighborhoods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-4">
                  Find senior living communities and resources in your area.
                </p>
                <div className="flex flex-wrap gap-2">
                  {CLEVELAND_NEIGHBORHOODS.slice(0, 8).map(hood => (
                    <Link 
                      key={hood}
                      href={`/cleveland/${hood.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <Badge variant="outline" className="hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 cursor-pointer transition-colors">
                        {hood}
                      </Badge>
                    </Link>
                  ))}
                </div>
                <Link href="/cleveland" className="text-sm text-teal-600 hover:underline mt-3 inline-block font-medium">
                  View all neighborhoods →
                </Link>
              </CardContent>
            </Card>
            
            {/* CTA Card */}
            <Card className="bg-gradient-to-br from-teal-600 to-teal-700 text-white shadow-lg">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">Need Help Finding Care?</h3>
                <p className="text-white/90 text-sm mb-4">
                  Our local Cleveland advisors provide free, personalized guidance for families.
                </p>
                <Link href="/contact">
                  <Button variant="secondary" className="w-full bg-white text-teal-700 hover:bg-slate-100 font-bold">
                    Get Free Guidance
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </section>
  );
}
