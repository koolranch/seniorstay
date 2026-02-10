'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, BarChart3, PhoneCall } from 'lucide-react';
import Link from 'next/link';

const VALUE_ITEMS = [
  {
    id: 'find-fit',
    icon: <Search className="h-7 w-7" />,
    title: 'Find the Right Fit',
    description:
      'Browse 150+ vetted communities with real pricing, verified reviews, and safety ratings—all in one place.',
    cta: 'Browse Communities',
    href: '/cleveland',
  },
  {
    id: 'compare',
    icon: <BarChart3 className="h-7 w-7" />,
    title: 'Compare Side by Side',
    description:
      'Use our comparison tools to evaluate costs, care levels, amenities, and hospital proximity across communities.',
    cta: 'Take Assessment',
    href: '/assessment',
  },
  {
    id: 'guidance',
    icon: <PhoneCall className="h-7 w-7" />,
    title: 'Get Expert Guidance',
    description:
      'Talk to a local senior living advisor who knows Cleveland inside and out—completely free, no obligation.',
    cta: 'Talk to an Advisor',
    href: '#advisor',
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
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

export default function ValueProps() {
  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {VALUE_ITEMS.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="group bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm hover:shadow-lg hover:border-teal-200 transition-all duration-300"
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: 'rgba(141, 163, 153, 0.15)', color: '#5a7d6a' }}
              >
                {item.icon}
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>

              <p className="text-slate-600 leading-relaxed mb-6">{item.description}</p>

              <Link
                href={item.href}
                className="inline-flex items-center text-teal-600 font-semibold text-sm hover:text-teal-700 transition-colors group/link"
              >
                {item.cta}
                <svg
                  className="h-4 w-4 ml-1.5 group-hover/link:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
