'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  buttonText: string;
  defaultSubject: string;
  communityName: string;
  formspreeUrl: string;
}

const ModalForm: React.FC<ModalFormProps> = ({
  isOpen,
  onClose,
  title,
  buttonText,
  defaultSubject,
  communityName,
  formspreeUrl
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableElementRef = useRef<HTMLInputElement>(null);
  const lastFocusableElementRef = useRef<HTMLButtonElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const dataToSend = new FormData();
    dataToSend.append('name', formData.name);
    dataToSend.append('email', formData.email);
    dataToSend.append('phone', formData.phone);
    dataToSend.append('message', formData.message);
    dataToSend.append('_subject', `${defaultSubject} - ${communityName}`);
    dataToSend.append('community', communityName);

    try {
      const response = await fetch(formspreeUrl, {
        method: 'POST',
        body: dataToSend,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' }); // Reset form
      } else {
        const responseData = await response.json();
        console.error('Formspree error:', responseData);
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = useCallback(() => {
      setSubmitStatus('idle'); // Reset status on close
      onClose();
  }, [onClose]);

  // Handle ESC key press for closing modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleClose]);

  // Focus trapping
  useEffect(() => {
      if (isOpen && modalRef.current) {
          firstFocusableElementRef.current?.focus();

          const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          const handleTabKeyPress = (event: KeyboardEvent) => {
              if (event.key === 'Tab') {
                  if (event.shiftKey) { // Shift + Tab
                      if (document.activeElement === firstElement) {
                          lastElement.focus();
                          event.preventDefault();
                      }
                  } else { // Tab
                      if (document.activeElement === lastElement) {
                          firstElement.focus();
                          event.preventDefault();
                      }
                  }
              }
          };

          const currentModalRef = modalRef.current;
          currentModalRef.addEventListener('keydown', handleTabKeyPress);

          return () => {
              currentModalRef?.removeEventListener('keydown', handleTabKeyPress);
          };
      }
  }, [isOpen]);


  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={handleClose} // Close if clicking outside the modal content
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl p-6 md:p-8 w-full max-w-md m-4 relative transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-enter"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md"
          aria-label="Close modal"
          ref={lastFocusableElementRef} // Part of focus trap
        >
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 id="modal-title" className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          {title}
        </h2>

        {submitStatus === 'success' ? (
          <div className="text-center py-6">
            <svg className="w-16 h-16 mx-auto text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <p className="text-lg font-medium font-semibold text-gray-700">Thank you!</p>
            <p className="text-gray-600 mb-6">Your request has been sent successfully. We'll be in touch soon.</p>
            <button
              onClick={handleClose}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input type="hidden" name="_subject" value={`${defaultSubject} - ${communityName}`} />
            <input type="hidden" name="community" value={communityName} />
            {/* Honeypot field for spam prevention */}
            <input type="text" name="_gotcha" style={{ display: 'none' }} />

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium font-semibold text-gray-700 mb-1">Full Name</label>
                <input
                  ref={firstFocusableElementRef} // Focus trap start
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium font-semibold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium font-semibold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="(123) 456-7890"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium font-semibold text-gray-700 mb-1">
                  Message <span className="text-gray-500">(Optional)</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Any specific questions or preferred times?"
                />
              </div>
            </div>

            {submitStatus === 'error' && (
              <p className="mt-4 text-sm text-red-600">
                Sorry, there was an error sending your request. Please try again later.
              </p>
            )}

            <div className="mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                  isSubmitting
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                } transition duration-150 ease-in-out`}
              >
                {isSubmitting ? 'Sending...' : buttonText}
              </button>
            </div>
          </form>
        )}
         {/* Add a simple animation style */}
         <style jsx>{`
            @keyframes modal-enter {
              from {
                opacity: 0;
                transform: scale(0.95);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
            .animate-modal-enter {
              animation: modal-enter 0.2s ease-out forwards;
            }
        `}</style>
      </div>
    </div>
  );
};

export default ModalForm; 