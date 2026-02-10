'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, CheckCircle, ArrowRight, Users } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { submitLead } from '@/app/actions/leads';

interface AdvisorSlideOverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  communityName?: string;
  communityId?: string;
  sourceSlug?: string;
}

export default function AdvisorSlideOver({
  open,
  onOpenChange,
  communityName,
  communityId,
  sourceSlug,
}: AdvisorSlideOverProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await submitLead({
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        communityName,
        communityId,
        pageType: 'advisor_request',
        notes: communityName
          ? `Advisor request from community page: ${communityName}`
          : 'Advisor consultation requested',
        sourceSlug: sourceSlug || 'community-advisor',
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting advisor request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ fullName: '', phone: '', email: '' });
    }, 300);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={resetAndClose}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col bg-white">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100">
          <SheetHeader>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
              style={{ backgroundColor: 'rgba(141, 163, 153, 0.15)' }}
            >
              <Users className="h-6 w-6" style={{ color: '#5a7d6a' }} />
            </div>
            <SheetTitle className="text-lg font-bold text-slate-900">
              Talk to a Senior Living Advisor
            </SheetTitle>
            <SheetDescription className="text-sm text-slate-500">
              {communityName
                ? `Need help deciding about ${communityName}? Our advisors can help.`
                : 'Get free, personalized guidance from a local expert.'}
            </SheetDescription>
          </SheetHeader>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-5">
                  <CheckCircle className="h-8 w-8 text-teal-600" />
                </div>
              </motion.div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Request Received!</h3>
              <p className="text-sm text-slate-600 max-w-xs">
                A local advisor will reach out within 1 business day.
              </p>
              <Button variant="outline" className="mt-6" onClick={resetAndClose}>
                Close
              </Button>
            </div>
          ) : (
            <>
              {/* Benefits */}
              <div className="space-y-3 mb-6">
                {[
                  'Free, no-obligation consultation',
                  'Compare pricing and availability',
                  'Help scheduling tours',
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <CheckCircle className="h-4 w-4 text-teal-600 shrink-0" />
                    <span className="text-sm text-slate-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <form id="advisor-slide-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="adv-name" className="text-sm font-medium text-slate-700 mb-1.5 block">
                    Your Name <span className="text-red-400">*</span>
                  </label>
                  <Input
                    id="adv-name"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Full name"
                    className="h-11"
                  />
                </div>

                <div>
                  <label htmlFor="adv-phone" className="text-sm font-medium text-slate-700 mb-1.5 block">
                    Phone Number
                  </label>
                  <Input
                    id="adv-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(216) 555-0123"
                    className="h-11"
                  />
                </div>

                <div>
                  <label htmlFor="adv-email" className="text-sm font-medium text-slate-700 mb-1.5 block">
                    Email
                  </label>
                  <Input
                    id="adv-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@email.com"
                    className="h-11"
                  />
                </div>
              </form>
            </>
          )}
        </div>

        {/* Footer */}
        {!isSubmitted && (
          <div className="px-6 py-4 border-t border-slate-100 bg-white space-y-3">
            <Button
              type="submit"
              form="advisor-slide-form"
              disabled={isSubmitting || !formData.fullName}
              className="w-full h-12 font-semibold bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-sm"
            >
              {isSubmitting ? 'Submitting...' : 'Request Free Consultation'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <p className="text-xs text-center text-slate-400">
              Or call{' '}
              <a href="tel:+12166774630" className="text-teal-600 font-medium hover:underline">
                (216) 677-4630
              </a>
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
