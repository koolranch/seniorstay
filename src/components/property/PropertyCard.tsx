"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Building, Calendar, MapPin, Star } from 'lucide-react';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Community } from '@/data/facilities';

interface PropertyCardProps {
  community: Community;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ community }) => {
  const { id, name, location, images, careTypes } = community;

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
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={displayImages[0]}
            alt={name}
            fill
            className="object-cover"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 rounded-full bg-white/80 hover:bg-white"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{name}</h3>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>
          </div>
          {/* Only show rating if it exists */}
          {community.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{community.rating}</span>
            </div>
          )}
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {careTypes.map((type) => (
            <Badge key={type} variant="secondary">
              {type}
            </Badge>
          ))}
        </div>
        <p className="mt-2 text-sm text-gray-600">{community.description || 'No description available.'}</p>
      </CardContent>
      <CardFooter className="border-t p-4">
        <Link href={`/community/${id}/${facilitySlug}`}>
          <Button className="w-full">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
