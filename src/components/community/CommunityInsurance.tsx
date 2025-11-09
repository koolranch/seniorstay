"use client";

import * as React from 'react';
import { Community } from '@/data/facilities';
import { CheckCircle, XCircle, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CommunityInsuranceProps {
  community: Community;
}

export default function CommunityInsurance({ community }: CommunityInsuranceProps) {
  // Don't show if no insurance data available
  if (
    community.acceptsMedicare === undefined &&
    community.acceptsMedicaid === undefined &&
    !community.medicaidPercentage
  ) {
    return null;
  }

  const hasMedicaidData = community.acceptsMedicaid !== undefined || community.medicaidPercentage !== undefined;
  const hasMedicareData = community.acceptsMedicare !== undefined;

  return (
    <div className="bg-white py-8 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <Info className="w-6 h-6 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Insurance & Payment
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Medicare Acceptance */}
          {hasMedicareData && (
            <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    Medicare
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="text-gray-400 hover:text-gray-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
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
                            Medicare covers skilled nursing care for rehabilitation after a hospital stay (typically up to 100 days with conditions).
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </h3>
                  <div className="flex items-center gap-2">
                    {community.acceptsMedicare ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700 font-medium">Accepted</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-red-600" />
                        <span className="text-gray-700 font-medium">Not Accepted</span>
                      </>
                    )}
                  </div>
                </div>
                {community.acceptsMedicare && (
                  <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                    Certified
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-3">
                {community.acceptsMedicare
                  ? 'This facility is certified to accept Medicare for skilled nursing and rehabilitation services.'
                  : 'This facility does not participate in the Medicare program.'}
              </p>
            </div>
          )}

          {/* Medicaid Acceptance */}
          {hasMedicaidData && (
            <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    Medicaid
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="text-gray-400 hover:text-gray-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
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
                            Medicaid covers long-term care for eligible individuals based on income and asset limits. Ohio Medicaid requires financial qualification.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </h3>
                  <div className="flex items-center gap-2">
                    {community.acceptsMedicaid ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700 font-medium">Accepted</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-red-600" />
                        <span className="text-gray-700 font-medium">Not Accepted</span>
                      </>
                    )}
                  </div>
                </div>
                {community.acceptsMedicaid && (
                  <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                    Certified
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-3">
                {community.acceptsMedicaid
                  ? 'This facility accepts Ohio Medicaid for long-term care services.'
                  : 'This facility does not accept Medicaid. Private pay or other insurance required.'}
              </p>
              
              {/* Medicaid Percentage */}
              {community.medicaidPercentage !== undefined && community.medicaidPercentage > 0 && (
                <div className="mt-4 pt-4 border-t border-green-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Residents using Medicaid:</span>
                    <span className="text-lg font-semibold text-green-700">
                      {community.medicaidPercentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(community.medicaidPercentage, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Based on latest CMS cost report data
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Additional Information */}
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Payment Information
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <span>
                <strong>Private Pay:</strong> Most facilities accept private payment regardless of insurance participation.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <span>
                <strong>Long-Term Care Insurance:</strong> Contact the facility to verify if they accept your specific policy.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <span>
                <strong>VA Benefits:</strong> Veterans may be eligible for Aid & Attendance benefits. Check with the facility for details.
              </span>
            </li>
          </ul>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              <strong>Important:</strong> Always verify insurance acceptance and current rates directly with the facility. 
              Coverage eligibility and bed availability may change.
            </p>
          </div>
        </div>

        {/* Bed Count Information */}
        {community.bedCount && (
          <div className="mt-6">
            <p className="text-sm text-gray-600">
              <strong>Licensed Beds:</strong> {community.bedCount} certified beds
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

