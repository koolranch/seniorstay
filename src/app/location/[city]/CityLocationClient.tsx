"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, DollarSign, MessageSquare, Hospital, Star } from 'lucide-react';
import Header from '@/components/header/Header';
import CategoryTabs from '@/components/category/CategoryTabs';
import Footer from '@/components/footer/Footer';
import LocationCard from '@/components/property/LocationCard';
import ComparisonFloatingButton from '@/components/comparison/ComparisonFloatingButton';
import PricingGuideForm from '@/components/forms/PricingGuideForm';
import SchemaOrg from './SchemaOrg';
import MapComponent from '@/components/map/GoogleMap';
import CommunityMapFallback from '@/components/map/CommunityMapFallback';
import { Community } from '@/data/facilities';
import { clevelandCitiesData } from '@/data/cleveland-cities';
import { getLocalResourcesForCity } from '@/data/local-resources';
import LocalSeniorResources from '@/components/location/LocalSeniorResources';
import TestimonialSection from '@/components/testimonials/TestimonialSection';
import ExitIntentPopup from '@/components/forms/ExitIntentPopup';
import CommunitySpotlight from '@/components/location/CommunitySpotlight';
import CommunityComparisonTable from '@/components/location/CommunityComparisonTable';
import QuickFacts from '@/components/location/QuickFacts';
import CitySpecificContent from '@/components/location/CitySpecificContent';
import CityAEOBlocks from '@/components/location/CityAEOBlocks';
import SoloAgerSection from '@/components/location/SoloAgerSection';
import ClinicalTrustBarCity from '@/components/location/ClinicalTrustBarCity';
import AffordabilityCalculator from '@/components/AffordabilityCalculator';
import StickyCalculatorCTA from '@/components/StickyCalculatorCTA';

interface CityLocationClientProps {
  cityName: string;
  stateAbbr: string;
  communities: Community[];
}

export default function CityLocationClient({ cityName, stateAbbr, communities }: CityLocationClientProps) {
  const [totalCommunities, setTotalCommunities] = useState(0);
  const [careTypeCounts, setCareTypeCounts] = useState<Record<string, number>>({});
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Get city-specific data
  const citySlug = cityName.toLowerCase().replace(/\s+/g, '-');
  const cityData = clevelandCitiesData[citySlug];
  const localResources = getLocalResourcesForCity(citySlug);

  // Get spotlight communities (top assisted living and memory care communities)
  const spotlightCommunities = useMemo(() => {
    return communities
      .filter(c => 
        c.careTypes.some(t => 
          t.toLowerCase().includes('assisted living') || 
          t.toLowerCase().includes('memory care')
        )
      )
      .slice(0, 3); // Top 3 communities for spotlight
  }, [communities]);

  useEffect(() => {
    setIsMounted(true);

    // Set total communities count
    setTotalCommunities(communities.length);

    // Set map center to the first community with coordinates, or default to city center
    if (communities.length > 0) {
      const communitiesWithCoords = communities.filter(c => c.coordinates);
      if (communitiesWithCoords.length > 0) {
        setMapCenter({
          lat: communitiesWithCoords[0].coordinates!.lat,
          lng: communitiesWithCoords[0].coordinates!.lng
        });
      }
    }

    // Count communities by care type
    const counts: Record<string, number> = {};
    communities.forEach(community => {
      community.careTypes.forEach(type => {
        counts[type] = (counts[type] || 0) + 1;
      });
    });
    setCareTypeCounts(counts);
  }, [communities]);

  return (
    <main className="flex min-h-screen flex-col">
      {/* Add Schema.org structured data for SEO - includes FAQPage for AEO */}
      <SchemaOrg
        cityName={cityName}
        stateAbbr={stateAbbr}
        communities={communities}
        cityData={cityData}
      />

      <Header />
      <CategoryTabs communities={communities} />

      {/* Dynamic Clinical Trust Bar - Shows nearest hospital for this city */}
      <ClinicalTrustBarCity cityName={cityName} citySlug={citySlug} />

      {/* Quick Facts AEO Block - Featured Snippet Target */}
      <QuickFacts
        cityName={cityName}
        stateAbbr={stateAbbr}
        communities={communities}
        cityData={cityData}
      />

      {/* City-Specific Long-Tail Keyword Content (Westlake: Hospital Discharge, Beachwood: Memory Care) */}
      <CitySpecificContent citySlug={citySlug} cityName={cityName} />

      {/* City Header with Lead Capture */}
      <div className="bg-gray-50 py-8 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <Link href="/greater-cleveland" className="inline-flex items-center text-primary hover:underline mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Greater Cleveland
          </Link>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">Senior Living in {cityName}, {stateAbbr}</h1>

              <p className="text-gray-600 mb-4">
                {cityData?.description || `Discover ${totalCommunities} senior living ${totalCommunities === 1 ? 'community' : 'communities'} in ${cityName}, ${stateAbbr}. We offer comprehensive information to help you find the perfect senior care option.`}
              </p>

              {Object.keys(careTypeCounts).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {Object.entries(careTypeCounts).map(([type, count]) => (
                    <span
                      key={type}
                      className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                    >
                      {type}: {count} {count === 1 ? 'community' : 'communities'}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Lead Capture CTA */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 md:w-80">
              <h3 className="font-semibold mb-2">
                <DollarSign className="inline h-5 w-5 text-primary mr-1" />
                Get {cityName} Pricing Guide
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Compare costs across all {totalCommunities} communities in {cityName}
              </p>
              <PricingGuideForm 
                cityName={cityName}
                buttonText={`Get Free ${cityName} Guide`}
                buttonClassName="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* City Highlights Section */}
      {cityData && (
        <div className="bg-white py-8 border-b">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-6">Why Choose {cityName} for Senior Living?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <Star className="h-5 w-5 text-primary mr-2" />
                  Community Highlights
                </h3>
                <ul className="space-y-2">
                  {cityData.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-gray-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <Hospital className="h-5 w-5 text-primary mr-2" />
                  Nearby Healthcare
                </h3>
                <ul className="space-y-2">
                  {cityData.nearbyHospitals.map((hospital, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-gray-700">{hospital}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Average Pricing Section */}
      {cityData?.averageCost && (
        <div className="bg-primary/5 py-8 border-b">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-6">Average Senior Living Costs in {cityName}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Independent Living</h3>
                <p className="text-3xl font-bold text-primary mb-2">
                  {cityData.averageCost.independentLiving}
                </p>
                <p className="text-sm text-gray-600">per month</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Assisted Living</h3>
                <p className="text-3xl font-bold text-primary mb-2">
                  {cityData.averageCost.assistedLiving}
                </p>
                <p className="text-sm text-gray-600">per month</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Memory Care</h3>
                <p className="text-3xl font-bold text-primary mb-2">
                  {cityData.averageCost.memoryCare}
                </p>
                <p className="text-sm text-gray-600">per month</p>
              </div>
            </div>
            
            <div className="text-center mt-6">
              <p className="text-gray-600 mb-4">
                *Prices vary by community, room type, and care needs
              </p>
              <PricingGuideForm 
                cityName={cityName}
                buttonText="Get Detailed Pricing Comparison"
              />
            </div>
          </div>
        </div>
      )}

      {/* Affordability Calculator - City-Specific Defaults */}
      <div id="affordability-calculator">
        <AffordabilityCalculator defaultCity={citySlug} />
      </div>

      {/* Map Section */}
      <section className="bg-gray-50 py-8 border-t">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-semibold mb-6">Communities in {cityName}, {stateAbbr}</h2>

          <MapComponent
            communities={communities}
            height="450px"
            center={mapCenter || undefined}
            zoom={12}
          />
        </div>
      </section>

      {/* Communities Grid */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold mb-6">
          All Senior Living Communities in {cityName}
        </h2>

        {communities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {communities.map((community) => (
              <LocationCard key={community.id} community={community} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No communities found in {cityName}.</p>
            <Link href="/" className="text-primary hover:underline mt-2 inline-block">
              View all locations
            </Link>
          </div>
        )}
      </div>

      {/* Featured Community Spotlights - SEO-rich content for each community */}
      {spotlightCommunities.length > 0 && (
        <section className="bg-gray-50 py-10 border-t border-gray-200">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-2">
              Featured {cityName} Senior Living Communities
            </h2>
            <p className="text-gray-600 mb-8">
              Detailed information about assisted living and memory care options in {cityName}
            </p>
            <div className="space-y-6">
              {spotlightCommunities.map((community, index) => (
                <CommunitySpotlight
                  key={community.id}
                  community={community}
                  cityName={cityName}
                  position={index + 1}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Community Comparison Table */}
      {communities.length > 1 && (
        <CommunityComparisonTable
          communities={communities}
          cityName={cityName}
          maxCommunities={6}
        />
      )}

      {/* Testimonials Section with Review Schema */}
      <TestimonialSection
        title={`What Cleveland Families Say About ${cityName} Senior Living`}
        subtitle="Real experiences from families who found senior care with our help"
        cityName={cityName}
        limit={3}
        className="bg-gray-50 border-t"
      />

      {/* Local Senior Resources Section */}
      {localResources && (
        <LocalSeniorResources cityName={cityName} resources={localResources} />
      )}

      {/* SEO Content Section */}
      <div className="container mx-auto px-4 py-12 border-t border-gray-200">
        <h2 className="text-2xl font-semibold mb-4">About Senior Living in {cityName}</h2>

        <div className="prose max-w-none text-gray-700">
          <p className="mb-4">
            {cityName} offers a variety of senior living options designed to meet the unique needs of older adults.
            Whether you're looking for {Object.keys(careTypeCounts).join(', ').replace(/, ([^,]*)$/, ' or $1')},
            our comprehensive listings help you find the right community for yourself or your loved one.
          </p>

          <p className="mb-4">
            Senior living communities in {cityName} provide a range of amenities including social activities,
            dining services, transportation, and health care support. Many communities offer beautiful surroundings
            with convenient access to shopping, dining, healthcare facilities, and cultural attractions.
          </p>

          <h3 className="text-xl font-semibold my-4">Finding the Right Senior Living Option in {cityName}</h3>

          <p className="mb-4">
            When choosing a senior living community in {cityName}, consider factors such as location,
            care levels, amenities, activities, and cost. Our detailed community profiles provide information
            on all these aspects to help you make an informed decision.
          </p>

          <p>
            Use our comparison tool to evaluate multiple options side by side, schedule tours,
            and request pricing information directly through our platform. Our goal is to make
            your search for senior living in {cityName} as seamless as possible.
          </p>
        </div>
      </div>

      {/* Solo Ager Section - Rightsizing & Autonomy for proactive planners */}
      <SoloAgerSection
        cityName={cityName}
        citySlug={citySlug}
        cityData={cityData}
      />

      {/* AEO FAQ Blocks with JSON-LD Schema for AI Rich Results */}
      <CityAEOBlocks
        cityName={cityName}
        citySlug={citySlug}
        communityCount={totalCommunities}
        cityData={cityData}
        memoryCareCount={careTypeCounts['Memory Care'] || 0}
        assistedLivingCount={careTypeCounts['Assisted Living'] || 0}
      />

      {/* Comparison Floating Button */}
      <ComparisonFloatingButton />

      {/* Exit Intent Popup */}
      <ExitIntentPopup cityName={cityName} />

      {/* Sticky Calculator CTA (Mobile Only) */}
      <StickyCalculatorCTA cityName={cityName} />

      <div className="mt-auto">
        <Footer />
      </div>
    </main>
  );
}
