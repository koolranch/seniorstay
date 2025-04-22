import React from 'react';

export default function SeniorLivingGuidePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Senior Living Guide</h1>

      <h3 className="text-xl font-semibold mb-4 text-center">
        Your step-by-step guide to finding the right care — and peace of mind
      </h3>

      <p className="mb-6 text-center">
        Whether you're searching for yourself or a loved one, this guide will
        walk you through the key steps in choosing senior living with clarity
        and confidence.
      </p>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mt-6 mb-3">🧓 Step 1: Understand the Types of Senior Living</h2>
      <ul className="list-none space-y-3 mb-4">
        <li>
          <h4 className="font-semibold">Independent Living</h4>
          <p className="text-sm text-gray-700">
            For active seniors who want convenience and community without the
            responsibility of homeownership.
          </p>
        </li>
        <li>
          <h4 className="font-semibold">Assisted Living</h4>
          <p className="text-sm text-gray-700">
            For those who need help with daily tasks like bathing, meals, or
            medications — with access to 24/7 care if needed.
          </p>
        </li>
        <li>
          <h4 className="font-semibold">Memory Care</h4>
          <p className="text-sm text-gray-700">
            A secure, specialized environment for those with Alzheimer's or other
            forms of dementia.
          </p>
        </li>
        <li>
          <h4 className="font-semibold">Skilled Nursing (Nursing Homes)</h4>
          <p className="text-sm text-gray-700">
            For medical conditions that require round-the-clock clinical care or
            rehabilitation.
          </p>
        </li>
      </ul>
      <p className="mb-6">
        <a href="#" className="font-semibold text-blue-600 hover:underline">
          Explore senior living options →
        </a>
      </p>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mt-6 mb-3">🧠 Step 2: Assess Needs</h2>
      <p className="mb-2">Start with a basic checklist:</p>
      <ul className="list-disc list-inside mb-4 ml-4">
        <li>Mobility</li>
        <li>Medication management</li>
        <li>Cognitive condition</li>
        <li>Social preferences</li>
        <li>Safety concerns</li>
      </ul>
      <p className="mb-6">
        Not sure where to start?{' '}
        <a href="#" className="font-semibold text-blue-600 hover:underline">
          Talk to us →
        </a>
      </p>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mt-6 mb-3">🏠 Step 3: Tour and Compare Communities</h2>
      <p className="mb-2">What to look for:</p>
      <ul className="list-disc list-inside mb-4 ml-4">
        <li>Cleanliness and friendliness</li>
        <li>Staff-to-resident ratio</li>
        <li>Dining options and meal flexibility</li>
        <li>Activity calendars</li>
        <li>Transparency in pricing</li>
      </ul>
      <p className="mb-6">
        Use our{' '}
        <a href="#" className="font-semibold text-blue-600 hover:underline">
          Tour Questions Checklist →
        </a>
      </p>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mt-6 mb-3">💵 Step 4: Plan the Finances</h2>
      <p className="mb-2">
        Senior living can range from $2,500–$8,000+/mo depending on location and
        care type.
        <br />
        Most families use:
      </p>
      <ul className="list-disc list-inside mb-4 ml-4">
        <li>Retirement income</li>
        <li>Home sale proceeds</li>
        <li>Long-term care insurance</li>
        <li>VA benefits</li>
      </ul>
      <p className="mb-6">
        <a href="#" className="font-semibold text-blue-600 hover:underline">
          Learn more about ways to pay →
        </a>
      </p>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mt-6 mb-3">🤝 Step 5: Make the Move — with Help if You Need It</h2>
      <p className="mb-4">
        GuideForSeniors is here to help at any point in the journey. Whether you
        want to browse on your own or get matched with communities, our service
        is free for families — always.
      </p>
      <div className="flex space-x-4 mb-6">
        <a
          href="#" // Replace with actual link or form action
          className="inline-block bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Request Pricing Info →
        </a>
        <a
          href="#" // Replace with actual link or form action
          className="inline-block bg-green-600 text-white font-semibold px-4 py-2 rounded hover:bg-green-700 transition-colors"
        >
          Schedule a Tour →
        </a>
      </div>
    </div>
  );
} 