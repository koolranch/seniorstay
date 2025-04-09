import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '11 Places Seniors Meet Seniors: Where Connection Happens | SeniorStay',
  description: 'Looking to meet new people in your golden years? Discover 11 welcoming, low-pressure places where seniors meet seniors — for friendship, companionship, and community.',
  openGraph: {
    title: '11 Places Seniors Meet Seniors: Where Connection Happens',
    description: 'Looking to meet new people in your golden years? Discover 11 welcoming, low-pressure places where seniors meet seniors — for friendship, companionship, and community.',
    type: 'article',
    url: 'https://guideforseniors.com/senior-lifestyle/family/11-places-seniors-meet-seniors',
  },
};

export default function SeniorMeetingPlacesPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF5]">
      {/* Header */}
      <div className="bg-[#1b4d70] text-white">
        <div className="container mx-auto px-6 md:px-10 lg:px-20 py-12 md:py-20">
          <Link
            href="/senior-lifestyle/family"
            className="inline-flex items-center text-white mb-6 hover:text-[#F5A623] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span>Back to Family</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">11 Places Seniors Meet Seniors: Where Connection Happens</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Discover welcoming spaces where older adults can build meaningful connections.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 md:px-10 lg:px-20 py-12">
        <article className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
            <p className="text-xl text-gray-700 mb-6">
              Making new friends — or even finding romance — is absolutely possible at any stage in life. Whether you've moved to a new area or simply want to connect with others your age, there are plenty of welcoming places where seniors meet seniors in a natural, low-pressure way.
            </p>
          </div>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">1. Senior Centers</h2>
            <p className="text-gray-700">
              A great hub for events, meals, games, and community-building activities. Many offer fitness classes, arts, and educational programs.
            </p>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">2. Local Libraries</h2>
            <p className="text-gray-700">
              Quiet, community-focused, and full of workshops, book clubs, and interest groups for all ages.
            </p>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">3. Faith-Based Communities</h2>
            <p className="text-gray-700">
              Churches, synagogues, and temples often have social groups, volunteer opportunities, and seniors' ministries.
            </p>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">4. Group Travel & Cruises</h2>
            <p className="text-gray-700">
              Travel clubs and senior-specific cruises are a fantastic way to meet people with shared interests while exploring new places.
            </p>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">5. Fitness Classes for Seniors</h2>
            <p className="text-gray-700">
              Chair yoga, water aerobics, or SilverSneakers classes bring together health-conscious older adults.
            </p>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">6. Volunteering Opportunities</h2>
            <p className="text-gray-700">
              From food banks to mentoring programs, volunteering connects people who care about similar causes.
            </p>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">7. Community Events & Markets</h2>
            <p className="text-gray-700">
              Outdoor fairs, farmer's markets, and seasonal festivals are social spaces with built-in conversation starters.
            </p>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">8. Hobby or Craft Groups</h2>
            <p className="text-gray-700">
              Whether it's quilting, painting, birdwatching, or gardening — shared interests are a powerful way to build connections.
            </p>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">9. Online Communities & Forums</h2>
            <p className="text-gray-700">
              Websites like SeniorChatRoom, AARP Community, and local Facebook Groups help foster digital friendships and meetups.
            </p>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">10. Dating Apps for Seniors</h2>
            <p className="text-gray-700">
              Platforms like OurTime, SilverSingles, and even Match have senior-friendly interfaces for those seeking companionship or romance.
            </p>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">11. Adult Education or Lifelong Learning Programs</h2>
            <p className="text-gray-700">
              Many colleges offer low-cost or free courses for seniors, with a built-in social component.
            </p>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Final Thoughts</h2>
            <p className="text-gray-700">
              No matter your age, humans thrive on connection. With so many ways to meet like-minded people, seniors today have more options than ever to build meaningful friendships and relationships. Start with what feels comfortable — and let curiosity and community do the rest.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
} 