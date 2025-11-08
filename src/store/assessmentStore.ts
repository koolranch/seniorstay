import { create } from 'zustand';
import { assessmentQuestions } from '@/data/assessment-questions';
import { communityData } from '@/data/facilities';
import { 
  calculateScore, 
  getRecommendation, 
  matchCommunities,
  AssessmentAnswers 
} from '@/utils/assessmentScoring';
import type { Community } from '@/data/facilities';

interface RecommendationResult {
  recommendation: 'memory-care' | 'assisted-living' | 'both';
  title: string;
  description: string;
  costRange: string;
  reasons: string[];
}

interface AssessmentState {
  // State
  currentQuestionIndex: number;
  answers: AssessmentAnswers;
  isComplete: boolean;
  score: number;
  recommendation: RecommendationResult | null;
  matchedCommunities: Community[];
  isLoading: boolean;
  
  // Actions
  setAnswer: (questionId: string, answer: string | string[]) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  goToQuestion: (index: number) => void;
  completeAssessment: () => void;
  resetAssessment: () => void;
  hydrateFromStorage: () => void;
}

// Storage keys
const STORAGE_KEY = 'care-assessment-state';

// Helper to safely access localStorage
const getLocalStorage = () => {
  if (typeof window !== 'undefined') {
    return window.localStorage;
  }
  return null;
};

// Save state to localStorage
const saveToStorage = (state: Partial<AssessmentState>) => {
  const storage = getLocalStorage();
  if (storage) {
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify({
        currentQuestionIndex: state.currentQuestionIndex,
        answers: state.answers,
        isComplete: state.isComplete,
        score: state.score,
        recommendation: state.recommendation,
        matchedCommunities: state.matchedCommunities,
      }));
    } catch (error) {
      console.error('Failed to save assessment to localStorage:', error);
    }
  }
};

// Load state from localStorage
const loadFromStorage = (): Partial<AssessmentState> | null => {
  const storage = getLocalStorage();
  if (storage) {
    try {
      const saved = storage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load assessment from localStorage:', error);
    }
  }
  return null;
};

// Clear localStorage
const clearStorage = () => {
  const storage = getLocalStorage();
  if (storage) {
    try {
      storage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear assessment from localStorage:', error);
    }
  }
};

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
  // Initial state
  currentQuestionIndex: 0,
  answers: {},
  isComplete: false,
  score: 0,
  recommendation: null,
  matchedCommunities: [],
  isLoading: false,

  // Set answer for a question
  setAnswer: (questionId: string, answer: string | string[]) => {
    set((state) => {
      const newAnswers = { ...state.answers, [questionId]: answer };
      const newState = { ...state, answers: newAnswers };
      saveToStorage(newState);
      return newState;
    });
  },

  // Move to next question
  nextQuestion: () => {
    const state = get();
    const currentQuestion = assessmentQuestions[state.currentQuestionIndex];
    
    // Check if current question is answered
    if (!currentQuestion || !state.answers[currentQuestion.id]) {
      return; // Don't advance if question not answered
    }

    if (state.currentQuestionIndex < assessmentQuestions.length - 1) {
      set((state) => {
        const newState = { ...state, currentQuestionIndex: state.currentQuestionIndex + 1 };
        saveToStorage(newState);
        return newState;
      });
    } else {
      // Last question - trigger completion
      get().completeAssessment();
    }
  },

  // Move to previous question
  prevQuestion: () => {
    set((state) => {
      if (state.currentQuestionIndex > 0) {
        const newState = { ...state, currentQuestionIndex: state.currentQuestionIndex - 1 };
        saveToStorage(newState);
        return newState;
      }
      return state;
    });
  },

  // Go to specific question
  goToQuestion: (index: number) => {
    if (index >= 0 && index < assessmentQuestions.length) {
      set((state) => {
        const newState = { ...state, currentQuestionIndex: index };
        saveToStorage(newState);
        return newState;
      });
    }
  },

  // Complete the assessment
  completeAssessment: () => {
    set({ isLoading: true });
    
    const state = get();
    const score = calculateScore(state.answers);
    const recommendation = getRecommendation(score);
    const matchedCommunities = matchCommunities(
      communityData,
      recommendation.recommendation,
      state.answers
    );

    // Simulate brief loading for better UX
    setTimeout(() => {
      set((state) => {
        const newState = {
          ...state,
          isComplete: true,
          score,
          recommendation,
          matchedCommunities,
          isLoading: false,
        };
        saveToStorage(newState);
        return newState;
      });
    }, 2000); // 2 second loading animation
  },

  // Reset assessment to start over
  resetAssessment: () => {
    clearStorage();
    set({
      currentQuestionIndex: 0,
      answers: {},
      isComplete: false,
      score: 0,
      recommendation: null,
      matchedCommunities: [],
      isLoading: false,
    });
  },

  // Hydrate from localStorage
  hydrateFromStorage: () => {
    const saved = loadFromStorage();
    if (saved) {
      set((state) => ({
        ...state,
        ...saved,
        isLoading: false, // Always reset loading state
      }));
    }
  },
}));

