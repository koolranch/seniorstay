'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

interface FloatingInquiryButtonProps {
  onClick: () => void;
  hidden?: boolean;
}

export default function FloatingInquiryButton({ onClick, hidden = false }: FloatingInquiryButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showPulse, setShowPulse] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Stop pulse animation after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  if (hidden) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-32 right-5 z-40 md:bottom-8 md:right-6"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          {/* Pulse ring */}
          {showPulse && (
            <span className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ backgroundColor: '#8DA399' }} />
          )}

          <button
            onClick={onClick}
            className="relative flex items-center gap-2 px-5 py-3.5 rounded-full text-white font-semibold shadow-xl hover:shadow-2xl transition-shadow"
            style={{
              background: 'linear-gradient(135deg, #5a7d6a 0%, #4a6d5a 100%)',
            }}
            aria-label="Ask a question about this community"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="hidden sm:inline text-sm">Ask a Question</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
