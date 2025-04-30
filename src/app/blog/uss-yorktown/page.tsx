import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Visiting the USS Yorktown: A Historic Experience for Seniors | SeniorStay',
  description: 'Planning a visit to the USS Yorktown? This guide offers seniors travel tips, historical context, and accessibility info for exploring this iconic WWII aircraft carrier.',
  openGraph: {
    title: 'Visiting the USS Yorktown: A Historic Experience for Seniors',
    description: 'Planning a visit to the USS Yorktown? This guide offers seniors travel tips, historical context, and accessibility info for exploring this iconic WWII aircraft carrier.',
    type: 'article',
    url: 'https://guideforseniors.com/blog/uss-yorktown',
  },
};

export default function USSYorktownPage() {
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
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Visiting the USS Yorktown: A Historic Experience for Seniors</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Discover the rich history and senior-friendly features of this iconic WWII aircraft carrier.
          </p>
        </div>
      </div>

      {/* Article Content */}
      <article className="container mx-auto px-6 md:px-10 lg:px-20 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-6 md:p-8">
          <div className="prose prose-lg max-w-none">
            <p className="lead text-xl text-gray-700 mb-8">
              The USS Yorktown, nicknamed "The Fighting Lady," is one of America's most celebrated aircraft carriers. Now permanently docked at Patriots Point in Mount Pleasant, South Carolina, this ship offers visitors — especially seniors — a powerful and educational experience.
            </p>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">A Brief History of the USS Yorktown</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>Commissioned in 1943 during World War II</div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>Played a major role in the Pacific Theater, including the Battle of the Philippine Sea</div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>Served again during the Vietnam War and recovered Apollo 8 astronauts</div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>Decommissioned in 1970 and preserved as a floating museum</div>
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">What to Expect During Your Visit</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>Walk through aircraft hangars and flight decks filled with restored planes</div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>Visit crew quarters, navigation rooms, and engine compartments</div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>Explore interactive exhibits on WWII, the Navy, and space exploration</div>
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Senior-Friendly Tips</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div><strong>Accessibility:</strong> Some areas have ramps and elevators, but not all — wear comfortable shoes and ask for an accessibility map</div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div><strong>Guided Tours:</strong> Consider booking a senior group tour with a guide for deeper insights</div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div><strong>Weather:</strong> Much of the tour is outdoors or semi-covered — bring water and sun protection</div>
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Why Seniors Love It</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>Deep historical significance, especially for veterans or military families</div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>Educational value with exhibits spanning multiple generations of service</div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>An inspiring, patriotic outing that connects visitors with America's naval heritage</div>
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Final Thoughts</h2>
              <p className="text-gray-700">
                A visit to the USS Yorktown is more than a day trip — it's a chance to walk through living history. Whether you served in the military or simply love American history, this iconic ship offers a rewarding and memorable experience for older adults.
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
              <h3 className="text-xl font-semibold text-gray-800 mb-2">5 Best Cruises for Seniors in 2024</h3>
              <p className="text-gray-600 mb-4">Discover the perfect cruise for your next adventure, tailored for comfort and enjoyment.</p>
              <Link href="/senior-travel/5-best-cruises-for-seniors" className="text-[#1b4d70] font-medium font-semibold hover:text-[#F5A623] transition-colors">
                Read More →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 