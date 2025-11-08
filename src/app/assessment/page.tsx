"use client";

import { useEffect } from 'react';
import { useAssessmentStore } from '@/store/assessmentStore';
import QuizFlow from '@/components/assessment/QuizFlow';

export default function AssessmentPage() {
  const hydrateFromStorage = useAssessmentStore((state) => state.hydrateFromStorage);

  // Hydrate from localStorage on mount
  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  return (
    <div className="min-h-screen bg-gray-50">
      <QuizFlow />
    </div>
  );
}

