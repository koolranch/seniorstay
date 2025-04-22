import React from 'react';

export default function ListYourCommunityPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">List Your Community on GuideForSeniors</h1>

      <h3 className="text-xl font-semibold mb-4">
        Connect with families looking for senior living — for free.
      </h3>

      <p className="mb-6">
        GuideForSeniors helps families find the right senior housing option in
        their area. Our platform connects you with individuals who are actively
        searching for assisted living, memory care, independent living, and other
        senior care solutions.
      </p>

      <p className="mb-6">
        If you represent a senior living community, you can list your property at
        no upfront cost and receive warm, qualified leads.
      </p>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mt-6 mb-3">What You Get</h2>
      <ul className="list-none space-y-2 mb-6">
        <li>✅ <strong>Local visibility</strong> on our high-traffic directory pages</li>
        <li>✅ <strong>Leads and inquiries</strong> from families near your location</li>
        <li>✅ <strong>Tour requests and pricing inquiries</strong> sent directly to you</li>
        <li>✅ <strong>No monthly fees</strong> — pay only if a move-in occurs</li>
      </ul>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mt-6 mb-3">How It Works</h2>
      <ol className="list-decimal list-inside space-y-2 mb-6">
        <li>
          <strong>You provide us your community info</strong> (location, care types,
          photos, amenities, pricing range)
        </li>
        <li>
          <strong>We add your community to our platform</strong> with a custom
          profile
        </li>
        <li>
          <strong>Families find and request info</strong> from communities near
          them
        </li>
        <li>
          <strong>You respond directly</strong> to schedule tours, share pricing,
          or offer next steps
        </li>
        <li>
          <strong>You only pay a referral fee if someone moves in</strong>
        </li>
      </ol>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mt-6 mb-3">Why List with Us?</h2>
      <ul className="list-disc list-inside mb-6 ml-4">
        <li>
          <strong>Performance-based</strong>: No subscriptions or upfront
          advertising fees
        </li>
        <li>
          <strong>High-intent leads</strong>: Our visitors are actively searching
          for options
        </li>
        <li>
          <strong>Modern and mobile-friendly</strong>: Our platform is built to
          convert
        </li>
        <li>
          <strong>Flexible partnership</strong>: You're in control of how you
          respond and follow up
        </li>
      </ul>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mt-6 mb-3">Start Reaching Local Families</h2>
      <p className="mb-4">
        To list your community, contact us below or fill out the quick interest
        form and our team will be in touch.
      </p>

      {/* TODO: Insert "Get Listed" Button or Contact Form Here */}
      <div className="my-4 p-4 border border-dashed border-gray-400 text-center">
        [📬 Insert "Get Listed" Button or Contact Form]
      </div>

      <p className="text-center">
        Or email us directly:{' '}
        <a
          href="mailto:providers@guideforseniors.com"
          className="font-semibold text-blue-600 hover:underline"
        >
          providers@guideforseniors.com
        </a>
      </p>
    </div>
  );
} 