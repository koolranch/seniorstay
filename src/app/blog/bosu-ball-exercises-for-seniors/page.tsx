import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'BOSU Ball Exercises for Seniors: Improve Balance & Core Strength | Guide For Seniors',
  description: 'Learn how seniors can safely use a BOSU ball to improve balance, mobility, and overall strength. Great for at-home workouts and fall prevention.',
  openGraph: {
    title: 'BOSU Ball Exercises for Seniors: Improve Balance & Core Strength',
    description: 'Learn how seniors can safely use a BOSU ball to improve balance, mobility, and overall strength. Great for at-home workouts and fall prevention.',
    type: 'article',
  },
}

export default function BosuBallExercisesPage() {
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
            BOSU Ball Exercises for Seniors: Improve Balance & Core Strength
          </h1>

          <div className="mb-8">
            <Image
              src="/blog/wp-content/uploads/2015/09/bosu-ball-thumbnail-800x400.jpg"
              alt="Senior using a BOSU ball for balance exercises"
              width={800}
              height={400}
              className="rounded-lg shadow-md"
            />
          </div>

          <p className="text-xl text-gray-600 mb-8">
            A BOSU ball (Both Sides Up) is a versatile exercise tool that can help seniors improve balance, strength, and mobility. This guide will show you how to safely incorporate BOSU ball exercises into your fitness routine.
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What is a BOSU Ball?</h2>
            <p className="text-gray-700 mb-4">
              A BOSU ball is a half-dome exercise device with a flat platform on one side and an inflatable dome on the other. It's designed to create an unstable surface, which helps improve balance, coordination, and core strength.
            </p>
            <p className="text-gray-700">
              The name "BOSU" stands for "Both Sides Up," meaning you can use either the flat platform or the dome side for different exercises.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Benefits for Seniors</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Improved Balance:</strong> The unstable surface challenges your body to maintain equilibrium, strengthening the muscles that help prevent falls</li>
              <li><strong>Fall Prevention:</strong> Regular practice helps develop better balance reactions and stability</li>
              <li><strong>Core Strength:</strong> Many exercises engage the abdominal and back muscles, building a stronger core</li>
              <li><strong>Rehabilitation:</strong> Useful for physical therapy and recovery from injuries</li>
              <li><strong>Joint Stability:</strong> Helps strengthen the muscles around joints, reducing the risk of injury</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Beginner-Friendly BOSU Exercises</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Basic Standing Balance</h3>
                <p className="text-gray-700 mb-2">Start with the dome side up:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Place the BOSU ball on a stable surface</li>
                  <li>Stand next to a wall or chair for support</li>
                  <li>Step onto the center of the dome</li>
                  <li>Hold for 30 seconds, then step off</li>
                  <li>Repeat 3-5 times</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Seated Marching</h3>
                <p className="text-gray-700 mb-2">Using the flat side up:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Sit on the BOSU ball with feet flat on the floor</li>
                  <li>Keep your back straight and core engaged</li>
                  <li>Lift one knee at a time in a marching motion</li>
                  <li>Continue for 1-2 minutes</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Gentle Squats</h3>
                <p className="text-gray-700 mb-2">With the dome side up:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Stand behind the BOSU ball</li>
                  <li>Step onto the center of the dome</li>
                  <li>Hold onto a wall or chair for support</li>
                  <li>Slowly lower into a shallow squat</li>
                  <li>Hold for 5 seconds, then return to standing</li>
                  <li>Repeat 5-8 times</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">4. Arm Raises</h3>
                <p className="text-gray-700 mb-2">Using the flat side up:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Sit on the BOSU ball with feet flat on the floor</li>
                  <li>Hold light weights or water bottles in your hands</li>
                  <li>Raise your arms to shoulder height</li>
                  <li>Hold for 5 seconds, then lower</li>
                  <li>Repeat 8-10 times</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Safety Tips</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Always have a stable support (wall, chair, or person) nearby when first starting</li>
              <li>Start with simple exercises and progress gradually</li>
              <li>Use the flat side up for more stability when needed</li>
              <li>Stop immediately if you feel pain or dizziness</li>
              <li>Consult your healthcare provider before starting a new exercise routine</li>
              <li>Practice in a clear, open space with good lighting</li>
              <li>Wear supportive, non-slip shoes</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Getting Started</h2>
            <p className="text-gray-700 mb-4">
              Before beginning BOSU ball exercises, make sure you have:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>A properly inflated BOSU ball (follow manufacturer instructions)</li>
              <li>Comfortable, supportive shoes</li>
              <li>A clear, open space to exercise</li>
              <li>Support nearby (wall, chair, or person)</li>
              <li>Approval from your healthcare provider</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Start with just 5-10 minutes of exercise and gradually increase as you become more comfortable and confident.
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
                  Preventing Sports Injuries as a Senior →
                </Link>
              </li>
            </ul>
          </div>
        </article>
      </div>
    </main>
  )
} 