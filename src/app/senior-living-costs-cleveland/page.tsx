"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, DollarSign, TrendingUp, Shield, HelpCircle, Phone, Brain, Heart, Home, CheckCircle, Hospital } from 'lucide-react';
import GlobalHeader from '@/components/home/GlobalHeader';
import Footer from '@/components/footer/Footer';
import StickyTourButton from '@/components/tour/StickyTourButton';
import { submitLead } from '@/app/actions/leads';
import AffordabilityCalculator from '@/components/AffordabilityCalculator';

export default function SeniorLivingCostsClevelandPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const careTypeMap: Record<string, string> = {
      'memory-care': 'Memory Care',
      'assisted-living': 'Assisted Living',
      'independent-living': 'Independent Living',
      'not-sure': 'Not Sure',
    };

    try {
      const result = await submitLead({
        fullName: formData.get('name')?.toString() || '',
        email: formData.get('email')?.toString() || '',
        phone: formData.get('phone')?.toString() || '',
        careType: careTypeMap[formData.get('care_type')?.toString() || ''] as any || '',
        notes: 'Pricing guide request from Cleveland costs page',
        pageType: 'pricing_guide',
        sourceSlug: 'senior-living-costs-cleveland',
      });

      if (result.success) {
        // Send the pricing guide email
        try {
          const emailResponse = await fetch('/api/send-pricing-guide', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              recipientName: formData.get('name')?.toString() || 'Friend',
              email: formData.get('email')?.toString() || '',
            }),
          });
          const emailResult = await emailResponse.json();
          console.log('[PricingPage] Pricing guide email result:', emailResult);
        } catch (emailErr) {
          console.error('[PricingPage] Pricing guide email error:', emailErr);
        }
        setIsSuccess(true);
      } else {
        setError(result.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Unable to submit. Please try again or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pricingCards = [
    {
      title: "Memory Care",
      price: "$4,500 - $8,500",
      description: "Specialized care for Alzheimer's and dementia with secure environments, trained staff, and therapeutic programs.",
      icon: Brain,
      color: "violet",
      includes: ["Secure, monitored environment", "24/7 specialized dementia care", "All meals and snacks", "Memory-enhancing activities", "Medication management", "Housekeeping and laundry"]
    },
    {
      title: "Assisted Living",
      price: "$3,200 - $6,500",
      description: "Help with daily activities while maintaining independence in a supportive community setting.",
      icon: Heart,
      color: "rose",
      includes: ["Private or shared apartment", "Personal care assistance", "Three meals daily plus snacks", "Medication reminders", "Social activities and outings", "Housekeeping and maintenance"]
    },
    {
      title: "Independent Living",
      price: "$2,200 - $4,500",
      description: "Maintenance-free living for active seniors who don't need regular assistance with daily activities.",
      icon: Home,
      color: "teal",
      includes: ["Private apartment or cottage", "Restaurant-style dining", "Social activities and events", "Housekeeping services", "Transportation", "Fitness and wellness programs"]
    }
  ];

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <GlobalHeader />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 via-white to-slate-50 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <DollarSign className="inline h-4 w-4 mr-1" />
              2026 Cleveland Market Data
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 leading-tight">
              Senior Living Costs in Cleveland, Ohio
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10">
              Transparent pricing information for assisted living, memory care, and independent living in the Cleveland area. Understand costs and explore your financial options.
            </p>
            <a
              href="#get-pricing"
              className="inline-flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-lg hover:shadow-xl min-h-[56px]"
            >
              Get Personalized Pricing
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-slate-800 py-4 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-teal-400" />
              <span>5-15% Below National Average</span>
            </div>
            <div className="flex items-center gap-2">
              <Hospital className="h-5 w-5 text-teal-400" />
              <span>Near World-Class Healthcare</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-teal-400" />
              <span>100% Free Service</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Overview */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Cleveland Senior Living Cost Breakdown</h2>
              <p className="text-lg text-slate-600">Monthly costs by care type in Greater Cleveland</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {pricingCards.map((card) => {
                const Icon = card.icon;
                const colorClasses = {
                  violet: { bg: "bg-violet-50", border: "border-violet-200", icon: "bg-violet-100 text-violet-600", price: "text-violet-600" },
                  rose: { bg: "bg-rose-50", border: "border-rose-200", icon: "bg-rose-100 text-rose-600", price: "text-rose-600" },
                  teal: { bg: "bg-teal-50", border: "border-teal-200", icon: "bg-teal-100 text-teal-600", price: "text-teal-600" },
                };
                const colors = colorClasses[card.color as keyof typeof colorClasses];
                
                return (
                  <div key={card.title} className={`${colors.bg} ${colors.border} border-2 rounded-2xl p-6`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`${colors.icon} w-12 h-12 rounded-xl flex items-center justify-center`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">{card.title}</h3>
                    </div>
                    <div className={`text-3xl font-bold ${colors.price} mb-2`}>{card.price}</div>
                    <p className="text-slate-500 text-sm mb-4">per month</p>
                    <p className="text-slate-600 mb-4 text-sm">{card.description}</p>
                    <div className="text-sm">
                      <p className="font-semibold text-slate-700 mb-2">Typically Includes:</p>
                      <ul className="space-y-1">
                        {card.includes.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-slate-600">
                            <CheckCircle className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Affordability Calculator Section */}
      <section id="affordability-calculator" className="bg-slate-50 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Interactive Tool
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Cleveland Senior Living Value Calculator</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Compare the true cost of staying at home vs. all-inclusive senior living. Many families are surprised to find senior living more affordable than they thought.
            </p>
          </div>
          <AffordabilityCalculator />
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* What Affects Costs */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 text-slate-900">What Affects Senior Living Costs in Cleveland?</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: "Level of Care", desc: "More intensive care increases costs" },
                  { title: "Location", desc: "Upscale suburbs like Beachwood typically cost more than Parma or Seven Hills" },
                  { title: "Apartment Size", desc: "Studios vs. one-bedroom vs. two-bedroom units" },
                  { title: "Amenities", desc: "Communities with pools, fitness centers, and gourmet dining charge premium prices" },
                  { title: "Care Needs", desc: "Additional services like physical therapy or specialized dementia care add to monthly costs" }
                ].map((item) => (
                  <div key={item.title} className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                    <p className="text-slate-600 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* What's NOT Included */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 mb-12">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">What's NOT Included in Senior Living Costs?</h3>
              <p className="text-slate-600 mb-4">Be aware that some services may cost extra:</p>
              <ul className="grid md:grid-cols-2 gap-2">
                {["Beauty salon and barber services", "Cable TV and phone service", "Personal laundry for some communities", "Guest meals", "Specialized therapies (PT, OT, speech)", "Private duty nursing care"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-slate-700">
                    <div className="w-2 h-2 bg-amber-500 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* How to Pay */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 text-slate-900">How to Pay for Senior Living in Cleveland</h3>
              
              <div className="space-y-6">
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                  <h4 className="text-lg font-bold text-slate-900 mb-4">1. Private Pay Options</h4>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {[
                      { title: "Savings and Retirement Accounts", desc: "401(k), IRA, pensions" },
                      { title: "Sale of Home", desc: "Many families use proceeds from selling the family home" },
                      { title: "Long-Term Care Insurance", desc: "Policies specifically designed for senior care costs" },
                      { title: "Life Insurance Conversion", desc: "Some policies can be converted to pay for care" }
                    ].map((item) => (
                      <li key={item.title} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-slate-900">{item.title}:</span>{' '}
                          <span className="text-slate-600 text-sm">{item.desc}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-teal-50 rounded-2xl p-6 border border-teal-200">
                  <h4 className="text-lg font-bold text-slate-900 mb-4">2. Government Assistance Programs</h4>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {[
                      { title: "Ohio Medicaid Assisted Living Waiver", desc: "Helps low-income seniors afford assisted living and memory care" },
                      { title: "PASSPORT Waiver", desc: "Ohio program that helps seniors pay for care at home or in assisted living" },
                      { title: "Veterans Aid & Attendance", desc: "Up to $2,266/month for qualifying veterans and surviving spouses" },
                      { title: "VA Community Nursing Home Care", desc: "Coverage for eligible veterans" }
                    ].map((item) => (
                      <li key={item.title} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-slate-900">{item.title}:</span>{' '}
                          <span className="text-slate-600 text-sm">{item.desc}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Cleveland vs National */}
            <div className="bg-slate-900 text-white rounded-2xl p-8 mb-12">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-teal-500 p-3 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Cleveland vs. National Average Costs</h3>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Senior living in Cleveland is generally <strong className="text-white">5-15% below the national average</strong>, making it an affordable option compared to coastal cities. The lower cost of living in Northeast Ohio means families can often afford higher-quality communities than they could in more expensive markets.
              </p>
            </div>

            {/* Questions to Ask */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 text-slate-900">Questions to Ask About Pricing</h3>
              <p className="text-slate-600 mb-4">When touring Cleveland senior living communities, ask:</p>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  "What is included in the base monthly rate?",
                  "What services cost extra (à la carte pricing)?",
                  "How are care level increases handled and priced?",
                  "Is there a community fee or move-in deposit?",
                  "What is your refund policy if I need to move out?",
                  "Do you accept Medicaid waiver? If so, after how long?",
                  "Are there any upcoming rate increases?"
                ].map((question) => (
                  <div key={question} className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl">
                    <HelpCircle className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">{question}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="get-pricing" className="bg-gradient-to-r from-teal-600 to-teal-700 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get Personalized Pricing for Cleveland Communities</h2>
            <p className="text-lg text-teal-100 mb-10">
              Every situation is unique. Tell us about your needs and we'll provide specific pricing for communities that match your requirements and budget.
            </p>
            <div className="bg-white p-8 rounded-2xl shadow-2xl text-left">
              {isSuccess ? (
                <div className="text-center py-6">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Thank You!</h3>
                  <p className="text-slate-600">We'll send you detailed pricing information shortly.</p>
                  <p className="text-sm text-slate-500 mt-4">Need immediate help? Call <strong className="text-teal-600">(216) 677-4630</strong></p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1">Your Name *</label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        placeholder="Full name"
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-1">Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        required
                        placeholder="(216) 555-1234"
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="care_type" className="block text-sm font-semibold text-slate-700 mb-1">Type of Care Needed</label>
                    <select
                      name="care_type"
                      id="care_type"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors bg-white"
                    >
                      <option value="">Select care type</option>
                      <option value="memory-care">Memory Care</option>
                      <option value="assisted-living">Assisted Living</option>
                      <option value="independent-living">Independent Living</option>
                      <option value="not-sure">Not Sure</option>
                    </select>
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white font-bold py-4 px-6 rounded-xl transition-colors min-h-[56px] shadow-lg"
                  >
                    {isSubmitting ? 'Sending...' : 'Get Your Free Pricing Guide'}
                  </button>
                  <p className="text-xs text-slate-500 text-center">We'll send detailed pricing for communities that match your needs.</p>
                </form>
              )}
            </div>
            <div className="mt-8">
              <a
                href="tel:+12166774630"
                className="inline-flex items-center gap-2 text-white hover:text-teal-100 font-semibold transition-colors"
              >
                <Phone className="h-5 w-5" />
                <span>Or call us directly: (216) 677-4630</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <StickyTourButton />
      <Footer />
    </main>
  );
}
