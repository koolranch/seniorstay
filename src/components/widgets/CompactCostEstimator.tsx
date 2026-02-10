'use client';

import React, { useState } from 'react';
import { DollarSign, ChevronDown } from 'lucide-react';
import Link from 'next/link';

const PRICING_DATA: Record<string, { assisted_living: [number, number]; memory_care: [number, number]; independent_living: [number, number] }> = {
  beachwood: { assisted_living: [5500, 8200], memory_care: [6500, 9500], independent_living: [2800, 4800] },
  westlake: { assisted_living: [4800, 7200], memory_care: [6000, 8800], independent_living: [2500, 4200] },
  'shaker heights': { assisted_living: [5200, 7800], memory_care: [6200, 9000], independent_living: [2600, 4500] },
  'rocky river': { assisted_living: [4600, 7000], memory_care: [5800, 8500], independent_living: [2400, 4000] },
  parma: { assisted_living: [3800, 5800], memory_care: [5000, 7500], independent_living: [2000, 3500] },
  lakewood: { assisted_living: [4200, 6500], memory_care: [5500, 8000], independent_living: [2200, 3800] },
  strongsville: { assisted_living: [4400, 6800], memory_care: [5600, 8200], independent_living: [2300, 4000] },
  mentor: { assisted_living: [4000, 6200], memory_care: [5200, 7800], independent_living: [2100, 3600] },
  solon: { assisted_living: [4800, 7200], memory_care: [6000, 8600], independent_living: [2500, 4200] },
  cleveland: { assisted_living: [3500, 6500], memory_care: [4800, 8000], independent_living: [2000, 3800] },
};

const CITIES = [
  { value: 'cleveland', label: 'Cleveland' },
  { value: 'westlake', label: 'Westlake' },
  { value: 'beachwood', label: 'Beachwood' },
  { value: 'shaker heights', label: 'Shaker Heights' },
  { value: 'lakewood', label: 'Lakewood' },
  { value: 'parma', label: 'Parma' },
  { value: 'strongsville', label: 'Strongsville' },
  { value: 'rocky river', label: 'Rocky River' },
  { value: 'solon', label: 'Solon' },
  { value: 'mentor', label: 'Mentor' },
];

const CARE_TYPES = [
  { value: 'assisted_living', label: 'Assisted Living' },
  { value: 'memory_care', label: 'Memory Care' },
  { value: 'independent_living', label: 'Independent Living' },
];

interface CompactCostEstimatorProps {
  defaultCity?: string;
  defaultCareType?: string;
  className?: string;
}

export default function CompactCostEstimator({
  defaultCity = 'cleveland',
  defaultCareType = 'assisted_living',
  className = '',
}: CompactCostEstimatorProps) {
  const [city, setCity] = useState(defaultCity);
  const [careType, setCareType] = useState(defaultCareType);

  const pricing = PRICING_DATA[city] || PRICING_DATA['cleveland'];
  const range = pricing[careType as keyof typeof pricing];
  const careLabel = CARE_TYPES.find(c => c.value === careType)?.label || 'Assisted Living';
  const cityLabel = CITIES.find(c => c.value === city)?.label || 'Cleveland';

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 p-5 shadow-sm ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-teal-50">
          <DollarSign className="h-4 w-4 text-teal-600" />
        </div>
        <h3 className="font-semibold text-slate-900 text-sm">What Will Care Cost?</h3>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="relative">
          <select
            value={careType}
            onChange={(e) => setCareType(e.target.value)}
            className="w-full h-10 pl-3 pr-8 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-700 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {CARE_TYPES.map((ct) => (
              <option key={ct.value} value={ct.value}>{ct.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full h-10 pl-3 pr-8 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-700 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {CITIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        </div>
      </div>

      <div className="text-center py-3 bg-slate-50 rounded-xl mb-3">
        <p className="text-2xl font-bold text-slate-900">
          ${range[0].toLocaleString()} – ${range[1].toLocaleString()}
        </p>
        <p className="text-xs text-slate-500 mt-1">
          {careLabel} in {cityLabel} per month
        </p>
      </div>

      <Link
        href="/contact"
        className="block text-center text-sm text-teal-600 font-medium hover:text-teal-700 transition-colors"
      >
        Get personalized pricing →
      </Link>
    </div>
  );
}
