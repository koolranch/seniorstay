import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Brain, 
  Heart, 
  Puzzle, 
  Activity, 
  Apple, 
  Moon, 
  Users, 
  Lightbulb,
  ArrowRight, 
  Phone,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  Home as HomeIcon
} from 'lucide-react';
import GlobalHeader from '@/components/home/GlobalHeader';
import Footer from '@/components/footer/Footer';

/**
 * Brain Health for Seniors Page
 * 
 * SEO Target Keywords:
 * - "brain puzzles for adults" (600 vol)
 * - "cognitive puzzles" (300 vol)
 * - "brain health for seniors" (related)
 * - "cognitive exercises for elderly" (related)
 * 
 * This page captures traffic from lost /blog/adult-brain-puzzles post
 * and supports memory care service pages.
 */

export const metadata: Metadata = {
  title: 'Brain Health for Seniors | Cognitive Exercises & Puzzles | Guide for Seniors',
  description: 'Discover brain puzzles for adults and cognitive exercises to maintain mental sharpness. Learn about brain health, dementia prevention, and when to consider memory care in Cleveland.',
  keywords: 'brain puzzles for adults, cognitive puzzles, brain health seniors, cognitive exercises elderly, dementia prevention, brain games seniors, mental health seniors, memory exercises',
  openGraph: {
    title: 'Brain Health for Seniors | Cognitive Exercises & Memory Tips',
    description: 'Brain puzzles, cognitive exercises, and expert guidance on maintaining mental sharpness for seniors.',
    url: 'https://guideforseniors.com/resources/brain-health',
    siteName: 'Guide for Seniors',
    locale: 'en_US',
    type: 'article',
  },
  alternates: {
    canonical: 'https://guideforseniors.com/resources/brain-health',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// FAQ Schema for featured snippets
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Do brain puzzles help prevent dementia?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'While brain puzzles cannot guarantee dementia prevention, research shows that regular cognitive activities may help build cognitive reserve and potentially delay the onset of symptoms. The Alzheimer\'s Association recommends engaging in mentally stimulating activities as part of a brain-healthy lifestyle. Combined with physical exercise, social engagement, and proper nutrition, brain puzzles can be part of an effective cognitive health strategy.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are the best brain exercises for seniors?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The best brain exercises for seniors include: 1) Crossword puzzles and word games for language skills, 2) Sudoku and number puzzles for logical thinking, 3) Memory matching games for recall, 4) Strategy games like chess for planning skills, 5) Learning new skills (language, instrument, technology), 6) Reading and discussing books, 7) Social activities that require conversation and interaction. Variety is key—challenging your brain in different ways provides the most benefit.',
      },
    },
    {
      '@type': 'Question',
      name: 'When should a senior consider memory care?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A senior should consider memory care when: 1) Safety becomes a concern due to wandering or leaving stove on, 2) Medication management becomes difficult, 3) Personal hygiene or nutrition declines significantly, 4) Caregiver burnout affects the family, 5) Social isolation increases at home, 6) Behavioral changes like aggression or paranoia emerge. Memory care communities in Cleveland offer specialized 24/7 care, secure environments, and cognitive therapy programs. A senior care advisor can help assess if memory care is appropriate.',
      },
    },
  ],
};

const BRAIN_HEALTH_PILLARS = [
  {
    id: 'cognitive',
    title: 'Mental Stimulation',
    description: 'Keep your brain active with puzzles, learning new skills, and challenging activities.',
    icon: <Puzzle className="h-8 w-8" />,
    iconBg: 'bg-violet-100 text-violet-600',
    tips: ['Do daily crosswords or Sudoku', 'Learn a new language or instrument', 'Read challenging books', 'Take online courses'],
  },
  {
    id: 'physical',
    title: 'Physical Exercise',
    description: 'Regular exercise increases blood flow to the brain and promotes new brain cell growth.',
    icon: <Activity className="h-8 w-8" />,
    iconBg: 'bg-teal-100 text-teal-600',
    tips: ['Walk 30 minutes daily', 'Try chair yoga or tai chi', 'Swimming is low-impact', 'Dance classes combine exercise and fun'],
  },
  {
    id: 'nutrition',
    title: 'Brain-Healthy Diet',
    description: 'The MIND diet combines Mediterranean and DASH diets for optimal brain health.',
    icon: <Apple className="h-8 w-8" />,
    iconBg: 'bg-green-100 text-green-600',
    tips: ['Eat leafy greens daily', 'Include fatty fish twice weekly', 'Berries for antioxidants', 'Limit processed foods and sugar'],
  },
  {
    id: 'sleep',
    title: 'Quality Sleep',
    description: 'During sleep, the brain clears toxins and consolidates memories.',
    icon: <Moon className="h-8 w-8" />,
    iconBg: 'bg-indigo-100 text-indigo-600',
    tips: ['Aim for 7-8 hours nightly', 'Keep consistent sleep schedule', 'Limit screens before bed', 'Create a dark, cool room'],
  },
  {
    id: 'social',
    title: 'Social Engagement',
    description: 'Meaningful social interactions protect against cognitive decline.',
    icon: <Users className="h-8 w-8" />,
    iconBg: 'bg-rose-100 text-rose-600',
    tips: ['Join clubs or groups', 'Regular family calls', 'Volunteer in community', 'Consider senior living for built-in community'],
  },
  {
    id: 'purpose',
    title: 'Purpose & Meaning',
    description: 'Having goals and feeling useful contributes to cognitive resilience.',
    icon: <Lightbulb className="h-8 w-8" />,
    iconBg: 'bg-amber-100 text-amber-600',
    tips: ['Set daily goals', 'Mentor younger people', 'Continue hobbies', 'Volunteer for causes you care about'],
  },
];

const WARNING_SIGNS = [
  'Forgetting recently learned information',
  'Difficulty planning or solving problems',
  'Confusion with time or place',
  'Trouble understanding visual images',
  'New problems with words in speaking or writing',
  'Misplacing things and losing ability to retrace steps',
  'Poor judgment with money or hygiene',
  'Withdrawal from social activities',
  'Changes in mood or personality',
  'Repeating the same questions frequently',
];

const BRAIN_PUZZLES = [
  { name: 'Crossword Puzzles', benefit: 'Language & Memory', difficulty: 'Easy-Hard' },
  { name: 'Sudoku', benefit: 'Logic & Concentration', difficulty: 'Easy-Expert' },
  { name: 'Jigsaw Puzzles', benefit: 'Visual-Spatial Skills', difficulty: 'Easy-Hard' },
  { name: 'Chess', benefit: 'Strategy & Planning', difficulty: 'Medium-Hard' },
  { name: 'Brain Training Apps', benefit: 'Varied Cognitive Skills', difficulty: 'Adaptive' },
  { name: 'Word Search', benefit: 'Pattern Recognition', difficulty: 'Easy-Medium' },
];

export default function BrainHealthPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <main className="min-h-screen flex flex-col">
        <GlobalHeader />

        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-violet-50 to-white py-16 md:py-24 overflow-hidden">
          <div className="absolute top-1/4 left-0 w-64 h-64 bg-violet-300 rounded-full mix-blend-multiply filter blur-xl opacity-10" />
          <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-10" />
          
          <div className="container mx-auto px-4 relative z-10 text-center">
            <span className="inline-block bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Cognitive Wellness
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6 max-w-4xl mx-auto">
              Brain Health for Seniors
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-700 mb-6">
              Cognitive Exercises, Brain Puzzles & Memory Tips
            </h2>
            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Discover evidence-based strategies to maintain mental sharpness, from brain puzzles to lifestyle changes that protect cognitive function as you age.
            </p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-violet-500" />
                <span>6 Pillars of Brain Health</span>
              </div>
              <div className="flex items-center gap-2">
                <Puzzle className="h-5 w-5 text-teal-500" />
                <span>Brain Exercises</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-rose-500" />
                <span>Memory Care Guide</span>
              </div>
            </div>
          </div>
        </section>

        {/* 6 Pillars of Brain Health */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-block bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Evidence-Based
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                The 6 Pillars of Brain Health
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Research shows that a combination of these factors provides the best protection for cognitive health as we age.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {BRAIN_HEALTH_PILLARS.map((pillar) => (
                <div 
                  key={pillar.id}
                  className="bg-slate-50 rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className={`${pillar.iconBg} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}>
                    {pillar.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{pillar.title}</h3>
                  <p className="text-slate-600 mb-4">{pillar.description}</p>
                  
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-2">Tips:</p>
                    <ul className="space-y-1">
                      {pillar.tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                          <CheckCircle className="h-4 w-4 text-teal-500 flex-shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Brain Puzzles Section */}
        <section className="py-16 md:py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <span className="inline-block bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  Mental Exercises
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  Brain Puzzles for Adults
                </h2>
                <p className="text-lg text-slate-600">
                  Regular cognitive challenges can help maintain mental acuity. Here are the most effective brain puzzles for seniors.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {BRAIN_PUZZLES.map((puzzle, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200"
                  >
                    <div className="bg-violet-100 text-violet-600 p-3 rounded-lg">
                      <Puzzle className="h-6 w-6" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-slate-900">{puzzle.name}</h3>
                      <p className="text-sm text-slate-600">{puzzle.benefit}</p>
                    </div>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                      {puzzle.difficulty}
                    </span>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Link
                  href="/resources/games-for-seniors"
                  className="inline-flex items-center text-teal-600 font-semibold hover:text-teal-700"
                >
                  Explore our full guide to free games for seniors
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Warning Signs */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-amber-100 text-amber-600 p-3 rounded-xl flex-shrink-0">
                    <AlertTriangle className="h-8 w-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                      Warning Signs of Cognitive Decline
                    </h2>
                    <p className="text-slate-600">
                      While some memory changes are normal with aging, these signs may indicate a need for professional evaluation.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {WARNING_SIGNS.map((sign, index) => (
                    <div key={index} className="flex items-start gap-2 text-slate-700">
                      <span className="bg-amber-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span>{sign}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-amber-200">
                  <p className="text-amber-800 font-medium">
                    If you notice these signs in yourself or a loved one, consult with a healthcare provider. Early detection allows for better planning and care.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Memory Care CTA */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-violet-600 to-violet-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <Brain className="h-12 w-12 mx-auto mb-4 opacity-80" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                When to Consider Memory Care
              </h2>
              <p className="text-lg text-violet-100 mb-8">
                Memory care communities in Cleveland provide specialized 24/7 care for seniors with Alzheimer&apos;s or dementia. They offer secure environments, trained staff, and cognitive therapy programs designed to maintain quality of life.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/memory-care-cleveland"
                  className="inline-flex items-center justify-center bg-white text-violet-700 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all text-base min-h-[56px]"
                >
                  Memory Care Guide
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center bg-violet-500 hover:bg-violet-400 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all text-base min-h-[56px]"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Talk to a Care Advisor
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Related Resources */}
        <section className="py-16 md:py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                Related Senior Resources
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Link 
                href="/resources/games-for-seniors"
                className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 group"
              >
                <Puzzle className="h-8 w-8 text-violet-600 mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                  Games for Seniors
                </h3>
                <p className="text-slate-600 text-sm">
                  Free online brain games, puzzles, and activities for cognitive health.
                </p>
              </Link>

              <Link 
                href="/memory-care-cleveland"
                className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 group"
              >
                <Brain className="h-8 w-8 text-rose-600 mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                  Memory Care Cleveland
                </h3>
                <p className="text-slate-600 text-sm">
                  Find specialized memory care communities for Alzheimer&apos;s and dementia.
                </p>
              </Link>

              <Link 
                href="/resources/social-activities"
                className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 group"
              >
                <Users className="h-8 w-8 text-teal-600 mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                  Social Activities
                </h3>
                <p className="text-slate-600 text-sm">
                  Places where seniors can meet others and stay socially engaged.
                </p>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}

