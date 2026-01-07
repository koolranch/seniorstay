import { Metadata } from 'next';
import GlobalHeader from '@/components/home/GlobalHeader';
import Hero from '@/components/home/Hero';
import CareTypes from '@/components/home/CareTypes';
import Neighborhoods from '@/components/home/Neighborhoods';
import LeadMagnet from '@/components/home/LeadMagnet';
import TrustSection from '@/components/home/TrustSection';
import Footer from '@/components/footer/Footer';

/**
 * Homepage V2 - High-Authority Local Hub for Cleveland Senior Living
 * 
 * Route: /home-v2 (for testing before replacing main homepage)
 * 
 * SEO Strategy:
 * - Single H1 targeting "Senior Living in Cleveland"
 * - H2s for each major section (Care Types, Neighborhoods, etc.)
 * - H3s for individual cards within sections
 * - Schema.org structured data for LocalBusiness + FAQPage
 * - Cleveland-focused content and internal linking
 */

export const metadata: Metadata = {
  title: 'Find Senior Living in Cleveland, OH | Assisted Living & Memory Care | Guide for Seniors',
  description: 'Compare costs, reviews, and amenities for top-rated assisted living and memory care communities in Cleveland and Northeast Ohio. Free expert guidance from local advisors.',
  keywords: 'senior living cleveland, assisted living cleveland ohio, memory care cleveland, retirement communities northeast ohio, elderly care cleveland, nursing homes cleveland oh',
  openGraph: {
    title: 'Find Senior Living in Cleveland, OH | Guide for Seniors',
    description: 'Compare costs, reviews, and amenities for top-rated assisted living and memory care communities in Cleveland. Free expert guidance.',
    url: 'https://guideforseniors.com',
    siteName: 'Guide for Seniors',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://guideforseniors.com/og-home.jpg',
        width: 1200,
        height: 630,
        alt: 'Guide for Seniors - Cleveland Senior Living Experts',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Senior Living in Cleveland, OH | Guide for Seniors',
    description: 'Compare costs, reviews, and amenities for top-rated assisted living and memory care communities in Cleveland.',
  },
  robots: {
    index: false, // Don't index the v2 test page
    follow: true,
  },
};

// Schema.org structured data
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://guideforseniors.com/#organization',
  name: 'Guide for Seniors',
  description: 'Guide for Seniors helps Cleveland families find the right senior living communities including assisted living, memory care, and independent living options.',
  url: 'https://guideforseniors.com',
  telephone: '+1-216-677-4630',
  email: 'info@guideforseniors.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Cleveland',
    addressRegion: 'OH',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 41.4993,
    longitude: -81.6944,
  },
  areaServed: {
    '@type': 'GeoCircle',
    geoMidpoint: {
      '@type': 'GeoCoordinates',
      latitude: 41.4993,
      longitude: -81.6944,
    },
    geoRadius: '50000',
  },
  priceRange: 'Free',
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '17:00',
  },
  sameAs: [
    'https://www.facebook.com/guideforseniors',
    'https://twitter.com/guideforseniors',
    'https://www.linkedin.com/company/guide-for-seniors',
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does assisted living cost in Cleveland, Ohio?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Assisted living in Cleveland typically costs between $3,500 and $6,500 per month in 2026. Costs vary by location, with premium suburbs like Beachwood averaging $6,800/month and more affordable options in Parma starting around $4,900/month. Memory care costs are typically $1,500-$2,000 higher per month.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Guide for Seniors really free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Guide for Seniors is 100% free for families. We are compensated by senior living communities when we successfully match a family with the right care—so there is never any cost to you, and our recommendations are always unbiased.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between assisted living and memory care?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Assisted living provides help with daily activities like bathing, dressing, and medication management for seniors who are cognitively independent. Memory care is specialized 24/7 care for seniors with Alzheimer\'s disease, dementia, or other cognitive impairments, featuring secure environments and specialized programming.',
      },
    },
  ],
};

export default function HomePageV2() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([organizationSchema, faqSchema]),
        }}
      />

      <main className="min-h-screen flex flex-col">
        {/* A. Global Header - Clean logo + CTA */}
        <GlobalHeader />

        {/* B. Hero Section - Single H1, Search Bar UI */}
        <Hero />

        {/* C. Care Type Authority Clusters (The "Silos") */}
        <CareTypes />

        {/* D. Hyper-Local SEO Section - Cleveland Neighborhoods */}
        <Neighborhoods />

        {/* E. Lead Magnet Section (The Lead Gen Engine) */}
        <LeadMagnet />

        {/* F. Trust/Social Proof Section */}
        <TrustSection />

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}

