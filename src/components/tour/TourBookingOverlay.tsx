"use client";

import React, { useState } from 'react';
import { X, Calendar, Phone, Mail, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Community } from '@/data/facilities';

interface TourBookingOverlayProps {
  community: Community;
  userZip?: string;
  distance?: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TourBookingOverlay({
  community,
  userZip,
  distance,
  isOpen,
  onClose,
  onSuccess,
}: TourBookingOverlayProps) {
  const [formData, setFormData] = useState({
    name: '',
    contactMethod: 'email' as 'phone' | 'email',
    phone: '',
    email: '',
    timing: 'next-week',
    timePreference: 'either',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const formPayload = new FormData();
      formPayload.append('form_type', 'tour_request_zip_search');
      formPayload.append('community_name', community.name);
      formPayload.append('community_id', community.id);
      formPayload.append('community_location', community.location);
      if (userZip) formPayload.append('user_zip', userZip);
      if (distance) formPayload.append('distance_miles', distance.toString());
      formPayload.append('name', formData.name);
      formPayload.append('contact_method', formData.contactMethod);
      if (formData.contactMethod === 'phone') {
        formPayload.append('phone', formData.phone);
      } else {
        formPayload.append('email', formData.email);
      }
      formPayload.append('timing', formData.timing);
      formPayload.append('time_preference', formData.timePreference);
      formPayload.append('source_page', typeof window !== 'undefined' ? window.location.href : '');

      const response = await fetch('https://formspree.io/f/xnnpaply', {
        method: 'POST',
        body: formPayload,
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        onSuccess();
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Unable to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto animate-in fade-in zoom-in duration-200">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>

          {/* Header */}
          <div className="p-6 pb-4 border-b">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Schedule Your Tour
                </h2>
                <p className="text-gray-600 text-sm">
                  {community.name}
                </p>
                {distance && (
                  <p className="text-sm text-gray-500 mt-1">
                    📍 {distance.toFixed(1)} miles from you
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Your Name *
              </Label>
              <Input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Smith"
                className="h-12 text-base"
                disabled={submitting}
              />
            </div>

            {/* Contact Method Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                How should we contact you? *
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, contactMethod: 'phone' })}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                    formData.contactMethod === 'phone'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                  disabled={submitting}
                >
                  <Phone className="h-5 w-5" />
                  Call Me
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, contactMethod: 'email' })}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                    formData.contactMethod === 'email'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                  disabled={submitting}
                >
                  <Mail className="h-5 w-5" />
                  Email Me
                </button>
              </div>
            </div>

            {/* Phone or Email Input (conditional) */}
            {formData.contactMethod === 'phone' ? (
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone Number *
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(216) 555-0100"
                    className="h-12 text-base pl-11"
                    disabled={submitting}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john.smith@example.com"
                    className="h-12 text-base pl-11"
                    disabled={submitting}
                  />
                </div>
              </div>
            )}

            {/* Timing Preference */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                When would you like to tour? *
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'this-week', label: 'This Week' },
                  { value: 'next-week', label: 'Next Week' },
                  { value: 'flexible', label: 'Flexible' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, timing: option.value })}
                    className={`px-4 py-3 rounded-lg border-2 font-medium text-sm transition-all ${
                      formData.timing === option.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                    disabled={submitting}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Time of Day Preference */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Preferred Time
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'morning', label: 'Morning' },
                  { value: 'afternoon', label: 'Afternoon' },
                  { value: 'either', label: 'Either' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, timePreference: option.value })}
                    className={`px-4 py-3 rounded-lg border-2 font-medium text-sm transition-all ${
                      formData.timePreference === option.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                    disabled={submitting}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg py-6 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              {submitting ? (
                <>
                  <CheckCircle className="h-5 w-5 mr-2 animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Calendar className="h-5 w-5 mr-2" />
                  Schedule My Tour
                </>
              )}
            </Button>

            {/* Trust Signals */}
            <div className="text-center space-y-2 pt-2">
              <p className="text-sm text-gray-600">
                We'll contact you within <span className="font-semibold text-orange-600">2 hours</span> to confirm your tour
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                <span>✓ 100% Free</span>
                <span>✓ No Obligation</span>
                <span>✓ Never Shared</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

