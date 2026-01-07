'use client';

import { useState, useEffect } from 'react';
import { X, Gift, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { trackFormSubmission } from '@/components/analytics/GoogleAnalytics';
import { trackMetaLead } from '@/components/analytics/MetaPixel';
import { useLeadSubmit, getUtmParams, getSourceInfo } from '@/hooks/useLeadSubmit';

interface ExitIntentPopupProps {
  cityName?: string;
}

export default function ExitIntentPopup({ cityName }: ExitIntentPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  const { submit, isPending, result, isSuccess, isError, reset } = useLeadSubmit({
    onSuccess: (result) => {
      // Track successful lead capture
      trackFormSubmission('exit_intent_popup', cityName);
      trackMetaLead();
      
      // Close popup after 3 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    },
  });

  useEffect(() => {
    // Check if popup has been shown in this session
    const popupShown = sessionStorage.getItem('exitIntentShown');
    if (popupShown) {
      setHasShown(true);
      return;
    }

    let timeoutId: NodeJS.Timeout;

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse leaves from the top
      if (e.clientY <= 0 && !hasShown) {
        timeoutId = setTimeout(() => {
          setIsVisible(true);
          setHasShown(true);
          sessionStorage.setItem('exitIntentShown', 'true');
        }, 500); // Small delay to prevent accidental triggers
      }
    };

    const handleMouseEnter = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };

    // Mobile fallback - show after 30 seconds
    const mobileTimeout = setTimeout(() => {
      if (!hasShown && window.innerWidth < 768) {
        setIsVisible(true);
        setHasShown(true);
        sessionStorage.setItem('exitIntentShown', 'true');
      }
    }, 30000);

    document.addEventListener('mouseout', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.removeEventListener('mouseout', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (timeoutId) clearTimeout(timeoutId);
      clearTimeout(mobileTimeout);
    };
  }, [hasShown]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const utmParams = getUtmParams();
    const sourceInfo = getSourceInfo();

    await submit({
      fullName: formData.get('name') as string,
      email: formData.get('email') as string,
      cityOrZip: cityName,
      pageType: 'pricing_guide',
      sourceSlug: sourceInfo.sourceSlug || cityName?.toLowerCase().replace(/\s+/g, '-'),
      notes: 'Exit intent popup - requested pricing guide and $500 discount',
      ...utmParams,
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={() => setIsVisible(false)}
      />
      
      {/* Popup */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-in fade-in slide-in-from-bottom-4">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-8">
            <Gift className="h-16 w-16 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
            <p className="text-gray-600">
              {result?.message || 'Check your email for your free guide and exclusive offers.'}
            </p>
            {result?.priority === 'high' && (
              <p className="text-sm text-primary mt-2">
                A senior advisor will reach out to you shortly.
              </p>
            )}
          </div>
        ) : isError ? (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Oops!</h3>
            <p className="text-gray-600 mb-4">{result?.message}</p>
            <Button onClick={() => reset()} variant="outline">
              Try Again
            </Button>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <Gift className="h-12 w-12 text-primary mx-auto mb-3" />
              <h3 className="text-2xl font-bold mb-2">
                Wait! Don't Leave Empty-Handed
              </h3>
              <p className="text-gray-600">
                Get our FREE {cityName ? `${cityName} ` : ''}Senior Living Cost Comparison Guide 
                + $500 move-in discount at select communities
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="popup-name">Name</Label>
                <Input
                  id="popup-name"
                  name="name"
                  required
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <Label htmlFor="popup-email">Email</Label>
                <Input
                  id="popup-email"
                  name="email"
                  type="email"
                  required
                  placeholder="your@email.com"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isPending}
              >
                {isPending ? 'Sending...' : 'Get My Free Guide + $500 Discount'}
              </Button>
              
              <p className="text-xs text-gray-500 text-center">
                No spam, ever. Unsubscribe anytime.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
