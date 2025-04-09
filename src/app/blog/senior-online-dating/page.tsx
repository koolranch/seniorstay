import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Senior Online Dating: How to Get Started Safely | SeniorStay',
  description: 'New to online dating? Discover safe, simple tips for seniors looking to meet new people and build meaningful relationships online.',
  openGraph: {
    title: 'Senior Online Dating: How to Get Started Safely',
    description: 'New to online dating? Discover safe, simple tips for seniors looking to meet new people and build meaningful relationships online.',
    type: 'article',
    url: 'https://guideforseniors.com/blog/senior-online-dating',
  },
};

export default function SeniorOnlineDatingPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF5]">
      {/* Header */}
      <div className="bg-[#1b4d70] text-white">
        <div className="container mx-auto px-6 md:px-10 lg:px-20 py-12 md:py-20">
          <Link 
            href="/blog"
            className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Senior Online Dating: How to Get Started Safely</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Learn how to navigate online dating safely and confidently as a senior, with tips for creating a great profile and staying secure.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 md:px-10 lg:px-20 py-12">
        <article className="max-w-4xl mx-auto prose prose-lg">
          {/* Introduction */}
          <section className="mb-8">
            <p className="text-gray-700 leading-relaxed">
              It's never too late to find love — or even just companionship. Online dating has opened new doors for seniors, making it easier than ever to meet others who share your interests, values, and life stage. Whether you're newly single or just curious, here's how to get started safely and confidently.
            </p>
          </section>

          {/* Why Seniors Are Turning to Online Dating */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Why Seniors Are Turning to Online Dating</h2>
            <ul className="space-y-2 text-gray-700">
              <li>More comfort with technology and mobile devices</li>
              <li>Greater desire for companionship after retirement or divorce</li>
              <li>Wider dating pool than in-person options</li>
              <li>Options for both romance and friendship</li>
            </ul>
          </section>

          {/* Best Dating Sites for Seniors */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Best Dating Sites for Seniors</h2>
            <ul className="space-y-2 text-gray-700">
              <li><strong>OurTime</strong> – Designed specifically for singles 50+</li>
              <li><strong>SilverSingles</strong> – Matches based on personality assessments</li>
              <li><strong>eHarmony</strong> – Known for long-term compatibility matching</li>
              <li><strong>Facebook Dating</strong> – Free and convenient for existing Facebook users</li>
            </ul>
          </section>

          {/* Safety Tips for Online Dating */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Safety Tips for Online Dating</h2>
            <ul className="space-y-2 text-gray-700">
              <li>Never share financial or personal identity information</li>
              <li>Start with messages inside the app (avoid giving your phone number too soon)</li>
              <li>Set up the first meeting in a public place — and tell someone where you're going</li>
              <li>Trust your instincts — if something feels off, it probably is</li>
            </ul>
          </section>

          {/* Creating a Great Profile */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Creating a Great Profile</h2>
            <ul className="space-y-2 text-gray-700">
              <li>Use a clear, recent photo with a friendly smile</li>
              <li>Write honestly about your interests, lifestyle, and what you're looking for</li>
              <li>Keep it positive — focus on what you enjoy, not what you're trying to avoid</li>
            </ul>
          </section>

          {/* Final Thoughts */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Final Thoughts</h2>
            <p className="text-gray-700 leading-relaxed">
              Online dating can feel intimidating at first — but it's also full of possibility. With a little patience and awareness, you might just meet someone who brings joy, laughter, and connection to your life. You deserve that — no matter your age.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
} 