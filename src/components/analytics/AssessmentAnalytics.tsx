"use client";

import { useEffect } from 'react';

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'set',
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}

interface AssessmentAnalyticsProps {
  eventName: 
    | 'assessment_started'
    | 'question_answered'
    | 'question_skipped_back'
    | 'assessment_completed'
    | 'lead_form_submitted'
    | 'results_community_clicked'
    | 'assessment_restarted';
  eventData?: Record<string, unknown>;
}

/**
 * Assessment Analytics Component
 * Tracks key events throughout the assessment flow using Google Analytics
 */
export default function AssessmentAnalytics({ 
  eventName, 
  eventData = {} 
}: AssessmentAnalyticsProps) {
  useEffect(() => {
    // Check if gtag is available
    if (typeof window !== 'undefined' && window.gtag) {
      // Track the event
      window.gtag('event', eventName, {
        ...eventData,
        timestamp: new Date().toISOString(),
      });

      // Also log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Analytics Event:', eventName, eventData);
      }
    } else {
      // Log to console if gtag is not available
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Analytics Event (gtag not available):', eventName, eventData);
      }
    }
  }, [eventName, eventData]);

  // This component doesn't render anything
  return null;
}

/**
 * Helper functions to track specific assessment events
 */

export const trackAssessmentStarted = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'assessment_started', {
      event_category: 'assessment',
      event_label: 'Started',
      timestamp: new Date().toISOString(),
    });
  }
};

export const trackQuestionAnswered = (questionId: string, questionNumber: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'question_answered', {
      event_category: 'assessment',
      event_label: questionId,
      question_number: questionNumber,
      timestamp: new Date().toISOString(),
    });
  }
};

export const trackQuestionSkippedBack = (questionNumber: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'question_skipped_back', {
      event_category: 'assessment',
      event_label: 'Back Button',
      question_number: questionNumber,
      timestamp: new Date().toISOString(),
    });
  }
};

export const trackAssessmentCompleted = (
  score: number,
  recommendation: string,
  timeSpent?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'assessment_completed', {
      event_category: 'assessment',
      event_label: recommendation,
      score: score,
      time_spent_seconds: timeSpent,
      timestamp: new Date().toISOString(),
    });
  }
};

export const trackLeadFormSubmitted = (
  recommendation: string,
  matchedCommunities: string[]
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'lead_form_submitted', {
      event_category: 'assessment',
      event_label: 'Form Submitted',
      recommendation: recommendation,
      matched_communities_count: matchedCommunities.length,
      timestamp: new Date().toISOString(),
    });
  }
};

export const trackResultsCommunityClicked = (
  communityName: string,
  position: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'results_community_clicked', {
      event_category: 'assessment',
      event_label: communityName,
      position: position,
      timestamp: new Date().toISOString(),
    });
  }
};

export const trackAssessmentRestarted = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'assessment_restarted', {
      event_category: 'assessment',
      event_label: 'Restart',
      timestamp: new Date().toISOString(),
    });
  }
};

