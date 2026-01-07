"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Home, Users, MapPin, Coffee, Dumbbell, Calendar, Phone, DollarSign, Car, Utensils, Shield, Sparkles } from 'lucide-react';
import GlobalHeader from '@/components/home/GlobalHeader';
import Footer from '@/components/footer/Footer';
import LocationCard from '@/components/property/LocationCard';
import StickyTourButton from '@/components/tour/StickyTourButton';
import { communityData } from '@/data/facilities';
import { submitLead } from '@/app/actions/leads';

export default function IndependentLivingClevelandPage() {
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
        careType: 'Independent Living',
        moveInTimeline: urgencyMap[formData.get('urgency')?.toString() || ''] as any || '',
        notes: 'Independent living consultation request from Cleveland independent living page',
        pageType: 'other',
        sourceSlug: 'independent-living-cleveland',
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
  
  // Filter for Cleveland-area independent living communities
  const clevelandCities = ['Cleveland', 'Shaker Heights', 'Beachwood', 'Parma', 'Lakewood', 'Westlake', 'Strongsville', 'Independence', 'Seven Hills', 'Rocky River'];
  const independentLivingCommunities = communityData.filter(c => 
    c.careTypes.includes('Independent Living') &&
    clevelandCities.some(city => c.location.toLowerCase().includes(city.toLowerCase()))
  ).slice(0, 8);

  const communityFeatures = [
    {
      icon: Home,
      title: "Private Apartments",
      description: "Spacious one or two-bedroom apartments with full kitchens"
    },
    {
      icon: Utensils,
      title: "Restaurant-Style Dining",
      description: "Chef-prepared meals in elegant dining rooms"
    },
    {
      icon: Calendar,
      title: "Social Activities",
      description: "Daily events, clubs, classes, and group outings"
    },
    {
      icon: Dumbbell,
      title: "Fitness & Wellness",
      description: "Exercise rooms, pools, and wellness programs"
    },
    {
      icon: Car,
      title: "Transportation",
      description: "Scheduled transportation for shopping and appointments"
    },
    {
      icon: Shield,
      title: "Security & Peace of Mind",
      description: "24-hour staff, emergency response, and gated communities"
    }
  ];

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <GlobalHeader />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 via-white to-slate-50 py-16 md:py-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="inline h-4 w-4 mr-1" />
              Active Adult Living
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 leading-tight">
              Independent Living in Cleveland, Ohio
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10">
              Discover vibrant retirement communities in Cleveland where you can enjoy maintenance-free living, engaging social activities, and the freedom to live life on your terms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#communities"
                className="inline-flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-lg hover:shadow-xl min-h-[56px]"
              >
                Browse Communities
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

      {/* Trust Bar */}
      <section className="bg-slate-800 py-4 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-teal-400" />
              <span>40+ Cleveland Communities</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-teal-400" />
              <span>Active 55+ Lifestyles</span>
            </div>
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-teal-400" />
              <span>Maintenance-Free Living</span>
            </div>
          </div>
        </div>
      </section>

      {/* What is Independent Living */}
      <section id="guide" className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">What is Independent Living?</h2>
            
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              Independent living communities are designed for active adults (typically 55+) who want to enjoy their retirement years without the hassles of home maintenance, yard work, and daily chores. Cleveland's independent living communities offer resort-style amenities, social activities, and optional services while allowing residents to maintain their privacy and independence.
            </p>

            {/* Features Grid */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold mb-8 text-slate-900">What's Included in Independent Living</h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {communityFeatures.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.title} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:shadow-md transition-shadow">
                      <div className="bg-teal-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-teal-600" />
                      </div>
                      <h4 className="font-bold text-slate-900 mb-2">{feature.title}</h4>
                      <p className="text-slate-600">{feature.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Who It's For */}
            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-8 mb-12">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Is Independent Living Right for You?</h3>
              <p className="text-slate-600 mb-6">Independent living may be ideal if you:</p>
              <ul className="grid md:grid-cols-2 gap-3">
                {[
                  "Are active and able to manage daily activities independently",
                  "Want to downsize from a large home",
                  "Prefer not to handle home maintenance, repairs, or yard work",
                  "Desire more social interaction and community engagement",
                  "Want access to amenities like pools, gyms, and dining",
                  "Are looking for a secure, age-appropriate environment",
                  "Want the option to access care services if needed later"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-slate-700">
                    <CheckCircle className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cost Section */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 mb-12 border border-slate-200">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-teal-100 p-3 rounded-xl">
                  <DollarSign className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Cost of Independent Living in Cleveland</h3>
                  <p className="text-3xl font-bold text-teal-600">$1,800 – $4,500/month</p>
                </div>
              </div>
              <p className="text-slate-600 mb-4">
                Independent living in Cleveland is often more affordable than you might expect, especially when you factor in what's included:
              </p>
              <ul className="grid md:grid-cols-2 gap-2 mb-6">
                {["Rent or monthly fee", "Most utilities included", "Meals (often 1-3 per day)", "Housekeeping & laundry", "Maintenance & repairs", "Activities & amenities", "Transportation services", "Emergency response systems"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-slate-700">
                    <div className="w-2 h-2 bg-teal-500 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-slate-600 text-sm">
                When you add up what you currently spend on mortgage/rent, utilities, food, home maintenance, and landscaping, independent living often provides better value.
              </p>
            </div>

            {/* Independent Living vs. Others */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 text-slate-900">Independent Living vs. Other Senior Living Options</h3>
              <div className="space-y-4">
                {[
                  { title: "vs. Assisted Living", desc: "Independent living is for those who don't need help with daily activities. Assisted living provides personal care assistance." },
                  { title: "vs. 55+ Active Adult Communities", desc: "Very similar, though some 55+ communities are age-restricted neighborhoods without centralized amenities." },
                  { title: "vs. Continuing Care (CCRC)", desc: "CCRCs offer independent living plus assisted living and nursing care on the same campus as needs change." }
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

            {/* Cleveland Highlights */}
            <div className="bg-slate-900 text-white rounded-2xl p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-teal-500 p-3 rounded-xl">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Independent Living in Greater Cleveland</h3>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Cleveland offers exceptional independent living options in neighborhoods like <strong className="text-white">Westlake</strong>, <strong className="text-white">Beachwood</strong>, and <strong className="text-white">Shaker Heights</strong>. Many communities are located near world-class healthcare at <strong className="text-white">Cleveland Clinic</strong> and <strong className="text-white">University Hospitals</strong>, with easy access to cultural attractions, shopping, and Lake Erie's beautiful shoreline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Communities */}
      <section id="communities" className="bg-slate-50 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Featured Communities
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Top Independent Living Communities in Cleveland</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Explore vibrant retirement communities offering resort-style amenities and active lifestyles.
            </p>
          </div>
          
          {independentLivingCommunities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
              {independentLivingCommunities.map((community) => (
                <LocationCard key={community.id} community={community} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center mb-12 border border-slate-200">
              <Home className="h-12 w-12 text-teal-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Explore Our Communities</h3>
              <p className="text-slate-600 mb-6">Contact our advisors to learn about independent living options in Cleveland.</p>
              <a href="#cta" className="text-teal-600 font-semibold hover:underline">Get Free Consultation →</a>
            </div>
          )}

          <div className="text-center">
            <Link
              href="/?filter=independent-living"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-lg hover:shadow-xl min-h-[56px]"
            >
              View All Independent Living Communities
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="bg-gradient-to-r from-teal-600 to-teal-700 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/10 p-4 rounded-2xl">
                <Coffee className="h-10 w-10 text-white" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Explore Independent Living?</h2>
            <p className="text-lg text-teal-100 mb-10">
              Our Cleveland advisors can help you find the perfect community that matches your lifestyle and budget—completely free.
            </p>
            <div className="bg-white p-8 rounded-2xl shadow-2xl text-left">
              {isSuccess ? (
                <div className="text-center py-6">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Thank You!</h3>
                  <p className="text-slate-600">A senior living advisor will contact you within 24 hours.</p>
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
                      <option value="">When are you considering a move?</option>
                      <option value="immediate">Ready now</option>
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
                    {isSubmitting ? 'Sending...' : 'Get Free Consultation'}
                  </button>
                  <p className="text-xs text-slate-500 text-center">100% Free • No Obligation • Confidential</p>
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

