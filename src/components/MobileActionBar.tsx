"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  FiHome,
  FiSearch,
  FiHeart,
  FiPhone,
  FiMessageSquare
} from 'react-icons/fi';

/**
 * A mobile-optimized action bar that appears fixed at the bottom of the screen
 * with quick access to common actions
 */
const MobileActionBar = () => {
  const pathname = usePathname();
  const [lastScrollY, setLastScrollY] = useState(0);
  const [visible, setVisible] = useState(true);

  // Hide the bar when scrolling down, show when scrolling up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Don't hide when at the top or almost at the top
      if (currentScrollY < 100) {
        setVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }

      // Hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Don't show the bar on contact page since it has its own CTA form
  if (pathname === '/contact') {
    return null;
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-[#A7C4A0] z-40 transition-transform duration-300 md:hidden ${
      visible ? 'translate-y-0' : 'translate-y-full'
    }`}>
      <div className="grid grid-cols-4 py-2">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-2 text-xs ${
            pathname === '/' ? 'text-[#1b4d70] font-medium' : 'text-gray-500'
          }`}
        >
          <FiHome size={20} className="mb-1" />
          <span>Home</span>
        </Link>

        <Link
          href="/search"
          className={`flex flex-col items-center justify-center py-2 text-xs ${
            pathname === '/search' ? 'text-[#1b4d70] font-medium' : 'text-gray-500'
          }`}
        >
          <FiSearch size={20} className="mb-1" />
          <span>Search</span>
        </Link>

        <Link
          href="/compare"
          className={`flex flex-col items-center justify-center py-2 text-xs ${
            pathname === '/compare' ? 'text-[#1b4d70] font-medium' : 'text-gray-500'
          }`}
        >
          <FiHeart size={20} className="mb-1" />
          <span>Saved</span>
        </Link>

        <Link
          href="/contact"
          className={`flex flex-col items-center justify-center py-2 text-xs ${
            pathname === '/contact' ? 'text-[#1b4d70] font-medium' : 'text-gray-500'
          }`}
        >
          <FiMessageSquare size={20} className="mb-1" />
          <span>Contact</span>
        </Link>
      </div>

      {/* Floating Care Advisor CTA */}
      <div className="absolute -top-16 right-4">
        <Link
          href="/contact"
          className="flex items-center bg-[#1b4d70] text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium hover:bg-[#2F5061] transition"
        >
          <FiPhone className="mr-2" />
          <span>Care Advisor</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileActionBar;
