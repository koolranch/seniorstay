"use client";

import Image from "next/image";
import Link from "next/link";
import { FiMapPin, FiPhone, FiStar } from "react-icons/fi";
import type { Community } from "@/lib/data/communities";

interface CommunityClientProps {
  community: Community;
}

export default function CommunityClient({ community }: CommunityClientProps) {
  return (
    <article className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[300px] w-full">
        <Image
          src={community.image}
          alt={community.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {community.name}
            </h1>
            <div className="flex items-center text-white">
              <FiMapPin className="mr-2" />
              <span>
                {community.city}, {community.state}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Overview */}
            <section className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">
                Overview
              </h2>
              <p className="text-gray-600 mb-4">{community.description}</p>
              <div className="flex items-center text-sm text-gray-500">
                <FiStar className="text-[#F5A623] fill-[#F5A623] mr-1" />
                <span className="font-medium">{community.rating} Rating</span>
              </div>
            </section>

            {/* Amenities */}
            {community.amenities && community.amenities.length > 0 && (
              <section className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">
                  Amenities
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {community.amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center text-gray-600"
                    >
                      <span className="w-2 h-2 bg-[#A7C4A0] rounded-full mr-2" />
                      {amenity}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Contact Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <FiMapPin className="text-[#1b4d70] mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Address</p>
                    <p className="text-gray-600">{community.address}</p>
                    <p className="text-gray-600">
                      {community.city}, {community.state}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FiPhone className="text-[#1b4d70] mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Phone</p>
                    <a
                      href={`tel:${community.phone}`}
                      className="text-[#1b4d70] hover:underline"
                    >
                      {community.phone}
                    </a>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-900 mb-1">Price Range</p>
                  <p className="text-[#1b4d70] font-semibold">
                    {community.price || "Contact for pricing"}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 mb-2">Services</p>
                  <div className="flex flex-wrap gap-2">
                    {community.services.map((service) => (
                      <span
                        key={service}
                        className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
} 