'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { FiAlertTriangle, FiHome, FiSearch, FiRefreshCw } from 'react-icons/fi';

export default function CommunityError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Community page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-amber-100 rounded-full">
          <FiAlertTriangle className="w-8 h-8 text-amber-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-center text-[#1b4d70] mb-4">
          Community Information Unavailable
        </h1>
        
        <p className="text-gray-600 text-center mb-8">
          We're having trouble loading this community's information. This might be because the 
          community no longer exists or there was a temporary connection issue.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={() => reset()}
            className="w-full flex items-center justify-center bg-[#1b4d70] text-white py-3 px-6 rounded-md font-medium hover:bg-[#2F5061] transition-colors"
          >
            <FiRefreshCw className="mr-2" />
            Try Again
          </button>
          
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/"
              className="flex items-center justify-center bg-white border border-[#1b4d70] text-[#1b4d70] py-3 px-6 rounded-md font-medium hover:bg-gray-50 transition-colors"
            >
              <FiHome className="mr-2" />
              Home
            </Link>
            
            <Link
              href="/search"
              className="flex items-center justify-center bg-white border border-[#1b4d70] text-[#1b4d70] py-3 px-6 rounded-md font-medium hover:bg-gray-50 transition-colors"
            >
              <FiSearch className="mr-2" />
              Search
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 