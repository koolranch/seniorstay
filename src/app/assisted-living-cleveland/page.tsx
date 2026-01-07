"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, DollarSign, Heart, MapPin, Users } from 'lucide-react';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import LocationCard from '@/components/property/LocationCard';
import StickyTourButton from '@/components/tour/StickyTourButton';
import { communityData } from '@/data/facilities';
import SimpleContactForm from '@/components/forms/SimpleContactForm';

export default function AssistedLivingClevelandPage() {
  // Filter for Cleveland-area assisted living communities
  const clevelandCities = ['Cleveland', 'Shaker Heights', 'Beachwood', 'Parma', 'Lakewood', 'Westlake', 'Strongsville', 'Independence', 'Seven Hills', 'Rocky River'];
  const assistedLivingCommunities = communityData.filter(c => 
    c.careTypes.includes('Assisted Living') &&
    clevelandCities.some(city => c.location.toLowerCase().includes(city.toLowerCase()))
  ).slice(0, 8);

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Assisted Living in Cleveland, Ohio
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Find the perfect assisted living community for your loved one. Compare top-rated Cleveland-area options, schedule tours, and get personalized guidance—completely free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#communities"
                className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                Browse Communities
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

      {/* What is Assisted Living Section */}
      <div id="guide" className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">What is Assisted Living?</h2>
            
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-6">
                Assisted living is a senior housing option designed for older adults who need help with daily activities but don't require the intensive medical care provided in a nursing home. Cleveland's assisted living communities offer a perfect balance of independence and support, providing personalized care in a home-like environment.
              </p>

              <h3 className="text-2xl font-semibold mb-4 mt-8">Services Provided in Cleveland Assisted Living Communities</h3>
              
              <div className="grid md:grid-cols-2 gap-6 my-8 not-prose">
                <div className="flex gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Personal Care Assistance</h4>
                    <p className="text-gray-600">Help with bathing, dressing, grooming, and mobility</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Medication Management</h4>
                    <p className="text-gray-600">Staff ensures medications are taken correctly and on time</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Meals & Dining</h4>
                    <p className="text-gray-600">Three nutritious meals daily plus snacks</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Housekeeping & Laundry</h4>
                    <p className="text-gray-600">Maintenance-free living with regular cleaning services</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Social Activities</h4>
                    <p className="text-gray-600">Engaging programs, events, and outings</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">24/7 Staff Support</h4>
                    <p className="text-gray-600">Help available whenever needed</p>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-semibold mb-4 mt-8">When to Consider Assisted Living</h3>
              <p className="mb-4">
                It may be time to consider assisted living in Cleveland when your loved one:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Has difficulty with daily tasks like bathing, dressing, or meal preparation</li>
                <li>Experiences frequent falls or safety concerns at home</li>
                <li>Feels isolated or lonely living alone</li>
                <li>Has trouble managing medications correctly</li>
                <li>Requires more care than family members can safely provide</li>
                <li>Would benefit from social engagement and activities</li>
              </ul>

              <h3 className="text-2xl font-semibold mb-4 mt-8">Cost of Assisted Living in Cleveland</h3>
              <p className="mb-4">
                Assisted living in Cleveland typically ranges from <strong>$3,200 to $6,500 per month</strong>, depending on the level of care needed, location, and amenities offered. This cost usually includes:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-1">
                <li>Private or semi-private apartment</li>
                <li>All meals and snacks</li>
                <li>Personal care services</li>
                <li>Medication management</li>
                <li>Housekeeping and laundry</li>
                <li>Activities and social programs</li>
                <li>24-hour staffing and emergency response</li>
              </ul>

              <p className="mb-4">
                Additional costs may include specialized care, beauty salon services, or transportation. Many Cleveland-area assisted living communities offer all-inclusive pricing to simplify budgeting.
              </p>

              <h3 className="text-2xl font-semibold mb-4 mt-8">Financial Assistance Options in Ohio</h3>
              <p className="mb-4">
                Ohio offers several programs to help pay for assisted living:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li><strong>Medicaid Assisted Living Waiver:</strong> Helps eligible seniors pay for assisted living services</li>
                <li><strong>Veterans Aid & Attendance:</strong> Additional benefits for qualifying veterans and spouses</li>
                <li><strong>Long-term Care Insurance:</strong> May cover some or all assisted living costs</li>
                <li><strong>Medicare:</strong> Does not cover room and board, but may cover specific medical services</li>
              </ul>

              <h3 className="text-2xl font-semibold mb-4 mt-8">How to Choose an Assisted Living Community in Cleveland</h3>
              <p className="mb-4">
                When evaluating Cleveland assisted living options, consider:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li><strong>Location:</strong> Proximity to family, friends, and familiar neighborhoods</li>
                <li><strong>Healthcare Access:</strong> Distance to hospitals like Cleveland Clinic or University Hospitals</li>
                <li><strong>Staff-to-Resident Ratio:</strong> Lower ratios mean more personalized attention</li>
                <li><strong>Activities & Amenities:</strong> Programs that match your loved one's interests</li>
                <li><strong>Community Culture:</strong> Visit multiple times to get a feel for the atmosphere</li>
                <li><strong>Reviews & Reputation:</strong> Check state inspection reports and online reviews</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Communities */}
      <div id="communities" className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Top Assisted Living Communities in Cleveland</h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            These highly-rated assisted living communities offer quality care, engaging activities, and personalized support for Cleveland-area seniors.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
            {assistedLivingCommunities.map((community) => (
              <LocationCard key={community.id} community={community} />
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/?filter=assisted-living"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              View All Assisted Living Communities
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Get Free Help Finding Assisted Living in Cleveland</h2>
            <p className="text-lg text-gray-700 mb-8">
              Our local advisors know every community personally. We'll help you compare options, schedule tours, and find the perfect fit—at no cost to you.
            </p>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <SimpleContactForm 
                sourcePage="assisted-living-cleveland" 
                buttonText="Get Free Consultation"
                showMessage={false}
              />
            </div>
          </div>
        </div>
      </div>

      <StickyTourButton />
      <Footer />
    </main>
  );
}

