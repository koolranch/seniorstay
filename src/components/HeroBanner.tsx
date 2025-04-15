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
    <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
      <Image
        src="/images/hero-banner.png"
        alt="Senior Living Search Banner"
        fill
        priority
        className="object-cover"
      />

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 bg-black/10">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-800 drop-shadow-md">
          {title}
        </h1>
        <p className="mt-2 text-blue-700 max-w-xl drop-shadow-sm font-medium">
          {subtitle}
        </p>
        
        {/* Search bar */}
        <div className="mt-6 w-full max-w-xl">
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
        </div>

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
    </section>
  );
};

export default HeroBanner;
