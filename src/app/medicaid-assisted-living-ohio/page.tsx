import React from 'react';
import Link from 'next/link';
import {
  CheckCircle,
  XCircle,
  DollarSign,
  Phone,
  ClipboardList,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import GlobalHeader from '@/components/home/GlobalHeader';
import Footer from '@/components/footer/Footer';
import SimpleContactForm from '@/components/forms/SimpleContactForm';
import PhoneLink from '@/components/conversion/PhoneLink';
import PlacementConversionBand from '@/components/conversion/PlacementConversionBand';
import PopularSuburbsGrid from '@/components/conversion/PopularSuburbsGrid';
import { PLACEMENT_PHONE_DISPLAY } from '@/lib/placement-contact';

export const revalidate = 86400;

const FAQ_ITEMS = [
  {
    question: 'Does Medicaid pay for assisted living in Ohio?',
    answer:
      "Yes — through the Ohio Assisted Living Waiver. Medicaid pays for the care services portion of assisted living (personal care, medication management, nursing oversight) in participating communities. It does not pay for room and board, which residents pay from their own income (set at $944/month in 2026).",
  },
  {
    question: 'What are the income and asset limits for the Ohio Assisted Living Waiver in 2026?',
    answer:
      'In 2026, a single applicant can have monthly income up to $2,982 (300% of the Federal Benefit Rate) and no more than $2,000 in countable assets. Applicants over the income limit may still qualify using a Qualified Income Trust (Miller Trust). A primary home usually does not count toward the asset limit while a spouse lives there.',
  },
  {
    question: 'Do all assisted living communities in Cleveland accept the Medicaid waiver?',
    answer:
      'No. Only a subset of licensed Ohio residential care facilities participate in the Assisted Living Waiver, and each community sets aside a limited number of waiver beds — many keep their own waitlists. This is the most common surprise for families. Call us at ' +
      PLACEMENT_PHONE_DISPLAY +
      ' and we can tell you which Cleveland-area communities currently accept the waiver and have availability.',
  },
  {
    question: 'What does the waiver cover, and what do I still pay?',
    answer:
      'The waiver covers personal care assistance, medication administration, nursing oversight, and community services. You remain responsible for room and board ($944/month in 2026, paid from the resident\u2019s Social Security or pension income) plus personal expenses like phone and salon services.',
  },
  {
    question: 'Can I move into assisted living now and apply for the waiver later?',
    answer:
      'Sometimes. Some families start as private-pay residents and transition to the waiver once savings are spent down to the $2,000 asset limit — but only if the community participates in the waiver program and has a waiver bed available. Confirm the community\u2019s spend-down policy in writing before moving in.',
  },
  {
    question: 'How do I apply for the Ohio Assisted Living Waiver?',
    answer:
      'Start with your Area Agency on Aging — for Greater Cleveland that is the Western Reserve Area Agency on Aging at (216) 621-0303. They complete a phone screen and in-person level-of-care assessment, while your county Department of Job and Family Services determines financial eligibility. Approval typically takes 45–90 days.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

export default function MedicaidAssistedLivingOhioPage() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <GlobalHeader />

      {/* Hero — answer the query immediately */}
      <section className="bg-gradient-to-b from-slate-50 via-white to-slate-50 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <ShieldCheck className="inline h-4 w-4 mr-1" />
              Updated for 2026
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 leading-tight">
              Does Medicaid Pay for Assisted Living in Ohio?
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-4">
              <strong className="text-slate-900">Yes — through the Ohio Assisted Living Waiver.</strong>{' '}
              Medicaid covers the care portion of assisted living in participating communities.
              You pay room and board ($944/month in 2026) from your own income.
            </p>
            <p className="text-base text-slate-500 mb-10">
              The catch: only some Cleveland-area communities accept the waiver, and beds are limited.
              We track which ones do — for free.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <PhoneLink
                placement="medicaid_hub_hero"
                className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg min-h-[56px] w-full sm:w-auto"
              >
                <Phone className="h-5 w-5" />
                Call {PLACEMENT_PHONE_DISPLAY}
              </PhoneLink>
              <a
                href="#eligibility"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-semibold px-8 py-4 rounded-xl border border-slate-300 min-h-[56px] w-full sm:w-auto"
              >
                Check 2026 Eligibility
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2026 Quick Facts */}
      <section id="eligibility" className="py-14 bg-slate-800">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
            Ohio Assisted Living Waiver: 2026 Numbers
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { label: 'Monthly income limit', value: '$2,982', note: '300% of Federal Benefit Rate; Miller Trust possible if over' },
              { label: 'Countable asset limit', value: '$2,000', note: 'Home usually exempt while spouse lives there' },
              { label: 'Room & board you pay', value: '$944/mo', note: 'Paid from Social Security or pension income' },
              { label: 'Minimum age', value: '21+', note: 'Must need a nursing-facility level of care' },
            ].map((stat) => (
              <div key={stat.label} className="bg-slate-700/60 rounded-2xl p-6 text-center border border-slate-600">
                <p className="text-3xl font-bold text-teal-300 mb-1">{stat.value}</p>
                <p className="text-white font-semibold mb-2">{stat.label}</p>
                <p className="text-slate-300 text-xs leading-relaxed">{stat.note}</p>
              </div>
            ))}
          </div>
          <p className="text-slate-400 text-xs text-center mt-6 max-w-2xl mx-auto">
            Figures update each January. Financial eligibility is determined by your county Department of
            Job and Family Services; level of care is assessed by your Area Agency on Aging.
          </p>
        </div>
      </section>

      {/* Covered vs Not Covered */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">
              What the Waiver Covers — and What You Still Pay
            </h2>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              The Assisted Living Waiver splits the monthly cost of assisted living into two parts.
              Medicaid pays the community directly for care services. The resident pays the community
              a fixed room-and-board amount from their own income.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="bg-teal-50 border border-teal-200 rounded-2xl p-7">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-teal-600" />
                  Medicaid pays for
                </h3>
                <ul className="space-y-3">
                  {[
                    'Personal care: bathing, dressing, mobility help',
                    'Medication administration and management',
                    'Nursing oversight and health monitoring',
                    'Housekeeping and laundry services',
                    'Social and recreational programming',
                    'Non-medical transportation (community-dependent)',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-slate-700">
                      <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-7">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <XCircle className="h-6 w-6 text-amber-600" />
                  You still pay for
                </h3>
                <ul className="space-y-3">
                  {[
                    'Room and board: $944/month in 2026',
                    'Medicare premiums and supplemental insurance',
                    'Phone, cable, and internet',
                    'Salon and barber services',
                    'Personal items and clothing',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-slate-700">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-slate-600 text-sm mt-4">
                  Most residents cover room and board with Social Security income, keeping a
                  personal needs allowance of $50/month.
                </p>
              </div>
            </div>

            {/* The availability problem — the referral hook */}
            <div className="bg-slate-900 rounded-2xl p-8 mb-12 text-white">
              <div className="flex items-start gap-4">
                <div className="bg-amber-500/20 p-3 rounded-xl flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">
                    The Hard Part: Finding a Community That Actually Accepts the Waiver
                  </h3>
                  <p className="text-slate-300 mb-4 leading-relaxed">
                    Only a fraction of Cleveland-area assisted living communities participate in the
                    waiver program — and participating communities limit how many waiver beds they
                    offer. Each community keeps its own waitlist. Families often get approved for the
                    waiver, then spend weeks calling communities one by one.
                  </p>
                  <p className="text-slate-300 mb-6 leading-relaxed">
                    We keep track of which Greater Cleveland communities accept the Assisted Living
                    Waiver and which have current openings. One call saves you the phone marathon —
                    and our help is always free to families.
                  </p>
                  <PhoneLink
                    placement="medicaid_hub_availability"
                    className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-bold px-6 py-3.5 rounded-xl min-h-[48px]"
                  >
                    <Phone className="h-5 w-5" />
                    Ask About Waiver Openings
                  </PhoneLink>
                </div>
              </div>
            </div>

            {/* Eligibility checklist */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-slate-900">Who Qualifies in 2026</h2>
              <p className="text-slate-600 mb-6">
                To be eligible for the Ohio Assisted Living Waiver, your loved one must meet all of
                the following:
              </p>
              <div className="space-y-3">
                {[
                  { title: 'Age 21 or older', desc: 'Most participants are seniors, but the program covers younger adults with physical disabilities too' },
                  { title: 'Needs a nursing-facility level of care', desc: 'Requires hands-on help with daily activities like bathing, dressing, or mobility — assessed in person by the Area Agency on Aging' },
                  { title: 'Monthly income at or below $2,982', desc: 'If income is higher, a Qualified Income Trust (Miller Trust) can still make them eligible — an elder law attorney can set one up' },
                  { title: 'Countable assets of $2,000 or less', desc: 'The home (up to $752,000 equity), one vehicle, and personal belongings are generally exempt; a spouse living at home can keep significantly more' },
                  { title: 'Able to pay room and board', desc: '$944/month in 2026, typically covered by Social Security income' },
                  { title: 'Willing to live in a participating community', desc: 'The community must be licensed and enrolled as a waiver provider — this is where we can help' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <CheckCircle className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900">{item.title}:</span>{' '}
                      <span className="text-slate-600">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* How to apply */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-slate-900 flex items-center gap-3">
                <ClipboardList className="h-8 w-8 text-teal-600" />
                How to Apply (Greater Cleveland)
              </h2>
              <div className="space-y-4">
                {[
                  {
                    step: '1',
                    title: 'Call the Western Reserve Area Agency on Aging',
                    desc: 'They administer the waiver for Cuyahoga, Lake, Lorain, Geauga, and Medina counties: (216) 621-0303. They start with a phone screen, then schedule an in-person level-of-care assessment.',
                  },
                  {
                    step: '2',
                    title: 'Apply for Medicaid financial eligibility',
                    desc: 'Your county Department of Job and Family Services reviews income and assets. Gather bank statements, Social Security award letters, and any insurance policies before applying — missing documents are the #1 cause of delays.',
                  },
                  {
                    step: '3',
                    title: 'Choose a participating community',
                    desc: 'While the application processes, tour communities that accept the waiver. This is the step families underestimate — call us and we\u2019ll shortlist Cleveland-area communities with actual waiver availability.',
                  },
                  {
                    step: '4',
                    title: 'Enroll and move in',
                    desc: 'Once level of care and financial eligibility are approved and a waiver bed is confirmed, your care manager finalizes the service plan. The full process typically takes 45\u201390 days.',
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <div className="bg-teal-600 text-white font-bold w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                      <p className="text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Other ways to pay */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 mb-12 border border-teal-200">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-teal-100 p-3 rounded-xl">
                  <DollarSign className="h-6 w-6 text-teal-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Over the Income Limit? Other Ways Cleveland Families Pay
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: 'Qualified Income Trust (Miller Trust)', desc: 'Redirects income above $2,982/month so you can still qualify for the waiver' },
                  { title: 'Veterans Aid & Attendance', desc: 'Up to ~$2,300/month extra for qualifying wartime veterans and surviving spouses' },
                  { title: 'Long-term care insurance', desc: 'Many policies cover assisted living — check the daily benefit and elimination period' },
                  { title: 'Bridge loans & home equity', desc: 'Short-term options while a house sells or benefits are approved' },
                ].map((item) => (
                  <div key={item.title} className="bg-white rounded-xl p-5 border border-teal-100">
                    <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-slate-600 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-slate-600 text-sm mt-5">
                Want the full cost picture first? See our{' '}
                <Link href="/senior-living-costs-cleveland" className="text-teal-700 font-semibold underline underline-offset-2">
                  Cleveland senior living costs guide
                </Link>{' '}
                for current private-pay pricing by suburb.
              </p>
            </div>

            {/* FAQ */}
            <div className="mb-4">
              <h2 className="text-3xl font-bold mb-8 text-slate-900">
                Ohio Medicaid & Assisted Living: Common Questions
              </h2>
              <div className="space-y-4">
                {FAQ_ITEMS.map((item) => (
                  <details key={item.question} className="group bg-slate-50 rounded-2xl border border-slate-200">
                    <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-slate-900 list-none">
                      {item.question}
                      <span className="text-teal-600 text-2xl leading-none group-open:rotate-45 transition-transform">+</span>
                    </summary>
                    <p className="px-6 pb-6 text-slate-600 leading-relaxed">{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <PopularSuburbsGrid title="Find Communities by Cleveland Suburb" />

      {/* Lead capture */}
      <section className="bg-gradient-to-r from-teal-600 to-teal-700 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Get a Free List of Cleveland Communities That Accept the Waiver
            </h2>
            <p className="text-lg text-teal-100 mb-6">
              Tell us your situation and we&apos;ll match you with waiver-participating communities
              near you — or call now and talk to a local advisor today.
            </p>
            <PhoneLink
              placement="medicaid_hub_cta"
              className="inline-flex items-center gap-2 bg-white text-teal-700 hover:bg-teal-50 font-bold px-8 py-4 rounded-xl shadow-lg mb-8 min-h-[56px]"
            >
              <Phone className="h-5 w-5" />
              Call {PLACEMENT_PHONE_DISPLAY}
            </PhoneLink>
            <div className="bg-white p-8 rounded-2xl shadow-2xl text-left">
              <SimpleContactForm
                sourcePage="medicaid-assisted-living-ohio"
                buttonText="Get My Free Community List"
                showMessage={true}
              />
            </div>
          </div>
        </div>
      </section>

      <PlacementConversionBand
        title="Not sure if the waiver is the right path?"
        description="A local advisor can walk through income, assets, and care needs in one call — no cost, no obligation."
        phonePlacement="medicaid_hub_band"
        contactHref="/contact?intent=placement&source=medicaid-hub"
        secondaryHref="/senior-living-costs-cleveland"
        secondaryLabel="Compare Cleveland costs"
      />

      <Footer />
    </main>
  );
}
