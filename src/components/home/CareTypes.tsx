'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Brain, 
  Home, 
  UserCheck, 
  ArrowRight,
  Shield,
  Clock,
  Users
} from 'lucide-react';

/**
 * Care Type Authority Clusters (The "Silos")
 * 4 distinct care types with SEO-optimized H3 headings and internal links
 */

interface CareTypeCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  gradient: string;
  iconBg: string;
  stats?: string;
}

const CARE_TYPES: CareTypeCard[] = [
  {
    id: 'assisted-living',
    title: 'Assisted Living',
    description: 'Daily support with meals, medications, and personal care while maintaining independence in a home-like setting.',
    icon: <Heart className="h-7 w-7" />,
    href: '/senior-living-options/assisted-living',
    gradient: 'from-rose-500 to-pink-600',
    iconBg: 'bg-rose-100 text-rose-600',
    stats: '85+ communities',
  },
  {
    id: 'memory-care',
    title: 'Memory Care',
    description: 'Specialized 24/7 care for Alzheimer\'s and dementia with secure environments and cognitive therapies.',
    icon: <Brain className="h-7 w-7" />,
    href: '/memory-care-cleveland',
    gradient: 'from-violet-500 to-purple-600',
    iconBg: 'bg-violet-100 text-violet-600',
    stats: '45+ communities',
  },
  {
    id: 'independent-living',
    title: 'Independent Living',
    description: 'Active retirement communities with social activities, dining, and maintenance-free living for self-sufficient seniors.',
    icon: <Home className="h-7 w-7" />,
    href: '/senior-living-options/independent-living',
    gradient: 'from-teal-500 to-cyan-600',
    iconBg: 'bg-teal-100 text-teal-600',
    stats: '40+ communities',
  },
  {
    id: 'in-home-care',
    title: 'In-Home Care',
    description: 'Professional caregivers who come to your home for personalized assistance with daily activities and medical needs.',
    icon: <UserCheck className="h-7 w-7" />,
    href: '/resources/in-home-care',
    gradient: 'from-amber-500 to-orange-600',
    iconBg: 'bg-amber-100 text-amber-600',
    stats: 'Flexible hours',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

const CareTypes: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Explore Care Options
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Find the Right Level of Care
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Every senior&apos;s needs are unique. Explore the care types available in Cleveland to find the perfect match.
          </p>
        </div>

        {/* Care Type Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {CARE_TYPES.map((care) => (
            <motion.div
              key={care.id}
              variants={cardVariants}
              className="group"
            >
              <Link href={care.href} className="block h-full">
                <article className="relative h-full bg-white border border-slate-200 rounded-2xl p-6 hover:border-slate-300 hover:shadow-xl transition-all duration-300 flex flex-col">
                  {/* Icon */}
                  <div className={`${care.iconBg} w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    {care.icon}
                  </div>

                  {/* Title (H3 for SEO) */}
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-teal-700 transition-colors">
                    {care.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-600 leading-relaxed mb-5 flex-grow">
                    {care.description}
                  </p>

                  {/* Stats badge */}
                  {care.stats && (
                    <div className="text-sm text-slate-500 font-medium mb-4">
                      {care.stats}
                    </div>
                  )}

                  {/* CTA Link */}
                  <div className="flex items-center text-teal-600 font-semibold group-hover:text-teal-700 transition-colors mt-auto">
                    <span>View Top Communities</span>
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>

                  {/* Hover gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${care.gradient} opacity-0 group-hover:opacity-[0.03] rounded-2xl transition-opacity duration-300 pointer-events-none`} />
                </article>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <div className="text-center mt-14">
          <p className="text-slate-600 mb-4">Not sure which care type is right?</p>
          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <span>Take Our 2-Minute Care Assessment</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CareTypes;

