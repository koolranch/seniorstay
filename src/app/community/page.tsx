import { Suspense } from 'react';
import CommunitySearchClientWrapper from '@/components/CommunitySearchClientWrapper';

export default function CommunityDirectory() {
  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 py-10">
        <div className="container mx-auto px-6 md:px-10 lg:px-20">
          <h1 className="text-3xl font-bold text-[#1b4d70] mb-4">
            Senior Living Communities
          </h1>
          <p className="text-gray-600">
            Find the perfect senior living community for you or your loved ones.
          </p>
        </div>
      </div>
      
      <Suspense fallback={
        <div className="container mx-auto px-6 md:px-10 lg:px-20 py-12 text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-md p-4 h-72">
                  <div className="bg-gray-200 h-32 w-full rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="flex gap-2 mt-4">
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }>
        <CommunitySearchClientWrapper />
      </Suspense>
    </main>
  );
} 