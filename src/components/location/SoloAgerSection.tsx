'use client';

import React from 'react';
import Link from 'next/link';
import { User, Home, Shield, Sparkles, Coffee, Users, ArrowRight, Check } from 'lucide-react';
import { CityInfo } from '@/data/cleveland-cities';

interface SoloAgerSectionProps {
  cityName: string;
  citySlug: string;
  cityData?: CityInfo;
}

/**
 * SoloAgerSection - 'Rightsizing & Autonomy' content for Solo Ager persona
 * Targets seniors living alone who are proactively planning their next chapter
 * Focus: Independence, lifestyle, community, and peace of mind
 */
const SoloAgerSection: React.FC<SoloAgerSectionProps> = ({
  cityName,
  citySlug,
  cityData,
}) => {
  const currentYear = new Date().getFullYear();
  
  // City-specific lifestyle benefits
  const cityLifestyleBenefits = getCityLifestyleBenefits(citySlug, cityName);
  
  // Cost comparison data
  const independentLivingCost = cityData?.averageCost?.independentLiving || '$2,500 - $4,500';
  
  return (
    <section className="py-16 bg-gradient-to-br from-teal-50 via-white to-emerald-50 border-y border-teal-100">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Section Header - Solo Ager Persona */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <User className="h-4 w-4" />
              <span>For Proactive Planners</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Rightsizing & Autonomy in {cityName}
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              If you&apos;re a senior living alone and thinking ahead, {cityName} offers exceptional independent living options 
              that let you maintain your autonomy while gaining peace of mind—and often saving money compared to home ownership.
            </p>
          </div>

          {/* Two-Column Benefits */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Left: Why Rightsize */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-teal-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-teal-100 rounded-xl">
                  <Home className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Why Rightsize in {cityName}?</h3>
              </div>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    <strong>Eliminate home maintenance</strong>—no more snow shoveling, lawn care, or expensive repairs
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    <strong>Reduce property taxes</strong>—Cuyahoga County averages 2.18% of home value annually
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    <strong>All-inclusive pricing</strong>—utilities, meals, housekeeping bundled starting at {independentLivingCost}/mo
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    <strong>Future-proof your care</strong>—communities with a continuum of care mean no disruptive moves later
                  </span>
                </li>
              </ul>
            </div>

            {/* Right: Lifestyle Benefits */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-teal-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <Sparkles className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{cityName} Lifestyle Benefits</h3>
              </div>
              
              <ul className="space-y-4">
                {cityLifestyleBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Solo Ager Value Props */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-white p-5 rounded-xl border border-teal-100 text-center">
              <Coffee className="h-8 w-8 text-teal-600 mx-auto mb-3" />
              <div className="font-semibold text-gray-900">Social Connection</div>
              <div className="text-sm text-gray-600 mt-1">Daily activities & dining companions</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-teal-100 text-center">
              <Shield className="h-8 w-8 text-teal-600 mx-auto mb-3" />
              <div className="font-semibold text-gray-900">Safety & Security</div>
              <div className="text-sm text-gray-600 mt-1">24/7 staff & emergency systems</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-teal-100 text-center">
              <Users className="h-8 w-8 text-teal-600 mx-auto mb-3" />
              <div className="font-semibold text-gray-900">Peer Community</div>
              <div className="text-sm text-gray-600 mt-1">Like-minded neighbors & friends</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-teal-100 text-center">
              <Home className="h-8 w-8 text-teal-600 mx-auto mb-3" />
              <div className="font-semibold text-gray-900">Your Space</div>
              <div className="text-sm text-gray-600 mt-1">Private apartment, your schedule</div>
            </div>
          </div>

          {/* CTA for Solo Agers */}
          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-3">
              Thinking About Your Next Chapter in {cityName}?
            </h3>
            <p className="text-teal-100 mb-6 max-w-2xl mx-auto">
              Our advisors specialize in helping solo agers find the perfect independent living community—
              one that maximizes your freedom, social life, and financial security.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/assessment"
                className="inline-flex items-center justify-center gap-2 bg-white text-teal-700 font-bold px-8 py-4 rounded-xl hover:bg-teal-50 transition-colors"
              >
                <span>Take the Lifestyle Assessment</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="tel:+12166774630"
                className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors"
              >
                Call (216) 677-4630
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * Get city-specific lifestyle benefits for solo agers
 */
function getCityLifestyleBenefits(citySlug: string, cityName: string): string[] {
  const cityBenefits: Record<string, string[]> = {
    'westlake': [
      'Walk to Crocker Park for shopping, dining, and entertainment',
      'St. John Medical Center on-site for peace of mind',
      'Award-winning city recreation programs for seniors',
      'Safe, well-maintained neighborhoods with low crime',
    ],
    'beachwood': [
      'Legacy Village and Beachwood Place steps away',
      'Premium dining and cultural options within walking distance',
      'UH Ahuja Medical Center for world-class healthcare',
      'Active Jewish community with synagogues nearby',
    ],
    'shaker-heights': [
      'Historic architecture and beautiful tree-lined streets',
      'Van Aken District walkable dining and shopping',
      'RTA Rapid Transit access to downtown Cleveland',
      'Shaker Lakes Nature Center for outdoor activities',
    ],
    'rocky-river': [
      'Lake Erie waterfront and Rocky River Reservation',
      'Affluent, walkable downtown with boutiques and cafes',
      'Metroparks trails for walking and nature enjoyment',
      'Close to Crocker Park and Westlake amenities',
    ],
    'lakewood': [
      'Most walkable community in Greater Cleveland',
      'Lake Erie waterfront and Lakewood Park',
      'Vibrant arts scene and diverse restaurants',
      'RTA access to downtown cultural attractions',
    ],
    'cleveland': [
      'World-class cultural institutions (Orchestra, Museums)',
      'Diverse dining and entertainment options',
      'Public transit access throughout the metro area',
      'Cleveland Clinic and UH main campuses nearby',
    ],
    'parma': [
      'Affordable cost of living with quality care',
      'Strong Polish heritage and community events',
      'Multiple shopping centers and restaurants nearby',
      'Close to Cleveland Metroparks for outdoor activities',
    ],
    'strongsville': [
      'SouthPark Mall and shopping conveniences',
      'Cleveland Metroparks Mill Stream Run Reservation',
      'Family-friendly community with excellent services',
      'Southwest General for nearby healthcare',
    ],
  };
  
  return cityBenefits[citySlug] || [
    `${cityName}'s safe, welcoming neighborhoods`,
    'Easy access to Greater Cleveland healthcare network',
    'Local shopping, dining, and entertainment options',
    'Active senior community programs and events',
  ];
}

export default SoloAgerSection;

