'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CARE_TYPES = [
  { value: '', label: 'Select Care Type' },
  { value: 'assisted-living', label: 'Assisted Living' },
  { value: 'memory-care', label: 'Memory Care' },
  { value: 'independent-living', label: 'Independent Living' },
  { value: 'skilled-nursing', label: 'Skilled Nursing' },
];

const ROTATING_WORDS = [
  'Assisted Living',
  'Memory Care',
  'Independent Living',
  'Home Care',
  'Expert Guidance',
];

const HeroRefresh: React.FC = () => {
  const router = useRouter();
  const [careType, setCareType] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const params = new URLSearchParams();
    if (careType) params.set('care', careType);
    if (zipCode) params.set('zip', zipCode);
    router.push(`/greater-cleveland${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/images/hero-senior-family.jpg)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/60 to-slate-900/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/20 to-transparent" />
      </div>

      {/* Fallback gradient if no image */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900" />

      <div className="relative z-10 container mx-auto px-4 py-20 md:py-28 lg:py-36">
        <div className="max-w-4xl mx-auto text-center">
          {/* H1 */}
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Find the Right Senior Living
            <br className="hidden md:block" />
            <span className="text-white/90"> for Your Loved One</span>
          </motion.h1>

          {/* Animated subtitle */}
          <motion.div
            className="h-10 md:h-12 flex items-center justify-center mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-lg md:text-xl text-white/70 mr-2">
              Cleveland&apos;s trusted resource for
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIndex}
                className="text-lg md:text-xl font-semibold"
                style={{ color: '#8DA399' }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
              >
                {ROTATING_WORDS[wordIndex]}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          {/* Subtext */}
          <motion.p
            className="text-base md:text-lg text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Compare costs, reviews, and amenities for top-rated senior living communities in Northeast Ohio.{' '}
            <span className="text-white/80 font-medium">Free guidance from local experts.</span>
          </motion.p>

          {/* Search Bar */}
          <motion.form
            onSubmit={handleSearch}
            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-3 md:p-4 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row gap-3">
              {/* Care Type */}
              <div className="relative flex-1">
                <label htmlFor="hero-care-type" className="sr-only">Select Care Type</label>
                <div className="relative">
                  <select
                    id="hero-care-type"
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

              {/* Zip Code */}
              <div className="relative flex-1">
                <label htmlFor="hero-zip" className="sr-only">Enter Zip Code</label>
                <div className="relative">
                  <input
                    id="hero-zip"
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
          </motion.form>

          {/* Trust indicators */}
          <motion.div
            className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-white/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>100% Free Service</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-teal-400 rounded-full" />
              <span>150+ Cleveland Communities</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-400 rounded-full" />
              <span>Local Expert Guidance</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 80H1440V30C1440 30 1200 0 720 0C240 0 0 30 0 30V80Z" fill="#f8fafc" />
        </svg>
      </div>
    </section>
  );
};

export default HeroRefresh;
