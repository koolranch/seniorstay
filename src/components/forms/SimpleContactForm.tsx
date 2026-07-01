"use client";

import React, { useEffect, useRef, useState } from 'react';
import { getLeadSubmissionToken, submitLead } from '@/app/actions/leads';
import {
  trackFormError,
  trackFormStart,
  trackFormSubmission,
} from '@/components/analytics/GoogleAnalytics';
import PhoneLink from '@/components/conversion/PhoneLink';
import { PLACEMENT_CALLBACK_MESSAGE, PLACEMENT_PHONE_DISPLAY } from '@/lib/placement-contact';
import { isValidPhone, MOVE_IN_TIMELINE_OPTIONS } from '@/lib/lead-form-options';

interface SimpleContactFormProps {
  sourcePage: string;
  formType?: string;
  showMessage?: boolean;
  buttonText?: string;
  className?: string;
}

export default function SimpleContactForm({
  sourcePage,
  formType = 'contact',
  showMessage = true,
  buttonText = 'Request Free Placement Call',
  className = '',
}: SimpleContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [submissionToken, setSubmissionToken] = useState('');
  const formStartedAtRef = useRef(Date.now());
  const formStartTrackedRef = useRef(false);

  useEffect(() => {
    let active = true;

    getLeadSubmissionToken()
      .then((token) => {
        if (active) {
          setSubmissionToken(token);
        }
      })
      .catch(() => {
        if (active) {
          setSubmissionToken('');
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const trackStartOnce = () => {
    if (!formStartTrackedRef.current) {
      formStartTrackedRef.current = true;
      trackFormStart(formType);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const phone = formData.get('phone')?.toString() || '';

    if (!isValidPhone(phone)) {
      setError('Please enter a valid U.S. phone number so we can call you back.');
      trackFormError(formType, 'invalid_phone');
      setIsSubmitting(false);
      return;
    }

    if (!submissionToken) {
      setError('Form is still loading. Please wait a moment and try again.');
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await submitLead({
        fullName: formData.get('name')?.toString() || '',
        email: formData.get('email')?.toString() || '',
        phone,
        moveInTimeline: formData.get('moveInTimeline')?.toString() || undefined,
        notes: formData.get('message')?.toString() || `Placement inquiry from ${sourcePage}`,
        pageType: 'other',
        sourceSlug: sourcePage,
        website: formData.get('website')?.toString() || '',
        submissionStartedAt: formStartedAtRef.current,
        submissionToken,
      });

      if (result.success) {
        trackFormSubmission(formType);
        setIsSuccess(true);
        formStartedAtRef.current = Date.now();
        formStartTrackedRef.current = false;
      } else {
        setError(result.message || 'Something went wrong. Please try again.');
        trackFormError(formType, result.message);
      }
    } catch {
      setError('Unable to submit. Please call us directly.');
      trackFormError(formType, 'network_error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-xl p-8 text-center ${className}`}>
        <h3 className="text-xl font-bold text-green-800 mb-2">Thank You!</h3>
        <p className="text-green-700">{PLACEMENT_CALLBACK_MESSAGE}</p>
        <p className="text-sm text-green-600 mt-4">
          Or call now:{' '}
          <PhoneLink placement="form_success" className="font-semibold text-green-800 underline">
            {PLACEMENT_PHONE_DISPLAY}
          </PhoneLink>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} onFocus={trackStartOnce} className={`space-y-4 ${className}`}>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          required
          placeholder="Your Name *"
          onFocus={trackStartOnce}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        />
        <input
          type="tel"
          name="phone"
          required
          placeholder="Your Phone *"
          onFocus={trackStartOnce}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>
      <input
        type="email"
        name="email"
        required
        placeholder="Your Email *"
        onFocus={trackStartOnce}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
      />
      <select
        name="moveInTimeline"
        required
        defaultValue=""
        onFocus={trackStartOnce}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-slate-700"
      >
        <option value="" disabled>
          When are you looking to move? *
        </option>
        {MOVE_IN_TIMELINE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {showMessage && (
        <textarea
          name="message"
          placeholder="Tell us about your situation (optional)"
          rows={3}
          onFocus={trackStartOnce}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        />
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting || !submissionToken}
        className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white py-4 rounded-lg font-semibold text-lg transition-colors"
      >
        {isSubmitting ? 'Sending...' : buttonText}
      </button>
      <p className="text-sm text-gray-500 text-center">
        100% Free · No Obligation · We call you—no spam
      </p>
    </form>
  );
}
