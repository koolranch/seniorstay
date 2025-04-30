import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How Seniors Can Keep Up with Technology: A Simple Guide | SeniorStay',
  description: 'Staying current with technology is easier than you think. Learn simple ways seniors can stay connected, safe, and confident in today\'s digital world.',
  openGraph: {
    title: 'How Seniors Can Keep Up with Technology: A Simple Guide',
    description: 'Staying current with technology is easier than you think. Learn simple ways seniors can stay connected, safe, and confident in today\'s digital world.',
    type: 'article',
    url: 'https://guideforseniors.com/blog/keep-up-with-tech',
  },
};

export default function KeepUpWithTechPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF5]">
      {/* Header */}
      <div className="bg-[#1b4d70] text-white">
        <div className="container mx-auto px-6 md:px-10 lg:px-20 py-12 md:py-20">
          <Link
            href="/blog"
            className="inline-flex items-center text-white mb-6 hover:text-[#F5A623] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span>Back to Blog</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">How Seniors Can Keep Up with Technology: A Simple Guide</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Discover practical tips and resources to help you stay confident and connected in today's digital world.
          </p>
        </div>
      </div>

      {/* Article Content */}
      <article className="container mx-auto px-6 md:px-10 lg:px-20 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-6 md:p-8">
          <div className="prose prose-lg max-w-none">
            <p className="lead text-xl text-gray-700 mb-8">
              Technology is constantly evolving, and it can feel overwhelming — but it doesn't have to be. With the right mindset and a few helpful resources, seniors can stay comfortably connected in the digital age.
            </p>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Why Keeping Up with Tech Matters</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>Stay in touch with family and friends</div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>Manage health and finances more easily</div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>Access information, entertainment, and services from home</div>
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Start with the Basics</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>Learn to use email, messaging, and video calling</div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>Explore apps like YouTube for tutorials and entertainment</div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>Practice using search engines (like Google) to answer questions</div>
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Take Advantage of Learning Resources</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>Local libraries and community centers often offer free tech classes</div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>YouTube channels like TechBoomers and Senior Tech Club offer senior-friendly lessons</div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>Grandkids and younger family members can be helpful teachers</div>
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Focus on Safety and Confidence</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>Use strong, memorable passwords (or a password manager)</div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>Be cautious of scams — don't click on unfamiliar links or attachments</div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>Ask for help — learning is easier with support</div>
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Final Thoughts</h2>
              <p className="text-gray-700">
                You don't have to become a tech expert — just knowing the basics can open up a world of opportunity. With curiosity and patience, seniors can feel confident using smartphones, apps, and the internet to make everyday life easier and more enjoyable.
              </p>
            </section>

            <div className="border-t border-gray-200 pt-6 mt-8">
              <p className="text-gray-500 text-sm">Published on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles Section */}
      <section className="container mx-auto px-6 md:px-10 lg:px-20 py-12">
        <h2 className="text-2xl font-semibold text-[#1b4d70] mb-6">Related Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="h-48 bg-gray-200 relative">
              {/* Placeholder for article image */}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Best Apps for Seniors</h3>
              <p className="text-gray-600 mb-4">Discover helpful apps that can make daily life easier and more enjoyable.</p>
              <Link href="/blog/apps-for-seniors" className="text-[#1b4d70] font-medium font-semibold hover:text-[#F5A623] transition-colors">
                Read More →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 