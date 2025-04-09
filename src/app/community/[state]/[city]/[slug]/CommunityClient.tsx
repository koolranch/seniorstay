"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiMapPin, FiMail, FiStar } from "react-icons/fi";
import { Community } from '../../../../../lib/data/communities';

interface CommunityClientProps {
  params: {
    state: string;
    city: string;
    slug: string;
  };
  communities: Community[];
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1519974719765-e6559eac2575?q=80&w=2070&auto=format&fit=crop";

export default function CommunityClient({ params, communities }: CommunityClientProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const community = communities.find(
    (c) =>
      c.state.toLowerCase() === params.state &&
      c.city.toLowerCase() === params.city &&
      c.slug === params.slug
  );

  if (!community) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Community Not Found</h1>
            <p className="mt-4 text-lg text-gray-600">
              The requested senior living community could not be found.
            </p>
            <Link
              href="/community"
              className="mt-8 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Back to Communities
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96">
        <Image
          src={community.image}
          alt={community.name}
          fill
          sizes="100vw"
          className="object-cover"
          priority
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = FALLBACK_IMAGE;
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">{community.name}</h1>
            <p className="text-xl">
              {community.city}, {community.state}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {["overview", "amenities", "contact"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === "overview" && (
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
            <p className="text-gray-600">{community.description}</p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <FiStar className="h-6 w-6 text-yellow-400 mr-2" />
                <span className="text-gray-700">Rating: {community.rating}/5</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "amenities" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {community.amenities.map((amenity, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                >
                  <p className="text-gray-700">{amenity}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "contact" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <FiMapPin className="h-6 w-6 text-gray-400 mr-2" />
                <span className="text-gray-700">{community.address}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 