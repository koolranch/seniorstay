"use client";

import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function StickyTourButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling 300px
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      await fetch('https://formspree.io/f/xnnpaply', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
      }`}
    >
      <Dialog>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="shadow-lg hover:shadow-xl transition-shadow bg-primary hover:bg-primary/90 text-white px-6 py-6 text-base font-semibold rounded-full"
          >
            <Calendar className="h-5 w-5 mr-2" />
            Request a Tour
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request a Tour</DialogTitle>
          </DialogHeader>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <input type="hidden" name="form_type" value="sticky_tour_request" />
              <input type="hidden" name="source_page" value={typeof window !== 'undefined' ? window.location.pathname : ''} />
              <div className="space-y-2">
                <Label htmlFor="sticky-name">Your Name *</Label>
                <Input id="sticky-name" name="name" required placeholder="John Smith" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sticky-phone">Phone Number *</Label>
                <Input id="sticky-phone" name="phone" type="tel" required placeholder="(216) 555-0100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sticky-email">Email *</Label>
                <Input id="sticky-email" name="email" type="email" required placeholder="john@example.com" />
              </div>
              <Button type="submit" className="w-full">Request Tour</Button>
              <p className="text-xs text-gray-500 text-center">We'll contact you within 24 hours to schedule your tour.</p>
            </form>
          ) : (
            <div className="text-center py-6">
              <p className="text-green-600 font-semibold mb-2">Tour request received!</p>
              <p className="text-gray-600">We'll contact you shortly to schedule your visit.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

