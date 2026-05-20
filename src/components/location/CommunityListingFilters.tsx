'use client';

import { Filter } from 'lucide-react';
import {
  DEFAULT_LISTING_FILTERS,
  ListingFilters,
  CareTypeFilter,
} from '@/lib/community-listing-utils';
import { BudgetFilter } from '@/lib/community-pricing';
import { trackListingFilter } from '@/components/analytics/GoogleAnalytics';

interface CommunityListingFiltersProps {
  filters: ListingFilters;
  onChange: (filters: ListingFilters) => void;
  resultCount: number;
  totalCount: number;
}

export default function CommunityListingFilters({
  filters,
  onChange,
  resultCount,
  totalCount,
}: CommunityListingFiltersProps) {
  const set = (partial: Partial<ListingFilters>, filterType?: string, filterValue?: string) => {
    const next = { ...filters, ...partial };
    onChange(next);
    if (filterType && filterValue !== undefined) {
      trackListingFilter(filterType, filterValue, resultCount);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 mb-8 shadow-sm">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Filter className="h-4 w-4 text-slate-500" />
        <span className="text-sm font-semibold text-slate-800">Filter communities</span>
        <span className="text-xs text-slate-500 ml-auto">
          Showing {resultCount} of {totalCount}
        </span>
      </div>
      <div className="flex flex-wrap gap-3">
        <select
          aria-label="Care type filter"
          value={filters.careType}
          onChange={(e) => {
            const value = e.target.value as CareTypeFilter;
            set({ careType: value }, 'care_type', value);
          }}
          className="h-10 px-3 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-500"
        >
          <option value="all">All care types</option>
          <option value="assisted-living">Assisted Living</option>
          <option value="memory-care">Memory Care</option>
          <option value="independent-living">Independent Living</option>
        </select>
        <select
          aria-label="Budget filter"
          value={filters.budget}
          onChange={(e) => {
            const value = e.target.value as BudgetFilter;
            set({ budget: value }, 'budget', value);
          }}
          className="h-10 px-3 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-500"
        >
          <option value="all">Any budget (est.)</option>
          <option value="under-5k">Under ~$5,000/mo</option>
          <option value="5k-7k">~$5,000–$7,000/mo</option>
          <option value="7k-plus">$7,000+/mo</option>
        </select>
        <label className="inline-flex items-center gap-2 h-10 px-3 text-sm border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50">
          <input
            type="checkbox"
            checked={filters.photosOnly}
            onChange={(e) => set({ photosOnly: e.target.checked }, 'photos_only', String(e.target.checked))}
            className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
          />
          Photos only
        </label>
        {(filters.careType !== 'all' || filters.budget !== 'all' || filters.photosOnly) && (
          <button
            type="button"
            onClick={() => onChange(DEFAULT_LISTING_FILTERS)}
            className="h-10 px-3 text-sm font-medium text-teal-600 hover:text-teal-700"
          >
            Clear filters
          </button>
        )}
      </div>
      <p className="text-[11px] text-slate-400 mt-2">
        Monthly ranges are 2026 Cleveland-area estimates—confirm exact pricing on a free placement call.
      </p>
    </div>
  );
}
