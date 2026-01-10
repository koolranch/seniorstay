'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, CheckCircle, Loader2, ArrowRight, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { submitLead } from '@/app/actions/leads';

/**
 * Lead Magnet Section - 2026 Cleveland Senior Care Cost Guide
 * High-contrast design with Supabase form submission
 */

interface FormData {
  email: string;
  firstName?: string;
}

const LeadMagnet: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ email: '', firstName: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate email
      const trimmedEmail = formData.email?.trim();
      if (!trimmedEmail || !trimmedEmail.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      console.log('[LeadMagnet] Submitting lead...', { email: trimmedEmail, firstName: formData.firstName });
      
      // Submit using the server action (handles ID generation and all fields)
      const result = await submitLead({
        fullName: formData.firstName?.trim() || 'Cost Guide Lead',
        email: trimmedEmail,
        pageType: 'homepage',
        sourceSlug: 'cost-guide-lead-magnet',
        notes: '2026 Cleveland Senior Care Cost Guide Download',
        careType: 'Other',
        moveInTimeline: 'Just researching',
      });

      console.log('[LeadMagnet] Submit result:', result);

      if (!result.success) {
        console.error('[LeadMagnet] Lead submission failed:', result.message, result.errors);
        throw new Error(result.message || 'Unable to submit. Please try again.');
      }

      // Send the pricing guide email
      console.log('[LeadMagnet] Lead submitted, sending pricing guide email...');
      try {
        const emailResponse = await fetch('/api/send-pricing-guide', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipientName: formData.firstName?.trim() || 'Friend',
            email: trimmedEmail,
          }),
        });
        
        const emailResult = await emailResponse.json();
        console.log('[LeadMagnet] Pricing guide email result:', emailResult);
        
        if (!emailResult.success) {
          // Log but don't fail - lead was captured
          console.warn('[LeadMagnet] Pricing guide email failed:', emailResult.error);
        }
      } catch (emailErr) {
        // Log but don't fail - lead was captured
        console.error('[LeadMagnet] Pricing guide email error:', emailErr);
      }

      setIsSuccess(true);
    } catch (err) {
      console.error('[LeadMagnet] Error caught:', err);
      // Handle server action errors more gracefully
      if (err instanceof Error) {
        // Check for server-side error indicators
        if (err.message.includes('500') || err.message.includes('Internal Server Error')) {
          setError('Our system is temporarily unavailable. Please call us at (216) 677-4630.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Something went wrong. Please try again or call (216) 677-4630.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content Side */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <FileText className="h-4 w-4" />
                Free Download
              </span>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Free: 2026 Cleveland Senior Care Cost Guide
              </h2>

              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                Download our comprehensive breakdown of local pricing and availability for assisted living, memory care, and independent living communities across Greater Cleveland.
              </p>

              {/* What's Included */}
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
                    <p className="font-semibold text-white">Cost Comparison Charts</p>
                    <p className="text-sm text-slate-400">Home care vs. community living breakdown</p>
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

            {/* Form Side */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-2xl">
                {!isSuccess ? (
                  <>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      Get Your Free Guide
                    </h3>
                    <p className="text-slate-600 mb-6">
                      Enter your email to download instantly.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* First Name (Optional) */}
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1">
                          First Name <span className="text-slate-400">(optional)</span>
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          placeholder="Your first name"
                          className="w-full h-12 px-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                        />
                      </div>

                      {/* Email (Required) */}
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="you@example.com"
                          className="w-full h-12 px-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                        />
                      </div>

                      {/* Error Message */}
                      {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                          {error}
                        </div>
                      )}

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-14 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <Download className="h-5 w-5" />
                            <span>Get My Guide</span>
                          </>
                        )}
                      </button>
                    </form>

                    <p className="text-xs text-slate-500 mt-4 text-center">
                      We respect your privacy. Unsubscribe anytime.
                    </p>
                  </>
                ) : (
                  /* Success State */
                  <div className="text-center py-6">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      Check Your Email!
                    </h3>
                    <p className="text-slate-600 mb-6">
                      Your 2026 Cleveland Senior Care Cost Guide is on its way to <strong>{formData.email}</strong>
                    </p>
                    <a
                      href="/greater-cleveland"
                      className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold transition-colors"
                    >
                      <span>Browse Communities While You Wait</span>
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
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

