'use client';

import React from 'react';
import { Hospital, Clock, Shield, Phone, ArrowRight, Heart, Brain, Activity } from 'lucide-react';
import Link from 'next/link';

interface CitySpecificContentProps {
  citySlug: string;
  cityName: string;
}

/**
 * CitySpecificContent - High-intent long-tail keyword content blocks
 * Targets specific search queries for Westlake (hospital discharge) and Beachwood (memory care)
 */
const CitySpecificContent: React.FC<CitySpecificContentProps> = ({ citySlug, cityName }) => {
  // Westlake: Hospital Discharge Content
  if (citySlug === 'westlake') {
    return (
      <section className="py-12 bg-gradient-to-br from-blue-50 to-white border-y border-blue-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* H2 Section Header - Exact target keyword */}
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Hospital className="h-7 w-7 text-blue-600" />
              </div>
              Navigating Hospital Discharge to Westlake Senior Living
            </h2>
            
            {/* 150-word clinical-grade content */}
            <div className="prose prose-lg max-w-none text-gray-700 mb-8">
              <p>
                When a loved one is being discharged from <strong>St. John Medical Center</strong> or Cleveland Clinic Avon, 
                finding the right assisted living community in Westlake, OH becomes urgent. Our discharge planning 
                specialists work directly with hospital case managers to ensure a seamless transition—often within 
                24-48 hours of discharge notification.
              </p>
              <p>
                <strong>Westlake senior living costs in 2026</strong> range from $3,800 to $6,500 per month, with many 
                communities offering short-term rehabilitation stays and respite care for post-hospital recovery. 
                Communities like Arden Courts and Brookdale Westlake specialize in accepting hospital discharges 
                with complex medical needs.
              </p>
              <p>
                Don&apos;t face this decision alone. Our free consultation includes: same-day community availability checks, 
                insurance verification, and transportation coordination from the hospital to your chosen community.
              </p>
            </div>
            
            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                <Clock className="h-6 w-6 text-blue-600 mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Same-Week Move-Ins</h3>
                <p className="text-sm text-gray-600">Urgent placements available for hospital discharges</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                <Shield className="h-6 w-6 text-blue-600 mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Insurance Verification</h3>
                <p className="text-sm text-gray-600">We verify Medicare, Medicaid & private insurance</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                <Activity className="h-6 w-6 text-blue-600 mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Rehab Support</h3>
                <p className="text-sm text-gray-600">Communities with PT/OT for post-hospital recovery</p>
              </div>
            </div>
            
            {/* CTA */}
            <div className="bg-blue-600 text-white p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold mb-1">Need Urgent Discharge Planning?</h3>
                <p className="text-blue-100">Speak with a Westlake placement specialist today—no cost, no obligation.</p>
              </div>
              <a 
                href="tel:+12166774630"
                className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap"
              >
                <Phone className="h-5 w-5" />
                (216) 677-4630
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  // Beachwood: Memory Care near UH Ahuja Content
  if (citySlug === 'beachwood') {
    return (
      <section className="py-12 bg-gradient-to-br from-purple-50 to-white border-y border-purple-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* H2 Section Header - Exact target keyword */}
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Brain className="h-7 w-7 text-purple-600" />
              </div>
              Clinical Excellence: Memory Care Near UH Ahuja Medical Center
            </h2>
            
            {/* 150-word clinical-grade content */}
            <div className="prose prose-lg max-w-none text-gray-700 mb-8">
              <p>
                Beachwood&apos;s proximity to <strong>UH Ahuja Medical Center</strong> makes it the premier destination for 
                families seeking specialized <strong>memory care and skilled nursing for dementia</strong>. With the 
                Neurological Institute just minutes away, Beachwood communities offer unmatched access to 
                dementia specialists, neurologists, and clinical trials.
              </p>
              <p>
                <strong>Beachwood skilled nursing for dementia</strong> starts at approximately $6,800/month for memory 
                care, with premium communities like Rose Senior Living and Menorah Park offering secured units, 
                specialized programming, and 24-hour nursing supervision. These communities accept direct 
                transfers from UH Ahuja&apos;s geriatric psychiatry unit.
              </p>
              <p>
                Our advisors specialize in dementia care placement—we understand the unique needs of families 
                navigating Alzheimer&apos;s, Lewy body dementia, and vascular dementia diagnoses. Let us connect 
                you with communities that match your loved one&apos;s stage of care.
              </p>
            </div>
            
            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm">
                <Brain className="h-6 w-6 text-purple-600 mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Dementia Specialists</h3>
                <p className="text-sm text-gray-600">Communities with certified dementia care programs</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm">
                <Hospital className="h-6 w-6 text-purple-600 mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">UH Ahuja Access</h3>
                <p className="text-sm text-gray-600">Direct transfers from neurology & geriatric units</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm">
                <Heart className="h-6 w-6 text-purple-600 mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Family Support</h3>
                <p className="text-sm text-gray-600">Caregiver resources & support groups nearby</p>
              </div>
            </div>
            
            {/* CTA */}
            <div className="bg-purple-600 text-white p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold mb-1">Need Memory Care Guidance?</h3>
                <p className="text-purple-100">Speak with a Beachwood dementia care specialist—free consultation.</p>
              </div>
              <a 
                href="tel:+12166774630"
                className="inline-flex items-center gap-2 bg-white text-purple-600 font-bold px-6 py-3 rounded-lg hover:bg-purple-50 transition-colors whitespace-nowrap"
              >
                <Phone className="h-5 w-5" />
                (216) 677-4630
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  // No content for other cities
  return null;
};

export default CitySpecificContent;

