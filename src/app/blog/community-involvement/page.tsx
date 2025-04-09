import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'The Importance of Community Involvement for Seniors | SeniorStay',
  description: 'Community involvement helps seniors stay active, connected, and purposeful. Discover meaningful ways to engage and give back at any age.',
  openGraph: {
    title: 'The Importance of Community Involvement for Seniors',
    description: 'Community involvement helps seniors stay active, connected, and purposeful. Discover meaningful ways to engage and give back at any age.',
    type: 'article',
    url: 'https://guideforseniors.com/blog/community-involvement',
  },
};

export default function CommunityInvolvementPage() {
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
          <h1 className="text-3xl md:text-4xl font-bold mb-4">The Importance of Community Involvement for Seniors</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Discover how staying connected can enhance your well-being and sense of purpose.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 md:px-10 lg:px-20 py-12">
        <article className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
            <p className="text-xl text-gray-700 mb-6">
              Staying socially connected and engaged in the community can have a powerful impact on a senior's mental, emotional, and even physical well-being. Whether through volunteering, joining a club, or simply attending local events, community involvement provides purpose and connection.
            </p>
          </div>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Why Community Matters as We Age</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Reduces feelings of loneliness and isolation</li>
              <li>Supports mental health and emotional resilience</li>
              <li>Encourages daily activity and social interaction</li>
              <li>Fosters a sense of identity and belonging</li>
            </ul>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Meaningful Ways Seniors Can Get Involved</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Volunteer – Help at food banks, libraries, hospitals, or schools</li>
              <li>Join a Club – Book clubs, gardening groups, or hobby circles</li>
              <li>Attend Local Events – Farmers markets, fairs, concerts, or senior center gatherings</li>
              <li>Mentor Others – Share skills or life experience through youth programs or local nonprofits</li>
              <li>Support a Cause – Participate in charity walks or fundraising events</li>
            </ul>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Community Involvement & Health Benefits</h2>
            <p className="text-gray-700 mb-4">
              Studies show that seniors involved in community life experience:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Lower rates of depression</li>
              <li>Improved cognitive function</li>
              <li>Stronger immune response</li>
              <li>Higher life satisfaction</li>
            </ul>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Getting Started</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Check with your local senior center or church for opportunities</li>
              <li>Ask neighbors or friends to join you in activities</li>
              <li>Try one new group or activity per month to see what sticks</li>
            </ul>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Final Thoughts</h2>
            <p className="text-gray-700">
              Giving back and staying connected can transform retirement into a time of deep fulfillment. Whether you want to make new friends, stay sharp, or simply give your time to a good cause, community involvement is one of the most powerful ways to do it.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
} 