"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiHeart,
  FiPhone,
  FiMail,
  FiMapPin,
  FiInfo,
  FiHome,
  FiUsers,
  FiDollarSign,
  FiCalendar,
  FiCheck
} from "react-icons/fi";
import GoogleMap from "@/components/map/GoogleMap"; // Changed to default import
import { useComparison } from "@/context/ComparisonContext";
import type { Community } from "@/context/ComparisonContext";

type Props = {
  community: Community;
};

export default function CommunityClient({ community }: Props) {
  const [activeTab, setActiveTab] = useState<"overview" | "amenities" | "contact">("overview");
  const { addToComparison, removeFromComparison, isInComparison } = useComparison();

  const inComparison = isInComparison(community.id);

  const toggleComparison = () => {
    if (inComparison) {
      removeFromComparison(community.id);
    } else {
      addToComparison(community);
    }
  };

  // Sample data for the community (would come from API in real app)
  const amenities = community.amenities || [
    "24-Hour Staff",
    "Fitness Center",
    "Library",
    "Game Room",
    "Beauty Salon",
    "Chef-Prepared Meals",
    "Transportation Services",
    "Housekeeping",
    "Outdoor Garden",
    "Social Activities",
    "WiFi Access",
    "Pet Friendly"
  ];

  return (
    <main className="pb-16 bg-[#FAFAF5]">
      {/* Hero Image */}
      <div className="relative h-[400px]">
        <Image
          src={community.image}
          alt={community.name}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Community Header */}
      <div className="bg-[#FAFAF5] shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#1b4d70]">{community.name}</h1>
              <p className="text-[#333333] mt-1">
                <span className="flex items-center">
                  <FiMapPin className="mr-1 text-[#1b4d70]" />
                  {community.city}, {community.state}
                </span>
              </p>
              <div className="mt-2 inline-block bg-[#A7C4A0] text-[#333333] px-3 py-1 rounded-full text-sm">
                {community.type}
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col md:flex-row items-start md:items-center gap-3">
              <button
                onClick={toggleComparison}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
                  inComparison ? 'bg-[#F5A623]/20 text-[#F5A623]' : 'bg-[#f1f6f0] text-[#1b4d70] hover:bg-[#A7C4A0]/20'
                }`}
              >
                <FiHeart className={inComparison ? 'fill-[#F5A623]' : ''} />
                {inComparison ? 'Remove from Compare' : 'Add to Compare'}
              </button>
              <Link
                href={`tel:${community.phone || '555-123-4567'}`}
                className="flex items-center gap-2 bg-[#1b4d70] text-white px-4 py-2 rounded-md hover:bg-[#2F5061] transition"
              >
                <FiPhone />
                Contact Community
              </Link>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b mt-8 border-[#A7C4A0]">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-3 px-4 font-medium border-b-2 ${
                activeTab === "overview" ? "border-[#1b4d70] text-[#1b4d70]" : "border-transparent hover:text-[#1b4d70]"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("amenities")}
              className={`py-3 px-4 font-medium border-b-2 ${
                activeTab === "amenities" ? "border-[#1b4d70] text-[#1b4d70]" : "border-transparent hover:text-[#1b4d70]"
              }`}
            >
              Amenities
            </button>
            <button
              onClick={() => setActiveTab("contact")}
              className={`py-3 px-4 font-medium border-b-2 ${
                activeTab === "contact" ? "border-[#1b4d70] text-[#1b4d70]" : "border-transparent hover:text-[#1b4d70]"
              }`}
            >
              Contact
            </button>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-semibold mb-4 text-[#1b4d70]">About {community.name}</h2>
              <p className="text-[#333333] mb-6">
                {community.description || `${community.name} is a premier ${community.type} community located in ${community.city}, ${community.state}.
                We provide a comfortable, maintenance-free lifestyle for seniors in a beautiful setting. Our experienced staff
                is dedicated to providing the highest quality care and services to our residents, ensuring they enjoy an
                active and fulfilling retirement.`}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-[#f1f6f0] p-5 rounded-lg">
                  <div className="flex items-center text-[#1b4d70] mb-3">
                    <FiHome className="mr-2" size={20} />
                    <h3 className="font-semibold">Residence Types</h3>
                  </div>
                  <ul className="space-y-2 text-[#333333]">
                    <li>Studio Apartments</li>
                    <li>One-Bedroom Apartments</li>
                    <li>Two-Bedroom Apartments</li>
                  </ul>
                </div>
                <div className="bg-[#f1f6f0] p-5 rounded-lg">
                  <div className="flex items-center text-[#1b4d70] mb-3">
                    <FiUsers className="mr-2" size={20} />
                    <h3 className="font-semibold">Care Services</h3>
                  </div>
                  <ul className="space-y-2 text-[#333333]">
                    <li>24/7 Staff Availability</li>
                    <li>Medication Management</li>
                    <li>Assistance with Daily Activities</li>
                    <li>Health and Wellness Programs</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-3 text-[#1b4d70]">Community Photos</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <div key={num} className="relative h-48 rounded-lg overflow-hidden">
                    <Image
                      src={`https://images.unsplash.com/photo-158${num}719471384-894fbb07a2${num}1?q=80&w=2187&auto=format&fit=crop`}
                      alt={`${community.name} photo ${num}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="bg-white shadow-md rounded-lg p-6 sticky top-24">
                <h3 className="text-xl font-semibold mb-4 text-[#1b4d70]">Location</h3>
                <div className="h-[300px] rounded-lg overflow-hidden mb-4">
                  <GoogleMap
                    markers={[{
                      id: community.id,
                      position: {
                        lat: 41.5038 + (community.id / 100),
                        lng: -81.6387 + (community.id / 100)
                      },
                      title: community.name,
                      link: `/provider/${community.slug}`
                    }]}
                    location={{
                      lat: 41.5038 + (community.id / 100),
                      lng: -81.6387 + (community.id / 100)
                    }}
                    zoom={14}
                  />
                </div>
                <p className="text-[#333333] mb-6">
                  {community.address || `123 Main Street, ${community.city}, ${community.state} 44100`}
                </p>

                <h3 className="text-xl font-semibold mb-4 text-[#1b4d70]">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FiPhone className="text-[#1b4d70] mr-3" />
                    <span className="text-[#333333]">{community.phone || "555-123-4567"}</span>
                  </div>
                  <div className="flex items-center">
                    <FiMail className="text-[#1b4d70] mr-3" />
                    <span className="text-[#333333]">info@{community.slug.replace(/-/g, "")}.com</span>
                  </div>
                  <div className="flex items-center">
                    <FiCalendar className="text-[#1b4d70] mr-3" />
                    <span className="text-[#333333]">Schedule a Tour</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[#A7C4A0]">
                  <Link
                    href="/search"
                    className="block text-center bg-[#F5A623] text-[#333333] py-2 rounded-md hover:bg-[#FFC65C] transition"
                  >
                    View Similar Communities
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "amenities" && (
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-[#1b4d70]">Amenities & Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {amenities.map((amenity) => (
                <div key={amenity} className="flex items-center p-4 bg-[#f1f6f0] rounded-lg">
                  <div className="w-8 h-8 bg-[#A7C4A0] text-[#1b4d70] rounded-full flex items-center justify-center mr-3">
                    <FiCheck />
                  </div>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "contact" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-[#1b4d70]">Contact {community.name}</h2>
              <p className="mb-6 text-[#333333]">
                We're here to answer your questions about our community, services, and availability.
                Please reach out to us using any of the methods below.
              </p>

              <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4 text-[#1b4d70]">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <FiMapPin className="text-[#1b4d70] mr-3 mt-1" />
                    <div>
                      <p className="font-medium text-[#1b4d70]">Address</p>
                      <p className="text-[#333333]">{community.address || `123 Main Street, ${community.city}, ${community.state} 44100`}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FiPhone className="text-[#1b4d70] mr-3 mt-1" />
                    <div>
                      <p className="font-medium text-[#1b4d70]">Phone</p>
                      <p className="text-[#333333]">{community.phone || "555-123-4567"}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FiMail className="text-[#1b4d70] mr-3 mt-1" />
                    <div>
                      <p className="font-medium text-[#1b4d70]">Email</p>
                      <p className="text-[#333333]">info@{community.slug.replace(/-/g, "")}.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#f1f6f0] p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-[#1b4d70]">Schedule a Tour</h3>
                <p className="text-[#333333] mb-4">
                  We invite you to visit our community and experience our amenities and services firsthand.
                  Tours are available 7 days a week by appointment.
                </p>
                <Link
                  href="#"
                  className="block text-center bg-[#1b4d70] text-white py-3 px-4 rounded-md hover:bg-[#2F5061] transition"
                >
                  Schedule a Tour
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-[#1b4d70]">Send Us a Message</h3>
              <form className="bg-white shadow-md rounded-lg p-6">
                <div className="mb-4">
                  <label htmlFor="name" className="block text-[#1b4d70] font-medium mb-2">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full p-3 border border-[#A7C4A0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4d70] focus:border-transparent"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-[#1b4d70] font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full p-3 border border-[#A7C4A0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4d70] focus:border-transparent"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-[#1b4d70] font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full p-3 border border-[#A7C4A0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4d70] focus:border-transparent"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="message" className="block text-[#1b4d70] font-medium mb-2">Message</label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full p-3 border border-[#A7C4A0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4d70] focus:border-transparent"
                  />
                </div>
                <button type="submit" className="w-full bg-[#1b4d70] text-white py-3 px-4 rounded-md hover:bg-[#2F5061] transition">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
