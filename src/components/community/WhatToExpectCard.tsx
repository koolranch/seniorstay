'use client';

import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

interface ContentSection {
  title: string;
  items: string[];
}

const CARE_TYPE_CONTENT: Record<string, ContentSection[]> = {
  'Memory Care': [
    {
      title: 'What a Typical Day Looks Like',
      items: [
        'Structured morning routine with personal care assistance',
        'Cognitive activities: music therapy, art, reminiscence sessions',
        'Supervised meals in a calm, secure dining environment',
        'Afternoon wellness programs and sensory activities',
        'Evening social time and guided relaxation',
      ],
    },
    {
      title: 'Questions to Ask on Your Tour',
      items: [
        'What is the staff-to-resident ratio, especially at night?',
        'How do you handle wandering and elopement prevention?',
        'What specific dementia training does staff receive?',
        'How do you communicate changes in condition to families?',
        'Can residents bring personal furniture and belongings?',
      ],
    },
    {
      title: 'How Families Pay for Memory Care',
      items: [
        'Private pay (most common) — average $5,000–$8,500/month in Cleveland',
        'Long-term care insurance — check your policy for dementia coverage',
        'Veterans Aid & Attendance — up to $2,431/month for qualifying couples',
        'Ohio Medicaid PASSPORT waiver — limited slots, apply early',
        'Home equity or life insurance conversion options',
      ],
    },
  ],
  'Assisted Living': [
    {
      title: 'What a Typical Day Looks Like',
      items: [
        'Wake up on your schedule with optional assistance',
        'Chef-prepared breakfast in community dining room',
        'Morning exercise class, book club, or creative arts',
        'Lunch and afternoon social activities or outings',
        'Evening dinner, entertainment, and personal time',
      ],
    },
    {
      title: 'Questions to Ask on Your Tour',
      items: [
        'What levels of care do you offer, and how do costs change?',
        'What is included in the base monthly rate?',
        'How do you personalize care as needs change over time?',
        'What activities and outings are offered weekly?',
        'Can I try a short-term or respite stay first?',
      ],
    },
    {
      title: 'How Families Pay for Assisted Living',
      items: [
        'Private pay — average $3,500–$6,500/month in Cleveland',
        'Long-term care insurance — many policies cover assisted living',
        'Veterans Aid & Attendance benefits',
        'Ohio Medicaid Assisted Living Waiver (limited availability)',
        'Bridge loans or home sale proceeds',
      ],
    },
  ],
  'Independent Living': [
    {
      title: 'What a Typical Day Looks Like',
      items: [
        'Complete independence with maintenance-free living',
        'Optional dining — restaurant-quality meals included',
        'Fitness center, swimming pool, and wellness programs',
        'Social clubs, outings, and community events',
        'Travel programs and lifelong learning classes',
      ],
    },
    {
      title: 'Questions to Ask on Your Tour',
      items: [
        'What floor plans are available and what is included?',
        'Are there entrance fees or just monthly rent?',
        'What happens if I need more care in the future?',
        'What transportation services are provided?',
        'What is the social atmosphere and average resident age?',
      ],
    },
    {
      title: 'How Families Pay for Independent Living',
      items: [
        'Private pay — average $2,000–$4,500/month in Cleveland',
        'Social Security and pension income',
        'Home sale proceeds — often covers years of rent',
        'Retirement savings and investment income',
        'Some communities offer buy-in models with equity',
      ],
    },
  ],
};

interface WhatToExpectCardProps {
  careTypes: string[];
}

export default function WhatToExpectCard({ careTypes }: WhatToExpectCardProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  // Determine primary care type for content
  const primaryCareType = careTypes.find(t => t === 'Memory Care')
    || careTypes.find(t => t === 'Assisted Living')
    || careTypes.find(t => t === 'Independent Living')
    || 'Assisted Living';

  const content = CARE_TYPE_CONTENT[primaryCareType] || CARE_TYPE_CONTENT['Assisted Living'];

  return (
    <div className="lg:col-span-2 rounded-2xl p-6 border bg-white" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
      <div className="flex items-start gap-3 mb-5">
        <div className="p-2.5 rounded-xl shrink-0" style={{ backgroundColor: 'rgba(141, 163, 153, 0.15)' }}>
          <BookOpen className="h-5 w-5" style={{ color: '#8DA399' }} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-0.5">What to Expect</h2>
          <p className="text-sm text-slate-500">Helpful info about {primaryCareType.toLowerCase()}</p>
        </div>
      </div>

      <div className="space-y-2">
        {content.map((section, i) => (
          <div key={i} className="rounded-xl border border-slate-200 overflow-hidden">
            <button
              onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors"
            >
              <span className="font-medium text-sm text-slate-900">{section.title}</span>
              {expandedIndex === i ? (
                <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
              )}
            </button>
            {expandedIndex === i && (
              <div className="px-4 pb-4">
                <ul className="space-y-2">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
