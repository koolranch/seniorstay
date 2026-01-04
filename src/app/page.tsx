"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, MapPin, Star, ArrowRight, Info, CheckCircle } from 'lucide-react';
import Header from '@/components/header/Header';
import CategoryTabs from '@/components/category/CategoryTabs';
import LocationTabs from '@/components/location/LocationTabs';
import FilterIndicator from '@/components/filter/FilterIndicator';
import LocationFilterIndicator from '@/components/filter/LocationFilterIndicator';
import SearchResults from '@/components/search/SearchResults';
import ComparisonFloatingButton from '@/components/comparison/ComparisonFloatingButton';
import Footer from '@/components/footer/Footer';
import LocationCard from '@/components/property/LocationCard';
import HowItWorks from '@/components/landing/HowItWorks';
import ZipTourScheduler from '@/components/tour/ZipTourScheduler';
import ZipSearchWidget from '@/components/tour/ZipSearchWidget';
import ScheduleTourFAB from '@/components/tour/ScheduleTourFAB';
import { Community, communityData } from '@/data/facilities';
import { testimonials } from '@/data/testimonials';
import { fetchAllCommunities } from '@/lib/fetch-community';

// Create a separate component for the search functionality
function SearchContainer() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('query') || '';

  // Filters
  const [selectedCareFilter, setSelectedCareFilter] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [communities, setCommunities] = useState<Community[]>(communityData); // Start with static data
  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>(communityData);
  const [loading, setLoading] = useState(true);

  // Fetch communities from Supabase on mount
  useEffect(() => {
    async function loadCommunities() {
      try {
        const data = await fetchAllCommunities();
        if (data && data.length > 0) {
          // Filter to only Assisted Living and Memory Care (exclude skilled nursing-only)
          const filteredData = data.filter(c => {
            const isAssistedOrMemoryCare = c.careTypes.some(type => 
              type.toLowerCase().includes('assisted living') || 
              type.toLowerCase().includes('memory care')
            );
            
            const isOnlySkilledNursing = c.careTypes.every(type => 
              type.toLowerCase().includes('skilled nursing')
            );
            
            return isAssistedOrMemoryCare && !isOnlySkilledNursing;
          });
          
          setCommunities(filteredData);
          setFilteredCommunities(filteredData);
        }
      } catch (error) {
        console.error('Error loading communities:', error);
        // Keep using static data as fallback
      } finally {
        setLoading(false);
      }
    }
    loadCommunities();
  }, []);

  // Store active filter labels for display
  const [activeCareLabel, setActiveCareLabel] = useState('');
  const [activeLocationLabel, setActiveLocationLabel] = useState('');

  // Extract all unique cities from communities
  const allCities = Array.from(new Set(communities.map(community =>
    community.location.split(',')[0].trim()
  ))).sort();

  // Get all unique care types across all communities
  const allCareTypes = Array.from(new Set(
    communities.flatMap(community => community.careTypes)
  )).sort();

  // Apply filters
  useEffect(() => {
    let results = [...communities];

    // Apply care type filter
    if (selectedCareFilter !== 'all') {
      results = results.filter(community =>
        community.careTypes.some(type =>
          type.toLowerCase() === selectedCareFilter.toLowerCase()
        )
      );
    }

    // Apply location filter
    if (selectedLocation !== 'all') {
      results = results.filter(community => {
        const communityCity = community.location.split(',')[0].trim();
        return communityCity.toLowerCase() === selectedLocation.toLowerCase();
      });
    }

    // Apply search query if exists
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(community => {
        return (
          community.name.toLowerCase().includes(query) ||
          community.location.toLowerCase().includes(query) ||
          community.careTypes.some(type => type.toLowerCase().includes(query)) ||
          (community.description && community.description.toLowerCase().includes(query))
        );
      });
    }

    setFilteredCommunities(results);
  }, [selectedCareFilter, selectedLocation, searchQuery]);

  // Set active filter labels for display when filters change
  useEffect(() => {
    // Set care type label
    if (selectedCareFilter === 'all') {
      setActiveCareLabel('');
    } else {
      const careType = allCareTypes.find(f => f.toLowerCase() === selectedCareFilter.toLowerCase());
      setActiveCareLabel(careType ? careType : selectedCareFilter);
    }

    // Set location label
    setActiveLocationLabel(selectedLocation === 'all' ? '' : selectedLocation);
  }, [selectedCareFilter, selectedLocation, allCareTypes]);

  // Count communities by type
  const communityCounts = allCareTypes.reduce((acc, type) => {
    acc[type] = communityData.filter(c => c.careTypes.includes(type)).length;
    return acc;
  }, {} as Record<string, number>);

  // Count communities by city for display
  const cityCounts = allCities.reduce((acc, city) => {
    acc[city] = communityData.filter(c => c.location.split(',')[0].trim() === city).length;
    return acc;
  }, {} as Record<string, number>);

  // Filter Cleveland-area communities for featured section
  // Expanded to include all Greater Cleveland and Northeast Ohio cities with communities
  const clevelandCities = [
    'Cleveland', 'Shaker Heights', 'Beachwood', 'Parma', 'Lakewood', 'Strongsville', 
    'Westlake', 'North Olmsted', 'Richmond Heights', 'Seven Hills', 'Independence',
    'Brooklyn', 'Bedford', 'Avon', 'Brunswick', 'Macedonia', 'Berea', 'Chardon',
    'Mentor', 'North Ridgeville', 'Medina', 'Cuyahoga Falls', 'Akron'
  ];
  
  // Curated list of community IDs with VERIFIED working images (updated 2024-12-30)
  // Only these will show on homepage to ensure credibility - no broken images
  // All images hosted on Supabase Storage for reliability (no hotlinking issues)
  const verifiedImageCommunityIds = [
    // Cleveland Core
    '698c2427-1daa-40fd-8541-d70adfaaa79f', // Arden Courts of Parma
    'e6d78620-bd6f-4961-a067-6f79e3d47d00', // Arden Courts of Westlake
    'b575720a-cbd9-4d7a-bb54-f384c4d74baf', // Brookdale Westlake Village
    'b1c7f9ca-12f8-427f-958b-96395e2f87f9', // Eliza Jennings (Cleveland)
    '53439bfd-9ef2-4890-8496-aae88638175d', // Forest Hills Place (Cleveland)
    '595c27ce-2d7a-4d52-8892-6bdd07d0df29', // HarborChase of Shaker Heights
    '82b7522b-3cc5-46d0-aacc-4aa61a4da223', // Haven at Lakewood
    'cced7602-0584-4b10-b928-fb69de53e683', // Kemper House Strongsville
    'd37abc69-b7b1-41dc-9d83-8addb8a13af1', // Mount Alverna Village (Parma)
    '217c0b13-e5c0-480c-9131-a171e2b707e7', // O'Neill Healthcare Lakewood
    '067f4eb4-1a6d-4537-a17b-46374e853301', // Rose Senior Living at Beachwood
    'bc68a68b-51c9-4490-858d-a8656427e027', // StoryPoint Strongsville
    'd513dee6-8f01-43bf-ae4c-9da58f0e1fb2', // Sunrise at Parma
    '46f44534-0bb5-412b-b631-d7693c957bc2', // Vista Springs Ravinia (Independence)
    '8307a5ae-48b9-4055-97c8-970f219bf071', // Westlake Assisted Living
    // Greater Cleveland / Suburbs
    '85b6c366-876c-434f-bc3c-cd9546b769c3', // American House Macedonia
    'b64c4494-2ea7-45f6-bbe3-a66a33e777a2', // Berea Alzheimer's Care Center
    '1364b89d-5f10-4497-885e-63bc1980a81c', // Brooklyn Pointe (Brooklyn)
    'ebf24b4b-93e3-49a2-aa29-fe17ea13478e', // Cardinal Court
    'd58d215c-f8a1-41f1-9d51-7f3cbd26a4c5', // Danbury Senior Living Brunswick
    'baac72b7-478e-4306-9761-398355cbd5d6', // Light of Hearts Villa (Bedford)
    '3af95a7c-6b08-41dc-816c-59dc2fcf95fe', // Summit Point Macedonia
    '64d20122-dceb-4715-9139-0db8adc903b', // Ganzhorn Suites of Avon
    // Northeast Ohio (Mentor, Medina, etc.)
    'b287add2-1b83-4c9f-b364-44e5117575e1', // Danbury Senior Living Mentor
    'dff5aeab-df72-481b-b9f1-0a8540630d20', // Danbury Senior Living North Ridgeville
    'ca38eb95-4ed5-441b-824e-160386034910', // Brookdale Medina South
    '93a420ab-7890-4e8b-a08d-e31404698847', // StoryPoint Medina
    '3c3fbde5-0117-4da8-9eb3-1b660240131f', // Maplewood at Chardon
    // Akron / Cuyahoga Falls Area
    '24a1d6c9-83da-4e68-a7cc-6d61f420ee55', // Danbury Cuyahoga Falls
    '220ef84c-9916-44aa-a649-621a936642f1', // Maplewood at Cuyahoga Falls
    'be6426df-1380-48f4-b925-332fbb4e02bb', // Brookdale Montrose (Akron)
    '08ca2f88-da07-44b3-98af-3c47b3a8f675', // Vitalia Montrose (Akron)
    // Other verified
    '8dde23b1-818e-4120-be39-4303dfaaa050', // Fairmont Senior Living of Westlake
    'fb781978-f151-4ca4-b98c-f75fd8b1a5c4', // St. Augustine Towers Assisted Living
  ];
  
  // Only show Assisted Living and Memory Care on homepage (exclude skilled nursing-only)
  // Use 'communities' state (from Supabase) not 'communityData' (static)
  const qualityCommunities = communities.filter(c => {
    const isInCleveland = clevelandCities.some(city => 
      c.location.toLowerCase().includes(city.toLowerCase())
    );
    
    const isAssistedOrMemoryCare = c.careTypes.some(type => 
      type.toLowerCase().includes('assisted living') || 
      type.toLowerCase().includes('memory care')
    );
    
    // Exclude if ONLY skilled nursing (keep if it has AL/MC + SN)
    const isOnlySkilledNursing = c.careTypes.every(type => 
      type.toLowerCase().includes('skilled nursing')
    );
    
    // For featured section: only show communities with verified working images
    const hasVerifiedImage = verifiedImageCommunityIds.includes(c.id);
    
    return isInCleveland && isAssistedOrMemoryCare && !isOnlySkilledNursing && hasVerifiedImage;
  });
  
  // Sort by Memory Care first, then Assisted Living
  const sortedQualityCommunities = [...qualityCommunities].sort((a, b) => {
    const aHasMemoryCare = a.careTypes.some(t => t.toLowerCase().includes('memory care'));
    const bHasMemoryCare = b.careTypes.some(t => t.toLowerCase().includes('memory care'));
    
    if (aHasMemoryCare && !bHasMemoryCare) return -1;
    if (!aHasMemoryCare && bHasMemoryCare) return 1;
    return 0;
  });
  
  const featuredCommunities = selectedCareFilter === 'all' && selectedLocation === 'all' && !searchQuery
    ? sortedQualityCommunities.slice(0, 6)
    : filteredCommunities;
  
  const showViewAll = selectedCareFilter === 'all' && selectedLocation === 'all' && !searchQuery;

  return (
    <>
      {/* Cleveland Service Banner */}
      <div className="bg-primary/10 border-b border-primary/20">
        <div className="container mx-auto px-4 py-3">
          <div className="text-center">
            <span className="text-sm md:text-base font-semibold text-primary">
              🏠 Proudly Serving Greater Cleveland & Northeast Ohio
            </span>
            <span className="hidden md:inline text-gray-600 mx-3">|</span>
            <span className="block md:inline text-sm text-gray-700">Free local guidance for families</span>
          </div>
        </div>
      </div>

      {/* Hero Section - Cleveland-Focused */}
      <div className="bg-gradient-to-r from-blue-900/5 to-blue-800/10 py-12 md:py-20 border-b border-gray-200 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231E3A8A' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center leading-tight">
              Find Assisted Living & Memory Care in Cleveland, Ohio
            </h1>
            <p className="text-base md:text-lg text-gray-700 mb-6 text-center max-w-3xl mx-auto">
              Helping Cleveland families find the right memory care and assisted living communities. Compare top-rated options, schedule tours, and get pricing—all free with personalized local guidance.
            </p>

            {/* Trust Signals */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-10 text-sm">
              <div className="flex items-center gap-2 bg-white px-5 py-3 rounded-full shadow-md hover:shadow-lg transition-shadow">
                <div className="flex">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <span className="font-bold text-gray-900 text-base">4.8/5</span>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-5 py-3 rounded-full shadow-md border border-blue-200 font-bold text-gray-900">
                <span className="text-primary">500+</span> Families Helped
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-100 px-5 py-3 rounded-full border border-green-300 font-bold text-green-800 shadow-md">
                ✓ 100% Free Service
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-amber-100 px-5 py-3 rounded-full border border-orange-200 font-bold text-orange-800 shadow-md">
                📍 Local Experts
              </div>
            </div>

            {/* Zip-Based Tour Search - MOVED TO HERO */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200 mb-8">
              <ZipSearchWidget onSearch={(zip) => {
                // Scroll to results section
                const resultsSection = document.getElementById('zip-search-results');
                if (resultsSection) {
                  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }} />
            </div>

            <div className="text-center space-y-3">
              <p className="text-sm text-gray-600">or</p>
              <Link
                href="/assessment"
                className="inline-flex items-center gap-2 bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all text-lg"
              >
                <span>Find Your Ideal Care Level (2 min)</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <p className="text-sm text-gray-600">or</p>
              <Link
                href="#communities"
                className="inline-flex items-center text-primary hover:underline font-semibold text-lg"
              >
                <span>Browse all {communityData.length} Cleveland communities</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Zip Search Results Section */}
      <div id="zip-search-results">
        <ZipTourScheduler />
      </div>

      {/* Assessment CTA Section */}
      <div className="bg-gradient-to-br from-orange-50 to-blue-50 py-16 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-4">
              Not Sure What Level of Care You Need?
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Take our free 2-minute assessment to get personalized recommendations 
              for memory care or assisted living based on your loved one's specific needs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/assessment">
                <button className="w-full sm:w-auto bg-[#ff5a5f] hover:bg-[#ff4449] text-white font-bold px-10 py-5 rounded-xl shadow-lg hover:shadow-xl transition-all text-lg flex items-center justify-center gap-2">
                  Take Free Assessment
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Takes 2 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>100% free</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Instant results</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Indicators */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <FilterIndicator
            label={activeCareLabel}
            isActive={!!activeCareLabel}
            onClear={() => setSelectedCareFilter('all')}
          />
          <LocationFilterIndicator
            location={activeLocationLabel}
            isActive={!!activeLocationLabel}
            onClear={() => setSelectedLocation('all')}
          />
        </div>
      </div>

      {/* Search Results */}
      {searchQuery && (
        <SearchResults query={searchQuery} results={filteredCommunities} />
      )}

      {/* Testimonials Section - Show only when not filtering */}
      {!searchQuery && selectedCareFilter === 'all' && selectedLocation === 'all' && (
        <div className="bg-gray-50 py-16 border-t border-gray-200">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-2">Trusted by Cleveland Families</h2>
            <div className="flex items-center justify-center gap-2 mb-12">
              <div className="flex">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="text-gray-600 font-semibold">4.8/5 from 500+ families</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {testimonials.slice(0, 3).map((testimonial) => (
                <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    {/* Avatar with initials */}
                    <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex mb-1">
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                      <p className="text-sm font-semibold text-gray-900">{testimonial.author}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic mb-4 leading-relaxed">"{testimonial.quote}"</p>
                  <div className="border-t pt-4 flex items-center justify-between">
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                    {testimonial.careType && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                        {testimonial.careType}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Community Listings */}
      <div id="communities" className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-center">
          {showViewAll ? 'Featured Assisted Living & Memory Care in Cleveland' : `${filteredCommunities.length} ${filteredCommunities.length === 1 ? 'Community' : 'Communities'} Found`}
          {activeLocationLabel && ` in ${activeLocationLabel}`}
          {selectedCareFilter && selectedCareFilter !== 'all' && ` for ${activeCareLabel}`}
        </h2>
        {showViewAll && (
          <p className="text-gray-600 text-center mb-8">
            Hand-selected communities offering assisted living and specialized memory care services
          </p>
        )}

        {featuredCommunities.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {featuredCommunities.map((community, index) => (
                <div key={community.id} className="relative">
                  {/* Featured badge for top 3 */}
                  {showViewAll && index < 3 && (
                    <div className="absolute -top-2 -right-2 z-10 bg-gradient-to-br from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                      <Star className="h-3 w-3 fill-white" />
                      FEATURED
                    </div>
                  )}
                  <LocationCard community={community} />
                </div>
              ))}
            </div>
            {showViewAll && qualityCommunities.length > 6 && (
              <div className="text-center mt-10">
                <Link
                  href="/greater-cleveland"
                  className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-10 py-4 rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  <span>View All Assisted Living & Memory Care</span>
                  <ArrowRight className="h-6 w-6" />
                </Link>
                <p className="text-sm text-gray-500 mt-4">Browse all our featured communities across Greater Cleveland</p>
              </div>
            )}
          </>
        ) : (
          <div className="bg-gray-50 p-8 rounded-xl text-center">
            <div className="text-gray-500 mb-4">No communities match your current filters.</div>
            <button
              onClick={() => {
                setSelectedCareFilter('all');
                setSelectedLocation('all');
              }}
              className="text-primary hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Advanced Filters - Location Tabs */}
      {(selectedCareFilter !== 'all' || selectedLocation !== 'all' || searchQuery) && (
        <>
          <div className="bg-gray-100 py-4 border-t border-gray-200">
            <div className="container mx-auto px-4">
              <p className="text-center text-sm text-gray-600 mb-4">Filter by location:</p>
            </div>
          </div>
          <LocationTabs
            communities={filteredCommunities}
            selectedLocation={selectedLocation}
            onLocationChange={setSelectedLocation}
          />
        </>
      )}

      {/* Category Tabs - For Advanced Users */}
      <div className="bg-white py-8 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-600 mb-6">Want to filter communities? Use the tabs below:</p>
          <CategoryTabs
            communities={filteredCommunities}
            selectedFilter={selectedCareFilter}
            onFilterChange={setSelectedCareFilter}
          />
        </div>
      </div>
    </>
  );
}

export default function Home() {
  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Guide for Seniors",
    "url": "https://guideforseniors.com",
    "logo": "https://guideforseniors.com/logo.png",
    "description": "Guide for Seniors helps seniors and families in Cleveland and Northeast Ohio find the right senior living options including assisted living, memory care, and independent living communities.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Cleveland",
      "addressRegion": "OH",
      "addressCountry": "US"
    },
    "sameAs": [
      "https://www.facebook.com/guideforseniors",
      "https://twitter.com/guideforseniors"
    ]
  };

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How much does senior living cost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The cost of senior living varies based on the level of care, location, and amenities. Independent living typically ranges from $1,500 to $3,500 per month, assisted living from $3,000 to $6,000 per month, and memory care from $4,000 to $8,000 per month. Use our 'Get Pricing' button on any community to receive specific cost information."
        }
      },
      {
        "@type": "Question",
        "name": "How do I know which type of senior living is right for my loved one?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Consider your loved one's current and potential future care needs. If they need minimal assistance, independent living might be appropriate. If they need help with daily activities but not 24-hour nursing care, assisted living is a good option. For those with Alzheimer's or dementia, memory care provides specialized support. Our community profiles detail the care types offered at each location."
        }
      },
      {
        "@type": "Question",
        "name": "What amenities should I look for in a senior living community?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Look for amenities that match your or your loved one's lifestyle and needs, such as dining options, social activities, fitness centers, transportation services, outdoor spaces, and housekeeping. Consider security features, on-site medical support, and accessibility accommodations. Most importantly, visit communities to experience the atmosphere firsthand."
        }
      }
    ]
  };

  return (
    <main className="flex min-h-screen flex-col">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([structuredData, faqSchema]) }}
      />

      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        <SearchContainer />
      </Suspense>

      {/* Browse by City Section */}
      <div className="bg-gray-100 py-16 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-2">Browse Senior Living by Cleveland-Area City</h2>
          <p className="text-gray-600 text-center mb-8">Find assisted living and memory care in your preferred neighborhood</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {['Cleveland', 'Shaker Heights', 'Beachwood', 'Parma', 'Lakewood', 'Westlake', 'Strongsville', 'Independence', 'Seven Hills', 'Rocky River'].map(city => (
              <Link
                key={city}
                href={`/location/${city.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-white hover:bg-primary/5 border border-gray-200 hover:border-primary/30 rounded-lg p-4 text-center transition-all group"
              >
                <MapPin className="h-5 w-5 text-primary mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-900 group-hover:text-primary">{city}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gray-50 py-16 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2">Trusted by Cleveland Families</h2>
          <div className="flex items-center justify-center gap-2 mb-12">
            <div className="flex">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span className="text-gray-600 font-semibold">4.8/5 from 500+ families</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.slice(0, 3).map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex mb-3">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                  {testimonial.careType && (
                    <p className="text-xs text-primary mt-1">{testimonial.careType}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Guide for Seniors - Cleveland Focus */}
      <div className="bg-white py-20 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Why Cleveland Families Choose Guide for Seniors</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            We make finding the perfect senior living community simple, stress-free, and completely free for families.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Local Cleveland Expertise</h3>
              <p className="text-gray-600">
                Our advisors personally visit every community in Cleveland, Shaker Heights, Beachwood, and beyond. We know the neighborhoods, staff, and what makes each community unique.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">100% Free Service</h3>
              <p className="text-gray-600">
                Never pay a fee. We're compensated by communities, not families. Our guidance, tours, and support are completely free—no hidden costs, ever.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Info className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Save Time & Reduce Stress</h3>
              <p className="text-gray-600">
                We handle the research, schedule tours, compare pricing, and answer all your questions. Focus on your loved one while we handle the details.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <a
              href="#communities"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Get Started - It's Free
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-gray-50 py-12 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-4">Senior Living Options</h2>

          <div className="prose max-w-none text-gray-700">
            <p className="mb-4">
              We offer a comprehensive directory of senior living options to meet the diverse needs of aging adults. Whether you're looking for assisted living, <Link href="/memory-care-cleveland" className="text-primary hover:underline">memory care in Cleveland</Link>, or independent living, our platform helps you explore and compare communities across multiple locations.
            </p>

            <p className="mb-4">
              Choosing the right senior living community is a significant decision. Factors to consider include location, level of care provided, amenities, staff-to-resident ratio, and cost. Our platform provides detailed information on each community, allowing you to make informed comparisons and find the perfect fit for yourself or your loved one.
            </p>

            <h3 className="text-xl font-semibold my-4">Types of Senior Care Available</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h4 className="font-semibold mb-2">Independent Living</h4>
                <p>
                  For active seniors who can live on their own but want a maintenance-free lifestyle with social opportunities and amenities. Explore <Link href="/location/cleveland" className="text-primary hover:underline">independent living in Cleveland</Link>.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h4 className="font-semibold mb-2">Assisted Living</h4>
                <p>
                  Provides help with daily activities like bathing, dressing, medication management, and meals while promoting independence. View <Link href="/location/rocky-river" className="text-primary hover:underline">assisted living in Rocky River</Link>.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h4 className="font-semibold mb-2">Memory Care</h4>
                <p>
                  Specialized care for those with Alzheimer's, dementia, or other memory conditions in a secure environment with trained staff.
                </p>
              </div>
            </div>

            <p className="mb-4">
              Our directory includes communities that offer various combinations of these care levels, allowing seniors to age in place as their needs change. Many communities also provide additional services such as skilled nursing, rehabilitation, and respite care.
            </p>

            <p>
              Popular neighborhoods include <Link href="/location/shaker-heights" className="text-primary hover:underline">heritage retirement communities in Shaker Heights</Link>, <Link href="/location/beachwood" className="text-primary hover:underline">Beachwood senior living</Link>, and <Link href="/location/westlake" className="text-primary hover:underline">Westlake assisted living</Link>.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section for SEO */}
      <div className="py-12 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium mb-2">How much does senior living cost?</h3>
              <p className="text-gray-700">
                The cost of senior living varies based on the level of care, location, and amenities. Independent living typically ranges from $1,500 to $3,500 per month, assisted living from $3,000 to $6,000 per month, and memory care from $4,000 to $8,000 per month. Use our "Get Pricing" button on any community to receive specific cost information.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium mb-2">How do I know which type of senior living is right for my loved one?</h3>
              <p className="text-gray-700">
                Consider your loved one's current and potential future care needs. If they need minimal assistance, independent living might be appropriate. If they need help with daily activities but not 24-hour nursing care, assisted living is a good option. For those with Alzheimer's or dementia, memory care provides specialized support. Our community profiles detail the care types offered at each location.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium mb-2">What amenities should I look for in a senior living community?</h3>
              <p className="text-gray-700">
                Look for amenities that match your or your loved one's lifestyle and needs, such as dining options, social activities, fitness centers, transportation services, outdoor spaces, and housekeeping. Consider security features, on-site medical support, and accessibility accommodations. Most importantly, visit communities to experience the atmosphere firsthand.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final Assessment CTA Banner */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d4a6f] py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Find the Right Community?
            </h2>
            <p className="text-xl text-gray-200 mb-8">
              Take our 2-minute assessment and get matched with the perfect care communities in Cleveland
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/assessment">
                <button className="w-full sm:w-auto bg-[#ff5a5f] hover:bg-[#ff4449] text-white font-bold px-12 py-5 rounded-xl shadow-xl hover:shadow-2xl transition-all text-lg">
                  Start Free Assessment
                </button>
              </Link>
              <a href="tel:+12166774630">
                <button className="w-full sm:w-auto bg-white hover:bg-gray-100 text-[#1e3a5f] font-bold px-12 py-5 rounded-xl shadow-xl hover:shadow-2xl transition-all text-lg">
                  Call: (216) 677-4630
                </button>
              </a>
            </div>
            <p className="text-gray-300 mt-6 text-sm">
              Join hundreds of Cleveland families who have found the perfect care community
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Floating Button */}
      <ComparisonFloatingButton />

      {/* Schedule Tour FAB */}
      <ScheduleTourFAB />

      <div className="mt-auto">
        <Footer />
      </div>
    </main>
  );
}
