'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, ChevronDown } from 'lucide-react';

/**
 * Hero Section - High-Authority Local Hub
 * SEO-optimized with single H1, semantic markup, and Cleveland-focused messaging
 */

const CARE_TYPES = [
  { value: '', label: 'Select Care Type' },
  { value: 'assisted-living', label: 'Assisted Living' },
  { value: 'memory-care', label: 'Memory Care' },
  { value: 'independent-living', label: 'Independent Living' },
  { value: 'skilled-nursing', label: 'Skilled Nursing' },
];

const Hero: React.FC = () => {
  const router = useRouter();
  const [careType, setCareType] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Build search URL
    const params = new URLSearchParams();
    if (careType) params.set('care', careType);
    if (zipCode) params.set('zip', zipCode);

    // Navigate to search results or city page
    if (zipCode) {
      router.push(`/greater-cleveland?${params.toString()}`);
    } else if (careType) {
      router.push(`/greater-cleveland?${params.toString()}`);
    } else {
      router.push('/greater-cleveland');
    }
  };

  return (
    <section className="relative bg-gradient-to-b from-slate-50 via-white to-slate-50 py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23334155' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} 
        />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-teal-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* H1 - Single, SEO-optimized heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
            Find the Right Senior Living in Cleveland—
            <span className="text-teal-600">Without the Stress</span>
          </h1>

          {/* Subtext - Benefit-driven description */}
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Compare costs, reviews, and amenities for the top-rated assisted living and memory care communities in Northeast Ohio. 
            <span className="font-medium text-slate-700"> Free guidance from local experts.</span>
          </p>

          {/* Search Bar UI */}
          <form 
            onSubmit={handleSearch}
            className="bg-white rounded-2xl shadow-xl border border-slate-200 p-3 md:p-4 max-w-2xl mx-auto"
          >
            <div className="flex flex-col md:flex-row gap-3">
              {/* Care Type Select */}
              <div className="relative flex-1">
                <label htmlFor="care-type" className="sr-only">Select Care Type</label>
                <div className="relative">
                  <select
                    id="care-type"
                    value={careType}
                    onChange={(e) => setCareType(e.target.value)}
                    className="w-full h-14 pl-12 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  >
                    {CARE_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Zip Code Input */}
              <div className="relative flex-1">
                <label htmlFor="zip-code" className="sr-only">Enter Zip Code</label>
                <div className="relative">
                  <input
                    id="zip-code"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]{5}"
                    maxLength={5}
                    placeholder="Enter Zip Code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                </div>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-14 px-8 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 min-w-[140px] disabled:opacity-70"
              >
                <Search className="h-5 w-5" />
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* Trust indicators */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>100% Free Service</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-teal-500 rounded-full" />
              <span>150+ Cleveland Communities</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full" />
              <span>Local Expert Guidance</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

