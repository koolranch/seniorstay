import { Metadata } from 'next';
import GlobalHeader from '@/components/home/GlobalHeader';
import HeroRefresh from '@/components/home/HeroRefresh';
import ValueProps from '@/components/home/ValueProps';
import CareTypes from '@/components/home/CareTypes';
import Neighborhoods from '@/components/home/Neighborhoods';
import PersonalizedPlanCTA from '@/components/home/PersonalizedPlanCTA';
import AdvisorSection from '@/components/home/AdvisorSection';
import LeadMagnet from '@/components/home/LeadMagnet';
import TrustSection from '@/components/home/TrustSection';
import HomeFAQ from '@/components/home/HomeFAQ';
import Footer from '@/components/footer/Footer';
import { fetchAllCommunities } from '@/lib/fetch-community';

/**
 * Homepage - High-Authority Local Hub for Cleveland Senior Living
 * 
 * SEO Strategy:
 * - Single H1 targeting "Senior Living in Cleveland"
 * - H2s for each major section (Care Types, Neighborhoods, etc.)
 * - H3s for individual cards within sections
 * - Schema.org structured data for LocalBusiness + FAQPage
 * - Cleveland-focused content and internal linking
 */

export const metadata: Metadata = {
  title: 'Senior Living Cleveland, OH | Assisted Living & Memory Care | Guide for Seniors',
  description: 'Compare costs, reviews, and amenities for top-rated senior living communities in Cleveland. Free expert guidance from local advisors. Call (216) 677-4630.',
  keywords: 'senior living cleveland, senior living cleveland ohio, assisted living cleveland ohio, memory care cleveland, independent living cleveland, retirement communities cleveland ohio, elderly care cleveland oh',
  openGraph: {
    title: 'Find Senior Living in Cleveland, OH | Guide for Seniors',
    description: 'Compare costs, reviews, and amenities for top-rated assisted living and memory care communities in Cleveland. Free expert guidance.',
    url: 'https://www.guideforseniors.com',
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
  alternates: {
    canonical: 'https://www.guideforseniors.com',
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
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
      name: 'How much does senior living cost in Cleveland, Ohio?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Senior living costs in Cleveland, Ohio vary by care type in 2026: Independent living averages $2,200-$4,500/month, assisted living costs $3,200-$6,500/month, and memory care ranges from $4,500-$8,500/month. Premium suburbs like Beachwood and Westlake tend to be on the higher end, while Parma and Lakewood offer more affordable options. Costs typically include room, meals, activities, and basic care services.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does assisted living cost in Cleveland, Ohio?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Assisted living in Cleveland typically costs between $3,200 and $6,500 per month in 2026. Costs vary by location: premium suburbs like Beachwood average $6,800/month, Westlake around $6,200/month, while more affordable options in Parma start around $4,900/month and Lakewood at $5,100/month. These costs generally include a private or semi-private room, three meals daily, medication management, personal care assistance, housekeeping, and activities.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the best assisted living in Cleveland, Ohio?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The best assisted living in Cleveland depends on your specific needs and budget. Top-rated communities include Brookdale Senior Living locations across the metro area, Sunrise Senior Living in Westlake and Beachwood, and Arden Courts for memory care. Factors to consider include staff-to-resident ratio, available care levels, amenities, activities programming, and proximity to family. Guide for Seniors offers free, personalized recommendations based on your loved one\'s specific needs.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I find memory care near me in Cleveland?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'To find memory care in Cleveland: 1) Assess your loved one\'s specific needs and behaviors, 2) Research communities with specialized dementia programming, 3) Tour multiple facilities to compare staff training and security features, 4) Check Ohio Department of Health inspection reports, 5) Ask about staff-to-resident ratios and specialized activities. Guide for Seniors provides free guidance to help Cleveland families find appropriate memory care communities, schedule tours, and compare options.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Guide for Seniors really free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Guide for Seniors is 100% free for families. We are compensated by senior living communities when we successfully match a family with the right care—so there is never any cost to you. Our local Cleveland advisors provide unbiased recommendations, help schedule tours, and support you throughout the decision process at no charge.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between assisted living and memory care?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Assisted living provides help with daily activities like bathing, dressing, and medication management for seniors who are cognitively independent. Memory care is specialized 24/7 care for seniors with Alzheimer\'s disease, dementia, or other cognitive impairments. Memory care communities feature secure environments to prevent wandering, higher staff ratios, and specialized programming like cognitive therapy and sensory activities. In Cleveland, memory care typically costs $1,500-$2,000 more per month than assisted living.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Medicare pay for assisted living in Ohio?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Medicare does not cover assisted living costs in Ohio. However, Ohio Medicaid may help through the PASSPORT waiver program for eligible seniors. Other payment options include: long-term care insurance, Veterans Aid and Attendance benefits (up to $2,431/month for couples), life insurance conversions, and private pay. Many Cleveland-area communities offer payment plans. Guide for Seniors can help you understand financial options during a free consultation.',
      },
    },
  ],
};

export default async function HomePage() {
  // Fetch all communities for the interactive map
  const allCommunities = await fetchAllCommunities();
  
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
        {/* A. Global Header */}
        <GlobalHeader />

        {/* B. Hero Section - Refreshed with animated text rotation */}
        <HeroRefresh />

        {/* C. Value Propositions - 3 key benefits */}
        <ValueProps />

        {/* D. Care Type Authority Clusters */}
        <CareTypes />

        {/* E. Hyper-Local SEO Section - Cleveland Neighborhoods */}
        <Neighborhoods communities={allCommunities} />

        {/* F. Personalized Care Plan CTA */}
        <PersonalizedPlanCTA />

        {/* G. Talk to an Advisor Section */}
        <AdvisorSection />

        {/* H. Lead Magnet Section */}
        <LeadMagnet />

        {/* I. Trust/Social Proof Section */}
        <TrustSection />

        {/* J. FAQ Section */}
        <HomeFAQ />

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}
