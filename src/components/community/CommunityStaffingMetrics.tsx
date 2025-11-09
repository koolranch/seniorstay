"use client";

import * as React from 'react';
import { Users, TrendingDown, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StaffingData {
  avg_rn_hprd?: number;
  avg_lpn_hprd?: number;
  avg_cna_hprd?: number;
  avg_total_nurse_hprd?: number;
  weekend_rn_delta?: number;
  weekend_total_delta?: number;
  quarter_ending?: string;
}

interface CommunityStaffingMetricsProps {
  ccn?: string;
}

export default function CommunityStaffingMetrics({ ccn }: CommunityStaffingMetricsProps) {
  const [staffing, setStaffing] = React.useState<StaffingData | null>(null);
  const [loading, setLoading] = React.useState(true);

  // TODO: Fetch staffing data from Supabase when data is available
  // This is a placeholder for when PBJ data is imported

  if (!ccn) return null;
  if (loading) return null; // Or show skeleton
  if (!staffing) return null;

  return (
    <div className="bg-white py-8 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Staffing Levels
          </h2>
        </div>

        <p className="text-gray-600 mb-6">
          Average nurse staffing hours per resident day (90-day rolling average)
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* RN Staffing */}
          {staffing.avg_rn_hprd !== undefined && (
            <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-200 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Registered Nurses (RN)
              </h3>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {staffing.avg_rn_hprd.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">hours per resident day</div>
              
              {staffing.weekend_rn_delta !== undefined && staffing.weekend_rn_delta !== 0 && (
                <div className={`mt-4 flex items-center gap-2 text-sm ${staffing.weekend_rn_delta < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {staffing.weekend_rn_delta < 0 ? (
                    <TrendingDown className="w-4 h-4" />
                  ) : (
                    <TrendingUp className="w-4 h-4" />
                  )}
                  <span>
                    {Math.abs(staffing.weekend_rn_delta).toFixed(1)}% on weekends
                  </span>
                </div>
              )}
            </div>
          )}

          {/* LPN Staffing */}
          {staffing.avg_lpn_hprd !== undefined && (
            <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Licensed Practical Nurses (LPN)
              </h3>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {staffing.avg_lpn_hprd.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">hours per resident day</div>
            </div>
          )}

          {/* CNA Staffing */}
          {staffing.avg_cna_hprd !== undefined && (
            <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Certified Nursing Assistants (CNA)
              </h3>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {staffing.avg_cna_hprd.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">hours per resident day</div>
            </div>
          )}
        </div>

        {/* Total Staffing */}
        {staffing.avg_total_nurse_hprd !== undefined && (
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Total Nurse Staffing
                </h3>
                <p className="text-sm text-gray-600">Combined RN, LPN, and CNA hours</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-gray-900">
                  {staffing.avg_total_nurse_hprd.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">HPRD</div>
              </div>
            </div>

            {staffing.weekend_total_delta !== undefined && staffing.weekend_total_delta !== 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Badge variant={staffing.weekend_total_delta < 0 ? 'destructive' : 'default'}>
                  Weekend staffing is {Math.abs(staffing.weekend_total_delta).toFixed(1)}%{' '}
                  {staffing.weekend_total_delta < 0 ? 'lower' : 'higher'} than weekdays
                </Badge>
              </div>
            )}
          </div>
        )}

        {/* Data Attribution */}
        {staffing.quarter_ending && (
          <div className="text-xs text-gray-500 mt-6">
            Staffing data through: {new Date(staffing.quarter_ending).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        )}

        <div className="mt-4 text-sm text-gray-600">
          <p>
            <strong>What is HPRD?</strong> Hours Per Resident Day measures how many hours of nursing care 
            each resident receives on average per day. Higher numbers typically indicate more staff attention.
          </p>
        </div>
      </div>
    </div>
  );
}

