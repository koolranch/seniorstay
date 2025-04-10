"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiSearch, FiGrid, FiList, FiMapPin, FiStar, FiX } from "react-icons/fi";
import { communities } from '@/lib/data/communities';
import type { Community } from '@/lib/data/communities';
import { getCommunityPath } from "@/lib/utils/formatSlug";
import ProviderCard from "@/components/ProviderCard";
import TourScheduler from "@/components/TourScheduler";
import PricingRequest from "@/components/PricingRequest";

// Add this constant at the top of the file
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1519974719765-e6559eac2575?q=80&w=2070&auto=format&fit=crop";

// Get unique services from all communities
const allServices = Array.from(
  new Set(communities.flatMap((community) => community.services))
).sort();

export default function CommunityDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
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
    <main className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1b4d70] mb-4">
          Senior Living Communities
        </h1>
        <p className="text-gray-600">
          Find the perfect senior living community for you or your loved ones.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
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

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredCommunities.length} of {communities.length} communities
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
              amenities={community.services}
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
              amenities={community.services}
              onScheduleTour={() => handleScheduleTour({ id: community.id, name: community.name })}
              onRequestPricing={() => handleRequestPricing({ id: community.id, name: community.name })}
              className="flex flex-col md:flex-row"
            />
          ))}
        </div>
      )}

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
              <h3 className="font-semibold text-[#1b4d70]">Request Pricing</h3>
              <button
                onClick={closePricingRequest}
                className="text-[#666666] hover:text-[#1b4d70] p-2"
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
    </main>
  );
} 