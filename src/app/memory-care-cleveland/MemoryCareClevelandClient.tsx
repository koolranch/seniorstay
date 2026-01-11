"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Heart, Shield, Users, Brain, Phone, Clock, DollarSign, Hospital, AlertTriangle, HelpCircle } from 'lucide-react';
import GlobalHeader from '@/components/home/GlobalHeader';
import Footer from '@/components/footer/Footer';
import LocationCard from '@/components/property/LocationCard';
import StickyTourButton from '@/components/tour/StickyTourButton';
import { Community } from '@/data/facilities';
import { submitLead } from '@/app/actions/leads';

interface MemoryCareClevelandClientProps {
  communities: Community[];
}

export default function MemoryCareClevelandClient({ communities }: MemoryCareClevelandClientProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const urgencyMap: Record<string, string> = {
      'immediate': 'Immediate',
      '1-3-months': '1-3 months',
      '3-6-months': '3-6 months',
      'researching': 'Just researching',
    };

    try {
      const result = await submitLead({
        fullName: formData.get('name')?.toString() || '',
        email: formData.get('email')?.toString() || '',
        phone: formData.get('phone')?.toString() || '',
        careType: 'Memory Care',
        moveInTimeline: urgencyMap[formData.get('urgency')?.toString() || ''] as any || '',
        notes: 'Memory care consultation request from Cleveland memory care page',
        pageType: 'other',
        sourceSlug: 'memory-care-cleveland',
      });

      if (result.success) {
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

  const specializedServices = [
    {
      icon: Shield,
      title: "Secure Environment",
      description: "Monitored exits, wandering prevention, and safe outdoor spaces"
    },
    {
      icon: Brain,
      title: "Cognitive Therapy",
      description: "Memory-enhancing activities and specialized programming"
    },
    {
      icon: Users,
      title: "Specialized Staff Training",
      description: "Staff trained in dementia care and behavior management"
    },
    {
      icon: Heart,
      title: "Personalized Care Plans",
      description: "Individualized approach based on each resident's needs"
    },
    {
      icon: Clock,
      title: "Structured Daily Routines",
      description: "Consistent schedules that provide comfort and reduce anxiety"
    },
    {
      icon: CheckCircle,
      title: "24/7 Supervision",
      description: "Round-the-clock care and monitoring for safety"
    }
  ];

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <GlobalHeader />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 via-white to-slate-50 py-16 md:py-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-rose-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block bg-rose-100 text-rose-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Brain className="inline h-4 w-4 mr-1" />
              Specialized Dementia Care
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 leading-tight">
              Memory Care in Cleveland, Ohio
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10">
              Specialized Alzheimer&apos;s and dementia care in a secure, compassionate environment. Find the best memory care communities in Cleveland with expert guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#communities"
                className="inline-flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-lg hover:shadow-xl min-h-[56px]"
              >
                Browse Memory Care Communities
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a
                href="#guide"
                className="inline-flex items-center justify-center bg-white border-2 border-slate-300 text-slate-700 hover:border-teal-500 hover:text-teal-600 font-bold px-8 py-4 rounded-xl transition-colors min-h-[56px]"
              >
                Read Complete Guide
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Clinical Trust Bar */}
      <section className="bg-slate-800 py-4 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <Hospital className="h-5 w-5 text-teal-400" />
              <span>Cleveland Clinic Lou Ruvo Center</span>
            </div>
            <div className="flex items-center gap-2">
              <Hospital className="h-5 w-5 text-teal-400" />
              <span>UH Memory & Cognition Center</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-teal-400" />
              <span>Secure, Licensed Communities</span>
            </div>
          </div>
        </div>
      </section>

      {/* What is Memory Care Section */}
      <section id="guide" className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">What is Memory Care?</h2>
            
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              Memory care is specialized senior housing designed for individuals with Alzheimer&apos;s disease, dementia, or other forms of memory impairment. Cleveland&apos;s memory care communities provide secure environments with specially trained staff, structured routines, and therapeutic programs tailored to residents with cognitive challenges.
            </p>

            {/* Specialized Services Grid */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold mb-8 text-slate-900">Specialized Services in Cleveland Memory Care Communities</h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {specializedServices.map((service) => {
                  const Icon = service.icon;
                  return (
                    <div key={service.title} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:shadow-md transition-shadow">
                      <div className="bg-rose-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-rose-600" />
                      </div>
                      <h4 className="font-bold text-slate-900 mb-2">{service.title}</h4>
                      <p className="text-slate-600">{service.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Signs It's Time */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 mb-12">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-amber-100 p-3 rounded-xl">
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Signs It&apos;s Time for Memory Care</h3>
                  <p className="text-slate-600">Consider memory care in Cleveland when your loved one experiences:</p>
                </div>
              </div>
              <ul className="grid md:grid-cols-2 gap-3">
                {[
                  "Wandering or getting lost in familiar places",
                  "Difficulty with personal care and hygiene",
                  "Aggressive or unsafe behaviors",
                  "Inability to manage medications independently",
                  "Sundowning (increased confusion in evening hours)",
                  "Caregiver burnout or inability to provide adequate supervision",
                  "Safety concerns at home (leaving stove on, forgetting to eat)"
                ].map((sign, index) => (
                  <li key={index} className="flex items-start gap-2 text-slate-700">
                    <CheckCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>{sign}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Memory Care vs Assisted Living */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 text-slate-900">Memory Care vs. Assisted Living: What&apos;s the Difference?</h3>
              <p className="text-slate-600 mb-6">
                While both provide personal care assistance, memory care offers additional features:
              </p>
              <div className="space-y-4">
                {[
                  { title: "Secure Facilities", desc: "Memory care units have controlled access to prevent wandering" },
                  { title: "Staff Training", desc: "Specialized dementia care training for all caregivers" },
                  { title: "Lower Staff Ratios", desc: "More staff per resident for intensive supervision" },
                  { title: "Specialized Programs", desc: "Activities designed for cognitive stimulation" },
                  { title: "Environmental Design", desc: "Layouts that reduce confusion and promote independence" }
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl">
                    <CheckCircle className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900">{item.title}:</span>{' '}
                      <span className="text-slate-600">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cost Section */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 mb-12 border border-teal-200">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-teal-100 p-3 rounded-xl">
                  <DollarSign className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Cost of Memory Care in Cleveland</h3>
                  <p className="text-3xl font-bold text-teal-600">$4,500 – $8,500/month</p>
                </div>
              </div>
              <p className="text-slate-600 mb-4">
                Memory care is higher than assisted living due to the specialized care, lower staff-to-resident ratios, and secure environment. Costs vary based on:
              </p>
              <ul className="grid md:grid-cols-2 gap-2 mb-6">
                {["Level of care required", "Community location and amenities", "Type of apartment (private vs. shared)", "Additional services needed"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-slate-700">
                    <div className="w-2 h-2 bg-teal-500 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-slate-600 text-sm">
                Most Cleveland memory care communities offer all-inclusive pricing that covers room, meals, personal care, activities, and medical management.
              </p>
            </div>

            {/* How to Pay */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 text-slate-900">How to Pay for Memory Care in Ohio</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: "Medicaid Waiver Programs", desc: "Ohio offers Assisted Living and PASSPORT waivers that may help cover costs" },
                  { title: "Veterans Benefits", desc: "VA Aid & Attendance can provide up to $2,266/month for qualifying veterans" },
                  { title: "Long-Term Care Insurance", desc: "Many policies cover memory care services" },
                  { title: "Life Insurance Conversion", desc: "Some policies can be converted to pay for care" },
                  { title: "Reverse Mortgages", desc: "Can provide funds for memory care costs" }
                ].map((item) => (
                  <div key={item.title} className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                    <p className="text-slate-600 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Choosing the Right Community */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 text-slate-900">Choosing the Right Memory Care Community in Cleveland</h3>
              <p className="text-slate-600 mb-6">
                When evaluating Cleveland memory care options, look for:
              </p>
              <div className="space-y-3">
                {[
                  { title: "Staff Credentials", desc: "Ask about dementia-specific training and certifications" },
                  { title: "Safety Features", desc: "Secure outdoor areas, monitored entry/exit, emergency response systems" },
                  { title: "Activity Programs", desc: "Music therapy, art therapy, reminiscence activities" },
                  { title: "Healthcare Partnerships", desc: "On-site medical services or partnerships with Cleveland Clinic/University Hospitals" },
                  { title: "Family Involvement", desc: "Policies for visits, care plan participation, and communication" },
                  { title: "Progression of Care", desc: "Can they accommodate changing needs as dementia progresses?" }
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900">{item.title}:</span>{' '}
                      <span className="text-slate-600">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Greater Cleveland Section */}
            <div className="bg-slate-900 text-white rounded-2xl p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-teal-500 p-3 rounded-xl">
                  <Hospital className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Memory Care in Greater Cleveland</h3>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Cleveland offers excellent memory care options with access to world-class healthcare systems including <strong className="text-white">Cleveland Clinic&apos;s Lou Ruvo Center for Brain Health</strong> and <strong className="text-white">University Hospitals&apos; Memory and Cognition Center</strong>. Many local communities partner with these institutions for specialized care protocols.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Communities */}
      <section id="communities" className="bg-slate-50 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block bg-rose-100 text-rose-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Featured Communities
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Top Memory Care Communities in Cleveland</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              These specialized memory care communities provide expert Alzheimer&apos;s and dementia care in secure, compassionate environments.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {communities.map((community) => (
              <LocationCard key={community.id} community={community} />
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/?filter=memory-care"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-lg hover:shadow-xl min-h-[56px]"
            >
              View All Memory Care Communities
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-rose-600 to-rose-700 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/10 p-4 rounded-2xl">
                <HelpCircle className="h-10 w-10 text-white" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get Expert Help Finding Memory Care in Cleveland</h2>
            <p className="text-lg text-rose-100 mb-10">
              Our Cleveland advisors specialize in memory care placement. We understand the unique challenges of dementia care and can help you find the right community—completely free.
            </p>
            <div className="bg-white p-8 rounded-2xl shadow-2xl text-left">
              {isSuccess ? (
                <div className="text-center py-6">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Thank You!</h3>
                  <p className="text-slate-600">A memory care specialist will contact you within 24 hours.</p>
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
                    <label htmlFor="urgency" className="block text-sm font-semibold text-slate-700 mb-1">Timeline</label>
                    <select
                      name="urgency"
                      id="urgency"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors bg-white"
                    >
                      <option value="">How soon do you need memory care?</option>
                      <option value="immediate">Immediately</option>
                      <option value="1-3-months">Within 1-3 months</option>
                      <option value="3-6-months">Within 3-6 months</option>
                      <option value="researching">Just researching options</option>
                    </select>
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white font-bold py-4 px-6 rounded-xl transition-colors min-h-[56px] shadow-lg"
                  >
                    {isSubmitting ? 'Sending...' : 'Get Free Memory Care Consultation'}
                  </button>
                  <p className="text-xs text-slate-500 text-center">We&apos;ll contact you within 24 hours to discuss your specific needs.</p>
                </form>
              )}
            </div>
            
            <div className="mt-8">
              <a
                href="tel:+12166774630"
                className="inline-flex items-center gap-2 text-white hover:text-rose-100 font-semibold transition-colors"
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
