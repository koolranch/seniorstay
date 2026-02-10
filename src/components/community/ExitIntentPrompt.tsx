'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle, TrendingDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { submitLead } from '@/app/actions/leads';

// Pricing insights for value-based exit intent
const PRICING_INSIGHTS: Record<string, { stat: string; comparison: string }> = {
  westlake: { stat: '$6,400/mo avg', comparison: '12% less than Beachwood' },
  beachwood: { stat: '$7,200/mo avg', comparison: 'Premium care near UH Ahuja' },
  'shaker heights': { stat: '$6,500/mo avg', comparison: 'Near University Hospitals' },
  lakewood: { stat: '$5,300/mo avg', comparison: '18% below Cleveland average' },
  parma: { stat: '$4,800/mo avg', comparison: 'Most affordable in Greater Cleveland' },
  'rocky river': { stat: '$5,800/mo avg', comparison: 'Lakefront community access' },
  strongsville: { stat: '$5,600/mo avg', comparison: 'Near Southwest General Hospital' },
  solon: { stat: '$6,100/mo avg', comparison: 'Quiet suburban setting' },
  cleveland: { stat: '$5,200/mo avg', comparison: 'Wide range of options available' },
};

interface ExitIntentPromptProps {
  communityName: string;
  communityId?: string;
  sourceSlug?: string;
  citySlug?: string;
  disabled?: boolean;
}

export default function ExitIntentPrompt({
  communityName,
  communityId,
  sourceSlug,
  citySlug,
  disabled = false,
}: ExitIntentPromptProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const sessionKey = `exit_intent_${communityId || communityName}`;
  const insight = PRICING_INSIGHTS[citySlug || ''] || PRICING_INSIGHTS['cleveland'];

  const showPrompt = useCallback(() => {
    if (isDismissed || disabled || isSubmitted) return;
    try {
      if (sessionStorage.getItem(sessionKey)) return;
    } catch {
      // sessionStorage not available
    }
    setIsVisible(true);
  }, [isDismissed, disabled, isSubmitted, sessionKey]);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5 && e.movementY < -10) {
        showPrompt();
      }
    };

    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      scrollVelocity = lastScrollY - currentScrollY;
      lastScrollY = currentScrollY;
      if (scrollVelocity > 80 && currentScrollY < window.innerHeight) {
        showPrompt();
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showPrompt]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
    try { sessionStorage.setItem(sessionKey, '1'); } catch { /* ignore */ }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await submitLead({
        fullName: 'Exit Intent Inquiry',
        email,
        communityName,
        communityId,
        notes: `Exit intent inquiry about ${communityName}. Shown pricing insight: ${insight.stat}`,
        pageType: 'exit_intent_inquiry',
        sourceSlug: sourceSlug || 'exit-intent',
      });
      setIsSubmitted(true);
      try { sessionStorage.setItem(sessionKey, '1'); } catch { /* ignore */ }
      setTimeout(() => setIsVisible(false), 3000);
    } catch (error) {
      console.error('Error submitting exit intent lead:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 md:pb-6"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors z-10"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="p-5">
              {isSubmitted ? (
                <div className="flex items-center gap-3 py-2">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Thanks! Cost guide on the way.</p>
                    <p className="text-xs text-slate-500">Check your email for our free pricing report.</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Value-first: pricing insight */}
                  <div className="flex items-start gap-3 mb-3 p-3 bg-teal-50 rounded-xl border border-teal-100">
                    <TrendingDown className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">
                        Senior Living in {citySlug ? citySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Cleveland'}: {insight.stat}
                      </p>
                      <p className="text-xs text-teal-700">{insight.comparison}</p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 mb-3">
                    Want the full {new Date().getFullYear()} cost guide? We&apos;ll send it free.
                  </p>

                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email"
                      required
                      className="h-10 text-sm flex-1"
                    />
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      size="sm"
                      className="h-10 px-4 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-sm"
                    >
                      {isSubmitting ? '...' : <Send className="h-4 w-4" />}
                    </Button>
                  </form>

                  <button
                    onClick={handleDismiss}
                    className="w-full text-xs text-slate-400 hover:text-slate-500 mt-2 text-center"
                  >
                    No thanks, just browsing
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
