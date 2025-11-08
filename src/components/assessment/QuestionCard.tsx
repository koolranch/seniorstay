"use client";

import { motion } from 'framer-motion';
import { AssessmentQuestion } from '@/data/assessment-questions';
import OptionButton from './OptionButton';

interface QuestionCardProps {
  question: AssessmentQuestion;
  selectedAnswer: string | string[] | undefined;
  onAnswer: (value: string | string[]) => void;
}

export default function QuestionCard({ question, selectedAnswer, onAnswer }: QuestionCardProps) {
  const handleOptionClick = (value: string) => {
    if (question.type === 'single') {
      onAnswer(value);
    } else {
      // Multiple choice - toggle selection
      const currentAnswers = Array.isArray(selectedAnswer) ? selectedAnswer : [];
      if (currentAnswers.includes(value)) {
        onAnswer(currentAnswers.filter(v => v !== value));
      } else {
        onAnswer([...currentAnswers, value]);
      }
    }
  };

  const isSelected = (value: string): boolean => {
    if (question.type === 'single') {
      return selectedAnswer === value;
    } else {
      return Array.isArray(selectedAnswer) && selectedAnswer.includes(value);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Question Text */}
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1e3a5f]">
          {question.question}
        </h2>
        {question.subtext && (
          <p className="text-gray-600 text-base sm:text-lg">
            {question.subtext}
          </p>
        )}
      </div>

      {/* Multiple choice indicator */}
      {question.type === 'multiple' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            💡 You can select multiple options for this question
          </p>
        </div>
      )}

      {/* Options Grid */}
      <div className="grid grid-cols-1 gap-3">
        {question.options.map((option, index) => (
          <motion.div
            key={option.value}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <OptionButton
              option={option}
              isSelected={isSelected(option.value)}
              onClick={() => handleOptionClick(option.value)}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

