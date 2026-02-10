"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ZipTourScheduler from './ZipTourScheduler';

export default function ScheduleTourFAB() {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show FAB after scrolling 400px
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible && !isOpen) return null;

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Button
            onClick={() => setIsOpen(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-2xl hover:shadow-teal-500/50 transition-all duration-300 hover:scale-105 group"
            size="lg"
          >
            <Calendar className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Schedule Tours</span>
            <span className="sm:hidden">Tours</span>
          </Button>
        </div>
      )}

      {/* Full-Screen Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-white">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Schedule Community Tours</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="pb-20">
            <ZipTourScheduler />
          </div>
        </div>
      )}
    </>
  );
}

