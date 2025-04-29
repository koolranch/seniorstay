import { Metadata } from "next";
import { notFound } from "next/navigation";
// import { communities } from "@/lib/data/staticCommunities"; // Remove static import
import { prisma } from "@/lib/prisma"; // Import Prisma client
import ProviderCard from '@/components/ProviderCard';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
// import { slugify } from '@/lib/utils/formatSlug';
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

// // Generate static paths for all Ohio cities with communities FROM DB
// export async function generateStaticParams() {
//   try {
//     const cities = await prisma.community.findMany({
//       where: { state: 'OH' },
//       distinct: ['city'],
//       select: { city: true },
//     });
//     
//     return cities
//       .filter(item => item.city) // Ensure city is not null/empty
//       .map((item) => ({ citySlug: slugify(item.city!) }));
//   } catch (error) {
//     console.error("Error generating static params for Ohio cities:", error);
//     return [];
//   }
// }

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
          <h1 className="text-3xl font-bold text-[#1b4d70] mb-4">
            Senior Living Communities in {cityName}, Ohio
          </h1>
          <p className="text-gray-600">
            {communities.length > 0 
              ? `Explore ${communities.length} senior living options in ${cityName}.`
              : `No communities found matching your criteria in ${cityName}. Try broadening your search.`}
          </p>
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
                state={c.state}
                amenities={c.services}
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
            <LeadForm
              city={cityName}
              state="OH"
              sourceSlug={`city-${citySlug}`}
              className="shadow-lg rounded-lg"
            />
          </div>
        </div>
      </div>
    </main>
  );
} 