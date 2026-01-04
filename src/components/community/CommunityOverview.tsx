"use client";

import * as React from 'react';
import { Community } from '@/data/facilities';

interface CommunityOverviewProps {
  community: Community;
}

/**
 * Generate SEO-friendly description when none exists
 * Creates unique content based on community name, location, and care types
 */
function generateDescription(community: Community): string {
  const cityName = community.location.split(',')[0].trim();
  const careTypesText = community.careTypes.length > 0 
    ? community.careTypes.join(' and ').toLowerCase()
    : 'senior living';
  
  // Check for known brands to provide more specific content
  const nameLower = community.name.toLowerCase();
  
  if (nameLower.includes('bickford')) {
    return `${community.name} is a boutique ${careTypesText} community located in ${cityName}, Ohio. As part of the Bickford Senior Living family, this community offers personalized care in an intimate, homelike setting. Residents enjoy chef-prepared meals, 24-hour licensed nursing staff, engaging life enrichment activities, and compassionate care tailored to individual needs. The community specializes in helping residents maintain their independence while receiving the support they need to thrive.`;
  }
  
  if (nameLower.includes('sunrise')) {
    return `${community.name} is a premier ${careTypesText} community in ${cityName}, Ohio, part of the nationally recognized Sunrise Senior Living network. The community combines elegant accommodations with personalized care services designed to help residents live life on their own terms. Residents benefit from restaurant-style dining with diverse menu options, an extensive calendar of social and wellness activities, and the renowned Sunrise approach to care that prioritizes individual needs and preferences.`;
  }
  
  if (nameLower.includes('brookdale')) {
    return `${community.name} in ${cityName}, Ohio is part of Brookdale Senior Living, the nation's largest senior living provider. This community offers comprehensive ${careTypesText} services with a focus on enriching residents' lives through personalized care, engaging programs, and a warm, welcoming environment. The experienced team works closely with residents and families to create individualized care plans that promote well-being and independence.`;
  }
  
  // Check care types for specific content
  if (community.careTypes.some(t => t.toLowerCase().includes('memory care'))) {
    return `${community.name} provides specialized ${careTypesText} services in ${cityName}, Ohio. The community offers a secure, supportive environment designed specifically for seniors living with Alzheimer's disease, dementia, or other memory-related conditions. Trained staff provide 24-hour care and supervision, while purposeful programming helps residents engage meaningfully throughout the day. Families appreciate the peace of mind that comes from knowing their loved ones are safe, comfortable, and cared for with dignity.`;
  }
  
  if (community.careTypes.some(t => t.toLowerCase().includes('assisted living'))) {
    return `${community.name} offers quality ${careTypesText} services in ${cityName}, Ohio. The community provides a comfortable, supportive environment where residents receive personalized assistance with daily activities while maintaining their independence and dignity. Services typically include medication management, personal care assistance, nutritious meals, housekeeping, and an engaging activities calendar. The dedicated staff is available 24/7 to ensure residents' safety and well-being.`;
  }
  
  // Default description
  return `${community.name} is a senior living community located in ${cityName}, Ohio, offering ${careTypesText} services. The community is dedicated to providing quality care in a comfortable, homelike environment. Residents benefit from personalized services, engaging activities, and a supportive staff committed to promoting independence, dignity, and overall well-being. Contact us to learn more about available services and schedule a tour.`;
}

export default function CommunityOverview({ community }: CommunityOverviewProps) {
  const cityName = community.location.split(',')[0].trim();
  const description = community.description || generateDescription(community);
  
  return (
    <div className="bg-white py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          About {community.name}
        </h2>
        <div className="prose max-w-none">
          <p className="text-gray-600 leading-relaxed">
            {description}
          </p>
          
          {/* Additional SEO paragraph for communities without descriptions */}
          {!community.description && (
            <p className="text-gray-600 leading-relaxed mt-4">
              Located in {cityName}, this community serves families throughout Greater Cleveland 
              and the surrounding areas. Whether you're seeking care for yourself or a loved one, 
              our team is here to help you explore your options and find the right fit. 
              Request pricing information or schedule a tour to learn more about life at{' '}
              {community.name}.
            </p>
          )}
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Location
            </h3>
            <p className="text-gray-600">
              {community.address || `${community.location}`}
            </p>
            {community.address && (
              <p className="text-sm text-gray-500 mt-1">
                {community.location}
              </p>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Get Information
            </h3>
            <p className="text-gray-600">
              Email:{' '}
              <a href="mailto:info@guideforseniors.com" className="text-primary hover:underline">
                info@guideforseniors.com
              </a>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Use the buttons below to request pricing or schedule a tour.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 