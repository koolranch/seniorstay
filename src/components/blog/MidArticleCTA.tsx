'use client';

import Link from 'next/link';
import { Phone, ArrowRight, DollarSign } from 'lucide-react';
import PhoneLink from '@/components/conversion/PhoneLink';
import { PLACEMENT_PHONE_DISPLAY } from '@/lib/placement-contact';

interface MidArticleCTAProps {
  variant?: 'default' | 'compact' | 'cost';
}

export default function MidArticleCTA({ variant = 'default' }: MidArticleCTAProps) {
  if (variant === 'cost') {
    return (
      <div className="bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200 rounded-2xl p-6 my-10">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-teal-700 font-semibold text-sm mb-2">
              <DollarSign className="h-4 w-4" />
              Ready to compare real options?
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Get matched to communities in your budget
            </h3>
            <p className="text-slate-600 text-sm">
              Our Cleveland advisors know current pricing and availability — free for families.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <PhoneLink
              placement="blog_mid_cost"
              className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-5 rounded-lg transition-colors min-h-[48px]"
            >
              <Phone className="h-4 w-4" />
              Call for Pricing Help
            </PhoneLink>
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3 px-5 rounded-lg border border-teal-200 transition-colors min-h-[48px]"
            >
              2-min assessment
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl p-4 my-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-white">
          <Phone className="h-5 w-5 flex-shrink-0" />
          <span className="font-medium">Need help with senior care decisions?</span>
        </div>
        <PhoneLink
          placement="blog_mid_compact"
          className="bg-white text-teal-700 font-semibold py-2 px-4 rounded-lg hover:bg-teal-50 transition-colors flex items-center gap-2 whitespace-nowrap min-h-[44px]"
        >
          Call {PLACEMENT_PHONE_DISPLAY}
          <ArrowRight className="h-4 w-4" />
        </PhoneLink>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200 rounded-2xl p-6 my-10">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Looking for Senior Living Options?
          </h3>
          <p className="text-slate-600">
            Talk to a Cleveland placement advisor—free for families. We&apos;ll call you with 3 matched communities.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <PhoneLink
            placement="blog_mid"
            className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-5 rounded-lg transition-colors min-h-[48px]"
          >
            <Phone className="h-4 w-4" />
            Get a Free Placement Call
          </PhoneLink>
          <Link
            href="/cleveland"
            className="inline-flex items-center justify-center bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3 px-5 rounded-lg border border-teal-200 transition-colors min-h-[48px]"
          >
            Browse Communities
          </Link>
        </div>
      </div>
    </div>
  );
}
