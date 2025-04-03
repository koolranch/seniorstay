"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, MapPin, Star, ArrowRight, Info } from 'lucide-react';
import Header from '@/components/header/Header';
import CategoryTabs from '@/components/category/CategoryTabs';
import LocationTabs from '@/components/location/LocationTabs';
import FilterIndicator from '@/components/filter/FilterIndicator';
import LocationFilterIndicator from '@/components/filter/LocationFilterIndicator';
import SearchResults from '@/components/search/SearchResults';
import ComparisonFloatingButton from '@/components/comparison/ComparisonFloatingButton';
import Footer from '@/components/footer/Footer';
import LocationCard from '@/components/property/LocationCard';
import { communityData } from '@/data/facilities';

export default function Home() {
  // Get search parameters
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('query') || '';

  // Filters
  const [selectedCareFilter, setSelectedCareFilter] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [filteredCommunities, setFilteredCommunities] = useState(communityData);

  // Store active filter labels for display
  const [activeCareLabel, setActiveCareLabel] = useState('');
  const [activeLocationLabel, setActiveLocationLabel] = useState('');

  // Extract all unique cities from communities
  const allCities = Array.from(new Set(communityData.map(community =>
    community.location.split(',')[0].trim()
  ))).sort();

  // Get all unique care types across all communities
  const allCareTypes = Array.from(new Set(
    communityData.flatMap(community => community.careTypes)
  )).sort();

  // Apply filters
  useEffect(() => {
    let results = [...communityData];

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

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Cleveland Senior Guide",
    "url": "https://guideforseniors.com",
    "logo": "https://guideforseniors.com/logo.png",
    "description": "Cleveland Senior Guide helps seniors and families find the right senior living options in Northeast Ohio including assisted living, memory care, and independent living communities.",
    "address": {
      "@type": "PostalAddress",
      "addressRegion": "OH",
      "addressCountry": "US"
    },
    "telephone": "(800) 555-1234",
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
        "name": "How much does senior living cost in Northeast Ohio?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The cost of senior living in Northeast Ohio varies based on the level of care, location, and amenities. Independent living typically ranges from $1,500 to $3,500 per month, assisted living from $3,000 to $6,000 per month, and memory care from $4,000 to $8,000 per month. Use our 'Get Pricing' button on any community to receive specific cost information."
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

  return (
    <main className="flex min-h-screen flex-col">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([structuredData, faqSchema]) }}
      />

      <Header />
      <CategoryTabs
        selectedFilter={selectedCareFilter}
        onFilterChange={setSelectedCareFilter}
      />

      {/* Hero Section - Improved Layout without Map */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 py-12 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-4 text-center">
              Find Senior Living Options in Northeast Ohio
            </h1>
            <p className="text-lg text-gray-700 mb-8 text-center">
              Discover the best assisted living, memory care, and independent living communities for yourself or your loved one. We help you make informed decisions with comprehensive information on {communityData.length} senior care communities.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="text-xl font-semibold mb-4 flex items-center">
                  <span className="bg-primary/10 text-primary p-2 rounded-full mr-2">
                    <Search size={18} />
                  </span>
                  Find Senior Living By Care Type
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {allCareTypes.map(careType => (
                    <Link
                      key={careType}
                      href="#communities"
                      onClick={() => setSelectedCareFilter(careType.toLowerCase())}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-primary/5 hover:border-primary/20 border border-gray-100 transition-all"
                    >
                      <span>{careType}</span>
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
                        {communityCounts[careType]}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="text-xl font-semibold mb-4 flex items-center">
                  <span className="bg-primary/10 text-primary p-2 rounded-full mr-2">
                    <MapPin size={18} />
                  </span>
                  Find Senior Living By Location
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[240px] overflow-y-auto pr-1">
                  {allCities.map(city => (
                    <Link
                      key={city}
                      href="#communities"
                      onClick={() => setSelectedLocation(city)}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-primary/5 hover:border-primary/20 border border-gray-100 transition-all"
                    >
                      <span>{city}</span>
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
                        {cityCounts[city]}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="#communities"
                className="inline-flex items-center text-primary hover:underline"
              >
                <span>View all {communityData.length} communities</span>
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Location Filter */}
      <LocationTabs
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
      />

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

      {/* Community Listings */}
      <div id="communities" className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6">
          {filteredCommunities.length} {filteredCommunities.length === 1 ? 'Community' : 'Communities'} Found
          {activeLocationLabel && ` in ${activeLocationLabel}`}
          {activeCareLabel && ` for ${activeCareLabel}`}
        </h2>

        {filteredCommunities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCommunities.map((community) => (
              <LocationCard key={community.id} community={community} />
            ))}
          </div>
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

      {/* SEO Content Section */}
      <div className="bg-gray-50 py-12 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-4">Senior Living Options in Northeast Ohio</h2>

          <div className="prose max-w-none text-gray-700">
            <p className="mb-4">
              Northeast Ohio offers a wide variety of senior living options to meet the diverse needs of aging adults. Whether you're looking for assisted living, memory care, or independent living, our comprehensive directory helps you explore and compare communities across Cleveland, Beachwood, Shaker Heights, and other communities in the region.
            </p>

            <p className="mb-4">
              Choosing the right senior living community is a significant decision. Factors to consider include location, level of care provided, amenities, staff-to-resident ratio, and cost. Our platform provides detailed information on each community, allowing you to make informed comparisons and find the perfect fit for yourself or your loved one.
            </p>

            <h3 className="text-xl font-semibold my-4">Types of Senior Care Available in Northeast Ohio</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h4 className="font-semibold mb-2">Independent Living</h4>
                <p>
                  For active seniors who can live on their own but want a maintenance-free lifestyle with social opportunities and amenities.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h4 className="font-semibold mb-2">Assisted Living</h4>
                <p>
                  Provides help with daily activities like bathing, dressing, medication management, and meals while promoting independence.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h4 className="font-semibold mb-2">Memory Care</h4>
                <p>
                  Specialized care for those with Alzheimer's, dementia, or other memory conditions in a secure environment with trained staff.
                </p>
              </div>
            </div>

            <p>
              Our directory includes communities that offer various combinations of these care levels, allowing seniors to age in place as their needs change. Many communities also provide additional services such as skilled nursing, rehabilitation, and respite care.
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
              <h3 className="text-lg font-medium mb-2">How much does senior living cost in Northeast Ohio?</h3>
              <p className="text-gray-700">
                The cost of senior living in Northeast Ohio varies based on the level of care, location, and amenities. Independent living typically ranges from $1,500 to $3,500 per month, assisted living from $3,000 to $6,000 per month, and memory care from $4,000 to $8,000 per month. Use our "Get Pricing" button on any community to receive specific cost information.
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

      {/* Comparison Floating Button */}
      <ComparisonFloatingButton />

      <div className="mt-auto">
        <Footer />
      </div>
    </main>
  );
}
