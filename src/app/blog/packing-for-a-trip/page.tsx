import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Packing for a Trip: A Senior\'s Travel Checklist | Guide For Seniors',
  description: 'Get ready for your next adventure with this senior-friendly travel packing checklist. Stay organized, safe, and stress-free wherever you go!',
  openGraph: {
    title: 'Packing for a Trip: A Senior\'s Travel Checklist',
    description: 'Get ready for your next adventure with this senior-friendly travel packing checklist. Stay organized, safe, and stress-free wherever you go!',
    type: 'article',
  },
}

export default function PackingForTripPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link 
            href="/blog" 
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to Blog
          </Link>
        </div>

        <article className="prose prose-lg max-w-none">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Packing for a Trip: A Senior's Travel Checklist
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            Whether you're going on a weekend getaway, a cruise, or an overseas adventure, packing smart is the key to a smooth trip. For seniors, that means thinking ahead about medications, comfort, documents, and accessibility.
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Essential Documents</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Photo ID or passport</li>
              <li>Health insurance and Medicare cards</li>
              <li>Travel insurance information</li>
              <li>Emergency contact list</li>
              <li>Printed itinerary and hotel confirmations</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Medications & Health Items</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>All prescriptions in original containers</li>
              <li>Daily pill organizer</li>
              <li>Copies of prescriptions (especially for international travel)</li>
              <li>First aid kit with bandages, antiseptic, and pain relievers</li>
              <li>Face masks, hand sanitizer, and disinfecting wipes</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Comfortable Clothing</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Weather-appropriate layers</li>
              <li>Comfortable walking shoes with support</li>
              <li>Light jacket or rain poncho</li>
              <li>Easy-to-remove footwear for airport security</li>
              <li>Compression socks for long flights or car rides</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Personal Items</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Eyeglasses + backup pair</li>
              <li>Hearing aids + batteries</li>
              <li>Cell phone + charger</li>
              <li>Neck pillow for travel comfort</li>
              <li>Book, puzzle, or hobby item for downtime</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Travel Accessories</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Small day bag or crossbody purse</li>
              <li>Travel-size toiletries in TSA-approved bag</li>
              <li>Zip-lock bags for snacks or organizing cords</li>
              <li>Refillable water bottle</li>
              <li>Collapsible cane or mobility aid, if needed</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Bonus Tips</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Pack light: Use a carry-on with wheels to avoid heavy lifting</li>
              <li>Make a packing list a few days early and check it twice</li>
              <li>Leave a copy of your travel plans with a family member</li>
              <li>Use packing cubes or color-coded bags to stay organized</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Final Thoughts</h2>
            <p className="text-gray-700">
              A little preparation goes a long way. With this checklist, seniors can pack confidently and focus on what matters most: enjoying the journey. Wherever you're headed — travel safe, travel smart, and have fun!
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Related Articles</h2>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/blog/cruises-for-seniors" 
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Best Cruises for Seniors →
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog/uss-yorktown" 
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Visiting the USS Yorktown: A Historic Experience →
                </Link>
              </li>
            </ul>
          </div>
        </article>
      </div>
    </main>
  )
} 