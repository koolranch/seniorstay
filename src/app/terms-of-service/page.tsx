import React from 'react';
import StaticPageLayout from '@/components/StaticPageLayout';

export default function TermsOfServicePage() {
  return (
    <StaticPageLayout>
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <p className="mb-4">
        <strong>Effective Date:</strong> [April 21, 2025]
      </p>

      <p className="mb-4">
        Welcome to GuideForSeniors. This website and its services are owned and
        operated by <strong>Orchard Street LLC</strong>, a [Your State] limited
        liability company, doing business as <strong>GuideForSeniors</strong>{' '}
        ("GuideForSeniors," "we," "our," or "us").
      </p>

      <p className="mb-6">
        By using our website [www.guideforseniors.com] (the "Site") or any
        tools, forms, or services provided through the Site (collectively, the
        "Services"), you agree to be bound by the following terms and
        conditions, along with our Privacy Policy (collectively, the
        "Agreement"). If you do not agree to these Terms, please do not use our
        Site or Services.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        1. Services Overview
      </h2>
      <p className="mb-6">
        GuideForSeniors offers a no-cost resource for individuals and families
        seeking senior living options. Based on user input, we may connect you
        with senior living communities, care providers, or other service
        partners (collectively, "Participating Communities"). GuideForSeniors
        is not a placement agency, broker, or medical provider. We do not
        endorse or evaluate communities beyond publicly available and
        user-provided information.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        2. Referral Relationships
      </h2>
      <p className="mb-4">
        GuideForSeniors may receive referral fees from Participating Communities
        if you choose to engage with or move into a listed community. This
        allows us to offer our service to users at no cost.
      </p>
      <p className="mb-6">
        All care decisions are made independently between you and any
        Participating Community. We are not a party to any agreement or
        contract between you and a provider.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        3. Your Responsibilities
      </h2>
      <p className="mb-2">You agree to:</p>
      <ul className="list-disc list-inside mb-4 ml-4">
        <li>Use the Site only for lawful, personal purposes.</li>
        <li>
          Provide accurate information when using our forms or contact features.
        </li>
        <li>Not copy, scrape, or republish our content without permission.</li>
      </ul>
      <p className="mb-2">You agree not to use the Site to:</p>
      <ul className="list-disc list-inside mb-6 ml-4">
        <li>Violate any law or regulation.</li>
        <li>Interfere with or compromise site security.</li>
        <li>Misrepresent yourself or impersonate another.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        4. Communications and Consent
      </h2>
      <p className="mb-6">
        By submitting your information, you agree to be contacted by
        GuideForSeniors and/or Participating Communities via phone, email, or
        text, including via auto-dialers or pre-recorded messages. You may opt
        out at any time.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        5. No Professional Advice
      </h2>
      <p className="mb-6">
        Information on this Site is for general guidance only and not a
        substitute for professional medical, legal, or financial advice.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        6. Intellectual Property
      </h2>
      <p className="mb-6">
        All content on this Site, including design, branding, and copy, is the
        intellectual property of Orchard Street LLC or its licensors. No content
        may be used or reproduced without written permission.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        7. Third Party Content and Links
      </h2>
      <p className="mb-6">
        This Site may contain links or references to third-party sites or
        services. We do not control or guarantee the accuracy of third-party
        information. Your interactions with any third party are solely between
        you and that party.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">8. Disclaimer</h2>
      <p className="mb-6">
        The Site and Services are provided "as is" without warranties of any
        kind. We make no guarantees regarding the accuracy, availability, or
        suitability of any community listing or referral.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        9. Limitation of Liability
      </h2>
      <p className="mb-6">
        To the fullest extent permitted by law, Orchard Street LLC shall not be
        liable for any indirect, incidental, or consequential damages arising
        out of your use of the Site or Services.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        10. Indemnification
      </h2>
      <p className="mb-6">
        You agree to indemnify and hold harmless Orchard Street LLC, its
        affiliates, and its employees from any claims arising from your misuse
        of the Site, breach of these Terms, or violation of applicable law.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        11. Arbitration and Class Action Waiver
      </h2>
      <p className="mb-6">
        Any dispute between you and GuideForSeniors shall be resolved by{' '}
        <strong>binding arbitration</strong> under the rules of the American
        Arbitration Association. You waive any right to participate in a class
        action or jury trial. You may opt out of arbitration within 30 days of
        first using the Site by emailing us with your name and contact details.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        12. Changes to These Terms
      </h2>
      <p className="mb-6">
        We may update these Terms at any time. Changes will be posted with a new
        effective date. Your continued use of the Site after changes means you
        accept the updated Terms.
      </p>
    </StaticPageLayout>
  );
} 