"use client";

import React, { useState, useId } from 'react';
import Image from 'next/image';
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

interface LocationCardProps {
  community: Community;
}

export default function LocationCard({ community }: LocationCardProps) {
  // All Hooks must be called at the top level
  const formId = useId();
  const [isPricingSubmitting, setIsPricingSubmitting] = useState(false);
  const [isTourSubmitting, setIsTourSubmitting] = useState(false);
  const [pricingSubmitted, setPricingSubmitted] = useState(false);
  const [tourSubmitted, setTourSubmitted] = useState(false);
  const router = useRouter();
  const { addToComparison, isInComparison, removeFromComparison } = useComparison();

  // Formspree configuration
  const formspreeId = "xnnpaply";
  const formspreeEndpoint = `https://formspree.io/f/${formspreeId}`;

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

  const handlePricingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPricingSubmitting(true);

    const formData = new FormData(e.currentTarget);
    // Add additional fields for tracking
    formData.append('form_type', 'pricing_request');
    formData.append('community_name', community.name || 'Unknown Community');
    formData.append('community_location', community.location || 'Unknown location');
    formData.append('source_page', typeof window !== 'undefined' ? window.location.href : '');

    try {
      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
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
    // Add additional fields for tracking
    formData.append('form_type', 'tour_request');
    formData.append('community_name', community.name || 'Unknown Community');
    formData.append('community_location', community.location || 'Unknown location');
    formData.append('source_page', typeof window !== 'undefined' ? window.location.href : '');

    try {
      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
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

  // Prepare community URL
  const communityUrl = `/community/${communityId}/${communitySlug}`;

  // Use actual care types or fallback to empty array only if undefined
  const careTypes = community.careTypes || [];

  return (
    <div className="group bg-white border border-gray-200 hover:border-primary/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] flex flex-col h-full">
      {/* Card Header/Image */}
      <div className="relative w-full h-48">
        <Link href={communityUrl} className="block w-full h-full">
          <Image
            src={getCommunityImage(community.images?.[0], communityId)}
            alt={communityName}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>

        {/* Memory Care Badge */}
        {careTypes.includes('Memory Care') && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
            Memory Care Available
          </div>
        )}

        {/* Compare Button - increased tap target size for mobile */}
        <button
          onClick={toggleComparison}
          className={`absolute top-3 right-3 p-3 rounded-full ${
            isCompared ? 'bg-primary text-white' : 'bg-white/90 hover:bg-white text-gray-700'
          } transition-all duration-200 shadow-sm`}
          aria-label={isCompared ? 'Remove from comparison' : 'Add to comparison'}
          type="button"
        >
          <Heart className={`h-5 w-5 ${isCompared ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* Card Content */}
      <div className="flex-grow p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">
          <Link href={communityUrl} className="hover:text-primary transition-colors">
            {communityName}
          </Link>
        </h3>

        <div className="flex items-center text-sm text-gray-600 mb-2">
          <MapPin className="h-3.5 w-3.5 mr-1 text-primary flex-shrink-0" />
          <span className="line-clamp-1">{communityLocation}</span>
        </div>

        {/* Care Types */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {careTypes.map((type, index) => (
            <span
              key={`${communityId}-${type}-${index}`}
              className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs"
            >
              {type}
            </span>
          ))}
        </div>

        {/* View Details Link - increased tap target size for mobile */}
        <Link
          href={communityUrl}
          className="text-sm text-primary hover:underline flex items-center mt-2 w-fit py-1"
        >
          View Details
        </Link>
      </div>

      {/* Card Actions - Improved for mobile */}
      <div className="p-4 pt-0 mt-auto">
        <div className="grid grid-cols-2 gap-3">
          {/* Get Pricing Button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full py-2 h-auto">
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
                    <Label htmlFor={`${formId}-name`}>Your Name</Label>
                    <Input id={`${formId}-name`} name="name" required placeholder="Enter your full name" className="h-10" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${formId}-email`}>Email</Label>
                    <Input id={`${formId}-email`} name="email" type="email" required placeholder="your@email.com" className="h-10" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${formId}-phone`}>Phone Number</Label>
                    <Input id={`${formId}-phone`} name="phone" type="tel" required placeholder="(555) 555-5555" className="h-10" />
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

                  <Button type="submit" className="w-full h-11" disabled={isPricingSubmitting}>
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

          {/* Schedule Tour Button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" size="sm" className="w-full py-2.5 h-auto text-base font-semibold bg-orange-500 hover:bg-orange-600">
                Tour
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md mx-auto">
              <DialogHeader>
                <DialogTitle>Schedule a Tour</DialogTitle>
              </DialogHeader>

              {!tourSubmitted ? (
                <form onSubmit={handleTourSubmit} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor={`${formId}-tour-name`}>Your Name</Label>
                    <Input id={`${formId}-tour-name`} name="name" required placeholder="Enter your full name" className="h-10" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${formId}-tour-phone`}>Phone Number</Label>
                    <Input id={`${formId}-tour-phone`} name="phone" type="tel" required placeholder="(555) 555-5555" className="h-10" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${formId}-tour-email`}>Email</Label>
                    <Input id={`${formId}-tour-email`} name="email" type="email" required placeholder="your@email.com" className="h-10" />
                  </div>

                  <Button type="submit" className="w-full h-11" disabled={isTourSubmitting}>
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
    </div>
  );
}
