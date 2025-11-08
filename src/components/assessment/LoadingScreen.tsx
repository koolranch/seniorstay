"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const loadingMessages = [
  "Analyzing your answers...",
  "Matching you with communities...",
  "Preparing your personalized results...",
];

export default function LoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[600px] flex items-center justify-center px-4">
      <div className="text-center space-y-8">
        {/* Animated spinner */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex justify-center"
        >
          <div className="relative">
            <Loader2 className="w-16 h-16 text-[#ff5a5f] animate-spin" />
            {/* Pulsing ring */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.2, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-full border-4 border-[#ff5a5f]"
            />
          </div>
        </motion.div>

        {/* Animated message */}
        <div className="h-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={messageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-xl sm:text-2xl font-semibold text-[#1e3a5f]"
            >
              {loadingMessages[messageIndex]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center space-x-2">
          {loadingMessages.map((_, index) => (
            <motion.div
              key={index}
              animate={{
                scale: index === messageIndex ? 1.2 : 1,
                opacity: index === messageIndex ? 1 : 0.3,
              }}
              className="w-2 h-2 rounded-full bg-[#ff5a5f]"
            />
          ))}
        </div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-600"
        >
          This will only take a moment...
        </motion.p>
      </div>
    </div>
  );
}

