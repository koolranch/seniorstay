import { assessmentQuestions, interpretScore } from '@/data/assessment-questions';
import { Community } from '@/data/facilities';

export interface AssessmentAnswers {
  [questionId: string]: string | string[];
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

export function matchCommunities(
  communities: Community[],
  recommendation: 'memory-care' | 'assisted-living' | 'both',
  budget?: number
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

  // Sort by relevance (memory care communities first if that's the recommendation)
  if (recommendation === 'memory-care') {
    filtered.sort((a, b) => {
      const aHasMC = a.careTypes.includes('Memory Care');
      const bHasMC = b.careTypes.includes('Memory Care');
      if (aHasMC && !bHasMC) return -1;
      if (!aHasMC && bHasMC) return 1;
      return 0;
    });
  }

  // Return top 3 matches
  return filtered.slice(0, 3);
}

