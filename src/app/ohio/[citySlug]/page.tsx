import { Metadata } from "next";
import { notFound } from "next/navigation";
// import { communities } from "@/lib/data/staticCommunities"; // Remove static import
import { prisma } from "@/lib/prisma"; // Import Prisma client
import ProviderCard from '@/components/ProviderCard';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
// import { Community as CommunityDisplayTypeFromLib } from '@/lib/types/community'; // Remove this problematic import
// import { Community as PrismaCommunity } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { parseServices } from '@/lib/utils/communityUtils';
import LeadForm from '@/components/forms/LeadForm';
export const dynamic = 'force-dynamic';

// Utility function for slug formatting
const slugify = (text: string) => {
  return text.toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

// One-time environment sanity check for Supabase
console.log('ENV_CHECK', {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
});

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// Generate metadata for each city page
export async function generateMetadata({ params }: { params: { citySlug: string } }): Promise<Metadata> {
  const cityName = params.citySlug.replace(/-/g, ' ').replace(/%20/g, ' ');
  // Fetch count for description
  const count = await prisma.community.count({
     where: {
        city: { equals: cityName, mode: 'insensitive' },
        state: 'OH',
      },
  });
  return {
    title: `Senior Living in ${cityName}, Ohio | GuideForSeniors`,
    description: `Find and compare ${count > 0 ? count : ''} senior living communities in ${cityName}, OH. Explore options for assisted living, memory care, and more.`,
    alternates: {
      canonical: `/ohio/${params.citySlug}`,
    },
  };
}

export async function generateStaticParams() {
  const { data: communities } = await supabase
    .from('Community')
    .select('city_slug, slug');
  return communities!.map(c => ({
    citySlug: c.city_slug!,
    slug: c.slug!
  }));
}

// The actual page component
export default async function OhioCityPage({ params }: { params: { citySlug: string } }) {
  const rawSlug = params.citySlug;
  const citySlug = rawSlug.replace(/%20/g, '-');
  const cityName = citySlug.replace(/-/g, ' ').replace(/%20/g, ' ');
  console.log('DEBUG citySlug:', citySlug);
  console.log('DEBUG cityName:', cityName);
  
  // DEBUG: list all distinct city names in your table
  const { data: allRows, error } = await supabase
    .from('Community')
    .select('city');
  if (error) console.error('SUPABASE_QUERY_ERROR', error);
  const distinctCities = Array.from(new Set(allRows?.map(r => r.city)));
  console.log('DEBUG allDistintCities:', distinctCities);
  
  const { data: rows, error: supabaseError } = await supabase
    .from('Community')
    .select('id, name, slug, city, city_slug, state, services, image_url, type, rating, description')
    .eq('city_slug', params.citySlug)
    .eq('state', 'OH')

  if (supabaseError) {
    console.error('SUPABASE_ERROR', supabaseError)
    throw new Error('Could not fetch communities')
  }

  const communities = rows ?? []
  console.log('DEBUG communities:', communities)
  const communityGridLength = Array.isArray(communities) ? communities.length : 0;

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 py-10">
        <div className="container mx-auto px-6 md:px-10 lg:px-20">
           <Link 
            href="/ohio" 
            className="inline-flex items-center text-[#1b4d70] mb-6 hover:underline"
          >
            <FiArrowLeft className="mr-2" />
            Back to Ohio Communities
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Find Your Perfect Senior Living in {cityName}, Ohio
          </h1>
          <p className="mt-2 text-lg text-gray-700 max-w-2xl">
            We've curated {communityGridLength} top-rated communities in {cityName}. Compare amenities, get insider tips, and schedule your free tour today.
          </p>
          <a
            href="#city-lead-form"
            className="mt-6 inline-block px-8 py-4 bg-blue-600 text-white font-semibold rounded shadow hover:bg-blue-700 transition"
          >
            Get Free Tour Options
          </a>
        </div>
      </div>
      
      {/* Communities Grid */}
      <div className="container mx-auto px-6 md:px-10 lg:px-20 py-12">
        {communities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map(c => (
              <ProviderCard
                key={c.id}
                slug={c.slug}
                name={c.name}
                city={c.city}
                city_slug={c.city_slug}
                state={c.state}
                amenities={c.services ? (Array.isArray(c.services) ? c.services : c.services.split(/,\s*/)) : []}
                image={c.image_url}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
             <p className="text-lg text-gray-600">We couldn't find any communities listed in {cityName}, Ohio currently.</p>
             <Link href="/ohio" className="mt-4 inline-block bg-[#F5A623] text-[#1b4d70] font-medium rounded-full py-3 px-6 hover:bg-[#FFC65C] transition">
               View All Ohio Cities
             </Link>
          </div>
        )}
      </div>

      {/* ── Inline Lead Form ── */}
      <section id="city-lead-form" className="mt-16 bg-white p-8 rounded-lg shadow">
        <div className="container mx-auto px-6 md:px-10 lg:px-20">
          <h2 className="text-2xl font-bold mb-4">Get Personalized Tours & Pricing</h2>
          <p className="mb-6 text-gray-800">
            Fill out the form below and our Senior Living Advisors will reach out with options in {cityName}.
          </p>
          <form
            action="https://formspree.io/f/xnnpaply"
            method="POST"
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                required
                className="w-full px-4 py-2 border rounded text-gray-900"
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                className="w-full px-4 py-2 border rounded text-gray-900"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                className="w-full px-4 py-2 border rounded text-gray-900"
              />
              <input
                type="text"
                name="city"
                defaultValue={cityName}
                placeholder="City"
                required
                className="w-full px-4 py-2 border rounded bg-gray-100 text-gray-900"
                readOnly
              />
            </div>
            <textarea
              name="message"
              placeholder="Any specific needs or questions?"
              rows={4}
              className="w-full px-4 py-2 border rounded text-gray-900"
            />
            <button
              type="submit"
              className="mt-4 px-6 py-3 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition"
            >
              Submit Request
            </button>
          </form>

          {/* ── Trust Signals Section ── */}
          <section id="trust-signals" className="mt-12 mb-16 bg-white py-8 rounded-lg shadow">
            <div className="container mx-auto px-6">
              <h3 className="text-2xl font-bold text-center mb-6">Why Families Trust Guide for Seniors</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <p className="text-4xl font-semibold text-blue-600">4.8/5</p>
                  <p className="mt-2 font-medium">Average Rating</p>
                  <p className="text-gray-900 text-sm">From 250+ Reviews</p>
                </div>
                <div>
                  <p className="text-4xl font-semibold text-blue-600">3K+</p>
                  <p className="mt-2 font-medium">Families Served</p>
                  <p className="text-gray-900 text-sm">Across Ohio Communities</p>
                </div>
                <div>
                  <p className="text-4xl font-semibold text-blue-600">✔️</p>
                  <p className="mt-2 font-medium">Verified Listings</p>
                  <p className="text-gray-900 text-sm">Accurate & Up-to-Date</p>
                </div>
              </div>
            </div>
          </section>

          {/* ── FAQ Section ── */}
          <section id="faqs" className="mt-12 mb-16 bg-white py-8 rounded-lg shadow">
            <div className="container mx-auto px-6">
              <h3 className="text-2xl font-bold text-center mb-6">Frequently Asked Questions</h3>
              <div className="space-y-4 max-w-3xl mx-auto">
                <details className="p-4 border rounded">
                  <summary className="font-medium cursor-pointer">What senior-living options are available in {params.citySlug.replace('-', ' ')?.charAt(0).toUpperCase() + params.citySlug.replace('-', ' ').slice(1)}?</summary>
                  <p className="mt-2 text-gray-800">You'll find Assisted Living, Memory Care, Independent Living, Skilled Nursing and more—each community listing shows exactly which services they offer.</p>
                </details>
                <details className="p-4 border rounded">
                  <summary className="font-medium cursor-pointer">How do I schedule a tour?</summary>
                  <p className="mt-2 text-gray-800">Use the "Schedule a Tour" button at the top of the page or fill out the form above—our local advisors will reach out in under 24 hours to book your visit.</p>
                </details>
                <details className="p-4 border rounded">
                  <summary className="font-medium cursor-pointer">Are your community listings up to date?</summary>
                  <p className="mt-2 text-gray-800">Absolutely—each community is verified by our team monthly to ensure address, services and availability are current.</p>
                </details>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
} 