import { useState } from "react";
import { FiX } from "react-icons/fi";

export default function TourModal() {
  const [showTourScheduler, setShowTourScheduler] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const handleScheduleTour = (community: { id: number; name: string }) => {
    setSelectedCommunity(community);
    setShowTourScheduler(true);
  };

  const closeTourScheduler = () => {
    setShowTourScheduler(false);
    setSelectedCommunity(null);
  };

  return (
    <>
      {showTourScheduler && selectedCommunity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 relative">
            <button
              onClick={closeTourScheduler}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">
              Schedule a Tour
            </h2>
            <p className="text-gray-600 mb-6">
              Request a tour of {selectedCommunity.name}
            </p>
            {/* Add your tour scheduling form here */}
            <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-600">
              Tour scheduling form coming soon
            </div>
          </div>
        </div>
      )}
    </>
  );
} 