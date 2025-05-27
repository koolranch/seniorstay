'use client';

import { useState } from 'react';
import { Download, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface PricingGuideFormProps {
  cityName?: string;
  buttonText?: string;
  buttonClassName?: string;
}

export default function PricingGuideForm({ 
  cityName, 
  buttonText = "Get Free Pricing Guide",
  buttonClassName = ""
}: PricingGuideFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const formspreeId = "xnnpaply"; // Using your existing Formspree ID
  const formspreeEndpoint = `https://formspree.io/f/${formspreeId}`;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    // Add additional fields
    formData.append('form_type', 'pricing_guide');
    formData.append('city', cityName || 'General');
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
        setIsSuccess(true);
        // In a real implementation, you would trigger the download here
        // For now, we'll just show a success message
        setTimeout(() => {
          setIsOpen(false);
          setIsSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className={buttonClassName || "bg-primary hover:bg-primary/90"}>
          <Download className="h-4 w-4 mr-2" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Get Your Free {cityName ? `${cityName} ` : ''}Senior Living Pricing Guide
          </DialogTitle>
          <DialogDescription>
            Enter your email to receive instant access to our comprehensive pricing guide 
            {cityName && ` for senior living communities in ${cityName}`}.
          </DialogDescription>
        </DialogHeader>
        
        {isSuccess ? (
          <div className="py-8 text-center">
            <div className="bg-green-50 text-green-800 p-4 rounded-lg mb-4">
              <Mail className="h-8 w-8 mx-auto mb-2" />
              <p className="font-semibold">Check your email!</p>
              <p className="text-sm mt-1">
                We've sent the pricing guide to your email address.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="guide-name">Name *</Label>
              <Input
                id="guide-name"
                name="name"
                required
                placeholder="Your name"
              />
            </div>
            
            <div>
              <Label htmlFor="guide-email">Email *</Label>
              <Input
                id="guide-email"
                name="email"
                type="email"
                required
                placeholder="your@email.com"
              />
            </div>
            
            <div>
              <Label htmlFor="guide-phone">Phone (Optional)</Label>
              <Input
                id="guide-phone"
                name="phone"
                type="tel"
                placeholder="(555) 555-5555"
              />
            </div>
            
            <div>
              <Label htmlFor="guide-timeline">When are you looking? *</Label>
              <select
                id="guide-timeline"
                name="timeline"
                required
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select timeline</option>
                <option value="immediate">Immediate need</option>
                <option value="1-3months">1-3 months</option>
                <option value="3-6months">3-6 months</option>
                <option value="6months+">6+ months</option>
                <option value="research">Just researching</option>
              </select>
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Get My Free Guide'}
            </Button>
            
            <p className="text-xs text-gray-500 text-center">
              We respect your privacy. Your information will never be shared.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
} 