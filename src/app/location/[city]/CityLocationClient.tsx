"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { MapPin, Phone, ArrowRight, ChevronDown, Hospital, Shield, Users, Gamepad2, Brain, Coffee, BookOpen } from 'lucide-react';
import GlobalHeader from '@/components/home/GlobalHeader';
import Footer from '@/components/footer/Footer';
import LocationCard from '@/components/property/LocationCard';
import ComparisonFloatingButton from '@/components/comparison/ComparisonFloatingButton';
import SchemaOrg from './SchemaOrg';
import MapComponent from '@/components/map/GoogleMap';
import { Community } from '@/data/facilities';
import { clevelandCitiesData } from '@/data/cleveland-cities';
import { getLocalResourcesForCity } from '@/data/local-resources';
import LocalSeniorResources from '@/components/location/LocalSeniorResources';
import TestimonialSection from '@/components/testimonials/TestimonialSection';
import CommunityComparisonTable from '@/components/location/CommunityComparisonTable';
import AffordabilityCalculator from '@/components/AffordabilityCalculator';
import StickyCalculatorCTA from '@/components/StickyCalculatorCTA';
import CityLeadMagnet from '@/components/location/CityLeadMagnet';
import CareTypeNav from '@/components/location/CareTypeNav';
import LocalAuthorityProse from '@/components/location/LocalAuthorityProse';

interface CityLocationClientProps {
  cityName: string;
  stateAbbr: string;
  communities: Community[];
}

export default function CityLocationClient({ cityName, stateAbbr, communities }: CityLocationClientProps) {
  const [totalCommunities, setTotalCommunities] = useState(0);
  const [careTypeCounts, setCareTypeCounts] = useState<Record<string, number>>({});
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [showAllCommunities, setShowAllCommunities] = useState(false);

  // Get city-specific data
  const citySlug = cityName.toLowerCase().replace(/\s+/g, '-');
  const cityData = clevelandCitiesData[citySlug];
  const localResources = getLocalResourcesForCity(citySlug);
  const currentYear = new Date().getFullYear();

  // Determine if this is a hospital discharge context
  const isHospitalDischarge = citySlug === 'westlake';
  const isMemoryCareHub = citySlug === 'beachwood';

  // Get featured communities (top 3)
  const featuredCommunities = useMemo(() => {
    return communities
      .filter(c => 
        c.careTypes.some(t => 
          t.toLowerCase().includes('assisted living') || 
          t.toLowerCase().includes('memory care')
        ) && c.description && !c.images[0]?.includes('placeholder')
      )
      .slice(0, 3);
  }, [communities]);

  // All remaining communities
  const remainingCommunities = useMemo(() => {
    const featuredIds = new Set(featuredCommunities.map(c => c.id));
    return communities.filter(c => !featuredIds.has(c.id));
  }, [communities, featuredCommunities]);

  useEffect(() => {
    setTotalCommunities(communities.length);

    if (communities.length > 0) {
      const communitiesWithCoords = communities.filter(c => c.coordinates);
      if (communitiesWithCoords.length > 0) {
        setMapCenter({
          lat: communitiesWithCoords[0].coordinates!.lat,
          lng: communitiesWithCoords[0].coordinates!.lng
        });
      }
    }

    const counts: Record<string, number> = {};
    communities.forEach(community => {
      community.careTypes.forEach(type => {
        counts[type] = (counts[type] || 0) + 1;
      });
    });
    setCareTypeCounts(counts);
  }, [communities]);

  // Generate dynamic hero subtitle based on city context
  const getHeroSubtitle = () => {
    if (isHospitalDischarge) {
      return `Moving from a hospital to senior care? Get our 48-hour ${cityName} discharge checklist and ${currentYear} local cost guide—free.`;
    }
    if (isMemoryCareHub) {
      return `Find specialized memory care near UH Ahuja Medical Center. Compare ${totalCommunities} communities with ${currentYear} pricing.`;
    }
    return `Compare ${totalCommunities} senior living communities in ${cityName}. Get personalized recommendations and ${currentYear} pricing.`;
  };

  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* Schema.org structured data for SEO */}
      <SchemaOrg
        cityName={cityName}
        stateAbbr={stateAbbr}
        communities={communities}
        cityData={cityData}
      />

      <GlobalHeader />

      {/* ============================================
          SECTION 1: HERO SECTION
          High-intent heading with empathetic sub-headline
      ============================================ */}
      <section className="bg-gradient-to-b from-slate-50 via-white to-white py-12 md:py-16 relative overflow-hidden">
        {/* Decorative blurs */}
        <div className="absolute top-10 left-0 w-72 h-72 bg-teal-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-0 w-96 h-96 bg-cyan-200/15 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Trust Badge */}
            <span className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <MapPin className="h-4 w-4" />
              {totalCommunities} Communities in {cityName}
            </span>

            {/* Dynamic H1 with city name */}
            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-5 leading-tight">
              {isHospitalDischarge && (
                <>Hospital Discharge? <br className="hidden md:block" /></>
              )}
              Senior Living in {cityName}, {stateAbbr}
            </h1>

            {/* Empathetic sub-headline */}
            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              {getHeroSubtitle()}
            </p>

            {/* Quick CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <a
                href="tel:+12166774630"
                className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-lg hover:shadow-xl min-h-[56px]"
              >
                <Phone className="h-5 w-5" />
                Talk to a {cityName} Expert
              </a>
              <a
                href="#communities"
                className="inline-flex items-center justify-center gap-2 bg-white border-2 border-slate-300 text-slate-700 hover:border-teal-500 hover:text-teal-600 font-bold px-8 py-4 rounded-xl transition-colors min-h-[56px]"
              >
                Browse Communities
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>

            {/* Trust Signals */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-slate-600 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-teal-500" />
                <span>100% Free Service</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-teal-500" />
                <span>Local Cleveland Advisors</span>
              </div>
              <div className="flex items-center gap-2">
                <Hospital className="h-4 w-4 text-teal-500" />
                <span>Near {cityData?.nearbyHospitals?.[0]?.split(' ').slice(0, 3).join(' ') || 'Major Hospitals'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 2: LEAD MAGNET (Above the fold)
          Immediately visible without scrolling
      ============================================ */}
      <CityLeadMagnet 
        cityName={cityName} 
        citySlug={citySlug} 
        isHospitalDischarge={isHospitalDischarge}
      />

      {/* ============================================
          SECTION 3: LOCAL AUTHORITY CONTEXT
          1-2 paragraphs about senior care in this neighborhood
      ============================================ */}
      <LocalAuthorityProse
        cityName={cityName}
        citySlug={citySlug}
        cityData={cityData}
        communityCount={totalCommunities}
        isHospitalDischarge={isHospitalDischarge}
      />

      {/* ============================================
          SECTION 4: CARE TYPE NAVIGATION
          Cards linking to deeper sub-pages
      ============================================ */}
      <CareTypeNav
        cityName={cityName}
        citySlug={citySlug}
        careTypeCounts={careTypeCounts}
      />

      {/* ============================================
          SECTION 5: AFFORDABILITY CALCULATOR
          Interactive cost comparison tool
      ============================================ */}
      <section id="affordability-calculator" className="bg-slate-50 py-12 border-y border-slate-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              Is Senior Living Affordable in {cityName}?
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Compare the true cost of staying home vs. all-inclusive senior living. Many families are surprised.
            </p>
          </div>
          <AffordabilityCalculator defaultCity={citySlug} />
        </div>
      </section>

      {/* ============================================
          SECTION 6: MAP SECTION
          Visual community locations
      ============================================ */}
      <section className="bg-white py-12 border-b border-slate-200">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            {cityName} Senior Living Locations
          </h2>
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
            <MapComponent
              communities={communities}
              height="400px"
              center={mapCenter || undefined}
              zoom={12}
            />
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 7: COMMUNITY LISTINGS (The Feed)
          Featured communities first, then "View All"
      ============================================ */}
      <section id="communities" className="py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          {/* Featured Communities */}
          {featuredCommunities.length > 0 && (
            <div className="mb-12">
              <div className="text-center mb-8">
                <span className="inline-block bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  Featured Communities
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                  Top-Rated Senior Living in {cityName}
                </h2>
                <p className="text-slate-600 max-w-2xl mx-auto">
                  Our advisors recommend these communities based on care quality, amenities, and family feedback.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {featuredCommunities.map((community) => (
                  <LocationCard key={community.id} community={community} />
                ))}
              </div>
            </div>
          )}

          {/* All Communities - Hidden by default */}
          <div className="text-center">
            {!showAllCommunities ? (
              <button
                onClick={() => setShowAllCommunities(true)}
                className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-lg hover:shadow-xl min-h-[56px]"
              >
                View All {totalCommunities} Communities in {cityName}
                <ChevronDown className="h-5 w-5" />
              </button>
            ) : (
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">
                  All Senior Living Communities in {cityName}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {remainingCommunities.map((community) => (
                    <LocationCard key={community.id} community={community} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 8: COMMUNITY COMPARISON TABLE
          Side-by-side comparison for decision making
      ============================================ */}
      {communities.length > 1 && (
        <CommunityComparisonTable
          communities={communities}
          cityName={cityName}
          maxCommunities={6}
        />
      )}

      {/* ============================================
          SECTION 9: TESTIMONIALS
          Social proof from local families
      ============================================ */}
      <TestimonialSection
        title={`What Cleveland Families Say About ${cityName} Senior Living`}
        subtitle="Real experiences from families who found senior care with our help"
        cityName={cityName}
        limit={3}
        className="bg-white border-t"
      />

      {/* ============================================
          SECTION 10: LOCAL RESOURCES
          Community resources and support
      ============================================ */}
      {localResources && (
        <LocalSeniorResources cityName={cityName} resources={localResources} />
      )}

      {/* ============================================
          SECTION 11: HELPFUL RESOURCES
          Internal linking to boost SEO + user value
      ============================================ */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="inline-block bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Helpful Resources
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              Senior Living Guides & Activities
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Free resources to help you and your loved one navigate senior care decisions
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <Link 
              href="/resources/games-for-seniors"
              className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="bg-violet-100 text-violet-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Gamepad2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                Games for Seniors
              </h3>
              <p className="text-slate-600 text-sm mb-3">
                Free brain games and puzzles to stay mentally sharp.
              </p>
              <span className="text-teal-600 text-sm font-semibold flex items-center gap-1">
                Explore <ArrowRight className="h-4 w-4" />
              </span>
            </Link>

            <Link 
              href="/resources/social-activities"
              className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="bg-rose-100 text-rose-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Coffee className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                Where Seniors Meet
              </h3>
              <p className="text-slate-600 text-sm mb-3">
                Social activities and places to make new friends.
              </p>
              <span className="text-teal-600 text-sm font-semibold flex items-center gap-1">
                Explore <ArrowRight className="h-4 w-4" />
              </span>
            </Link>

            <Link 
              href="/resources/brain-health"
              className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="bg-teal-100 text-teal-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                Brain Health Guide
              </h3>
              <p className="text-slate-600 text-sm mb-3">
                Cognitive exercises and memory care tips.
              </p>
              <span className="text-teal-600 text-sm font-semibold flex items-center gap-1">
                Explore <ArrowRight className="h-4 w-4" />
              </span>
            </Link>

            <Link 
              href="/senior-living-costs-cleveland"
              className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="bg-amber-100 text-amber-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                Cleveland Cost Guide
              </h3>
              <p className="text-slate-600 text-sm mb-3">
                Understand senior living pricing in {cityName}.
              </p>
              <span className="text-teal-600 text-sm font-semibold flex items-center gap-1">
                Explore <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 12: FINAL CTA
          Strong conversion close
      ============================================ */}
      <section className="py-16 bg-gradient-to-r from-teal-600 to-teal-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Find Senior Care in {cityName}?
          </h2>
          <p className="text-lg text-teal-100 mb-8 max-w-2xl mx-auto">
            Our local advisors are standing by to help you compare options, schedule tours, and find the perfect community—at no cost to you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+12166774630"
              className="inline-flex items-center justify-center gap-2 bg-white text-teal-700 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:bg-slate-50 transition-all min-h-[56px]"
            >
              <Phone className="h-5 w-5" />
              Call (216) 677-4630
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-teal-800 text-white font-bold px-8 py-4 rounded-xl hover:bg-teal-900 transition-all min-h-[56px]"
            >
              Request Free Consultation
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Floating Components */}
      <ComparisonFloatingButton />
      <StickyCalculatorCTA cityName={cityName} />

      <Footer />
    </main>
  );
}
