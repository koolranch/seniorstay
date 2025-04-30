import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiPhoneCall, FiMessageCircle, FiArrowRight } from 'react-icons/fi';

interface ReferralCTAProps {
  title?: string;
  description?: string;
  phoneNumber?: string;
  className?: string;
  variant?: 'default' | 'compact' | 'full-width';
  imageUrl?: string;
}

const ReferralCTA = ({
  title = "Need Help Finding the Right Community?",
  description = "Our care advisors are here to answer your questions and provide personalized recommendations for you or your loved one.",
  phoneNumber = "(216) 232-3354",
  className = '',
  variant = 'default',
  imageUrl = "https://images.unsplash.com/photo-1581579438747-104c53d7fbc4?q=80&w=2070&auto=format&fit=crop",
}: ReferralCTAProps) => {
  if (variant === 'compact') {
    return (
      <div className={`bg-[#f1f6f0] rounded-lg p-4 ${className}`}>
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="mb-4 sm:mb-0">
            <h3 className="text-lg font-semibold text-[#1b4d70]">{title}</h3>
            <p className="text-sm text-[#333333] mt-1 max-w-md">{description}</p>
          </div>
          <div className="flex space-x-3">
            <Link
              href={`tel:${phoneNumber.replace(/[^0-9]/g, '')}`}
              className="inline-flex items-center px-4 py-2 bg-[#1b4d70] text-white rounded-md hover:bg-[#2F5061] transition-colors"
            >
              <FiPhoneCall className="mr-2" />
              <span>Call Now</span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center px-4 py-2 bg-white border border-[#1b4d70] text-[#1b4d70] rounded-md hover:bg-[#f1f6f0] transition-colors"
            >
              <FiMessageCircle className="mr-2" />
              <span>Message</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'full-width') {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={imageUrl}
            alt="Care advisor helping a senior"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1b4d70]/90 to-[#1b4d70]/70" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 py-16 md:py-20">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
            <p className="text-white/90 text-lg mb-8">{description}</p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                href={`tel:${phoneNumber.replace(/[^0-9]/g, '')}`}
                className="inline-flex items-center justify-center px-6 py-3 bg-[#F5A623] text-[#1b4d70] text-lg font-medium font-semibold rounded-md hover:bg-[#FFC65C] transition-colors"
              >
                <FiPhoneCall className="mr-2" />
                <span>{phoneNumber}</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#1b4d70] text-lg font-medium font-semibold rounded-md hover:bg-[#f1f6f0] transition-colors"
              >
                <FiMessageCircle className="mr-2" />
                <span>Contact a Care Advisor</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`bg-[#1b4d70] rounded-xl overflow-hidden shadow-lg ${className}`}>
      <div className="flex flex-col md:flex-row">
        {/* Image Section (only on medium screens and up) */}
        <div className="md:w-1/3 relative hidden md:block">
          <Image
            src={imageUrl}
            alt="Care advisor helping a senior"
            fill
            className="object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="p-6 md:p-8 md:w-2/3">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-3">{title}</h3>
          <p className="text-white/80 mb-6">{description}</p>

          <div className="bg-white/10 rounded-lg p-5 mb-6">
            <div className="flex items-center text-white mb-2">
              <FiPhoneCall className="mr-3" size={20} />
              <span className="text-lg font-semibold">{phoneNumber}</span>
            </div>
            <p className="text-white/70 text-sm">Available 7 days a week, 8am-8pm</p>
          </div>

          <div className="space-y-3">
            <Link
              href={`tel:${phoneNumber.replace(/[^0-9]/g, '')}`}
              className="flex items-center justify-center w-full py-3 bg-[#F5A623] text-[#1b4d70] font-medium font-semibold rounded-md hover:bg-[#FFC65C] transition-colors"
            >
              <FiPhoneCall className="mr-2" />
              <span>Call Now</span>
            </Link>
            <Link
              href="/contact"
              className="flex items-center justify-center w-full py-3 bg-white text-[#1b4d70] font-medium font-semibold rounded-md hover:bg-gray-100 transition-colors"
            >
              Get Personalized Recommendations
              <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralCTA;
