'use client';

import { Star, Shield, CheckCircle } from 'lucide-react';
import { Community } from '@/data/facilities';

interface CommunityTrustBadgeProps {
  community: Community;
  size?: 'sm' | 'md';
}

/** CMS stars for SNF, advisor-screened for AL without public ratings */
export default function CommunityTrustBadge({ community, size = 'sm' }: CommunityTrustBadgeProps) {
  const textClass = size === 'sm' ? 'text-xs' : 'text-sm';
  const iconClass = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';

  if (community.overallRating) {
    return (
      <span className={`inline-flex items-center gap-1 ${textClass} font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full`}>
        <Star className={`${iconClass} fill-amber-400 text-amber-400`} />
        CMS {community.overallRating.toFixed(1)}/5
      </span>
    );
  }

  if (community.ccn) {
    return (
      <span className={`inline-flex items-center gap-1 ${textClass} font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full`}>
        <Shield className={iconClass} />
        CMS licensed
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 ${textClass} font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full`}>
      <CheckCircle className={iconClass} />
      Advisor screened
    </span>
  );
}
