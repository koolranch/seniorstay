import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Magnesium Levels: What\'s the Normal Range for Seniors? | Guide For Seniors',
  description: 'Curious about your magnesium levels? Learn what\'s considered normal for seniors, why it matters, and how to manage it for better health.',
  openGraph: {
    title: 'Magnesium Levels: What\'s the Normal Range for Seniors?',
    description: 'Curious about your magnesium levels? Learn what\'s considered normal for seniors, why it matters, and how to manage it for better health.',
    type: 'article',
  },
}

export default function MagnesiumLevelsPage() {
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
            Magnesium Levels: What's the Normal Range for Seniors?
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            Magnesium plays a vital role in everything from heart health and nerve function to muscle control and bone strength. But what's a healthy level — and how can seniors keep it in check?
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What Is Magnesium?</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>An essential mineral found in your bones, muscles, and blood</li>
              <li>Supports energy production, heart rhythm, muscle contraction, and nerve signals</li>
              <li>Naturally found in foods like leafy greens, nuts, seeds, and whole grains</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Normal Magnesium Range (Blood Test)</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>The typical normal range for serum magnesium is 1.7 to 2.3 mg/dL</li>
              <li>Some labs may vary slightly, but staying within this range is considered healthy</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why It's Important for Seniors</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Seniors are more prone to magnesium deficiency due to dietary changes, medications, and reduced absorption</li>
              <li>Low magnesium can contribute to muscle cramps, fatigue, irregular heartbeat, and sleep issues</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Signs of Low Magnesium</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Muscle twitches or cramps</li>
              <li>Weakness or fatigue</li>
              <li>Nausea or loss of appetite</li>
              <li>Abnormal heart rhythms</li>
              <li>Difficulty sleeping or anxiety</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Maintain Healthy Levels</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Eat magnesium-rich foods daily (spinach, almonds, pumpkin seeds, whole grains)</li>
              <li>Talk to your doctor about magnesium supplements if needed</li>
              <li>Avoid excessive alcohol or caffeine, which may interfere with absorption</li>
              <li>Check medication interactions — some diuretics and proton pump inhibitors can lower magnesium</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">When to Get Tested</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>If you're experiencing symptoms or have risk factors like diabetes, heart disease, or digestive issues</li>
              <li>During a routine blood panel ordered by your physician</li>
              <li>Before starting supplements, to avoid excessive intake</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Final Thoughts</h2>
            <p className="text-gray-700">
              Understanding your magnesium levels can help you feel more in control of your health. With a balanced diet and regular checkups, most seniors can maintain healthy magnesium levels — and enjoy better sleep, stronger bones, and improved energy.
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Related Articles</h2>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/blog/magnesium-for-health" 
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Magnesium for Senior Health: Benefits and Sources →
                </Link>
              </li>
            </ul>
          </div>
        </article>
      </div>
    </main>
  )
} 