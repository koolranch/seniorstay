"use client";

import React from 'react';
import { MapPin, Heart, Shield, Users, Clock, Building2, Star, TreePine, Hospital } from 'lucide-react';
import { Community } from '@/data/facilities';
import { clevelandCitiesData } from '@/data/cleveland-cities';

interface WhyChooseSectionProps {
  community: Community;
  cityName: string;
}

/**
 * Get brand-specific benefits
 */
function getBrandBenefits(communityName: string): string[] {
  const nameLower = communityName.toLowerCase();
  
  if (nameLower.includes('bickford')) {
    return [
      'Part of Bickford Senior Living network with locations across the Midwest',
      'Boutique-style community with intimate, homelike atmosphere',
      'Chef-prepared meals served three times daily',
      'Specialized memory care programming'
    ];
  }
  
  if (nameLower.includes('sunrise')) {
    return [
      'Part of Sunrise Senior Living, a nationally recognized leader in senior care',
      'Award-winning Reminiscence memory care program',
      'Resident-centered care philosophy',
      'Extensive life enrichment activities calendar'
    ];
  }
  
  if (nameLower.includes('brookdale')) {
    return [
      'Part of Brookdale Senior Living, the nation\'s largest senior living provider',
      'Personalized care with dedicated wellness team',
      'Wide range of floor plan options',
      'Established track record of quality care'
    ];
  }
  
  // Default benefits for independent communities
  return [
    'Locally owned and operated with deep community roots',
    'Personalized attention in an intimate setting',
    'Dedicated staff who know residents by name',
    'Flexible care options to meet changing needs'
  ];
}

/**
 * Get location-based advantages
 */
function getLocationAdvantages(cityName: string, address?: string): string[] {
  const citySlug = cityName.toLowerCase().replace(/\s+/g, '-');
  const cityData = clevelandCitiesData[citySlug];
  
  const advantages: string[] = [];
  
  if (cityData) {
    // Add first 2-3 highlights from city data
    advantages.push(...cityData.highlights.slice(0, 3).map(h => `Near ${h}`));
    
    // Add hospital proximity
    if (cityData.nearbyHospitals.length > 0) {
      advantages.push(`Close to ${cityData.nearbyHospitals[0]}`);
    }
  } else {
    // Generic location advantages for cities without data
    advantages.push(
      'Convenient access to local healthcare facilities',
      'Near shopping, dining, and entertainment',
      'Easy highway access for family visits',
      'Quiet residential neighborhood setting'
    );
  }
  
  return advantages.slice(0, 4);
}

/**
 * Get care-type specific benefits
 */
function getCareTypeBenefits(careTypes: string[]): { icon: React.ReactNode; text: string }[] {
  const benefits: { icon: React.ReactNode; text: string }[] = [];
  const types = careTypes.map(t => t.toLowerCase());
  
  if (types.some(t => t.includes('memory care'))) {
    benefits.push(
      { icon: <Shield className="h-5 w-5 text-primary" />, text: 'Secure memory care neighborhood' },
      { icon: <Heart className="h-5 w-5 text-primary" />, text: 'Specialized dementia programming' }
    );
  }
  
  if (types.some(t => t.includes('assisted living'))) {
    benefits.push(
      { icon: <Users className="h-5 w-5 text-primary" />, text: 'Personal care assistance with daily activities' },
      { icon: <Clock className="h-5 w-5 text-primary" />, text: '24-hour trained care staff' }
    );
  }
  
  if (types.some(t => t.includes('independent'))) {
    benefits.push(
      { icon: <Building2 className="h-5 w-5 text-primary" />, text: 'Maintenance-free apartment living' },
      { icon: <Star className="h-5 w-5 text-primary" />, text: 'Full calendar of social activities' }
    );
  }
  
  // Add common benefits
  benefits.push(
    { icon: <Hospital className="h-5 w-5 text-primary" />, text: 'Medication management and health monitoring' }
  );
  
  return benefits.slice(0, 5);
}

export default function WhyChooseSection({ community, cityName }: WhyChooseSectionProps) {
  const brandBenefits = getBrandBenefits(community.name);
  const locationAdvantages = getLocationAdvantages(cityName, community.address);
  const careTypeBenefits = getCareTypeBenefits(community.careTypes);
  
  return (
    <section className="bg-gradient-to-b from-primary/5 to-white py-10 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Why Choose {community.name}?
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand/Community Benefits */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="bg-primary/10 p-2 rounded-lg mr-3">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Community Highlights</h3>
            </div>
            <ul className="space-y-3">
              {brandBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  <span className="text-gray-700 text-sm">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Location Advantages */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-2 rounded-lg mr-3">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg">{cityName} Location Benefits</h3>
            </div>
            <ul className="space-y-3">
              {locationAdvantages.map((advantage, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-600 mr-2 mt-1">•</span>
                  <span className="text-gray-700 text-sm">{advantage}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Care Services */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 md:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="bg-orange-100 p-2 rounded-lg mr-3">
                <Heart className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-lg">Care & Services</h3>
            </div>
            <ul className="space-y-3">
              {careTypeBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 mr-2 mt-0.5">{benefit.icon}</span>
                  <span className="text-gray-700 text-sm">{benefit.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* SEO Content Block */}
        <div className="mt-8 bg-gray-50 rounded-xl p-6">
          <p className="text-gray-600 text-sm leading-relaxed">
            {community.name} in {cityName}, Ohio offers a supportive environment where seniors can 
            thrive while receiving the care they need. Whether you're exploring{' '}
            {community.careTypes.join(', ').toLowerCase()} options, our experienced team is here to 
            help you find the right fit. Contact us today to schedule a tour and discover why 
            families throughout Greater Cleveland choose {community.name.split(' ')[0]} for their 
            loved ones' care.
          </p>
        </div>
      </div>
    </section>
  );
}

