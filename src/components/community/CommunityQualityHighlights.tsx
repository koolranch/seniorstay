"use client";

import * as React from 'react';
import { Activity, TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface QualityData {
  pressure_ulcers_percent?: number;
  falls_with_injury_percent?: number;
  antipsychotic_use_percent?: number;
  hospitalization_rate?: number;
  emergency_room_visits_rate?: number;
  quarter_ending?: string;
}

interface CommunityQualityHighlightsProps {
  ccn?: string;
}

interface QualityMeasure {
  label: string;
  value: number;
  direction: 'lower' | 'higher'; // Whether lower or higher is better
  unit: string;
  description: string;
}

export default function CommunityQualityHighlights({ ccn }: CommunityQualityHighlightsProps) {
  const [quality, setQuality] = React.useState<QualityData | null>(null);
  const [loading, setLoading] = React.useState(true);

  // TODO: Fetch quality data from Supabase when data is available
  // This is a placeholder for when QRP data is imported

  if (!ccn) return null;
  if (loading) return null; // Or show skeleton
  if (!quality) return null;

  const measures: QualityMeasure[] = [
    {
      label: 'Pressure Ulcers',
      value: quality.pressure_ulcers_percent || 0,
      direction: 'lower' as const,
      unit: '%',
      description: 'Percentage of residents with new or worsening pressure ulcers',
    },
    {
      label: 'Falls with Major Injury',
      value: quality.falls_with_injury_percent || 0,
      direction: 'lower' as const,
      unit: '%',
      description: 'Percentage of residents experiencing falls with major injury',
    },
    {
      label: 'Antipsychotic Use',
      value: quality.antipsychotic_use_percent || 0,
      direction: 'lower' as const,
      unit: '%',
      description: 'Percentage of residents given antipsychotic medication',
    },
    {
      label: 'Hospitalization Rate',
      value: quality.hospitalization_rate || 0,
      direction: 'lower' as const,
      unit: ' per 1,000 days',
      description: 'Rate of hospitalizations per 1,000 resident days',
    },
    {
      label: 'Emergency Room Visits',
      value: quality.emergency_room_visits_rate || 0,
      direction: 'lower' as const,
      unit: ' per 1,000 days',
      description: 'Rate of ER visits per 1,000 resident days',
    },
  ].filter(m => m.value > 0);

  if (measures.length === 0) return null;

  return (
    <div className="bg-white py-8 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <Activity className="w-6 h-6 text-teal-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Quality Measures
          </h2>
        </div>

        <p className="text-gray-600 mb-6">
          Key clinical outcomes and resident care quality indicators
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {measures.map((measure, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 flex-1">
                  {measure.label}
                </h3>
                <div className="ml-2">
                  {measure.direction === 'lower' ? (
                    <TrendingDown className="w-5 h-5 text-green-600" />
                  ) : (
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  )}
                </div>
              </div>

              <div className="text-3xl font-bold text-gray-900 mb-2">
                {measure.value.toFixed(1)}{measure.unit}
              </div>

              <p className="text-xs text-gray-600">
                {measure.description}
              </p>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {measure.direction === 'lower' ? (
                    <>
                      <TrendingDown className="w-3 h-3" />
                      <span>Lower is better</span>
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-3 h-3" />
                      <span>Higher is better</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Data Attribution */}
        {quality.quarter_ending && (
          <div className="text-xs text-gray-500 mt-6">
            Quality data through: {new Date(quality.quarter_ending).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        )}

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <strong>Understanding Quality Measures:</strong> These measures come from CMS's SNF Quality Reporting Program 
            and reflect actual resident outcomes. They help compare facilities and identify areas of excellence or concern.
          </p>
        </div>
      </div>
    </div>
  );
}

