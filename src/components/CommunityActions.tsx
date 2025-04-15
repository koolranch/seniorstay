'use client';

import React, { useState } from 'react';
import ModalForm from '@/components/ModalForm'; // Assuming ModalForm is correctly located

interface CommunityActionsProps {
  communityName: string;
}

const formspreeEndpoint = "https://formspree.io/f/xnnpaply";

export default function CommunityActions({ communityName }: CommunityActionsProps) {
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => setIsPricingModalOpen(true)}
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          // Use button-primary if defined and preferred
          // className="button-primary"
        >
          Get Pricing
        </button>
        <button
          onClick={() => setIsTourModalOpen(true)}
          className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          // Use button-secondary or similar if defined
        >
          Schedule a Tour
        </button>
      </div>

      {/* Pricing Modal */}
      <ModalForm
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        title={`Get Pricing for ${communityName}`}
        buttonText="Get Pricing Info"
        defaultSubject={`Pricing Request for ${communityName}`}
        communityName={communityName}
        formspreeUrl={formspreeEndpoint}
      />

      {/* Tour Modal */}
      <ModalForm
        isOpen={isTourModalOpen}
        onClose={() => setIsTourModalOpen(false)}
        title={`Schedule a Tour at ${communityName}`}
        buttonText="Request Tour Appointment"
        defaultSubject={`Tour Request for ${communityName}`}
        communityName={communityName}
        formspreeUrl={formspreeEndpoint}
      />
    </>
  );
} 