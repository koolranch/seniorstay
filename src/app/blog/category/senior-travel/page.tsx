import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Senior Travel Articles & Guides | SeniorStay',
  description: 'Explore senior travel tips, cruise recommendations, and destination ideas. Stay adventurous and informed with our trusted senior travel content.',
  openGraph: {
    title: 'Senior Travel Articles & Guides',
    description: 'Explore senior travel tips, cruise recommendations, and destination ideas. Stay adventurous and informed with our trusted senior travel content.',
    type: 'website',
    url: 'https://guideforseniors.com/blog/category/senior-travel',
  },
};

export default function SeniorTravelCategoryPage() {
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
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Senior Travel Articles & Guides</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Discover travel tips and destinations perfect for older adults.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 md:px-10 lg:px-20 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
            <p className="text-xl text-gray-700 mb-6">
              Traveling as a senior opens the door to new experiences, cultures, and connections — all at your own pace. Whether you're planning a relaxing cruise, a historic site visit, or a cross-country road trip, travel enriches life at any age.
            </p>
            <p className="text-lg text-gray-600">
              Browse our latest articles to help you plan safe, rewarding adventures.
            </p>
          </div>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-6">✈️ Featured Senior Travel Articles</h2>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/senior-travel/5-best-cruises-for-seniors/"
                  className="text-[#1b4d70] hover:text-[#F5A623] text-lg font-medium transition-colors flex items-center"
                >
                  <span className="mr-2">→</span>
                  <span>5 Best Cruises for Seniors</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog/uss-yorktown/"
                  className="text-[#1b4d70] hover:text-[#F5A623] text-lg font-medium transition-colors flex items-center"
                >
                  <span className="mr-2">→</span>
                  <span>Visiting the USS Yorktown</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog/cruises-for-seniors/"
                  className="text-[#1b4d70] hover:text-[#F5A623] text-lg font-medium transition-colors flex items-center"
                >
                  <span className="mr-2">→</span>
                  <span>Why Cruises Are Great for Seniors</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog/magnesium-for-health/"
                  className="text-[#1b4d70] hover:text-[#F5A623] text-lg font-medium transition-colors flex items-center"
                >
                  <span className="mr-2">→</span>
                  <span>How Travel Helps Brain and Body Health</span>
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
} 