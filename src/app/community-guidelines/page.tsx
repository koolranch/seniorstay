import React from 'react';

export default function CommunityGuidelinesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Community Guidelines</h1>

      <h3 className="text-xl font-semibold mb-4">
        Our expectations for all senior living providers listed on GuideForSeniors
      </h3>

      <p className="mb-6">
        GuideForSeniors is committed to helping families make informed,
        confident decisions about senior living. To ensure a high-quality
        experience for users, we ask all Participating Communities to follow
        these Community Guidelines.
      </p>

      <p className="mb-6">
        By listing your community on GuideForSeniors, you agree to the standards
        below.
      </p>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mt-6 mb-3">✅ Accurate and Transparent Information</h2>
      <ul className="list-disc list-inside mb-6 ml-4">
        <li>
          Keep all community profile details up to date — including pricing,
          services, contact info, and photos.
        </li>
        <li>Represent care offerings and availability honestly.</li>
        <li>
          Disclose any major changes in licensing, ownership, or care levels.
        </li>
      </ul>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mt-6 mb-3">🤝 Respectful, No-Pressure Communication</h2>
      <ul className="list-disc list-inside mb-6 ml-4">
        <li>Respond to inquiries promptly and professionally.</li>
        <li>
          Never use misleading tactics, aggressive sales language, or pressure
          families into decisions.
        </li>
        <li>Respect a family's request to stop contact at any time.</li>
      </ul>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mt-6 mb-3">🏡 Quality and Safety Standards</h2>
      <ul className="list-disc list-inside mb-6 ml-4">
        <li>
          Communities must be in good standing with state licensing bodies and
          maintain appropriate staffing and care levels.
        </li>
        <li>
          Report any temporary closures, major health violations, or restrictions
          to our team immediately.
        </li>
        <li>
          We reserve the right to pause or remove listings that are unsafe or
          receive repeated verified complaints.
        </li>
      </ul>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mt-6 mb-3">🔍 Lead Handling Expectations</h2>
      <ul className="list-disc list-inside mb-6 ml-4">
        <li>
          Only use lead information provided by GuideForSeniors for the purpose
          of assisting the family.
        </li>
        <li>
          Do not sell, share, or remarket to leads outside of their inquiry intent.
        </li>
        <li>
          Let us know when a referred family moves in so we can support billing
          and tracking.
        </li>
      </ul>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mt-6 mb-3">💬 Reviews and Public Feedback</h2>
      <ul className="list-disc list-inside mb-6 ml-4">
        <li>
          Providers may not post fake reviews or offer incentives for positive
          reviews on our site or others.
        </li>
        <li>
          We welcome public feedback and will investigate any complaints about
          misrepresentation or mistreatment.
        </li>
      </ul>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mt-6 mb-3">🚫 Grounds for Removal</h2>
      <p className="mb-4">GuideForSeniors may remove or suspend a community listing that:</p>
      <ul className="list-disc list-inside mb-6 ml-4">
        <li>Posts false information</li>
        <li>Harasses families</li>
        <li>Violates applicable licensing requirements</li>
        <li>Repeatedly ignores inquiries or feedback</li>
      </ul>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mt-6 mb-3">Questions?</h2>
      <p className="mb-6">
        If you have any questions about these guidelines or want to appeal a
        removal, contact us at{' '}
        <a
          href="mailto:providers@guideforseniors.com"
          className="font-semibold text-blue-600 hover:underline"
        >
          providers@guideforseniors.com
        </a>.
      </p>
    </div>
  );
} 