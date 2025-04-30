'use client';

import React, { useState } from 'react';
import ModalForm from '@/components/ModalForm'; // Assuming ModalForm is correctly located
import { Calendar, DollarSign } from 'lucide-react';
import { sendGAEvent } from '@/lib/utils/gtag'; // Import GA event function

interface CommunityActionsProps {
  communityName: string;
}

const formspreeEndpoint = "https://formspree.io/f/xnnpaply";

export default function CommunityActions({ communityName }: CommunityActionsProps) {
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-0 inset-x-0 bg-white p-4 border-t md:relative md:border-none md:p-0">
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <button
            onClick={() => {
              setIsPricingModalOpen(true);
              sendGAEvent('get_pricing_click', communityName);
            }}
            className="border border-blue-600 text-blue-600 hover:bg-blue-50 text-sm font-medium py-2 px-4 rounded-full transition inline-flex items-center justify-center"
          >
            <DollarSign className="w-4 h-4 inline-block mr-1 -mt-0.5" />
            See Your Customized Pricing
          </button>
          <button
            onClick={() => {
              setIsTourModalOpen(true);
              sendGAEvent('schedule_tour_click', communityName);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-full shadow-sm transition inline-flex items-center justify-center"
          >
            <Calendar className="w-4 h-4 inline-block mr-1 -mt-0.5" />
            Book a Free Tour
          </button>
        </div>
      </div>

      {/* Pricing Modal */}
      <ModalForm
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        title={`See Your Customized Pricing for ${communityName}`}
        buttonText="Get Customized Pricing"
        defaultSubject={`Pricing Request for ${communityName}`}
        communityName={communityName}
        formspreeUrl={formspreeEndpoint}
      />

      {/* Tour Modal */}
      <ModalForm
        isOpen={isTourModalOpen}
        onClose={() => setIsTourModalOpen(false)}
        title={`Book a Free Tour at ${communityName}`}
        buttonText="Request Tour Appointment"
        defaultSubject={`Tour Request for ${communityName}`}
        communityName={communityName}
        formspreeUrl={formspreeEndpoint}
      />
    </>
  );
} 