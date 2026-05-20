"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Building, MapPin, Phone, Calendar, Star, Check, Heart, DollarSign } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { Community } from '@/data/facilities';
import MapComponent from '@/components/map/GoogleMap';
import { submitLead } from '@/app/actions/leads';
import CommunityTrustBadge from '@/components/community/CommunityTrustBadge';
import OhioLicensePanel from '@/components/community/OhioLicensePanel';
import PhoneLink from '@/components/conversion/PhoneLink';
import { PLACEMENT_PHONE_TEL } from '@/lib/placement-contact';
import { formatPriceEstimate, getPricingForCommunity } from '@/lib/community-pricing';
import { hasRealCommunityImage } from '@/lib/community-listing-utils';

interface CommunityClientProps {
  community: Community;
}

export default function CommunityClient({ community }: CommunityClientProps) {
  const [isPricingSubmitting, setIsPricingSubmitting] = useState(false);
  const [isTourSubmitting, setIsTourSubmitting] = useState(false);
  const [pricingSubmitted, setPricingSubmitted] = useState(false);
  const [tourSubmitted, setTourSubmitted] = useState(false);

  const { name, location, careTypes, images, description, amenities, staff, testimonials, amenityTags } = community;

  const pricing = getPricingForCommunity(community);
  const hasRealPhoto = hasRealCommunityImage(community);
  const displayAmenities = amenityTags?.length ? amenityTags : amenities;
  const hasAmenities = Boolean(displayAmenities?.length);
  const hasStaff = Boolean(
    staff?.administrators?.length || staff?.caregivers?.length
  );
  const hasTestimonials = Boolean(testimonials?.length);

  const communityDescription =
    description ||
    `${name} is a senior living community in ${location}. Contact our placement advisors for verified pricing, availability, and tour scheduling.`;

  const galleryImages = images.length > 0 ? images : ['/images/community-placeholder.jpg'];

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
        communityName: name,
        cityOrZip: location?.split(',')[0]?.trim() || '',
        notes: `Pricing request for ${name}`,
        pageType: 'community_page',
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
        communityName: name,
        cityOrZip: location?.split(',')[0]?.trim() || '',
        notes: `Tour request for ${name}. Preferred time: ${formData.get('timePreference') || 'not specified'}`,
        pageType: 'community_page',
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

  return (
    <main className="min-h-screen">
      {/* Back Navigation */}
      <div className="bg-gray-50 py-3 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to all communities
          </Link>
        </div>
      </div>

      {/* Header with Community Name and Location */}
      <header className="container mx-auto px-4 py-6">
        <h1 className="text-2xl md:text-3xl font-bold">{name}</h1>
        <div className="flex flex-wrap items-center gap-3 mt-2 text-gray-600">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{location}</span>
          </div>
          <CommunityTrustBadge community={community} />
        </div>
        <div className="mt-3 flex items-center gap-2 text-lg font-semibold text-slate-800">
          <DollarSign className="h-5 w-5 text-teal-600" />
          {formatPriceEstimate(community)}
          <span className="text-sm font-normal text-slate-500">
            {pricing.confirmedStarting ? '(advisor-confirmed)' : '(2026 area estimate)'}
          </span>
        </div>
      </header>

      {/* Image Gallery */}
      <section className="container mx-auto px-4 mb-8">
        <div className="relative rounded-xl overflow-hidden">
          {!hasRealPhoto && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/40 pointer-events-none">
              <span className="bg-white/90 text-slate-700 text-sm font-medium px-4 py-2 rounded-full">
                Photo coming soon — call for a virtual tour
              </span>
            </div>
          )}
          <Carousel className="w-full">
            <CarouselContent>
              {galleryImages.map((image, index) => (
                <CarouselItem key={`gallery-${index}`}>
                  <div className="relative w-full h-[300px] md:h-[450px]">
                    <Image
                      src={image}
                      alt={`${name} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                      crossOrigin="anonymous"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4" />
            <CarouselNext className="absolute right-4" />

            {/* Favorite Button */}
            <button className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/70 hover:bg-white">
              <Heart className="h-5 w-5 text-gray-600 hover:text-primary" />
            </button>
          </Carousel>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8 mb-12">
        {/* Left Column - Community Details */}
        <div className="md:col-span-2">
          {/* Care Types */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Care Types</h2>
            <div className="flex flex-wrap gap-2">
              {careTypes.map((careType, index) => (
                <span
                  key={`care-type-${index}`}
                  className="px-3 py-1 bg-primary/10 text-primary/90 rounded-full text-sm"
                >
                  {careType}
                </span>
              ))}
            </div>
          </div>

          {/* Community Tabs */}
          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              {hasAmenities && <TabsTrigger value="amenities">Amenities</TabsTrigger>}
              {hasStaff && <TabsTrigger value="staff">Staff</TabsTrigger>}
              {hasTestimonials && <TabsTrigger value="testimonials">Testimonials</TabsTrigger>}
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <h2 className="text-xl font-semibold">About {name}</h2>
              <p className="text-gray-700 leading-relaxed">{communityDescription}</p>
              <OhioLicensePanel community={community} />
            </TabsContent>

            {hasAmenities && (
            <TabsContent value="amenities" className="space-y-4">
              <h2 className="text-xl font-semibold">Amenities & Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {displayAmenities!.map((amenity, index) => (
                  <div key={`amenity-${index}`} className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            )}

            {hasStaff && staff && (
            <TabsContent value="staff" className="space-y-4">
              <h2 className="text-xl font-semibold">Our Team</h2>
              <div className="space-y-6">
                {staff.administrators?.length ? (
                <div>
                  <h3 className="font-medium text-lg mb-3">Administration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {staff.administrators.map((staffMember, index) => (
                      <div key={`admin-${index}`} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium">{staffMember.name}</h4>
                        <p className="text-gray-600 text-sm">{staffMember.position}</p>
                      </div>
                    ))}
                  </div>
                </div>
                ) : null}
                {staff.caregivers?.length ? (
                <div>
                  <h3 className="font-medium text-lg mb-3">Care Team</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {staff.caregivers.map((staffMember, index) => (
                      <div key={`caregiver-${index}`} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium">{staffMember.name}</h4>
                        <p className="text-gray-600 text-sm">{staffMember.position}</p>
                      </div>
                    ))}
                  </div>
                </div>
                ) : null}
              </div>
            </TabsContent>
            )}

            {hasTestimonials && testimonials && (
            <TabsContent value="testimonials" className="space-y-4">
              <h2 className="text-xl font-semibold">What People Say</h2>
              <div className="space-y-6">
                {testimonials.map((testimonial, index) => (
                  <div key={`testimonial-${index}`} className="border-l-4 border-primary/30 pl-4 py-2">
                    <div className="flex mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 italic mb-2">&ldquo;{testimonial.quote}&rdquo;</p>
                    <p className="text-sm text-gray-600">— {testimonial.author}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            )}
          </Tabs>
        </div>

        {/* Right Column - Contact & Actions */}
        <div className="md:col-span-1">
          <div className="sticky top-24 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Contact {name}</h2>

            {/* Phone Contact */}
            <div className="flex items-center mb-6 text-gray-700">
              <Phone className="h-5 w-5 mr-3 text-primary" />
              <PhoneLink placement="community_detail" phoneTel={PLACEMENT_PHONE_TEL} className="font-semibold text-teal-600 hover:text-teal-700">
                Call for pricing & availability
              </PhoneLink>
            </div>

            {/* Location and Contact Section */}
            <div className="mt-8 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  Location &amp; Contact
                </h2>
              </div>
              <div className="p-6">
                {community.address && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-600">Address:</h3>
                    <p className="text-gray-800">{community.address}</p>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-600">Contact:</h3>
                  <PhoneLink placement="community_detail_sidebar" phoneTel={PLACEMENT_PHONE_TEL} className="text-teal-600 font-semibold hover:text-teal-700">
                    Speak with a placement advisor
                  </PhoneLink>
                </div>

                {community.coordinates && (
                  <div className="mt-4">
                    <MapComponent
                      facilities={[community]}
                      height="300px"
                      zoom={15}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Get Pricing Button */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                    Get Pricing
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Get Pricing for {name}</DialogTitle>
                  </DialogHeader>
                  {pricingSubmitted ? (
                    <div className="text-center py-6">
                      <h3 className="text-lg font-medium text-green-600 mb-2">Thank You!</h3>
                      <p className="text-gray-600">We've received your request for pricing information.</p>
                      <p className="text-gray-600">Our team will contact you shortly.</p>
                    </div>
                  ) : (
                    <form onSubmit={handlePricingSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="detail-name">Name</Label>
                        <Input id="detail-name" name="name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="detail-email">Email</Label>
                        <Input id="detail-email" name="email" type="email" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="detail-phone">Phone</Label>
                        <Input id="detail-phone" name="phone" type="tel" required />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-white"
                        disabled={isPricingSubmitting}
                      >
                        {isPricingSubmitting ? 'Submitting...' : 'Request Pricing'}
                      </Button>
                    </form>
                  )}
                </DialogContent>
              </Dialog>

              {/* Schedule Tour Button */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full border-primary text-primary rounded-lg flex items-center justify-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Schedule Tour
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Schedule a Tour at {name}</DialogTitle>
                  </DialogHeader>
                  {tourSubmitted ? (
                    <div className="text-center py-6">
                      <h3 className="text-lg font-medium text-green-600 mb-2">Tour Scheduled!</h3>
                      <p className="text-gray-600">We've received your tour request.</p>
                      <p className="text-gray-600">Our team will contact you to confirm your tour details.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleTourSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="detail-tour-name">Name</Label>
                        <Input id="detail-tour-name" name="name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="detail-tour-email">Email</Label>
                        <Input id="detail-tour-email" name="email" type="email" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="detail-tour-phone">Phone</Label>
                        <Input id="detail-tour-phone" name="phone" type="tel" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="detail-tour-date">Preferred Date</Label>
                        <Input id="detail-tour-date" name="preferred_date" type="date" required />
                      </div>
                      <div className="space-y-2">
                        <Label>Preferred Time</Label>
                        <RadioGroup defaultValue="morning" name="preferred_time">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="morning" id="detail-morning" />
                            <Label htmlFor="detail-morning">Morning</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="afternoon" id="detail-afternoon" />
                            <Label htmlFor="detail-afternoon">Afternoon</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="evening" id="detail-evening" />
                            <Label htmlFor="detail-evening">Evening</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-white"
                        disabled={isTourSubmitting}
                      >
                        {isTourSubmitting ? 'Submitting...' : 'Schedule Tour'}
                      </Button>
                    </form>
                  )}
                </DialogContent>
              </Dialog>
            </div>

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-medium mb-2">Additional Information</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                  <span>Accepts Medicare/Medicaid</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                  <span>24/7 Staff Available</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                  <span>Transportation Services</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                  <span>Respite Care Available</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
