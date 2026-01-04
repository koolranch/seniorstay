'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, MessageCircle } from 'lucide-react';

interface StickyMobileCTAProps {
  communityName: string;
  cityName: string;
}

export default function StickyMobileCTA({ communityName, cityName }: StickyMobileCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 300px
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  // Encode community name for URL parameter
  const communityParam = encodeURIComponent(communityName);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200 shadow-lg safe-area-pb">
      <div className="flex items-center gap-2 p-3">
        {/* Call Button */}
        <a
          href="tel:+12166774630"
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Phone className="h-4 w-4" />
          <span className="text-sm">Call Now</span>
        </a>

        {/* Speak to Advisor Button */}
        <Link
          href={`/contact?community=${communityParam}&city=${encodeURIComponent(cityName)}`}
          className="flex-1 flex items-center justify-center gap-2 bg-orange-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="text-sm">Speak to {cityName} Advisor</span>
        </Link>
      </div>

      {/* Safe area padding for iOS */}
      <style jsx>{`
        .safe-area-pb {
          padding-bottom: env(safe-area-inset-bottom, 0);
        }
      `}</style>
    </div>
  );
}



