"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import HeroBanner from "@/components/HeroBanner";
import SearchFilterBar from "@/components/SearchFilterBar";
import ProviderCard from "@/components/ProviderCard";
import MapToggleView from "@/components/MapToggleView";
import TestimonialSlider from "@/components/TestimonialSlider";
import ReferralCTA from "@/components/ReferralCTA";
import TourScheduler from "@/components/TourScheduler";
import { FiX } from "react-icons/fi";
import { communities } from "@/lib/data/communities";

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

  // Filter communities based on active category using useMemo for performance
  const filteredCommunities = useMemo(() => {
    console.log(`Filtering ${communities.length} communities for category: ${activeCategory}`);
    
    if (activeCategory === "all") {
      return communities;
    }

    const filtered = communities.filter(community => {
      // Check if the community's services include the selected category
      const serviceMatch = community.services.some(service => 
        service.toLowerCase().includes(activeCategory)
      );

      // Check if the community's amenities include the selected category
      const amenityMatch = community.amenities.some(amenity => 
        amenity.toLowerCase().includes(activeCategory)
      );

      return serviceMatch || amenityMatch;
    });

    console.log(`Found ${filtered.length} matching communities`);
    return filtered;
  }, [activeCategory]);

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
            ? 'Senior Living Communities'
            : `${categories.find(c => c.id === activeCategory)?.name} Communities`}
          <span className="text-gray-500 text-lg ml-2">
            ({filteredCommunities.length} communities)
          </span>
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
              amenities={community.services}
              onScheduleTour={() => handleScheduleTour({ id: community.id, name: community.name })}
            />
          ))}
        </div>

        {/* Show more button */}
        {filteredCommunities.length > 0 && (
          <div className="flex justify-center mt-10">
            <Link
              href="/community"
              className="px-6 py-3 bg-white border border-[#1b4d70] text-[#1b4d70] rounded-md hover:bg-[#1b4d70] hover:text-white transition-colors"
            >
              View All Communities
            </Link>
          </div>
        )}
      </div>

      {/* Testimonials */}
      <div className="container mx-auto px-6 md:px-10 lg:px-20 py-16">
        <TestimonialSlider testimonials={testimonials} />
      </div>

      {/* Referral CTA */}
      <div className="container mx-auto px-6 md:px-10 lg:px-20 py-16">
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
