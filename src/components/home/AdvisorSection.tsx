'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Users, CheckCircle, Shield, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { submitLead } from '@/app/actions/leads';

const BENEFITS = [
  'Free consultation with a local senior living advisor',
  'Compare pricing across 150+ Cleveland communities',
  'Get a comprehensive care plan for your loved one',
  'Schedule tours at top-rated communities',
];

export default function AdvisorSection() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    contactPreference: 'phone' as 'phone' | 'email',
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
        pageType: 'advisor_request',
        notes: `Advisor consultation requested. Preferred contact: ${formData.contactPreference}`,
        sourceSlug: 'homepage-advisor',
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting advisor request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="advisor" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            {/* Left: Value Prop */}
            <div>
              <span className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Calendar className="h-4 w-4" />
                Free Consultation
              </span>

              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Talk to a Senior Living Advisor
              </h2>

              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Navigating senior care shouldn&apos;t feel overwhelming. Our Cleveland-based advisors
                have helped hundreds of families find the right community—and they can help you too.
              </p>

              <ul className="space-y-4 mb-8">
                {BENEFITS.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-teal-600 mt-0.5 shrink-0" />
                    <span className="text-slate-700">{benefit}</span>
                  </li>
                ))}
              </ul>

              {/* Social Proof */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white"
                      style={{
                        backgroundColor:
                          i === 1 ? '#5a7d6a' : i === 2 ? '#7a9d8a' : i === 3 ? '#4a6d5a' : '#8DA399',
                      }}
                    >
                      {['JM', 'SK', 'LD', 'RW'][i - 1]}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    500+ families helped in Cleveland
                  </p>
                  <p className="text-xs text-slate-500">
                    Join families who found the right community
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm">
              {isSubmitted ? (
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  >
                    <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-teal-600" />
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    We&apos;ll be in touch soon!
                  </h3>
                  <p className="text-slate-600">
                    A local advisor will reach out within 1 business day.
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
                      style={{ backgroundColor: 'rgba(141, 163, 153, 0.15)' }}
                    >
                      <Phone className="h-7 w-7" style={{ color: '#5a7d6a' }} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">
                      Schedule a Free Call
                    </h3>
                    <p className="text-sm text-slate-500">
                      No commitment. Get answers to your questions.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="advisor-name" className="text-sm font-medium text-slate-700 mb-1.5 block">
                        Your Name
                      </label>
                      <Input
                        id="advisor-name"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Full name"
                        className="h-12"
                      />
                    </div>

                    <div>
                      <label htmlFor="advisor-phone" className="text-sm font-medium text-slate-700 mb-1.5 block">
                        Phone Number
                      </label>
                      <Input
                        id="advisor-phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(216) 555-0123"
                        className="h-12"
                      />
                    </div>

                    <div>
                      <label htmlFor="advisor-email" className="text-sm font-medium text-slate-700 mb-1.5 block">
                        Email Address
                      </label>
                      <Input
                        id="advisor-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@email.com"
                        className="h-12"
                      />
                    </div>

                    {/* Contact Preference */}
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-2">Preferred contact method</p>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, contactPreference: 'phone' })}
                          className={`flex-1 py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                            formData.contactPreference === 'phone'
                              ? 'border-teal-500 bg-teal-50 text-teal-700'
                              : 'border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <Phone className="h-4 w-4 inline mr-2" />
                          Phone
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, contactPreference: 'email' })}
                          className={`flex-1 py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                            formData.contactPreference === 'email'
                              ? 'border-teal-500 bg-teal-50 text-teal-700'
                              : 'border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <Users className="h-4 w-4 inline mr-2" />
                          Email
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-13 text-base font-bold bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-lg"
                    >
                      {isSubmitting ? 'Submitting...' : 'Request Free Consultation'}
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>

                    <p className="text-xs text-center text-slate-400">
                      Or call us directly:{' '}
                      <a href="tel:+12166774630" className="text-teal-600 font-medium hover:underline">
                        (216) 677-4630
                      </a>
                    </p>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
