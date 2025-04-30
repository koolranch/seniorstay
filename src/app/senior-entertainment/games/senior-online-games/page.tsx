import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Senior Online Games: Stay Sharp and Have Fun | SeniorStay',
  description: 'Explore online games made for seniors — from brain puzzles to card games. Stay mentally sharp while having fun, solo or with friends.',
  openGraph: {
    title: 'Senior Online Games: Stay Sharp and Have Fun',
    description: 'Explore online games made for seniors — from brain puzzles to card games. Stay mentally sharp while having fun, solo or with friends.',
    type: 'website',
    url: 'https://guideforseniors.com/senior-entertainment/games/senior-online-games',
  },
};

export default function SeniorOnlineGamesPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF5]">
      {/* Header */}
      <div className="bg-[#1b4d70] text-white">
        <div className="container mx-auto px-6 md:px-10 lg:px-20 py-12 md:py-20">
          <Link 
            href="/senior-entertainment/games"
            className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Games
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Senior Online Games: Stay Sharp and Have Fun</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Discover engaging online games designed specifically for older adults to boost brain health and enjoyment.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 md:px-10 lg:px-20 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <section className="prose prose-lg max-w-none mb-12">
            <p className="text-gray-700 leading-7">
              Online games can offer more than entertainment — they help seniors stay mentally active, reduce stress, and connect socially. Whether you're solving puzzles or playing card games, these options are designed to be easy, fun, and accessible for older adults.
            </p>
          </section>

          {/* Popular Posts & Resources */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-6">Popular Posts & Resources</h2>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/blog/senior-online-games"
                  className="text-[#1b4d70] hover:text-[#F5A623] text-lg transition-colors"
                >
                  Top Online Games for Seniors
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog/adult-brain-puzzles"
                  className="text-[#1b4d70] hover:text-[#F5A623] text-lg transition-colors"
                >
                  Brain Puzzles for Adults
                </Link>
              </li>
              <li>
                <Link 
                  href="/senior-entertainment/games/senior-online-games/embed"
                  className="text-[#1b4d70] hover:text-[#F5A623] text-lg transition-colors"
                >
                  Play Senior Games (Embedded)
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog/apps-for-seniors"
                  className="text-[#1b4d70] hover:text-[#F5A623] text-lg transition-colors"
                >
                  Best Apps for Seniors
                </Link>
              </li>
            </ul>
          </section>

          {/* What You'll Find */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-6">What You'll Find</h2>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <svg className="w-6 h-6 text-[#F5A623] mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Handpicked games that are easy to start, with no tech stress</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-[#F5A623] mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Tips for finding brain games, word games, and more</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-[#F5A623] mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Links to trustworthy, ad-free platforms like AARP Games and Lumosity</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
} 