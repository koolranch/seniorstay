import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Senior Travel Clubs: Explore the World Together | SeniorStay',
  description: 'Discover senior travel clubs that make exploring the world easy, affordable, and fun. Learn how to join and why group travel is perfect for older adults.',
  openGraph: {
    title: 'Senior Travel Clubs: Explore the World Together',
    description: 'Discover senior travel clubs that make exploring the world easy, affordable, and fun. Learn how to join and why group travel is perfect for older adults.',
    type: 'article',
    url: 'https://guideforseniors.com/senior-lifestyle/family/senior-travel-clubs',
  },
};

export default function SeniorTravelClubsPage() {
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
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Senior Travel Clubs: Explore the World Together</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Discover how travel clubs can make your adventures more enjoyable and social.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 md:px-10 lg:px-20 py-12">
        <article className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
            <p className="text-xl text-gray-700 mb-6">
              Travel is more enjoyable when shared — and senior travel clubs make it simple to explore new places with people who share your interests. These groups are tailored to older adults looking for safe, organized, and social ways to see the world.
            </p>
          </div>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">What Are Senior Travel Clubs?</h2>
            <p className="text-gray-700 mb-4">
              Senior travel clubs are organizations that plan and host group trips for older adults. These trips may include cruises, bus tours, international excursions, or local getaways — all with an emphasis on ease, accessibility, and friendship.
            </p>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Benefits of Joining a Travel Club</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Pre-planned itineraries reduce the stress of travel</li>
              <li>Social interaction helps build friendships and reduce isolation</li>
              <li>Group discounts and perks often apply</li>
              <li>Professional guides and support staff provide peace of mind</li>
            </ul>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Popular Senior Travel Clubs to Explore</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Road Scholar – Educational adventures across the globe</li>
              <li>Traveling Divas (for women 50+) – Empowering, women-only group trips</li>
              <li>AARP Travel Center – Offers planning tools and exclusive member discounts</li>
              <li>SAGA Holidays (UK-based) – Luxury escorted tours and cruises for 50+</li>
              <li>Local Senior Centers – Often organize affordable bus trips and day outings</li>
            </ul>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Tips for Getting Started</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Search locally for clubs hosted through community centers, churches, or retirement communities</li>
              <li>Ask about accessibility accommodations, trip lengths, and age ranges</li>
              <li>Consider joining online travel groups to meet like-minded adventurers</li>
            </ul>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Final Thoughts</h2>
            <p className="text-gray-700">
              Travel clubs offer more than just a vacation — they provide a sense of community, discovery, and purpose. If you've been thinking about seeing more of the world but aren't sure where to start, a senior travel group might be your perfect first step.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
} 