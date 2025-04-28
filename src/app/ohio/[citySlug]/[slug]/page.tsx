export const dynamic = 'force-dynamic';
console.log('SLUG_PAGE_ENV', { NODE_ENV: process.env.NODE_ENV });

import { notFound } from "next/navigation";
import CommunityContent from "./CommunityContent";
import Link from 'next/link';
import { Metadata } from 'next';
import { slugify } from "@/lib/utils/formatSlug";
import React from 'react';
import CommunityActions from '../../../../components/CommunityActions';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// Helper to fetch and map community data
async function fetchCommunityBySlug(slugParam: string) {
  const { data, error } = await supabase
    .from('Community')
    .select(
      'id, slug, name, city, state, services, image_url, type, rating'
    )
    .ilike('slug', slugParam)
    .limit(1);

  if (error) {
    console.error('SUPABASE_QUERY_ERROR', error);
    return null;
  }
  if (!data || data.length === 0) {
    console.warn('SUPABASE_EMPTY', { slugParam });
    return null;
  }

  const c = data[0];

  // build a safe public image URL
  let image: string | null = null;
  if (c.image_url) {
    image = c.image_url.startsWith('http')
      ? c.image_url
      : `https://hncgnxbooghjhpncujzx.supabase.co/storage/v1/object/public/${c.image_url.replace(
          /^community-images\//,
          'community-images/'
        )}`;
  }

  return {
    id: c.id,
    slug: c.slug,
    name: c.name,
    city: c.city,
    state: c.state,
    services: c.services,
    type: c.type ?? undefined,
    rating: c.rating ?? undefined,
    image
  };
}

// Define Page Params interface
interface PageParams {
  citySlug: string;
  slug: string;
}

// Generate metadata for the page
export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const slugParam = decodeURIComponent(params.slug);
  const community = await fetchCommunityBySlug(slugParam);
  if (!community) return notFound();

  return {
    title: `${community.name} | Senior Living in ${community.city}, ${community.state}`,
    description:
      community.services ??
      `Discover senior-living options in ${community.city}, ${community.state}.`
  };
}

// Helper function to render a fallback UI when community isn't found
function renderFallbackUI(title: string, message: string, cityParam?: string) {
  const fallbackMessage = cityParam 
    ? `We couldn't find information for this senior living community in ${cityParam.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}, Ohio.` 
    : message;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-neutral-200 py-8">
        <div className="container mx-auto px-6 md:px-10 lg:px-20">
          <div className="max-w-3xl mx-auto text-center py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{title}</h1>
            <p className="text-lg text-gray-600 mb-8">{fallbackMessage}</p>
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <Link
                href="/ohio"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Browse Ohio Communities
              </Link>
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main page component
export default async function CommunityPage({ params }: { params: PageParams }) {
  if (!params?.citySlug || !params.slug) {
    console.error("Ohio community page: Invalid or missing params.");
    return renderFallbackUI("Invalid Page Request", "The requested community page URL is invalid.", undefined);
  }
  
  const slugParam = decodeURIComponent(params.slug);
  const community = await fetchCommunityBySlug(slugParam);
  if (!community) return notFound();

  // --- Construct JSON-LD --- 
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
    url: `https://www.guideforseniors.com/ohio/${slugify(community.city).toLowerCase()}/${community.slug}`,
    // Image property - add if available
    image: community.image || undefined,
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
            {community.image && (
              <div className="mb-6 relative overflow-hidden rounded-lg max-h-96">
                <img 
                  src={community.image} 
                  alt={`${community.name} in ${community.city}, ${community.state}`} 
                  className="w-full object-cover"
                />
              </div>
            )}
            
            <CommunityContent
              name={community.name}
              type={community.type || "Senior Living"}
              description=""
              address=""
              amenities={[]}
              cityName={community.city}
            />
            
            <div className="mt-8 pt-8 border-t border-gray-200">
              <CommunityActions communityName={community.name} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}