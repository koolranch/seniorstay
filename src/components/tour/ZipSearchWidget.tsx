"use client";

import React, { useState } from 'react';
import { Search, MapPin, Loader2, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatZipCode, isValidZipCode } from '@/utils/distance';

// Quick Select cities for high-value content guidance
const QUICK_SELECT_CITIES = [
  { name: 'Westlake', slug: 'westlake', zip: '44145', badge: 'Premium' },
  { name: 'Beachwood', slug: 'beachwood', zip: '44122', badge: 'Medical Mile' },
  { name: 'Parma', slug: 'parma', zip: '44134', badge: 'Popular' },
  { name: 'Shaker Heights', slug: 'shaker-heights', zip: '44120', badge: '' },
  { name: 'Lakewood', slug: 'lakewood', zip: '44107', badge: '' },
];

interface ZipSearchWidgetProps {
  onSearch: (zip: string) => void;
  loading?: boolean;
}

export default function ZipSearchWidget({ onSearch, loading = false }: ZipSearchWidgetProps) {
  const [zipCode, setZipCode] = useState('');
  const [error, setError] = useState('');
  const [showQuickSelect, setShowQuickSelect] = useState(false);
  const router = useRouter();

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatZipCode(e.target.value);
    setZipCode(formatted);
    setError(''); // Clear error on input
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!zipCode) {
      setError('Please enter a zip code');
      return;
    }
    
    if (!isValidZipCode(zipCode)) {
      setError('Please enter a valid 5-digit zip code');
      return;
    }
    
    onSearch(zipCode);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Heading */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Find & Tour Communities Near You
          </h2>
          <p className="text-gray-600">
            Enter your zip code to see assisted living and memory care communities in your area
          </p>
        </div>

        {/* Search Input */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Enter Zip Code (e.g., 44120)"
              value={zipCode}
              onChange={handleZipChange}
              maxLength={5}
              className={`pl-12 pr-4 py-6 text-lg border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
              aria-label="Enter your zip code"
              autoComplete="postal-code"
            />
          </div>
          
          <Button
            type="submit"
            size="lg"
            disabled={loading || !zipCode}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-6 text-lg rounded-lg shadow-md hover:shadow-lg transition-all min-w-[180px]"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-5 w-5 mr-2" />
                Find Communities
              </>
            )}
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-600 text-sm mt-2 text-center" role="alert">
            {error}
          </p>
        )}

        {/* Quick Select Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowQuickSelect(!showQuickSelect)}
            className="w-full flex items-center justify-center gap-2 text-sm text-slate-600 hover:text-primary transition-colors py-2 min-h-[44px]"
          >
            <span>Or browse our top neighborhoods:</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${showQuickSelect ? 'rotate-180' : ''}`} />
          </button>
          
          {showQuickSelect && (
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {QUICK_SELECT_CITIES.map((city) => (
                <button
                  key={city.slug}
                  type="button"
                  onClick={() => router.push(`/location/${city.slug}`)}
                  className="inline-flex items-center gap-1 bg-slate-100 hover:bg-teal-100 border border-slate-200 hover:border-teal-300 text-slate-700 hover:text-teal-700 px-4 py-2 rounded-full text-sm font-medium transition-all min-h-[44px]"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{city.name}</span>
                  {city.badge && (
                    <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-xs font-semibold ml-1">
                      {city.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Trust Signals */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600 mt-4">
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-semibold">✓</span>
            <span>100% Free Service</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-semibold">✓</span>
            <span>No Obligation</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-semibold">✓</span>
            <span>Local Cleveland Experts</span>
          </div>
        </div>
      </form>
    </div>
  );
}

