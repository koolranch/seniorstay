"use client";

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar, DollarSign } from 'lucide-react';
import { Community } from '@/data/facilities';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CommunityImage from '@/components/ui/CommunityImage';
import { submitLead } from '@/app/actions/leads';

interface CommunityHeaderProps {
  community: Community;
  isOnlySkilledNursing?: boolean;
}

export default function CommunityHeader({ community, isOnlySkilledNursing = false }: CommunityHeaderProps) {
  const [tourSubmitted, setTourSubmitted] = React.useState(false);
  const [pricingSubmitted, setPricingSubmitted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleTourSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await submitLead({
        fullName: formData.get('name')?.toString() || '',
        email: formData.get('email')?.toString() || '',
        phone: formData.get('phone')?.toString() || '',
        communityName: community.name,
        cityOrZip: community.location?.split(',')[0]?.trim() || '',
        notes: `Tour request for ${community.name}`,
        pageType: 'community_page',
        sourceSlug: community.id,
      });
      if (result.success) setTourSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePricingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await submitLead({
        fullName: formData.get('name')?.toString() || '',
        email: formData.get('email')?.toString() || '',
        phone: formData.get('phone')?.toString() || '',
        communityName: community.name,
        cityOrZip: community.location?.split(',')[0]?.trim() || '',
        notes: `Pricing request for ${community.name}`,
        pageType: 'community_page',
        sourceSlug: community.id,
      });
      if (result.success) setPricingSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <Link href="/" className="inline-flex items-center text-sm text-primary hover:underline">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Search
          </Link>
        </div>
      </div>

      {/* Image Gallery */}
      {community.images && community.images.length > 0 && (
        <div className="container mx-auto px-4 py-6">
          <Carousel className="w-full">
            <CarouselContent>
              {community.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden">
                    <CommunityImage
                      src={image}
                      alt={`${community.name} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 1200px"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {community.images.length > 1 && (
              <>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </>
            )}
          </Carousel>
        </div>
      )}

      {/* Header Info with CTAs */}
      <div className="container mx-auto px-4 pb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {community.name}
            </h1>
            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="text-lg">{community.location}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {community.careTypes.map((type, index) => (
                <span
                  key={index}
                  className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          {!isOnlySkilledNursing ? (
            <div className="flex flex-col sm:flex-row md:flex-col gap-3 md:min-w-[200px]">
              {/* Get Pricing Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full" size="lg">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Get Pricing
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Request Pricing Information</DialogTitle>
                  </DialogHeader>
                  {!pricingSubmitted ? (
                    <form onSubmit={handlePricingSubmit} className="space-y-4 pt-4">
                      <input type="hidden" name="form_type" value="community_pricing" />
                      <input type="hidden" name="community_name" value={community.name} />
                      <input type="hidden" name="community_id" value={community.id} />
                      <div className="space-y-2">
                        <Label htmlFor="pricing-name">Your Name</Label>
                        <Input id="pricing-name" name="name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pricing-email">Email</Label>
                        <Input id="pricing-email" name="email" type="email" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pricing-phone">Phone Number</Label>
                        <Input id="pricing-phone" name="phone" type="tel" required />
                      </div>
                      <Button type="submit" className="w-full">Get Pricing Info</Button>
                    </form>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-green-600 font-semibold mb-2">Thank you!</p>
                      <p className="text-gray-600">We'll send you pricing information shortly.</p>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              {/* Schedule Tour Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full border-2 border-orange-500 text-orange-600 hover:bg-orange-50" size="lg">
                    <Calendar className="h-5 w-5 mr-2" />
                    Schedule Tour
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Schedule a Tour</DialogTitle>
                  </DialogHeader>
                  {!tourSubmitted ? (
                    <form onSubmit={handleTourSubmit} className="space-y-4 pt-4">
                      <input type="hidden" name="form_type" value="community_tour" />
                      <input type="hidden" name="community_name" value={community.name} />
                      <input type="hidden" name="community_id" value={community.id} />
                      <div className="space-y-2">
                        <Label htmlFor="tour-name">Your Name</Label>
                        <Input id="tour-name" name="name" required placeholder="John Smith" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tour-phone">Phone Number</Label>
                        <Input id="tour-phone" name="phone" type="tel" required placeholder="(216) 677-4630" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tour-email">Email</Label>
                        <Input id="tour-email" name="email" type="email" required placeholder="john@example.com" />
                      </div>
                      <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">Request Tour</Button>
                      <p className="text-xs text-gray-500 text-center">We'll contact you within 24 hours to schedule.</p>
                    </form>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-green-600 font-semibold mb-2">Tour request received!</p>
                      <p className="text-gray-600">We'll contact you shortly to confirm your tour.</p>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="md:min-w-[200px]">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-700 font-medium mb-2">Skilled Nursing Facility</p>
                <p className="text-xs text-gray-600">Please contact facility directly for information</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 