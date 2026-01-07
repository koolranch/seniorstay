"use client";

import React from 'react';
import { 
  DollarSign, 
  Building2, 
  Hospital, 
  Star, 
  Users, 
  Brain,
  MapPin,
  TrendingUp
} from 'lucide-react';
import { Community } from '@/data/facilities';
import { CityInfo } from '@/data/cleveland-cities';

interface QuickFactsProps {
  cityName: string;
  stateAbbr: string;
  communities: Community[];
  cityData?: CityInfo;
}

/**
 * QuickFacts Component - AEO-optimized summary block for featured snippets
 * Displays key data points in a scannable format for both users and search engines
 */
export default function QuickFacts({ cityName, stateAbbr, communities, cityData }: QuickFactsProps) {
  // Calculate metrics
  const communityCount = communities.length;
  
  // Average rating
  const ratingsWithValues = communities.filter(c => c.rating && c.rating > 0);
  const averageRating = ratingsWithValues.length > 0 
    ? (ratingsWithValues.reduce((sum, c) => sum + (c.rating || 0), 0) / ratingsWithValues.length).toFixed(1)
    : null;
  
  // Count care types
  const careTypeCounts: Record<string, number> = {};
  communities.forEach(community => {
    community.careTypes.forEach(type => {
      careTypeCounts[type] = (careTypeCounts[type] || 0) + 1;
    });
  });
  
  const memoryCareCount = careTypeCounts['Memory Care'] || 0;
  const assistedLivingCount = careTypeCounts['Assisted Living'] || 0;
  const independentLivingCount = careTypeCounts['Independent Living'] || 0;
  
  // Total beds (memory care focused)
  const totalBeds = communities
    .filter(c => c.careTypes.some(t => t.toLowerCase().includes('memory')))
    .reduce((sum, c) => sum + (c.bedCount || 0), 0);
  
  // Cost data
  const assistedLivingCost = cityData?.averageCost?.assistedLiving || '$3,500 - $6,500';
  const memoryCareCost = cityData?.averageCost?.memoryCare || '$5,000 - $8,500';
  
  // Nearest hospital
  const nearestHospital = cityData?.nearbyHospitals?.[0] || 'Cleveland Clinic';
  
  const facts = [
    {
      icon: Building2,
      label: 'Total Communities',
      value: communityCount.toString(),
      subtext: `in ${cityName}, OH`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: DollarSign,
      label: 'Avg. Assisted Living Cost',
      value: assistedLivingCost,
      subtext: 'per month',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      icon: Brain,
      label: 'Memory Care Communities',
      value: memoryCareCount.toString(),
      subtext: totalBeds > 0 ? `~${totalBeds} beds available` : 'specialized programs',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Hospital,
      label: 'Nearest Hospital',
      value: nearestHospital.length > 25 ? nearestHospital.substring(0, 22) + '...' : nearestHospital,
      subtext: 'quality healthcare nearby',
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
    },
  ];

  // Add rating if available
  if (averageRating) {
    facts.splice(1, 0, {
      icon: Star,
      label: 'Average Rating',
      value: `${averageRating}/5`,
      subtext: `from ${ratingsWithValues.length} communities`,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    });
  }

  return (
    <section 
      className="bg-gradient-to-br from-slate-50 via-white to-blue-50 border-b border-slate-200"
      aria-label={`Quick facts about senior living in ${cityName}`}
    >
      <div className="container mx-auto px-4 py-6">
        {/* Header with schema-friendly markup */}
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-slate-800">
            {cityName} Senior Living at a Glance
          </h2>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
            2026 Data
          </span>
        </div>
        
        {/* Quick Facts Grid - optimized for featured snippets */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {facts.map((fact, index) => (
            <div 
              key={index}
              className={`${fact.bgColor} rounded-xl p-4 border border-slate-100 hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start gap-3">
                <div className={`${fact.color} p-2 bg-white rounded-lg shadow-sm`}>
                  <fact.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-0.5">
                    {fact.label}
                  </p>
                  <p className={`text-lg font-bold ${fact.color} truncate`}>
                    {fact.value}
                  </p>
                  <p className="text-xs text-slate-600 truncate">
                    {fact.subtext}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Summary sentence for AEO - direct answer format */}
        <div className="mt-4 p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-700 leading-relaxed">
            <MapPin className="inline h-4 w-4 text-primary mr-1 -mt-0.5" />
            <strong>{cityName}, Ohio</strong> has <strong>{communityCount} senior living communities</strong> offering 
            {assistedLivingCount > 0 && <> assisted living ({assistedLivingCount})</>}
            {memoryCareCount > 0 && <>{assistedLivingCount > 0 ? ',' : ''} memory care ({memoryCareCount})</>}
            {independentLivingCount > 0 && <>{(assistedLivingCount > 0 || memoryCareCount > 0) ? ',' : ''} independent living ({independentLivingCount})</>}
            . Average assisted living costs <strong>{assistedLivingCost}/month</strong>
            {averageRating && <>, with communities rated <strong>{averageRating}/5 stars</strong> on average</>}.
            {cityData?.nearbyHospitals && cityData.nearbyHospitals.length > 0 && (
              <> Healthcare access includes <strong>{cityData.nearbyHospitals[0]}</strong>.</>
            )}
          </p>
        </div>
        
        {/* Care Type Pills */}
        <div className="flex flex-wrap gap-2 mt-4">
          {Object.entries(careTypeCounts).map(([type, count]) => (
            <span
              key={type}
              className="inline-flex items-center px-3 py-1.5 rounded-full bg-white border border-slate-200 text-sm font-medium text-slate-700 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
              {type}: {count}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

