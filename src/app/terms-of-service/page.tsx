"use client";

import React from 'react';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-gray-600 mb-8">Last updated: November 8, 2024</p>

        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-semibold mt-8 mb-4">Agreement to Terms</h2>
          <p className="mb-4">
            By accessing and using Guide for Seniors (www.guideforseniors.com), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Service</h2>
          <p className="mb-4">
            Guide for Seniors is a <strong>FREE referral service</strong> that helps families find senior living communities in the Cleveland, Ohio area. Our services include:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Providing information about assisted living and memory care communities</li>
            <li>Connecting families with communities that match their needs</li>
            <li>Scheduling tours and coordinating visits</li>
            <li>Offering guidance and answering questions about senior living options</li>
          </ul>
          <p className="mb-4 font-semibold">
            Important: We are a referral service, NOT a healthcare provider, senior living facility, or licensed care provider.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">No Cost to Families</h2>
          <p className="mb-4">
            Our service is completely free to families. We may receive compensation from senior living communities when we refer families to them. This compensation does not affect the cost of care or the recommendations we provide.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">No Guarantees or Warranties</h2>
          <p className="mb-4">
            We provide referrals and information, but we do NOT:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Guarantee the quality of care at any community</li>
            <li>Endorse or certify any particular facility</li>
            <li>Provide medical advice or healthcare services</li>
            <li>Guarantee availability, pricing, or acceptance at any community</li>
          </ul>
          <p className="mb-4">
            All communities listed on our website are independently owned and operated. We encourage families to:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Visit communities in person</li>
            <li>Ask detailed questions</li>
            <li>Review state inspection reports</li>
            <li>Check references</li>
            <li>Make your own informed decision</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">User Responsibilities</h2>
          <p className="mb-4">When using our service, you agree to:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Provide accurate and truthful information</li>
            <li>Conduct your own due diligence when evaluating communities</li>
            <li>Respect the time of our advisors and community staff</li>
            <li>Not use our service for any unlawful purpose</li>
            <li>Not misrepresent your identity or needs</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Information Accuracy</h2>
          <p className="mb-4">
            We strive to provide accurate information about senior living communities. However:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Community details, pricing, and availability may change</li>
            <li>We are not responsible for outdated or incorrect information</li>
            <li>Always verify information directly with the community</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Limitation of Liability</h2>
          <p className="mb-4">
            To the fullest extent permitted by law, Guide for Seniors shall not be liable for:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Any damages arising from your use of our service</li>
            <li>The quality of care provided by any senior living community</li>
            <li>Decisions made based on information from our website</li>
            <li>Any interactions or agreements between you and senior living communities</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Intellectual Property</h2>
          <p className="mb-4">
            All content on this website, including text, graphics, logos, and images, is the property of Guide for Seniors and is protected by copyright laws. You may not reproduce, distribute, or use any content without our permission.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Third-Party Links</h2>
          <p className="mb-4">
            Our website may contain links to third-party websites. We are not responsible for the content or privacy practices of these external sites.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Changes to Terms</h2>
          <p className="mb-4">
            We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting. Your continued use of our service constitutes acceptance of the updated terms.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Governing Law</h2>
          <p className="mb-4">
            These Terms of Service are governed by the laws of the State of Ohio, United States.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Information</h2>
          <p className="mb-4">
            If you have questions about these Terms of Service, please contact us:
          </p>
          <p className="mb-2">
            <strong>Email:</strong> <a href="mailto:info@guideforseniors.com" className="text-primary hover:underline">info@guideforseniors.com</a>
          </p>
          <p className="mb-2">
            <strong>Website:</strong> <Link href="/" className="text-primary hover:underline">www.guideforseniors.com</Link>
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}

