"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { MapPin, Phone, ArrowRight, Hospital, Shield, Users, Gamepad2, Brain, Coffee, BookOpen } from 'lucide-react';
import GlobalHeader from '@/components/home/GlobalHeader';
import Footer from '@/components/footer/Footer';
import LocationCard from '@/components/property/LocationCard';
import ComparisonFloatingButton from '@/components/comparison/ComparisonFloatingButton';
import SchemaOrg from './SchemaOrg';
import MapComponent from '@/components/map/GoogleMap';
import { Community } from '@/data/facilities';
import { getCityInfo, type RegionConfig } from '@/data/regions';
import { getLocalResourcesForCity } from '@/data/local-resources';
import LocalSeniorResources from '@/components/location/LocalSeniorResources';
import TestimonialSection from '@/components/testimonials/TestimonialSection';
import CommunityComparisonTable from '@/components/location/CommunityComparisonTable';
import AffordabilityCalculator from '@/components/AffordabilityCalculator';
import StickyCalculatorCTA from '@/components/StickyCalculatorCTA';
import CityLeadMagnet from '@/components/location/CityLeadMagnet';
import CareTypeNav from '@/components/location/CareTypeNav';
import LocalAuthorityProse from '@/components/location/LocalAuthorityProse';
import CityAdvisorDeepDive from '@/components/location/CityAdvisorDeepDive';
import NeighborhoodEvents from '@/components/events/NeighborhoodEvents';
import SavedCommunitiesBar from '@/components/community/SavedCommunitiesBar';
import CommunityListingFilters from '@/components/location/CommunityListingFilters';
import EditorialPlacementLinks from '@/components/conversion/EditorialPlacementLinks';
import PlacementConversionBand from '@/components/conversion/PlacementConversionBand';
import PhoneLink from '@/components/conversion/PhoneLink';
import {
  DEFAULT_LISTING_FILTERS,
  filterCommunities,
  getFeaturedCommunities,
  ListingFilters,
} from '@/lib/community-listing-utils';

interface CityLocationClientProps {
  cityName: string;
  stateAbbr: string;
  communities: Community[];
  regionSlug: string;
  regionConfig: RegionConfig;
}

export default function CityLocationClient({ 
  cityName, 
  stateAbbr, 
  communities, 
  regionSlug,
  regionConfig 
}: CityLocationClientProps) {
  // Derive these from `communities` directly so they render correctly during SSR.
  // Previously these were useState(empty) + useEffect, which left Google indexing
  // "Compare 0 senior living communities" because effects don't run server-side.
  const totalCommunities = communities.length;
  const careTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const community of communities) {
      for (const type of community.careTypes) {
        counts[type] = (counts[type] || 0) + 1;
      }
    }
    return counts;
  }, [communities]);
  const mapCenter = useMemo(() => {
    const first = communities.find(c => c.coordinates);
    return first?.coordinates ? { lat: first.coordinates.lat, lng: first.coordinates.lng } : null;
  }, [communities]);
  const [listingFilters, setListingFilters] = useState<ListingFilters>(DEFAULT_LISTING_FILTERS);

  const filteredCommunities = useMemo(
    () => filterCommunities(communities, listingFilters),
    [communities, listingFilters]
  );

  const featuredCommunities = useMemo(
    () => getFeaturedCommunities(filteredCommunities, 9),
    [filteredCommunities]
  );

  const remainingCommunities = useMemo(() => {
    const featuredIds = new Set(featuredCommunities.map((c) => c.id));
    return filteredCommunities.filter((c) => !featuredIds.has(c.id));
  }, [filteredCommunities, featuredCommunities]);
  const citySlug = cityName.toLowerCase().replace(/\s+/g, '-');
  const cityData = getCityInfo(regionSlug, citySlug);
  const localResources = getLocalResourcesForCity(citySlug);
  const currentYear = new Date().getFullYear();
  const phoneNumber = regionConfig.phoneNumber;

  const isHospitalDischarge = citySlug === 'westlake';
  const isMemoryCareHub = citySlug === 'beachwood';

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
        cityData={cityData || undefined}
        regionSlug={regionSlug}
        regionConfig={regionConfig}
      />

      <GlobalHeader />

      {/* SECTION 1: HERO SECTION */}
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <PhoneLink
                placement="city_hero"
                phoneTel={`tel:${phoneNumber.replace(/[^0-9+]/g, '')}`}
                className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-lg hover:shadow-xl min-h-[56px]"
              >
                <Phone className="h-5 w-5" />
                Talk to a {cityName} Expert
              </PhoneLink>
              <a
                href={`/contact?city=${encodeURIComponent(cityName)}`}
                className="inline-flex items-center justify-center gap-2 bg-white border-2 border-slate-300 text-slate-700 hover:border-teal-500 hover:text-teal-600 font-bold px-8 py-4 rounded-xl transition-colors min-h-[56px]"
              >
                Request Callback
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
            <p className="text-center mb-8">
              <a
                href="/senior-living-costs-cleveland"
                className="text-teal-600 hover:text-teal-700 font-semibold text-sm underline-offset-2 hover:underline"
              >
                2026 Cleveland senior living cost guide →
              </a>
            </p>

            {/* Trust Signals */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-slate-600 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-teal-500" />
                <span>100% Free Service</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-teal-500" />
                <span>Local {regionConfig.displayName} Advisors</span>
              </div>
              <div className="flex items-center gap-2">
                <Hospital className="h-4 w-4 text-teal-500" />
                <span>Near {cityData?.nearbyHospitals?.[0]?.split(' ').slice(0, 3).join(' ') || 'Major Hospitals'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: COMMUNITY LISTINGS (moved up -- value first, forms second) */}
      <section id="communities" className="py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          <CommunityListingFilters
            filters={listingFilters}
            onChange={setListingFilters}
            resultCount={filteredCommunities.length}
            totalCount={totalCommunities}
          />

          {filteredCommunities.length === 0 ? (
            <p className="text-center text-slate-600 py-8">
              No communities match these filters.{' '}
              <button type="button" className="text-teal-600 font-semibold underline" onClick={() => setListingFilters(DEFAULT_LISTING_FILTERS)}>
                Clear filters
              </button>
            </p>
          ) : (
            <>
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
                  <LocationCard key={community.id} community={community} regionSlug={regionSlug} />
                ))}
              </div>
            </div>
          )}

          {remainingCommunities.length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                More Communities in {cityName}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {remainingCommunities.map((community) => (
                  <LocationCard key={community.id} community={community} regionSlug={regionSlug} />
                ))}
              </div>
            </div>
          )}
            </>
          )}
        </div>
      </section>

      {filteredCommunities.length > 1 && (
        <CommunityComparisonTable
          communities={filteredCommunities}
          cityName={cityName}
          maxCommunities={6}
          regionSlug={regionSlug}
        />
      )}

      <PlacementConversionBand
        title={`Need help choosing in ${cityName}?`}
        description="Our Cleveland advisors compare pricing, availability, and fit — then help schedule tours. Free for families."
        phonePlacement="city_listings_mid"
        contactHref={`/contact?city=${citySlug}&intent=placement`}
        cityName={cityName}
        cityHref={`/${regionSlug}/${citySlug}`}
        secondaryHref="/blog/cost-of-assisted-living-ohio"
        secondaryLabel="2026 Ohio cost guide"
      />

      {/* SECTION 3: CARE TYPE NAVIGATION */}
      <CareTypeNav
        cityName={cityName}
        citySlug={citySlug}
        careTypeCounts={careTypeCounts}
      />

      {/* SECTION 4: MAP */}
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

      {/* SECTION 5: AFFORDABILITY CALCULATOR */}
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

      {/* SECTION 6: LEAD MAGNET (moved down -- value before forms) */}
      <EditorialPlacementLinks cityName={cityName} />

      <CityLeadMagnet 
        cityName={cityName} 
        citySlug={citySlug} 
        isHospitalDischarge={isHospitalDischarge}
      />

      {/* SECTION 7: LOCAL AUTHORITY CONTEXT */}
      <LocalAuthorityProse
        cityName={cityName}
        citySlug={citySlug}
        cityData={cityData || undefined}
        communityCount={totalCommunities}
        isHospitalDischarge={isHospitalDischarge}
      />

      {/* SECTION 8: FLAGSHIP DEEP-DIVE (advisor commentary, city pricing, landmarks) */}
      <CityAdvisorDeepDive citySlug={citySlug} cityName={cityName} />

      {/* SECTION 9: TESTIMONIALS */}
      <TestimonialSection
        title={`What ${regionConfig.displayName} Families Say About ${cityName} Senior Living`}
        subtitle="Real experiences from families who found senior care with our help"
        cityName={cityName}
        limit={3}
        className="bg-white border-t"
      />

      {/* SECTION 10: LOCAL RESOURCES */}
      {localResources && (
        <LocalSeniorResources cityName={cityName} resources={localResources} />
      )}

      {/* SECTION 10.5: NEIGHBORHOOD EVENTS */}
      <section className="py-12 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <NeighborhoodEvents 
              neighborhood={cityName}
              limit={3}
              showHeader={true}
            />
          </div>
        </div>
      </section>

      {/* SECTION 11: HELPFUL RESOURCES */}
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
                {regionConfig.displayName} Cost Guide
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

      {/* SECTION 12: FINAL CTA */}
      <section className="py-16 bg-gradient-to-r from-teal-600 to-teal-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Find Senior Care in {cityName}?
          </h2>
          <p className="text-lg text-teal-100 mb-8 max-w-2xl mx-auto">
            Our local advisors are standing by to help you compare options, schedule tours, and find the perfect community—at no cost to you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <PhoneLink
              placement="city_footer_cta"
              phoneTel={`tel:${phoneNumber.replace(/[^0-9+]/g, '')}`}
              className="inline-flex items-center justify-center gap-2 bg-white text-teal-700 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:bg-slate-50 transition-all min-h-[56px]"
            >
              <Phone className="h-5 w-5" />
              Call {phoneNumber}
            </PhoneLink>
            <Link
              href={`/contact?city=${encodeURIComponent(citySlug)}&intent=placement`}
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
      <SavedCommunitiesBar />

      <Footer />
    </main>
  );
}
