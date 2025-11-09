"use client";

import React from 'react';
import { Community } from '@/data/facilities';
import { fetchCommunityById } from '@/lib/fetch-community';
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
      const data = await fetchCommunityById(id);
      setCommunity(data);
      setLoading(false);
    }
    loadCommunity();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-600">Loading...</div>
    </div>;
  }

  if (!community) {
    notFound();
  }

  // Verify the slug matches the community name
  const expectedSlug = community.slug || community.name.toLowerCase().replace(/\s+/g, '-');
  if (slug !== expectedSlug) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CommunityHeader community={community} />
      <div className="container mx-auto px-4 py-8">
        <CommunityOverview community={community} />
        
        {/* CMS Official Data Sections */}
        <CommunityQualityMetrics community={community} />
        <CommunityInsurance community={community} />
        
        {/* Community Features */}
        <CommunityAmenities community={community} />
        <CommunityCareTypes community={community} />
        <CommunityStaff community={community} />
        <CommunityTestimonials community={community} />
        <CommunityContact community={community} />
      </div>
      <SimilarCommunities community={community} />
      <SchemaOrg community={community} />
      <StickyTourButton />
      <ExitIntentPopup cityName={community.location.split(',')[0].trim()} />
    </div>
  );
}
