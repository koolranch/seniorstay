"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useAssessmentStore } from '@/store/assessmentStore';
import { assessmentQuestions } from '@/data/assessment-questions';
import ProgressIndicator from './ProgressIndicator';
import QuestionCard from './QuestionCard';
import NavigationButtons from './NavigationButtons';
import { trackQuestionAnswered, trackQuestionSkippedBack } from '@/components/analytics/AssessmentAnalytics';

export default function QuizContainer() {
  const { currentQuestionIndex, answers, setAnswer, nextQuestion, prevQuestion } = useAssessmentStore();
  
  const currentQuestion = assessmentQuestions[currentQuestionIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const isAnswered = currentAnswer !== undefined && currentAnswer !== null && currentAnswer !== '';

  const handleAnswer = (value: string | string[]) => {
    if (currentQuestion) {
      setAnswer(currentQuestion.id, value);
      trackQuestionAnswered(currentQuestion.id, currentQuestionIndex + 1);
    }
  };

  const handleBack = () => {
    trackQuestionSkippedBack(currentQuestionIndex + 1);
    prevQuestion();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Progress Indicator */}
        <div className="px-6 sm:px-8 pt-6 sm:pt-8">
          <ProgressIndicator
            current={currentQuestionIndex + 1}
            total={assessmentQuestions.length}
          />
        </div>

        {/* Question Card with Animation */}
        <div className="px-6 sm:px-8 py-6 sm:py-8">
          <AnimatePresence mode="wait">
            <QuestionCard
              key={currentQuestion?.id || currentQuestionIndex}
              question={currentQuestion}
              selectedAnswer={currentAnswer}
              onAnswer={handleAnswer}
            />
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="px-6 sm:px-8 pb-6 sm:pb-8 border-t border-gray-200 pt-6">
          <NavigationButtons
            onBack={handleBack}
            onNext={nextQuestion}
            isFirstQuestion={currentQuestionIndex === 0}
            isLastQuestion={currentQuestionIndex === assessmentQuestions.length - 1}
            isAnswered={isAnswered}
          />
        </div>
      </div>

      {/* Progress Hint */}
      <div className="text-center mt-6 text-sm text-gray-500">
        <p>Your progress is automatically saved. You can return anytime.</p>
      </div>
    </div>
  );
}

