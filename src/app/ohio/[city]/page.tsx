import { Metadata } from "next";
import { notFound } from "next/navigation";
// import { communities } from "@/lib/data/staticCommunities"; // Remove static import
import { prisma } from "@/lib/prisma"; // Import Prisma client
import ProviderCard from '@/components/ProviderCard';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import { slugify, unslugify } from '@/lib/utils/formatSlug';
// import { Community as CommunityDisplayTypeFromLib } from '@/lib/types/community'; // Remove this problematic import
// import { Community as PrismaCommunity } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { parseServices } from '@/lib/utils/communityUtils';
import LeadForm from '@/components/forms/LeadForm';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// Generate metadata for each city page
export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const cityName = unslugify(params.city);
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
      canonical: `/ohio/${params.city}`,
    },
  };
}

// Generate static paths for all Ohio cities with communities FROM DB
export async function generateStaticParams() {
  try {
    const cities = await prisma.community.findMany({
      where: { state: 'OH' },
      distinct: ['city'],
      select: { city: true },
    });
    
    return cities
      .filter(item => item.city) // Ensure city is not null/empty
      .map((item) => ({
        city: slugify(item.city!), // Use slugify and non-null assertion
    }));
  } catch (error) {
      console.error("Error generating static params for Ohio cities:", error);
      return [];
  }
}

// The actual page component
export default async function OhioCityPage({ params }: { params: { city: string } }) {
  const citySlug = params.city;
  const cityName = unslugify(citySlug);
  console.log('DEBUG citySlug:', citySlug);
  console.log('DEBUG cityName:', cityName);
  
  // DEBUG: list all distinct city names in your table
  const { data: allRows } = await supabase
    .from('communities')
    .select('city');
  const distinctCities = Array.from(new Set(allRows?.map(r => r.city)));
  console.log('DEBUG allDistintCities:', distinctCities);
  
  const { data: rows } = await supabase
    .from('communities')
    .select('id,slug,name,city,state,services,image_url,type,rating')
    .ilike('city', `%${cityName}%`);   // case-insensitive, wildcard match
    // .eq('state', 'OH')              // keep if you still want it

  console.log('DEBUG fetched rows count:', rows?.length, 'rows data:', rows);
  
  const communities = (rows ?? []).map(c => {
    const imageUrl = supabase.storage
      .from('community-images')
      .getPublicUrl(c.image_url).data.publicUrl ?? '/placeholder.jpg';
    return {
      id: c.id,
      slug: c.slug,
      name: c.name,
      city: c.city,
      state: c.state,
      type: c.type,
      rating: c.rating,
      amenities: parseServices(c.services),
      image: imageUrl,
    };
  });

  if (communities.length === 0) {
    // Optionally, you could show a message or redirect
    // For now, let's just show a basic message, though notFound() might be better SEO if no communities *ever* exist
    // notFound(); // Uncomment if you want a 404 for cities with no results
  }

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
            Senior Living Communities in {citySlug}, Ohio
          </h1>
          <p className="text-gray-600">
            {communities.length > 0 
              ? `Explore ${communities.length} senior living options in ${citySlug}.`
              : `No communities found matching your criteria in ${citySlug}. Try broadening your search.`}
          </p>
        </div>
      </div>
      
      {/* Communities Grid - Replace with requested markup */}
      <div className="container mx-auto px-6 md:px-10 lg:px-20 py-12">
        {communities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map(c => (
              <ProviderCard key={c.id} {...c} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
             <p className="text-lg text-gray-600">We couldn't find any communities listed in {citySlug}, Ohio currently.</p>
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
              Get Help Finding Senior Living in {citySlug}, Ohio
            </h2>
            <p className="text-gray-600 mb-8 text-center">
              Our senior living advisors can help you find the perfect community that meets your needs.
            </p>
            <LeadForm
              city={citySlug}
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