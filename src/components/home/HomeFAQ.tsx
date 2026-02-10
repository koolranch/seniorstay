'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQ_ITEMS = [
  {
    question: 'How much does senior living cost in Cleveland, Ohio?',
    answer:
      'Senior living costs in Cleveland vary by care type in 2026: Independent living averages $2,200-$4,500/month, assisted living costs $3,200-$6,500/month, and memory care ranges from $4,500-$8,500/month. Premium suburbs like Beachwood and Westlake tend to be on the higher end, while Parma and Lakewood offer more affordable options.',
  },
  {
    question: 'What is the difference between assisted living and memory care?',
    answer:
      "Assisted living provides help with daily activities like bathing, dressing, and medication management for seniors who are cognitively independent. Memory care is specialized 24/7 care for seniors with Alzheimer's, dementia, or other cognitive impairments, featuring secure environments, higher staff ratios, and specialized programming.",
  },
  {
    question: 'Is Guide for Seniors really free?',
    answer:
      "Yes, Guide for Seniors is 100% free for families. We are compensated by senior living communities when we successfully match a family with the right care—so there is never any cost to you. Our local Cleveland advisors provide unbiased recommendations at no charge.",
  },
  {
    question: 'How do I know which type of care my loved one needs?',
    answer:
      'Our free 2-minute care assessment helps determine the right level of care based on your loved one\'s daily needs, medical conditions, and preferences. You can also speak with one of our local advisors who can guide you through the process.',
  },
  {
    question: 'Does Medicare pay for assisted living in Ohio?',
    answer:
      'Medicare does not cover assisted living costs in Ohio. However, Ohio Medicaid may help through the PASSPORT waiver program. Other options include long-term care insurance, Veterans Aid and Attendance benefits (up to $2,431/month for couples), and life insurance conversions.',
  },
  {
    question: 'How quickly can my loved one move into a community?',
    answer:
      'Move-in timelines vary by community and availability. Some communities can accommodate move-ins within a few days for urgent situations, while others may have waitlists of 1-3 months. Our advisors can help you find communities with immediate availability if needed.',
  },
];

export default function HomeFAQ() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <HelpCircle className="h-4 w-4" />
              Common Questions
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-600">
              Get answers to the most common questions about senior living in Cleveland.
            </p>
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="space-y-3">
            {FAQ_ITEMS.map((item, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="bg-slate-50 rounded-xl border border-slate-200/80 px-6 data-[state=open]:bg-teal-50/50 data-[state=open]:border-teal-200/50 transition-colors"
              >
                <AccordionTrigger className="text-left font-semibold text-slate-900 hover:no-underline py-5 text-base">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed pb-5">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
