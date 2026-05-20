'use client';

import Link from 'next/link';
import { Phone, MessageSquare } from 'lucide-react';
import PhoneLink from '@/components/conversion/PhoneLink';
import { PLACEMENT_PHONE_DISPLAY } from '@/lib/placement-contact';

/** Fixed bottom bar on mobile — call-first placement CTA */
export default function PlacementStickyCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] safe-area-pb">
      <div className="flex gap-2 p-3 max-w-lg mx-auto">
        <PhoneLink
          placement="sticky_mobile"
          className="flex-1 flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 px-4 rounded-xl min-h-[48px]"
        >
          <Phone className="h-5 w-5 shrink-0" />
          <span className="text-sm">Call Now</span>
        </PhoneLink>
        <Link
          href="/contact?intent=placement"
          className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3.5 px-4 rounded-xl min-h-[48px] text-sm"
        >
          <MessageSquare className="h-5 w-5 shrink-0" />
          Request Call
        </Link>
      </div>
      <p className="text-center text-[10px] text-slate-400 pb-2 -mt-1">
        {PLACEMENT_PHONE_DISPLAY} · Free placement help
      </p>
    </div>
  );
}
