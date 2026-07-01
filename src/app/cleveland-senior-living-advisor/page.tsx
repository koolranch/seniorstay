import React from 'react';
import Link from 'next/link';
import {
  Phone,
  CheckCircle,
  MapPin,
  Heart,
  Brain,
  Home,
  DollarSign,
  Clock,
  ShieldCheck,
  Users,
  CalendarCheck,
} from 'lucide-react';
import GlobalHeader from '@/components/home/GlobalHeader';
import Footer from '@/components/footer/Footer';
import SimpleContactForm from '@/components/forms/SimpleContactForm';
import PhoneLink from '@/components/conversion/PhoneLink';
import PopularSuburbsGrid from '@/components/conversion/PopularSuburbsGrid';
import { PLACEMENT_PHONE_DISPLAY } from '@/lib/placement-contact';

export const revalidate = 86400;

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Cleveland Senior Living Advisor',
  serviceType: 'Senior living placement and referral service',
  provider: {
    '@type': 'LocalBusiness',
    name: 'Guide for Seniors',
    telephone: '+1-216-677-4630',
    url: 'https://www.guideforseniors.com',
    areaServed: {
      '@type': 'City',
      name: 'Cleveland',
      containedInPlace: { '@type': 'State', name: 'Ohio' },
    },
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free to families — advisors are compensated by partner communities.',
  },
  description:
    'Free local advisor service helping Cleveland-area families compare assisted living, memory care, and independent living communities, verify pricing and availability, and schedule tours.',
};

const CARE_TYPES = [
  {
    icon: Heart,
    title: 'Assisted Living',
    desc: 'Daily help with bathing, dressing, medications — with as much independence as possible.',
    href: '/assisted-living-cleveland',
  },
  {
    icon: Brain,
    title: 'Memory Care',
    desc: 'Secure communities with staff trained for dementia and Alzheimer\u2019s care.',
    href: '/memory-care-cleveland',
  },
  {
    icon: Home,
    title: 'Independent Living',
    desc: 'Maintenance-free apartments with dining and activities for active seniors.',
    href: '/independent-living-cleveland',
  },
];

const PROCESS_STEPS = [
  {
    icon: Phone,
    title: 'Tell us what\u2019s going on',
    desc: 'One call, about 10 minutes. Care needs, budget, preferred suburbs, timeline — we listen first.',
  },
  {
    icon: MapPin,
    title: 'Get a shortlist that actually fits',
    desc: 'We match against current pricing and real availability at Cleveland-area communities — not a list of 40 places to cold-call.',
  },
  {
    icon: CalendarCheck,
    title: 'Tour with us in your corner',
    desc: 'We schedule tours, tell you what to ask, and flag things families miss on a first visit.',
  },
  {
    icon: CheckCircle,
    title: 'Decide with confidence',
    desc: 'We help compare offers and understand contracts. You choose — we never pressure a move.',
  },
];

export default function ClevelandSeniorLivingAdvisorPage() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <GlobalHeader />

      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-50 via-white to-slate-50 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <ShieldCheck className="inline h-4 w-4 mr-1" />
              100% Free to Families
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 leading-tight">
              Your Free Senior Living Advisor in Cleveland
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-4">
              Finding assisted living or memory care for a parent usually means dozens of calls,
              vague pricing, and sales pressure. Skip all of it.
            </p>
            <p className="text-base text-slate-500 mb-10">
              One call to a local advisor gets you a shortlist of Cleveland-area communities with
              real pricing and current availability — matched to your care needs and budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <PhoneLink
                placement="advisor_page_hero"
                className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg min-h-[56px] w-full sm:w-auto"
              >
                <Phone className="h-5 w-5" />
                Call {PLACEMENT_PHONE_DISPLAY}
              </PhoneLink>
              <a
                href="#callback"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-semibold px-8 py-4 rounded-xl border border-slate-300 min-h-[56px] w-full sm:w-auto"
              >
                Request a Callback
              </a>
            </div>
            <p className="text-sm text-slate-500 mt-5 flex items-center justify-center gap-2">
              <Clock className="h-4 w-4" />
              Calls answered live — advisors local to Greater Cleveland
            </p>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-slate-800 py-4 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-teal-400" />
              <span>200+ Greater Cleveland Communities</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-teal-400" />
              <span>$0 Cost to Your Family</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-teal-400" />
              <span>Local Advisors, Not a Call Center</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 text-center">
              How It Works
            </h2>
            <p className="text-lg text-slate-600 mb-12 text-center max-w-2xl mx-auto">
              From first call to move-in day, you have one person who knows your situation —
              instead of a different salesperson at every community.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {PROCESS_STEPS.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="bg-slate-50 rounded-2xl p-7 border border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-teal-100 w-12 h-12 rounded-xl flex items-center justify-center">
                        <Icon className="h-6 w-6 text-teal-600" />
                      </div>
                      <span className="text-sm font-bold text-teal-600">STEP {index + 1}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg mb-2">{step.title}</h3>
                    <p className="text-slate-600">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Why free */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 md:p-10 border border-slate-200 shadow-sm">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900">
                Why Is This Free? (The Honest Answer)
              </h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                When a family we&apos;ve helped moves into a community, that community pays us a
                referral fee — the same model used by national services like A Place for Mom. It
                never affects what you pay: communities charge the same rate whether you found
                them through us or on your own.
              </p>
              <p className="text-slate-600 mb-6 leading-relaxed">
                The difference is that we&apos;re local and only work Greater Cleveland. We know
                which communities have strong nursing teams, which ones have hidden move-in fees,
                and which executive directors actually return phone calls. And if the right answer
                for your family is staying home longer or a community we don&apos;t work with,
                we&apos;ll tell you that too.
              </p>
              <ul className="grid md:grid-cols-2 gap-3">
                {[
                  'No cost or obligation to your family — ever',
                  'You keep full control of every decision',
                  'We share real pricing before you tour',
                  'No spam — your info is never sold to lists',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-slate-700">
                    <CheckCircle className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Care types we cover */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 text-center">
              Care Options We Help With
            </h2>
            <p className="text-lg text-slate-600 mb-12 text-center max-w-2xl mx-auto">
              Not sure which level of care fits? That&apos;s the most common first question —
              and exactly what the first call sorts out.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {CARE_TYPES.map((care) => {
                const Icon = care.icon;
                return (
                  <Link
                    key={care.title}
                    href={care.href}
                    className="group bg-slate-50 rounded-2xl p-7 border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all"
                  >
                    <div className="bg-teal-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-teal-600" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-teal-700">
                      {care.title}
                    </h3>
                    <p className="text-slate-600 text-sm">{care.desc}</p>
                  </Link>
                );
              })}
            </div>
            <p className="text-slate-600 text-center mt-8">
              Worried about paying for care? See how the{' '}
              <Link href="/medicaid-assisted-living-ohio" className="text-teal-700 font-semibold underline underline-offset-2">
                Ohio Assisted Living Medicaid Waiver
              </Link>{' '}
              works, or compare{' '}
              <Link href="/senior-living-costs-cleveland" className="text-teal-700 font-semibold underline underline-offset-2">
                current Cleveland pricing
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <PopularSuburbsGrid title="We Cover Every Cleveland Suburb" />

      {/* Callback form */}
      <section id="callback" className="bg-gradient-to-r from-teal-600 to-teal-700 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Talk to a Cleveland Advisor Today
            </h2>
            <p className="text-lg text-teal-100 mb-6">
              Call now, or leave your number and we&apos;ll call you — usually within 15 minutes
              during business hours.
            </p>
            <PhoneLink
              placement="advisor_page_cta"
              className="inline-flex items-center gap-2 bg-white text-teal-700 hover:bg-teal-50 font-bold px-8 py-4 rounded-xl shadow-lg mb-8 min-h-[56px]"
            >
              <Phone className="h-5 w-5" />
              Call {PLACEMENT_PHONE_DISPLAY}
            </PhoneLink>
            <div className="bg-white p-8 rounded-2xl shadow-2xl text-left">
              <SimpleContactForm
                sourcePage="cleveland-senior-living-advisor"
                buttonText="Request My Free Consultation"
                showMessage={true}
              />
            </div>
            <p className="mt-6 text-sm text-teal-100">
              Prefer to explore first?{' '}
              <Link href="/assessment" className="underline hover:text-white font-medium">
                Take the 2-minute care assessment
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
