"use client";

import React from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight, Building2, Clock, Shield, Heart } from 'lucide-react';
import { Community } from '@/data/facilities';
import { Button } from '@/components/ui/button';
import CommunityImage from '@/components/ui/CommunityImage';
import { getCommunityImage } from '@/lib/communityImages';

interface CommunitySpotlightProps {
  community: Community;
  cityName: string;
  position?: number;
}

/**
 * Generate SEO-rich description if community has no description
 */
function generateDescription(community: Community, cityName: string): string {
  const careTypesText = community.careTypes.join(' and ').toLowerCase();
  const name = community.name;
  
  // Check if it's a known brand
  const brandDescriptions: Record<string, string> = {
    'bickford': `${name} is part of the Bickford Senior Living family, known for boutique-style communities offering personalized ${careTypesText} services. Residents enjoy chef-prepared meals, 24-hour licensed nursing staff, and engaging life enrichment activities in an intimate, homelike setting.`,
    'sunrise': `${name} is part of the nationally recognized Sunrise Senior Living network, offering premier ${careTypesText} with a focus on personalized service and resident independence. The community features elegant accommodations, diverse dining options, and an extensive activities calendar.`,
    'brookdale': `${name} is part of Brookdale Senior Living, the nation's largest senior living provider. This community offers comprehensive ${careTypesText} services with a focus on enriching residents' lives through personalized care and engaging programs.`,
  };
  
  const nameLower = community.name.toLowerCase();
  for (const [brand, desc] of Object.entries(brandDescriptions)) {
    if (nameLower.includes(brand)) {
      return desc;
    }
  }
  
  // Generic but SEO-friendly description
  return `${name} provides quality ${careTypesText} services in ${cityName}, Ohio. The community offers compassionate care in a comfortable environment, with dedicated staff focused on meeting each resident's unique needs and preferences.`;
}

/**
 * Get key features based on care types
 */
function getKeyFeatures(community: Community): string[] {
  const features: string[] = [];
  const careTypes = community.careTypes.map(t => t.toLowerCase());
  
  // Common features
  features.push('24-hour trained staff');
  features.push('Personalized care plans');
  
  if (careTypes.some(t => t.includes('memory care'))) {
    features.push('Secure memory care neighborhood');
    features.push('Specialized dementia programming');
  }
  
  if (careTypes.some(t => t.includes('assisted living'))) {
    features.push('Medication management');
    features.push('Daily living assistance');
  }
  
  if (careTypes.some(t => t.includes('independent'))) {
    features.push('Maintenance-free living');
    features.push('Social activities calendar');
  }
  
  features.push('Restaurant-style dining');
  features.push('Transportation services');
  
  return features.slice(0, 6);
}

export default function CommunitySpotlight({ 
  community, 
  cityName,
  position = 1 
}: CommunitySpotlightProps) {
  const communitySlug = community.name.toLowerCase().replace(/\s+/g, '-');
  const communityUrl = `/community/${community.id}/${communitySlug}`;
  
  const description = community.description || generateDescription(community, cityName);
  const features = getKeyFeatures(community);
  
  // Format care types for SEO heading
  const careTypesText = community.careTypes.length > 0 
    ? community.careTypes.join(' & ') 
    : 'Senior Living';

  return (
    <section className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="grid md:grid-cols-3 gap-0">
        {/* Image Section */}
        <div className="relative h-64 md:h-auto md:min-h-[300px]">
          <Link href={communityUrl}>
            <CommunityImage
              src={getCommunityImage(community.images?.[0], community.id, community.name)}
              alt={`${community.name} - ${careTypesText} in ${cityName}, OH`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </Link>
          {community.careTypes.includes('Memory Care') && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Memory Care Available
            </div>
          )}
        </div>
        
        {/* Content Section */}
        <div className="md:col-span-2 p-6">
          {/* Header */}
          <div className="mb-4">
            <div className="text-xs text-primary font-medium mb-1">
              Featured Community #{position}
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              <Link href={communityUrl} className="hover:text-primary transition-colors">
                {community.name}: {careTypesText}
              </Link>
            </h2>
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="h-4 w-4 mr-1 text-primary" />
              <span>{community.address || community.location}</span>
            </div>
          </div>
          
          {/* Care Type Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {community.careTypes.map((type, index) => (
              <span
                key={index}
                className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
              >
                {type}
              </span>
            ))}
          </div>
          
          {/* Description */}
          <p className="text-gray-700 mb-4 line-clamp-3">
            {description}
          </p>
          
          {/* Key Features Grid */}
          <div className="grid grid-cols-2 gap-2 mb-5">
            {features.slice(0, 4).map((feature, index) => (
              <div key={index} className="flex items-center text-sm text-gray-600">
                <Shield className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3">
            <Link href={communityUrl}>
              <Button variant="default" size="sm">
                View Details
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
            <Link href={`${communityUrl}#contact`}>
              <Button variant="outline" size="sm" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                <Heart className="h-4 w-4 mr-1" />
                Schedule Tour
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

