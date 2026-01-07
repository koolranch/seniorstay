'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Brain, Home, UserCheck, ArrowRight } from 'lucide-react';

interface CareTypeNavProps {
  cityName: string;
  citySlug: string;
  careTypeCounts: Record<string, number>;
}

/**
 * CareTypeNav - Care type navigation cards with internal linking
 * Links to deeper sub-pages for each care type
 */
const CareTypeNav: React.FC<CareTypeNavProps> = ({ cityName, citySlug, careTypeCounts }) => {
  const careTypes = [
    {
      id: 'assisted-living',
      title: 'Assisted Living',
      description: `Daily support with meals, medications, and personal care in ${cityName}`,
      icon: Heart,
      color: 'rose',
      count: careTypeCounts['Assisted Living'] || 0,
      href: `/assisted-living-cleveland`, // Main page for now
    },
    {
      id: 'memory-care',
      title: 'Memory Care',
      description: `Specialized Alzheimer's and dementia care with 24/7 supervision`,
      icon: Brain,
      color: 'violet',
      count: careTypeCounts['Memory Care'] || 0,
      href: `/memory-care-cleveland`,
    },
    {
      id: 'independent-living',
      title: 'Independent Living',
      description: `Active retirement communities with maintenance-free living`,
      icon: Home,
      color: 'teal',
      count: careTypeCounts['Independent Living'] || 0,
      href: `/independent-living-cleveland`,
    },
    {
      id: 'skilled-nursing',
      title: 'Skilled Nursing',
      description: `24-hour nursing care for complex medical needs and rehabilitation`,
      icon: UserCheck,
      color: 'amber',
      count: (careTypeCounts['Skilled Nursing'] || 0) + (careTypeCounts['Rehabilitation'] || 0),
      href: `/senior-living-costs-cleveland`,
    },
  ];

  const colorClasses = {
    rose: { bg: 'bg-rose-50', border: 'border-rose-200', icon: 'bg-rose-100 text-rose-600', hover: 'hover:border-rose-400' },
    violet: { bg: 'bg-violet-50', border: 'border-violet-200', icon: 'bg-violet-100 text-violet-600', hover: 'hover:border-violet-400' },
    teal: { bg: 'bg-teal-50', border: 'border-teal-200', icon: 'bg-teal-100 text-teal-600', hover: 'hover:border-teal-400' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'bg-amber-100 text-amber-600', hover: 'hover:border-amber-400' },
  };

  return (
    <section className="py-12 bg-white border-b border-slate-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
            Care Types Available in {cityName}
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Explore senior care options by type. Each community offers different levels of care to match your loved one's needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {careTypes.map((careType) => {
            const Icon = careType.icon;
            const colors = colorClasses[careType.color as keyof typeof colorClasses];
            
            return (
              <Link
                key={careType.id}
                href={careType.href}
                className={`group block ${colors.bg} ${colors.border} border-2 rounded-2xl p-6 transition-all duration-300 ${colors.hover} hover:shadow-lg`}
              >
                <div className={`${colors.icon} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-slate-700 transition-colors">
                  {careType.title}
                </h3>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                  {careType.description}
                </p>
                {careType.count > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-500">
                      {careType.count} {careType.count === 1 ? 'community' : 'communities'}
                    </span>
                    <ArrowRight className="h-5 w-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CareTypeNav;

