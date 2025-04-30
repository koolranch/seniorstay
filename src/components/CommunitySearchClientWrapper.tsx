'use client';

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { FiSearch, FiGrid, FiList, FiX } from "react-icons/fi";
import { communities, Community } from '@/lib/data/staticCommunities';
import ProviderCard from "@/components/ProviderCard";
import TourScheduler from "@/components/TourScheduler";
import PricingRequest from "@/components/PricingRequest";

// Get unique services from all communities
const allServices = Array.from(
  new Set(communities.flatMap((community) => community.services))
).sort();

export default function CommunitySearchClientWrapper() {
  const searchParams = useSearchParams();
  const locationParam = searchParams.get('location');
  
  const [searchQuery, setSearchQuery] = useState(locationParam || "");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showTourScheduler, setShowTourScheduler] = useState(false);
  const [showPricingRequest, setShowPricingRequest] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // Filter communities based on search query and selected services
  const filteredCommunities = useMemo(() => {
    return communities.filter((community) => {
      const matchesSearch =
        searchQuery === "" ||
        community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.state.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesServices =
        selectedServices.length === 0 ||
        selectedServices.every((service) =>
          community.services.includes(service)
        );

      return matchesSearch && matchesServices;
    });
  }, [searchQuery, selectedServices]);

  // Toggle service filter
  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  // Handle tour schedule button click
  const handleScheduleTour = (community: { id: number; name: string }) => {
    setSelectedCommunity(community);
    setShowTourScheduler(true);
  };

  // Handle pricing request button click
  const handleRequestPricing = (community: { id: number; name: string }) => {
    setSelectedCommunity(community);
    setShowPricingRequest(true);
  };

  // Close modals
  const closeTourScheduler = () => {
    setShowTourScheduler(false);
  };

  const closePricingRequest = () => {
    setShowPricingRequest(false);
  };

  return (
    <>
      {/* Filters */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="container mx-auto px-6 md:px-10 lg:px-20 py-8">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b4d70] focus:border-transparent"
                  />
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg ${
                    viewMode === "grid"
                      ? "bg-[#1b4d70] text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <FiGrid />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg ${
                    viewMode === "list"
                      ? "bg-[#1b4d70] text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <FiList />
                </button>
              </div>
            </div>

            {/* Service Filters */}
            <div className="mt-4 flex flex-wrap gap-2">
              {allServices.map((service) => (
                <button
                  key={service}
                  onClick={() => toggleService(service)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedServices.includes(service)
                      ? "bg-[#1b4d70] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {service}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-gray-50 py-10">
        <div className="container mx-auto px-6 md:px-10 lg:px-20">
          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredCommunities.length} of {communities.length} communities
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>

          {/* Community Grid/List */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  amenities={community.services ? (Array.isArray(community.services) ? community.services : community.services.split(/,\s*/)) : []}
                  onScheduleTour={() => handleScheduleTour({ id: community.id, name: community.name })}
                  onRequestPricing={() => handleRequestPricing({ id: community.id, name: community.name })}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
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
                  amenities={community.services ? (Array.isArray(community.services) ? community.services : community.services.split(/,\s*/)) : []}
                  onScheduleTour={() => handleScheduleTour({ id: community.id, name: community.name })}
                  onRequestPricing={() => handleRequestPricing({ id: community.id, name: community.name })}
                  className="flex flex-col md:flex-row"
                />
              ))}
            </div>
          )}
        </div>
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

      {/* Pricing Request Modal */}
      {showPricingRequest && selectedCommunity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b border-[#A7C4A0] flex justify-between items-center">
              <h3 className="font-semibold text-[#0c3552]">Get Pricing</h3>
              <button
                onClick={closePricingRequest}
                className="text-[#333333] hover:text-[#1b4d70] p-2"
                aria-label="Close modal"
              >
                <FiX size={24} />
              </button>
            </div>
            <div className="p-4">
              <PricingRequest
                communityName={selectedCommunity.name}
                communityId={selectedCommunity.id}
                onClose={closePricingRequest}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
} 