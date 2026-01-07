"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, DollarSign, TrendingUp, Shield, HelpCircle } from 'lucide-react';
import Header from '@/components/header/Header';
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

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Senior Living Costs in Cleveland, Ohio (2025 Guide)
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Transparent pricing information for assisted living, memory care, and independent living in the Cleveland area. Understand costs and explore your financial options.
            </p>
            <a
              href="#get-pricing"
              className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Get Personalized Pricing
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Pricing Overview */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">Cleveland Senior Living Cost Breakdown</h2>
            
            <div className="grid gap-6 mb-12">
              {/* Memory Care */}
              <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="h-8 w-8 text-purple-600" />
                  <h3 className="text-2xl font-bold text-gray-900">Memory Care</h3>
                </div>
                <div className="text-4xl font-bold text-purple-600 mb-2">$4,500 - $8,500</div>
                <p className="text-gray-600 mb-4">per month</p>
                <p className="text-gray-700 mb-4">
                  Specialized care for Alzheimer's and dementia with secure environments, trained staff, and therapeutic programs.
                </p>
                <div className="text-sm text-gray-600">
                  <p className="font-semibold mb-2">Typically Includes:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Secure, monitored environment</li>
                    <li>24/7 specialized dementia care</li>
                    <li>All meals and snacks</li>
                    <li>Memory-enhancing activities</li>
                    <li>Medication management</li>
                    <li>Housekeeping and laundry</li>
                  </ul>
                </div>
              </div>

              {/* Assisted Living */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="h-8 w-8 text-blue-600" />
                  <h3 className="text-2xl font-bold text-gray-900">Assisted Living</h3>
                </div>
                <div className="text-4xl font-bold text-blue-600 mb-2">$3,200 - $6,500</div>
                <p className="text-gray-600 mb-4">per month</p>
                <p className="text-gray-700 mb-4">
                  Help with daily activities while maintaining independence in a supportive community setting.
                </p>
                <div className="text-sm text-gray-600">
                  <p className="font-semibold mb-2">Typically Includes:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Private or shared apartment</li>
                    <li>Personal care assistance</li>
                    <li>Three meals daily plus snacks</li>
                    <li>Medication reminders</li>
                    <li>Social activities and outings</li>
                    <li>Housekeeping and maintenance</li>
                  </ul>
                </div>
              </div>

              {/* Independent Living */}
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="h-8 w-8 text-green-600" />
                  <h3 className="text-2xl font-bold text-gray-900">Independent Living</h3>
                </div>
                <div className="text-4xl font-bold text-green-600 mb-2">$2,200 - $4,500</div>
                <p className="text-gray-600 mb-4">per month</p>
                <p className="text-gray-700 mb-4">
                  Maintenance-free living for active seniors who don't need regular assistance with daily activities.
                </p>
                <div className="text-sm text-gray-600">
                  <p className="font-semibold mb-2">Typically Includes:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Private apartment or cottage</li>
                    <li>Restaurant-style dining</li>
                    <li>Social activities and events</li>
                    <li>Housekeeping services</li>
                    <li>Transportation</li>
                    <li>Fitness and wellness programs</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Affordability Calculator Section */}
      <div id="affordability-calculator">
        <AffordabilityCalculator />
      </div>

      {/* Additional Info Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none text-gray-700">
              <h3 className="text-2xl font-semibold mb-4 mt-8">What Affects Senior Living Costs in Cleveland?</h3>
              <p className="mb-4">Several factors influence the cost of senior living in the Cleveland area:</p>
              
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li><strong>Level of Care:</strong> More intensive care increases costs</li>
                <li><strong>Location:</strong> Upscale suburbs like Beachwood typically cost more than Parma or Seven Hills</li>
                <li><strong>Apartment Size:</strong> Studios vs. one-bedroom vs. two-bedroom units</li>
                <li><strong>Amenities:</strong> Communities with pools, fitness centers, and gourmet dining charge premium prices</li>
                <li><strong>Care Needs:</strong> Additional services like physical therapy or specialized dementia care add to monthly costs</li>
              </ul>

              <h3 className="text-2xl font-semibold mb-4 mt-8">What's NOT Included in Senior Living Costs?</h3>
              <p className="mb-4">Be aware that some services may cost extra:</p>
              <ul className="list-disc pl-6 mb-6 space-y-1">
                <li>Beauty salon and barber services</li>
                <li>Cable TV and phone service</li>
                <li>Personal laundry for some communities</li>
                <li>Guest meals</li>
                <li>Specialized therapies (PT, OT, speech)</li>
                <li>Private duty nursing care</li>
              </ul>

              <h3 className="text-2xl font-semibold mb-4 mt-8">How to Pay for Senior Living in Cleveland</h3>
              
              <h4 className="text-xl font-semibold mb-3 mt-6">1. Private Pay Options</h4>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Savings and Retirement Accounts:</strong> 401(k), IRA, pensions</li>
                <li><strong>Sale of Home:</strong> Many families use proceeds from selling the family home</li>
                <li><strong>Long-Term Care Insurance:</strong> Policies specifically designed for senior care costs</li>
                <li><strong>Life Insurance Conversion:</strong> Some policies can be converted to pay for care</li>
              </ul>

              <h4 className="text-xl font-semibold mb-3 mt-6">2. Government Assistance Programs</h4>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Ohio Medicaid Assisted Living Waiver:</strong> Helps low-income seniors afford assisted living and memory care</li>
                <li><strong>PASSPORT Waiver:</strong> Ohio program that helps seniors pay for care at home or in assisted living</li>
                <li><strong>Veterans Aid & Attendance:</strong> Up to $2,266/month for qualifying veterans and surviving spouses</li>
                <li><strong>VA Community Nursing Home Care:</strong> Coverage for eligible veterans</li>
              </ul>

              <h4 className="text-xl font-semibold mb-3 mt-6">3. Other Financial Options</h4>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li><strong>Reverse Mortgage:</strong> Access home equity to pay for care</li>
                <li><strong>Bridge Loans:</strong> Short-term loans while selling property</li>
                <li><strong>Family Contributions:</strong> Multiple family members sharing costs</li>
                <li><strong>Annuities:</strong> Convert assets into guaranteed income stream</li>
              </ul>

              <h3 className="text-2xl font-semibold mb-4 mt-8">Cleveland vs. National Average Costs</h3>
              <p className="mb-4">
                Senior living in Cleveland is generally <strong>5-15% below the national average</strong>, making it an affordable option compared to coastal cities. The lower cost of living in Northeast Ohio means families can often afford higher-quality communities than they could in more expensive markets.
              </p>

              <h3 className="text-2xl font-semibold mb-4 mt-8">Questions to Ask About Pricing</h3>
              <p className="mb-4">When touring Cleveland senior living communities, ask:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>What is included in the base monthly rate?</li>
                <li>What services cost extra (à la carte pricing)?</li>
                <li>How are care level increases handled and priced?</li>
                <li>Is there a community fee or move-in deposit?</li>
                <li>What is your refund policy if I need to move out?</li>
                <li>Do you accept Medicaid waiver? If so, after how long?</li>
                <li>Are there any upcoming rate increases?</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div id="get-pricing" className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Get Personalized Pricing for Cleveland Communities</h2>
            <p className="text-lg text-gray-700 mb-8">
              Every situation is unique. Tell us about your needs and we'll provide specific pricing for communities that match your requirements and budget.
            </p>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              {isSuccess ? (
                <div className="text-center py-6">
                  <h3 className="text-xl font-bold text-green-800 mb-2">Thank You!</h3>
                  <p className="text-green-700">We'll send you detailed pricing information shortly.</p>
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
                    name="care_type"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  >
                    <option value="">Type of care needed?</option>
                    <option value="memory-care">Memory Care</option>
                    <option value="assisted-living">Assisted Living</option>
                    <option value="independent-living">Independent Living</option>
                    <option value="not-sure">Not Sure</option>
                  </select>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    {isSubmitting ? 'Sending...' : 'Get Your Free Pricing Guide'}
                  </button>
                  <p className="text-xs text-gray-500">We'll send detailed pricing for communities that match your needs.</p>
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

