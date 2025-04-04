"use client";

import * as React from 'react';
import { Community } from '@/data/facilities';

interface CommunityTestimonialsProps {
  community: Community;
}

export default function CommunityTestimonials({ community }: CommunityTestimonialsProps) {
  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          What Residents Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {community.testimonials?.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <p className="text-gray-600 italic mb-4">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center">
                <div>
                  <p className="font-semibold text-gray-900">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-gray-500">
                    Resident
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 