"use client";

import { useState, useEffect, Suspense } from 'react';
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

// Create a separate component for the search functionality
function SearchContainer() {
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
  const clevelandCities = ['Cleveland', 'Shaker Heights', 'Beachwood', 'Parma', 'Lakewood', 'Strongsville', 'Westlake', 'North Olmsted', 'Richmond Heights'];
  const clevelandCommunities = communityData.filter(c => 
    clevelandCities.some(city => c.location.toLowerCase().includes(city.toLowerCase()))
  );
  const featuredCommunities = selectedCareFilter === 'all' && selectedLocation === 'all' && !searchQuery
    ? clevelandCommunities.slice(0, 12)
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

      <CategoryTabs
        communities={filteredCommunities}
        selectedFilter={selectedCareFilter}
        onFilterChange={setSelectedCareFilter}
      />

      {/* Hero Section - Cleveland-Focused */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 py-12 md:py-16 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-center">
              Find the Perfect Senior Living Community in Cleveland, Ohio
            </h1>
            <p className="text-base md:text-lg text-gray-700 mb-6 text-center max-w-3xl mx-auto">
              Helping Cleveland families discover the best assisted living, memory care, and independent living communities. Compare {communityData.length} senior care options with personalized guidance—at no cost to you.
            </p>

            {/* Trust Signals */}
            <div className="flex items-center justify-center gap-6 mb-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span>Rated 4.8/5</span>
              </div>
              <div className="hidden sm:block text-gray-300">|</div>
              <div>Free Service</div>
              <div className="hidden sm:block text-gray-300">|</div>
              <div>Local Experts</div>
            </div>

            {/* Lead Capture Form */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-center">Get Free Personalized Help</h2>
              <p className="text-gray-600 text-center mb-6">Our Cleveland advisors will help you find the right community, schedule tours, and answer all your questions.</p>
              <form action="https://formspree.io/f/xnnpaply" method="POST" className="space-y-4">
                <input type="hidden" name="form_type" value="homepage_hero_lead" />
                <input type="hidden" name="source_page" value="homepage_hero" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Your Name *"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Your Email *"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="Your Phone Number *"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <select
                  name="area"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Preferred Area (Optional)</option>
                  <option value="Cleveland">Cleveland</option>
                  <option value="Shaker Heights">Shaker Heights</option>
                  <option value="Beachwood">Beachwood</option>
                  <option value="Lakewood">Lakewood</option>
                  <option value="Parma">Parma</option>
                  <option value="Westlake">Westlake</option>
                  <option value="Other Cleveland Area">Other Cleveland Area</option>
                </select>
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Connect With a Local Advisor
                </button>
                <p className="text-xs text-gray-500 text-center">100% free service. We're here to help.</p>
              </form>
            </div>

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
                      href={`/location/${city.toLowerCase().replace(/\s+/g, '-')}`}
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

            <div className="text-center space-y-2">
              <Link
                href="/greater-cleveland"
                className="inline-flex items-center text-primary hover:underline font-semibold"
              >
                <MapPin className="mr-1 h-4 w-4" />
                <span>Explore Greater Cleveland Communities</span>
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
              <div>
                <Link
                  href="#communities"
                  className="inline-flex items-center text-gray-600 hover:text-primary text-sm"
                >
                  <span>Or view all {communityData.length} communities</span>
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location Filter */}
      <LocationTabs
        communities={filteredCommunities}
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
      <div id="communities" className="container mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-center">
          {showViewAll ? 'Featured Cleveland-Area Communities' : `${filteredCommunities.length} ${filteredCommunities.length === 1 ? 'Community' : 'Communities'} Found`}
          {activeLocationLabel && ` in ${activeLocationLabel}`}
          {activeCareFilter && activeCareFilter !== 'all' && ` for ${activeCareLabel}`}
        </h2>
        {showViewAll && (
          <p className="text-gray-600 text-center mb-8">
            Handpicked senior living options in Greater Cleveland and Northeast Ohio
          </p>
        )}

        {featuredCommunities.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredCommunities.map((community) => (
                <LocationCard key={community.id} community={community} />
              ))}
            </div>
            {showViewAll && communityData.length > 12 && (
              <div className="text-center mt-10">
                <Link
                  href="/greater-cleveland"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
                >
                  <span>View All {communityData.length} Communities</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
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

      {/* Why Choose Guide for Seniors - Cleveland Focus */}
      <div className="bg-white py-16 border-t border-gray-200">
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
              We offer a comprehensive directory of senior living options to meet the diverse needs of aging adults. Whether you're looking for assisted living, memory care, or independent living, our platform helps you explore and compare communities across multiple locations.
            </p>

            <p className="mb-4">
              Choosing the right senior living community is a significant decision. Factors to consider include location, level of care provided, amenities, staff-to-resident ratio, and cost. Our platform provides detailed information on each community, allowing you to make informed comparisons and find the perfect fit for yourself or your loved one.
            </p>

            <h3 className="text-xl font-semibold my-4">Types of Senior Care Available</h3>

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

      {/* Comparison Floating Button */}
      <ComparisonFloatingButton />

      <div className="mt-auto">
        <Footer />
      </div>
    </main>
  );
}
