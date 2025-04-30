import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blue Light and Seniors: What You Should Know | SeniorStay',
  description: "Learn how blue light affects seniors' sleep and eye health. Get simple tips to reduce exposure while still enjoying technology.",
  openGraph: {
    title: 'Blue Light and Seniors: What You Should Know',
    description: "Learn how blue light affects seniors' sleep and eye health. Get simple tips to reduce exposure while still enjoying technology.",
    type: 'article',
    url: 'https://guideforseniors.com/blog/blue-light',
  },
};

export default function BlueLightPage() {
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
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Blue Light and Seniors: What You Should Know</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Understand how blue light affects your health and learn simple ways to manage screen time.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 md:px-10 lg:px-20 py-12">
        <article className="max-w-4xl mx-auto prose prose-lg">
          {/* Introduction */}
          <section className="mb-8">
            <p className="text-gray-700 leading-7">
              Digital devices like smartphones, tablets, and TVs are a regular part of life — even for seniors. But all that screen time can expose you to blue light, which may impact your sleep, eye comfort, and overall wellness.
            </p>
          </section>

          {/* What Is Blue Light */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">What Is Blue Light?</h2>
            <ul className="space-y-2 text-gray-700">
              <li>A type of high-energy visible (HEV) light emitted by LED screens and modern lighting</li>
              <li>Blue light can help boost alertness and regulate mood — but it's best in moderation</li>
              <li>Exposure after sunset can suppress melatonin and disrupt sleep</li>
            </ul>
          </section>

          {/* How Blue Light Affects Seniors */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">How Blue Light Affects Seniors</h2>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Sleep Disruption:</strong> Seniors often struggle with natural sleep changes; blue light at night can make falling asleep even harder</li>
              <li><strong>Eye Strain:</strong> Extended screen time may lead to dry eyes, headaches, or blurry vision</li>
              <li><strong>Cognitive Impact:</strong> Poor sleep quality from blue light exposure can affect memory and mental clarity</li>
            </ul>
          </section>

          {/* Simple Tips to Reduce Exposure */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Simple Tips to Reduce Exposure</h2>
            <ul className="space-y-2 text-gray-700">
              <li>Turn on "Night Shift" or "Dark Mode" on phones and tablets after 7 p.m.</li>
              <li>Use blue light filtering glasses or screen protectors</li>
              <li>Keep screens at least 16–24 inches away from your eyes</li>
              <li>Avoid screens 1–2 hours before bedtime; read a book or listen to music instead</li>
            </ul>
          </section>

          {/* Tools That Help */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Tools That Help</h2>
            <ul className="space-y-2 text-gray-700">
              <li><strong>f.lux</strong> (for desktops): Automatically adjusts screen color temperature based on time of day</li>
              <li><strong>Amber night lights:</strong> Reduce harsh lighting if you wake up during the night</li>
              <li><strong>Audiobooks & podcasts:</strong> Great non-screen entertainment before bed</li>
            </ul>
          </section>

          {/* Final Thoughts */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Final Thoughts</h2>
            <p className="text-gray-700 leading-7">
              Blue light doesn't need to be feared — just managed. With a few easy adjustments, seniors can continue enjoying their favorite shows, apps, and video calls without sacrificing sleep or eye comfort.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
} 