'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, CheckCircle, Loader2, ArrowRight, DollarSign, TrendingUp, Calendar, Phone } from 'lucide-react';
import { submitLead } from '@/app/actions/leads';
import PhoneLink from '@/components/conversion/PhoneLink';
import { PLACEMENT_CALLBACK_MESSAGE, PLACEMENT_PHONE_DISPLAY } from '@/lib/placement-contact';
import { isValidPhone } from '@/lib/lead-form-options';

interface CallbackFormData {
  name: string;
  phone: string;
}

interface GuideFormData {
  email: string;
  firstName?: string;
}

const LeadMagnet: React.FC = () => {
  const [callbackData, setCallbackData] = useState<CallbackFormData>({ name: '', phone: '' });
  const [guideData, setGuideData] = useState<GuideFormData>({ email: '', firstName: '' });
  const [showGuideForm, setShowGuideForm] = useState(false);
  const [isSubmittingCallback, setIsSubmittingCallback] = useState(false);
  const [isSubmittingGuide, setIsSubmittingGuide] = useState(false);
  const [callbackSuccess, setCallbackSuccess] = useState(false);
  const [guideSuccess, setGuideSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const callbackStartedAtRef = useRef(Date.now());
  const guideStartedAtRef = useRef(Date.now());

  const handleCallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingCallback(true);
    setError(null);

    if (!isValidPhone(callbackData.phone)) {
      setError('Please enter a valid phone number so we can call you back.');
      setIsSubmittingCallback(false);
      return;
    }

    try {
      const result = await submitLead({
        fullName: callbackData.name.trim() || 'Homepage Callback',
        phone: callbackData.phone.trim(),
        pageType: 'homepage',
        sourceSlug: 'homepage-callback',
        notes: 'Homepage placement callback request',
        careType: 'Other',
        moveInTimeline: 'Just researching',
        website: '',
        submissionStartedAt: callbackStartedAtRef.current,
      });

      if (!result.success) {
        throw new Error(result.message || 'Unable to submit. Please try again.');
      }

      setCallbackSuccess(true);
      callbackStartedAtRef.current = Date.now();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please call us directly.');
    } finally {
      setIsSubmittingCallback(false);
    }
  };

  const handleGuideSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingGuide(true);
    setError(null);

    const trimmedEmail = guideData.email?.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setError('Please enter a valid email address');
      setIsSubmittingGuide(false);
      return;
    }

    try {
      const result = await submitLead({
        fullName: guideData.firstName?.trim() || 'Cost Guide Lead',
        email: trimmedEmail,
        pageType: 'homepage',
        sourceSlug: 'cost-guide-lead-magnet',
        notes: '2026 Cleveland Senior Care Cost Guide Download',
        careType: 'Other',
        moveInTimeline: 'Just researching',
        website: '',
        submissionStartedAt: guideStartedAtRef.current,
      });

      if (!result.success) {
        throw new Error(result.message || 'Unable to submit. Please try again.');
      }

      if (result.pricingGuideToken) {
        try {
          await fetch('/api/send-pricing-guide', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              recipientName: guideData.firstName?.trim() || 'Friend',
              email: trimmedEmail,
              accessToken: result.pricingGuideToken,
            }),
          });
        } catch {
          // Lead captured; email delivery is best-effort
        }
      }

      setGuideSuccess(true);
      guideStartedAtRef.current = Date.now();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again or call (216) 677-4630.');
    } finally {
      setIsSubmittingGuide(false);
    }
  };

  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Phone className="h-4 w-4" />
                Free Expert Help
              </span>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Compare Cleveland Senior Living Costs
              </h2>

              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                Talk to a local advisor about assisted living, memory care, and independent living pricing across Greater Cleveland—no cost to families.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-teal-500/20 p-2 rounded-lg mt-0.5">
                    <DollarSign className="h-5 w-5 text-teal-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">2026 Pricing Data</p>
                    <p className="text-sm text-slate-400">Current rates for AL, MC, and IL by neighborhood</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-amber-500/20 p-2 rounded-lg mt-0.5">
                    <TrendingUp className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Personalized Comparisons</p>
                    <p className="text-sm text-slate-400">Home care vs. community living for your situation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-violet-500/20 p-2 rounded-lg mt-0.5">
                    <Calendar className="h-5 w-5 text-violet-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Availability Insights</p>
                    <p className="text-sm text-slate-400">Which communities have openings now</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-2xl">
                {callbackSuccess ? (
                  <div className="text-center py-6">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">We&apos;ll Call You Soon</h3>
                    <p className="text-slate-600 mb-6">{PLACEMENT_CALLBACK_MESSAGE}</p>
                    <PhoneLink
                      placement="homepage_lead_magnet_success"
                      className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold"
                    >
                      Or call now: {PLACEMENT_PHONE_DISPLAY}
                    </PhoneLink>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      Speak with a Cleveland Advisor
                    </h3>
                    <p className="text-slate-600 mb-6">
                      Call now or leave your number for a free callback.
                    </p>

                    <PhoneLink
                      placement="homepage_lead_magnet"
                      className="w-full h-14 mb-4 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2"
                    >
                      <Phone className="h-5 w-5" />
                      Call {PLACEMENT_PHONE_DISPLAY}
                    </PhoneLink>

                    <p className="text-center text-xs text-slate-500 mb-4">or request a callback</p>

                    <form onSubmit={handleCallbackSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="callbackName" className="block text-sm font-medium text-slate-700 mb-1">
                          Your Name
                        </label>
                        <input
                          type="text"
                          id="callbackName"
                          value={callbackData.name}
                          onChange={(e) => setCallbackData({ ...callbackData, name: e.target.value })}
                          placeholder="Your name"
                          className="w-full h-12 px-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="callbackPhone" className="block text-sm font-medium text-slate-700 mb-1">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          id="callbackPhone"
                          required
                          value={callbackData.phone}
                          onChange={(e) => setCallbackData({ ...callbackData, phone: e.target.value })}
                          placeholder="(216) 555-0123"
                          className="w-full h-12 px-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>

                      {error && !showGuideForm && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                          {error}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmittingCallback}
                        className="w-full h-12 border-2 border-teal-600 text-teal-700 hover:bg-teal-50 font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                      >
                        {isSubmittingCallback ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          'Request a Callback'
                        )}
                      </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-slate-200">
                      {!showGuideForm && !guideSuccess && (
                        <button
                          type="button"
                          onClick={() => setShowGuideForm(true)}
                          className="w-full text-sm text-slate-500 hover:text-teal-600 flex items-center justify-center gap-2"
                        >
                          <FileText className="h-4 w-4" />
                          Prefer the PDF cost guide instead?
                        </button>
                      )}

                      {showGuideForm && !guideSuccess && (
                        <>
                          <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                            <Download className="h-4 w-4 text-teal-600" />
                            Download the 2026 Cost Guide (PDF)
                          </h4>
                          <form onSubmit={handleGuideSubmit} className="space-y-3">
                            <input
                              type="text"
                              value={guideData.firstName}
                              onChange={(e) => setGuideData({ ...guideData, firstName: e.target.value })}
                              placeholder="First name (optional)"
                              className="w-full h-11 px-4 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                            <input
                              type="email"
                              required
                              value={guideData.email}
                              onChange={(e) => setGuideData({ ...guideData, email: e.target.value })}
                              placeholder="Email for PDF download"
                              className="w-full h-11 px-4 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                            {error && showGuideForm && (
                              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                                {error}
                              </div>
                            )}
                            <button
                              type="submit"
                              disabled={isSubmittingGuide}
                              className="w-full h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                              {isSubmittingGuide ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <Download className="h-4 w-4" />
                                  Email Me the Guide
                                </>
                              )}
                            </button>
                          </form>
                        </>
                      )}

                      {guideSuccess && (
                        <div className="text-center py-2">
                          <p className="text-sm text-green-700 font-medium">
                            Check your email for the cost guide!
                          </p>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 mt-4 text-center">
                      Free guidance • No obligation • We respect your privacy
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadMagnet;
