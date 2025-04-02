"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin } from 'lucide-react';
import Header from '@/components/header/Header';
import CategoryTabs from '@/components/category/CategoryTabs';
import Footer from '@/components/footer/Footer';
import LocationCard from '@/components/property/LocationCard';
import ComparisonFloatingButton from '@/components/comparison/ComparisonFloatingButton';
import SchemaOrg from './SchemaOrg';
import MapComponent from '@/components/map/GoogleMap';
import CommunityMapFallback from '@/components/map/CommunityMapFallback'; // Updated import
import { Community } from '@/data/facilities';

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
      {/* Add Schema.org structured data for SEO */}
      <SchemaOrg
        cityName={cityName}
        stateAbbr={stateAbbr}
        communities={communities}
      />

      <Header />
      <CategoryTabs />

      {/* City Header and SEO Content */}
      <div className="bg-gray-50 py-8 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <Link href="/" className="inline-flex items-center text-primary hover:underline mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to all locations
          </Link>

          <h1 className="text-3xl font-bold mb-2">Senior Living in {cityName}, {stateAbbr}</h1>

          <p className="text-gray-600 mb-4">
            Discover {totalCommunities} senior living {totalCommunities === 1 ? 'community' : 'communities'} in {cityName}, {stateAbbr}.
            We offer comprehensive information to help you find the perfect senior care option.
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
      </div>

      {/* Map Section */}
      <section className="bg-gray-50 py-8 border-t">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-semibold mb-6">Communities in {cityName}, {stateAbbr}</h2>

          {/* The MapComponent will handle loading states internally */}
          <MapComponent
            communities={communities}
            height="450px"
            center={mapCenter || undefined}
            zoom={12}
          />
        </div>
      </section>

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

      {/* FAQ Section for SEO */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions About Senior Living in {cityName}</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">What types of senior living are available in {cityName}?</h3>
              <p className="text-gray-700">
                {cityName} offers {Object.keys(careTypeCounts).join(', ').replace(/, ([^,]*)$/, ' and $1')}.
                Each type provides different levels of care and amenities to meet various needs and preferences.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">How much does senior living cost in {cityName}?</h3>
              <p className="text-gray-700">
                The cost of senior living in {cityName} varies based on the level of care, amenities, and
                location. Independent living is typically less expensive than assisted living or memory care.
                Use our "Get Pricing" button on any community to receive detailed cost information.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">How do I choose the right senior living community in {cityName}?</h3>
              <p className="text-gray-700">
                Consider your care needs, budget, desired location within {cityName}, and preferred amenities.
                We recommend touring multiple communities, using our comparison tool to evaluate options side by side,
                and asking about staff-to-resident ratios and available activities.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Floating Button */}
      <ComparisonFloatingButton />

      <div className="mt-auto">
        <Footer />
      </div>
    </main>
  );
}
