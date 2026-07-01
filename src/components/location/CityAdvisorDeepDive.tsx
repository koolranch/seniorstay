'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, MapPin, Hospital, DollarSign, Quote, ShoppingBag, TreePine } from 'lucide-react';
import PhoneLink from '@/components/conversion/PhoneLink';
import { PLACEMENT_PHONE_DISPLAY } from '@/lib/placement-contact';

interface CommunityTake {
  name: string;
  careTypes: string;
  take: string;
}

interface PriceRow {
  careType: string;
  range: string;
  note: string;
}

interface LandmarkItem {
  icon: 'hospital' | 'shopping' | 'park';
  name: string;
  desc: string;
}

interface CityDeepDiveData {
  advisorIntro: string;
  communityTakes: CommunityTake[];
  pricing: PriceRow[];
  pricingContext: string;
  landmarks: LandmarkItem[];
}

/**
 * Flagship city deep-dive content. Add an entry per city as we build out
 * E-E-A-T coverage — cities without an entry render nothing.
 */
const CITY_DEEP_DIVE: Record<string, CityDeepDiveData> = {
  westlake: {
    advisorIntro:
      "Westlake is the suburb we recommend most often to West Side families — and the one where we place the most residents. It has the densest cluster of quality assisted living and memory care on Cleveland's West Side, all within ten minutes of UH St. John Medical Center. Here's our honest read on the communities we work with most.",
    communityTakes: [
      {
        name: 'Vitalia Senior Residences at Westlake',
        careTypes: 'Assisted Living · Memory Care',
        take: 'One of the newer buildings in Westlake with a resort-style feel — restaurant dining, salon, theater. A strong fit when a parent is reluctant to move and first impressions matter. Expect premium pricing for the newest apartments.',
      },
      {
        name: 'Devon Oaks Assisted Living',
        careTypes: 'Assisted Living · Memory Care',
        take: 'Part of the Eliza Jennings network, a well-regarded Northeast Ohio nonprofit. Smaller and quieter than the big campuses, with long-tenured staff — families who value continuity of caregivers tend to be happiest here.',
      },
      {
        name: 'Brookdale Westlake Village',
        careTypes: 'Independent Living · Assisted Living · Memory Care',
        take: 'The largest campus in Westlake, set on wooded grounds off Westlake Village Drive. The advantage is the full continuum — a couple with different care needs can stay on one campus. Ask about apartment renovations when you tour; they vary by wing.',
      },
      {
        name: 'Fairmont Senior Living of Westlake',
        careTypes: 'Assisted Living · Memory Care',
        take: 'A strong memory care option on Center Ridge Road with dementia-specific programming throughout the building, not just in a locked wing. Worth touring if cognitive decline is the primary concern.',
      },
      {
        name: 'Arden Courts of Westlake',
        careTypes: 'Memory Care',
        take: 'Memory care only — and that focus shows. Purpose-built layout with four small "houses" and secured walking paths. For moderate to advanced dementia, this is often our first call on the West Side.',
      },
      {
        name: 'Saint Therese of Westlake',
        careTypes: 'Assisted Living · Memory Care',
        take: 'A newer faith-based community on Detroit Road. Appeals to families who want spiritual life woven into daily programming, though residents of all backgrounds live comfortably here.',
      },
      {
        name: 'Westlake Pointe Senior Living',
        careTypes: 'Independent Living',
        take: 'A solid value for active seniors who want maintenance-free living without paying for care services they don\u2019t need yet. A common first step for those downsizing from a Westlake or Bay Village house.',
      },
    ],
    pricing: [
      { careType: 'Independent Living', range: '$2,400 – $4,300/mo', note: 'Apartment-style, meals and housekeeping included at most communities' },
      { careType: 'Assisted Living', range: '$4,300 – $6,900/mo', note: 'Base rent plus care level; Westlake runs above the Cleveland metro average' },
      { careType: 'Memory Care', range: '$5,600 – $8,500/mo', note: 'Secured neighborhoods with specialized staffing, usually all-inclusive' },
    ],
    pricingContext:
      'Westlake is a premium West Side market — typically 10–20% above the Greater Cleveland average, reflecting newer buildings and proximity to UH St. John Medical Center and Crocker Park. Most communities charge a base rent plus a care fee that is set after a nursing assessment, so two families quoting the "same community" can pay very different totals. We share current rate sheets and move-in specials before you tour.',
    landmarks: [
      {
        icon: 'hospital',
        name: 'UH St. John Medical Center',
        desc: 'Full-service hospital right in Westlake — most communities are under 10 minutes away, and several have preferred discharge relationships.',
      },
      {
        icon: 'shopping',
        name: 'Crocker Park',
        desc: 'Walkable shopping and dining district that many communities use for outings; convenient for visiting family to make a day of it.',
      },
      {
        icon: 'park',
        name: 'Huntington Reservation & Lake Erie',
        desc: 'Cleveland Metroparks lakefront is minutes north — a real quality-of-life factor for seniors who love being near the water.',
      },
    ],
  },
};

const LANDMARK_ICONS = {
  hospital: Hospital,
  shopping: ShoppingBag,
  park: TreePine,
} as const;

interface CityAdvisorDeepDiveProps {
  citySlug: string;
  cityName: string;
}

export default function CityAdvisorDeepDive({ citySlug, cityName }: CityAdvisorDeepDiveProps) {
  const data = CITY_DEEP_DIVE[citySlug];
  if (!data) return null;

  const currentYear = new Date().getFullYear();

  return (
    <section className="py-14 md:py-16 bg-white border-t border-slate-200">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Advisor intro */}
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-teal-100 p-2 rounded-lg">
              <Quote className="h-6 w-6 text-teal-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Our Advisor&apos;s Take: {cityName} Communities
            </h2>
          </div>
          <p className="text-lg text-slate-700 leading-relaxed mb-10">{data.advisorIntro}</p>

          {/* Community commentary */}
          <div className="space-y-4 mb-14">
            {data.communityTakes.map((community) => (
              <div key={community.name} className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                  <h3 className="font-bold text-slate-900 text-lg">{community.name}</h3>
                  <span className="text-teal-700 text-sm font-semibold whitespace-nowrap">{community.careTypes}</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{community.take}</p>
              </div>
            ))}
          </div>

          {/* Pricing table */}
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-teal-100 p-2 rounded-lg">
                <DollarSign className="h-6 w-6 text-teal-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                What {cityName} Senior Living Costs in {currentYear}
              </h2>
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200 mb-5">
              <table className="w-full text-left">
                <thead className="bg-slate-800 text-white">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Care Type</th>
                    <th className="px-5 py-4 font-semibold whitespace-nowrap">Typical {cityName} Range</th>
                    <th className="px-5 py-4 font-semibold hidden md:table-cell">What&apos;s Included</th>
                  </tr>
                </thead>
                <tbody>
                  {data.pricing.map((row, index) => (
                    <tr key={row.careType} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="px-5 py-4 font-semibold text-slate-900">{row.careType}</td>
                      <td className="px-5 py-4 text-teal-700 font-bold whitespace-nowrap">{row.range}</td>
                      <td className="px-5 py-4 text-slate-600 text-sm hidden md:table-cell">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-slate-600 leading-relaxed">{data.pricingContext}</p>
            <p className="text-slate-600 mt-3">
              Worried about affording it? See how the{' '}
              <Link href="/medicaid-assisted-living-ohio" className="text-teal-700 font-semibold underline underline-offset-2">
                Ohio Assisted Living Medicaid Waiver
              </Link>{' '}
              works and which communities accept it.
            </p>
          </div>

          {/* Landmarks / healthcare */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-teal-100 p-2 rounded-lg">
                <MapPin className="h-6 w-6 text-teal-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                Why Families Choose {cityName}
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {data.landmarks.map((landmark) => {
                const Icon = LANDMARK_ICONS[landmark.icon];
                return (
                  <div key={landmark.name} className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                    <Icon className="h-7 w-7 text-teal-600 mb-3" />
                    <h3 className="font-bold text-slate-900 mb-2">{landmark.name}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{landmark.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Inline CTA */}
          <div className="bg-slate-900 rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-3">
              Want current {cityName} pricing and availability?
            </h3>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Rate sheets change monthly and move-in specials come and go. One call gets you
              today&apos;s numbers for every community above — free.
            </p>
            <PhoneLink
              placement="city_deep_dive_cta"
              className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-bold px-8 py-4 rounded-xl min-h-[56px]"
            >
              <Phone className="h-5 w-5" />
              Call {PLACEMENT_PHONE_DISPLAY}
            </PhoneLink>
          </div>
        </div>
      </div>
    </section>
  );
}
