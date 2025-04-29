import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma'; // Replace Supabase import with Prisma import
import StaticPageLayout from '@/components/StaticPageLayout';
import { slugify } from '@/lib/utils/formatSlug';

// Define the expected shape of the city data
interface CityData {
  slug: string;
  city: string;
  city_slug?: string;
}

// Fetch data directly in the Server Component using Prisma
async function getCities(): Promise<CityData[]> {
  try {
    const communities = await prisma.community.findMany({
      select: {
        slug: true,
        city: true,
        city_slug: true,
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

  // Deduplicate cities based on the city name
  const uniqueCitiesMap = new Map<string, CityData>();
  cities.forEach(city => {
    if (!uniqueCitiesMap.has(city.city)) {
      uniqueCitiesMap.set(city.city, city);
    }
  });
  const uniqueCities = Array.from(uniqueCitiesMap.values());
  // Sort unique cities alphabetically by city name
  uniqueCities.sort((a, b) => a.city.localeCompare(b.city));

  return (
    <StaticPageLayout>
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
        {uniqueCities.length > 0 ? (
          <ul className="list-none grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-2">
            {uniqueCities.map((city) => (
              <li key={city.city}>
                <Link href={`/ohio/${city.city_slug || slugify(city.city)}`} className="text-blue-600 hover:underline">
                  {city.city}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Could not load city pages at this time.</p>
        )}
      </section>
    </StaticPageLayout>
  );
} 