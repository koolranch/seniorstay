import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Improve Balance: Simple Exercises for Seniors | SeniorStay',
  description: 'Learn easy and effective balance exercises for seniors. Improve stability, reduce fall risk, and support independence with these daily movements.',
  openGraph: {
    title: 'Improve Balance: Simple Exercises for Seniors',
    description: 'Learn easy and effective balance exercises for seniors. Improve stability, reduce fall risk, and support independence with these daily movements.',
    type: 'article',
    url: 'https://guideforseniors.com/blog/improve-balance-1',
  },
};

export default function ImproveBalancePage() {
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
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Improve Balance: Simple Exercises for Seniors</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Discover easy exercises to enhance stability and prevent falls.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 md:px-10 lg:px-20 py-12">
        <article className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
            <p className="text-xl text-gray-700 mb-6">
              Good balance is key to living independently as we age. Improving your balance can help prevent falls, boost confidence, and make everyday activities — like walking, standing, and reaching — much safer and easier.
            </p>
          </div>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Why Balance Declines With Age</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Muscle loss (especially in the legs and core)</li>
              <li>Reduced vision or inner ear function</li>
              <li>Less physical activity or sedentary lifestyle</li>
              <li>Chronic health conditions like arthritis or neuropathy</li>
            </ul>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Simple Balance Exercises for Seniors</h2>
            <p className="text-gray-700 mb-6">
              Always consult with a doctor before starting a new exercise routine.
            </p>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-[#1b4d70] mb-2">1. Heel-to-Toe Walk</h3>
                <p className="text-gray-700">
                  Walk in a straight line, placing the heel of one foot directly in front of the toes of the other. Great for coordination and leg strength.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-[#1b4d70] mb-2">2. Single-Leg Stance</h3>
                <p className="text-gray-700">
                  Stand near a chair or wall and lift one foot off the ground for 10–15 seconds. Switch legs. Improves ankle and core stability.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-[#1b4d70] mb-2">3. Sit-to-Stand</h3>
                <p className="text-gray-700">
                  From a seated position, stand up and sit down slowly. Strengthens quads, glutes, and promotes better posture and balance.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-[#1b4d70] mb-2">4. Side Leg Raises</h3>
                <p className="text-gray-700">
                  Stand straight, hold onto a support, and raise one leg to the side. Strengthens hip muscles and improves lateral stability.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-[#1b4d70] mb-2">5. Marching in Place</h3>
                <p className="text-gray-700">
                  Slowly lift each knee in a marching motion. Builds coordination and strengthens lower body.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Tips for Safe Balance Training</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Use a sturdy chair or countertop for support</li>
              <li>Wear comfortable shoes with good grip</li>
              <li>Avoid distractions and go slow</li>
              <li>Make it a daily habit — consistency is key</li>
            </ul>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Final Thoughts</h2>
            <p className="text-gray-700">
              A few minutes a day can make a huge difference. These balance exercises are gentle, effective, and empowering — helping seniors stay steady, strong, and self-reliant at home and beyond.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
} 