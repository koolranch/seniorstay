"use client";

import * as React from 'react';
import { Community } from '@/data/facilities';
import { Star, AlertTriangle, Shield, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CommunityQualityMetricsProps {
  community: Community;
}

/**
 * Render star rating with visual stars
 */
function StarRating({ rating, label }: { rating?: number; label: string }) {
  if (!rating) return null;

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700 w-32">{label}</span>
      <div className="flex items-center gap-1">
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        ))}
        {/* Half star */}
        {hasHalfStar && (
          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 opacity-50" />
        )}
        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />
        ))}
        <span className="ml-2 text-sm font-semibold text-gray-900">{rating.toFixed(1)}</span>
      </div>
    </div>
  );
}

export default function CommunityQualityMetrics({ community }: CommunityQualityMetricsProps) {
  // Don't show this section if there's no CMS data
  if (!community.ccn && !community.overallRating) {
    return null;
  }

  const hasRatings =
    community.overallRating ||
    community.healthInspectionRating ||
    community.staffingRating ||
    community.qualityRating;

  return (
    <div className="bg-white py-8 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            CMS Quality Ratings
          </h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">
                  Ratings from the Centers for Medicare & Medicaid Services (CMS).
                  Based on health inspections, staffing levels, and quality measures.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {hasRatings ? (
          <div className="space-y-4">
            {/* Overall Rating - Prominent Display */}
            {community.overallRating && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Overall Rating
                    </h3>
                    <StarRating rating={community.overallRating} label="" />
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-blue-600">
                      {community.overallRating.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600">out of 5 stars</div>
                  </div>
                </div>
              </div>
            )}

            {/* Individual Ratings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {community.healthInspectionRating && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 cursor-help flex items-center gap-1">
                          Health Inspection
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </h4>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm">Based on findings from state health inspections</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <StarRating rating={community.healthInspectionRating} label="" />
                </div>
              )}

              {community.staffingRating && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 cursor-help flex items-center gap-1">
                          Staffing
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </h4>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm">Based on nurse staffing hours per resident</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <StarRating rating={community.staffingRating} label="" />
                </div>
              )}

              {community.qualityRating && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 cursor-help flex items-center gap-1">
                          Quality Measures
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </h4>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm">Based on clinical quality measures and resident outcomes</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <StarRating rating={community.qualityRating} label="" />
                </div>
              )}
            </div>

            {/* Warning Badges */}
            <div className="flex flex-wrap gap-3 mt-6">
              {community.abuseIcon && (
                <Badge variant="destructive" className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Reported Abuse Allegations
                </Badge>
              )}
              {community.specialFocusFacility && (
                <Badge variant="outline" className="flex items-center gap-2 border-orange-500 text-orange-700">
                  <AlertTriangle className="w-4 h-4" />
                  Special Focus Facility
                </Badge>
              )}
            </div>

            {/* Last Inspection Date */}
            {community.lastInspectionDate && (
              <div className="text-sm text-gray-600 mt-4">
                Last inspection:{' '}
                {new Date(community.lastInspectionDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            )}

            {/* Link to Care Compare */}
            {community.careCompareUrl && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <a
                  href={community.careCompareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  View full details on Medicare Care Compare
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}

            {/* Data Attribution */}
            {community.cmsLastUpdated && (
              <div className="text-xs text-gray-500 mt-4">
                Data from CMS updated:{' '}
                {new Date(community.cmsLastUpdated).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-600 py-4">
            <p>Quality ratings will be available once CMS data is imported for this facility.</p>
            {community.ccn && (
              <p className="text-sm text-gray-500 mt-2">
                CCN: {community.ccn}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

