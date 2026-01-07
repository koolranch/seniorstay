'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Star, 
  Users,
  Shield,
  Heart,
  Award,
  Phone
} from 'lucide-react';
import Link from 'next/link';

/**
 * Trust/Social Proof Section
 * "Why Cleveland Families Trust Us" with 3 value propositions
 */

interface TrustItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  stat?: string;
  statLabel?: string;
}

const TRUST_ITEMS: TrustItem[] = [
  {
    id: 'free-service',
    icon: <CheckCircle className="h-8 w-8" />,
    title: '100% Free Service',
    description: 'Our expert guidance costs you nothing. We\'re compensated by communities, not families—so you always get unbiased recommendations.',
    stat: '$0',
    statLabel: 'Cost to You',
  },
  {
    id: 'verified-reviews',
    icon: <Star className="h-8 w-8" />,
    title: 'Verified Local Reviews',
    description: 'Every community in our directory has been visited and vetted by our Cleveland-based team. Real insights from real local experts.',
    stat: '150+',
    statLabel: 'Communities Reviewed',
  },
  {
    id: 'personalized',
    icon: <Heart className="h-8 w-8" />,
    title: 'Personalized Care Matches',
    description: 'We don\'t just list communities—we match you to the right ones based on care needs, budget, location preferences, and more.',
    stat: '500+',
    statLabel: 'Families Helped',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

const TrustSection: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Shield className="h-4 w-4" />
            Trusted Guidance
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Why Cleveland Families Trust Us
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Finding senior care is one of the most important decisions you'll make. Here's why thousands of Ohio families choose Guide for Seniors.
          </p>
        </div>

        {/* Trust Items Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {TRUST_ITEMS.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="text-center"
            >
              {/* Icon */}
              <div className="bg-teal-100 text-teal-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                {item.icon}
              </div>

              {/* Stat */}
              {item.stat && (
                <div className="mb-4">
                  <p className="text-4xl font-bold text-slate-900">{item.stat}</p>
                  <p className="text-sm text-slate-500">{item.statLabel}</p>
                </div>
              )}

              {/* Title */}
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-8 md:p-12 max-w-3xl mx-auto border border-slate-200">
            <Award className="h-10 w-10 text-amber-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              Ready to Find the Right Community?
            </h3>
            <p className="text-slate-600 mb-6 max-w-xl mx-auto">
              Speak with a local Cleveland senior care expert today—it's completely free and there's no obligation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Users className="h-5 w-5" />
                <span>Talk to a Local Expert</span>
              </Link>
              <a
                href="tel:+12166774630"
                className="inline-flex items-center gap-2 bg-white border-2 border-slate-300 hover:border-teal-500 text-slate-700 hover:text-teal-700 font-bold px-8 py-4 rounded-xl transition-all"
              >
                <Phone className="h-5 w-5" />
                <span>(216) 677-4630</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSection;

