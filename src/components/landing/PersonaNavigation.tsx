'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Users, ArrowRight, Heart, Home } from 'lucide-react';

/**
 * Persona-Based Navigation - Guides visitors down the path most relevant to them.
 * Path A: Solo Ager (looking for themselves)
 * Path B: Stressed Adult Child (helping a loved one)
 */
const PersonaNavigation: React.FC = () => {
  const personas = [
    {
      id: 'solo-ager',
      title: "I'm Looking for Myself",
      subtitle: 'Planning your next chapter',
      description: 'Explore senior living options at your own pace. Compare communities, amenities, and lifestyle features that matter to you.',
      icon: User,
      color: 'from-teal-500 to-cyan-600',
      hoverColor: 'hover:from-teal-600 hover:to-cyan-700',
      borderColor: 'border-teal-500/30',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-700',
      href: '/assessment?persona=solo-ager',
      cta: 'Start My Search',
      features: ['Independent Living Options', 'Active Lifestyle Communities', 'Luxury Amenities'],
    },
    {
      id: 'adult-child',
      title: "I'm Helping a Loved One",
      subtitle: 'Finding care for Mom or Dad',
      description: "We understand the urgency. Get matched with communities that provide the right level of care, close to family, within your budget.",
      icon: Users,
      color: 'from-rose-500 to-orange-500',
      hoverColor: 'hover:from-rose-600 hover:to-orange-600',
      borderColor: 'border-rose-500/30',
      bgColor: 'bg-rose-50',
      textColor: 'text-rose-700',
      href: '/assessment?persona=caregiver',
      cta: 'Find Care Options Now',
      features: ['Memory Care Specialists', '24/7 Skilled Nursing', 'Respite & Rehabilitation'],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.span 
            className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            Personalized Guidance
          </motion.span>
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Who Are You Helping Today?
          </motion.h2>
          <motion.p 
            className="text-lg text-slate-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Choose your path for a personalized experience tailored to your unique situation.
          </motion.p>
        </div>

        {/* Persona Cards */}
        <motion.div 
          className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {personas.map((persona) => (
            <motion.div
              key={persona.id}
              variants={cardVariants}
              className="group"
            >
              <Link href={persona.href}>
                <div className={`relative overflow-hidden rounded-2xl border-2 ${persona.borderColor} bg-white p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full`}>
                  {/* Background Gradient Accent */}
                  <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${persona.color}`} />
                  
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${persona.bgColor} mb-6`}>
                    <persona.icon className={`h-8 w-8 ${persona.textColor}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                    {persona.title}
                  </h3>
                  <p className={`text-sm font-semibold ${persona.textColor} mb-4`}>
                    {persona.subtitle}
                  </p>
                  <p className="text-slate-600 mb-6 text-lg leading-relaxed">
                    {persona.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-8">
                    {persona.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-slate-700">
                        <Heart className={`h-4 w-4 ${persona.textColor} flex-shrink-0`} />
                        <span className="text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${persona.color} ${persona.hoverColor} text-white font-bold px-6 py-4 rounded-xl shadow-lg group-hover:shadow-xl transition-all min-h-[56px]`}>
                    <span className="text-lg">{persona.cta}</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Alternative CTA */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-slate-500 mb-4">Not sure where to start?</p>
          <Link 
            href="tel:+12166774630"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold text-lg transition-colors min-h-[48px]"
          >
            <span>Call Our Cleveland Advisors: (216) 677-4630</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default PersonaNavigation;

