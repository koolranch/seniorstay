import React from 'react';

export default function ContactCareAdvisorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Contact a Care Advisor</h1>

      <h3 className="text-xl font-semibold mb-4 text-center">
        Free, no-pressure help from someone who's been there.
      </h3>

      <p className="mb-6 text-center">
        Not sure what type of senior living is right? Need help comparing local
        communities? Our Care Advisors are here to help — no cost, no sales
        pitch, just honest guidance.
      </p>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mt-6 mb-3">What You Can Ask Us</h2>
      <ul className="list-disc list-inside mb-6 ml-4">
        <li>"Is assisted living or memory care the right fit?"</li>
        <li>"Can I get pricing for communities near [my city]?"</li>
        <li>"Do any options allow pets or short-term stays?"</li>
        <li>"What's the average cost in my area?"</li>
        <li>"How soon could we move in?"</li>
      </ul>
      <p className="mb-6">
        We'll walk you through it — or just send you a short list of local
        options, if that's all you want.
      </p>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mt-6 mb-3">💬 Talk to a Care Advisor Now</h2>

      {/* Replace [YOUR_FORM_ID] with your actual Formspree form ID */}
      <form
        action="https://formspree.io/f/[YOUR_FORM_ID]"
        method="POST"
        className="space-y-4 max-w-md mx-auto"
      >
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Your Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            placeholder="Jane Doe"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            placeholder="you@example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Phone Number (optional)
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            placeholder="(555) 555-5555"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">
            Tell us about your situation
          </label>
          <textarea
            name="message"
            id="message"
            rows={4}
            placeholder="I'm looking for care near Columbus for my dad..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Contact a Care Advisor
        </button>
      </form>

      <small className="block mt-4 text-xs text-gray-500 text-center max-w-md mx-auto">
        We'll respond within one business day. Your info is kept private and
        secure.
      </small>

    </div>
  );
} 