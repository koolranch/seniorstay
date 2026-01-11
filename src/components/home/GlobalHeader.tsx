'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, Menu, X, Home, ChevronDown } from 'lucide-react';

/**
 * Global Header - Clean, Minimal Design
 * Logo left, CTA right with phone number
 */

const GlobalHeader: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-sm shadow-md' 
          : 'bg-white'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="bg-gradient-to-br from-teal-600 to-teal-700 p-2 rounded-lg shadow-md group-hover:shadow-lg transition-all">
              <Home className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                Guide for Seniors
              </span>
              <span className="text-xs text-slate-500 hidden sm:block">
                Cleveland Senior Living Experts
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link 
              href="/greater-cleveland" 
              className="text-slate-600 hover:text-teal-600 font-medium transition-colors"
            >
              Browse Communities
            </Link>
            <Link 
              href="/events" 
              className="text-slate-600 hover:text-teal-600 font-medium transition-colors"
            >
              Local Events
            </Link>
            <Link 
              href="/assessment" 
              className="text-slate-600 hover:text-teal-600 font-medium transition-colors"
            >
              Care Assessment
            </Link>
            <Link 
              href="/resources" 
              className="text-slate-600 hover:text-teal-600 font-medium transition-colors"
            >
              Resources
            </Link>
            <Link 
              href="/about" 
              className="text-slate-600 hover:text-teal-600 font-medium transition-colors"
            >
              About
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="flex items-center gap-3">
            {/* Phone - Desktop */}
            <a
              href="tel:+12166774630"
              className="hidden md:flex items-center gap-2 text-slate-700 hover:text-teal-600 font-medium transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>(216) 677-4630</span>
            </a>

            {/* Talk to Expert Button */}
            <a
              href="tel:+12166774630"
              className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <Phone className="h-4 w-4" />
              <span>Talk to a Local Expert</span>
            </a>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 py-4">
            <nav className="flex flex-col gap-2">
              <Link 
                href="/greater-cleveland" 
                className="px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Browse Communities
              </Link>
              <Link 
                href="/events" 
                className="px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Local Events
              </Link>
              <Link 
                href="/assessment" 
                className="px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Care Assessment
              </Link>
              <Link 
                href="/resources" 
                className="px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Resources
              </Link>
              <Link 
                href="/about" 
                className="px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <hr className="my-2" />
              <a
                href="tel:+12166774630"
                className="mx-4 flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-bold px-6 py-3 rounded-lg shadow-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Phone className="h-5 w-5" />
                <span>Call (216) 677-4630</span>
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default GlobalHeader;

