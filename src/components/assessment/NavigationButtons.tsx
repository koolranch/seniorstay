"use client";

import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationButtonsProps {
  onBack: () => void;
  onNext: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  isAnswered: boolean;
}

export default function NavigationButtons({
  onBack,
  onNext,
  isFirstQuestion,
  isLastQuestion,
  isAnswered,
}: NavigationButtonsProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      {/* Back Button */}
      <Button
        onClick={onBack}
        disabled={isFirstQuestion}
        variant="outline"
        size="lg"
        className={`
          flex items-center gap-2 px-6 py-3 rounded-xl font-semibold
          ${isFirstQuestion
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-gray-100'
          }
        `}
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="hidden sm:inline">Back</span>
      </Button>

      {/* Next Button */}
      <motion.div
        whileHover={isAnswered ? { scale: 1.02 } : {}}
        whileTap={isAnswered ? { scale: 0.98 } : {}}
      >
        <Button
          onClick={onNext}
          disabled={!isAnswered}
          size="lg"
          className={`
            flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white
            ${isAnswered
              ? 'bg-[#ff5a5f] hover:bg-[#ff4449] shadow-lg hover:shadow-xl'
              : 'bg-gray-300 cursor-not-allowed'
            }
          `}
        >
          <span>
            {isLastQuestion ? 'See My Results' : 'Next'}
          </span>
          <ArrowRight className="w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  );
}

