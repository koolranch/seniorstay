import React from 'react';
import StaticPageLayout from '@/components/StaticPageLayout';

export default function OurMissionPage() {
  return (
    <StaticPageLayout>
      <h1 className="text-3xl font-bold mb-6">Our Mission</h1>

      <p className="text-lg italic mb-6 text-center">
        At GuideForSeniors, our mission is simple:{' '}
        <br />
        <strong>
          To help families find the right senior living solution — with clarity,
          confidence, and compassion.
        </strong>
      </p>

      <p className="mb-6">
        We know the search for senior housing can feel overwhelming. Whether
        you're exploring options for yourself or a loved one, you're likely
        facing an urgent timeline, complex decisions, and too many sales
        pitches. That's where we come in.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">Why We Exist</h2>
      <p className="mb-6">
        We built GuideForSeniors to bring simplicity, transparency, and trust to
        the senior living search process. Our platform offers free access to
        curated community listings, helpful tools, and direct contact options —
        all without pressure or obligations.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">How We Help</h2>
      <ul className="list-disc list-inside mb-6 ml-4">
        <li>
          We provide honest, up-to-date listings for senior living communities
          across the U.S.
        </li>
        <li>
          We help you compare care types, amenities, and pricing at your own pace.
        </li>
        <li>
          We forward your requests to communities based on your preferences — no
          sales pressure, just information.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-3">What We Believe</h2>
      <p className="mb-2">We believe every family deserves:</p>
      <ul className="list-disc list-inside mb-4 ml-4">
        <li>
          <strong>Clarity</strong> in a confusing landscape
        </li>
        <li>
          <strong>Dignity</strong> in decision-making
        </li>
        <li>
          <strong>Compassion</strong> at every step
        </li>
        <li>
          <strong>Empowerment</strong> to choose what's best for them
        </li>
      </ul>

      <p className="mb-6">
        We are not owned by a senior housing chain. We are not driven by quotas.
        Our commitment is to the people we serve — not the providers.
      </p>

      <p className="mb-6">
        Whether you're just beginning your search or narrowing down your
        options, GuideForSeniors is here to help you navigate with confidence.
      </p>
    </StaticPageLayout>
  );
} 