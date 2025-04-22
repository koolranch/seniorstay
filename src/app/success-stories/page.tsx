import React from 'react';
import StaticPageLayout from '@/components/StaticPageLayout';

export default function SuccessStoriesPage() {
  return (
    <StaticPageLayout>
      <h1 className="text-3xl font-bold mb-6">Success Stories</h1>

      <h3 className="text-xl font-semibold mb-4 text-center">
        Real families. Real placements. Real peace of mind.
      </h3>

      <p className="mb-6 text-center">
        GuideForSeniors was built to simplify the senior living search — and
        it's working. Below are stories from families we've helped and
        communities that partner with us to connect with the right residents at
        the right time.
      </p>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mt-6 mb-3">👵 Carol & James – Rocky River, OH</h2>
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">
        <p className="mb-2">
          "We were overwhelmed with calls until we found GuideForSeniors. Instead
          of being sold to, we got a simple list of communities near my dad's
          home and chose the one that felt right. He's now thriving."
        </p>
        <footer className="text-right not-italic">— Carol M.</footer>
      </blockquote>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mt-6 mb-3">🏡 Willow Grove Senior Living</h2>
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">
        <p className="mb-2">
          "We've partnered with several lead sources, but the referrals from
          GuideForSeniors are consistently more qualified. The families come in
          informed and ready to tour — a win-win for everyone."
        </p>
        <footer className="text-right not-italic">— Melissa, Community Relations Director</footer>
      </blockquote>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mt-6 mb-3">🧓 Tim – Akron, OH</h2>
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">
        <p>
          "I didn't know where to start looking for care after my mom's fall.
          GuideForSeniors helped me understand the difference between assisted
          living and memory care, and got me in touch with 3 nearby communities
          within a day."
        </p>
      </blockquote>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mt-6 mb-3">🏆 Why These Stories Matter</h2>
      <p className="mb-4">These are just a few examples of how GuideForSeniors helps:</p>
      <ul className="list-disc list-inside mb-6 ml-4">
        <li>Families feel empowered, not overwhelmed</li>
        <li>Communities connect with residents who are a good fit</li>
        <li>Everyone saves time, avoids pressure, and gets to clarity faster</li>
      </ul>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mt-6 mb-3">Want to Share Your Story?</h2>
      <p className="mb-6 text-center">
        If you're a family or provider who had a positive experience, we'd love
        to hear from you. Email us at{' '}
        <a
          href="mailto:stories@guideforseniors.com"
          className="font-semibold text-blue-600 hover:underline"
        >
          stories@guideforseniors.com
        </a>{' '}
        or submit your story{' '}
        <a href="#" className="font-semibold text-blue-600 hover:underline">
          here
        </a>.
      </p>
    </StaticPageLayout>
  );
} 