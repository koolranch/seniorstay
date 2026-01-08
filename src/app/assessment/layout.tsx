import { ReactNode } from 'react';
import { metadata } from './metadata';
import Link from 'next/link';
import { Home, Phone } from 'lucide-react';

export { metadata };

// HowTo Schema for "how to choose senior living" featured snippet
const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Choose the Right Senior Living in Cleveland',
  description: 'A step-by-step guide to finding the right senior living community for your loved one in Cleveland, Ohio.',
  totalTime: 'P7D',
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'USD',
    value: '0',
  },
  tool: [
    {
      '@type': 'HowToTool',
      name: 'Guide for Seniors Care Assessment',
    },
  ],
  step: [
    {
      '@type': 'HowToStep',
      name: 'Assess Care Needs',
      text: 'Evaluate your loved one\'s daily living needs, medical requirements, and cognitive status. Our free 2-minute assessment helps determine whether assisted living, memory care, or independent living is most appropriate.',
      url: 'https://guideforseniors.com/assessment',
    },
    {
      '@type': 'HowToStep',
      name: 'Set Your Budget',
      text: 'Understand the costs of senior living in Cleveland: Independent living ($2,200-$4,500/mo), Assisted living ($3,200-$6,500/mo), Memory care ($4,500-$8,500/mo). Explore payment options including Medicaid waivers, VA benefits, and long-term care insurance.',
      url: 'https://guideforseniors.com/senior-living-costs-cleveland',
    },
    {
      '@type': 'HowToStep',
      name: 'Research Communities',
      text: 'Explore senior living communities in your preferred Cleveland neighborhoods. Consider proximity to family, healthcare facilities, and amenities. Guide for Seniors can provide personalized recommendations.',
      url: 'https://guideforseniors.com/greater-cleveland',
    },
    {
      '@type': 'HowToStep',
      name: 'Schedule Tours',
      text: 'Visit 3-5 communities to compare staff quality, cleanliness, resident engagement, and overall atmosphere. Ask about staff-to-resident ratios, activities, and care plans.',
      url: 'https://guideforseniors.com/contact',
    },
    {
      '@type': 'HowToStep',
      name: 'Make Your Decision',
      text: 'Compare your tour experiences, review contracts carefully, and choose the community that best fits your loved one\'s needs and personality. A Guide for Seniors advisor can help you navigate this process for free.',
      url: 'https://guideforseniors.com/contact',
    },
  ],
};

export default function AssessmentLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* HowTo Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(howToSchema),
        }}
      />
      
      {/* Minimal header with logo - Matches new homepage style */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-teal-600 to-teal-700 p-2 rounded-lg shadow-md group-hover:shadow-lg transition-all">
              <Home className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-900 leading-tight">
                Guide for Seniors
              </span>
              <span className="text-xs text-slate-500 hidden sm:block">
                Care Assessment
              </span>
            </div>
          </Link>
          
          {/* Help CTA */}
          <a
            href="tel:+12166774630"
            className="hidden sm:flex items-center gap-2 text-slate-600 hover:text-teal-600 font-medium transition-colors"
          >
            <Phone className="h-4 w-4" />
            <span>Need help? (216) 677-4630</span>
          </a>
        </div>
      </header>

      {/* Main content */}
      <main>{children}</main>

      {/* Minimal footer - Matches new style */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} Guide for Seniors. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy-policy" className="text-slate-500 hover:text-teal-600 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/contact" className="text-slate-500 hover:text-teal-600 transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
