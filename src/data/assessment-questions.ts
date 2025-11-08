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

// Professional 8-question assessment for comprehensive care level determination
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
    id: 'mobility-falls',
    type: 'single',
    question: "How would you describe their mobility and fall risk?",
    subtext: "Understanding physical abilities helps us recommend the right level of support",
    options: [
      {
        value: 'independent',
        label: 'Fully mobile and independent',
        points: 0,
        description: 'Walks without assistance, no fall history'
      },
      {
        value: 'minor-assistance',
        label: 'Mostly independent, occasional assistance needed',
        points: 1,
        description: 'Uses cane or walker, rare falls'
      },
      {
        value: 'regular-assistance',
        label: 'Needs regular assistance with mobility',
        points: 2,
        description: 'Uses walker or wheelchair, history of falls'
      },
      {
        value: 'significant-risk',
        label: 'Significant fall risk or mobility challenges',
        points: 3,
        description: 'Frequent falls, requires close supervision'
      },
      {
        value: 'wheelchair-bound',
        label: 'Uses wheelchair full-time or bedbound',
        points: 2,
        description: 'Requires assistance with transfers'
      }
    ]
  },
  {
    id: 'medical-needs',
    type: 'single',
    question: "What level of medical support is needed?",
    subtext: "This helps determine if skilled nursing care is necessary",
    options: [
      {
        value: 'minimal',
        label: 'Minimal - takes few medications independently',
        points: 0,
        description: 'Generally healthy, rare doctor visits'
      },
      {
        value: 'medication-management',
        label: 'Medication reminders and management needed',
        points: 1,
        description: 'Multiple medications, needs reminders'
      },
      {
        value: 'regular-monitoring',
        label: 'Regular health monitoring required',
        points: 2,
        description: 'Chronic conditions like diabetes, heart disease'
      },
      {
        value: 'skilled-nursing',
        label: 'Skilled nursing care needed',
        points: 4,
        description: 'Wound care, injections, or specialized medical needs'
      },
      {
        value: 'hospice-palliative',
        label: 'Hospice or palliative care',
        points: 3,
        description: 'End-of-life or comfort care focus'
      }
    ]
  },
  {
    id: 'behavioral-challenges',
    type: 'single',
    question: "Are there any behavioral or psychological challenges?",
    subtext: "Specialized memory care may be needed for certain behaviors",
    options: [
      {
        value: 'none',
        label: 'No behavioral concerns',
        points: 0,
        description: 'Calm, cooperative, follows directions'
      },
      {
        value: 'mild-confusion',
        label: 'Mild confusion or repetitive questions',
        points: 2,
        description: 'Sometimes forgetful but manageable'
      },
      {
        value: 'wandering',
        label: 'Wandering or exit-seeking behavior',
        points: 5,
        description: 'May try to leave, needs secure environment'
      },
      {
        value: 'aggression',
        label: 'Aggression, agitation, or combative behavior',
        points: 5,
        description: 'Verbal or physical outbursts, resists care'
      },
      {
        value: 'sundowning',
        label: 'Sundowning or significant anxiety',
        points: 4,
        description: 'Increased confusion and agitation in evening'
      }
    ]
  },
  {
    id: 'family-involvement',
    type: 'single',
    question: "How involved will family be in day-to-day care?",
    subtext: "This helps us understand your support needs and preferences",
    options: [
      {
        value: 'very-close',
        label: 'Very involved - I live nearby and will visit often',
        points: 0,
        description: 'Within 15 minutes, can visit multiple times per week'
      },
      {
        value: 'regular-visits',
        label: 'Regular visits - I live in the area',
        points: 0,
        description: 'Within 30-60 minutes, weekly visits planned'
      },
      {
        value: 'occasional-visits',
        label: 'Occasional visits - I live out of town',
        points: 0,
        description: 'Long distance, monthly or holiday visits'
      },
      {
        value: 'long-distance',
        label: 'Long distance - need community to be primary support',
        points: 0,
        description: 'Out of state, need excellent staff communication'
      },
      {
        value: 'no-family',
        label: 'Limited or no family involvement',
        points: 0,
        description: 'Community will be primary support system'
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
        label: 'Planning ahead (1-6 months), comfortable budget ($5,000-$8,000/month)',
        points: 0,
        description: 'Time to find the perfect fit'
      },
      {
        value: 'planning-budget',
        label: 'Planning ahead, concerned about costs ($3,000-$5,000/month)',
        points: 0,
        description: 'Need to explore financial assistance options'
      },
      {
        value: 'researching',
        label: 'Just researching options, timeline flexible',
        points: 0,
        description: 'Early in the decision process'
      }
    ]
  },
  {
    id: 'community-priorities',
    type: 'single',
    question: "What matters most to you in a senior living community?",
    subtext: "Help us match you with communities that fit your values",
    options: [
      {
        value: 'specialized-care',
        label: 'Specialized memory care expertise',
        points: 3,
        description: 'Staff training, secure environment, dementia programs'
      },
      {
        value: 'location',
        label: 'Location and proximity to family',
        points: 0,
        description: 'Close to home, familiar neighborhood'
      },
      {
        value: 'activities',
        label: 'Robust activities and social engagement',
        points: 0,
        description: 'Daily programs, outings, entertainment'
      },
      {
        value: 'amenities',
        label: 'Luxury amenities and services',
        points: 0,
        description: 'Fine dining, spa, fitness center, beautiful grounds'
      },
      {
        value: 'value',
        label: 'Best value and affordability',
        points: 0,
        description: 'Quality care at reasonable cost'
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

