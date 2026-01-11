'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Calendar, List, MapPin, Clock, Video, Users, ChevronLeft, ChevronRight, ExternalLink, Award, Phone } from 'lucide-react';
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

// Event Card Component
function EventCard({ event, compact = false }: { event: SeniorEvent; compact?: boolean }) {
  const isExpertWebinar = event.event_type === 'expert_webinar';
  const neighborhoodSlug = event.neighborhood?.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`group hover:shadow-lg transition-all duration-300 border-l-4 ${
        isExpertWebinar ? 'border-l-[#8DA399]' : 'border-l-teal-500'
      } ${compact ? 'p-3' : ''}`}>
        <CardHeader className={compact ? 'p-0 pb-2' : ''}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              {/* Expert Webinar Badge */}
              {isExpertWebinar && (
                <div 
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-2"
                  style={{ backgroundColor: SAGE_GREEN, color: 'white' }}
                >
                  <Award className="h-3.5 w-3.5" />
                  Led by a 20-Year Regional Director & Hospice Liaison
                </div>
              )}
              
              <CardTitle className={`${compact ? 'text-base' : 'text-lg'} group-hover:text-teal-600 transition-colors line-clamp-2`}>
                {event.title}
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
                  <Users className="h-3 w-3 mr-1" />
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
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-sm">
              <MapPin className="h-4 w-4 text-slate-400" />
              {event.neighborhood ? (
                <Link 
                  href={`/location/${neighborhoodSlug}`}
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
            {event.location_url && (
              <a 
                href={event.location_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-teal-600 hover:underline inline-flex items-center gap-1"
              >
                Details
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
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
          {dayEvents.slice(0, 2).map(event => (
            <div
              key={event.id}
              className={`text-xs px-1.5 py-0.5 rounded truncate cursor-pointer hover:opacity-80 ${
                event.event_type === 'expert_webinar' 
                  ? 'bg-[#8DA399] text-white' 
                  : 'bg-teal-100 text-teal-700'
              }`}
              title={event.title}
            >
              {event.title}
            </div>
          ))}
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
      <div className="flex items-center gap-4 px-4 py-3 border-t bg-slate-50/50 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-teal-100" />
          <span className="text-slate-600">Community Event</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: SAGE_GREEN }} />
          <span className="text-slate-600">Expert Webinar</span>
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
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedType(null)}
              className={`rounded-lg border ${selectedType === null ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white border-teal-600' : 'border-slate-200 text-slate-600 hover:text-teal-600 hover:border-teal-200'}`}
            >
              All Events
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedType('community_event')}
              className={`rounded-lg border ${selectedType === 'community_event' ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white border-teal-600' : 'border-slate-200 text-slate-600 hover:text-teal-600 hover:border-teal-200'}`}
            >
              <Users className="h-4 w-4 mr-1" />
              Community
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedType('expert_webinar')}
              className={`rounded-lg border ${selectedType === 'expert_webinar' ? 'text-white border-[#8DA399]' : 'border-slate-200 text-slate-600 hover:text-[#8DA399] hover:border-[#8DA399]'}`}
              style={selectedType === 'expert_webinar' ? { backgroundColor: SAGE_GREEN } : {}}
            >
              <Award className="h-4 w-4 mr-1" />
              Expert
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
            {/* Expert Webinar Promo */}
            <Card className="border-2 shadow-md" style={{ borderColor: SAGE_GREEN }}>
              <CardHeader>
                <div 
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-2 w-fit"
                  style={{ backgroundColor: SAGE_GREEN, color: 'white' }}
                >
                  <Award className="h-3.5 w-3.5" />
                  Expert-Led Events
                </div>
                <CardTitle className="text-lg text-slate-900">Free Webinars with Cleveland Healthcare Experts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-4">
                  Join our monthly webinars led by a 20-year Regional Director & Hospice Liaison. 
                  Get expert guidance on senior care options in Cleveland.
                </p>
                <ul className="text-sm space-y-2 mb-4 text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-[#8DA399] mt-0.5">✓</span>
                    <span>Medicare & Medicaid guidance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#8DA399] mt-0.5">✓</span>
                    <span>Cleveland Clinic & St. John partnerships</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#8DA399] mt-0.5">✓</span>
                    <span>Assisted living vs memory care</span>
                  </li>
                </ul>
                <Link href="/contact">
                  <Button className="w-full text-white hover:opacity-90" style={{ backgroundColor: SAGE_GREEN }}>
                    Get Notified of Next Webinar
                  </Button>
                </Link>
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
                      href={`/location/${hood.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <Badge variant="outline" className="hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 cursor-pointer transition-colors">
                        {hood}
                      </Badge>
                    </Link>
                  ))}
                </div>
                <Link href="/greater-cleveland" className="text-sm text-teal-600 hover:underline mt-3 inline-block font-medium">
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
