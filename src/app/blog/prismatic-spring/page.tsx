import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Visiting Grand Prismatic Spring: A Natural Wonder for Senior Travelers | SeniorStay',
  description: 'Explore the beauty of Grand Prismatic Spring in Yellowstone — with tips for seniors on accessibility, safety, and making the most of your visit.',
  openGraph: {
    title: 'Visiting Grand Prismatic Spring: A Natural Wonder for Senior Travelers',
    description: 'Explore the beauty of Grand Prismatic Spring in Yellowstone — with tips for seniors on accessibility, safety, and making the most of your visit.',
    type: 'article',
    url: 'https://guideforseniors.com/blog/prismatic-spring',
  },
};

export default function PrismaticSpringPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF5]">
      {/* Header */}
      <div className="bg-[#1b4d70] text-white">
        <div className="container mx-auto px-6 md:px-10 lg:px-20 py-12 md:py-20">
          <Link 
            href="/blog"
            className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Visiting Grand Prismatic Spring: A Natural Wonder for Senior Travelers</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Discover the vibrant beauty of Yellowstone's most colorful natural feature, with senior-friendly tips for the best experience.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 md:px-10 lg:px-20 py-12">
        <article className="max-w-4xl mx-auto prose prose-lg">
          {/* Introduction */}
          <section className="mb-8">
            <p className="text-gray-700 leading-7">
              If you're planning a bucket-list adventure through Yellowstone National Park, don't miss Grand Prismatic Spring — the park's most colorful and captivating natural feature. Its vivid rings of blue, green, orange, and red are caused by microbial life and minerals, and the view is truly breathtaking.
            </p>
          </section>

          {/* What Makes It Special */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">What Makes It Special</h2>
            <ul className="space-y-2 text-gray-700">
              <li>It's the largest hot spring in the United States and third largest in the world</li>
              <li>Its vivid colors change with temperature and light conditions</li>
              <li>Located in the Midway Geyser Basin, it's one of Yellowstone's most iconic attractions</li>
            </ul>
          </section>

          {/* Senior Travel Tips */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Senior Travel Tips</h2>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Best Viewing Spot:</strong> The overlook on the Fairy Falls Trail offers the best panoramic views — a 1.5-mile round-trip hike on a well-maintained path</li>
              <li><strong>Parking:</strong> Arrive early (before 9 a.m.) or late afternoon to avoid crowds</li>
              <li><strong>Mobility:</strong> The boardwalk loop around the spring is accessible but has some slight elevation and steam areas — wear sturdy shoes and bring water</li>
              <li><strong>Photography:</strong> Morning light gives the clearest view of the vibrant colors</li>
            </ul>
          </section>

          {/* What to Bring */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">What to Bring</h2>
            <ul className="space-y-2 text-gray-700">
              <li>Sun protection and layered clothing (weather can shift quickly)</li>
              <li>Water and snacks — there are no concessions nearby</li>
              <li>A light jacket for steamier areas and possible cool winds</li>
              <li>A camera or smartphone for unforgettable photos</li>
            </ul>
          </section>

          {/* More to Explore Nearby */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">More to Explore Nearby</h2>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Excelsior Geyser</strong> – A massive geyser crater adjacent to the spring</li>
              <li><strong>Fairy Falls Trail</strong> – A peaceful, scenic walk with wildflowers and a waterfall</li>
              <li><strong>Old Faithful</strong> – Just a short drive away and a classic Yellowstone experience</li>
            </ul>
          </section>

          {/* Final Thoughts */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Final Thoughts</h2>
            <p className="text-gray-700 leading-7">
              Grand Prismatic Spring is one of those rare places that leaves you awestruck — and it's accessible enough for senior travelers who plan ahead. Whether you're a nature enthusiast or simply seeking beauty and serenity, it's a stop you won't forget.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
} 