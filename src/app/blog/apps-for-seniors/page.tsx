import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Best Apps for Seniors: Stay Connected, Safe, and Organized | SeniorStay',
  description: 'Discover the best apps for seniors — from communication to health, safety, and daily living. Easy-to-use tools to support independence and connection.',
  openGraph: {
    title: 'Best Apps for Seniors: Stay Connected, Safe, and Organized',
    description: 'Discover the best apps for seniors — from communication to health, safety, and daily living. Easy-to-use tools to support independence and connection.',
    type: 'article',
    url: 'https://guideforseniors.com/blog/apps-for-seniors',
  },
};

export default function AppsForSeniorsPage() {
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
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Best Apps for Seniors: Stay Connected, Safe, and Organized</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Discover how modern apps can enhance daily life and promote independence for seniors.
          </p>
        </div>
      </div>

      {/* Article Content */}
      <article className="container mx-auto px-6 md:px-10 lg:px-20 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-6 md:p-8">
          <div className="prose prose-lg max-w-none">
            <p className="lead text-xl text-gray-700 mb-8">
              Today's smartphones offer more than just calls and texts — they provide tools that can simplify life, promote independence, and enhance well-being for seniors. Whether it's staying in touch with family or tracking medications, there's an app for that.
            </p>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Communication Apps</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>Zoom & FaceTime – Easy video calls with family and friends</div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>WhatsApp – Simple text, voice, and video messaging</div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>Skype – A long-standing, senior-friendly video chat option</div>
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Health & Medication Management</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>Medisafe – Pill reminders with visual schedules and caregiver alerts</div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>MyFitnessPal – Track nutrition, weight, and fitness goals</div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>WebMD – Research symptoms and medications with reliable info</div>
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Safety & Emergency Apps</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>Life360 – Location sharing with family members for peace of mind</div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>Red Panic Button – One-tap emergency contact alerts</div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>Snug Safety – Daily check-ins with alerts if not confirmed</div>
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Organization & Daily Living</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>Google Calendar – Easy reminders for appointments and routines</div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>Magnifying Glass + Flashlight – Helps read small print in low light</div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#A7C4A0] mr-2">•</span>
                  <div>Libby – Borrow digital books and audiobooks from your local library</div>
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Final Thoughts</h2>
              <p className="text-gray-700">
                Apps can empower seniors to live more independently, stay engaged, and connect with loved ones — all from a device they already use. With just a few downloads, daily life can feel a lot more supported.
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
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Technology Tips for Seniors</h3>
              <p className="text-gray-600 mb-4">Learn how to make the most of your devices and stay safe online.</p>
              <Link href="/blog/technology-tips" className="text-[#1b4d70] font-medium font-semibold hover:text-[#F5A623] transition-colors">
                Read More →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 