"use client";

import * as React from 'react';

interface LocationFAQProps {
  city: string;
}

const faqs = [
  {
    question: "What types of senior living options are available?",
    answer: "We offer a range of senior living options including independent living, assisted living, memory care, and skilled nursing facilities."
  },
  {
    question: "How do I know which type of care is right for my loved one?",
    answer: "Our team can help assess your loved one's needs and recommend the most appropriate level of care based on their health, mobility, and daily living requirements."
  },
  {
    question: "What amenities and services are typically included?",
    answer: "Most communities offer meals, housekeeping, transportation, social activities, and 24-hour staff support. Specific amenities vary by community."
  },
  {
    question: "How much does senior living cost?",
    answer: "Costs vary depending on the type of care, location, and level of services needed. We can help you understand the pricing structure and available payment options."
  }
];

export const LocationFAQ: React.FC<LocationFAQProps> = ({ city }: LocationFAQProps) => {
  const decodedCity = decodeURIComponent(city);

  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Frequently Asked Questions About Senior Living in {decodedCity}
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {faq.question}
              </h3>
              <p className="text-gray-600">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 