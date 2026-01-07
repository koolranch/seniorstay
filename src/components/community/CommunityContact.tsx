"use client";

import * as React from 'react';
import { Community } from '@/data/facilities';
import { submitLead } from '@/app/actions/leads';

interface CommunityContactProps {
  community: Community;
}

export default function CommunityContact({ community }: CommunityContactProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [error, setError] = React.useState('');

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
        communityName: community.name,
        cityOrZip: community.location?.split(',')[0]?.trim() || '',
        notes: `Information & tour request for ${community.name}`,
        pageType: 'community_page',
        sourceSlug: community.id,
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

  return (
    <div className="bg-white py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Contact Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Get in Touch
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600">
                  <span className="font-semibold">Email:</span>{' '}
                  <a href="mailto:info@guideforseniors.com" className="text-primary hover:underline">
                    info@guideforseniors.com
                  </a>
                </p>
              </div>
              <div>
                <p className="text-gray-600">
                  <span className="font-semibold">Address:</span> {community.address || 'Address not available'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mt-4">
                  Fill out the form to get personalized information about this community, pricing, and tour availability.
                </p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Request Information & Tour
            </h3>
            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="John Smith"
                    className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-0"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    placeholder="(216) 677-4630"
                    className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-0"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="john@example.com"
                    className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-0"
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                >
                  {isSubmitting ? 'Sending...' : 'Request Information & Tour'}
                </button>
                <p className="text-xs text-gray-500 text-center">We'll contact you within 24 hours.</p>
              </form>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <p className="text-green-700 font-semibold mb-2">Thank you!</p>
                <p className="text-gray-600">We'll contact you shortly with information about {community.name}.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 