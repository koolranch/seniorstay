'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';

interface SuburbLink {
  name: string;
  slug: string;
  description: string;
}

const medicaidApprovedSuburbs: SuburbLink[] = [
  {
    name: 'Westlake',
    slug: 'westlake',
    description: 'Medicaid waiver communities on Cleveland\'s west side'
  },
  {
    name: 'Beachwood',
    slug: 'beachwood',
    description: 'East side communities accepting Ohio Medicaid'
  },
  {
    name: 'Parma',
    slug: 'parma',
    description: 'Affordable Medicaid options in south suburbs'
  },
  {
    name: 'Lakewood',
    slug: 'lakewood',
    description: 'Near-west Medicaid-approved communities'
  },
  {
    name: 'Strongsville',
    slug: 'strongsville',
    description: 'Southwest suburban Medicaid facilities'
  },
  {
    name: 'Independence',
    slug: 'independence',
    description: 'Central location with waiver-approved care'
  }
];

interface SuburbLinksSectionProps {
  title?: string;
  subtitle?: string;
  className?: string;
  context?: 'medicaid' | 'memory-care' | 'assisted-living' | 'general';
}

export default function SuburbLinksSection({
  title = 'Find Medicaid-Approved Communities Near You',
  subtitle = 'Browse assisted living communities that accept the Ohio Medicaid Assisted Living Waiver in these Cleveland suburbs:',
  className = '',
  context = 'medicaid'
}: SuburbLinksSectionProps) {
  return (
    <section className={`bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-8 my-10 border border-emerald-100 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-emerald-100 rounded-lg">
          <MapPin className="h-6 w-6 text-emerald-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      </div>
      
      <p className="text-gray-700 mb-6">{subtitle}</p>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {medicaidApprovedSuburbs.map((suburb) => (
          <Link
            key={suburb.slug}
            href={`/location/${suburb.slug}`}
            className="group flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all"
          >
            <div>
              <span className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                {suburb.name}
              </span>
              <p className="text-xs text-gray-500 mt-1">{suburb.description}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>
      
      <p className="text-sm text-gray-600 mt-6 text-center">
        <strong>Need help navigating Medicaid?</strong>{' '}
        <Link href="/contact" className="text-emerald-600 hover:underline font-medium">
          Our local advisors provide free guidance →
        </Link>
      </p>
    </section>
  );
}








