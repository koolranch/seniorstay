'use client';

import React, { useState, useEffect } from 'react';
import { X, Download, ArrowRight, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { submitLead } from '@/app/actions/leads';

interface StickyLeadCaptureProps {
  neighborhood: string;
  communityName?: string;
}

/**
 * StickyLeadCapture - Bottom sticky bar offering neighborhood pricing report
 * 
 * Navy/Sage theme with glassmorphism effect
 * Converts visitors into leads with neighborhood-specific value prop
 */
export default function StickyLeadCapture({ neighborhood, communityName }: StickyLeadCaptureProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 400px and not dismissed
      if (!isDismissed) {
        setIsVisible(window.scrollY > 400);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await submitLead({
        fullName: '',
        email,
        phone: '',
        communityName: communityName || '',
        cityOrZip: neighborhood,
        notes: `${neighborhood} Pricing & Waitlist Report request`,
        pageType: 'community_page',
        sourceSlug: `pricing-report-${neighborhood.toLowerCase().replace(/\s+/g, '-')}`,
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting lead:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Desktop Sticky Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 hidden md:block">
        {/* Glassmorphism background */}
        <div 
          className="backdrop-blur-xl border-t"
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
            borderColor: 'rgba(141, 163, 153, 0.3)',
          }}
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-6">
              {/* Left: Value Proposition */}
              <div className="flex items-center gap-4">
                <div 
                  className="p-2.5 rounded-xl"
                  style={{ backgroundColor: 'rgba(141, 163, 153, 0.2)' }}
                >
                  <FileText className="h-6 w-6" style={{ color: '#8DA399' }} />
                </div>
                <div>
                  <p className="text-white font-semibold">
                    Free: {neighborhood} Pricing & Waitlist Report
                  </p>
                  <p className="text-slate-400 text-sm">
                    2026 rates, availability & compare top communities
                  </p>
                </div>
              </div>

              {/* Center/Right: CTA */}
              {isSubmitted ? (
                <div className="flex items-center gap-3 text-emerald-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium">Check your email!</span>
                </div>
              ) : isExpanded ? (
                <form onSubmit={handleSubmit} className="flex items-center gap-3">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-64 bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                    required
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="text-slate-900 font-semibold px-6"
                    style={{ backgroundColor: '#8DA399' }}
                  >
                    {isSubmitting ? 'Sending...' : 'Get Report'}
                    <Download className="h-4 w-4 ml-2" />
                  </Button>
                  <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="text-slate-400 hover:text-white p-1"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => setIsExpanded(true)}
                    className="text-slate-900 font-semibold px-6 group"
                    style={{ backgroundColor: '#8DA399' }}
                  >
                    Download Free Report
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <button
                    onClick={handleDismiss}
                    className="text-slate-400 hover:text-white p-2"
                    aria-label="Dismiss"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Floating Button */}
      <div className="fixed bottom-20 right-4 z-50 md:hidden">
        <Button
          onClick={() => setIsExpanded(true)}
          className="rounded-full shadow-lg px-4 py-3 text-slate-900 font-semibold"
          style={{ backgroundColor: '#8DA399' }}
        >
          <Download className="h-4 w-4 mr-2" />
          {neighborhood} Report
        </Button>
      </div>

      {/* Mobile Expanded Modal */}
      {isExpanded && (
        <div className="fixed inset-0 z-[100] md:hidden flex items-end">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsExpanded(false)}
          />
          <div 
            className="relative w-full rounded-t-3xl p-6 pb-8"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 100%)',
            }}
          >
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-4 right-4 text-slate-400"
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="text-center mb-6">
              <div 
                className="inline-flex p-3 rounded-xl mb-4"
                style={{ backgroundColor: 'rgba(141, 163, 153, 0.2)' }}
              >
                <FileText className="h-8 w-8" style={{ color: '#8DA399' }} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {neighborhood} Pricing Report
              </h3>
              <p className="text-slate-400 text-sm">
                2026 rates, waitlist status & community comparisons
              </p>
            </div>

            {isSubmitted ? (
              <div className="text-center py-6">
                <div className="inline-flex items-center gap-2 text-emerald-400 text-lg font-medium">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Report sent to your email!
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 h-12"
                  required
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 text-slate-900 font-semibold text-base"
                  style={{ backgroundColor: '#8DA399' }}
                >
                  {isSubmitting ? 'Sending...' : 'Get Free Report'}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
