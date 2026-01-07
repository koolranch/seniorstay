'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, X, ChevronUp } from 'lucide-react';

interface StickyCalculatorCTAProps {
  cityName?: string;
}

/**
 * Sticky mobile CTA that appears on location pages
 * Links to the affordability calculator section
 */
export default function StickyCalculatorCTA({ cityName }: StickyCalculatorCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [hasScrolledPast, setHasScrolledPast] = useState(false);

  useEffect(() => {
    // Don't show on desktop
    const isMobile = window.innerWidth < 768;
    if (!isMobile) return;

    // Check if user has dismissed before in this session
    const dismissed = sessionStorage.getItem('calculator-cta-dismissed');
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      
      // Show after scrolling past first viewport
      if (scrollY > viewportHeight * 0.5 && !hasScrolledPast) {
        setHasScrolledPast(true);
        setIsVisible(true);
      }
      
      // Hide when near calculator section
      const calculatorSection = document.getElementById('affordability-calculator');
      if (calculatorSection) {
        const rect = calculatorSection.getBoundingClientRect();
        const isNearCalculator = rect.top < viewportHeight && rect.bottom > 0;
        if (isNearCalculator) {
          setIsVisible(false);
        } else if (hasScrolledPast && !isDismissed) {
          setIsVisible(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasScrolledPast, isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
    sessionStorage.setItem('calculator-cta-dismissed', 'true');
  };

  const handleClick = () => {
    const calculatorSection = document.getElementById('affordability-calculator');
    if (calculatorSection) {
      calculatorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsVisible(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && !isDismissed && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        >
          {/* Gradient fade at top */}
          <div className="h-4 bg-gradient-to-t from-white to-transparent" />
          
          <div className="bg-white border-t border-slate-200 shadow-lg px-4 py-3">
            <div className="flex items-center gap-3">
              {/* Icon */}
              <div className="flex-shrink-0 p-2 bg-teal-100 rounded-full">
                <Calculator className="h-5 w-5 text-teal-600" />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 leading-tight">
                  Is Assisted Living cheaper than staying home?
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {cityName ? `${cityName} 2026 costs` : 'Cleveland 2026 costs'}
                </p>
              </div>
              
              {/* CTA Button */}
              <button
                onClick={handleClick}
                className="flex-shrink-0 px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg
                         hover:bg-teal-700 active:bg-teal-800 transition-colors
                         flex items-center gap-1"
              >
                Try Calculator
                <ChevronUp className="h-4 w-4" />
              </button>
              
              {/* Dismiss Button */}
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Dismiss"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

