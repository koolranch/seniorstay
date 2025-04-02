"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Building, Calendar } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface PropertyCardProps {
  id: string;
  name: string;
  location: string;
  images: string[];
  careTypes: string[];
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  name,
  location,
  images,
  careTypes,
}) => {
  // Default image if no images provided
  const defaultImage = "https://ext.same-assets.com/3140348022/3950841709.jpeg";
  const displayImages = images.length > 0 ? images : [defaultImage];

  const formspreeId = "xnnpaply";
  const formspreeEndpoint = `https://formspree.io/f/${formspreeId}`;

  const [isPricingSubmitting, setIsPricingSubmitting] = useState(false);
  const [isTourSubmitting, setIsTourSubmitting] = useState(false);
  const [pricingSubmitted, setPricingSubmitted] = useState(false);
  const [tourSubmitted, setTourSubmitted] = useState(false);

  // Generate URL-friendly slug from the name
  const facilitySlug = encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'));

  const handlePricingSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPricingSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.append('facility', name);
    formData.append('location', location);
    formData.append('formType', 'pricing');

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
        form.reset();
      } else {
        alert('Form submission failed. Please try again.');
      }
    } catch (error) {
      alert('Form submission failed. Please try again.');
    } finally {
      setIsPricingSubmitting(false);
    }
  };

  const handleTourSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsTourSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.append('facility', name);
    formData.append('location', location);
    formData.append('formType', 'tour');

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
        form.reset();
      } else {
        alert('Form submission failed. Please try again.');
      }
    } catch (error) {
      alert('Form submission failed. Please try again.');
    } finally {
      setIsTourSubmitting(false);
    }
  };

  return (
    <Card className="border-none shadow-none group relative">
      <CardContent className="p-0">
        {/* Image Carousel with Link */}
        <Link href={`/facility/${id}/${facilitySlug}`} className="block relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-opacity hover:opacity-95">
          <Carousel>
            <CarouselContent>
              {displayImages.map((image, index) => (
                <CarouselItem key={`${id}-image-${index}`}>
                  <div className="relative aspect-square w-full">
                    <Image
                      src={image}
                      alt={`${name} image ${index + 1}`}
                      fill
                      className="object-cover rounded-xl"
                      crossOrigin="anonymous"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious onClick={(e) => e.stopPropagation()} className="absolute left-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CarouselNext onClick={(e) => e.stopPropagation()} className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Carousel>

          {/* Favorite Button */}
          <button
            className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/70 hover:bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <Heart className="h-5 w-5 text-gray-600 hover:text-primary" />
          </button>
        </Link>

        {/* Facility Details with Link */}
        <div className="mt-3 space-y-2">
          <Link href={`/facility/${id}/${facilitySlug}`} className="block">
            <div className="flex justify-between">
              <h3 className="font-medium">{location}</h3>
              <div className="flex items-center">
                <Building className="h-4 w-4 text-primary/80 mr-1" />
                <span className="text-xs text-gray-600">Senior Living</span>
              </div>
            </div>
            <p className="font-semibold text-base">{name}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {careTypes.map((careType, index) => (
                <span
                  key={`${id}-care-${index}`}
                  className="text-xs bg-primary/10 text-primary/90 px-2 py-1 rounded-full"
                >
                  {careType}
                </span>
              ))}
            </div>
          </Link>
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            {/* Get Pricing Button with Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg"
                  onClick={(e) => e.stopPropagation()}
                >
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
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" name="name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact">Phone/Email</Label>
                      <Input id="contact" name="contact" required />
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

            {/* Tour Button with Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary rounded-lg flex items-center justify-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Calendar className="h-4 w-4" />
                  Tour
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
                      <Label htmlFor="tourName">Name</Label>
                      <Input id="tourName" name="name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tourContact">Phone/Email</Label>
                      <Input id="tourContact" name="contact" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tourDate">Preferred Date</Label>
                      <Input id="tourDate" name="date" type="date" required />
                    </div>
                    <div className="space-y-2">
                      <Label>Preferred Time</Label>
                      <RadioGroup defaultValue="morning" name="timePreference">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="morning" id="morning" />
                          <Label htmlFor="morning">Morning</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="afternoon" id="afternoon" />
                          <Label htmlFor="afternoon">Afternoon</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="evening" id="evening" />
                          <Label htmlFor="evening">Evening</Label>
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
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
