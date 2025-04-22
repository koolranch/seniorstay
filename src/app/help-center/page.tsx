import React from 'react';
import Link from 'next/link'; // Import Link for internal navigation

export default function HelpCenterPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Help Center</h1>

      <h3 className="text-xl font-semibold mb-4 text-center">
        Have questions? We're here to help.
      </h3>

      <p className="mb-6 text-center">
        Browse our most frequently asked questions below. If you don't see what
        you're looking for,{' '}
        <a href="#" className="font-semibold text-blue-600 hover:underline">
          contact us here →
        </a>.
      </p>

      <hr className="my-8" />

      {/* General Section */}
      <h2 className="text-2xl font-semibold mt-6 mb-3">💬 General</h2>
      <div className="space-y-4 mb-6">
        <div>
          <h4 className="font-semibold">What is GuideForSeniors?</h4>
          <p className="text-gray-700">
            GuideForSeniors is a free senior living search and referral service.
            We help families compare local communities and connect directly with
            those that fit their needs.
          </p>
        </div>
        <div>
          <h4 className="font-semibold">
            How are you different from other senior care sites?
          </h4>
          <p className="text-gray-700">
            We're built for simplicity, transparency, and trust. We don't
            pressure families or flood them with sales calls — just helpful,
            relevant info.
          </p>
        </div>
      </div>

      <hr className="my-8" />

      {/* For Families Section */}
      <h2 className="text-2xl font-semibold mt-6 mb-3">👨‍👩‍👧 For Families</h2>
      <div className="space-y-4 mb-6">
        <div>
          <h4 className="font-semibold">Is your service really free?</h4>
          <p className="text-gray-700">
            Yes. We're paid by the community if someone moves in — never by you.
          </p>
        </div>
        <div>
          <h4 className="font-semibold">Will I get a bunch of phone calls?</h4>
          <p className="text-gray-700">
            Only if you request info. We don't sell your info or share it
            outside of the communities you choose to hear from.
          </p>
        </div>
        <div>
          <h4 className="font-semibold">
            Can you help me understand what level of care my parent needs?
          </h4>
          <p className="text-gray-700">
            We can help you understand the basics and connect you with providers
            — but we don't make medical assessments. Always consult a doctor for
            that.
          </p>
        </div>
        <div>
          <h4 className="font-semibold">
            What if I just want to browse without talking to anyone?
          </h4>
          <p className="text-gray-700">
            That's totally fine! You can explore communities by location and only
            submit your info when you're ready.
          </p>
        </div>
      </div>

      <hr className="my-8" />

      {/* For Providers Section */}
      <h2 className="text-2xl font-semibold mt-6 mb-3">🏡 For Providers</h2>
      <div className="space-y-4 mb-6">
        <div>
          <h4 className="font-semibold">How do I list my community?</h4>
          <p className="text-gray-700">
            Visit our{' '}
            <Link href="/list-your-community" className="text-blue-600 hover:underline">
              List Your Community
            </Link>{' '}
            page and submit your info. We'll be in touch with next steps.
          </p>
        </div>
        <div>
          <h4 className="font-semibold">How much does it cost?</h4>
          <p className="text-gray-700">
            There's no upfront cost. We operate on a performance-based model —
            you pay only if a referred resident moves in.
          </p>
        </div>
        <div>
          <h4 className="font-semibold">How do I update my listing or photos?</h4>
          <p className="text-gray-700">
            Email{' '}
            <a
              href="mailto:providers@guideforseniors.com"
              className="text-blue-600 hover:underline"
            >
              providers@guideforseniors.com
            </a>{' '}
            with your request.
          </p>
        </div>
      </div>

      <hr className="my-8" />

      {/* Technical Section */}
      <h2 className="text-2xl font-semibold mt-6 mb-3">🛠️ Technical</h2>
      <div className="space-y-4 mb-6">
        <div>
          <h4 className="font-semibold">
            I submitted a form but didn't hear back. What should I do?
          </h4>
          <p className="text-gray-700">
            Check your spam folder first, then email{' '}
            <a
              href="mailto:support@guideforseniors.com"
              className="text-blue-600 hover:underline"
            >
              support@guideforseniors.com
            </a>.
          </p>
        </div>
        <div>
          <h4 className="font-semibold">Is my personal information safe?</h4>
          <p className="text-gray-700">
            Yes — we don't sell or misuse your data. Read our{' '}
            <Link href="/privacy-policy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>{' '}
            for full details.
          </p>
        </div>
      </div>

      <hr className="my-8" />

      {/* Still need help Section */}
      <h2 className="text-2xl font-semibold mt-6 mb-3 text-center">❓ Still need help?</h2>
      <p className="text-center mb-6">
        <a href="#" className="font-semibold text-blue-600 hover:underline">
          Reach out to us →
        </a>{' '}
        and we'll respond within 1 business day.
      </p>
    </div>
  );
} 