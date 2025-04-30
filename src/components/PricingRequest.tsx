"use client";

import type React from 'react';
import { useState } from 'react';
import {
  FiDollarSign,
  FiUser,
  FiPhone,
  FiMail,
  FiCheckCircle,
  FiAlertCircle,
  FiX
} from 'react-icons/fi';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface PricingRequestProps {
  communityName: string;
  communityId: number;
  onClose?: () => void;
  className?: string;
  isModal?: boolean;
}

const PricingRequest = ({
  communityName,
  communityId,
  onClose,
  className = '',
  isModal = false
}: PricingRequestProps) => {
  // Form data state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    communityName: communityName,
    communityId: communityId.toString()
  });

  // Form status state
  const [formStatus, setFormStatus] = useState<{
    submitted: boolean;
    success: boolean;
    message: string;
  }>({
    submitted: false,
    success: false,
    message: '',
  });

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if on mobile device
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Submit to Formspree
      const response = await fetch('https://formspree.io/f/xnnpaply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          formType: 'pricing_request',
          subject: `Pricing Request for ${communityName}`,
        }),
      });

      if (response.ok) {
        setFormStatus({
          submitted: true,
          success: true,
          message: 'Your pricing request has been submitted successfully. We will contact you shortly with pricing information.',
        });
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: '',
          communityName: communityName,
          communityId: communityId.toString()
        });
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      setFormStatus({
        submitted: true,
        success: false,
        message: 'There was an error submitting your request. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg ${isModal ? 'p-4 sm:p-6' : 'p-6'} ${className}`}>
      {/* Header with Close Button */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#1b4d70]">
          Get Hassle-Free Pricing for {communityName}
        </h2>
        {isModal && onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <FiX size={20} />
          </button>
        )}
      </div>

      <p className="text-[#666666] text-sm -mt-4 mb-6">
        Skip the sales pitch. Just clear, upfront pricing—sent straight to your inbox.
      </p>

      {formStatus.submitted && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            formStatus.success ? 'bg-[#f1f6f0] text-[#1b4d70]' : 'bg-red-50 text-red-700'
          }`}
        >
          <div className="flex items-start">
            {formStatus.success ? (
              <FiCheckCircle className="mt-0.5 mr-2 text-[#A7C4A0]" size={18} />
            ) : (
              <FiAlertCircle className="mt-0.5 mr-2 text-red-500" size={18} />
            )}
            <p>{formStatus.message}</p>
          </div>
        </div>
      )}

      {!formStatus.submitted || !formStatus.success ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-[#1b4d70] font-medium font-semibold mb-1">
                First Name*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-[#A7C4A0]" />
                </div>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 p-3 border border-[#A7C4A0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4d70] focus:border-transparent"
                  placeholder="John"
                />
              </div>
            </div>
            <div>
              <label htmlFor="lastName" className="block text-[#1b4d70] font-medium font-semibold mb-1">
                Last Name*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-[#A7C4A0]" />
                </div>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 p-3 border border-[#A7C4A0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4d70] focus:border-transparent"
                  placeholder="Doe"
                />
              </div>
            </div>
          </div>

          {/* Contact Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-[#1b4d70] font-medium font-semibold mb-1">
                Email*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-[#A7C4A0]" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 p-3 border border-[#A7C4A0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4d70] focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="block text-[#1b4d70] font-medium font-semibold mb-1">
                Phone*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="text-[#A7C4A0]" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 p-3 border border-[#A7C4A0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4d70] focus:border-transparent"
                  placeholder="(555) 555-5555"
                />
              </div>
            </div>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-[#1b4d70] font-medium font-semibold mb-1">
              Additional Information (Optional)
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-3 border border-[#A7C4A0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4d70] focus:border-transparent min-h-[80px]"
              placeholder="Any specific questions about pricing or services..."
            />
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1b4d70] text-white py-3 px-4 rounded-lg font-medium font-semibold hover:bg-[#2F5061] disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {isSubmitting ? 'Submitting...' : 'Get My Pricing Info'}
            </button>
            <p className="text-xs text-center text-gray-500 mt-2">
              We'll respond within 24 hours with pricing information.
            </p>
          </div>
        </form>
      ) : (
        <div className="text-center">
          <button
            onClick={onClose}
            className="mt-4 bg-[#1b4d70] text-white py-2 px-4 rounded-lg hover:bg-[#2F5061] transition"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default PricingRequest; 