import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Mini Face Lift: What Seniors Should Know | Guide For Seniors',
  description: 'Curious about mini face lifts? Learn what they are, how they work, and what seniors should consider before choosing this popular cosmetic procedure.',
  openGraph: {
    title: 'Mini Face Lift: What Seniors Should Know',
    description: 'Curious about mini face lifts? Learn what they are, how they work, and what seniors should consider before choosing this popular cosmetic procedure.',
    type: 'article',
  },
}

export default function MiniFaceLiftPage() {
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
            Mini Face Lift: What Seniors Should Know
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            Aging gracefully doesn't mean you can't explore options to feel more confident. A mini face lift is a popular cosmetic procedure for seniors who want subtle facial rejuvenation without the commitment of full surgery. But is it right for you?
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What Is a Mini Face Lift?</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>A less invasive version of a traditional face lift</li>
              <li>Focuses on the lower half of the face (jawline, cheeks, and neck)</li>
              <li>Involves smaller incisions and shorter recovery time</li>
              <li>Often done with local anesthesia and light sedation</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Benefits for Seniors</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Reduces mild to moderate sagging or jowls</li>
              <li>Restores a more youthful jawline and lower face</li>
              <li>Minimal scarring and shorter recovery time (usually 1–2 weeks)</li>
              <li>More affordable than a full face lift</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Things to Consider</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Results are typically more subtle than a full lift</li>
              <li>Not ideal for very loose or aging skin</li>
              <li>May need to be paired with other treatments (Botox, fillers, eyelid lift)</li>
              <li>Results can last 5–10 years depending on lifestyle and skin type</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Risks & Recovery</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Swelling, bruising, or discomfort for several days</li>
              <li>Follow all post-op instructions from your surgeon</li>
              <li>Choose a board-certified plastic surgeon with experience in senior patients</li>
              <li>Ask about recovery support and in-home care if needed</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Alternatives to Explore</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Non-surgical treatments like RF therapy or ultrasound skin tightening</li>
              <li>Dermal fillers for volume loss</li>
              <li>Laser resurfacing or microneedling for texture and wrinkles</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Final Thoughts</h2>
            <p className="text-gray-700">
              A mini face lift can be a great confidence boost for seniors seeking a refreshed, natural look. The key is education, consultation, and working with a trusted provider. Whether you go forward or explore non-surgical options, aging beautifully should always be about choice and comfort.
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Related Articles</h2>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/blog/community-involvement" 
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  The Importance of Community Involvement for Seniors →
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog/improve-balance-1" 
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Simple Balance Exercises for Seniors →
                </Link>
              </li>
            </ul>
          </div>
        </article>
      </div>
    </main>
  )
} 