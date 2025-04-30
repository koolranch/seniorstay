import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Travel to Thailand: A Senior-Friendly Adventure | SeniorStay',
  description: 'Thinking about a trip to Thailand? Discover why this beautiful destination is senior-friendly — from affordable prices to rich culture and great healthcare.',
  openGraph: {
    title: 'Travel to Thailand: A Senior-Friendly Adventure',
    description: 'Thinking about a trip to Thailand? Discover why this beautiful destination is senior-friendly — from affordable prices to rich culture and great healthcare.',
    type: 'article',
    url: 'https://guideforseniors.com/blog/travel-thailand',
  },
};

export default function ThailandTravelPage() {
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
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Travel to Thailand: A Senior-Friendly Adventure</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Discover why Thailand is an ideal destination for senior travelers, offering comfort, culture, and unforgettable experiences.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 md:px-10 lg:px-20 py-12">
        <article className="max-w-4xl mx-auto prose prose-lg">
          {/* Introduction */}
          <section className="mb-8">
            <p className="text-gray-700 leading-7">
              Thailand is one of Southeast Asia's most welcoming and accessible destinations — and it's increasingly popular among senior travelers. With beautiful scenery, kind locals, delicious food, and top-tier medical care, it's an ideal place to visit in retirement.
            </p>
          </section>

          {/* Why Seniors Love Thailand */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Why Seniors Love Thailand</h2>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Affordability:</strong> Your money goes far with inexpensive food, hotels, and transportation</li>
              <li><strong>Hospitality:</strong> Thai culture places great respect on elders and family</li>
              <li><strong>Accessibility:</strong> Many resorts, temples, and attractions offer easy access and guided tours</li>
              <li><strong>Healthcare:</strong> Thailand has world-renowned hospitals and affordable clinics</li>
            </ul>
          </section>

          {/* Best Places for Senior Travelers */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Best Places for Senior Travelers</h2>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Chiang Mai</strong> – A relaxed, scenic city with temples, elephant sanctuaries, and cooking classes</li>
              <li><strong>Bangkok</strong> – Vibrant capital with river cruises, cultural shows, and sky trains for easy transport</li>
              <li><strong>Phuket</strong> – Coastal paradise with beach resorts, sunset dining, and gentle water activities</li>
            </ul>
          </section>

          {/* Tips for Safe & Comfortable Travel */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Tips for Safe & Comfortable Travel</h2>
            <ul className="space-y-2 text-gray-700">
              <li>Travel during the cooler months (Nov–Feb)</li>
              <li>Book direct flights with long layovers to avoid fatigue</li>
              <li>Stay in senior-friendly hotels with elevators or ground-floor rooms</li>
              <li>Carry printed cards with important information in Thai and English</li>
              <li>Use grab taxis or hotel transportation instead of unfamiliar buses</li>
            </ul>
          </section>

          {/* Cultural Etiquette to Know */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Cultural Etiquette to Know</h2>
            <ul className="space-y-2 text-gray-700">
              <li>Remove shoes before entering temples or homes</li>
              <li>A respectful "wai" (palms together) is a common greeting</li>
              <li>Avoid touching someone's head or pointing with your feet</li>
            </ul>
          </section>

          {/* Final Thoughts */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Final Thoughts</h2>
            <p className="text-gray-700 leading-7">
              With its warm weather, rich traditions, and welcoming communities, Thailand offers senior travelers the perfect blend of adventure and relaxation. Whether you're exploring temples, taking a cooking class, or just relaxing by the sea — Thailand is an experience you'll never forget.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
} 