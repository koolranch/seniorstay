"use client";

import React, { useState, useMemo } from 'react';
import { Community, communityData } from '@/data/facilities';
import { getNearbyCommunities } from '@/utils/distance';
import { getZipForCommunity } from '@/utils/zipCodeParser';
import ZipSearchWidget from './ZipSearchWidget';
import NearbyCommunitiesResults from './NearbyCommunitiesResults';
import TourBookingOverlay from './TourBookingOverlay';
import TourConfirmationScreen from './TourConfirmationScreen';

export default function ZipTourScheduler() {
  const [searchedZip, setSearchedZip] = useState<string>('');
  const [nearbyResults, setNearbyResults] = useState<(Community & { distance: number })[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingCommunity, setBookingCommunity] = useState<Community | null>(null);

  // Enrich communities with zips (memoized)
  const communitiesWithZips = useMemo(() => {
    return communityData.map(community => ({
      ...community,
      zip: community.zip || getZipForCommunity(community),
    }));
  }, []);

  // Filter to only AL/MC communities
  const qualityCommunities = useMemo(() => {
    return communitiesWithZips.filter(c => {
      const isAssistedOrMemoryCare = c.careTypes.some(type => 
        type.toLowerCase().includes('assisted living') || 
        type.toLowerCase().includes('memory care')
      );
      
      const isOnlySkilledNursing = c.careTypes.every(type => 
        type.toLowerCase().includes('skilled nursing')
      );
      
      return isAssistedOrMemoryCare && !isOnlySkilledNursing;
    });
  }, [communitiesWithZips]);

  const handleZipSearch = (zip: string) => {
    setSearching(true);
    setSearchedZip(zip);

    // Simulate brief loading for UX (actual calculation is instant)
    setTimeout(() => {
      const nearby = getNearbyCommunities(qualityCommunities, zip, 20, 5);
      setNearbyResults(nearby);
      setSearching(false);
    }, 500);
  };

  const handleScheduleTour = (community: Community) => {
    setBookingCommunity(community);
    setShowBooking(true);
  };

  const handleGetPricing = (community: Community) => {
    // Use existing pricing dialog functionality
    // This can be connected to your existing pricing form
    console.log('Get pricing for:', community.name);
    // For now, could open the existing dialog or create similar overlay
  };

  const handleBookingSuccess = () => {
    setShowBooking(false);
    setShowConfirmation(true);
  };

  const handleScheduleAnother = () => {
    setShowConfirmation(false);
    setShowBooking(false);
    setBookingCommunity(null);
    // Keep search results visible
  };

  return (
    <div className="bg-white py-16 border-y border-gray-200">
      <div className="container mx-auto px-4">
        {/* Zip Search Widget */}
        <ZipSearchWidget onSearch={handleZipSearch} loading={searching} />

        {/* Results */}
        {searchedZip && !searching && (
          <div className="mt-12">
            <NearbyCommunitiesResults
              communities={nearbyResults}
              userZip={searchedZip}
              onScheduleTour={handleScheduleTour}
              onGetPricing={handleGetPricing}
            />
          </div>
        )}

        {/* Tour Booking Overlay */}
        {bookingCommunity && (
          <>
            <TourBookingOverlay
              community={bookingCommunity}
              userZip={searchedZip}
              distance={nearbyResults.find(c => c.id === bookingCommunity.id)?.distance}
              isOpen={showBooking}
              onClose={() => setShowBooking(false)}
              onSuccess={handleBookingSuccess}
            />

            <TourConfirmationScreen
              community={bookingCommunity}
              isOpen={showConfirmation}
              onClose={() => {
                setShowConfirmation(false);
                setBookingCommunity(null);
              }}
              onScheduleAnother={handleScheduleAnother}
            />
          </>
        )}
      </div>
    </div>
  );
}

