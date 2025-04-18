'use client';

import { useState } from 'react';
// import type { Metadata } from 'next'; // Metadata generation needs rethinking for client component
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { formatSlug, formatLocation } from '@/lib/utils/formatSlug';
import { FiMapPin, FiCheck } from 'react-icons/fi';
import type { Community } from '@prisma/client'; // Keep Community type
import TourModal from '@/components/TourModal'; // Re-import TourModal
import RequestInfoModal from '@/components/RequestInfoModal'; // Corrected Pricing Modal import
import { Calendar, DollarSign } from 'lucide-react'; // Import icons
// Assuming Button comes from a library or needs a different path
// import { Button } from '@/components/ui/button';
// Temporary: Using standard button element until Button component path is confirmed

interface PageParams {
  state: string;
  city: string;
}

// Define a simple Service type for the client side if Prisma type isn't directly usable
interface SimpleService { id: string | number; name: string; }

// Adjust props to expect serialized data (string IDs) and simplified services
interface CityPageProps {
  communities: (Omit<Community, 'id'> & { id: string; services: SimpleService[] })[];
  params: PageParams;
  cityDisplay: string;
  stateDisplay: string;
}

// Commenting out metadata generation as it likely belongs in a Server Component
/*
export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  // ... existing metadata logic ...
  // Requires prisma instance, which shouldn't be directly in client component
}
*/

export default function CityPage({
  communities: initialCommunities,
  params,
  cityDisplay,
  stateDisplay,
}: CityPageProps) {
  const [communities, setCommunities] = useState(initialCommunities);
  const [isTourModalOpen, setIsTourModalOpen] = useState(false); // Add state for TourModal
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<(Omit<Community, 'id'> & { id: string; services: SimpleService[] }) | null>(null);

  // Add openTourModal function
  const openTourModal = (community: (Omit<Community, 'id'> & { id: string; services: SimpleService[] })) => {
    setSelectedCommunity(community);
    setIsTourModalOpen(true);
  };

  const openPricingModal = (community: (Omit<Community, 'id'> & { id: string; services: SimpleService[] })) => {
    setSelectedCommunity(community);
    setIsPricingModalOpen(true);
  };

  const stateParam = decodeURIComponent(params.state);
  const cityParam = decodeURIComponent(params.city);

  // Render a message if no communities are found for this city
  if (communities.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-screen">
        {/* Consider adding Breadcrumbs here */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Senior Living in {cityDisplay}, {stateDisplay}
        </h1>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md" role="alert">
          <p className="font-bold">City Not Found or No Communities Listed</p>
          <p>We couldn't find any senior living communities listed for {cityDisplay}, {stateDisplay} at this time. Please check back later or try a different city.</p>
        </div>
         <div className="mt-8">
             <Link href="/" className="text-blue-600 hover:underline">
               &larr; Back to Home
             </Link>
         </div>
      </div>
    );
  }

  // Render the list of communities
  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
       {/* Consider adding Breadcrumbs here */}
       <h1 className="text-3xl font-bold text-gray-800 mb-8">
         Senior Living Communities in {cityDisplay}, {stateDisplay}
       </h1>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {communities.map((community) => (
           <div key={community.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col">
             <Link href={`/community/${stateParam}/${cityParam}/${community.slug}`} className="block group">
               <div className="relative h-48 w-full overflow-hidden">
                 <Image
                   src={community.imageUrl || '/placeholder-image.jpg'}
                   alt={`Exterior of ${community.name}`}
                   fill
                   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                   className="object-cover group-hover:scale-105 transition-transform duration-300"
                 />
               </div>
               <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 mb-1 truncate transition-colors duration-200" title={community.name || ""}>
                     {community.name || 'Community Name Missing'}
                  </h2>
               </div>
             </Link>
             <div className="p-4 pt-0 flex flex-col flex-grow">
                 <div className="flex items-center text-gray-600 text-sm mb-3">
                    <FiMapPin className="h-4 w-4 mr-1.5 flex-shrink-0 text-gray-500" />
                    <span className="truncate">
                       {community.city || cityDisplay}, {community.state || stateDisplay}
                    </span>
                 </div>

                 {/* Services Section - Added explicit cast after Array.isArray check */}
                 {Array.isArray(community.services) && community.services.length > 0 && (
                    <div className="mb-4 flex-grow">
                       <h3 className="text-sm font-medium text-gray-700 mb-1.5">Services:</h3>
                       <ul className="space-y-1">
                          {(community.services as unknown as SimpleService[]).slice(0, 3).map((service: SimpleService) => (
                          <li key={service.id} className="flex items-center text-xs text-gray-600">
                             <FiCheck className="h-3.5 w-3.5 mr-1.5 text-green-500 flex-shrink-0" />
                             {service.name}
                          </li>
                          ))}
                          {(community.services as unknown as SimpleService[]).length > 3 && (
                              <li className="text-xs text-gray-500 pl-5">+ {(community.services as unknown as SimpleService[]).length - 3} more</li>
                          )}
                       </ul>
                    </div>
                 )}
                 {/* Show placeholder if services is not an array or is empty */}
                 {(!Array.isArray(community.services) || community.services.length === 0) && (
                     <div className="mb-4 flex-grow">
                         <p className="text-xs text-gray-500 italic">Services information not available.</p>
                     </div>
                 )}

                 {/* Button Container - Updated styles to match ProviderCard */}
                 <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                   <button
                     // Style from ProviderCard
                     className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-full shadow-sm transition inline-flex items-center justify-center"
                     onClick={() => openTourModal(community)}
                   >
                     <Calendar className="w-4 h-4 inline-block mr-1 -mt-0.5" /> {/* Added icon */}
                     Schedule Tour
                   </button>
                   <button
                     // Style from ProviderCard
                     className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 text-sm font-medium py-2 px-4 rounded-full transition inline-flex items-center justify-center"
                     onClick={() => openPricingModal(community)}
                   >
                     <DollarSign className="w-4 h-4 inline-block mr-1 -mt-0.5" /> {/* Added icon */}
                     Get Pricing
                   </button>
                 </div>
              </div>
           </div>
         ))}
       </div>

       {/* Modals - Add TourModal back */}
       {selectedCommunity && (
         <>
           <TourModal
             isOpen={isTourModalOpen}
             onClose={() => setIsTourModalOpen(false)}
             communityId={selectedCommunity.id}
             communityName={selectedCommunity.name || 'Community'}
             communityImage={selectedCommunity.imageUrl}
             communitySlug={selectedCommunity.slug}
           />
           <RequestInfoModal
             isOpen={isPricingModalOpen}
             onClose={() => setIsPricingModalOpen(false)}
             communityName={selectedCommunity.name || 'Community'}
             requestType="Pricing"
           />
         </>
       )}

       <div className="mt-12 text-center">
            <Link href="/" className="text-blue-600 hover:underline">
               &larr; Explore Other Areas
             </Link>
       </div>
    </div>
  );
}

// Removing getServerSideProps / data fetching logic from this file
// It needs to be handled by a parent Server Component or API route
// that passes the serialized props (communities, params, cityDisplay, stateDisplay)
// to this client component.

