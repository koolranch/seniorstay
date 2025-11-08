"use client";

import { motion } from 'framer-motion';

interface ProgressIndicatorProps {
  current: number;
  total: number;
}

export default function ProgressIndicator({ current, total }: ProgressIndicatorProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="space-y-3">
      {/* Progress text */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-[#1e3a5f]">
          Question {current} of {total}
        </span>
        <span className="text-gray-600">
          {Math.round(percentage)}% complete
        </span>
      </div>

      {/* Progress bar */}
      <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#ff5a5f] to-[#ff7a7d] rounded-full"
        />
      </div>

      {/* Optional: Step indicators */}
      <div className="flex justify-between">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`
              w-2 h-2 rounded-full transition-colors duration-200
              ${i < current ? 'bg-[#ff5a5f]' : 'bg-gray-300'}
            `}
          />
        ))}
      </div>
    </div>
  );
}

