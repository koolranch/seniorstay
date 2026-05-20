'use client';

import Link from 'next/link';
import { Phone, ArrowRight } from 'lucide-react';
import PhoneLink from '@/components/conversion/PhoneLink';
import { PLACEMENT_PHONE_DISPLAY } from '@/lib/placement-contact';

interface MidArticleCTAProps {
  variant?: 'default' | 'compact';
}

export default function MidArticleCTA({ variant = 'default' }: MidArticleCTAProps) {
  if (variant === 'compact') {
    return (
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 my-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-white">
          <Phone className="h-5 w-5 flex-shrink-0" />
          <span className="font-medium">Need help with senior care decisions?</span>
        </div>
        <PhoneLink
          placement="blog_mid_compact"
          className="bg-white text-orange-600 font-semibold py-2 px-4 rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          Call {PLACEMENT_PHONE_DISPLAY}
          <ArrowRight className="h-4 w-4" />
        </PhoneLink>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-6 my-10">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Looking for Senior Living Options?
          </h3>
          <p className="text-gray-600">
            Talk to a Cleveland placement advisor—free for families. We&apos;ll call you with 3 matched communities.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <PhoneLink
            placement="blog_mid"
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-5 rounded-lg transition-colors text-center flex items-center justify-center gap-2"
          >
            <Phone className="h-4 w-4" />
            Get a Free Placement Call
          </PhoneLink>
          <Link
            href="/cleveland"
            className="bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-5 rounded-lg border border-gray-300 transition-colors text-center"
          >
            Browse Communities
          </Link>
        </div>
      </div>
    </div>
  );
}
