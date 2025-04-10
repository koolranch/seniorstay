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
  title = "Find the Perfect Senior Living Community",
  subtitle = "Discover and compare communities that meet your unique needs and preferences"
}: HeroBannerProps) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/community?location=${encodeURIComponent(searchQuery.trim())}`);
  };
  
  return (
    <div 
      className="relative w-full min-h-[600px] flex items-center justify-center"
      style={{ 
        backgroundImage: "url('/images/gradient-header.png')", 
        backgroundSize: 'cover', 
        backgroundPosition: 'center' 
      }}
    >
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 md:py-32 flex flex-col justify-center items-center text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 max-w-3xl">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
          {subtitle}
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="w-full max-w-2xl bg-white rounded-full shadow-lg p-2 flex items-center">
          <div className="flex-1 flex items-center pl-4">
            <FiMapPin className="text-[#1b4d70] mr-2" />
            <input
              type="text"
              placeholder="Enter city, state, or zip code"
              className="w-full p-2 focus:outline-none text-[#333333]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            className="bg-[#F5A623] text-[#1b4d70] font-medium rounded-full py-3 px-6 md:px-8 flex items-center hover:bg-[#FFC65C] transition"
          >
            <FiSearch className="mr-2" />
            Search
          </button>
        </form>

        {/* Additional CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Link
            href="/featured"
            className="bg-white text-[#1b4d70] rounded-full py-2 px-6 font-medium hover:bg-[#FAFAF5] transition flex items-center justify-center"
          >
            View Featured Communities
          </Link>
          <Link
            href="/contact"
            className="bg-[#1b4d70] border-2 border-white text-white rounded-full py-2 px-6 font-medium hover:bg-[#2F5061] transition flex items-center justify-center"
          >
            Talk to a Care Advisor
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
