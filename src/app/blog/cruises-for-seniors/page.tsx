import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Best Cruises for Seniors: Relaxing & Memorable Travel Options | SeniorStay',
  description: 'Explore the best cruises for seniors. Discover top cruise lines, accessibility tips, and what makes cruising an ideal vacation for older adults.',
  openGraph: {
    title: 'Best Cruises for Seniors: Relaxing & Memorable Travel Options',
    description: 'Explore the best cruises for seniors. Discover top cruise lines, accessibility tips, and what makes cruising an ideal vacation for older adults.',
    type: 'article',
    url: 'https://seniorstay.vercel.app/blog/cruises-for-seniors',
  },
};

export default function CruisesForSeniorsPage() {
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
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Best Cruises for Seniors: Relaxing & Memorable Travel Options</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Discover why cruising is an ideal vacation choice for older adults and their families.
          </p>
        </div>
      </div>

      {/* Article Content */}
      <article className="container mx-auto px-6 md:px-10 lg:px-20 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-6 md:p-8">
          <div className="prose prose-lg max-w-none">
            <p className="lead text-xl text-gray-700 mb-8">
              Cruises are one of the most enjoyable and low-stress ways for seniors to travel. With all-inclusive amenities, flexible itineraries, and plenty of relaxation time, cruises offer a perfect blend of adventure and comfort.
            </p>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Why Cruises Are Great for Seniors</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>
                    <strong className="text-gray-800">All-Inclusive Convenience:</strong> Meals, entertainment, and lodging are all in one place.
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>
                    <strong className="text-gray-800">Accessibility:</strong> Most modern ships are wheelchair-friendly and offer support for limited mobility.
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>
                    <strong className="text-gray-800">Social Opportunities:</strong> Meet fellow travelers through activities, classes, and group excursions.
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>
                    <strong className="text-gray-800">Medical Readiness:</strong> Onboard medical staff and accessibility accommodations offer peace of mind.
                  </div>
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Tips for Choosing a Senior-Friendly Cruise</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>
                    Look for smaller ships or river cruises for a quieter experience
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>
                    Choose balcony rooms for easier access to fresh air and private views
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>
                    Research senior discounts and accessible excursion options
                  </div>
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Top Cruise Lines for Seniors</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>
                    <strong className="text-gray-800">Holland America Line:</strong> Known for enrichment activities, classical music, and refined service.
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>
                    <strong className="text-gray-800">Viking River Cruises:</strong> Perfect for cultural sightseeing without the crowds.
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>
                    <strong className="text-gray-800">Princess Cruises:</strong> Offers accessible cabins and a relaxed pace.
                  </div>
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Final Thoughts</h2>
              <p className="text-gray-700">
                Whether you're a retiree seeking new adventures or a family looking to treat your loved one, cruises are a comfortable and rewarding travel option. With plenty of opportunities to explore, relax, and connect, cruising might be the perfect next journey.
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
          {/* Related article cards would go here */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="h-48 bg-gray-200 relative">
              {/* Placeholder for article image */}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Travel Tips for Seniors</h3>
              <p className="text-gray-600 mb-4">Essential advice for making your senior travel experience smooth and enjoyable.</p>
              <Link href="/blog/travel-tips-for-seniors" className="text-[#1b4d70] font-medium font-semibold hover:text-[#F5A623] transition-colors">
                Read More →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 