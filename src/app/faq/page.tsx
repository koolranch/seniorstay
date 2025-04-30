import React from 'react';
import Link from 'next/link'; // Import Link for internal navigation
import StaticPageLayout from '@/components/StaticPageLayout';

export default function FaqPage() {
  return (
    <StaticPageLayout>
      <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions (FAQ)</h1>

      <h3 className="text-xl font-semibold mb-4 text-center">
        Quick answers for families and providers
      </h3>

      <hr className="my-8" />

      {/* FAQ Items */}
      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-semibold mb-1">What is GuideForSeniors?</h4>
          <p className="text-gray-800">
            We're a free senior living referral service that helps families find
            trusted communities in their area — without pressure or hidden fees.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-1">Is your service really free?</h4>
          <p className="text-gray-800">
            Yes. We're paid by the community only if someone moves in. There's no
            cost to families, ever.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-1">Do you sell my information?</h4>
          <p className="text-gray-800">
            No. We only share your contact info with the communities you ask to
            hear from. We never sell data or send spam.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-1">Will I get sales calls?</h4>
          <p className="text-gray-800">
            Not unless you request info. You can browse quietly until you're
            ready to engage.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-1">How do you choose which communities to show?</h4>
          <p className="text-gray-800">
            You can browse by location and filter by care type. We show
            communities that match your search and participate in our referral
            program — but we don't endorse or rank them.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-1">Do you provide medical advice?</h4>
          <p className="text-gray-800">
            No — we offer information, not clinical assessments. Always consult a
            healthcare provider when making medical decisions.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-1">How do communities get listed?</h4>
          <p className="text-gray-800">
            Communities can request to join by visiting our{' '}
            <Link href="/list-your-community" className="text-blue-600 hover:underline">
              List Your Community
            </Link>{' '}
            page. Listings are free to add, and we only charge a referral fee
            if a move-in happens.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-1">Is my information safe?</h4>
          <p className="text-gray-800">
            Yes. We use secure forms, don't store sensitive data without
            permission, and comply with privacy best practices. View our full{' '}
            <Link href="/privacy-policy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>.
          </p>
        </div>
      </div>

      <hr className="my-8" />

      <p className="text-center mt-6">
        Still have questions?{' '}
        <Link href="/help-center" className="font-semibold text-blue-600 hover:underline">
          Visit our Help Center →
        </Link>
      </p>
    </StaticPageLayout>
  );
} 