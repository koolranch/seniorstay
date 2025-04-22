import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma'; // Replace Supabase import with Prisma import

// Define the expected shape of the city data
interface CityData {
  slug: string;
  city: string;
}

// Fetch data directly in the Server Component using Prisma
async function getCities(): Promise<CityData[]> {
  try {
    const communities = await prisma.community.findMany({
      select: {
        slug: true,
        city: true,
      },
      orderBy: {
        city: 'asc',
      },
    });
    
    // Filter out entries with null slugs or cities if necessary
    return communities.filter(city => city.slug && city.city) as CityData[];
  } catch (error) {
    console.error('Error fetching cities for sitemap:', error);
    return []; // Return empty array on error
  }
}

export default async function SitemapPage() {
  // Fetch the cities data
  const cities = await getCities();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Sitemap</h1>

      <p className="mb-6">Explore all major sections of GuideForSeniors:</p>

      {/* Static Link Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* About Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">📘 About</h2>
          <ul className="list-none space-y-2">
            <li><Link href="/how-it-works" className="text-blue-600 hover:underline">How GuideForSeniors Works</Link></li>
            <li><Link href="/our-mission" className="text-blue-600 hover:underline">Our Mission</Link></li>
            <li><Link href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link></li>
            <li><Link href="/terms-of-service" className="text-blue-600 hover:underline">Terms of Service</Link></li>
          </ul>
        </div>

        {/* For Providers Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">🏢 For Providers</h2>
          <ul className="list-none space-y-2">
            <li><Link href="/list-your-community" className="text-blue-600 hover:underline">List Your Community</Link></li>
            <li><Link href="/provider-resources" className="text-blue-600 hover:underline">Provider Resources</Link></li>
            <li><Link href="/community-guidelines" className="text-blue-600 hover:underline">Community Guidelines</Link></li>
          </ul>
        </div>

        {/* Community Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">🧭 Community</h2>
          <ul className="list-none space-y-2">
            <li><Link href="/family-resources" className="text-blue-600 hover:underline">Family Resources</Link></li>
            <li><Link href="/caregiver-support" className="text-blue-600 hover:underline">Caregiver Support</Link></li>
            <li><Link href="/senior-living-guide" className="text-blue-600 hover:underline">Senior Living Guide</Link></li>
            <li><Link href="/testimonials" className="text-blue-600 hover:underline">Testimonials</Link></li>
            <li><Link href="/success-stories" className="text-blue-600 hover:underline">Success Stories</Link></li>
          </ul>
        </div>

        {/* Support Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">🧰 Support</h2>
          <ul className="list-none space-y-2">
            <li><Link href="/help-center" className="text-blue-600 hover:underline">Help Center</Link></li>
            <li><Link href="/faq" className="text-blue-600 hover:underline">FAQ</Link></li>
            <li><Link href="/contact-a-care-advisor" className="text-blue-600 hover:underline">Contact a Care Advisor</Link></li>
            <li><Link href="/accessibility" className="text-blue-600 hover:underline">Accessibility</Link></li>
          </ul>
        </div>
      </div>

      <hr className="my-8" />

      {/* Dynamic Cities & Regions Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">📍 Cities & Regions</h2>
        {cities.length > 0 ? (
          <ul className="list-none grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-2">
            {cities.map((city) => (
              <li key={city.slug}>
                <Link href={`/senior-living/${city.slug}`} className="text-blue-600 hover:underline">
                  {city.city}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Could not load city pages at this time.</p>
        )}
      </section>
    </div>
  );
} 