import { assessmentQuestions, interpretScore } from '@/data/assessment-questions';
import { Community } from '@/data/facilities';

export interface AssessmentAnswers {
  [questionId: string]: string | string[];
}

export interface BudgetRange {
  min: number;
  max: number;
  isFlexible: boolean;
}

export interface TimelineInfo {
  isImmediate: boolean;
  timeframe: string;
}

export function calculateScore(answers: AssessmentAnswers): number {
  let totalScore = 0;

  assessmentQuestions.forEach(question => {
    const answer = answers[question.id];
    
    if (question.type === 'single' && typeof answer === 'string') {
      const selectedOption = question.options.find(opt => opt.value === answer);
      if (selectedOption) {
        totalScore += selectedOption.points;
      }
    } else if (question.type === 'multiple' && Array.isArray(answer)) {
      answer.forEach(value => {
        const selectedOption = question.options.find(opt => opt.value === value);
        if (selectedOption) {
          totalScore += selectedOption.points;
        }
      });
    }
  });

  return totalScore;
}

export function getRecommendation(score: number) {
  return interpretScore(score);
}

/**
 * Extract budget range from assessment answers
 */
export function extractBudgetRange(answers: AssessmentAnswers): BudgetRange {
  const budgetAnswer = answers['budget-timeline'] as string;
  
  if (!budgetAnswer) {
    return { min: 3000, max: 8500, isFlexible: true };
  }

  switch (budgetAnswer) {
    case 'immediate-any':
      return { min: 3000, max: 10000, isFlexible: true };
    case 'immediate-budget':
      return { min: 3000, max: 5000, isFlexible: false };
    case 'planning-comfortable':
      return { min: 5000, max: 8000, isFlexible: true };
    case 'planning-budget':
      return { min: 3000, max: 5000, isFlexible: false };
    case 'researching':
      return { min: 3000, max: 8500, isFlexible: true };
    default:
      return { min: 3000, max: 8500, isFlexible: true };
  }
}

/**
 * Extract timeline urgency from assessment answers
 */
export function extractTimelineUrgency(answers: AssessmentAnswers): TimelineInfo {
  const budgetAnswer = answers['budget-timeline'] as string;
  
  if (!budgetAnswer) {
    return { isImmediate: false, timeframe: 'flexible' };
  }

  if (budgetAnswer.includes('immediate')) {
    return { isImmediate: true, timeframe: 'immediate' };
  } else if (budgetAnswer.includes('planning')) {
    return { isImmediate: false, timeframe: '1-6 months' };
  } else {
    return { isImmediate: false, timeframe: 'flexible' };
  }
}

/**
 * Extract community preferences from answers
 */
export function extractPreferences(answers: AssessmentAnswers): {
  prioritizeMemoryCare: boolean;
  prioritizeLocation: boolean;
  prioritizeActivities: boolean;
  prioritizeAmenities: boolean;
  prioritizeValue: boolean;
} {
  const priorityAnswer = answers['community-priorities'] as string;
  
  return {
    prioritizeMemoryCare: priorityAnswer === 'specialized-care',
    prioritizeLocation: priorityAnswer === 'location',
    prioritizeActivities: priorityAnswer === 'activities',
    prioritizeAmenities: priorityAnswer === 'amenities',
    prioritizeValue: priorityAnswer === 'value'
  };
}

/**
 * Enhanced community matching with budget and preferences
 */
export function matchCommunities(
  communities: Community[],
  recommendation: 'memory-care' | 'assisted-living' | 'both',
  answers?: AssessmentAnswers
): Community[] {
  let filtered = communities;

  // Filter by care type
  if (recommendation === 'memory-care') {
    filtered = filtered.filter(c => c.careTypes.includes('Memory Care'));
  } else if (recommendation === 'assisted-living') {
    filtered = filtered.filter(c => 
      c.careTypes.includes('Assisted Living') && 
      !c.careTypes.includes('Memory Care') // Prefer AL-only for non-memory cases
    );
  } else {
    // Both - show communities with both care types
    filtered = filtered.filter(c => 
      c.careTypes.includes('Memory Care') || c.careTypes.includes('Assisted Living')
    );
  }

  // If we have answers, apply preference-based sorting
  if (answers) {
    const preferences = extractPreferences(answers);
    
    filtered.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;

      // Priority 1: Match care type recommendation
      if (recommendation === 'memory-care') {
        scoreA += a.careTypes.includes('Memory Care') ? 100 : 0;
        scoreB += b.careTypes.includes('Memory Care') ? 100 : 0;
      }

      // Priority 2: Memory care specialization preference
      if (preferences.prioritizeMemoryCare) {
        scoreA += a.careTypes.includes('Memory Care') ? 50 : 0;
        scoreB += b.careTypes.includes('Memory Care') ? 50 : 0;
      }

      // Priority 3: Amenity count (if amenities are prioritized)
      if (preferences.prioritizeAmenities && a.amenities && b.amenities) {
        scoreA += a.amenities.length * 2;
        scoreB += b.amenities.length * 2;
      }

      // Priority 4: Has coordinates (better for location-focused users)
      if (preferences.prioritizeLocation) {
        scoreA += a.coordinates ? 20 : 0;
        scoreB += b.coordinates ? 20 : 0;
      }

      // Priority 5: Rating if available
      if (a.rating && b.rating) {
        scoreA += a.rating * 10;
        scoreB += b.rating * 10;
      }

      return scoreB - scoreA;
    });
  } else {
    // Default sorting by relevance
    if (recommendation === 'memory-care') {
      filtered.sort((a, b) => {
        const aHasMC = a.careTypes.includes('Memory Care');
        const bHasMC = b.careTypes.includes('Memory Care');
        if (aHasMC && !bHasMC) return -1;
        if (!aHasMC && bHasMC) return 1;
        return 0;
      });
    }
  }

  // Return top 3 matches
  return filtered.slice(0, 3);
}

/**
 * Generate a "why this matches" explanation for a community
 */
export function generateMatchReason(
  community: Community,
  answers: AssessmentAnswers,
  recommendation: 'memory-care' | 'assisted-living' | 'both'
): string {
  const reasons: string[] = [];

  // Memory care match
  if (recommendation === 'memory-care' && community.careTypes.includes('Memory Care')) {
    reasons.push('Specialized memory care program');
  }

  // Amenities
  if (community.amenities && community.amenities.length > 5) {
    reasons.push('Excellent amenities and services');
  }

  // Activities preference
  const preferences = extractPreferences(answers);
  if (preferences.prioritizeActivities) {
    reasons.push('Robust activity programs');
  }

  // Location
  if (preferences.prioritizeLocation && community.coordinates) {
    reasons.push('Convenient location in Greater Cleveland');
  }

  // Default reasons
  if (reasons.length === 0) {
    reasons.push('Highly rated community');
    reasons.push('Strong care programs');
  }

  return reasons.slice(0, 2).join(' • ');
}

