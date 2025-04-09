"use client";

import Link from "next/link";
import { useState } from "react";
import HeroBanner from "@/components/HeroBanner";
import SearchFilterBar from "@/components/SearchFilterBar";
import ProviderCard from "@/components/ProviderCard";
import MapToggleView from "@/components/MapToggleView";
import TestimonialSlider from "@/components/TestimonialSlider";
import ReferralCTA from "@/components/ReferralCTA";
import TourScheduler from "@/components/TourScheduler";
import { FiX } from "react-icons/fi";

export default function Home() {
  // State for filtering
  const [activeCategory, setActiveCategory] = useState("all");
  const [view, setView] = useState<'list' | 'map' | 'split'>('list');
  const [showTourScheduler, setShowTourScheduler] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // Categories similar to Airbnb's category pills
  const categories = [
    { id: "all", name: "All Communities", icon: "🏠" },
    { id: "independent", name: "Independent Living", icon: "👨‍⚕️" },
    { id: "assisted", name: "Assisted Living", icon: "🧠" },
    { id: "memory", name: "Memory Care", icon: "⚕️" },
    { id: "continuing", name: "Continuing Care", icon: "👵" },
    { id: "55plus", name: "55+ Communities", icon: "🐕" },
    { id: "city", name: "City Living", icon: "🏙️" },
    { id: "rural", name: "Rural Retreats", icon: "🌳" },
    { id: "beachfront", name: "Beachfront", icon: "🏖️" },
    { id: "amenities", name: "Amenities-Rich", icon: "🏊" },
  ];

  // Featured communities (using the same data structure as Airbnb listings)
  const featuredCommunities = [
    {
      id: 1,
      slug: "sunshine-meadows",
      name: "Sunshine Meadows",
      city: "Cleveland",
      state: "OH",
      type: "Independent Living",
      image: "https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=2074&auto=format&fit=crop",
      rating: 4.8,
      distance: "61 miles away",
      amenities: ["Restaurant-style dining", "Fitness center", "Swimming pool", "Garden", "Pet friendly"],
      isFeatured: true,
      lat: 41.4993,
      lng: -81.6944
    },
    {
      id: 2,
      slug: "cedar-ridge",
      name: "Cedar Ridge Retirement",
      city: "Columbus",
      state: "OH",
      type: "Assisted Living",
      image: "https://images.unsplash.com/photo-1556155092-490a1ba16284?q=80&w=2070&auto=format&fit=crop",
      rating: 4.98,
      distance: "63 miles away",
      amenities: ["24/7 care staff", "Medication management", "Housekeeping", "Transportation services", "Social activities"],
      isFeatured: true,
      lat: 39.9612,
      lng: -82.9988
    },
    {
      id: 3,
      slug: "lakeside-gardens",
      name: "Lakeside Gardens",
      city: "Cincinnati",
      state: "OH",
      type: "Memory Care",
      image: "https://images.unsplash.com/photo-1582719471384-894fbb07a271?q=80&w=2187&auto=format&fit=crop",
      rating: 4.97,
      distance: "62 miles away",
      amenities: ["Specialized memory programs", "Secured environment", "Therapeutic activities", "Individualized care plans"],
      isFeatured: false,
      lat: 39.1031,
      lng: -84.5120
    },
    {
      id: 4,
      slug: "maple-grove",
      name: "Maple Grove Living",
      city: "Toledo",
      state: "OH",
      type: "Continuing Care",
      image: "https://images.unsplash.com/photo-1568939571043-88fceafce24f?q=80&w=2070&auto=format&fit=crop",
      rating: 4.99,
      distance: "64 miles away",
      amenities: ["Independent living", "Assisted living", "Memory care", "Nursing care", "Rehabilitation services"],
      isFeatured: true,
      lat: 41.6528,
      lng: -83.5379
    },
    {
      id: 5,
      slug: "evergreen-commons",
      name: "Evergreen Commons",
      city: "Akron",
      state: "OH",
      type: "Independent Living",
      image: "https://images.unsplash.com/photo-1600607687126-8a3414349a51?q=80&w=2070&auto=format&fit=crop",
      rating: 4.94,
      distance: "56 miles away",
      amenities: ["Restaurant-style dining", "Fitness center", "Arts and crafts studio", "Library", "Game room"],
      isFeatured: false,
      lat: 41.0814,
      lng: -81.5190
    },
    {
      id: 6,
      slug: "riverside-retreat",
      name: "Riverside Retreat",
      city: "Dayton",
      state: "OH",
      type: "Assisted Living",
      image: "https://images.unsplash.com/photo-1519974719765-e6559eac2575?q=80&w=2070&auto=format&fit=crop",
      rating: 4.91,
      distance: "68 miles away",
      amenities: ["24/7 care staff", "Restaurant-style dining", "Medication management", "Housekeeping", "Transportation services"],
      isFeatured: false,
      lat: 39.7589,
      lng: -84.1916
    }
  ];

  // Sample testimonials
  const testimonials = [
    {
      id: 1,
      quote: "Moving my mom to Sunshine Meadows was the best decision we made. The staff is caring and attentive, and she has made so many new friends.",
      author: "Jennifer H.",
      relation: "Daughter of resident",
      communityName: "Sunshine Meadows"
    },
    {
      id: 2,
      quote: "The care my father receives at Cedar Ridge is exceptional. From the well-designed living spaces to the engaging activities, everything is thoughtfully planned.",
      author: "Michael T.",
      relation: "Son of resident",
      communityName: "Cedar Ridge Retirement"
    },
    {
      id: 3,
      quote: "As someone with memory care needs, the specialized programs at Lakeside Gardens have been transformative for my aunt. The staff understands her unique challenges.",
      author: "Patricia M.",
      relation: "Niece of resident",
      communityName: "Lakeside Gardens"
    }
  ];

  // Filter communities based on active category
  const filteredCommunities = activeCategory === "all"
    ? featuredCommunities
    : featuredCommunities.filter(community =>
        community.type.toLowerCase().includes(activeCategory) ||
        community.amenities?.some(amenity =>
          amenity.toLowerCase().includes(activeCategory)
        )
      );

  // Add handler for scheduling a tour
  const handleScheduleTour = (community: { id: number; name: string }) => {
    setSelectedCommunity(community);
    setShowTourScheduler(true);
  };

  // Add handler for closing the tour scheduler
  const closeTourScheduler = () => {
    setShowTourScheduler(false);
    setSelectedCommunity(null);
  };

  return (
    <div className="bg-[#FAFAF5]">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Search Filter */}
      <div className="container mx-auto px-6 md:px-10 lg:px-20 -mt-6 mb-8 relative z-20">
        <SearchFilterBar className="shadow-lg" />
      </div>

      {/* Categories */}
      <div className="overflow-x-auto pb-4 pt-3 px-6 md:px-10 lg:px-20 border-b border-t border-[#A7C4A0] hide-scrollbar bg-white sticky top-[73px] z-30">
        <div className="flex space-x-10">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex flex-col items-center min-w-[80px] text-xs ${
                activeCategory === category.id ? 'text-[#1b4d70] border-b-2 border-[#1b4d70] pb-2' : 'text-[#333333]'
              }`}
            >
              <div className="text-2xl mb-1">{category.icon}</div>
              <span className="whitespace-nowrap px-1">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Map Toggle */}
      <div className="container mx-auto px-6 md:px-10 lg:px-20 mt-6">
        <MapToggleView
          providers={filteredCommunities}
          defaultView={view}
          onViewChange={setView}
          className="mb-6"
        />
      </div>

      {/* Communities Grid */}
      <div className="container mx-auto px-6 md:px-10 lg:px-20 py-4">
        <h2 className="text-2xl font-semibold text-[#1b4d70] mb-6">
          {activeCategory === 'all'
            ? 'Featured Senior Living Communities'
            : `${categories.find(c => c.id === activeCategory)?.name} Communities`}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCommunities.map((community) => (
            <ProviderCard
              key={community.id}
              id={community.id}
              slug={community.slug}
              name={community.name}
              city={community.city}
              state={community.state}
              type={community.type}
              image={community.image}
              rating={community.rating}
              distance={community.distance}
              isFeatured={community.isFeatured}
              amenities={community.amenities}
              onScheduleTour={() => handleScheduleTour({ id: community.id, name: community.name })}
            />
          ))}
        </div>

        {/* Show more button */}
        {filteredCommunities.length > 0 && (
          <div className="flex justify-center mt-10">
            <Link
              href="/search"
              className="px-6 py-3 bg-white border border-[#1b4d70] text-[#1b4d70] rounded-md hover:bg-[#1b4d70] hover:text-white transition-colors"
            >
              View All Communities
            </Link>
          </div>
        )}

        {/* Empty state */}
        {filteredCommunities.length === 0 && (
          <div className="text-center py-10">
            <h3 className="text-xl font-medium text-[#1b4d70] mb-2">No communities found</h3>
            <p className="text-[#333333] mb-4">We couldn't find any senior living communities matching your criteria.</p>
            <button
              onClick={() => setActiveCategory('all')}
              className="px-6 py-2 bg-[#1b4d70] text-white rounded-md hover:bg-[#2F5061] transition-colors"
            >
              Show all communities
            </button>
          </div>
        )}
      </div>

      {/* Testimonials Section */}
      <div className="container mx-auto px-6 md:px-10 lg:px-20 py-12">
        <TestimonialSlider testimonials={testimonials} />
      </div>

      {/* Referral CTA */}
      <div className="container mx-auto px-6 md:px-10 lg:px-20 py-12">
        <ReferralCTA />
      </div>

      {/* Tour Scheduler Modal */}
      {showTourScheduler && selectedCommunity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b border-[#A7C4A0] flex justify-between items-center">
              <h3 className="font-semibold text-[#1b4d70]">Schedule a Tour</h3>
              <button
                onClick={closeTourScheduler}
                className="text-[#666666] hover:text-[#1b4d70] p-2"
                aria-label="Close modal"
              >
                <FiX size={24} />
              </button>
            </div>
            <div className="p-4">
              <TourScheduler
                communityName={selectedCommunity.name}
                communityId={selectedCommunity.id}
                onClose={closeTourScheduler}
              />
            </div>
          </div>
        </div>
      )}

      {/* Custom styles for the scrollbar */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
