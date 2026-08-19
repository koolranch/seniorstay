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

  'rocky-river': {
    advisorIntro:
      "Rocky River is our most-requested West Side suburb after Westlake — walkable downtown, Metroparks, and a tight cluster of assisted living and memory care near Fairview Hospital. Here's how we usually shortlist it for private-pay families.",
    communityTakes: [
      {
        name: 'Bloom at Rocky River',
        careTypes: 'Assisted Living · Memory Care',
        take: 'Family-operated feel with strong memory care programming. A frequent first tour when dementia is the primary concern and families want something smaller than a big national campus.',
      },
      {
        name: 'The Normandy',
        careTypes: 'Independent Living · Assisted Living',
        take: 'Lakefront campus with independent and assisted living. Best when a couple needs different support levels or when the resident still wants an apartment lifestyle near Lake Erie.',
      },
      {
        name: 'Embassy of Rockport',
        careTypes: 'Assisted Living · Memory Care',
        take: 'Often the value conversation on Center Ridge — useful when budget is tighter than Bloom or Normandy but families still want Rocky River / West Shore proximity.',
      },
      {
        name: 'Rocky River Village',
        careTypes: 'Independent Living · Assisted Living · Memory Care',
        take: 'Continuum option when the family wants room to age in place on one campus. Ask about current renovations and which buildings accept new move-ins.',
      },
    ],
    pricing: [
      { careType: 'Independent Living', range: '$3,000 – $5,200/mo', note: 'Apartment-style; meals often included' },
      { careType: 'Assisted Living', range: '$4,200 – $7,200/mo', note: 'Base rent plus care level after assessment' },
      { careType: 'Memory Care', range: '$5,800 – $9,500/mo', note: 'Secured neighborhoods; usually all-inclusive' },
    ],
    pricingContext:
      'Rocky River prices above many Cuyahoga suburbs because of the lakefront location and newer renovations. We pull current rate sheets and move-in specials before you tour so you are not comparing stale website numbers.',
    landmarks: [
      {
        icon: 'hospital',
        name: 'Fairview Hospital',
        desc: 'Primary hospital for West Shore discharge planning — most Rocky River communities are a short drive.',
      },
      {
        icon: 'park',
        name: 'Rocky River Reservation',
        desc: 'Metroparks trails and scenery right next door — a real quality-of-life factor for residents and visiting families.',
      },
      {
        icon: 'shopping',
        name: 'Downtown Rocky River',
        desc: 'Walkable shops and restaurants along Detroit Road that communities use for outings and family visits.',
      },
    ],
  },

  lakewood: {
    advisorIntro:
      'Lakewood families usually want walkability and west-side healthcare access without paying full Westlake premiums. Assisted living options are fewer than Westlake, so we often compare Lakewood and Rocky River in the same shortlist.',
    communityTakes: [
      {
        name: 'Haven at Lakewood',
        careTypes: 'Assisted Living · Independent Living',
        take: 'The community we tour most in Lakewood proper — central location, newer feel relative to older west-side buildings. Strong when the resident still wants neighborhood energy.',
      },
      {
        name: "O'Neill Healthcare Lakewood",
        careTypes: 'Assisted Living · Skilled Nursing',
        take: 'Useful when rehab-to-assisted-living transitions matter. We place into assisted living suites here; skilled nursing is listed for continuum context only.',
      },
      {
        name: 'EnnisCourt',
        careTypes: 'Assisted Living',
        take: 'Smaller, more traditional assisted living footprint. Worth a look when families prefer a quieter building over a large campus.',
      },
    ],
    pricing: [
      { careType: 'Independent Living', range: '$2,400 – $4,200/mo', note: 'Often more affordable than Westlake / Rocky River' },
      { careType: 'Assisted Living', range: '$3,400 – $5,800/mo', note: 'Wide range by building age and care level' },
      { careType: 'Memory Care', range: '$4,800 – $8,200/mo', note: 'May require nearby Rocky River or Westlake options' },
    ],
    pricingContext:
      'Lakewood can be a better value than Westlake for private-pay assisted living, but memory care depth is thinner — we regularly add Rocky River communities to the tour list when dementia care is the driver.',
    landmarks: [
      {
        icon: 'hospital',
        name: 'Fairview Hospital & Clinic Lakewood',
        desc: 'West-side hospital access without leaving the Lakewood / Fairview corridor.',
      },
      {
        icon: 'park',
        name: 'Lakewood Park & Lake Erie',
        desc: 'Waterfront green space that visiting families use constantly — a lifestyle plus for active residents.',
      },
      {
        icon: 'shopping',
        name: 'Detroit Avenue corridor',
        desc: 'Walkable restaurants and shops that make Lakewood feel like a real neighborhood, not a campus island.',
      },
    ],
  },

  'chagrin-falls': {
    advisorIntro:
      'Chagrin Falls is our east-side boutique market — village character, premium pricing, and a short list of communities that actually fit assisted living and memory care. Families based in Chagrin, Hunting Valley, Moreland Hills, and South Russell usually start here.',
    communityTakes: [
      {
        name: 'Hamlet at Chagrin Falls',
        careTypes: 'Independent Living · Assisted Living · Memory Care',
        take: 'The flagship Chagrin Falls campus for many private-pay families. Resort-style grounds and a full continuum — tour early if the resident wants village proximity without a tiny building.',
      },
      {
        name: 'Meadow Falls of Chagrin Valley',
        careTypes: 'Assisted Living · Memory Care',
        take: 'Technically in South Russell, but every Chagrin Falls search includes it. Smaller, more personalized feel — often our first call when families want boutique memory care near the village.',
      },
      {
        name: 'Judson South Franklin Circle',
        careTypes: 'Assisted Living · Independent Living',
        take: 'Strong nonprofit / life-plan option for families who want Judson\'s reputation with Chagrin Valley geography. Ask about entrance fee vs rental pathways.',
      },
      {
        name: 'Eliza at Chagrin Falls',
        careTypes: 'Assisted Living',
        take: 'Worth comparing when Hamlet feels too large or too expensive. We verify current availability before you drive out — inventory moves quickly in this zip code.',
      },
    ],
    pricing: [
      { careType: 'Independent Living', range: '$3,500 – $6,000/mo', note: 'Village premiums apply' },
      { careType: 'Assisted Living', range: '$5,000 – $8,000/mo', note: 'Among the higher private-pay ranges in Greater Cleveland' },
      { careType: 'Memory Care', range: '$6,500 – $10,000/mo', note: 'Boutique buildings; all-inclusive common' },
    ],
    pricingContext:
      'Chagrin Valley is a premium private-pay market. Website rates are often incomplete — care levels and community fees change the real monthly total. We share current numbers before tours so families are not surprised at the sales office.',
    landmarks: [
      {
        icon: 'shopping',
        name: 'Chagrin Falls village center',
        desc: 'Waterfall, shops, and restaurants that make visits feel like an outing — not a hospital corridor.',
      },
      {
        icon: 'hospital',
        name: 'Hillcrest Hospital & UH Ahuja',
        desc: 'East-side hospital access for Chagrin Valley residents within a reasonable drive.',
      },
      {
        icon: 'park',
        name: 'Chagrin River / Valley trails',
        desc: 'Wooded surroundings that match what many residents are leaving behind in Hunting Valley or Moreland Hills homes.',
      },
    ],
  },

  'south-russell': {
    advisorIntro:
      'South Russell is a small Geauga County village that punches above its weight for assisted living SEO and placements — mostly because Meadow Falls of Chagrin Valley sits here, minutes from downtown Chagrin Falls.',
    communityTakes: [
      {
        name: 'Meadow Falls of Chagrin Valley',
        careTypes: 'Assisted Living · Memory Care',
        take: 'The community almost every South Russell / Chagrin Falls family asks about. Boutique size, memory care depth, and a Chagrin Valley address without living in the village parking crush.',
      },
      {
        name: 'Hamlet at Chagrin Falls (nearby)',
        careTypes: 'Independent Living · Assisted Living · Memory Care',
        take: 'We almost always put Hamlet on the same tour day. Useful when the resident needs more campus amenities or a fuller continuum than Meadow Falls.',
      },
    ],
    pricing: [
      { careType: 'Independent Living', range: '$3,200 – $5,500/mo', note: 'Often served by nearby Chagrin Falls campuses' },
      { careType: 'Assisted Living', range: '$4,500 – $7,200/mo', note: 'Boutique pricing; verify care-level fees' },
      { careType: 'Memory Care', range: '$6,000 – $9,200/mo', note: 'Primary driver for many South Russell inquiries' },
    ],
    pricingContext:
      'South Russell searches convert when families want Chagrin Valley without Hamlet\'s full campus price. We compare Meadow Falls against Hamlet and Solon options with current private-pay rates.',
    landmarks: [
      {
        icon: 'shopping',
        name: 'Chagrin Falls village (minutes away)',
        desc: 'Dining and waterfall visits stay easy for families — South Russell is the quiet neighbor, not a remote outpost.',
      },
      {
        icon: 'hospital',
        name: 'Hillcrest & UH Ahuja',
        desc: 'Same east-side hospital network Chagrin Falls families already use.',
      },
      {
        icon: 'park',
        name: 'Wooded residential setting',
        desc: 'Equestrian / wooded character that feels closer to Geauga County living than a strip-mall campus.',
      },
    ],
  },

  solon: {
    advisorIntro:
      'Solon is the practical southeast hub between Beachwood and Chagrin Falls — strong schools, I-422 access, and UH Ahuja proximity. We place private-pay residents here when families want newer buildings without full Beachwood luxury pricing.',
    communityTakes: [
      {
        name: 'Vitalia Solon',
        careTypes: 'Independent Living · Assisted Living · Memory Care',
        take: 'The campus we tour most in Solon. Good when the resident wants an active independent living start with a path into assisted living or memory care later.',
      },
      {
        name: 'Solon Pointe',
        careTypes: 'Assisted Living · Rehab / Long-term',
        take: 'More clinical continuum. We use assisted living pathways carefully and are clear when skilled nursing is not a Guide for Seniors placement lane.',
      },
      {
        name: 'Nearby Chagrin Falls / Beachwood options',
        careTypes: 'Assisted Living · Memory Care',
        take: 'Many Solon zip-code searches still end in Hamlet, Meadow Falls, or Beachwood memory care. We build the shortlist around care need first, city second.',
      },
    ],
    pricing: [
      { careType: 'Independent Living', range: '$3,000 – $5,200/mo', note: 'Competitive vs Beachwood' },
      { careType: 'Assisted Living', range: '$4,200 – $7,000/mo', note: 'Base + care level; ask about specials' },
      { careType: 'Memory Care', range: '$5,800 – $9,200/mo', note: 'Depth varies — we may add Beachwood tours' },
    ],
    pricingContext:
      'Solon is often the value play versus Beachwood for private-pay families who still want east-side hospitals. We confirm which buildings have real openings before you spend a Saturday touring.',
    landmarks: [
      {
        icon: 'hospital',
        name: 'UH Ahuja Medical Center',
        desc: 'Primary hospital draw for Solon and Chagrin Valley discharge planning.',
      },
      {
        icon: 'shopping',
        name: 'Solon business / retail corridors',
        desc: 'Practical errands and family dining without driving into Beachwood traffic every visit.',
      },
      {
        icon: 'park',
        name: 'Solon Community Park',
        desc: 'Recreation space and community events that keep family visits easy.',
      },
    ],
  },

  aurora: {
    advisorIntro:
      'Aurora serves Portage County and far-southeast Cuyahoga families who want quieter living than Beachwood with still-reasonable hospital access. The market is thinner, so we usually compare Aurora against Solon and Twinsburg in one conversation.',
    communityTakes: [
      {
        name: 'Independence Village of Aurora',
        careTypes: 'Independent Living · Assisted Living',
        take: 'The Aurora community we tour most. Strong when the resident wants apartment-style living with support available, without a dense urban campus.',
      },
      {
        name: 'Solon / Twinsburg alternatives',
        careTypes: 'Assisted Living · Memory Care',
        take: 'When memory care depth or faster hospital access matters, we expand the shortlist southeast rather than forcing a fit in Aurora alone.',
      },
    ],
    pricing: [
      { careType: 'Independent Living', range: '$2,800 – $4,800/mo', note: 'Often below Chagrin Falls premiums' },
      { careType: 'Assisted Living', range: '$3,800 – $6,400/mo', note: 'Private-pay ranges; verify care fees' },
      { careType: 'Memory Care', range: '$5,200 – $8,600/mo', note: 'May require nearby cities for best fit' },
    ],
    pricingContext:
      'Aurora can save private-pay families money versus Chagrin Falls, but inventory is limited. We check real availability first so you are not touring a waitlist.',
    landmarks: [
      {
        icon: 'hospital',
        name: 'UH Portage & Twinsburg Clinic',
        desc: 'Hospital access for Portage / southeast families without always driving to Hillcrest.',
      },
      {
        icon: 'shopping',
        name: 'Aurora Farms Premium Outlets',
        desc: 'Easy landmark for visiting adult children coming from the highway.',
      },
      {
        icon: 'park',
        name: 'Quiet residential setting',
        desc: 'Slower pace than Beachwood — a plus for residents leaving large suburban homes.',
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
            <p className="mt-4">
              <Link
                href="/cleveland-senior-living-advisor"
                className="text-teal-300 hover:text-white font-semibold underline underline-offset-2"
              >
                Free Cleveland senior living advisor — how placement works
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
