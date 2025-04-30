import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiMapPin, FiSearch, FiHeart } from 'react-icons/fi';

interface HeroBannerProps {
  title?: string;
  subtitle?: string;
}

const HeroBanner = ({
  title,
  subtitle
}: HeroBannerProps) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/community?location=${encodeURIComponent(searchQuery.trim())}`);
  };
  
  return (
    <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-gradient-to-b from-blue-50 to-white">
      <Image
        src="/images/hero-banner.png"
        alt="Senior Living Search Banner"
        fill
        priority
        className="object-cover"
      />

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
        <div className="bg-white/80 p-4 rounded-md shadow-md max-w-3xl">
          <h1 className="text-4xl font-bold text-gray-900">
            Discover Trusted Senior Living Communities Near You
          </h1>

          <p className="mt-4 text-lg text-gray-600">
            Our local experts help you compare, tour & choose with confidence.
          </p>
        </div>
        
        {/* Search bar */}
        <div className="mt-6 w-full max-w-xl">
          <form onSubmit={handleSearch} className="w-full max-w-2xl bg-white rounded-full shadow-lg p-2 flex items-center">
            <div className="flex-1 flex items-center pl-4">
              <FiMapPin className="text-[#1b4d70] mr-2" />
              <input
                type="text"
                placeholder="Enter city, ZIP code or community"
                className="w-full p-2 focus:outline-none text-[#333333]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              className="bg-[#F5A623] text-[#1b4d70] font-medium font-semibold rounded-full py-3 px-6 md:px-8 flex items-center hover:bg-[#FFC65C] transition"
            >
              <FiSearch className="mr-2" />
              Find Communities
            </button>
          </form>
        </div>

        {/* Additional CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Link
            href="/download-guide"
            className="bg-white text-[#1b4d70] rounded-full py-2 px-6 font-medium font-semibold hover:bg-[#FAFAF5] transition flex items-center justify-center"
          >
            Download Free Senior Living Guide
          </Link>
          <Link
            href="/contact"
            className="bg-[#1b4d70] border-2 border-white text-white rounded-full py-2 px-6 font-medium font-semibold hover:bg-[#2F5061] transition flex items-center justify-center"
          >
            Talk to a Care Advisor
          </Link>
        </div>
        <p className="mt-2 text-sm text-gray-500 text-center">
          Rated 4.8/5 by 1,200+ families
        </p>
      </div>
    </section>
  );
};

export default HeroBanner;
