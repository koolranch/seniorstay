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

      {/* Lead Form Section */}
      <div className="bg-white border-t border-neutral-200 py-12">
        <div className="container mx-auto px-6 md:px-10 lg:px-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-[#1b4d70] mb-6 text-center">
              Get Help Finding Senior Living in {cityName}, Ohio
            </h2>
            <p className="text-gray-600 mb-8 text-center">
              Our senior living advisors can help you find the perfect community that meets your needs.
            </p>
            <form
              id="city-lead-form"
              action="https://formspree.io/f/xnnpaply"
              method="POST"
              className="mt-12 bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto"
            >
              {/* Hidden metadata for better lead context */}
              <input type="hidden" name="_subject" value={`New lead: ${cityName}`} />
              <input type="hidden" name="city" value={cityName} />
              <input type="hidden" name="pageUrl" value={typeof window !== 'undefined' ? window.location.href : ''} />
              
              {/* Full Name */}
              <div className="mb-6">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name*
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  className="w-full p-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address*
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full p-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email address"
                />
              </div>

              {/* Phone */}
              <div className="mb-6">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full p-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Care Type */}
              <div className="mb-6">
                <label htmlFor="careType" className="block text-sm font-medium text-gray-700 mb-1">
                  Type of Care Needed
                </label>
                <select
                  id="careType"
                  name="careType"
                  className="w-full p-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select care type</option>
                  <option value="Assisted Living">Assisted Living</option>
                  <option value="Memory Care">Memory Care</option>
                  <option value="Independent Living">Independent Living</option>
                  <option value="Nursing Home">Nursing Home</option>
                  <option value="Home Care">Home Care</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Timeline */}
              <div className="mb-6">
                <label htmlFor="moveInTimeline" className="block text-sm font-medium text-gray-700 mb-1">
                  Move-in Timeline
                </label>
                <select
                  id="moveInTimeline"
                  name="moveInTimeline"
                  className="w-full p-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select timeline</option>
                  <option value="ASAP">ASAP</option>
                  <option value="30 days">30 days</option>
                  <option value="60 days">60 days</option>
                  <option value="90+ days">90+ days</option>
                  <option value="Just researching">Just researching</option>
                </select>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Information
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  className="w-full p-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us more about your needs..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
              >
                Request Free Consultation
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
} 