import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'TENS Units for Seniors: Pain Relief Made Simple | Guide For Seniors',
  description: 'TENS units offer safe, drug-free pain relief for seniors. Learn how they work, when to use them, and tips for safe, effective home use.',
  openGraph: {
    title: 'TENS Units for Seniors: Pain Relief Made Simple',
    description: 'TENS units offer safe, drug-free pain relief for seniors. Learn how they work, when to use them, and tips for safe, effective home use.',
    type: 'article',
  },
}

export default function TENSUnitPage() {
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
            TENS Units for Seniors: Pain Relief Made Simple
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            If you or a loved one experiences chronic pain — whether from arthritis, back issues, or past injuries — a TENS unit may offer gentle, effective relief without the need for medication. These small, portable devices are easy to use and increasingly popular among older adults.
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What Is a TENS Unit?</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>TENS stands for Transcutaneous Electrical Nerve Stimulation</li>
              <li>A device that sends low-voltage electrical currents through the skin to stimulate nerves</li>
              <li>Typically used for muscle pain, arthritis, joint pain, and nerve discomfort</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Electrodes are placed on or near the painful area</li>
              <li>Mild electrical pulses block pain signals and encourage natural endorphin release</li>
              <li>Settings can be adjusted for intensity, frequency, and duration</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Benefits for Seniors</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Drug-free and non-invasive</li>
              <li>Compact and portable for home or travel</li>
              <li>Adjustable for individual comfort</li>
              <li>Can reduce the need for over-the-counter pain medications</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">When to Use a TENS Unit</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Mild to moderate back pain or stiffness</li>
              <li>Knee, shoulder, or hip discomfort</li>
              <li>Muscle soreness after physical therapy or walking</li>
              <li>Everyday aches related to arthritis</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Safety Tips</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Consult your doctor first, especially if you have a pacemaker, heart condition, or epilepsy</li>
              <li>Never place pads near the heart, throat, or open wounds</li>
              <li>Start with low intensity and increase gradually</li>
              <li>Clean the skin and follow all device instructions carefully</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What to Look for in a TENS Unit</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Easy-to-read screen and large buttons</li>
              <li>Rechargeable battery and multiple modes</li>
              <li>Pre-programmed settings for common pain areas</li>
              <li>FDA-cleared if possible</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Final Thoughts</h2>
            <p className="text-gray-700">
              TENS units can be a simple, affordable way to manage pain without relying on medications. Many seniors find them helpful for maintaining independence and comfort in everyday life — just be sure to use them properly and with medical guidance.
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Related Articles</h2>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/blog/improve-balance-1" 
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Simple Balance Exercises for Seniors →
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog/sports-injuries" 
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Preventing Sports Injuries in Seniors →
                </Link>
              </li>
            </ul>
          </div>
        </article>
      </div>
    </main>
  )
} 