export const dynamic = 'force-dynamic';
console.log('PAGE_RUNTIME_ENV', {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SERVICE_ROLE_KEY_SET: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
});

import { notFound } from "next/navigation";
import CommunityContent from "./CommunityContent";
import Link from 'next/link';
import { Metadata } from 'next';
import React from 'react';
import CommunityActions from '../../../../components/CommunityActions';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// Define fallback image
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1519974719765-e6559eac2575?q=80&w=2070&auto=format&fit=crop";

// Define Community Client Component
const CommunityClient = ({ community }: { community: any }) => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: community.name,
    description: `Learn about ${community.name}, a senior living community in ${community.city}, OH.`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: community.city,
      addressRegion: community.state,
      addressCountry: 'US',
    },
    url: `https://www.guideforseniors.com/ohio/${community.city_slug}/${community.slug}`,
    image: community.image_url || FALLBACK_IMAGE,
  };

  // Clean up undefined properties
  if (!jsonLd.image) delete jsonLd.image;

  return (
    <>
      {/* Inject JSON-LD Script */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        key="community-jsonld"
      />

      {/* Main Page Structure */}
      <div className="bg-gray-50 min-h-screen">
        <div className="bg-white border-b border-neutral-200 py-8">
          <div className="container mx-auto px-6 md:px-10 lg:px-20">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{community.name}</h1>
            <h2 className="text-xl md:text-2xl text-blue-600 font-semibold mb-6">
              {community.type || "Senior Living"} Community in {community.city}
            </h2>
            
            {/* Add image element if available */}
            <div className="mb-6 relative overflow-hidden rounded-lg max-h-96">
              <img 
                src={community.image_url || FALLBACK_IMAGE} 
                alt={`${community.name} in ${community.city}, ${community.state}`} 
                className="w-full object-cover"
              />
            </div>
            
            <CommunityContent
              name={community.name}
              type={community.type || "Senior Living"}
              description={community.description || ""}
              address=""
              amenities={community.services ? (Array.isArray(community.services) ? community.services : community.services.split(/,\s*/)) : []}
              cityName={community.city}
              citySlug={community.city_slug}
            />
            
            <div className="mt-8 pt-8 border-t border-gray-200">
              <CommunityActions communityName={community.name} />
            </div>

            {/* ----- Phase 2: Placeholder Reviews & "You May Also Like" ----- */}
            <div className="mt-12 space-y-8">
              {/* 4. Placeholder Reviews */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <span className="text-xl font-semibold">★ 4.7 (based on 24 reviews)</span>
                <a href="#" className="ml-4 text-blue-600 hover:underline">
                  Read More
                </a>
              </div>

              {/* 5. You May Also Like */}
              <div>
                <h3 className="text-2xl font-semibold mb-4">
                  You May Also Like
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((idx) => (
                    <Link
                      key={idx}
                      href="#"
                      className="block bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
                    >
                      <h4 className="text-lg font-medium mb-1">
                        Community Name {idx}
                      </h4>
                      <p className="text-sm text-gray-700 font-medium">
                        {community.city}, {community.state}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Generate metadata for the page
export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const slugParam = decodeURIComponent(params.slug);
  
  const { data: rows, error } = await supabase
    .from('Community')
    .select('id, name, slug, city, city_slug, state, services, image_url, type, rating, description')
    .ilike('slug', `${slugParam}%`)
    .eq('city_slug', params.citySlug)
    .limit(1);

  console.log('DEBUG_LOOKUP', { citySlug: params.citySlug, slugParam, rowsCount: rows?.length, error });

  if (error) {
    console.error('SUPABASE_ERROR', error);
    return { title: 'Senior Living Community', description: 'Error loading community.' };
  }
  if (!rows?.length) {
    console.error('NO_COMMUNITY_FOUND', { citySlug: params.citySlug, slugParam });
    return notFound();
  }
  const community = rows[0];

  return {
    title: `${community.name} | Senior Living in ${community.city}, ${community.state}`,
    description:
      community.description || 
      `Discover senior-living options in ${community.city}, ${community.state}.`
  };
}

// Define Page Params interface
interface PageParams {
  citySlug: string;
  slug: string;
}

// Main page component
export default async function CommunityPage({ params }: { params: PageParams }) {
  console.log('DEBUG_SLUG_PARAM', params);
  if (!params.citySlug || !params.slug) {
    console.error('INVALID_PARAMS', params);
    return notFound();
  }

  const slugParam = decodeURIComponent(params.slug);
  console.log('DEBUG_LOOKUP_SLUG', slugParam);

  const { data: rows, error } = await supabase
    .from('Community')
    .select('id, name, slug, city, city_slug, state, services, image_url, type, rating, description')
    .ilike('slug', `${slugParam}%`)
    .eq('city_slug', params.citySlug)
    .limit(1);

  console.log('DEBUG_LOOKUP', { citySlug: params.citySlug, slugParam, rowsCount: rows?.length, error });

  if (error) {
    console.error('SUPABASE_ERROR', error);
    throw new Error(`Supabase lookup error: ${error.message}`);
  }
  if (!rows?.length) {
    console.error('NO_COMMUNITY_FOUND', { citySlug: params.citySlug, slugParam });
    return notFound();
  }

  return (
    <>
      <CommunityClient community={rows[0]} />

      {/* ─── Inline Lead Form (#3) ─────────────────────────────── */}
      <div className="container mx-auto px-6 md:px-10 lg:px-20 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto">
          <h3 className="text-2xl font-semibold mb-4">Get Your Free Quote</h3>
          <form 
            action="https://formspree.io/f/xnnpaply" 
            method="POST" 
            className="space-y-4"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input 
                type="text" 
                name="name" 
                id="name" 
                required 
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input 
                type="email" 
                name="email" 
                id="email" 
                required 
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
            <div>
              <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
                ZIP Code
              </label>
              <input 
                type="text" 
                name="zip" 
                id="zip" 
                required 
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
            <button 
              type="submit" 
              className="w-full inline-flex justify-center items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
            >
              Submit Request
            </button>
          </form>
        </div>
      </div>
      {/* ─────────────────────────────────────────────────────────── */}
    </>
  );
}