"use client";

import React from 'react';
import Link from 'next/link';
import { Star, Check, X, ExternalLink, ArrowRight } from 'lucide-react';
import { Community } from '@/data/facilities';
import { Button } from '@/components/ui/button';

interface CommunityComparisonTableProps {
  communities: Community[];
  cityName: string;
  maxCommunities?: number;
}

/**
 * Get key features for a community based on care types
 */
function getKeyFeatures(community: Community): string[] {
  const features: string[] = [];
  const careTypes = community.careTypes.map(t => t.toLowerCase());
  
  if (careTypes.some(t => t.includes('memory care'))) {
    features.push('Secure Memory Care');
  }
  if (careTypes.some(t => t.includes('assisted living'))) {
    features.push('Personal Care');
  }
  if (careTypes.some(t => t.includes('independent'))) {
    features.push('Independent Living');
  }
  if (careTypes.some(t => t.includes('skilled nursing') || t.includes('rehabilitation'))) {
    features.push('Skilled Nursing');
  }
  
  // Add common features based on typical offerings
  features.push('24/7 Staff');
  
  return features.slice(0, 3);
}

/**
 * Render star rating
 */
function StarRating({ rating }: { rating: number | undefined }) {
  if (!rating) {
    return <span className="text-gray-400 text-sm">Not rated</span>;
  }
  
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="flex items-center gap-1">
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
  maxCommunities = 6
}: CommunityComparisonTableProps) {
  // Filter to only show assisted living and memory care communities (our focus)
  const relevantCommunities = communities
    .filter(c => 
      c.careTypes.some(t => 
        t.toLowerCase().includes('assisted living') || 
        t.toLowerCase().includes('memory care')
      )
    )
    .slice(0, maxCommunities);

  if (relevantCommunities.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-8 border-t border-b border-gray-200">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-2">
          Compare Senior Living Communities in {cityName}
        </h2>
        <p className="text-gray-600 mb-6">
          Side-by-side comparison of assisted living and memory care options
        </p>
        
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-4 border-b border-gray-200 font-semibold">
                  Community
                </th>
                <th className="text-left p-4 border-b border-gray-200 font-semibold">
                  Care Types
                </th>
                <th className="text-left p-4 border-b border-gray-200 font-semibold">
                  Key Features
                </th>
                <th className="text-center p-4 border-b border-gray-200 font-semibold">
                  Rating
                </th>
                <th className="text-center p-4 border-b border-gray-200 font-semibold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {relevantCommunities.map((community, index) => {
                const communitySlug = community.name.toLowerCase().replace(/\s+/g, '-');
                const communityUrl = `/community/${community.id}/${communitySlug}`;
                const features = getKeyFeatures(community);
                
                return (
                  <tr 
                    key={community.id} 
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-primary/5 transition-colors`}
                  >
                    <td className="p-4 border-b border-gray-100">
                      <Link 
                        href={communityUrl}
                        className="font-medium text-gray-900 hover:text-primary transition-colors"
                      >
                        {community.name}
                      </Link>
                      {community.address && (
                        <div className="text-sm text-gray-500 mt-1">
                          {community.address.split(',')[0]}
                        </div>
                      )}
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <div className="flex flex-wrap gap-1">
                        {community.careTypes.map((type, i) => (
                          <span 
                            key={i}
                            className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                          >
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
                      <StarRating rating={community.overallRating} />
                    </td>
                    <td className="p-4 border-b border-gray-100 text-center">
                      <Link href={communityUrl}>
                        <Button size="sm" variant="outline" className="whitespace-nowrap">
                          View Details
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {relevantCommunities.map((community) => {
            const communitySlug = community.name.toLowerCase().replace(/\s+/g, '-');
            const communityUrl = `/community/${community.id}/${communitySlug}`;
            const features = getKeyFeatures(community);
            
            return (
              <div 
                key={community.id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <Link 
                  href={communityUrl}
                  className="font-semibold text-lg text-gray-900 hover:text-primary block mb-2"
                >
                  {community.name}
                </Link>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {community.careTypes.map((type, i) => (
                    <span 
                      key={i}
                      className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                    >
                      {type}
                    </span>
                  ))}
                </div>
                
                <div className="mb-3">
                  <StarRating rating={community.overallRating} />
                </div>
                
                <ul className="space-y-1 mb-4">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-600">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Link href={communityUrl}>
                  <Button size="sm" className="w-full">
                    View Details
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
        
        {/* CTA */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help choosing? Our advisors provide free, personalized guidance.
          </p>
        </div>
      </div>
    </section>
  );
}

