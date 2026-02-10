'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardCheck, ArrowRight, Timer, Shield, Heart } from 'lucide-react';
import Link from 'next/link';

const STEPS = [
  { icon: <ClipboardCheck className="h-5 w-5" />, label: 'Answer a few questions' },
  { icon: <Shield className="h-5 w-5" />, label: 'We match you to the right communities' },
  { icon: <Heart className="h-5 w-5" />, label: 'Get your personalized care plan' },
];

export default function PersonalizedPlanCTA() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            {/* Badge */}
            <span className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-teal-500/30">
              <Timer className="h-4 w-4" />
              Takes only 2 minutes
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Get a Personalized Care Plan
            </h2>
            <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
              Answer a few questions about your loved one&apos;s needs and we&apos;ll match you with
              the best senior living communities in your area.
            </p>

            {/* Steps */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-10">
              {STEPS.map((step, i) => (
                <React.Fragment key={i}>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: 'rgba(141, 163, 153, 0.25)', color: '#8DA399' }}
                    >
                      {step.icon}
                    </div>
                    <span className="text-sm text-white/80 font-medium">{step.label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-slate-600 hidden md:block" />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* CTA Button */}
            <Link
              href="/assessment"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold px-10 py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-lg group"
            >
              <ClipboardCheck className="h-6 w-6" />
              Start Your Free Assessment
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <p className="text-sm text-slate-500 mt-4">
              No account required. Completely free.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
