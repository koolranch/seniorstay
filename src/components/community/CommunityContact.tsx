"use client";

import * as React from 'react';
import { Community } from '@/data/facilities';

interface CommunityContactProps {
  community: Community;
}

export default function CommunityContact({ community }: CommunityContactProps) {
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
            <form action="https://formspree.io/f/xnnpaply" method="POST" className="space-y-4">
              <input type="hidden" name="form_type" value="community_contact" />
              <input type="hidden" name="community_name" value={community.name} />
              <input type="hidden" name="community_id" value={community.id} />
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
                  placeholder="(216) 555-0100"
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
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
              >
                Request Information & Tour
              </button>
              <p className="text-xs text-gray-500 text-center">We'll contact you within 24 hours.</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 