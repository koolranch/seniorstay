"use client";

import * as React from 'react';

interface LocationFAQProps {
  city: string;
}

export default function LocationFAQ({ city }: LocationFAQProps) {
  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              What types of senior living options are available in {city}?
            </h3>
            <p className="text-gray-600">
              {city} offers various senior living options including independent living, assisted living, memory care, and skilled nursing facilities. Each option provides different levels of care and amenities to meet specific needs.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              How do I choose the right senior living community?
            </h3>
            <p className="text-gray-600">
              Consider factors such as location, cost, available amenities, staff qualifications, and the overall atmosphere. It's also important to visit multiple communities and speak with current residents and their families.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              What is the average cost of senior living in {city}?
            </h3>
            <p className="text-gray-600">
              Costs vary depending on the type of care and amenities needed. Independent living typically costs less than assisted living or memory care. Contact individual communities for specific pricing information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 