import React from 'react';

export default function CaregiverSupportPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Caregiver Support</h1>

      <h3 className="text-xl font-semibold mb-4 text-center">
        Because helping someone else starts with taking care of you
      </h3>

      <p className="mb-4 text-center">
        If you're helping a loved one navigate aging, memory loss, or a move into
        senior living, you're a caregiver — even if you've never called yourself
        that.
      </p>
      <p className="mb-6 text-center">
        It can be one of the most meaningful roles in life. It can also be
        exhausting.
      </p>
      <p className="mb-6 text-center">
        We created this space to help you breathe, regroup, and find support.
      </p>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mt-6 mb-3">💛 Signs of Caregiver Burnout</h2>
      <ul className="list-disc list-inside mb-6 ml-4">
        <li>Feeling constantly tired, irritable, or overwhelmed</li>
        <li>Losing interest in things you used to enjoy</li>
        <li>Feeling alone in your responsibilities</li>
        <li>Trouble sleeping or focusing</li>
        <li>Putting your own health on the back burner</li>
      </ul>
      <p className="mb-6">
        These signs are common — and valid. You're not alone.
      </p>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mt-6 mb-3">🧭 Practical Support for Caregivers</h2>
      <ul className="list-disc list-inside mb-6 ml-4 space-y-1">
        <li>
          <a href="#" className="text-blue-600 hover:underline">
            How to Start the Conversation About Senior Living
          </a>
          <br />
          <span className="text-sm text-gray-600">Scripts and empathy-driven tips</span>
        </li>
        <li>
          <a href="#" className="text-blue-600 hover:underline">
            When Is It Time for Assisted Living?
          </a>
          <br />
          <span className="text-sm text-gray-600">A quick guide to recognizing the signs</span>
        </li>
        <li>
          <a href="#" className="text-blue-600 hover:underline">
            What to Do If a Loved One Refuses Help
          </a>
          <br />
          <span className="text-sm text-gray-600">Balancing autonomy with safety</span>
        </li>
        <li>
          <a href="#" className="text-blue-600 hover:underline">
            Tips for Managing Family Conflict
          </a>
          <br />
          <span className="text-sm text-gray-600">When siblings disagree about care</span>
        </li>
      </ul>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mt-6 mb-3">🧘‍♀️ Caregiver Wellness Resources</h2>
      <ul className="list-disc list-inside mb-6 ml-4 space-y-1">
        <li>
          <a
            href="https://caregiveraction.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Caregiver Action Network
          </a> – National support tools
        </li>
        <li>
          <a
            href="https://www.alz.org/help-support/resources/helpline"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Alzheimer's Association Helpline
          </a> – 24/7 support at 800-272-3900
        </li>
        <li>
          <a
            href="https://eldercare.acl.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Eldercare Locator
          </a> – U.S. government resource finder
        </li>
      </ul>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mt-6 mb-3">💬 When You're Ready for Help</h2>
      <p className="mb-4 text-center">
        When it feels like too much, it's okay to ask for backup. Whether you're
        just exploring or urgently need care options, we're here to help.
      </p>
      <p className="text-center">
        <a href="#" className="font-semibold text-blue-600 hover:underline">
          Start your senior living search →
        </a>
      </p>
      <p className="text-center">
        Or{' '}
        <a href="#" className="font-semibold text-blue-600 hover:underline">
          request pricing from a nearby community →
        </a>
      </p>
    </div>
  );
} 