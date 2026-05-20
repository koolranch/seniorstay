'use client';

import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import PhoneLink from '@/components/conversion/PhoneLink';
import { PLACEMENT_PHONE_DISPLAY } from '@/lib/placement-contact';

interface PlacementHeroCTAsProps {
  browseHref?: string;
  browseLabel?: string;
  guideHref?: string;
  guideLabel?: string;
  variant?: 'light' | 'dark';
  className?: string;
}

export default function PlacementHeroCTAs({
  browseHref = '#communities',
  browseLabel = 'Browse Communities',
  guideHref,
  guideLabel = 'Read Complete Guide',
  variant = 'light',
  className = '',
}: PlacementHeroCTAsProps) {
  const secondaryClass =
    variant === 'light'
      ? 'inline-flex items-center justify-center bg-white border-2 border-slate-300 text-slate-700 hover:border-teal-500 hover:text-teal-600 font-bold px-8 py-4 rounded-xl transition-colors min-h-[56px]'
      : 'inline-flex items-center justify-center bg-white/10 border-2 border-white/40 text-white hover:bg-white/20 font-bold px-8 py-4 rounded-xl transition-colors min-h-[56px]';

  const guideClass =
    variant === 'light'
      ? 'text-teal-600 hover:text-teal-700 font-semibold underline-offset-2 hover:underline'
      : 'text-white/80 hover:text-white font-semibold underline-offset-2 hover:underline';

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-xl mx-auto">
        <PhoneLink
          placement="hero_primary"
          className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-lg hover:shadow-xl min-h-[56px] flex-1 sm:flex-none"
        >
          <Phone className="h-5 w-5 shrink-0" />
          <span>Get a Free Placement Call</span>
        </PhoneLink>
        <Link href={browseHref} className={secondaryClass}>
          {browseLabel}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
      <p className={`text-sm ${variant === 'light' ? 'text-slate-500' : 'text-white/60'}`}>
        Call {PLACEMENT_PHONE_DISPLAY} · Local advisors · 100% free for families
      </p>
      {guideHref && (
        <Link href={guideHref} className={guideClass}>
          {guideLabel}
        </Link>
      )}
    </div>
  );
}
