"use client";

import { motion } from 'framer-motion';
import { AssessmentOption } from '@/data/assessment-questions';
import { CheckCircle2 } from 'lucide-react';

interface OptionButtonProps {
  option: AssessmentOption;
  isSelected: boolean;
  onClick: () => void;
}

export default function OptionButton({ option, isSelected, onClick }: OptionButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`
        w-full text-left p-4 sm:p-5 rounded-xl border-2 transition-all duration-200
        ${isSelected
          ? 'border-[#ff5a5f] bg-[#1e3a5f] text-white shadow-lg'
          : 'border-gray-200 bg-white text-gray-900 hover:border-[#ff5a5f] hover:shadow-md'
        }
      `}
    >
      <div className="flex items-start space-x-3">
        {/* Checkbox/Radio indicator */}
        <div className={`
          flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5
          ${isSelected
            ? 'border-[#ff5a5f] bg-[#ff5a5f]'
            : 'border-gray-300 bg-white'
          }
        `}>
          {isSelected && (
            <CheckCircle2 className="w-4 h-4 text-white" />
          )}
        </div>

        {/* Option content */}
        <div className="flex-1 space-y-1">
          <div className={`
            font-semibold text-base sm:text-lg
            ${isSelected ? 'text-white' : 'text-[#1e3a5f]'}
          `}>
            {option.label}
          </div>
          {option.description && (
            <div className={`
              text-sm
              ${isSelected ? 'text-gray-200' : 'text-gray-600'}
            `}>
              {option.description}
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
}

