"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import { Community } from '@/data/facilities';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { generateMatchReason } from '@/utils/assessmentScoring';
import { AssessmentAnswers } from '@/utils/assessmentScoring';
import { trackResultsCommunityClicked } from '@/components/analytics/AssessmentAnalytics';
import { getCommunityImage } from '@/lib/communityImages';
import CommunityImage from '@/components/ui/CommunityImage';

interface CommunityMatchProps {
  community: Community;
  recommendation: 'memory-care' | 'assisted-living' | 'both';
  answers: AssessmentAnswers;
  index: number;
}

export default function CommunityMatch({ 
  community, 
  recommendation, 
  answers,
  index 
}: CommunityMatchProps) {
  const matchReason = generateMatchReason(community, answers, recommendation);
  
  // Generate slug for URL
  const slug = community.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const handleClick = () => {
    trackResultsCommunityClicked(community.name, index + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-200"
    >
      {/* Community Image */}
      <div className="relative h-48 sm:h-56 bg-gray-200">
        <CommunityImage
          src={getCommunityImage(community.images?.[0], community.id)}
          alt={community.name}
          fill
          className="object-cover"
        />
        
        {/* Match badge */}
        <div className="absolute top-3 right-3">
          <Badge className="bg-[#ff5a5f] text-white px-3 py-1">
            Top Match #{index + 1}
          </Badge>
        </div>
      </div>

      {/* Community Details */}
      <div className="p-5">
        {/* Name and Location */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-[#1e3a5f] mb-2">
            {community.name}
          </h3>
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            {community.location}
          </div>
        </div>

        {/* Care Types */}
        <div className="flex flex-wrap gap-2 mb-3">
          {community.careTypes.map((type) => (
            <Badge
              key={type}
              variant="outline"
              className="border-[#1e3a5f] text-[#1e3a5f]"
            >
              {type}
            </Badge>
          ))}
        </div>

        {/* Key Amenities */}
        {community.amenities && community.amenities.length > 0 && (
          <div className="mb-3">
            <p className="text-sm text-gray-600">
              {community.amenities.slice(0, 3).join(' • ')}
            </p>
          </div>
        )}

        {/* Match Reason */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-green-800">
            <strong>Why this matches:</strong> {matchReason}
          </p>
        </div>

        {/* View Details Button - SEO Fix: Use canonical region-based URL */}
        <Link href={`/cleveland/community/${community.id}/${slug}`} onClick={handleClick}>
          <Button
            className="w-full bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white"
          >
            View Details
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

