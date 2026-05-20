'use client';

import React from 'react';
import { trackPhoneClick } from '@/components/analytics/GoogleAnalytics';

interface PhoneLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  placement: string;
  phoneTel?: string;
}

export default function PhoneLink({
  placement,
  phoneTel = 'tel:+12166774630',
  onClick,
  children,
  ...props
}: PhoneLinkProps) {
  return (
    <a
      href={phoneTel}
      onClick={(e) => {
        trackPhoneClick(placement);
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </a>
  );
}
