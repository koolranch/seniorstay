import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Brain, 
  Gamepad2, 
  Heart, 
  Users, 
  Clock, 
  Shield, 
  Sparkles, 
  ArrowRight, 
  Phone,
  CheckCircle,
  Puzzle,
  MessageSquare,
  BookOpen,
  Home as HomeIcon
} from 'lucide-react';
import GlobalHeader from '@/components/home/GlobalHeader';
import Footer from '@/components/footer/Footer';

/**
 * Games for Seniors Resource Page
 * 
 * SEO Target Keywords:
 * - "free games for seniors" (1,000 vol)
 * - "online games for seniors" (400 vol)
 * - "brain puzzles for adults" (600 vol)
 * - "free games for seniors to play alone" (450 vol)
 * 
 * This page recaptures traffic from the lost /blog/senior-online-games post
 * that had 309 referring domains.
 */

export const metadata: Metadata = {
  title: 'Free Online Games for Seniors | Brain Games & Puzzles | Guide for Seniors',
  description: 'Discover the best free online games for seniors. From brain puzzles to card games, find engaging activities perfect for cognitive health and entertainment. Cleveland senior resource.',
  keywords: 'free games for seniors, online games for seniors, brain puzzles for adults, senior games, games for elderly, free games for seniors to play alone, cognitive games for seniors, brain games for seniors',
  openGraph: {
    title: 'Free Online Games for Seniors | Brain Games & Puzzles',
    description: 'Discover the best free online games for seniors. Brain puzzles, card games, and engaging activities for cognitive health.',
    url: 'https://guideforseniors.com/resources/games-for-seniors',
    siteName: 'Guide for Seniors',
    locale: 'en_US',
    type: 'article',
  },
  alternates: {
    canonical: 'https://guideforseniors.com/resources/games-for-seniors',
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
      name: 'What are the best free online games for seniors?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The best free online games for seniors include: 1) Brain puzzles like Sudoku and crosswords for cognitive health, 2) Card games like Solitaire and Bridge for mental stimulation, 3) Word games like Wordle and Scrabble for vocabulary, 4) Memory matching games for cognitive exercise, and 5) Trivia games for social engagement. Many senior living communities in Cleveland also offer group gaming activities.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are brain games good for seniors?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, brain games are excellent for seniors. Research shows that regular cognitive activities like puzzles, word games, and memory exercises can help maintain mental sharpness, potentially delay cognitive decline, reduce stress, and provide social engagement opportunities. Many Cleveland memory care communities incorporate brain games into their daily programming.',
      },
    },
    {
      '@type': 'Question',
      name: 'What games can seniors play alone?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Seniors can enjoy many solo games including: Solitaire (classic card game), Sudoku (number puzzles), Crossword puzzles, Jigsaw puzzles (online or physical), Word search games, Mahjong solitaire, and brain training apps like Lumosity or BrainHQ. These games are perfect for seniors who prefer independent activities or live alone.',
      },
    },
  ],
};

// Article Schema
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Free Online Games for Seniors: Brain Games & Puzzles Guide',
  description: 'Comprehensive guide to the best free online games for seniors, including brain puzzles, card games, and cognitive exercises.',
  author: {
    '@type': 'Organization',
    name: 'Guide for Seniors',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Guide for Seniors',
    url: 'https://guideforseniors.com',
  },
  datePublished: '2024-01-01',
  dateModified: new Date().toISOString().split('T')[0],
};

const GAME_CATEGORIES = [
  {
    id: 'brain-puzzles',
    title: 'Brain Puzzles & Logic Games',
    description: 'Challenge your mind with puzzles that improve problem-solving skills and cognitive function.',
    icon: <Puzzle className="h-8 w-8" />,
    iconBg: 'bg-violet-100 text-violet-600',
    games: ['Sudoku', 'Crossword Puzzles', 'Logic Grid Puzzles', 'Chess', 'Lumosity'],
    benefit: 'Improves logical thinking and memory',
  },
  {
    id: 'card-games',
    title: 'Card Games',
    description: 'Classic card games that provide hours of entertainment and mental stimulation.',
    icon: <Gamepad2 className="h-8 w-8" />,
    iconBg: 'bg-rose-100 text-rose-600',
    games: ['Solitaire', 'Bridge', 'Hearts', 'Spades', 'Freecell'],
    benefit: 'Enhances strategic thinking',
  },
  {
    id: 'word-games',
    title: 'Word & Vocabulary Games',
    description: 'Expand your vocabulary and keep your language skills sharp.',
    icon: <BookOpen className="h-8 w-8" />,
    iconBg: 'bg-teal-100 text-teal-600',
    games: ['Wordle', 'Scrabble GO', 'Word Search', 'Boggle', 'Words with Friends'],
    benefit: 'Maintains verbal fluency',
  },
  {
    id: 'memory-games',
    title: 'Memory & Matching Games',
    description: 'Exercise your memory with fun matching and recall activities.',
    icon: <Brain className="h-8 w-8" />,
    iconBg: 'bg-amber-100 text-amber-600',
    games: ['Memory Match', 'Simon Says', 'Concentration', 'Pattern Recognition', 'BrainHQ'],
    benefit: 'Strengthens short-term memory',
  },
  {
    id: 'trivia',
    title: 'Trivia & Knowledge Games',
    description: 'Test your knowledge and learn new facts with engaging trivia games.',
    icon: <MessageSquare className="h-8 w-8" />,
    iconBg: 'bg-cyan-100 text-cyan-600',
    games: ['Jeopardy!', 'Trivia Crack', 'QuizUp', 'Who Wants to Be a Millionaire', 'History Trivia'],
    benefit: 'Stimulates recall and learning',
  },
  {
    id: 'social-games',
    title: 'Social & Multiplayer Games',
    description: 'Connect with friends and family through games you can play together.',
    icon: <Users className="h-8 w-8" />,
    iconBg: 'bg-green-100 text-green-600',
    games: ['Words with Friends', 'Chess.com', 'Online Bingo', 'Rummy Online', 'Draw Something'],
    benefit: 'Reduces isolation and loneliness',
  },
];

const COGNITIVE_BENEFITS = [
  {
    title: 'Improved Memory',
    description: 'Regular brain games help maintain and improve short-term and long-term memory functions.',
    icon: <Brain className="h-6 w-6" />,
  },
  {
    title: 'Enhanced Problem-Solving',
    description: 'Puzzles and strategy games strengthen analytical thinking and decision-making skills.',
    icon: <Puzzle className="h-6 w-6" />,
  },
  {
    title: 'Reduced Stress',
    description: 'Engaging in enjoyable activities releases endorphins and reduces anxiety levels.',
    icon: <Heart className="h-6 w-6" />,
  },
  {
    title: 'Social Connection',
    description: 'Multiplayer games provide opportunities to connect with family and friends.',
    icon: <Users className="h-6 w-6" />,
  },
];

export default function GamesForSeniorsPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([faqSchema, articleSchema]),
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
              Senior Activities & Entertainment
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6 max-w-4xl mx-auto">
              Free Online Games for Seniors
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Keep your mind sharp and have fun with our curated collection of brain games, puzzles, and activities designed for seniors. All games are free to play online.
            </p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-violet-500" />
                <span>50+ Free Games</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-teal-500" />
                <span>Cognitive Benefits</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" />
                <span>Play Anytime</span>
              </div>
            </div>
          </div>
        </section>

        {/* Why Brain Games Matter */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <span className="inline-block bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  The Science
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  Why Brain Games Matter for Seniors
                </h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  Research shows that regular mental stimulation through games and puzzles can help maintain cognitive function and improve quality of life for seniors.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {COGNITIVE_BENEFITS.map((benefit, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-200"
                  >
                    <div className="bg-teal-100 text-teal-600 p-3 rounded-xl">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{benefit.title}</h3>
                      <p className="text-slate-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Medical Authority Note */}
              <div className="mt-10 p-6 bg-blue-50 border-l-4 border-blue-500 rounded-xl">
                <p className="text-blue-800">
                  <strong>According to the Alzheimer&apos;s Association:</strong> Engaging in mentally stimulating activities throughout life may help build cognitive reserve, potentially delaying the onset of dementia symptoms.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Game Categories */}
        <section className="py-16 md:py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-block bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Game Categories
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Find the Perfect Games for You
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Whether you prefer puzzles, cards, or social games, we have something for everyone.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {GAME_CATEGORIES.map((category) => (
                <div 
                  key={category.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className={`${category.iconBg} w-16 h-16 rounded-xl flex items-center justify-center mb-4`}>
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{category.title}</h3>
                  <p className="text-slate-600 mb-4">{category.description}</p>
                  
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-slate-700 mb-2">Popular Games:</p>
                    <div className="flex flex-wrap gap-2">
                      {category.games.slice(0, 4).map((game, index) => (
                        <span 
                          key={index}
                          className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full"
                        >
                          {game}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-teal-600 font-medium">
                    <CheckCircle className="h-4 w-4" />
                    <span>{category.benefit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tips for Getting Started */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <span className="inline-block bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  Getting Started
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  Tips for Seniors New to Online Games
                </h2>
              </div>

              <div className="space-y-4">
                {[
                  { number: '1', title: 'Start Simple', description: 'Begin with games you\'re already familiar with, like Solitaire or Crosswords, before trying new types.' },
                  { number: '2', title: 'Set a Daily Goal', description: 'Aim for 15-30 minutes of brain games daily to build a healthy habit without eye strain.' },
                  { number: '3', title: 'Increase Difficulty Gradually', description: 'Most games have difficulty settings—start easy and work your way up as you improve.' },
                  { number: '4', title: 'Play with Others', description: 'Many games let you play with family and friends online, adding a social element.' },
                  { number: '5', title: 'Take Breaks', description: 'Rest your eyes every 20 minutes and stretch to stay comfortable.' },
                ].map((tip) => (
                  <div 
                    key={tip.number}
                    className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200"
                  >
                    <div className="bg-teal-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {tip.number}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{tip.title}</h3>
                      <p className="text-slate-600">{tip.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Cleveland Communities CTA */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-teal-600 to-teal-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <HomeIcon className="h-12 w-12 mx-auto mb-4 opacity-80" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Looking for Senior Living with Activity Programs?
              </h2>
              <p className="text-lg text-teal-100 mb-8">
                Many Cleveland-area senior living communities offer daily brain games, social activities, and wellness programs as part of their services. Our local advisors can help you find communities that prioritize mental engagement and quality of life.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/cleveland"
                  className="inline-flex items-center justify-center bg-white text-teal-700 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all text-base min-h-[56px]"
                >
                  Browse Cleveland Communities
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center bg-teal-500 hover:bg-teal-400 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all text-base min-h-[56px]"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Talk to an Advisor
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
                More Senior Living Resources
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Link 
                href="/memory-care-cleveland"
                className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 group"
              >
                <Brain className="h-8 w-8 text-violet-600 mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                  Memory Care Guide
                </h3>
                <p className="text-slate-600 text-sm">
                  Learn about specialized memory care services in Cleveland for Alzheimer&apos;s and dementia.
                </p>
              </Link>

              <Link 
                href="/resources"
                className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 group"
              >
                <BookOpen className="h-8 w-8 text-teal-600 mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                  All Resources
                </h3>
                <p className="text-slate-600 text-sm">
                  Explore all our senior living guides, pricing information, and expert advice.
                </p>
              </Link>

              <Link 
                href="/senior-living-costs-cleveland"
                className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 group"
              >
                <Shield className="h-8 w-8 text-amber-600 mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                  Cleveland Pricing Guide
                </h3>
                <p className="text-slate-600 text-sm">
                  Understand senior living costs in Cleveland and financial assistance options.
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


