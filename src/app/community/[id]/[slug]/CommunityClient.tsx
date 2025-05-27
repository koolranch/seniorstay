"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Building, MapPin, Phone, Calendar, Star, Check, Heart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { Community } from '@/data/facilities';
import MapComponent from '@/components/map/GoogleMap';

interface CommunityClientProps {
  community: Community;
}

export default function CommunityClient({ community }: CommunityClientProps) {
  const [isPricingSubmitting, setIsPricingSubmitting] = useState(false);
  const [isTourSubmitting, setIsTourSubmitting] = useState(false);
  const [pricingSubmitted, setPricingSubmitted] = useState(false);
  const [tourSubmitted, setTourSubmitted] = useState(false);

  // Formspree configuration
  const formspreeId = "xnnpaply";
  const formspreeEndpoint = `https://formspree.io/f/${formspreeId}`;

  // Destructure community data
  const { name, location, careTypes, images, description, amenities, staff, testimonials } = community;

  // Use placeholder content for missing data
  const communityDescription = description ||
    `${name} is a beautiful senior living community located in ${location}. We provide compassionate care in a welcoming environment designed to meet the needs of our residents.`;

  const communityAmenities = amenities || [
    "24/7 Care Staff",
    "Restaurant-Style Dining",
    "Activity Programs",
    "Housekeeping & Laundry",
    "Transportation Services",
    "Secured Environment",
    "Fitness Center",
    "Community Garden"
  ];

  const communityStaff = staff || {
    administrators: [
      { name: "Jane Smith", position: "Executive Director" },
      { name: "John Johnson", position: "Care Manager" }
    ],
    caregivers: [
      { name: "Maria Rodriguez", position: "Lead Caregiver" },
      { name: "David Williams", position: "Wellness Coordinator" }
    ]
  };

  const communityTestimonials = testimonials || [
    {
      quote: "The staff at this community has been so wonderful to my mother. She feels safe, happy, and well cared for.",
      author: "Sarah D., Family Member"
    },
    {
      quote: "Moving to this senior living community was the best decision I made. I have made many friends and feel at home here.",
      author: "Robert T., Resident"
    }
  ];

  const handlePricingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPricingSubmitting(true);

    const formData = new FormData(e.currentTarget);
    // Add additional fields for tracking
    formData.append('form_type', 'pricing_request');
    formData.append('community_name', name);
    formData.append('community_location', location);
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
    formData.append('community_name', name);
    formData.append('community_location', location);
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
        <div className="flex items-center mt-2 text-gray-600">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{location}</span>
        </div>
      </header>

      {/* Image Gallery */}
      <section className="container mx-auto px-4 mb-8">
        <div className="relative rounded-xl overflow-hidden">
          <Carousel className="w-full">
            <CarouselContent>
              {images.map((image, index) => (
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
              <TabsTrigger value="amenities">Amenities</TabsTrigger>
              <TabsTrigger value="staff">Staff</TabsTrigger>
              <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <h2 className="text-xl font-semibold">About {name}</h2>
              <p className="text-gray-700 leading-relaxed">{communityDescription}</p>
              {/* Example: Adding an additional paragraph */}
              <p className="text-gray-700 leading-relaxed">
                Our community is designed to provide comfort, security, and engagement for our seniors.
                We believe in creating an environment where residents can thrive and maintain their independence
                while receiving the support they need.
              </p>
            </TabsContent>

            {/* Amenities Tab */}
            <TabsContent value="amenities" className="space-y-4">
              <h2 className="text-xl font-semibold">Amenities & Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {communityAmenities.map((amenity, index) => (
                  <div key={`amenity-${index}`} className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Staff Tab */}
            <TabsContent value="staff" className="space-y-4">
              <h2 className="text-xl font-semibold">Our Team</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-lg mb-3">Administration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {communityStaff.administrators.map((staff, index) => (
                      <div key={`admin-${index}`} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium">{staff.name}</h4>
                        <p className="text-gray-600 text-sm">{staff.position}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-3">Care Team</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {communityStaff.caregivers.map((staff, index) => (
                      <div key={`caregiver-${index}`} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium">{staff.name}</h4>
                        <p className="text-gray-600 text-sm">{staff.position}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Testimonials Tab */}
            <TabsContent value="testimonials" className="space-y-4">
              <h2 className="text-xl font-semibold">What People Say</h2>
              <div className="space-y-6">
                {communityTestimonials.map((testimonial, index) => (
                  <div key={`testimonial-${index}`} className="border-l-4 border-primary/30 pl-4 py-2">
                    <div className="flex mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 italic mb-2">"{testimonial.quote}"</p>
                    <p className="text-sm text-gray-600">— {testimonial.author}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Contact & Actions */}
        <div className="md:col-span-1">
          <div className="sticky top-24 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Contact {name}</h2>

            {/* Phone Contact */}
            <div className="flex items-center mb-6 text-gray-700">
              <Phone className="h-5 w-5 mr-3 text-primary" />
              <span>(800) 555-1234</span>
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
                  <p className="text-gray-800">(800) 555-1234</p>
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
