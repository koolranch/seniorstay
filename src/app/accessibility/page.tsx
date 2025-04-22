import React from 'react';
import StaticPageLayout from '@/components/StaticPageLayout';

export default function AccessibilityPage() {
  return (
    <StaticPageLayout>
      <h1 className="text-3xl font-bold mb-6">Accessibility</h1>

      <h3 className="text-xl font-semibold mb-4 text-center">
        Our commitment to accessibility and inclusion
      </h3>

      <p className="mb-6 text-center">
        GuideForSeniors is committed to making our website accessible to
        everyone, including individuals with disabilities. We are continuously
        working to improve the accessibility and usability of our site and strive
        to meet the Web Content Accessibility Guidelines (WCAG) 2.1, Level AA.
      </p>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mt-6 mb-3">What We're Doing</h2>
      <ul className="list-disc list-inside mb-6 ml-4">
        <li>We use semantic HTML to help screen readers interpret content</li>
        <li>We provide sufficient color contrast for text and background elements</li>
        <li>Our site is responsive and built to work on desktop, tablet, and mobile</li>
        <li>We test with keyboard-only navigation and screen readers</li>
      </ul>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mt-6 mb-3">Need Help Accessing Content?</h2>
      <p className="mb-4">
        If you experience difficulty accessing any part of our website or need
        assistance with any content, we're here to help.
      </p>
      <p className="mb-4">Please contact us at:</p>
      <ul className="list-none space-y-1 mb-6">
        <li>
          📧{' '}
          <a
            href="mailto:accessibility@guideforseniors.com"
            className="font-semibold text-blue-600 hover:underline"
          >
            accessibility@guideforseniors.com
          </a>
        </li>
        <li>📞 <strong>[Insert phone number, if applicable]</strong></li>
      </ul>
      <p className="mb-6">
        We'll respond as quickly as possible to provide the information or support
        you need.
      </p>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mt-6 mb-3">Ongoing Improvements</h2>
      <p className="mb-6">
        We are actively reviewing our website to identify and address any
        accessibility barriers. Our goal is to provide a welcoming,
        user-friendly experience for everyone — regardless of age, ability, or
        assistive technology.
      </p>
    </StaticPageLayout>
  );
} 