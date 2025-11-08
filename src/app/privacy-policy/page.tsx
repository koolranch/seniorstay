"use client";

import React from 'react';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Last updated: November 8, 2024</p>

        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-semibold mt-8 mb-4">Introduction</h2>
          <p className="mb-4">
            Guide for Seniors ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website www.guideforseniors.com and use our senior living referral services.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Information You Provide</h3>
          <p className="mb-4">When you use our contact forms or request tours, we collect:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Name</li>
            <li>Phone number</li>
            <li>Email address (when provided)</li>
            <li>Preferred location or care type (when provided)</li>
            <li>Any additional information you choose to provide in messages</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Automatically Collected Information</h3>
          <p className="mb-4">When you visit our website, we automatically collect:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>IP address</li>
            <li>Pages visited and time spent on pages</li>
            <li>Referring website</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
          <p className="mb-4">We use the information we collect to:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Connect you with senior living communities that match your needs</li>
            <li>Respond to your inquiries and provide customer service</li>
            <li>Schedule tours and coordinate visits to communities</li>
            <li>Send you information about senior living options</li>
            <li>Improve our website and services</li>
            <li>Analyze website usage through Google Analytics</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Information Sharing</h2>
          <p className="mb-4">We may share your information with:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Senior Living Communities:</strong> When you request information or tours, we share your contact details with the communities you're interested in</li>
            <li><strong>Service Providers:</strong> We use Formspree to process contact forms and Google Analytics to analyze website traffic</li>
            <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights</li>
          </ul>
          <p className="mb-4">
            <strong>We do NOT sell your personal information to third parties.</strong>
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Cookies and Tracking</h2>
          <p className="mb-4">
            We use cookies and similar tracking technologies to improve your experience. This includes:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Google Analytics cookies to understand website usage</li>
            <li>Session cookies to remember your preferences</li>
            <li>Meta Pixel (if you consent) for advertising purposes</li>
          </ul>
          <p className="mb-4">
            You can control cookies through your browser settings.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Your Rights</h2>
          <p className="mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Opt out of marketing communications</li>
            <li>Withdraw consent at any time</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Data Security</h2>
          <p className="mb-4">
            We use reasonable security measures to protect your information. However, no internet transmission is completely secure. We cannot guarantee absolute security of your data.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Children's Privacy</h2>
          <p className="mb-4">
            Our services are not directed to individuals under 18. We do not knowingly collect information from children.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Changes to This Policy</h2>
          <p className="mb-4">
            We may update this Privacy Policy from time to time. We will notify you of changes by posting the new policy on this page with an updated "Last updated" date.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p className="mb-4">
            If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:
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

