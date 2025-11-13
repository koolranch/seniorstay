"use client";

import React from 'react';
import Link from 'next/link';
import { CheckCircle, Calendar, Phone, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Community } from '@/data/facilities';

interface TourConfirmationScreenProps {
  community: Community;
  isOpen: boolean;
  onClose: () => void;
  onScheduleAnother?: () => void;
}

export default function TourConfirmationScreen({
  community,
  isOpen,
  onClose,
  onScheduleAnother,
}: TourConfirmationScreenProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto animate-in fade-in zoom-in duration-200">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>

          {/* Success Content */}
          <div className="p-8 text-center">
            {/* Success Icon with Animation */}
            <div className="relative mx-auto mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-in zoom-in duration-500">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              {/* Confetti effect */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-orange-400 rounded-full animate-ping"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: '1s',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Success Message */}
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Tour Request Sent! 🎉
            </h2>
            
            <p className="text-lg text-gray-700 mb-6">
              Your tour request for <span className="font-semibold text-primary">{community.name}</span> has been received.
            </p>

            {/* Next Steps */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Phone className="h-5 w-5 text-blue-600" />
                What Happens Next:
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">1.</span>
                  <span>We'll call you <span className="font-semibold">within 2 hours</span> to confirm your tour</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">2.</span>
                  <span>We'll coordinate the best time with the community</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">3.</span>
                  <span>You'll receive a confirmation with tour details</span>
                </li>
              </ul>
            </div>

            {/* Secondary Actions */}
            <div className="space-y-3">
              {onScheduleAnother && (
                <Button
                  onClick={onScheduleAnother}
                  variant="outline"
                  className="w-full border-2 border-primary text-primary hover:bg-primary/5 font-semibold py-6"
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Schedule Another Tour
                </Button>
              )}

              <Link href="/greater-cleveland" onClick={onClose}>
                <Button
                  variant="ghost"
                  className="w-full text-gray-700 hover:text-primary hover:bg-gray-50 py-6"
                >
                  Browse More Communities
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>

              <Button
                onClick={onClose}
                variant="ghost"
                className="w-full text-gray-500 hover:text-gray-700"
              >
                Close
              </Button>
            </div>

            {/* Additional Help */}
            <div className="mt-6 pt-6 border-t text-sm text-gray-500">
              <p>
                Questions? Call us at{' '}
                <a href="tel:+12165550100" className="text-primary hover:underline font-medium">
                  (216) 555-0100
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

