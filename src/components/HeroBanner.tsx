import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiMapPin, FiSearch, FiHeart } from 'react-icons/fi';

interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
}

const HeroBanner = ({
  title = "Find the Perfect Senior Living Community",
  subtitle = "Discover and compare communities that meet your unique needs and preferences",
  backgroundImage = "https://images.unsplash.com/photo-1579208030886-b937da9dc6cc?q=80&w=1974&auto=format&fit=crop"
}: HeroBannerProps) => {
  return (
    <div className="relative w-full h-[60vh] min-h-[400px] max-h-[600px] bg-[#1b4d70]">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="Senior living community"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1b4d70]/60 to-[#1b4d70]/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 md:px-10 lg:px-20 h-full flex flex-col justify-center items-center text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 max-w-3xl">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
          {subtitle}
        </p>

        {/* Search bar */}
        <div className="w-full max-w-2xl bg-white rounded-full shadow-lg p-2 flex items-center">
          <div className="flex-1 flex items-center pl-4">
            <FiMapPin className="text-[#1b4d70] mr-2" />
            <input
              type="text"
              placeholder="Enter city, state, or zip code"
              className="w-full p-2 focus:outline-none text-[#333333]"
            />
          </div>
          <button className="bg-[#F5A623] text-[#1b4d70] font-medium rounded-full py-3 px-6 md:px-8 flex items-center hover:bg-[#FFC65C] transition">
            <FiSearch className="mr-2" />
            Search
          </button>
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
    </div>
  );
};

export default HeroBanner;
