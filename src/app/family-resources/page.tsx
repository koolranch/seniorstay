import React from 'react';

export default function FamilyResourcesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Family Resources</h1>

      <h3 className="text-xl font-semibold mb-4 text-center">
        Help for every step of the senior living journey
      </h3>

      <p className="mb-6 text-center">
        Finding the right senior living community can feel overwhelming. That's
        why we've created a growing library of resources to help you plan,
        compare, and decide with confidence.
      </p>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mt-6 mb-3">🏡 Understanding Senior Living Options</h2>
      <ul className="list-disc list-inside mb-6 ml-4 space-y-1">
        <li>
          <a href="#" className="text-blue-600 hover:underline">
            <strong>Independent Living vs. Assisted Living</strong>
          </a>
          <br />
          <span className="text-sm text-gray-600">
            What's the difference and which is right for your loved one?
          </span>
        </li>
        <li>
          <a href="#" className="text-blue-600 hover:underline">
            <strong>What Is Memory Care?</strong>
          </a>
          <br />
          <span className="text-sm text-gray-600">
            Signs it may be time and how it differs from standard assisted living.
          </span>
        </li>
        <li>
          <a href="#" className="text-blue-600 hover:underline">
            <strong>When Is It Time for Senior Care?</strong>
          </a>
          <br />
          <span className="text-sm text-gray-600">
            Red flags, checklists, and conversation tips.
          </span>
        </li>
      </ul>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mt-6 mb-3">🧠 Planning & Decision Support</h2>
      <ul className="list-disc list-inside mb-6 ml-4 space-y-1">
        <li>
          <a href="#" className="text-blue-600 hover:underline">
            <strong>How to Tour a Senior Living Community</strong>
          </a>
          <br />
          <span className="text-sm text-gray-600">
            What to ask, what to notice, and how to compare options.
          </span>
        </li>
        <li>
          <a href="#" className="text-blue-600 hover:underline">
            <strong>Questions to Ask During a Tour</strong>
          </a>
          <br />
          <span className="text-sm text-gray-600">
            Printable checklist for families.
          </span>
        </li>
        <li>
          <a href="#" className="text-blue-600 hover:underline">
            <strong>How Long Does It Take to Move In?</strong>
          </a>
          <br />
          <span className="text-sm text-gray-600">
            From inquiry to key-in-hand: what to expect.
          </span>
        </li>
      </ul>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mt-6 mb-3">💸 Financial Guidance</h2>
      <ul className="list-disc list-inside mb-6 ml-4 space-y-1">
        <li>
          <a href="#" className="text-blue-600 hover:underline">
            <strong>How Much Does Senior Living Cost?</strong>
          </a>
          <br />
          <span className="text-sm text-gray-600">
            Common ranges, what's included, and ways to pay.
          </span>
        </li>
        <li>
          <a href="#" className="text-blue-600 hover:underline">
            <strong>VA Benefits for Senior Care</strong>
          </a>
          <br />
          <span className="text-sm text-gray-600">
            Who qualifies and how to apply.
          </span>
        </li>
        <li>
          <a href="#" className="text-blue-600 hover:underline">
            <strong>Selling a Home to Fund Care</strong>
          </a>
          <br />
          <span className="text-sm text-gray-600">
            Pros, cons, and timing tips.
          </span>
        </li>
      </ul>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mt-6 mb-3">🧑‍🤝‍🧑 Caregiver Support</h2>
      <ul className="list-disc list-inside mb-6 ml-4 space-y-1">
        <li>
          <a href="#" className="text-blue-600 hover:underline">
            <strong>How to Talk to a Parent About Moving</strong>
          </a>
          <br />
          <span className="text-sm text-gray-600">
            Compassionate ways to bring up the topic.
          </span>
        </li>
        <li>
          <a href="#" className="text-blue-600 hover:underline">
            <strong>Caring for Yourself While Caring for Others</strong>
          </a>
          <br />
          <span className="text-sm text-gray-600">
            Avoiding burnout and finding support.
          </span>
        </li>
      </ul>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mt-6 mb-3">Need Personal Help?</h2>
      <p className="mb-6 text-center">
        If you'd rather talk to someone about options near you, we're happy to
        help. {' '}
        <a href="#" className="font-semibold text-blue-600 hover:underline">
          Get in touch here
        </a>{' '}
        or{' '}
        <a href="#" className="font-semibold text-blue-600 hover:underline">
          request pricing
        </a>{' '}
        from a nearby community — no pressure, just info.
      </p>
    </div>
  );
} 