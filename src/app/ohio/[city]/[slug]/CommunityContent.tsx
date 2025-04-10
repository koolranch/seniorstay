"use client";

import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { getCityPath } from "@/lib/utils/formatSlug";

interface CommunityContentProps {
  community: {
    name: string;
    type: string;
    description: string;
    address: string;
    amenities?: string[];
    rating?: number;
    reviewCount?: number;
  };
  cityName: string;
}

export default function CommunityContent({ 
  community, 
  cityName 
}: CommunityContentProps) {
  return (
    <>
      {/* Back Link */}
      <Link 
        href={getCityPath("OH", cityName)}
        className="inline-flex items-center text-[#1b4d70] mb-6 hover:underline"
      >
        <FiArrowLeft className="mr-2" />
        Back to {cityName} Communities
      </Link>

      {/* Community Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1b4d70] mb-4">
          {community.name}
        </h1>
        <p className="text-lg text-gray-600">
          {community.type} in {cityName}, Ohio
        </p>
      </div>

      {/* Community Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-[#1b4d70] mb-4">
              About {community.name}
            </h2>
            <p className="text-gray-600 mb-4">
              {community.description}
            </p>
            <div className="flex items-center text-gray-600">
              <span className="mr-2">Address:</span>
              <span>{community.address}, {cityName}, OH</span>
            </div>
          </div>

          {/* Amenities */}
          {community.amenities && community.amenities.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-[#1b4d70] mb-4">
                Amenities & Services
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {community.amenities.map((amenity, index) => (
                  <div 
                    key={index}
                    className="flex items-center text-gray-600"
                  >
                    <span className="mr-2">•</span>
                    {amenity}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-[#1b4d70] mb-4">
              Community Details
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700">Type</h3>
                <p className="text-gray-600">{community.type}</p>
              </div>
              {community.rating && community.rating > 0 && (
                <div>
                  <h3 className="font-medium text-gray-700">Rating</h3>
                  <p className="text-gray-600">
                    {community.rating.toFixed(1)} out of 5
                    {community.reviewCount && ` (${community.reviewCount} reviews)`}
                  </p>
                </div>
              )}
              <div>
                <h3 className="font-medium text-gray-700">Location</h3>
                <p className="text-gray-600">{cityName}, Ohio</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 