"use client";

import React from 'react';
import Image from 'next/image';
import { MapPin, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Community } from '@/data/facilities';
import { formatDistance } from '@/utils/distance';
import { getCommunityImage } from '@/lib/communityImages';

interface CommunityWithDistance extends Community {
  distance: number;
}

interface NearbyCommunitiesResultsProps {
  communities: CommunityWithDistance[];
  userZip: string;
  onScheduleTour: (community: Community) => void;
  onGetPricing: (community: Community) => void;
}

export default function NearbyCommunitiesResults({
  communities,
  userZip,
  onScheduleTour,
  onGetPricing,
}: NearbyCommunitiesResultsProps) {
  if (communities.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-gray-200">
        <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Communities Found Near {userZip}
        </h3>
        <p className="text-gray-600 mb-6">
          We couldn't find assisted living or memory care communities within 20 miles of your zip code.
        </p>
        <p className="text-sm text-gray-500">
          Try a different zip code or{' '}
          <a href="/contact" className="text-primary hover:underline font-medium">
            contact us
          </a>{' '}
          for help finding communities in your area.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="text-center">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
          {communities.length} {communities.length === 1 ? 'Community' : 'Communities'} Near {userZip}
        </h3>
        <p className="text-gray-600">
          Top-rated assisted living and memory care within 20 miles
        </p>
      </div>

      {/* Community Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {communities.map((community, index) => {
          const isOnlySkilledNursing = community.careTypes.every(type => 
            type.toLowerCase().includes('skilled nursing')
          ) && !community.careTypes.some(type =>
            type.toLowerCase().includes('assisted living') ||
            type.toLowerCase().includes('memory care')
          );

          return (
            <div
              key={community.id}
              className="group bg-white border-2 border-gray-200 hover:border-primary/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col"
            >
              {/* Image */}
              <div className="relative w-full h-48">
                <Image
                  src={getCommunityImage(community.images?.[0], community.id)}
                  alt={community.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                
                {/* Featured Badge for Top 3 */}
                {index < 3 && (
                  <div className="absolute top-3 left-3 bg-gradient-to-br from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                    <Star className="h-3 w-3 fill-white" />
                    TOP {index + 1}
                  </div>
                )}

                {/* Distance Badge */}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-900 shadow-md">
                  <MapPin className="h-3 w-3 inline mr-1 text-primary" />
                  {formatDistance(community.distance)}
                </div>
              </div>

              {/* Content */}
              <div className="flex-grow p-5">
                {/* Rating */}
                {community.overallRating && (
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(community.overallRating || 0)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">
                      {community.overallRating.toFixed(1)}
                    </span>
                  </div>
                )}

                {/* Name */}
                <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900 group-hover:text-primary transition-colors">
                  {community.name}
                </h3>

                {/* Location */}
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1 text-primary flex-shrink-0" />
                  <span className="line-clamp-1">{community.location}</span>
                </div>

                {/* Care Types */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {community.careTypes.slice(0, 2).map((type, idx) => (
                    <span
                      key={idx}
                      className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {type}
                    </span>
                  ))}
                  {community.careTypes.length > 2 && (
                    <span className="text-xs text-gray-500 self-center">
                      +{community.careTypes.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {!isOnlySkilledNursing ? (
                <div className="p-5 pt-0 mt-auto">
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => onGetPricing(community)}
                      className="w-full border-2 border-gray-300 hover:border-primary hover:bg-primary/5"
                    >
                      Get Pricing
                    </Button>
                    <Button
                      onClick={() => onScheduleTour(community)}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                    >
                      Schedule Tour
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-5 pt-0 mt-auto">
                  <div className="text-center text-sm text-gray-500 py-3 border-t">
                    <p className="italic">Contact facility directly</p>
                    <p className="text-xs mt-1">We specialize in assisted living and memory care</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* View All CTA */}
      {communities.length >= 5 && (
        <div className="text-center pt-6">
          <a
            href="/greater-cleveland"
            className="inline-flex items-center gap-2 text-primary hover:underline font-semibold text-lg"
          >
            View All Communities in Greater Cleveland
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      )}
    </div>
  );
}

