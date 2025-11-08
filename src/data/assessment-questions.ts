export interface AssessmentOption {
  value: string;
  label: string;
  points: number;
  description?: string;
}

export interface AssessmentQuestion {
  id: string;
  type: 'single' | 'multiple';
  question: string;
  subtext?: string;
  options: AssessmentOption[];
}

// Simple 3-question assessment for quick implementation
export const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: 'primary-concern',
    type: 'single',
    question: "What's your primary concern for your loved one?",
    subtext: "This helps us understand your situation better",
    options: [
      {
        value: 'memory',
        label: 'Memory loss, confusion, or dementia',
        points: 5,
        description: 'Signs of Alzheimer\'s or memory impairment'
      },
      {
        value: 'daily-living',
        label: 'Needs help with daily activities',
        points: 1,
        description: 'Bathing, dressing, meals, medication'
      },
      {
        value: 'safety',
        label: 'Safety concerns at home',
        points: 3,
        description: 'Falls, wandering, or unsafe behaviors'
      },
      {
        value: 'isolation',
        label: 'Loneliness or social isolation',
        points: 0,
        description: 'Would benefit from community and activities'
      },
      {
        value: 'multiple',
        label: 'Multiple concerns / Not sure',
        points: 2,
        description: 'Need help figuring out the right care level'
      }
    ]
  },
  {
    id: 'dementia-diagnosis',
    type: 'single',
    question: "Has your loved one been diagnosed with Alzheimer's, dementia, or memory impairment?",
    subtext: "This is important for determining the right care environment",
    options: [
      {
        value: 'yes-advanced',
        label: 'Yes, moderate to advanced stage',
        points: 6,
        description: 'Requires specialized memory care'
      },
      {
        value: 'yes-early',
        label: 'Yes, early stage',
        points: 4,
        description: 'May need memory care or assisted living with support'
      },
      {
        value: 'suspected',
        label: 'Not diagnosed, but showing signs',
        points: 3,
        description: 'Consider evaluation and memory care options'
      },
      {
        value: 'no',
        label: 'No diagnosis',
        points: 0,
        description: 'Assisted living may be appropriate'
      },
      {
        value: 'unsure',
        label: 'Unsure / Need professional evaluation',
        points: 2,
        description: 'We can help connect you with resources'
      }
    ]
  },
  {
    id: 'budget-timeline',
    type: 'single',
    question: "What's your situation regarding timeline and budget?",
    subtext: "This helps us recommend the most appropriate options",
    options: [
      {
        value: 'immediate-any',
        label: 'Need care immediately, budget flexible',
        points: 0,
        description: 'Urgent situation, cost is secondary'
      },
      {
        value: 'immediate-budget',
        label: 'Need care immediately, budget limited ($3,000-$5,000/month)',
        points: 0,
        description: 'Looking for affordable immediate options'
      },
      {
        value: 'planning-comfortable',
        label: 'Planning ahead (1-6 months), comfortable budget',
        points: 0,
        description: 'Time to find the perfect fit'
      },
      {
        value: 'planning-budget',
        label: 'Planning ahead, concerned about costs',
        points: 0,
        description: 'Need to explore financial assistance options'
      },
      {
        value: 'researching',
        label: 'Just researching options',
        points: 0,
        description: 'Early in the decision process'
      }
    ]
  }
];

// Scoring interpretation
export function interpretScore(score: number): {
  recommendation: 'memory-care' | 'assisted-living' | 'both';
  title: string;
  description: string;
  costRange: string;
  reasons: string[];
} {
  if (score >= 7) {
    return {
      recommendation: 'memory-care',
      title: 'Memory Care',
      description: 'Based on your responses, specialized memory care would be most appropriate for your loved one. Memory care communities provide secure environments with trained staff specializing in dementia and Alzheimer\'s care.',
      costRange: '$5,000 - $8,500 per month in Cleveland',
      reasons: [
        'Shows significant signs of memory impairment',
        'May require secure environment for safety',
        'Benefits from specialized dementia care programs',
        'Needs 24/7 supervision and support'
      ]
    };
  } else if (score >= 3) {
    return {
      recommendation: 'both',
      title: 'Assisted Living with Memory Support (or Memory Care)',
      description: 'Your loved one may benefit from assisted living with memory care support, or early-stage memory care. We recommend touring both types to see which feels most appropriate.',
      costRange: '$3,500 - $7,000 per month in Cleveland',
      reasons: [
        'Some memory concerns present',
        'May need monitoring and assistance',
        'Could benefit from structured environment',
        'Flexible care needs that may increase'
      ]
    };
  } else {
    return {
      recommendation: 'assisted-living',
      title: 'Assisted Living',
      description: 'Based on your responses, assisted living appears most suitable. These communities provide help with daily activities while promoting independence and social engagement.',
      costRange: '$3,200 - $6,500 per month in Cleveland',
      reasons: [
        'Needs assistance with daily living tasks',
        'Would benefit from social activities',
        'Maintenance-free lifestyle preferred',
        'Personal care services available when needed'
      ]
    };
  }
}

