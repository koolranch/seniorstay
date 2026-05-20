'use client';

import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import { TOP_CLEVELAND_CITIES } from '@/lib/top-cleveland-cities';

interface PopularSuburbsGridProps {
  regionSlug?: string;
  title?: string;
  className?: string;
}

export default function PopularSuburbsGrid({
  regionSlug = 'cleveland',
  title = 'Popular Cleveland Suburbs',
  className = '',
}: PopularSuburbsGridProps) {
  return (
    <section className={`py-10 bg-slate-50 border-y border-slate-100 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">{title}</h2>
          <p className="text-slate-600 text-sm mt-2">Browse communities in neighborhoods families search most</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
          {TOP_CLEVELAND_CITIES.map((city) => (
            <Link
              key={city.slug}
              href={`/${regionSlug}/${city.slug}`}
              className="flex items-center justify-between gap-2 bg-white border border-slate-200 hover:border-teal-400 hover:shadow-md rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 transition-all"
            >
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-teal-600 shrink-0" />
                {city.name}
              </span>
              <ArrowRight className="h-4 w-4 text-teal-600 shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
