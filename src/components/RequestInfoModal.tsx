"use client";

import React from 'react';
import { FiX } from 'react-icons/fi';

interface RequestInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  communityName: string;
  requestType: 'Pricing' | 'Tour';
}

const RequestInfoModal: React.FC<RequestInfoModalProps> = ({
  isOpen,
  onClose,
  communityName,
  requestType,
}) => {
  if (!isOpen) return null;

  const formAction = "https://formspree.io/f/xnnpaply"; // User's Formspree endpoint

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 transition-opacity duration-300" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 md:p-8 relative transform transition-all duration-300 scale-95 opacity-0 animate-modal-appear" 
        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <FiX size={24} />
        </button>

        <h2 className="text-2xl font-semibold text-[#1b4d70] mb-2">
          Request {requestType} for {communityName}
        </h2>
        <p className="text-gray-600 mb-6 text-sm">
          Please fill out the form below, and we'll get back to you shortly.
        </p>

        <form action={formAction} method="POST">
          {/* Hidden fields for Formspree */}
          <input type="hidden" name="_subject" value={`New Request: ${requestType} for ${communityName}`} />
          <input type="hidden" name="Community Name" value={communityName} />
          <input type="hidden" name="Request Type" value={requestType} />
          
          {/* Honeypot field for spam */}
          <input type="text" name="_gotcha" style={{ display: 'none' }} />

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                type="text" 
                name="name" 
                id="name" 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                placeholder="Your Name" 
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                name="email" 
                id="email" 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                placeholder="you@example.com" 
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input 
                type="tel" 
                name="phone" 
                id="phone" 
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                placeholder="(555) 123-4567" 
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
              <textarea 
                name="message" 
                id="message" 
                rows={3} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                placeholder="Any specific questions or details?"
              ></textarea>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
      {/* Add basic CSS animation for modal pop-in */}
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
};

export default RequestInfoModal; 