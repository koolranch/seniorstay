"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, UserCheck, Users, MapPin, Heart, Clock, Phone, DollarSign, Stethoscope, Home, Shield, Car, Pill, Utensils, Bath } from 'lucide-react';
import GlobalHeader from '@/components/home/GlobalHeader';
import Footer from '@/components/footer/Footer';
import StickyTourButton from '@/components/tour/StickyTourButton';
import { submitLead } from '@/app/actions/leads';

export default function InHomeCareClevelandPage() {
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
        careType: 'Other',
        moveInTimeline: urgencyMap[formData.get('urgency')?.toString() || ''] as any || '',
        notes: 'In-home care consultation request from Cleveland in-home care page',
        pageType: 'other',
        sourceSlug: 'in-home-care-cleveland',
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

  const careServices = [
    {
      icon: Bath,
      title: "Personal Care",
      description: "Bathing, dressing, grooming, and toileting assistance"
    },
    {
      icon: Pill,
      title: "Medication Reminders",
      description: "Help ensuring medications are taken on time"
    },
    {
      icon: Utensils,
      title: "Meal Preparation",
      description: "Cooking nutritious meals and assistance with eating"
    },
    {
      icon: Home,
      title: "Light Housekeeping",
      description: "Laundry, dishes, vacuuming, and general tidying"
    },
    {
      icon: Car,
      title: "Transportation",
      description: "Rides to appointments, shopping, and social activities"
    },
    {
      icon: Heart,
      title: "Companionship",
      description: "Conversation, activities, and emotional support"
    }
  ];

  const skilledServices = [
    { name: "Skilled Nursing", desc: "Wound care, injections, IV therapy" },
    { name: "Physical Therapy", desc: "Rehabilitation and mobility exercises" },
    { name: "Occupational Therapy", desc: "Help with daily living skills" },
    { name: "Speech Therapy", desc: "Communication and swallowing support" },
    { name: "Medical Social Work", desc: "Care coordination and resources" },
  ];

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <GlobalHeader />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 via-white to-slate-50 py-16 md:py-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <UserCheck className="inline h-4 w-4 mr-1" />
              Care at Home
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 leading-tight">
              In-Home Care in Cleveland, Ohio
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10">
              Professional caregivers who come to your home, providing personalized assistance with daily activities, medical needs, and companionship—allowing seniors to age in place safely.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#cta"
                className="inline-flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-lg hover:shadow-xl min-h-[56px]"
              >
                Get Free Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a
                href="#guide"
                className="inline-flex items-center justify-center bg-white border-2 border-slate-300 text-slate-700 hover:border-amber-500 hover:text-amber-600 font-bold px-8 py-4 rounded-xl transition-colors min-h-[56px]"
              >
                Learn About Services
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-slate-800 py-4 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-400" />
              <span>Flexible Hours Available</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-400" />
              <span>Licensed & Bonded Caregivers</span>
            </div>
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-amber-400" />
              <span>Age in Place Safely</span>
            </div>
          </div>
        </div>
      </section>

      {/* What is In-Home Care */}
      <section id="guide" className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">What is In-Home Care?</h2>
            
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              In-home care allows seniors to receive professional assistance in the comfort of their own home. Whether you need a few hours of help per week or around-the-clock care, Cleveland's home care agencies provide trained caregivers who can assist with daily activities, medication management, and companionship—helping seniors maintain their independence and quality of life.
            </p>

            {/* Services Grid */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold mb-8 text-slate-900">Non-Medical Home Care Services</h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {careServices.map((service) => {
                  const Icon = service.icon;
                  return (
                    <div key={service.title} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:shadow-md transition-shadow">
                      <div className="bg-amber-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-amber-600" />
                      </div>
                      <h4 className="font-bold text-slate-900 mb-2">{service.title}</h4>
                      <p className="text-slate-600">{service.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Skilled Home Health */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 mb-12 border border-teal-200">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-teal-100 p-3 rounded-xl">
                  <Stethoscope className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Skilled Home Health Care</h3>
                  <p className="text-slate-600">Medical care provided by licensed professionals, often covered by Medicare</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {skilledServices.map((service) => (
                  <div key={service.name} className="bg-white rounded-xl p-4 border border-teal-100">
                    <h4 className="font-semibold text-slate-900">{service.name}</h4>
                    <p className="text-slate-600 text-sm">{service.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* When to Consider */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 mb-12">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">When to Consider In-Home Care</h3>
              <p className="text-slate-600 mb-6">In-home care may be the right choice when:</p>
              <ul className="grid md:grid-cols-2 gap-3">
                {[
                  "Your loved one wants to remain in their own home",
                  "They need help with daily activities but not 24/7 supervision",
                  "Recovery from surgery or hospitalization",
                  "Family caregivers need respite or additional support",
                  "Early-stage memory issues requiring supervision",
                  "Chronic conditions requiring ongoing assistance",
                  "Transportation to medical appointments is needed"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-slate-700">
                    <CheckCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cost Section */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 mb-12 border border-slate-200">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-amber-100 p-3 rounded-xl">
                  <DollarSign className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Cost of In-Home Care in Cleveland</h3>
                  <p className="text-3xl font-bold text-amber-600">$22 – $35/hour</p>
                </div>
              </div>
              <p className="text-slate-600 mb-4">
                In-home care costs vary based on the level of care needed and hours required:
              </p>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 text-center border border-slate-200">
                  <p className="text-sm text-slate-500 mb-1">Part-Time (20 hrs/week)</p>
                  <p className="text-xl font-bold text-slate-900">~$1,800/mo</p>
                </div>
                <div className="bg-white rounded-xl p-4 text-center border border-slate-200">
                  <p className="text-sm text-slate-500 mb-1">Full-Time (40 hrs/week)</p>
                  <p className="text-xl font-bold text-slate-900">~$3,600/mo</p>
                </div>
                <div className="bg-white rounded-xl p-4 text-center border border-slate-200">
                  <p className="text-sm text-slate-500 mb-1">24/7 Live-In Care</p>
                  <p className="text-xl font-bold text-slate-900">$8,000+/mo</p>
                </div>
              </div>
              <p className="text-slate-600 text-sm">
                <strong>Payment options:</strong> Long-term care insurance, VA benefits, Medicaid waivers (PASSPORT program), and private pay.
              </p>
            </div>

            {/* In-Home vs. Facility */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 text-slate-900">In-Home Care vs. Senior Living Communities</h3>
              <div className="space-y-4">
                {[
                  { title: "Flexibility", desc: "In-home care offers flexible scheduling from a few hours to 24/7, while communities have set schedules." },
                  { title: "Social Interaction", desc: "Senior communities provide built-in social activities; in-home care requires arranging outside socialization." },
                  { title: "Cost Comparison", desc: "Part-time in-home care is often cheaper, but 24/7 care may exceed assisted living costs." },
                  { title: "Medical Support", desc: "Communities have staff on-site 24/7; home care can provide skilled nursing but response time may vary." }
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl">
                    <CheckCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900">{item.title}:</span>{' '}
                      <span className="text-slate-600">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cleveland Resources */}
            <div className="bg-slate-900 text-white rounded-2xl p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-amber-500 p-3 rounded-xl">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">In-Home Care Resources in Cleveland</h3>
              </div>
              <p className="text-slate-300 leading-relaxed mb-4">
                Cleveland has many reputable home care agencies serving all neighborhoods. When choosing a provider, verify they are licensed by the <strong className="text-white">Ohio Department of Health</strong>, check caregiver background screening policies, and ask about their supervision and quality assurance processes.
              </p>
              <p className="text-slate-300">
                Our advisors can help you compare in-home care options alongside senior living communities to find the best fit for your family's needs and budget.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="bg-gradient-to-r from-amber-500 to-orange-500 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/10 p-4 rounded-2xl">
                <UserCheck className="h-10 w-10 text-white" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Explore Your Care Options</h2>
            <p className="text-lg text-amber-100 mb-10">
              Not sure if in-home care or a senior living community is the right choice? Our advisors can help you compare all options—completely free.
            </p>
            <div className="bg-white p-8 rounded-2xl shadow-2xl text-left">
              {isSuccess ? (
                <div className="text-center py-6">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Thank You!</h3>
                  <p className="text-slate-600">A senior care advisor will contact you within 24 hours.</p>
                  <p className="text-sm text-slate-500 mt-4">Need immediate help? Call <strong className="text-amber-600">(216) 677-4630</strong></p>
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
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
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
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
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
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="urgency" className="block text-sm font-semibold text-slate-700 mb-1">Timeline</label>
                    <select
                      name="urgency"
                      id="urgency"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors bg-white"
                    >
                      <option value="">When do you need care?</option>
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
                    className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-bold py-4 px-6 rounded-xl transition-colors min-h-[56px] shadow-lg"
                  >
                    {isSubmitting ? 'Sending...' : 'Get Free Care Consultation'}
                  </button>
                  <p className="text-xs text-slate-500 text-center">100% Free • No Obligation • Confidential</p>
                </form>
              )}
            </div>
            
            <div className="mt-8">
              <a
                href="tel:+12166774630"
                className="inline-flex items-center gap-2 text-white hover:text-amber-100 font-semibold transition-colors"
              >
                <Phone className="h-5 w-5" />
                <span>Or call us directly: (216) 677-4630</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Compare Options CTA */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-600 mb-4">Want to compare in-home care with assisted living communities?</p>
          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-black text-white font-bold px-8 py-4 rounded-xl transition-colors"
          >
            Take Our Care Assessment
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <StickyTourButton />
      <Footer />
    </main>
  );
}

