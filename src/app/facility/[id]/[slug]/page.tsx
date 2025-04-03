"use client";

import React from 'react';
import { communityData } from '@/data/facilities';
import { notFound } from 'next/navigation';
import CommunityHeader from '@/components/community/CommunityHeader';
import CommunityOverview from '@/components/community/CommunityOverview';
import CommunityAmenities from '@/components/community/CommunityAmenities';
import CommunityCareTypes from '@/components/community/CommunityCareTypes';
import CommunityStaff from '@/components/community/CommunityStaff';
import CommunityTestimonials from '@/components/community/CommunityTestimonials';
import CommunityContact from '@/components/community/CommunityContact';
import SchemaOrg from './SchemaOrg';

interface CommunityPageProps {
  params: {
    id: string;
    slug: string;
  };
}

export default function CommunityPage({ params }: CommunityPageProps) {
  const { id, slug } = params;

  // Find the community by ID
  const community = communityData.find(
    community => community.id === id
  );

  if (!community) {
    notFound();
  }

  // Verify the slug matches the community name
  const expectedSlug = community.name.toLowerCase().replace(/\s+/g, '-');
  if (slug !== expectedSlug) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CommunityHeader community={community} />
      <div className="container mx-auto px-4 py-8">
        <CommunityOverview community={community} />
        <CommunityAmenities community={community} />
        <CommunityCareTypes community={community} />
        <CommunityStaff community={community} />
        <CommunityTestimonials community={community} />
        <CommunityContact community={community} />
      </div>
      <SchemaOrg community={community} />
    </div>
  );
}
