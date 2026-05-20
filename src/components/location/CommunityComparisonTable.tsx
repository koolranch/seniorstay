"use client";

import React from 'react';
import Link from 'next/link';
import { Star, Check, DollarSign, Phone } from 'lucide-react';
import { Community } from '@/data/facilities';
import CommunityTrustBadge from '@/components/community/CommunityTrustBadge';
import PhoneLink from '@/components/conversion/PhoneLink';
import { formatPriceEstimate } from '@/lib/community-pricing';

interface CommunityComparisonTableProps {
  communities: Community[];
  cityName: string;
  maxCommunities?: number;
  regionSlug?: string;
}

function getKeyFeatures(community: Community): string[] {
  if (community.amenityTags?.length) {
    return community.amenityTags.slice(0, 3);
  }
  if (community.amenities?.length) {
    return community.amenities.slice(0, 3);
  }

  const features: string[] = [];
  const careTypes = community.careTypes.map((t) => t.toLowerCase());

  if (careTypes.some((t) => t.includes('memory care'))) features.push('Secure Memory Care');
  if (careTypes.some((t) => t.includes('assisted living'))) features.push('Personal Care');
  if (careTypes.some((t) => t.includes('independent'))) features.push('Independent Living');
  if (careTypes.some((t) => t.includes('skilled nursing') || t.includes('rehabilitation'))) {
    features.push('Skilled Nursing');
  }
  features.push('24/7 Staff');
  return features.slice(0, 3);
}

function StarRating({ rating }: { rating: number | undefined }) {
  if (!rating) return null;

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1 justify-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < fullStars
              ? 'text-yellow-400 fill-yellow-400'
              : i === fullStars && hasHalfStar
                ? 'text-yellow-400 fill-yellow-400/50'
                : 'text-gray-300'
          }`}
        />
      ))}
      <span className="text-sm text-gray-600 ml-1">({rating.toFixed(1)})</span>
    </div>
  );
}

export default function CommunityComparisonTable({
  communities,
  cityName,
  maxCommunities = 6,
  regionSlug = 'cleveland',
}: CommunityComparisonTableProps) {
  const relevantCommunities = communities
    .filter((c) =>
      c.careTypes.some(
        (t) =>
          t.toLowerCase().includes('assisted living') ||
          t.toLowerCase().includes('memory care')
      )
    )
    .slice(0, maxCommunities);

  if (relevantCommunities.length === 0) return null;

  const communityUrl = (community: Community) => {
    const slug = community.slug || community.name.toLowerCase().replace(/\s+/g, '-');
    return `/${regionSlug}/community/${community.id}/${slug}`;
  };

  return (
    <section className="bg-white py-8 border-t border-b border-gray-200">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-2">
          Compare Senior Living Communities in {cityName}
        </h2>
        <p className="text-gray-600 mb-6">
          Side-by-side comparison with estimated pricing — confirm exact rates on a free placement call
        </p>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-4 border-b border-gray-200 font-semibold">Community</th>
                <th className="text-left p-4 border-b border-gray-200 font-semibold">Est. Monthly</th>
                <th className="text-left p-4 border-b border-gray-200 font-semibold">Care Types</th>
                <th className="text-left p-4 border-b border-gray-200 font-semibold">Highlights</th>
                <th className="text-center p-4 border-b border-gray-200 font-semibold">Quality</th>
                <th className="text-center p-4 border-b border-gray-200 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {relevantCommunities.map((community, index) => {
                const features = getKeyFeatures(community);
                const url = communityUrl(community);

                return (
                  <tr
                    key={community.id}
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-primary/5 transition-colors`}
                  >
                    <td className="p-4 border-b border-gray-100">
                      <Link href={url} className="font-medium text-gray-900 hover:text-primary transition-colors">
                        {community.name}
                      </Link>
                      {community.address && (
                        <div className="text-sm text-gray-500 mt-1">{community.address.split(',')[0]}</div>
                      )}
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <div className="font-bold text-teal-700 flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {formatPriceEstimate(community)}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase mt-0.5">Estimate</div>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <div className="flex flex-wrap gap-1">
                        {community.careTypes.map((type, i) => (
                          <span key={i} className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                            {type}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <ul className="space-y-1">
                        {features.map((feature, i) => (
                          <li key={i} className="flex items-center text-sm text-gray-600">
                            <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-4 border-b border-gray-100 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <CommunityTrustBadge community={community} />
                        <StarRating rating={community.overallRating} />
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-100 text-center">
                      <div className="flex flex-col gap-2 items-center">
                        <PhoneLink
                          placement="comparison_table"
                          className="inline-flex items-center justify-center gap-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-3 py-2 rounded-md whitespace-nowrap min-h-[36px]"
                        >
                          <Phone className="h-3 w-3" />
                          Call for Pricing
                        </PhoneLink>
                        <Link href={url} className="text-xs text-slate-500 hover:text-teal-600">
                          View details →
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-4">
          {relevantCommunities.map((community) => {
            const url = communityUrl(community);
            const features = getKeyFeatures(community);
            return (
              <div key={community.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <Link href={url} className="font-semibold text-lg text-gray-900 hover:text-primary block mb-2">
                  {community.name}
                </Link>
                <p className="font-bold text-teal-700 mb-2">{formatPriceEstimate(community)}</p>
                <CommunityTrustBadge community={community} size="md" />
                <ul className="space-y-1 my-3">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-600">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <PhoneLink
                  placement="comparison_table_mobile"
                  className="w-full inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-md mb-2 min-h-[48px]"
                >
                  <Phone className="h-4 w-4" />
                  Call for Pricing
                </PhoneLink>
                <Link href={url} className="block text-center text-xs text-slate-500 hover:text-teal-600">
                  View details →
                </Link>
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <PhoneLink
            placement="comparison_table_footer"
            className="inline-flex items-center gap-2 text-teal-700 hover:text-teal-900 font-semibold text-sm"
          >
            <Phone className="h-4 w-4" />
            Need help choosing? Call for free personalized guidance
          </PhoneLink>
        </div>
      </div>
    </section>
  );
}
