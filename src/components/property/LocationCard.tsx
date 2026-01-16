"use client";

import React, { useState, useId } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, MapPin, Phone, Star, Clock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useComparison } from '@/context/ComparisonContext';
import { Community } from '@/data/facilities';
import { getCommunityImage } from '@/lib/communityImages';
import CommunityImage from '@/components/ui/CommunityImage';
import { submitLead } from '@/app/actions/leads';

interface LocationCardProps {
  community: Community;
  compact?: boolean; // Compact mode for spotlight sections
  regionSlug?: string; // Optional region slug for multi-region URLs
}

export default function LocationCard({ community, compact = false, regionSlug }: LocationCardProps) {
  // All Hooks must be called at the top level
  const formId = useId();
  const [isPricingSubmitting, setIsPricingSubmitting] = useState(false);
  const [isTourSubmitting, setIsTourSubmitting] = useState(false);
  const [pricingSubmitted, setPricingSubmitted] = useState(false);
  const [tourSubmitted, setTourSubmitted] = useState(false);
  const router = useRouter();
  const { addToComparison, isInComparison, removeFromComparison } = useComparison();

  // Early return with an error indicator if community is null/undefined
  if (!community) {
    return (
      <div className="bg-gray-100 border border-gray-200 rounded-xl p-4 h-full">
        <p className="text-red-500">Error: Community data missing</p>
      </div>
    );
  }

  // Safely access community id with fallback only if actually undefined
  const communityId = community.id || 'unknown';
  const isCompared = isInComparison(communityId);

  const toggleComparison = () => {
    if (isCompared) {
      removeFromComparison(communityId);
    } else {
      addToComparison(community);
    }
  };

  // Map timeframe to moveInTimeline
  const timeframeToTimeline = (timeframe: string): string => {
    switch (timeframe) {
      case 'asap': return 'Immediate';
      case '1-3months': return '1-3 months';
      case 'future': return 'Just researching';
      default: return '';
    }
  };

  const handlePricingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPricingSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await submitLead({
        fullName: formData.get('name')?.toString() || '',
        email: formData.get('email')?.toString() || '',
        phone: formData.get('phone')?.toString() || '',
        moveInTimeline: timeframeToTimeline(formData.get('timeframe')?.toString() || '') as any,
        communityName: community.name || 'Unknown Community',
        cityOrZip: community.location?.split(',')[0]?.trim() || '',
        notes: `Pricing request for ${community.name}`,
        pageType: 'location_page',
        sourceSlug: community.id,
      });

      if (result.success) {
        setPricingSubmitted(true);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsPricingSubmitting(false);
    }
  };

  const handleTourSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsTourSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await submitLead({
        fullName: formData.get('name')?.toString() || '',
        email: formData.get('email')?.toString() || '',
        phone: formData.get('phone')?.toString() || '',
        communityName: community.name || 'Unknown Community',
        cityOrZip: community.location?.split(',')[0]?.trim() || '',
        notes: `Tour request for ${community.name}`,
        pageType: 'location_page',
        sourceSlug: community.id,
      });

      if (result.success) {
        setTourSubmitted(true);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsTourSubmitting(false);
    }
  };

  // Use the actual community name and location, only use fallbacks if undefined
  const communityName = community.name || 'Community';
  const communityLocation = community.location || 'Unknown location';
  const communitySlug = communityName.toLowerCase().replace(/\s+/g, '-');

  // Prepare community URL - region-aware if regionSlug provided
  const communityUrl = regionSlug 
    ? `/${regionSlug}/community/${communityId}/${communitySlug}`
    : `/community/${communityId}/${communitySlug}`;

  // Use actual care types or fallback to empty array only if undefined
  const careTypes = community.careTypes || [];

  // Check if this is a skilled nursing-only facility (no AL/MC services)
  const isOnlySkilledNursing = careTypes.every(type => 
    type.toLowerCase().includes('skilled nursing')
  ) && !careTypes.some(type =>
    type.toLowerCase().includes('assisted living') ||
    type.toLowerCase().includes('memory care')
  );

  // Compact mode: horizontal card for spotlight sections
  // Mobile UX: 48px+ tap targets, high contrast text
  if (compact) {
    return (
      <div className="group bg-white border border-gray-200 hover:border-primary/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg flex min-h-[100px]">
        {/* Compact Image - 48px+ touch target */}
        <div className="relative w-28 h-full flex-shrink-0 min-h-[100px]">
          <Link href={communityUrl} className="block w-full h-full min-h-[48px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset">
            <CommunityImage
              src={getCommunityImage(community.images?.[0], communityId, communityName)}
              alt={community.imageAlt || `${communityName} senior living in ${communityLocation}`}
              fill
              className="object-cover"
              sizes="112px"
            />
          </Link>
        </div>

        {/* Compact Content - High contrast for accessibility */}
        <div className="flex-grow p-4 flex flex-col justify-center min-w-0">
          <h4 className="font-bold text-base text-gray-900 mb-1 line-clamp-2 leading-snug">
            <Link 
              href={communityUrl} 
              className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            >
              {communityName}
            </Link>
          </h4>
          <div className="flex items-center text-sm text-gray-700 mb-2">
            <MapPin className="h-4 w-4 mr-1 text-primary flex-shrink-0" />
            <span className="line-clamp-1 font-medium">{communityLocation}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {careTypes.slice(0, 2).map((type, index) => (
              <span
                key={`${communityId}-${type}-${index}`}
                className="bg-primary/15 text-primary-700 px-2.5 py-1 rounded-full text-xs font-semibold"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white border border-gray-200 hover:border-primary/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] flex flex-col h-full">
      {/* Card Header/Image */}
      <div className="relative w-full h-56">
        <Link href={communityUrl} className="block w-full h-full min-h-[48px]">
          <CommunityImage
            src={getCommunityImage(community.images?.[0], communityId, communityName)}
            alt={community.imageAlt || `${communityName} - ${careTypes.join(', ') || 'Senior Living'} in ${communityLocation}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>

        {/* Memory Care Badge - High contrast for accessibility */}
        {careTypes.includes('Memory Care') && (
          <div className="absolute top-3 left-3 bg-red-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
            Memory Care Available
          </div>
        )}

        {/* Compare Button - 48px+ tap target for mobile (WCAG 2.2) */}
        <button
          onClick={toggleComparison}
          className={`absolute top-3 right-3 min-w-[48px] min-h-[48px] p-3 rounded-full ${
            isCompared ? 'bg-primary text-white' : 'bg-white/95 hover:bg-white text-gray-800'
          } transition-all duration-200 shadow-md flex items-center justify-center`}
          aria-label={isCompared ? 'Remove from comparison' : 'Add to comparison'}
          type="button"
        >
          <Heart className={`h-6 w-6 ${isCompared ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* Card Content - High contrast text for older users */}
      <div className="flex-grow p-5">
        {/* Community Name - Bold, high contrast, min 18px */}
        <h3 className="font-bold text-lg md:text-xl text-gray-900 mb-2 line-clamp-2 leading-tight">
          <Link 
            href={communityUrl} 
            className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded min-h-[48px] inline-block"
          >
            {communityName}
          </Link>
        </h3>

        {/* Location - High contrast gray, larger text */}
        <div className="flex items-center text-base text-gray-700 mb-3">
          <MapPin className="h-4 w-4 mr-1.5 text-primary flex-shrink-0" />
          <span className="line-clamp-1 font-medium">{communityLocation}</span>
        </div>

        {/* Care Types - Larger badges for readability */}
        <div className="flex flex-wrap gap-2 mb-4">
          {careTypes.map((type, index) => (
            <span
              key={`${communityId}-${type}-${index}`}
              className="bg-primary/15 text-primary-700 px-3 py-1.5 rounded-full text-sm font-semibold"
            >
              {type}
            </span>
          ))}
        </div>

        {/* View Details Link - 48px+ tap target */}
        <Link
          href={communityUrl}
          className="inline-flex items-center text-base font-semibold text-primary hover:text-primary-700 hover:underline min-h-[48px] py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
        >
          View Details →
        </Link>
      </div>

      {/* Card Actions - Mobile UX: 48px+ touch targets, high contrast */}
      {!isOnlySkilledNursing ? (
        <div className="p-4 pt-0 mt-auto">
          <div className="grid grid-cols-2 gap-3">
            {/* Get Pricing Button - 48px+ height for WCAG 2.2 */}
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full min-h-[48px] py-3 text-base font-semibold border-2 border-gray-300 hover:border-primary hover:bg-primary/5"
                >
                  Get Pricing
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md mx-auto">
                <DialogHeader>
                  <DialogTitle>Request Pricing Info</DialogTitle>
                </DialogHeader>

                {!pricingSubmitted ? (
                  <form onSubmit={handlePricingSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor={`${formId}-name`} className="text-base font-semibold text-gray-800">Your Name</Label>
                      <Input id={`${formId}-name`} name="name" required placeholder="Enter your full name" className="h-12 text-base" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`${formId}-email`} className="text-base font-semibold text-gray-800">Email</Label>
                      <Input id={`${formId}-email`} name="email" type="email" required placeholder="your@email.com" className="h-12 text-base" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`${formId}-phone`} className="text-base font-semibold text-gray-800">Phone Number</Label>
                      <Input id={`${formId}-phone`} name="phone" type="tel" required placeholder="(555) 555-5555" className="h-12 text-base" />
                    </div>

                    <div className="space-y-2">
                      <Label>Move-in Timeframe</Label>
                      <RadioGroup name="timeframe" defaultValue="asap">
                        <div className="flex items-center space-x-2 py-1">
                          <RadioGroupItem value="asap" id={`${formId}-asap`} />
                          <Label htmlFor={`${formId}-asap`} className="cursor-pointer">As soon as possible</Label>
                        </div>
                        <div className="flex items-center space-x-2 py-1">
                          <RadioGroupItem value="1-3months" id={`${formId}-1-3months`} />
                          <Label htmlFor={`${formId}-1-3months`} className="cursor-pointer">1-3 months</Label>
                        </div>
                        <div className="flex items-center space-x-2 py-1">
                          <RadioGroupItem value="future" id={`${formId}-future`} />
                          <Label htmlFor={`${formId}-future`} className="cursor-pointer">Just researching</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full min-h-[48px] h-12 text-base font-bold" 
                      disabled={isPricingSubmitting}
                    >
                      {isPricingSubmitting ? 'Sending...' : 'Get Pricing Information'}
                    </Button>
                  </form>
                ) : (
                  <div className="pt-4 text-center space-y-4">
                    <div className="rounded-full bg-green-100 w-16 h-16 mx-auto flex items-center justify-center">
                      <Check className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="font-medium text-lg">Request Sent!</h3>
                    <p className="text-gray-600">
                      Thank you for your interest in {communityName}. A senior living advisor will contact you shortly with pricing information.
                    </p>
                    <Button variant="outline" onClick={() => setPricingSubmitted(false)}>
                      Send Another Request
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            {/* Schedule Tour Button - High contrast CTA, 48px+ height */}
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="default" 
                  className="w-full min-h-[48px] py-3 text-base font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md"
                >
                  Schedule Tour
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md mx-auto">
                <DialogHeader>
                  <DialogTitle>Schedule a Tour</DialogTitle>
                </DialogHeader>

                {!tourSubmitted ? (
                  <form onSubmit={handleTourSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor={`${formId}-tour-name`} className="text-base font-semibold text-gray-800">Your Name</Label>
                      <Input id={`${formId}-tour-name`} name="name" required placeholder="Enter your full name" className="h-12 text-base" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`${formId}-tour-phone`} className="text-base font-semibold text-gray-800">Phone Number</Label>
                      <Input id={`${formId}-tour-phone`} name="phone" type="tel" required placeholder="(555) 555-5555" className="h-12 text-base" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`${formId}-tour-email`} className="text-base font-semibold text-gray-800">Email</Label>
                      <Input id={`${formId}-tour-email`} name="email" type="email" required placeholder="your@email.com" className="h-12 text-base" />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full min-h-[48px] h-12 text-base font-bold" 
                      disabled={isTourSubmitting}
                    >
                      {isTourSubmitting ? 'Sending...' : 'Request Tour'}
                    </Button>
                    <p className="text-xs text-gray-500 text-center">We'll call you within 24 hours to schedule your visit.</p>
                  </form>
                ) : (
                  <div className="pt-4 text-center space-y-4">
                    <div className="rounded-full bg-green-100 w-16 h-16 mx-auto flex items-center justify-center">
                      <Clock className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="font-medium text-lg">Tour Request Sent!</h3>
                    <p className="text-gray-600">
                      Thank you for scheduling a tour at {communityName}. A representative will contact you shortly to confirm your tour date and time.
                    </p>
                    <Button variant="outline" onClick={() => setTourSubmitted(false)}>
                      Request Another Tour
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      ) : (
        <div className="p-4 pt-0 mt-auto">
          <div className="text-center text-sm text-gray-500 py-3 border-t">
            <p className="italic">Contact facility directly</p>
            <p className="text-xs mt-1">We specialize in assisted living and memory care</p>
          </div>
        </div>
      )}
    </div>
  );
}
