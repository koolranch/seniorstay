import React from 'react';
import Link from 'next/link'; // Import Link for internal navigation
import StaticPageLayout from '@/components/StaticPageLayout';

export default function ProviderResourcesPage() {
  return (
    <StaticPageLayout>
      <h1 className="text-3xl font-bold mb-6">Provider Resources</h1>

      <h3 className="text-xl font-semibold mb-4">
        Tools, insights, and support for senior living communities
      </h3>

      <p className="mb-6">
        At GuideForSeniors, we do more than connect families with housing — we
        support the communities that care for them. Below you'll find tools and
        resources to help you market your community, streamline referrals, and
        stay informed about industry trends.
      </p>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mt-6 mb-3">📈 Senior Living Marketing Tips</h2>
      <p className="mb-4">
        Learn how to stand out in local searches, improve your online presence,
        and turn more leads into move-ins.
      </p>
      <ul className="list-disc list-inside mb-6 ml-4">
        <li>
          <a href="#" className="text-blue-600 hover:underline">
            5 Ways to Optimize Your Community Listing
          </a>
        </li>
        <li>
          <a href="#" className="text-blue-600 hover:underline">
            How to Respond to Inquiries for Higher Conversion
          </a>
        </li>
        <li>
          <a href="#" className="text-blue-600 hover:underline">
            Photography Tips for Senior Living Marketing
          </a>
        </li>
      </ul>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mt-6 mb-3">📊 Performance-Based Referral Model</h2>
      <p className="mb-4">
        Understand how our referral system works, what makes a lead "qualified,"
        and how to improve your visibility in our directory.
      </p>
      <ul className="list-disc list-inside mb-6 ml-4">
        <li>
          <a href="#" className="text-blue-600 hover:underline">
            How Our Referral Program Works
          </a>
        </li>
        <li>
          <a href="#" className="text-blue-600 hover:underline">
            What Families Are Looking For
          </a>
        </li>
        <li>
          <a href="#" className="text-blue-600 hover:underline">
            FAQ: Billing, Terms & Move-In Confirmations
          </a>
        </li>
      </ul>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mt-6 mb-3">🛠️ Tools and Downloads</h2>
      <p className="mb-4">
        Get access to our downloadable forms, marketing templates, and tour
        request intake sheets.
      </p>
      <ul className="list-disc list-inside mb-6 ml-4">
        <li>
          <a href="#" className="text-blue-600 hover:underline">
            Community Intake Checklist (PDF)
          </a>
        </li>
        <li>
          <a href="#" className="text-blue-600 hover:underline">
            Lead Follow-Up Script Template
          </a>
        </li>
        <li>
          <a href="#" className="text-blue-600 hover:underline">
            Tour Tracker Spreadsheet
          </a>
        </li>
      </ul>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mt-6 mb-3">📬 Have a Question?</h2>
      <p className="mb-6">
        Need help optimizing your profile or submitting move-in confirmations?{' '}
        <br />
        Email us at{' '}
        <a
          href="mailto:providers@guideforseniors.com"
          className="font-semibold text-blue-600 hover:underline"
        >
          providers@guideforseniors.com
        </a>{' '}
        or visit our{' '}
        <Link href="/list-your-community" className="font-semibold text-blue-600 hover:underline">
          List Your Community
        </Link>{' '}
        page to get started.
      </p>
    </StaticPageLayout>
  );
} 