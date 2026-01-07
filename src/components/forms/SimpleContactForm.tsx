"use client";

import React, { useState } from 'react';
import { submitLead } from '@/app/actions/leads';

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
  buttonText = 'Request Free Consultation',
  className = '',
}: SimpleContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);

    try {
      const result = await submitLead({
        fullName: formData.get('name')?.toString() || '',
        email: formData.get('email')?.toString() || '',
        phone: formData.get('phone')?.toString() || '',
        notes: formData.get('message')?.toString() || `Contact from ${sourcePage} page`,
        pageType: 'other',
        sourceSlug: sourcePage,
      });

      if (result.success) {
        setIsSuccess(true);
      } else {
        setError(result.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Unable to submit. Please try again or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-xl p-8 text-center ${className}`}>
        <h3 className="text-xl font-bold text-green-800 mb-2">Thank You!</h3>
        <p className="text-green-700">
          We've received your request. A Cleveland advisor will contact you within 24 hours.
        </p>
        <p className="text-sm text-green-600 mt-4">
          Need immediate help? Call us at <strong>(216) 677-4630</strong>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          required
          placeholder="Your Name *"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        />
        <input
          type="tel"
          name="phone"
          required
          placeholder="Your Phone *"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>
      <input
        type="email"
        name="email"
        required
        placeholder="Your Email *"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
      />
      {showMessage && (
        <textarea
          name="message"
          placeholder="How can we help you? (Optional)"
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        />
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white py-4 rounded-lg font-semibold text-lg transition-colors"
      >
        {isSubmitting ? 'Sending...' : buttonText}
      </button>
      <p className="text-sm text-gray-500 text-center">
        100% Free • No Obligation • Confidential
      </p>
    </form>
  );
}

