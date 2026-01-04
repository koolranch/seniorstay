'use client';

import React from 'react';
import { Star } from 'lucide-react';
import TestimonialCard from './TestimonialCard';
import { Testimonial, testimonials, getTestimonialsByLocation, getTestimonialsByCareType } from '@/data/testimonials';

interface TestimonialSectionProps {
  title?: string;
  subtitle?: string;
  cityName?: string;
  careType?: string;
  limit?: number;
  className?: string;
  showAggregateRating?: boolean;
}

export default function TestimonialSection({
  title = 'What Cleveland Families Say',
  subtitle,
  cityName,
  careType,
  limit = 3,
  className = '',
  showAggregateRating = true
}: TestimonialSectionProps) {
  // Get testimonials based on filters
  let displayTestimonials: Testimonial[];
  
  if (cityName) {
    displayTestimonials = getTestimonialsByLocation(cityName, limit);
    // If not enough for the city, supplement with general testimonials
    if (displayTestimonials.length < limit) {
      const remaining = limit - displayTestimonials.length;
      const additionalTestimonials = testimonials
        .filter(t => !displayTestimonials.includes(t))
        .slice(0, remaining);
      displayTestimonials = [...displayTestimonials, ...additionalTestimonials];
    }
  } else if (careType) {
    displayTestimonials = getTestimonialsByCareType(careType, limit);
  } else {
    displayTestimonials = testimonials.slice(0, limit);
  }
  
  // Calculate aggregate rating
  const totalRating = displayTestimonials.reduce((sum, t) => sum + t.rating, 0);
  const avgRating = displayTestimonials.length > 0 ? totalRating / displayTestimonials.length : 5;
  const reviewCount = testimonials.length; // Use total reviews for aggregate
  
  return (
    <section className={`py-12 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {title}
          </h2>
          
          {subtitle && (
            <p className="text-gray-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
          
          {/* Aggregate Star Rating */}
          {showAggregateRating && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(avgRating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600 text-sm">
                {avgRating.toFixed(1)} stars from {reviewCount} Cleveland families
              </span>
            </div>
          )}
        </div>
        
        <div className={`grid gap-6 ${
          displayTestimonials.length === 1 
            ? 'max-w-md mx-auto' 
            : displayTestimonials.length === 2 
              ? 'md:grid-cols-2 max-w-3xl mx-auto'
              : 'md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto'
        }`}>
          {displayTestimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
        
        {/* Aggregate Rating Schema */}
        {showAggregateRating && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'LocalBusiness',
                name: 'Guide for Seniors',
                description: 'Free senior living placement service helping Cleveland families find assisted living and memory care communities',
                address: {
                  '@type': 'PostalAddress',
                  addressLocality: 'Cleveland',
                  addressRegion: 'OH',
                  addressCountry: 'US'
                },
                aggregateRating: {
                  '@type': 'AggregateRating',
                  ratingValue: avgRating.toFixed(1),
                  bestRating: 5,
                  worstRating: 1,
                  ratingCount: reviewCount,
                  reviewCount: reviewCount
                },
                priceRange: 'Free',
                areaServed: {
                  '@type': 'Place',
                  name: 'Greater Cleveland, Ohio'
                }
              })
            }}
          />
        )}
      </div>
    </section>
  );
}



