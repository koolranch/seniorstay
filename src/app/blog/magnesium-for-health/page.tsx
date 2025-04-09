import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'The Importance of Magnesium for Senior Health | SeniorStay',
  description: 'Learn why magnesium is essential for seniors. Discover its role in bone health, muscle function, sleep, and more in older adults.',
  openGraph: {
    title: 'The Importance of Magnesium for Senior Health',
    description: 'Learn why magnesium is essential for seniors. Discover its role in bone health, muscle function, sleep, and more in older adults.',
    type: 'article',
    url: 'https://guideforseniors.com/blog/magnesium-for-health',
  },
};

export default function MagnesiumForHealthPage() {
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
          <h1 className="text-3xl md:text-4xl font-bold mb-4">The Importance of Magnesium for Senior Health</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Discover why this essential mineral is crucial for older adults and how to ensure adequate intake.
          </p>
        </div>
      </div>

      {/* Article Content */}
      <article className="container mx-auto px-6 md:px-10 lg:px-20 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-6 md:p-8">
          <div className="prose prose-lg max-w-none">
            <p className="lead text-xl text-gray-700 mb-8">
              As we age, our nutritional needs shift — and one mineral that becomes increasingly important is magnesium. It plays a critical role in maintaining muscle function, supporting bone health, and promoting restful sleep.
            </p>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Why Seniors Need More Magnesium</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>
                    <strong className="text-gray-800">Bone Health:</strong> Magnesium works with calcium and vitamin D to maintain strong bones and reduce the risk of osteoporosis.
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>
                    <strong className="text-gray-800">Muscle Function:</strong> It helps prevent muscle cramps and supports proper nerve signaling.
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>
                    <strong className="text-gray-800">Heart Health:</strong> Magnesium regulates blood pressure and supports cardiovascular function.
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>
                    <strong className="text-gray-800">Better Sleep:</strong> Adequate magnesium levels promote deeper, more restful sleep — especially important for older adults.
                  </div>
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Common Signs of Deficiency</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>Fatigue</div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>Muscle twitches or cramps</div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>Poor appetite</div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>Difficulty sleeping</div>
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">How to Get More Magnesium</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>Eat leafy greens, nuts, seeds, and whole grains</div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>Consider supplements (always consult with a doctor)</div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>Avoid processed foods that can interfere with absorption</div>
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Final Thoughts</h2>
              <p className="text-gray-700">
                Magnesium is one of those "quiet heroes" of health — especially for seniors. A balanced diet, regular checkups, and targeted supplementation can help older adults maintain vitality and prevent age-related decline.
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
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Nutrition Tips for Seniors</h3>
              <p className="text-gray-600 mb-4">Essential dietary advice to help older adults maintain optimal health and vitality.</p>
              <Link href="/blog/nutrition-tips-for-seniors" className="text-[#1b4d70] font-medium hover:text-[#F5A623] transition-colors">
                Read More →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 