"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { communities } from "@/lib/data/staticCommunities";
import ProviderCard from "@/components/ProviderCard";

export function FeaturedPageContent() {
  // For this example, we'll consider communities with high ratings as featured
  // In a real app, you would have a `isFeatured` flag in your data
  const featuredCommunities = useMemo(() => {
    return communities
      .filter((community) => community.rating >= 4.6) // Using high rating as proxy for "featured"
      .slice(0, 6);
  }, []);

  // Handle tour schedule button click
  const handleScheduleTour = (communityId: number) => {
    console.log(`Schedule tour for community ID: ${communityId}`);
    // Implement tour scheduling logic
  };

  // Handle pricing request button click
  const handleRequestPricing = (communityId: number) => {
    console.log(`Request pricing for community ID: ${communityId}`);
    // Implement pricing request logic
  };
  
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 py-8">
        <div className="container mx-auto px-6 md:px-10 lg:px-20">
          <Link 
            href="/" 
            className="inline-flex items-center text-[#1b4d70] mb-6 hover:underline"
          >
            <FiArrowLeft className="mr-2" />
            Back to Home
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-[#1b4d70] mb-4">
            Featured Senior Living Communities
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Explore our handpicked selection of outstanding senior living communities. These communities offer exceptional care, amenities, and services.
          </p>
        </div>
      </div>

      {/* Featured Communities */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-6 md:px-10 lg:px-20">
          {featuredCommunities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCommunities.map((community) => (
                <ProviderCard
                  key={community.id}
                  id={community.id}
                  slug={community.slug}
                  name={community.name}
                  city={community.city}
                  state={community.state}
                  type={community.type}
                  image={community.image}
                  rating={community.rating || 4.5}
                  reviewCount={community.reviewCount}
                  amenities={community.services ? (Array.isArray(community.services) ? community.services : community.services.split(/,\s*/)) : []}
                  onScheduleTour={() => handleScheduleTour(community.id)}
                  onRequestPricing={() => handleRequestPricing(community.id)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <p className="text-lg text-gray-600">No featured communities available at this time.</p>
              <Link 
                href="/"
                className="inline-block mt-4 bg-[#1b4d70] text-white py-2 px-4 rounded-md font-medium font-semibold hover:bg-[#2F5061] transition-colors"
              >
                Explore All Communities
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Additional Info Section */}
      <div className="py-12 bg-white border-t border-neutral-200">
        <div className="container mx-auto px-6 md:px-10 lg:px-20">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-[#1b4d70] mb-4">
              What Makes a Featured Community?
            </h2>
            <div className="prose max-w-none text-gray-600">
              <p>
                Our featured communities represent the best in senior living, offering exceptional care, premium amenities, and outstanding resident experiences. Each featured community has been selected based on factors like:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-4">
                <li>High resident and family satisfaction ratings</li>
                <li>Comprehensive care options and services</li>
                <li>Quality of staff and management</li>
                <li>Superior amenities and accommodations</li>
                <li>Excellent track record of regulatory compliance</li>
              </ul>
              <p className="mt-4">
                We personally visit each community to ensure it meets our high standards before featuring it on our platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 