'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ThankYouPage() {
  // Track lead submission success
  useEffect(() => {
    // Track analytics events
    try {
      // For Google Tag Manager
      if (typeof window !== 'undefined' && 'gtag' in window) {
        // @ts-ignore - Ignore type checking for gtag
        window.gtag('event', 'lead_submission_success', {
          event_category: 'Lead',
          event_label: 'Form Submission',
        });
      }
      
      // For Vercel Analytics
      if (typeof window !== 'undefined' && 'va' in window) {
        // @ts-ignore - Ignore type checking for Vercel Analytics
        window.va('event', {
          name: 'lead_submission_success',
        });
      }
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-md text-center"
      >
        <div className="mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto bg-green-100 p-4 rounded-full w-20 h-20 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">Thank You!</h1>
        <p className="text-lg text-gray-600 mb-8">
          We've received your information and will be in touch shortly.
          A care advisor will contact you to discuss your senior living options.
        </p>

        <div className="mt-8">
          <Link href="/" passHref>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Return to Home
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
} 