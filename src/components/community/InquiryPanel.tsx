'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  MessageCircle,
  ArrowRight,
  CheckCircle,
  Star,
  Home,
  DollarSign,
  Send,
} from 'lucide-react';
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

interface QuickFact {
  icon: React.ReactNode;
  label: string;
  value: string;
}

interface InquiryPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  communityName: string;
  communityId?: string;
  communityImage?: string;
  careTypes?: string[];
  overallRating?: number;
  sourceSlug?: string;
}

const QUESTION_CHIPS = [
  'What are the monthly costs?',
  'Can I schedule a tour?',
  'What care levels are available?',
  'Is there current availability?',
  'What amenities are included?',
  'Do you accept Medicaid?',
];

export default function InquiryPanel({
  open,
  onOpenChange,
  communityName,
  communityId,
  communityImage,
  careTypes = [],
  overallRating,
  sourceSlug,
}: InquiryPanelProps) {
  const [step, setStep] = useState<'question' | 'contact' | 'success'>('question');
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [customMessage, setCustomMessage] = useState('');
  const [contactData, setContactData] = useState({ email: '', phone: '', fullName: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const quickFacts: QuickFact[] = [
    ...(careTypes.length > 0
      ? [{ icon: <Home className="h-3.5 w-3.5" />, label: 'Care', value: careTypes.slice(0, 2).join(', ') }]
      : []),
    ...(overallRating
      ? [{ icon: <Star className="h-3.5 w-3.5" />, label: 'Rating', value: `${overallRating}/5` }]
      : []),
  ];

  const toggleChip = (chip: string) => {
    setSelectedChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
  };

  const handleNextStep = () => {
    if (selectedChips.length === 0 && !customMessage.trim()) return;
    setStep('contact');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !contactData.email) return;

    setIsSubmitting(true);
    try {
      const allQuestions = [...selectedChips];
      if (customMessage.trim()) allQuestions.push(customMessage.trim());
      const notes = `Community Inquiry: ${allQuestions.join(' | ')}`;

      await submitLead({
        fullName: contactData.fullName || 'Website Inquiry',
        email: contactData.email,
        phone: contactData.phone,
        communityName,
        communityId,
        notes,
        pageType: 'community_inquiry',
        sourceSlug: sourceSlug || 'community-inquiry',
      });

      setStep('success');
    } catch (error) {
      console.error('Error submitting inquiry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setTimeout(() => {
      setStep('question');
      setSelectedChips([]);
      setCustomMessage('');
      setContactData({ email: '', phone: '', fullName: '' });
    }, 300);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={resetAndClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col bg-white overflow-hidden"
      >
        {/* Header with community context */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100">
          <SheetHeader className="space-y-0">
            <div className="flex items-center gap-3 mb-3">
              {communityImage ? (
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                  <Image src={communityImage} alt={communityName} fill className="object-cover" />
                </div>
              ) : (
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: 'rgba(141, 163, 153, 0.15)' }}
                >
                  <MessageCircle className="h-6 w-6" style={{ color: '#5a7d6a' }} />
                </div>
              )}
              <div className="min-w-0">
                <SheetTitle className="text-base font-semibold text-slate-900 truncate">
                  {communityName}
                </SheetTitle>
                <SheetDescription className="text-xs text-slate-500">
                  Ask a question — we typically respond within 24 hours
                </SheetDescription>
              </div>
            </div>

            {/* Quick Facts */}
            {quickFacts.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {quickFacts.map((fact, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full"
                  >
                    {fact.icon}
                    {fact.value}
                  </span>
                ))}
              </div>
            )}
          </SheetHeader>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <AnimatePresence mode="wait">
            {step === 'question' && (
              <motion.div
                key="question"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-3">
                    What would you like to know?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {QUESTION_CHIPS.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => toggleChip(chip)}
                        className={`px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                          selectedChips.includes(chip)
                            ? 'border-teal-500 bg-teal-50 text-teal-700'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="inquiry-message" className="text-sm font-medium text-slate-700 mb-1.5 block">
                    Or type your own question
                  </label>
                  <textarea
                    id="inquiry-message"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Type your question here..."
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  />
                </div>
              </motion.div>
            )}

            {step === 'contact' && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-5">
                  <p className="text-sm font-medium text-slate-700 mb-1">
                    Where should we send the answer?
                  </p>
                  <p className="text-xs text-slate-500">
                    We&apos;ll respond to your question within 24 hours.
                  </p>
                </div>

                {/* Show selected questions */}
                <div className="mb-5 p-3 bg-teal-50/50 rounded-xl border border-teal-100">
                  <p className="text-xs font-medium text-teal-700 mb-1.5">Your questions:</p>
                  <ul className="space-y-1">
                    {selectedChips.map((q, i) => (
                      <li key={i} className="text-xs text-teal-600 flex items-start gap-1.5">
                        <DollarSign className="h-3 w-3 mt-0.5 shrink-0 opacity-0" />
                        {q}
                      </li>
                    ))}
                    {customMessage.trim() && (
                      <li className="text-xs text-teal-600">{customMessage.trim()}</li>
                    )}
                  </ul>
                </div>

                <form id="inquiry-contact-form" onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label htmlFor="inquiry-email" className="text-sm font-medium text-slate-700 mb-1 block">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <Input
                      id="inquiry-email"
                      type="email"
                      required
                      value={contactData.email}
                      onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                      placeholder="you@email.com"
                      className="h-11"
                    />
                  </div>

                  <div>
                    <label htmlFor="inquiry-phone" className="text-sm font-medium text-slate-700 mb-1 block">
                      Phone <span className="text-slate-400">(optional)</span>
                    </label>
                    <Input
                      id="inquiry-phone"
                      type="tel"
                      value={contactData.phone}
                      onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                      placeholder="(216) 555-0123"
                      className="h-11"
                    />
                  </div>

                  <div>
                    <label htmlFor="inquiry-name" className="text-sm font-medium text-slate-700 mb-1 block">
                      Name <span className="text-slate-400">(optional)</span>
                    </label>
                    <Input
                      id="inquiry-name"
                      value={contactData.fullName}
                      onChange={(e) => setContactData({ ...contactData, fullName: e.target.value })}
                      placeholder="Your name"
                      className="h-11"
                    />
                  </div>
                </form>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                >
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-5">
                    <CheckCircle className="h-8 w-8 text-teal-600" />
                  </div>
                </motion.div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Question Sent!</h3>
                <p className="text-sm text-slate-600 max-w-xs">
                  We&apos;ll get back to you about {communityName} within 24 hours.
                </p>
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={resetAndClose}
                >
                  Close
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {step !== 'success' && (
          <div className="px-6 py-4 border-t border-slate-100 bg-white">
            {step === 'question' ? (
              <Button
                onClick={handleNextStep}
                disabled={selectedChips.length === 0 && !customMessage.trim()}
                className="w-full h-12 font-semibold bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-sm"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep('question')}
                  className="flex-shrink-0"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  form="inquiry-contact-form"
                  disabled={isSubmitting || !contactData.email}
                  className="flex-1 h-12 font-semibold bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-sm"
                >
                  {isSubmitting ? 'Sending...' : 'Send My Question'}
                  <Send className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
