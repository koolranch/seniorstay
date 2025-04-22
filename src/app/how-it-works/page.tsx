import React from 'react';
import Link from 'next/link';
import StaticPageLayout from '@/components/StaticPageLayout';

export default function HowItWorksPage() {
  return (
    <StaticPageLayout>
      <h1 className="text-3xl font-bold mb-6">How GuideForSeniors Works</h1>

      <h3 className="text-xl font-semibold mb-4">
        We're like a real estate agent — but for senior living.
      </h3>

      <p className="mb-6">
        Finding the right senior living community is a big decision. At
        GuideForSeniors, we make that process easier by offering{' '}
        <strong>free local placement support</strong> to individuals and families
        navigating options like assisted living, memory care, or independent
        living.
      </p>

      <p className="mb-6">Here's how it works:</p>

      <hr className="my-8" />

      <h3 className="text-xl font-semibold mb-3">🧭 Step 1: Tell Us What You Need</h3>
      <p className="mb-6">
        Fill out a quick form or contact us with your preferences — location,
        care needs, budget, and anything else important to your decision.
      </p>

      <hr className="my-8" />

      <h3 className="text-xl font-semibold mb-3">
        🏠 Step 2: We Match You With Communities
      </h3>
      <p className="mb-6">
        Based on your needs, we identify a short list of local senior living
        communities that fit what you're looking for. You'll get detailed info,
        contact details, and the ability to schedule tours or request pricing —
        all in one place.
      </p>

      <hr className="my-8" />

      <h3 className="text-xl font-semibold mb-3">
        💬 Step 3: We Support You Through the Process
      </h3>
      <p className="mb-6">
        Whether you just want pricing or prefer full hands-on help, we're here.
        You'll never be pressured. You control the pace — we just make it easier.
      </p>

      <hr className="my-8" />

      <h3 className="text-xl font-semibold mb-3">💸 Who Pays Us? Not You.</h3>
      <p className="mb-6">
        Just like a real estate agent, we're paid by the senior living communities
        if you move in — never by you. That means our services are always{' '}
        <strong>100% free to families</strong>.
      </p>

      <hr className="my-8" />

      <h3 className="text-xl font-semibold mb-3">🤝 Why Families Trust GuideForSeniors</h3>
      <ul className="list-disc list-inside mb-6 ml-4">
        <li>
          <strong>No pressure</strong> — You're in control. We'll never "sell" you.
        </li>
        <li>
          <strong>Local insights</strong> — We know the communities near you and how
          to compare them.
        </li>
        <li>
          <strong>No hidden fees</strong> — There's no catch. We only get paid if we
          help you make a successful match.
        </li>
      </ul>

      <hr className="my-8" />

      <h3 className="text-xl font-semibold mb-3">Start Your Search Today</h3>
      <p className="mb-6">
        Use our site to browse senior communities near you, or reach out for
        personalized help. Whether you're planning ahead or facing a quick
        decision, we're here to support your family with clarity and care.
      </p>
    </StaticPageLayout>
  );
} 