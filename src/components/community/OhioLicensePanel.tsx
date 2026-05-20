'use client';

import { ExternalLink, FileCheck } from 'lucide-react';
import { Community } from '@/data/facilities';

const ODH_SEARCH_URL =
  'https://odh.ohio.gov/know-our-programs/assisted-living/search-facilities';

interface OhioLicensePanelProps {
  community: Community;
}

export default function OhioLicensePanel({ community }: OhioLicensePanelProps) {
  const isSkilledNursing = community.careTypes.some((t) =>
    t.toLowerCase().includes('skilled nursing')
  );

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
      <div className="flex items-start gap-3">
        <FileCheck className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-slate-900 mb-1">Ohio licensing & inspections</h3>
          {community.ohioLicenseNumber ? (
            <p className="text-sm text-slate-600 mb-2">
              State license: <span className="font-mono font-medium">{community.ohioLicenseNumber}</span>
            </p>
          ) : (
            <p className="text-sm text-slate-600 mb-2">
              Verify this community&apos;s Ohio {isSkilledNursing ? 'nursing home' : 'assisted living'}{' '}
              license and inspection history on the official state registry.
            </p>
          )}
          <a
            href={ODH_SEARCH_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700"
          >
            Search Ohio Department of Health
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          {community.careCompareUrl && (
            <a
              href={community.careCompareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View on Medicare Care Compare →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
