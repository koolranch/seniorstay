'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

type LeadFormProps = {
  communityName?: string;
  pageType?: string;
  sourceSlug?: string;
  city?: string;
  state?: string;
  address?: string;
  services?: string;
  className?: string;
};

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  cityOrZip: string;
  careType: string;
  moveInTimeline: string;
  notes: string;
};

const careTypeOptions = [
  'Assisted Living',
  'Memory Care',
  'Independent Living',
  'Nursing Home',
  'Home Care',
  'Other',
];

const timelineOptions = [
  'ASAP',
  '30 days',
  '60 days',
  '90+ days',
  'Just researching',
];

export default function LeadForm({
  communityName,
  pageType,
  sourceSlug,
  city,
  state,
  address,
  services,
  className = '',
}: LeadFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    cityOrZip: '',
    careType: '',
    moveInTimeline: '',
    notes: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when field is being edited
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    // Required field validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    // At least email or phone is required
    if (!formData.email && !formData.phone) {
      newErrors.email = 'Either email or phone is required';
      newErrors.phone = 'Either email or phone is required';
    }
    
    // Email format validation if provided
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone format validation if provided
    if (formData.phone && !/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/submitLead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          communityName,
          pageType,
          sourceSlug,
          city,
          state,
          address,
          services,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit lead');
      }
      
      // Show success state briefly before redirecting
      setIsSuccess(true);
      
      setTimeout(() => {
        // Redirect to thank-you page
        router.push('/thank-you');
      }, 1500);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ fullName: 'Failed to submit form. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Use Formspree endpoint for submission
  const formspreeEndpoint = "https://formspree.io/f/xnnpaply";

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`p-6 bg-green-50 rounded-lg border border-green-200 ${className}`}
      >
        <h3 className="text-xl font-semibold text-green-700 mb-2">Thank You!</h3>
        <p className="text-green-600">
          Your information has been submitted successfully. We will contact you shortly.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white p-6 rounded-lg shadow-md ${className}`}
    >
      <h2 className="text-xl font-bold mb-4">Request Information</h2>
      <form action={formspreeEndpoint} method="POST" className="space-y-4">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium font-semibold text-gray-900 mb-1">
            Full Name*
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md text-gray-900 ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            placeholder="Enter your full name"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium font-semibold text-gray-900 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md text-gray-900 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            placeholder="Enter your email address"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium font-semibold text-gray-900 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md text-gray-900 ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            placeholder="Enter your phone number"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
          )}
          <p className="mt-1 text-xs text-gray-900">
            * Either email or phone is required
          </p>
        </div>

        {/* City or Zip */}
        <div>
          <label htmlFor="cityOrZip" className="block text-sm font-medium font-semibold text-gray-900 mb-1">
            City or Zip Code
          </label>
          <input
            type="text"
            id="cityOrZip"
            name="cityOrZip"
            value={formData.cityOrZip}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your city or zip code"
          />
        </div>

        {/* Care Type */}
        <div>
          <label htmlFor="careType" className="block text-sm font-medium font-semibold text-gray-900 mb-1">
            Care Type
          </label>
          <select
            id="careType"
            name="careType"
            value={formData.careType}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select care type</option>
            {careTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Move-in Timeline */}
        <div>
          <label htmlFor="moveInTimeline" className="block text-sm font-medium font-semibold text-gray-900 mb-1">
            Move-in Timeline
          </label>
          <select
            id="moveInTimeline"
            name="moveInTimeline"
            value={formData.moveInTimeline}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select timeline</option>
            {timelineOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium font-semibold text-gray-900 mb-1">
            Additional Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Any specific requirements or questions..."
          />
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
          ) : (
            'Submit Request'
          )}
        </motion.button>
      </form>
    </motion.div>
  );
} 