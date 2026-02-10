'use client';

import React, { useState, useMemo } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { submitLead } from '@/app/actions/leads';

const TIME_SLOTS = [
  { value: '9:00 AM', label: '9:00 AM' },
  { value: '10:00 AM', label: '10:00 AM' },
  { value: '11:00 AM', label: '11:00 AM' },
  { value: '1:00 PM', label: '1:00 PM' },
  { value: '2:00 PM', label: '2:00 PM' },
  { value: '3:00 PM', label: '3:00 PM' },
  { value: '4:00 PM', label: '4:00 PM' },
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

interface TourSchedulerFormProps {
  communityName: string;
  communityId?: string;
  communityLocation?: string;
  sourceSlug?: string;
  onSuccess?: () => void;
}

export default function TourSchedulerForm({
  communityName,
  communityId,
  communityLocation,
  sourceSlug,
  onSuccess,
}: TourSchedulerFormProps) {
  const [step, setStep] = useState<'date' | 'contact' | 'success'>('date');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // Generate calendar days for current month view
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: (Date | null)[] = [];
    // Fill leading empty cells
    for (let i = 0; i < firstDay; i++) days.push(null);
    // Fill actual days
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(new Date(year, month, d));
    }
    return days;
  }, [currentMonth]);

  const isDateSelectable = (date: Date | null) => {
    if (!date) return false;
    // Must be today or later
    if (date < today) return false;
    // No Sundays (communities typically closed)
    if (date.getDay() === 0) return false;
    // Max 60 days out
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 60);
    if (date > maxDate) return false;
    return true;
  };

  const isSameDay = (a: Date | null, b: Date | null) => {
    if (!a || !b) return false;
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  };

  const formatSelectedDate = () => {
    if (!selectedDate) return '';
    return selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handlePrevMonth = () => {
    const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    if (prev >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setCurrentMonth(prev);
    }
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      setStep('contact');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    try {
      const tourDate = formatSelectedDate();
      const result = await submitLead({
        fullName: formData.get('name')?.toString() || '',
        email: formData.get('email')?.toString() || '',
        phone: formData.get('phone')?.toString() || '',
        communityName,
        communityId,
        cityOrZip: communityLocation?.split(',')[0]?.trim() || '',
        notes: `Tour scheduled: ${tourDate} at ${selectedTime} for ${communityName}`,
        pageType: 'community_page',
        sourceSlug: sourceSlug || communityId || 'tour-scheduler',
      });

      if (result.success) {
        setStep('success');
        onSuccess?.();
      }
    } catch (error) {
      console.error('Tour scheduling error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="text-center py-6 space-y-4">
        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto">
          <Check className="h-8 w-8 text-teal-600" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-slate-900">Tour Scheduled!</h3>
          <p className="text-sm text-slate-600 mt-1">
            {formatSelectedDate()} at {selectedTime}
          </p>
        </div>
        <p className="text-sm text-slate-500">
          We&apos;ll confirm your tour at {communityName} within 24 hours via phone or email.
        </p>
      </div>
    );
  }

  if (step === 'contact') {
    return (
      <div className="space-y-4">
        {/* Selected date/time summary */}
        <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-xl border border-teal-100">
          <Calendar className="h-5 w-5 text-teal-600 shrink-0" />
          <div>
            <p className="text-sm font-medium text-slate-900">{formatSelectedDate()}</p>
            <p className="text-xs text-teal-600">{selectedTime}</p>
          </div>
          <button
            type="button"
            onClick={() => setStep('date')}
            className="ml-auto text-xs text-teal-600 hover:text-teal-700 font-medium"
          >
            Change
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label htmlFor="tour-name" className="text-sm font-medium text-slate-700">Your Name</Label>
            <Input id="tour-name" name="name" required placeholder="Full name" className="h-11 mt-1" />
          </div>
          <div>
            <Label htmlFor="tour-phone" className="text-sm font-medium text-slate-700">Phone Number</Label>
            <Input id="tour-phone" name="phone" type="tel" required placeholder="(216) 555-0123" className="h-11 mt-1" />
          </div>
          <div>
            <Label htmlFor="tour-email" className="text-sm font-medium text-slate-700">Email</Label>
            <Input id="tour-email" name="email" type="email" required placeholder="you@email.com" className="h-11 mt-1" />
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep('date')}
              className="shrink-0"
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-12 font-bold bg-teal-600 hover:bg-teal-700"
            >
              {isSubmitting ? 'Scheduling...' : 'Confirm Tour'}
            </Button>
          </div>
          <p className="text-xs text-slate-400 text-center">
            We&apos;ll confirm within 24 hours. Free, no obligation.
          </p>
        </form>
      </div>
    );
  }

  // Date picker step
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Pick your preferred date and time to visit {communityName}.
      </p>

      {/* Calendar */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        {/* Month navigation */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-4 w-4 text-slate-600" />
          </button>
          <span className="font-semibold text-sm text-slate-900">
            {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <ChevronRight className="h-4 w-4 text-slate-600" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 text-center border-b border-slate-100">
          {DAYS.map((day) => (
            <div key={day} className="py-2 text-xs font-medium text-slate-400">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-px bg-slate-100 p-px">
          {calendarDays.map((date, i) => {
            const selectable = isDateSelectable(date);
            const selected = isSameDay(date, selectedDate);
            const isToday = isSameDay(date, today);

            return (
              <button
                key={i}
                type="button"
                disabled={!selectable}
                onClick={() => date && selectable && setSelectedDate(date)}
                className={`
                  aspect-square flex items-center justify-center text-sm bg-white transition-colors
                  ${!date ? 'bg-white' : ''}
                  ${selectable ? 'hover:bg-teal-50 cursor-pointer' : 'text-slate-300 cursor-default'}
                  ${selected ? 'bg-teal-600 text-white hover:bg-teal-700 font-bold' : ''}
                  ${isToday && !selected ? 'font-bold text-teal-600' : ''}
                `}
              >
                {date?.getDate() || ''}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4 text-teal-600" />
            Select a time
          </p>
          <div className="grid grid-cols-4 gap-2">
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot.value}
                type="button"
                onClick={() => setSelectedTime(slot.value)}
                className={`
                  py-2 px-1 rounded-lg text-xs font-medium border transition-colors
                  ${selectedTime === slot.value
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }
                `}
              >
                {slot.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Continue button */}
      <Button
        onClick={handleContinue}
        disabled={!selectedDate || !selectedTime}
        className="w-full h-12 font-bold bg-teal-600 hover:bg-teal-700"
      >
        Continue
      </Button>
    </div>
  );
}
