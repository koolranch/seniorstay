'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DollarSign, ArrowUpDown, MapPin, ArrowRight } from 'lucide-react';
import { Community } from '@/data/facilities';

// City-based pricing ranges (same data as community detail page)
const PRICING_RANGES: Record<string, { assisted_living: [number, number]; memory_care: [number, number] }> = {
  beachwood: { assisted_living: [5500, 8200], memory_care: [6500, 9500] },
  westlake: { assisted_living: [4800, 7200], memory_care: [6000, 8800] },
  'shaker heights': { assisted_living: [5200, 7800], memory_care: [6200, 9000] },
  'rocky river': { assisted_living: [4600, 7000], memory_care: [5800, 8500] },
  parma: { assisted_living: [3800, 5800], memory_care: [5000, 7500] },
  lakewood: { assisted_living: [4200, 6500], memory_care: [5500, 8000] },
  strongsville: { assisted_living: [4400, 6800], memory_care: [5600, 8200] },
  mentor: { assisted_living: [4000, 6200], memory_care: [5200, 7800] },
  solon: { assisted_living: [4800, 7200], memory_care: [6000, 8600] },
  cleveland: { assisted_living: [3500, 6500], memory_care: [4800, 8000] },
  independence: { assisted_living: [4200, 6500], memory_care: [5400, 7800] },
  'seven hills': { assisted_living: [3800, 5800], memory_care: [5000, 7200] },
};

function getCityFromLocation(location: string): string {
  return location.split(',')[0].trim().toLowerCase();
}

function getPricingForCommunity(community: Community): { low: number; high: number; label: string } {
  const city = getCityFromLocation(community.location);
  const cityKey = city.replace(/\s+/g, ' ');
  const pricing = PRICING_RANGES[cityKey] || PRICING_RANGES['cleveland'];
  const hasMemoryCare = community.careTypes.some(t => t.toLowerCase().includes('memory'));
  if (hasMemoryCare) {
    return { low: pricing.memory_care[0], high: pricing.memory_care[1], label: 'Memory Care' };
  }
  return { low: pricing.assisted_living[0], high: pricing.assisted_living[1], label: 'Assisted Living' };
}

interface CostComparisonTableProps {
  communities: Community[];
  careType: string; // 'Assisted Living' or 'Memory Care'
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
    const city = c.location.split(',')[0].trim();
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
    else { setSortBy(col); setSortAsc(true); }
  };

  return (
    <section className="py-12 bg-white border-y border-slate-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <DollarSign className="h-4 w-4" />
            2026 Pricing
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
            {careType} Cost Comparison
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Estimated monthly pricing for {careType.toLowerCase()} communities in the Cleveland area. Click any row for full details.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                  <button onClick={() => toggleSort('name')} className="flex items-center gap-1 hover:text-slate-900">
                    Community <ArrowUpDown className="h-3.5 w-3.5" />
                  </button>
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-600 hidden sm:table-cell">
                  <button onClick={() => toggleSort('city')} className="flex items-center gap-1 hover:text-slate-900">
                    City <ArrowUpDown className="h-3.5 w-3.5" />
                  </button>
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-600">Care Types</th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                  <button onClick={() => toggleSort('price')} className="flex items-center gap-1 hover:text-slate-900">
                    Est. Price/Mo <ArrowUpDown className="h-3.5 w-3.5" />
                  </button>
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-600 hidden md:table-cell"></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((row, i) => (
                <tr
                  key={row.community.id}
                  className={`border-b border-slate-100 hover:bg-teal-50/50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}
                >
                  <td className="px-4 py-3">
                    <Link href={row.url} className="font-medium text-slate-900 hover:text-teal-600 transition-colors text-sm">
                      {row.name.length > 35 ? row.name.slice(0, 35) + '...' : row.name}
                    </Link>
                    <p className="text-xs text-slate-500 sm:hidden flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" /> {row.city}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 hidden sm:table-cell">
                    {row.city}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {row.careTypes.slice(0, 2).map((ct, j) => (
                        <span key={j} className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {ct}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-slate-900 text-sm">
                      ${row.priceLow.toLocaleString()} – ${row.priceHigh.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <Link
                      href={row.url}
                      className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1"
                    >
                      Details <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-slate-400 text-center mt-4">
          Pricing is estimated based on 2026 Cleveland-area averages. Actual costs vary by community and level of care. Contact us for personalized pricing.
        </p>
      </div>
    </section>
  );
}
