import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '5 Best Cruises for Seniors in 2024 | SeniorStay',
  description: 'Discover the top cruises for seniors in 2024 — offering relaxation, enrichment, and accessibility. Explore destinations and cruise lines perfect for older adults.',
  openGraph: {
    title: '5 Best Cruises for Seniors in 2024',
    description: 'Discover the top cruises for seniors in 2024 — offering relaxation, enrichment, and accessibility. Explore destinations and cruise lines perfect for older adults.',
    type: 'article',
    url: 'https://guideforseniors.com/senior-travel/5-best-cruises-for-seniors',
  },
};

export default function BestCruisesPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF5]">
      {/* Header */}
      <div className="bg-[#1b4d70] text-white">
        <div className="container mx-auto px-6 md:px-10 lg:px-20 py-12 md:py-20">
          <Link
            href="/senior-travel"
            className="inline-flex items-center text-white mb-6 hover:text-[#F5A623] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span>Back to Senior Travel</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">5 Best Cruises for Seniors in 2024</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Discover the perfect cruise for your next adventure, tailored for comfort and enjoyment.
          </p>
        </div>
      </div>

      {/* Article Content */}
      <article className="container mx-auto px-6 md:px-10 lg:px-20 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-6 md:p-8">
          <div className="prose prose-lg max-w-none">
            <p className="lead text-xl text-gray-700 mb-8">
              Cruising continues to be one of the most enjoyable and senior-friendly ways to travel. With meals, entertainment, and excursions included, it's no surprise that more seniors are hitting the high seas than ever. Here are five of the best cruises tailored to older adults in 2024.
            </p>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">1. Holland America Line – Alaska Cruises</h2>
              <p className="text-gray-700 mb-4">
                Holland America is a long-time favorite for senior travelers, and their Alaska itineraries are breathtaking. Expect wildlife viewing, glacier tours, and onboard enrichment programs.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div><strong>Why seniors love it:</strong> Quiet ships, great service, accessible excursions</div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div><strong>Best for:</strong> Nature lovers and first-time cruisers</div>
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">2. Viking River Cruises – Danube or Rhine</h2>
              <p className="text-gray-700 mb-4">
                Known for its calm, culture-rich journeys, Viking River Cruises are ideal for seniors who prefer less motion and more immersion. Tours are included and paced thoughtfully.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div><strong>Why seniors love it:</strong> No kids onboard, educational tours, elegant design</div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div><strong>Best for:</strong> History buffs and scenic travelers</div>
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">3. Princess Cruises – California Coastal or Caribbean</h2>
              <p className="text-gray-700 mb-4">
                Princess combines classic cruising with thoughtful accessibility features and laid-back itineraries. Their onboard programming includes lectures, music, and dance.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div><strong>Why seniors love it:</strong> Good mix of fun and rest, accessible cabins, onboard activities</div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div><strong>Best for:</strong> Retired couples and solo travelers</div>
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">4. Celebrity Cruises – Mediterranean Gems</h2>
              <p className="text-gray-700 mb-4">
                For those seeking a touch of luxury and wellness, Celebrity offers beautiful Mediterranean routes with spa access, gourmet dining, and cultural excursions.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div><strong>Why seniors love it:</strong> Modern comfort, fine dining, great service</div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div><strong>Best for:</strong> Seniors who want upscale travel experiences</div>
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">5. American Cruise Lines – Mississippi River</h2>
              <p className="text-gray-700 mb-4">
                Stay close to home with a relaxing river cruise through America's heartland. Smaller ships, historical towns, and personalized service make this cruise line unique.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div><strong>Why seniors love it:</strong> No international travel required, historic themes, calm waters</div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div><strong>Best for:</strong> Seniors wanting slower travel with fewer crowds</div>
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Final Thoughts</h2>
              <p className="text-gray-700">
                No matter your interests — nature, history, luxury, or leisure — there's a cruise for you. These senior-friendly cruises for 2024 combine comfort, culture, and connection for the perfect getaway.
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
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Cruises for Seniors</h3>
              <p className="text-gray-600 mb-4">Discover why cruises are an excellent travel option for seniors and how to choose the right one.</p>
              <Link href="/blog/cruises-for-seniors" className="text-[#1b4d70] font-medium font-semibold hover:text-[#F5A623] transition-colors">
                Read More →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 