"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiSearch, FiGrid, FiList, FiMapPin, FiStar } from "react-icons/fi";
import { communities } from '@/lib/data/communities';
import type { Community } from '@/lib/data/communities';
import { getCommunityPath } from "@/lib/utils/formatSlug";

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
            <Link
              key={community.id}
              href={getCommunityPath(community)}
              className="group bg-white rounded-xl shadow-sm border border-[#A7C4A0] overflow-hidden hover:shadow-md transition"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={community.image}
                  alt={community.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = FALLBACK_IMAGE;
                  }}
                  priority={false}
                />
                <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-xs">
                  {community.type}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-[#1b4d70] line-clamp-1">
                  {community.name}
                </h3>
                <div className="flex items-center text-gray-500 text-sm mt-1 mb-2">
                  <FiMapPin size={14} className="mr-1 flex-shrink-0" />
                  <span className="truncate">
                    {community.city}, {community.state}
                  </span>
                </div>
                <div className="flex items-center text-sm mb-3">
                  <FiStar className="text-[#F5A623] fill-[#F5A623]" />
                  <span className="ml-1 font-medium">{community.rating}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {community.services.map((service) => (
                    <span
                      key={service}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCommunities.map((community) => (
            <Link
              key={community.id}
              href={getCommunityPath(community)}
              className="block group bg-white rounded-xl shadow-sm border border-[#A7C4A0] overflow-hidden hover:shadow-md transition"
            >
              <div className="flex flex-col md:flex-row">
                <div className="relative md:w-1/3 aspect-[16/10] md:aspect-auto">
                  <Image
                    src={community.image}
                    alt={community.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = FALLBACK_IMAGE;
                    }}
                    priority={false}
                  />
                  <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-xs">
                    {community.type}
                  </div>
                </div>
                <div className="p-4 md:w-2/3">
                  <div className="flex flex-col md:flex-row md:items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg text-[#1b4d70]">
                        {community.name}
                      </h3>
                      <div className="flex items-center text-gray-500 text-sm mt-1">
                        <FiMapPin size={14} className="mr-1 flex-shrink-0" />
                        <span>
                          {community.city}, {community.state}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 md:mt-0 flex items-center">
                      <FiStar className="text-[#F5A623] fill-[#F5A623]" />
                      <span className="ml-1 font-medium">{community.rating}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 my-3">
                    {community.services.map((service) => (
                      <span
                        key={service}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
} 