'use client';

import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Testimonial } from '@/data/testimonials';

interface TestimonialCardProps {
  testimonial: Testimonial;
  showSchema?: boolean;
}

export default function TestimonialCard({ testimonial, showSchema = true }: TestimonialCardProps) {
  const stars = Array(5).fill(0);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow relative">
      {/* Quote icon */}
      <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/10" />
      
      {/* Star rating */}
      <div className="flex gap-0.5 mb-4">
        {stars.map((_, index) => (
          <Star
            key={index}
            className={`h-5 w-5 ${
              index < testimonial.rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-200'
            }`}
          />
        ))}
      </div>
      
      {/* Quote text */}
      <blockquote className="text-gray-700 mb-4 leading-relaxed">
        "{testimonial.quote}"
      </blockquote>
      
      {/* Author info */}
      <div className="border-t border-gray-100 pt-4">
        <p className="font-semibold text-gray-900">{testimonial.author}</p>
        <p className="text-sm text-gray-500">{testimonial.location}</p>
        {testimonial.careType && (
          <span className="inline-block mt-2 text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
            {testimonial.careType}
          </span>
        )}
      </div>
      
      {/* Review Schema.org structured data */}
      {showSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Review',
              reviewRating: {
                '@type': 'Rating',
                ratingValue: testimonial.rating,
                bestRating: 5,
                worstRating: 1
              },
              author: {
                '@type': 'Person',
                name: testimonial.author
              },
              reviewBody: testimonial.quote,
              itemReviewed: {
                '@type': 'LocalBusiness',
                name: 'Guide for Seniors',
                address: {
                  '@type': 'PostalAddress',
                  addressLocality: 'Cleveland',
                  addressRegion: 'OH',
                  addressCountry: 'US'
                },
                ...(testimonial.careType && {
                  description: `${testimonial.careType} placement services in Greater Cleveland`
                })
              },
              ...(testimonial.location && {
                locationCreated: {
                  '@type': 'Place',
                  address: testimonial.location
                }
              })
            })
          }}
        />
      )}
    </div>
  );
}



