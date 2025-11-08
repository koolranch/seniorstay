"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssessmentStore } from '@/store/assessmentStore';
import IntroScreen from './IntroScreen';
import QuizContainer from './QuizContainer';
import LoadingScreen from './LoadingScreen';
import ResultsScreen from './ResultsScreen';

type ScreenType = 'intro' | 'questions' | 'loading' | 'results';

export default function QuizFlow() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('intro');
  const { isComplete, isLoading, resetAssessment } = useAssessmentStore();

  // Determine which screen to show
  const getActiveScreen = (): ScreenType => {
    if (isComplete) return 'results';
    if (isLoading) return 'loading';
    if (currentScreen === 'intro') return 'intro';
    return 'questions';
  };

  const activeScreen = getActiveScreen();

  const handleStart = () => {
    setCurrentScreen('questions');
  };

  const handleRestart = () => {
    resetAssessment();
    setCurrentScreen('intro');
  };

  return (
    <AnimatePresence mode="wait">
      {activeScreen === 'intro' && (
        <motion.div
          key="intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <IntroScreen onStart={handleStart} />
        </motion.div>
      )}

      {activeScreen === 'questions' && (
        <motion.div
          key="questions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <QuizContainer />
        </motion.div>
      )}

      {activeScreen === 'loading' && (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <LoadingScreen />
        </motion.div>
      )}

      {activeScreen === 'results' && (
        <motion.div
          key="results"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ResultsScreen onRestart={handleRestart} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

