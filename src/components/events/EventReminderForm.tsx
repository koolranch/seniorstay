'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, CheckCircle, Loader2, Mail, FileText } from 'lucide-react';

interface EventReminderFormProps {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  neighborhood: string | null;
}

export default function EventReminderForm({
  eventId,
  eventTitle,
  eventDate,
  neighborhood,
}: EventReminderFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setErrorMessage('Please enter your email');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/events/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          eventId,
          eventTitle,
          eventDate,
          neighborhood,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign up');
      }

      setStatus('success');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
        <p className="text-green-800 font-semibold mb-1">You&apos;re all set!</p>
        <p className="text-green-600 text-sm">
          Check your email for the event reminder and your free{' '}
          {neighborhood ? `${neighborhood} ` : ''}Cost Report.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
        <Bell className="h-4 w-4 text-teal-600" />
        <span>Get a reminder + free Cost Report</span>
      </div>
      
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-500" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-sm text-slate-700 placeholder:text-slate-400 shadow-sm hover:border-teal-300 transition-colors"
          disabled={status === 'loading'}
        />
      </div>

      {status === 'error' && errorMessage && (
        <p className="text-red-600 text-xs">{errorMessage}</p>
      )}

      <Button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold"
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Signing up...
          </>
        ) : (
          <>
            <FileText className="h-4 w-4 mr-2" />
            Send Me the Reminder
          </>
        )}
      </Button>

      <p className="text-xs text-slate-500 text-center">
        ✓ Event reminder 24hrs before<br />
        ✓ Free {neighborhood || 'Cleveland'} Cost Report<br />
        ✓ No spam, unsubscribe anytime
      </p>
    </form>
  );
}
