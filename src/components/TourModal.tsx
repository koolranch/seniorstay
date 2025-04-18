import { useState } from "react";
import { FiX } from "react-icons/fi";

// Define Props interface
interface TourModalProps {
  isOpen: boolean;
  onClose: () => void;
  communityId: string; // Assuming ID is passed as string
  communityName: string;
  communityImage?: string | null; // Optional image
  communitySlug: string;
}

// Update component to accept props
export default function TourModal({
  isOpen,
  onClose,
  communityId,
  communityName,
  communityImage, // Destructure props
  communitySlug,
}: TourModalProps) {
  // Remove internal state management for visibility and community
  // const [showTourScheduler, setShowTourScheduler] = useState(false);
  // const [selectedCommunity, setSelectedCommunity] = useState<{ id: number; name: string; } | null>(null);

  // const handleScheduleTour = (community: { id: number; name: string }) => {
  //   setSelectedCommunity(community);
  //   setShowTourScheduler(true);
  // };

  // const closeTourScheduler = () => {
  //   setShowTourScheduler(false);
  //   setSelectedCommunity(null);
  // };

  // Return null if not open
  if (!isOpen) {
    return null;
  }

  // Use props for display logic
  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 transition-opacity duration-300" 
        onClick={onClose} // Close on overlay click
    >
        <div 
            className="bg-white rounded-lg max-w-2xl w-full p-6 relative transform transition-all duration-300 scale-95 opacity-0 animate-modal-appear" 
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
            <button
                onClick={onClose} // Use onClose prop for the close button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                aria-label="Close modal"
            >
                <FiX size={24} />
            </button>
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">
                Schedule a Tour
            </h2>
            <p className="text-gray-600 mb-6">
                Request a tour of {communityName} {/* Use communityName prop */}
            </p>
            {/* Add your tour scheduling form here - TODO */}
            {/* You might pass communityId, communitySlug etc. to the form */}
            <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-600">
                Tour scheduling form placeholder for {communityName} (ID: {communityId})
            </div>
        </div>
        {/* Add basic CSS animation for modal pop-in (same as RequestInfoModal) */}
        <style jsx global>{`
            @keyframes modal-appear {
            from {
                opacity: 0;
                transform: scale(0.95);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
            }
            .animate-modal-appear {
            animation: modal-appear 0.2s ease-out forwards;
            }
        `}</style>
    </div>
  );
} 