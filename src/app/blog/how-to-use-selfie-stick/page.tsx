import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How to Use a Selfie Stick: A Guide for Seniors | Guide For Seniors',
  description: 'Learn how to use a selfie stick — from pairing it with your phone to taking great photos. A simple, senior-friendly guide for better selfies and group shots!',
  openGraph: {
    title: 'How to Use a Selfie Stick: A Guide for Seniors',
    description: 'Learn how to use a selfie stick — from pairing it with your phone to taking great photos. A simple, senior-friendly guide for better selfies and group shots!',
    type: 'article',
  },
}

export default function SelfieStickGuidePage() {
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
            How to Use a Selfie Stick: A Guide for Seniors
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            Whether you're traveling, visiting family, or just want a better way to take photos, a selfie stick can help you capture the moment — without needing help from a stranger. This easy guide will walk you through how to use one step by step.
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What Is a Selfie Stick?</h2>
            <p className="text-gray-700 mb-4">
              A selfie stick is a lightweight, extendable pole that lets you take photos from farther away — perfect for group shots, travel selfies, and scenic backgrounds.
            </p>
            <p className="text-gray-700 mb-4">
              Most selfie sticks connect to your phone:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Wirelessly via Bluetooth, or</li>
              <li>With a wired plug into your phone's headphone jack (less common now)</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Step-by-Step: How to Use a Selfie Stick</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Charge the Selfie Stick (if Bluetooth-enabled)</h3>
                <p className="text-gray-700">Use the USB cord provided and fully charge before your first use.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Turn on the Stick</h3>
                <p className="text-gray-700">Press the power or Bluetooth button — a small light will blink.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Pair with Your Phone</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Go to your phone's Bluetooth settings</li>
                  <li>Select the selfie stick from the list of nearby devices</li>
                  <li>It will say "Connected" once ready</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">4. Insert Your Phone</h3>
                <p className="text-gray-700">Gently stretch the phone holder and slide in your phone. Make sure it's centered and secure.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">5. Extend the Stick & Frame Your Shot</h3>
                <p className="text-gray-700">Pull the telescoping arm to your desired length. Hold steady with both hands if needed.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">6. Press the Shutter Button</h3>
                <p className="text-gray-700">On most sticks, the button is on the handle and works like a remote. Tap it once to take a photo!</p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tips for Better Photos</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the rear camera for higher quality images</li>
              <li>Hold the stick slightly above eye level</li>
              <li>Turn on a grid in your camera settings for better composition</li>
              <li>Practice indoors before using it on a trip</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Safety Reminders</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Watch your surroundings when extending the stick</li>
              <li>Be mindful in crowded or windy areas</li>
              <li>Follow rules — some museums, parks, and venues don't allow selfie sticks</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Final Thoughts</h2>
            <p className="text-gray-700">
              With a little practice, using a selfie stick becomes second nature. It's a fun way to stay independent and capture great memories — whether you're traveling the world or just hanging out with grandkids.
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Related Articles</h2>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/blog/keep-up-with-tech" 
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  How to Keep Up with Technology as a Senior →
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog/apps-for-seniors" 
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Best Apps for Seniors →
                </Link>
              </li>
            </ul>
          </div>
        </article>
      </div>
    </main>
  )
} 