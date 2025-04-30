"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheck } from 'react-icons/fi';

// Define available care type options
const CARE_TYPES = [
  { id: 'independent', label: 'Independent Living' },
  { id: 'assisted', label: 'Assisted Living' },
  { id: 'memory', label: 'Memory Care' },
  { id: 'skilled', label: 'Skilled Nursing' },
  { id: 'continuing', label: 'Continuing Care' },
  { id: '55plus', label: '55+ Communities' },
];

// Define amenities options
const AMENITIES = [
  { id: 'dining', label: 'Restaurant-Style Dining' },
  { id: 'fitness', label: 'Fitness Center' },
  { id: 'pool', label: 'Swimming Pool' },
  { id: 'activities', label: 'Planned Activities' },
  { id: 'transportation', label: 'Transportation Services' },
  { id: 'pets', label: 'Pet Friendly' },
  { id: 'housekeeping', label: 'Housekeeping' },
  { id: 'beauty', label: 'Beauty Salon' },
  { id: 'wifi', label: 'WiFi' },
  { id: 'garden', label: 'Garden/Courtyard' },
];

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCareTypes: string[];
  selectedAmenities: string[];
  onCareTypeToggle: (typeId: string) => void;
  onAmenityToggle: (amenityId: string) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  selectedCareTypes,
  selectedAmenities,
  onCareTypeToggle,
  onAmenityToggle,
  onApplyFilters,
  onClearFilters
}) => {
  // Prevent body scrolling when drawer is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const activeFilterCount = selectedCareTypes.length + selectedAmenities.length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Filter Drawer */}
          <motion.dialog
            open
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed left-0 bottom-0 w-full bg-white z-50 rounded-t-xl overflow-hidden max-h-[90vh] flex flex-col m-0 p-0 border-0"
            aria-modal="true"
            aria-label="Filter options"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-[#1b4d70]">Filters</h2>
              <div className="flex items-center">
                <button
                  onClick={onClearFilters}
                  className="mr-4 text-sm text-[#1b4d70] font-medium font-semibold"
                  aria-label="Clear all filters"
                >
                  Clear all
                </button>
                <button
                  onClick={onClose}
                  className="rounded-full p-1 hover:bg-gray-100"
                  aria-label="Close filters"
                >
                  <FiX size={24} className="text-[#333333]" />
                </button>
              </div>
            </div>

            {/* Filter Content - Scrollable */}
            <div className="overflow-y-auto px-4 py-2 flex-grow">
              {/* Care Types Section */}
              <div className="py-4 border-b">
                <h3 className="text-base font-medium font-semibold mb-3 text-[#1b4d70]">Care Type</h3>
                <div className="space-y-2">
                  {CARE_TYPES.map(type => (
                    <label key={type.id} className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-50">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                        selectedCareTypes.includes(type.id)
                          ? 'bg-[#1b4d70] border-[#1b4d70]'
                          : 'border-gray-300'
                      }`}>
                        {selectedCareTypes.includes(type.id) && (
                          <FiCheck className="text-white" size={12} />
                        )}
                      </div>
                      <span className="text-[#333333]">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amenities Section */}
              <div className="py-4">
                <h3 className="text-base font-medium font-semibold mb-3 text-[#1b4d70]">Amenities</h3>
                <div className="grid grid-cols-1 gap-y-2">
                  {AMENITIES.map(amenity => (
                    <label key={amenity.id} className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-50">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                        selectedAmenities.includes(amenity.id)
                          ? 'bg-[#1b4d70] border-[#1b4d70]'
                          : 'border-gray-300'
                      }`}>
                        {selectedAmenities.includes(amenity.id) && (
                          <FiCheck size={14} className="text-white" />
                        )}
                      </div>
                      <span className="text-sm">{amenity.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Apply Button - Fixed at Bottom */}
            <div className="p-4 border-t shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
              <button
                onClick={() => {
                  onApplyFilters();
                  onClose();
                }}
                className="w-full bg-[#1b4d70] text-white py-3 rounded-lg font-medium font-semibold hover:bg-[#2F5061] transition"
              >
                Show {activeFilterCount > 0 ? `(${activeFilterCount} filters)` : 'results'}
              </button>
            </div>
          </motion.dialog>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileFilterDrawer;
