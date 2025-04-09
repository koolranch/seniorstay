"use client";

import type React from 'react';
import { useState } from 'react';
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiPhone,
  FiMail,
  FiCheckCircle,
  FiAlertCircle,
  FiX
} from 'react-icons/fi';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface TourSchedulerProps {
  communityName: string;
  communityId: number;
  onClose?: () => void;
  className?: string;
  isModal?: boolean;
}

type TimeSlot = {
  id: string;
  time: string;
  available: boolean;
};

const TourScheduler = ({
  communityName,
  communityId,
  onClose,
  className = '',
  isModal = false
}: TourSchedulerProps) => {
  // Form data state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    date: '',
    timeSlot: '',
    participants: '1',
    specialRequests: '',
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

  // Time slots
  const timeSlots: TimeSlot[] = [
    { id: 'morning-1', time: '9:00 AM', available: true },
    { id: 'morning-2', time: '10:00 AM', available: true },
    { id: 'morning-3', time: '11:00 AM', available: true },
    { id: 'afternoon-1', time: '1:00 PM', available: true },
    { id: 'afternoon-2', time: '2:00 PM', available: true },
    { id: 'afternoon-3', time: '3:00 PM', available: true },
    { id: 'afternoon-4', time: '4:00 PM', available: true },
  ];

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if on mobile device
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      // Send data to Formspree
      const response = await fetch('https://formspree.io/f/xnnpaply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          _subject: `Tour Request for ${communityName}`,
        }),
      });

      if (response.ok) {
        setFormStatus({
          submitted: true,
          success: true,
          message: 'Your tour has been scheduled! We will contact you shortly to confirm the details.',
        });
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          date: '',
          timeSlot: '',
          participants: '1',
          specialRequests: '',
          communityName: communityName,
          communityId: communityId.toString()
        });
      } else {
        setFormStatus({
          submitted: true,
          success: false,
          message: 'Something went wrong. Please try again or contact us directly.',
        });
      }
    } catch (error) {
      setFormStatus({
        submitted: true,
        success: false,
        message: 'An error occurred. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get tomorrow's date in YYYY-MM-DD format for min date attribute
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Get max date (30 days from now) in YYYY-MM-DD format
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg ${isModal ? 'p-4 sm:p-6' : 'p-6'} ${className}`}>
      {/* Header with Close Button */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#1b4d70]">
          Schedule a Tour at {communityName}
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

      <p className="text-[#666666] mb-6">
        Select your preferred date and time, and we'll arrange a personalized tour.
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

      {(!formStatus.submitted || !formStatus.success) && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Hidden fields for community data */}
          <input
            type="hidden"
            name="communityName"
            value={formData.communityName}
          />
          <input
            type="hidden"
            name="communityId"
            value={formData.communityId}
          />

          {/* Personal Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-[#1b4d70] font-medium mb-1">
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
              <label htmlFor="lastName" className="block text-[#1b4d70] font-medium mb-1">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-[#1b4d70] font-medium mb-1">
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
              <label htmlFor="phone" className="block text-[#1b4d70] font-medium mb-1">
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

          {/* Tour Preference */}
          <div className={`mt-6 mb-3 grid grid-cols-1 ${isMobile ? '' : 'sm:grid-cols-2'} gap-4`}>
            <div>
              <label htmlFor="date" className="block text-[#1b4d70] font-medium mb-1">
                Preferred Date*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="text-[#A7C4A0]" />
                </div>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={getTomorrowDate()}
                  max={getMaxDate()}
                  required
                  className="w-full pl-10 p-3 border border-[#A7C4A0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4d70] focus:border-transparent"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Tours available next 30 days
              </p>
            </div>

            <div>
              <label htmlFor="timeSlot" className="block text-[#1b4d70] font-medium mb-1">
                Preferred Time*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiClock className="text-[#A7C4A0]" />
                </div>
                <select
                  id="timeSlot"
                  name="timeSlot"
                  value={formData.timeSlot}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 p-3 border border-[#A7C4A0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4d70] focus:border-transparent appearance-none bg-white"
                >
                  <option value="">Select a time</option>
                  {timeSlots
                    .filter((slot) => slot.available)
                    .map((slot) => (
                      <option key={slot.id} value={slot.time}>
                        {slot.time}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="participants" className="block text-[#1b4d70] font-medium mb-1">
                Number of Participants*
              </label>
              <select
                id="participants"
                name="participants"
                value={formData.participants}
                onChange={handleChange}
                required
                className="w-full p-3 border border-[#A7C4A0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4d70] focus:border-transparent"
              >
                <option value="1">1 person</option>
                <option value="2">2 people</option>
                <option value="3">3 people</option>
                <option value="4">4 people</option>
                <option value="5">5 or more people</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="specialRequests" className="block text-[#1b4d70] font-medium mb-1">
              Special Requests (Optional)
            </label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              className="w-full p-3 border border-[#A7C4A0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4d70] focus:border-transparent min-h-[80px]"
              placeholder="Any accessibility needs or specific areas you'd like to see..."
            />
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1b4d70] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#2F5061] disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {isSubmitting ? 'Scheduling...' : 'Schedule Tour'}
            </button>
            <p className="text-xs text-center text-gray-500 mt-2">
              We'll respond within 24 hours to confirm your tour.
            </p>
          </div>
        </form>
      )}
    </div>
  );
};

export default TourScheduler;
