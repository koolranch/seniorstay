'use client';

import { useState, useEffect } from 'react';
import { Download, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
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
import { useLeadSubmit, getUtmParams, getSourceInfo } from '@/hooks/useLeadSubmit';

interface PricingGuideFormProps {
  cityName?: string;
  buttonText?: string;
  buttonClassName?: string;
  communityName?: string;
}

export default function PricingGuideForm({ 
  cityName, 
  buttonText = "Get Free Pricing Guide",
  buttonClassName = "",
  communityName,
}: PricingGuideFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const { submit, isPending, result, isSuccess, reset } = useLeadSubmit({
    onSuccess: () => {
      // Auto-close dialog after 3 seconds on success
      setTimeout(() => {
        setIsOpen(false);
        reset();
      }, 3000);
    },
  });

  // Reset form state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setFormErrors({});
      reset();
    }
  }, [isOpen, reset]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormErrors({});
    
    const formData = new FormData(e.currentTarget);
    const utmParams = getUtmParams();
    const sourceInfo = getSourceInfo();
    
    // Map form timeline values to LeadInput enum values
    const timelineMap: Record<string, string> = {
      'immediate': 'Immediate',
      '1-3months': '1-3 months',
      '3-6months': '3-6 months',
      '6months+': '6+ months',
      'research': 'Just researching',
    };
    
    const rawTimeline = formData.get('timeline') as string;
    
    await submit({
      fullName: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string || undefined,
      moveInTimeline: timelineMap[rawTimeline] as any,
      cityOrZip: cityName,
      communityName: communityName,
      pageType: 'pricing_guide',
      sourceSlug: sourceInfo.sourceSlug || cityName?.toLowerCase().replace(/\s+/g, '-'),
      ...utmParams,
    });
    
    // Handle validation errors
    if (result?.errors) {
      const errors: Record<string, string> = {};
      Object.entries(result.errors).forEach(([field, messages]) => {
        errors[field] = messages[0];
      });
      setFormErrors(errors);
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
            Enter your details to receive instant access to our comprehensive pricing guide 
            {cityName && ` for senior living communities in ${cityName}`}.
          </DialogDescription>
        </DialogHeader>
        
        {isSuccess ? (
          <div className="py-8 text-center">
            <div className="bg-green-50 text-green-800 p-4 rounded-lg mb-4">
              <CheckCircle2 className="h-8 w-8 mx-auto mb-2" />
              <p className="font-semibold">{result?.message || 'Success!'}</p>
              {result?.priority === 'high' && (
                <p className="text-sm mt-1">
                  A senior advisor will contact you very soon.
                </p>
              )}
              <p className="text-sm mt-1 text-green-700">
                Check your email for the pricing guide.
              </p>
            </div>
          </div>
        ) : result && !result.success ? (
          <div className="py-4">
            <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Unable to submit</p>
                <p className="text-sm mt-1">{result.message}</p>
              </div>
            </div>
            <Button 
              onClick={() => reset()} 
              variant="outline" 
              className="w-full"
            >
              Try Again
            </Button>
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
                className={formErrors.fullName ? 'border-red-500' : ''}
              />
              {formErrors.fullName && (
                <p className="text-red-500 text-sm mt-1">{formErrors.fullName}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="guide-email">Email *</Label>
              <Input
                id="guide-email"
                name="email"
                type="email"
                required
                placeholder="your@email.com"
                className={formErrors.email ? 'border-red-500' : ''}
              />
              {formErrors.email && (
                <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="guide-phone">Phone (Optional)</Label>
              <Input
                id="guide-phone"
                name="phone"
                type="tel"
                placeholder="(555) 555-5555"
              />
              <p className="text-xs text-gray-500 mt-1">
                Providing your phone helps us reach you faster for urgent inquiries.
              </p>
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
              disabled={isPending}
            >
              {isPending ? 'Sending...' : 'Get My Free Guide'}
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
