'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DollarSign, ArrowUpDown, MapPin, ArrowRight } from 'lucide-react';
import { Community } from '@/data/facilities';
import {
  formatPriceRange,
  getPricingForCommunity,
} from '@/lib/community-pricing';

function getCityFromLocation(location: string): string {
  return location.split(',')[0].trim();
}

interface CostComparisonTableProps {
  communities: Community[];
  careType: string;
  regionSlug?: string;
  maxRows?: number;
}

export default function CostComparisonTable({
  communities,
  careType,
  regionSlug = 'cleveland',
  maxRows = 12,
}: CostComparisonTableProps) {
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'city'>('price');
  const [sortAsc, setSortAsc] = useState(true);

  const rows = communities.slice(0, maxRows).map((c) => {
    const pricing = getPricingForCommunity(c);
    const city = getCityFromLocation(c.location);
    const citySlug = city.toLowerCase().replace(/\s+/g, '-');
    const communitySlug = c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return {
      community: c,
      name: c.name,
      city,
      citySlug,
      communitySlug,
      priceLow: pricing.low,
      priceHigh: pricing.high,
      priceLabel: pricing.label,
      confirmedStarting: pricing.confirmedStarting,
      careTypes: c.careTypes,
      url: `/${regionSlug}/community/${c.id}/${communitySlug}`,
    };
  });

  const sorted = [...rows].sort((a, b) => {
    let cmp = 0;
    if (sortBy === 'name') cmp = a.name.localeCompare(b.name);
    else if (sortBy === 'city') cmp = a.city.localeCompare(b.city);
    else cmp = a.priceLow - b.priceLow;
    return sortAsc ? cmp : -cmp;
  });

  const toggleSort = (col: 'name' | 'price' | 'city') => {
    if (sortBy === col) setSortAsc(!sortAsc);
    else {
      setSortBy(col);
      setSortAsc(true);
    }
  };

  return (
    <section className="py-12 bg-white border-y border-slate-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <DollarSign className="h-4 w-4" />
            2026 Pricing Estimates
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
            {careType} Cost Comparison
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Estimated monthly pricing for {careType.toLowerCase()} communities in the Cleveland area.
            Click any row for full details.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-sm">
                <th className="p-4 font-semibold text-slate-700">
                  <button type="button" onClick={() => toggleSort('name')} className="inline-flex items-center gap-1 hover:text-teal-600">
                    Community <ArrowUpDown className="h-3.5 w-3.5" />
                  </button>
                </th>
                <th className="p-4 font-semibold text-slate-700 hidden sm:table-cell">City</th>
                <th className="p-4 font-semibold text-slate-700">
                  <button type="button" onClick={() => toggleSort('price')} className="inline-flex items-center gap-1 hover:text-teal-600">
                    Est. Monthly <ArrowUpDown className="h-3.5 w-3.5" />
                  </button>
                </th>
                <th className="p-4 font-semibold text-slate-700 hidden md:table-cell">Care Type</th>
                <th className="p-4 font-semibold text-slate-700 text-right"> </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((row, i) => (
                <tr key={row.community.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                  <td className="p-4 border-t border-slate-100">
                    <Link href={row.url} className="font-semibold text-slate-900 hover:text-teal-600">
                      {row.name}
                    </Link>
                  </td>
                  <td className="p-4 border-t border-slate-100 hidden sm:table-cell text-slate-600">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-teal-500" />
                      {row.city}
                    </span>
                  </td>
                  <td className="p-4 border-t border-slate-100">
                    <div className="font-bold text-teal-700">
                      {row.confirmedStarting
                        ? `From $${row.confirmedStarting.toLocaleString()}/mo`
                        : formatPriceRange(row.priceLow, row.priceHigh)}
                    </div>
                    <div className="text-[10px] uppercase tracking-wide text-slate-400 mt-0.5">
                      {row.confirmedStarting ? 'Advisor confirmed' : 'Estimate · 2026'}
                    </div>
                  </td>
                  <td className="p-4 border-t border-slate-100 hidden md:table-cell text-sm text-slate-600">
                    {row.priceLabel}
                  </td>
                  <td className="p-4 border-t border-slate-100 text-right">
                    <Link
                      href={row.url}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700"
                    >
                      Details <ArrowRight className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-center text-xs text-slate-500 mt-4 max-w-2xl mx-auto">
          Pricing is estimated based on 2026 Cleveland-area averages unless marked advisor-confirmed.
          Actual costs vary by care level and room type. Call for personalized pricing.
        </p>
      </div>
    </section>
  );
}
