"use client";

import { useState, useEffect, Suspense } from "react";
import { communities } from "@/data/communities";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FiSearch,
  FiMapPin,
  FiFilter,
  FiStar,
  FiHeart,
  FiGrid,
  FiList,
  FiX,
  FiChevronLeft
} from "react-icons/fi";
import { useComparison } from "@/context/ComparisonContext";
import type { Community } from "@/context/ComparisonContext";

// Wrap the component that uses useSearchParams in its own component
function SearchPageContent() {
  const searchParams = useSearchParams();
  const { addToComparison, removeFromComparison, isInComparison } = useComparison();

  const initialCity = searchParams.get("city") || "";
  const initialType = searchParams.get("type") || "";

  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState(initialCity);
  const [typeFilter, setTypeFilter] = useState(initialType);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter communities based on search query and filters
  useEffect(() => {
    let results = [...communities];

    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (community) =>
          community.name.toLowerCase().includes(query) ||
          community.city.toLowerCase().includes(query) ||
          community.type.toLowerCase().includes(query)
      );
    }

    // Apply city filter
    if (cityFilter) {
      results = results.filter(
        (community) => community.city.toLowerCase() === cityFilter.toLowerCase()
      );
    }

    // Apply type filter
    if (typeFilter) {
      // Convert filter to a friendlier format (e.g., "independent-living" to "Independent Living")
      const formattedType = typeFilter
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      results = results.filter(
        (community) => community.type.toLowerCase() === formattedType.toLowerCase()
      );
    }

    setFilteredCommunities(results);
  }, [searchQuery, cityFilter, typeFilter]);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setCityFilter("");
    setTypeFilter("");
  };

  // Toggle community in comparison
  const toggleComparison = (community: Community) => {
    if (isInComparison(community.id)) {
      removeFromComparison(community.id);
    } else {
      addToComparison(community);
    }
  };

  // Categories similar to Airbnb's category pills
  const categories = [
    { name: "Independent Living", icon: "🏠", active: typeFilter === "independent-living" },
    { name: "Assisted Living", icon: "👨‍⚕️", active: typeFilter === "assisted-living" },
    { name: "Memory Care", icon: "🧠", active: typeFilter === "memory-care" },
    { name: "Continuing Care", icon: "⚕️", active: typeFilter === "continuing-care" },
    { name: "55+ Communities", icon: "👵", active: false },
    { name: "Pet Friendly", icon: "🐕", active: false },
    { name: "City Living", icon: "🏙️", active: false },
    { name: "Rural Retreats", icon: "🌳", active: false },
    { name: "Beachfront", icon: "🏖️", active: false },
    { name: "Amenities-Rich", icon: "🏊", active: false },
  ];

  return (
    <>
      {/* Categories */}
      <div className="flex overflow-x-auto pb-4 pt-5 px-6 md:px-10 lg:px-20 border-b hide-scrollbar">
        <div className="flex space-x-8">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => {
                setTypeFilter(category.active ? "" : category.name.toLowerCase().replace(/ /g, '-'));
              }}
              className={`flex flex-col items-center min-w-[56px] text-xs ${
                category.active ? 'text-black border-b-2 border-black pb-2' : 'text-gray-500'
              }`}
            >
              <div className="text-2xl mb-1">{category.icon}</div>
              <span className="whitespace-nowrap">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="px-6 md:px-10 lg:px-20 py-4 flex items-center justify-between border-b">
        <div className="flex items-center">
          <Link href="/" className="flex items-center mr-4 text-gray-600 hover:text-gray-900">
            <FiChevronLeft size={20} className="mr-1" />
            <span>Back</span>
          </Link>

          <button className="flex items-center text-gray-600 border rounded-lg px-3 py-2 text-sm hover:border-gray-400 transition-colors">
            <FiFilter size={14} className="mr-2" />
            <span>Filters</span>
          </button>
        </div>

        <div className="flex items-center">
          <div className="flex border rounded-lg overflow-hidden">
            <button
              className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'bg-white'}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <FiGrid size={18} />
            </button>
            <button
              className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : 'bg-white'}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <FiList size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Display active filters if any */}
      {(searchQuery || cityFilter || typeFilter) && (
        <div className="px-6 md:px-10 lg:px-20 py-3 flex flex-wrap items-center gap-2 border-b">
          <span className="text-sm text-gray-600">Active filters:</span>

          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full"
            >
              <span className="mr-1">"{searchQuery}"</span>
              <FiX size={14} />
            </button>
          )}

          {cityFilter && (
            <button
              onClick={() => setCityFilter("")}
              className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full"
            >
              <span className="mr-1">{cityFilter}</span>
              <FiX size={14} />
            </button>
          )}

          {typeFilter && (
            <button
              onClick={() => setTypeFilter("")}
              className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full"
            >
              <span className="mr-1">{typeFilter.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}</span>
              <FiX size={14} />
            </button>
          )}

          {(searchQuery || cityFilter || typeFilter) && (
            <button
              onClick={clearFilters}
              className="ml-auto text-rose-600 text-sm hover:underline"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {/* Community Results */}
      <div className="px-6 md:px-10 lg:px-20 py-4">
        {filteredCommunities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-gray-400 mb-4">
              <FiSearch size={48} />
            </div>
            <h2 className="text-xl font-semibold mb-2">No communities found</h2>
            <p className="text-gray-600 mb-6 text-center max-w-md">
              We couldn't find any communities matching your search criteria. Try adjusting your filters or search for something else.
            </p>
            <button
              onClick={clearFilters}
              className="bg-rose-600 text-white px-6 py-2 rounded-lg hover:bg-rose-700 transition"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="mb-16">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">
                {filteredCommunities.length} {filteredCommunities.length === 1 ? 'community' : 'communities'} in Ohio
              </p>

              <div className="flex items-center space-x-2">
                <button className="flex items-center text-sm text-gray-700 hover:text-gray-900">
                  <span>Display total before taxes</span>
                  <div className="relative ml-2 h-5 w-10 rounded-full bg-gray-200">
                    <div className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow" />
                  </div>
                </button>
              </div>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredCommunities.map((community) => {
                  const inComparison = isInComparison(community.id);

                  return (
                    <div key={community.id} className="group card-hover-effect">
                      <Link href={`/community/${community.id}/${community.slug}`} className="block">
                        <div className="relative">
                          {/* Image Container with favorites button */}
                          <div className="relative h-72 w-full overflow-hidden rounded-xl">
                            <Image
                              src={community.image}
                              alt={community.name}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>

                          {/* Favorite Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleComparison(community);
                            }}
                            className="absolute top-3 right-3 z-10 rounded-full bg-white/80 p-2 text-gray-700 hover:bg-white"
                            aria-label={inComparison ? "Remove from saved" : "Save to list"}
                          >
                            <FiHeart
                              size={18}
                              className={inComparison ? "fill-rose-500 text-rose-500" : ""}
                            />
                          </button>
                        </div>

                        {/* Community Info */}
                        <div className="mt-3">
                          <div className="flex justify-between">
                            <h3 className="font-medium text-gray-900">{`${community.city}, ${community.state}`}</h3>
                            <div className="flex items-center">
                              <FiStar className="fill-current" size={14} />
                              <span className="ml-1 text-sm">{community.rating}</span>
                            </div>
                          </div>
                          <p className="text-gray-500 text-sm">{community.name}</p>
                          <p className="text-gray-500 text-sm">{community.type}</p>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* List View */
              <div className="space-y-8">
                {filteredCommunities.map((community) => {
                  const inComparison = isInComparison(community.id);

                  return (
                    <div key={community.id} className="flex flex-col md:flex-row gap-4 bg-white rounded-xl shadow-sm hover:shadow-md transition p-4">
                      {/* Image */}
                      <div className="relative md:w-72 h-48 md:h-full shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={community.image}
                          alt={community.name}
                          fill
                          className="object-cover"
                        />

                        {/* Favorite Button */}
                        <button
                          type="button"
                          onClick={(e) => toggleComparison(community)}
                          className="absolute top-3 right-3 z-10 rounded-full bg-white/80 p-2 text-gray-700 hover:bg-white"
                          aria-label={inComparison ? "Remove from saved" : "Save to list"}
                        >
                          <FiHeart
                            size={18}
                            className={inComparison ? "fill-rose-500 text-rose-500" : ""}
                          />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{community.name}</h3>
                            <p className="text-gray-600 flex items-center">
                              <FiMapPin className="mr-1" size={14} />
                              {community.city}, {community.state}
                            </p>
                            <div className="mt-1 inline-block bg-gray-100 text-gray-800 px-2 py-1 text-xs rounded-md">
                              {community.type}
                            </div>
                          </div>

                          <div className="flex items-center">
                            <FiStar className="fill-yellow-400 text-yellow-400" size={16} />
                            <span className="ml-1 font-medium">{community.rating}</span>
                          </div>
                        </div>

                        <div className="my-4 border-t border-b py-3 flex flex-wrap gap-2">
                          <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">Private Rooms</span>
                          <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">Dining Services</span>
                          <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">Activities</span>
                          <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">Transportation</span>
                        </div>

                        <div className="mt-auto flex justify-between items-center">
                          <div>
                            <Link
                              href={`/community/${community.id}/${community.slug}`}
                              className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Show Map Button - Fixed at bottom */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
        <button className="bg-black text-white px-4 py-3 rounded-full font-medium shadow-lg flex items-center space-x-2">
          <span>Show map</span>
          <span className="inline-flex items-center justify-center w-5 h-5 bg-white text-black rounded-full text-xs">⊞</span>
        </button>
      </div>

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
    </>
  );
}

// Main component that wraps the content in Suspense
export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container mx-auto p-4">Loading search results...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
