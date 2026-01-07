"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Heart, Shield, Users, Brain } from 'lucide-react';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import LocationCard from '@/components/property/LocationCard';
import StickyTourButton from '@/components/tour/StickyTourButton';
import { communityData } from '@/data/facilities';
import { submitLead } from '@/app/actions/leads';

export default function MemoryCareClevelandPage() {
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
  // Filter for Cleveland-area memory care communities
  const clevelandCities = ['Cleveland', 'Shaker Heights', 'Beachwood', 'Parma', 'Lakewood', 'Westlake', 'Strongsville', 'Independence', 'Seven Hills', 'Rocky River'];
  const memoryCareCommunities = communityData.filter(c => 
    c.careTypes.includes('Memory Care') &&
    clevelandCities.some(city => c.location.toLowerCase().includes(city.toLowerCase()))
  ).slice(0, 8);

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Memory Care in Cleveland, Ohio
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Specialized Alzheimer's and dementia care in a secure, compassionate environment. Find the best memory care communities in Cleveland with expert guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#communities"
                className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                Browse Memory Care Communities
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a
                href="#guide"
                className="inline-flex items-center justify-center bg-white border-2 border-primary text-primary hover:bg-primary/5 font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                Read Complete Guide
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* What is Memory Care Section */}
      <div id="guide" className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">What is Memory Care?</h2>
            
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-6">
                Memory care is specialized senior housing designed for individuals with Alzheimer's disease, dementia, or other forms of memory impairment. Cleveland's memory care communities provide secure environments with specially trained staff, structured routines, and therapeutic programs tailored to residents with cognitive challenges.
              </p>

              <h3 className="text-2xl font-semibold mb-4 mt-8">Specialized Services in Cleveland Memory Care Communities</h3>
              
              <div className="grid md:grid-cols-2 gap-6 my-8 not-prose">
                <div className="flex gap-3">
                  <Shield className="h-6 w-6 text-purple-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Secure Environment</h4>
                    <p className="text-gray-600">Monitored exits, wandering prevention, and safe outdoor spaces</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Brain className="h-6 w-6 text-purple-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Cognitive Therapy</h4>
                    <p className="text-gray-600">Memory-enhancing activities and specialized programming</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Users className="h-6 w-6 text-purple-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Specialized Staff Training</h4>
                    <p className="text-gray-600">Staff trained in dementia care and behavior management</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Heart className="h-6 w-6 text-purple-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Personalized Care Plans</h4>
                    <p className="text-gray-600">Individualized approach based on each resident's needs</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-6 w-6 text-purple-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Structured Daily Routines</h4>
                    <p className="text-gray-600">Consistent schedules that provide comfort and reduce anxiety</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-6 w-6 text-purple-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">24/7 Supervision</h4>
                    <p className="text-gray-600">Round-the-clock care and monitoring for safety</p>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-semibold mb-4 mt-8">Signs It's Time for Memory Care</h3>
              <p className="mb-4">
                Consider memory care in Cleveland when your loved one experiences:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Wandering or getting lost in familiar places</li>
                <li>Difficulty with personal care and hygiene</li>
                <li>Aggressive or unsafe behaviors</li>
                <li>Inability to manage medications independently</li>
                <li>Sundowning (increased confusion in evening hours)</li>
                <li>Caregiver burnout or inability to provide adequate supervision</li>
                <li>Safety concerns at home (leaving stove on, forgetting to eat)</li>
              </ul>

              <h3 className="text-2xl font-semibold mb-4 mt-8">Memory Care vs. Assisted Living: What's the Difference?</h3>
              <p className="mb-4">
                While both provide personal care assistance, memory care offers additional features:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li><strong>Secure Facilities:</strong> Memory care units have controlled access to prevent wandering</li>
                <li><strong>Staff Training:</strong> Specialized dementia care training for all caregivers</li>
                <li><strong>Lower Staff Ratios:</strong> More staff per resident for intensive supervision</li>
                <li><strong>Specialized Programs:</strong> Activities designed for cognitive stimulation</li>
                <li><strong>Environmental Design:</strong> Layouts that reduce confusion and promote independence</li>
              </ul>

              <h3 className="text-2xl font-semibold mb-4 mt-8">Cost of Memory Care in Cleveland</h3>
              <p className="mb-4">
                Memory care in Cleveland typically costs <strong>$4,500 to $8,500 per month</strong>, which is higher than assisted living due to the specialized care, lower staff-to-resident ratios, and secure environment. Costs vary based on:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-1">
                <li>Level of care required</li>
                <li>Community location and amenities</li>
                <li>Type of apartment (private vs. shared)</li>
                <li>Additional services needed</li>
              </ul>

              <p className="mb-6">
                Most Cleveland memory care communities offer all-inclusive pricing that covers room, meals, personal care, activities, and medical management. Some may charge extra for specialized therapies or one-on-one care.
              </p>

              <h3 className="text-2xl font-semibold mb-4 mt-8">How to Pay for Memory Care in Ohio</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li><strong>Medicaid Waiver Programs:</strong> Ohio offers Assisted Living and PASSPORT waivers that may help cover memory care costs</li>
                <li><strong>Veterans Benefits:</strong> VA Aid & Attendance can provide up to $2,266/month for qualifying veterans</li>
                <li><strong>Long-Term Care Insurance:</strong> Many policies cover memory care services</li>
                <li><strong>Life Insurance Conversion:</strong> Some policies can be converted to pay for care</li>
                <li><strong>Reverse Mortgages:</strong> Can provide funds for memory care costs</li>
              </ul>

              <h3 className="text-2xl font-semibold mb-4 mt-8">Choosing the Right Memory Care Community in Cleveland</h3>
              <p className="mb-4">
                When evaluating Cleveland memory care options, look for:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li><strong>Staff Credentials:</strong> Ask about dementia-specific training and certifications</li>
                <li><strong>Safety Features:</strong> Secure outdoor areas, monitored entry/exit, emergency response systems</li>
                <li><strong>Activity Programs:</strong> Music therapy, art therapy, reminiscence activities</li>
                <li><strong>Healthcare Partnerships:</strong> On-site medical services or partnerships with Cleveland Clinic/University Hospitals</li>
                <li><strong>Family Involvement:</strong> Policies for visits, care plan participation, and communication</li>
                <li><strong>Progression of Care:</strong> Can they accommodate changing needs as dementia progresses?</li>
              </ul>

              <h3 className="text-2xl font-semibold mb-4 mt-8">Memory Care in Greater Cleveland</h3>
              <p className="mb-4">
                Cleveland offers excellent memory care options with access to world-class healthcare systems including Cleveland Clinic's Lou Ruvo Center for Brain Health and University Hospitals' Memory and Cognition Center. Many local communities partner with these institutions for specialized care protocols.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Communities */}
      <div id="communities" className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Top Memory Care Communities in Cleveland</h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            These specialized memory care communities provide expert Alzheimer's and dementia care in secure, compassionate environments.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
            {memoryCareCommunities.map((community) => (
              <LocationCard key={community.id} community={community} />
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/?filter=memory-care"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              View All Memory Care Communities
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-purple-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Get Expert Help Finding Memory Care in Cleveland</h2>
            <p className="text-lg text-gray-700 mb-8">
              Our Cleveland advisors specialize in memory care placement. We understand the unique challenges of dementia care and can help you find the right community—completely free.
            </p>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              {isSuccess ? (
                <div className="text-center py-6">
                  <h3 className="text-xl font-bold text-green-800 mb-2">Thank You!</h3>
                  <p className="text-green-700">A memory care specialist will contact you within 24 hours.</p>
                  <p className="text-sm text-gray-600 mt-4">Need immediate help? Call <strong>(216) 677-4630</strong></p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
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
                  <select
                    name="urgency"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  >
                    <option value="">How soon do you need memory care?</option>
                    <option value="immediate">Immediately</option>
                    <option value="1-3-months">Within 1-3 months</option>
                    <option value="3-6-months">Within 3-6 months</option>
                    <option value="researching">Just researching options</option>
                  </select>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    {isSubmitting ? 'Sending...' : 'Get Free Memory Care Consultation'}
                  </button>
                  <p className="text-xs text-gray-500">We'll contact you within 24 hours to discuss your specific needs.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <StickyTourButton />
      <Footer />
    </main>
  );
}

