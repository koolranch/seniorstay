'use client';

import { useState, useCallback, useRef, useTransition, useEffect } from 'react';
import { getLeadSubmissionToken, submitLead, LeadInput, LeadSubmitResult } from '@/app/actions/leads';
import { trackFormError, trackFormSubmission } from '@/components/analytics/GoogleAnalytics';

interface UseLeadSubmitOptions {
  onSuccess?: (result: LeadSubmitResult) => void;
  onError?: (result: LeadSubmitResult) => void;
}

export function useLeadSubmissionToken(): string {
  const [token, setToken] = useState('');

  useEffect(() => {
    let active = true;

    getLeadSubmissionToken()
      .then((nextToken) => {
        if (active) {
          setToken(nextToken);
        }
      })
      .catch(() => {
        if (active) {
          setToken('');
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return token;
}

/**
 * Custom hook for submitting leads with loading state and toast-ready responses
 */
export function useLeadSubmit(options?: UseLeadSubmitOptions) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<LeadSubmitResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formStartedAtRef = useRef(Date.now());
  const submissionToken = useLeadSubmissionToken();

  const submit = useCallback(async (data: LeadInput) => {
    setIsSubmitting(true);
    setResult(null);

    if (!submissionToken) {
      const errorResult: LeadSubmitResult = {
        success: false,
        message: 'Form is still loading. Please wait a moment and try again.',
      };
      setResult(errorResult);
      trackFormError(data.pageType || 'lead', errorResult.message);
      options?.onError?.(errorResult);
      setIsSubmitting(false);
      return;
    }
    
    startTransition(async () => {
      try {
        const response = await submitLead({
          website: data.website ?? '',
          submissionStartedAt: formStartedAtRef.current,
          submissionToken,
          ...data,
        });
        setResult(response);
        
        if (response.success) {
          trackFormSubmission(data.pageType || 'lead');
          options?.onSuccess?.(response);
          formStartedAtRef.current = Date.now();
        } else {
          trackFormError(data.pageType || 'lead', response.message);
          options?.onError?.(response);
        }
      } catch (error) {
        const errorResult: LeadSubmitResult = {
          success: false,
          message: 'An unexpected error occurred. Please try again.',
        };
        setResult(errorResult);
        options?.onError?.(errorResult);
      } finally {
        setIsSubmitting(false);
      }
    });
  }, [options, submissionToken]);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return {
    submit,
    reset,
    isPending: isPending || isSubmitting,
    isReady: Boolean(submissionToken),
    result,
    isSuccess: result?.success === true,
    isError: result?.success === false,
  };
}

interface UtmParams {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

interface SourceInfo {
  sourceSlug?: string;
  pageType?: 'location_page' | 'community_page' | 'contact' | 'assessment' | 'homepage' | 'pricing_guide' | 'blog' | 'other';
}

/**
 * Extract UTM parameters from URL
 */
export function getUtmParams(): UtmParams {
  if (typeof window === 'undefined') return {};
  
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get('utm_source') || undefined,
    utmMedium: params.get('utm_medium') || undefined,
    utmCampaign: params.get('utm_campaign') || undefined,
  };
}

/**
 * Extract source info from current URL
 */
export function getSourceInfo(): SourceInfo {
  if (typeof window === 'undefined') return {};
  
  const path = window.location.pathname;
  
  // Location page: /location/westlake
  const locationMatch = path.match(/\/location\/([^\/]+)/);
  if (locationMatch) {
    return {
      sourceSlug: locationMatch[1],
      pageType: 'location_page',
    };
  }
  
  // Community page: /community/...
  if (path.includes('/community/')) {
    return { pageType: 'community_page' };
  }
  
  // Contact page
  if (path.includes('/contact')) {
    return { pageType: 'contact' };
  }
  
  // Assessment page
  if (path.includes('/assessment')) {
    return { pageType: 'assessment' };
  }
  
  // Blog
  if (path.includes('/blog')) {
    return { pageType: 'blog' };
  }
  
  // Homepage
  if (path === '/') {
    return { pageType: 'homepage' };
  }
  
  return {};
}

