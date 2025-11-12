"use client";

import React from 'react';
import { Community } from '@/data/facilities';
import { fetchCommunityById, fetchCommunityBySlug } from '@/lib/fetch-community';
import { notFound } from 'next/navigation';
import CommunityHeader from '@/components/community/CommunityHeader';
import CommunityOverview from '@/components/community/CommunityOverview';
import CommunityQualityMetrics from '@/components/community/CommunityQualityMetrics';
import CommunityInsurance from '@/components/community/CommunityInsurance';
import CommunityAmenities from '@/components/community/CommunityAmenities';
import CommunityCareTypes from '@/components/community/CommunityCareTypes';
import CommunityStaff from '@/components/community/CommunityStaff';
import CommunityTestimonials from '@/components/community/CommunityTestimonials';
import CommunityContact from '@/components/community/CommunityContact';
import SimilarCommunities from '@/components/community/SimilarCommunities';
import StickyTourButton from '@/components/tour/StickyTourButton';
import ExitIntentPopup from '@/components/forms/ExitIntentPopup';
import { SchemaOrg } from './SchemaOrg';

export default function CommunityPage({ params }: { params: { id: string; slug: string } }) {
  const { id, slug } = params;
  const [community, setCommunity] = React.useState<Community | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadCommunity() {
      // Try by ID first (for UUID links)
      let data = await fetchCommunityById(id);
      
      // If not found by ID, try by slug (for old static data links)
      if (!data) {
        console.log(`ID not found, trying slug: ${slug}`);
        data = await fetchCommunityBySlug(slug);
      }
      
      setCommunity(data);
      setLoading(false);
    }
    loadCommunity();
  }, [id, slug]);

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-600">Loading...</div>
    </div>;
  }

  if (!community) {
    notFound();
  }

  // Note: We don't validate slug because links might use various slug formats
  // The ID is sufficient to ensure we're loading the correct community

  // Check if this is a skilled nursing-only facility
  const isOnlySkilledNursing = community.careTypes.every(type => 
    type.toLowerCase().includes('skilled nursing')
  ) && !community.careTypes.some(type =>
    type.toLowerCase().includes('assisted living') ||
    type.toLowerCase().includes('memory care')
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <CommunityHeader community={community} isOnlySkilledNursing={isOnlySkilledNursing} />
      <div className="container mx-auto px-4 py-8">
        {isOnlySkilledNursing && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              <strong>Note:</strong> Guide for Seniors specializes in assisted living and memory care communities. 
              For information about this skilled nursing facility, please contact them directly.
            </p>
          </div>
        )}
        <CommunityOverview community={community} />
        
        {/* CMS Official Data Sections */}
        <CommunityQualityMetrics community={community} />
        <CommunityInsurance community={community} />
        
        {/* Community Features */}
        <CommunityAmenities community={community} />
        <CommunityCareTypes community={community} />
        <CommunityStaff community={community} />
        <CommunityTestimonials community={community} />
        {!isOnlySkilledNursing && <CommunityContact community={community} />}
      </div>
      <SimilarCommunities community={community} />
      <SchemaOrg community={community} />
      {!isOnlySkilledNursing && <StickyTourButton />}
      {!isOnlySkilledNursing && <ExitIntentPopup cityName={community.location.split(',')[0].trim()} />}
    </div>
  );
}
