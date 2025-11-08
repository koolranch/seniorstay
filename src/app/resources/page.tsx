"use client";

import React from 'react';
import Link from 'next/link';
import { BookOpen, DollarSign, Heart, HelpCircle, MapPin, Building2, ArrowRight } from 'lucide-react';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import StickyTourButton from '@/components/tour/StickyTourButton';

export default function ResourcesPage() {
  const resources = [
    {
      icon: Heart,
      title: "Memory Care Guide",
      description: "Everything you need to know about memory care, Alzheimer's care, and dementia support in Cleveland. Learn about specialized services and how to choose the right community.",
      href: "/memory-care-cleveland",
      color: "purple"
    },
    {
      icon: Building2,
      title: "Assisted Living Guide",
      description: "Complete guide to assisted living in Cleveland. Understand services provided, when to transition, and how to find the perfect community for your loved one.",
      href: "/assisted-living-cleveland",
      color: "blue"
    },
    {
      icon: DollarSign,
      title: "Cleveland Pricing Guide",
      description: "Transparent pricing information for all senior living types in Cleveland. Learn costs, what's included, and financial assistance options available in Ohio.",
      href: "/senior-living-costs-cleveland",
      color: "green"
    },
    {
      icon: HelpCircle,
      title: "Choosing Senior Living",
      description: "Expert decision guide covering when it's time, how to involve your loved one, questions to ask during tours, and red flags to avoid.",
      href: "/choosing-senior-living",
      color: "amber"
    },
    {
      icon: MapPin,
      title: "Browse Cleveland Communities",
      description: "Explore 70+ senior living communities across Greater Cleveland. Filter by city, care type, and amenities to find your perfect match.",
      href: "/greater-cleveland",
      color: "primary"
    },
    {
      icon: BookOpen,
      title: "City Guides",
      description: "Detailed guides for Cleveland, Shaker Heights, Beachwood, Parma, Lakewood, and more. Local insights, healthcare access, and community recommendations.",
      href: "/",
      color: "teal"
    }
  ];

  const colorClasses = {
    purple: "bg-purple-50 border-purple-200 hover:border-purple-400 text-purple-600",
    blue: "bg-blue-50 border-blue-200 hover:border-blue-400 text-blue-600",
    green: "bg-green-50 border-green-200 hover:border-green-400 text-green-600",
    amber: "bg-amber-50 border-amber-200 hover:border-amber-400 text-amber-600",
    primary: "bg-primary/5 border-primary/20 hover:border-primary/40 text-primary",
    teal: "bg-teal-50 border-teal-200 hover:border-teal-400 text-teal-600"
  };

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Senior Living Resources for Cleveland Families
            </h1>
            <p className="text-xl text-gray-700 mb-4">
              Expert guides and helpful information to make the best decision for your loved one
            </p>
            <p className="text-gray-600">
              Free resources covering memory care, assisted living, pricing, and how to choose the right community
            </p>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-center">Explore Our Guides</h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Everything you need to know about senior living in Cleveland, from understanding different care types to finding the perfect community
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource, index) => {
                const Icon = resource.icon;
                const colorClass = colorClasses[resource.color as keyof typeof colorClasses];
                
                return (
                  <Link
                    key={index}
                    href={resource.href}
                    className={`group border-2 rounded-xl p-6 transition-all hover:shadow-lg ${colorClass}`}
                  >
                    <div className="mb-4">
                      <Icon className="h-12 w-12" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-current">
                      {resource.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {resource.description}
                    </p>
                    <div className="flex items-center text-sm font-semibold group-hover:gap-2 transition-all">
                      Read Guide
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="bg-gray-50 py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Why Families Trust Our Resources</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-1">70+</div>
                <div className="text-sm text-gray-600">Communities Listed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-1">35</div>
                <div className="text-sm text-gray-600">City Guides</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-1">500+</div>
                <div className="text-sm text-gray-600">Families Helped</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-1">100%</div>
                <div className="text-sm text-gray-600">Free Service</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Need Personal Help?</h2>
            <p className="text-lg text-gray-700 mb-8">
              Our Cleveland advisors can answer your specific questions, schedule tours, and help you find the perfect community—completely free.
            </p>
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
              <form action="https://formspree.io/f/xnnpaply" method="POST" className="space-y-4">
                <input type="hidden" name="form_type" value="resources_page_contact" />
                <input type="hidden" name="source_page" value="resources" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Your Name *"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="Your Phone *"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Your Email *"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
                <textarea
                  name="message"
                  placeholder="How can we help you? (Optional)"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Get Free Consultation
                </button>
                <p className="text-xs text-gray-500">We'll contact you within 24 hours.</p>
              </form>
            </div>
          </div>
        </div>
      </div>

      <StickyTourButton />
      <Footer />
    </main>
  );
}

