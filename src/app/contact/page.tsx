"use client";

import type React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowLeft, FiPhoneCall, FiMail, FiMessageSquare, FiClock, FiMapPin, FiCheck } from 'react-icons/fi';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    preferredContact: 'phone',
    inquiryFor: 'self',
    careType: 'independent',
    message: '',
    agreeTerms: false,
  });

  const [formStatus, setFormStatus] = useState<{
    submitted: boolean;
    success: boolean;
    message: string;
  }>({
    submitted: false,
    success: false,
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // In a real application, you would send this data to a server
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
      // if (!response.ok) throw new Error('Failed to submit form');

      // Simulate a successful submission
      setFormStatus({
        submitted: true,
        success: true,
        message: 'Thank you for your inquiry. One of our care advisors will contact you shortly.',
      });

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        preferredContact: 'phone',
        inquiryFor: 'self',
        careType: 'independent',
        message: '',
        agreeTerms: false,
      });
    } catch (error) {
      setFormStatus({
        submitted: true,
        success: false,
        message: 'There was an error submitting your form. Please try again later.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF5]">
      {/* Header */}
      <div className="bg-[#1b4d70] text-white">
        <div className="container mx-auto px-6 md:px-10 lg:px-20 py-12 md:py-20">
          <Link
            href="/"
            className="inline-flex items-center text-white mb-6 hover:text-[#F5A623] transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact a Senior Living Advisor</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Our experienced advisors are here to guide you through the process of finding the perfect senior living community.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-10 lg:px-20 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Contact Form */}
          <div className="lg:w-2/3 bg-white rounded-xl border border-[#A7C4A0] shadow-sm p-6 md:p-8">
            {formStatus.submitted && formStatus.success ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[#A7C4A0] rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiCheck className="text-white text-2xl" />
                </div>
                <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Thank You!</h2>
                <p className="text-lg text-[#333333] mb-6 max-w-md mx-auto">
                  {formStatus.message}
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center px-6 py-3 bg-[#1b4d70] text-white font-medium rounded-md hover:bg-[#2F5061] transition-colors"
                >
                  Return to Home
                </Link>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-semibold text-[#1b4d70] mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-[#1b4d70] font-medium mb-1">First Name*</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-[#A7C4A0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4d70] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-[#1b4d70] font-medium mb-1">Last Name*</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-[#A7C4A0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4d70] focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Contact fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-[#1b4d70] font-medium mb-1">Email Address*</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-[#A7C4A0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4d70] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-[#1b4d70] font-medium mb-1">Phone Number*</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-[#A7C4A0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4d70] focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Preferred contact method */}
                  <div>
                    <label className="block text-[#1b4d70] font-medium mb-1">Preferred Contact Method</label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="preferredContact"
                          value="phone"
                          checked={formData.preferredContact === 'phone'}
                          onChange={handleChange}
                          className="h-4 w-4 text-[#1b4d70]"
                        />
                        <span className="ml-2">Phone</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="preferredContact"
                          value="email"
                          checked={formData.preferredContact === 'email'}
                          onChange={handleChange}
                          className="h-4 w-4 text-[#1b4d70]"
                        />
                        <span className="ml-2">Email</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="preferredContact"
                          value="either"
                          checked={formData.preferredContact === 'either'}
                          onChange={handleChange}
                          className="h-4 w-4 text-[#1b4d70]"
                        />
                        <span className="ml-2">Either</span>
                      </label>
                    </div>
                  </div>

                  {/* Who is this inquiry for? */}
                  <div>
                    <label className="block text-[#1b4d70] font-medium mb-1">Who is this inquiry for?</label>
                    <select
                      name="inquiryFor"
                      value={formData.inquiryFor}
                      onChange={handleChange}
                      className="w-full p-3 border border-[#A7C4A0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4d70] focus:border-transparent"
                    >
                      <option value="self">Myself</option>
                      <option value="parent">Parent/Family Member</option>
                      <option value="friend">Friend</option>
                      <option value="client">Client</option>
                    </select>
                  </div>

                  {/* Type of care */}
                  <div>
                    <label className="block text-[#1b4d70] font-medium mb-1">Type of Care Interested In</label>
                    <select
                      name="careType"
                      value={formData.careType}
                      onChange={handleChange}
                      className="w-full p-3 border border-[#A7C4A0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4d70] focus:border-transparent"
                    >
                      <option value="independent">Independent Living</option>
                      <option value="assisted">Assisted Living</option>
                      <option value="memory">Memory Care</option>
                      <option value="skilled">Skilled Nursing</option>
                      <option value="continuing">Continuing Care</option>
                      <option value="unsure">Not Sure</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-[#1b4d70] font-medium mb-1">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full p-3 border border-[#A7C4A0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4d70] focus:border-transparent"
                      placeholder="Please provide any additional details that will help us assist you better..."
                    />
                  </div>

                  {/* Terms and conditions */}
                  <div>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={formData.agreeTerms as boolean}
                        onChange={handleChange}
                        required
                        className="h-4 w-4 text-[#1b4d70]"
                      />
                      <span className="ml-2 text-sm text-[#666666]">
                        I agree to the <Link href="#" className="text-[#1b4d70] hover:underline">terms and conditions</Link> and <Link href="#" className="text-[#1b4d70] hover:underline">privacy policy</Link>.
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#1b4d70] text-white py-3 px-4 rounded-md hover:bg-[#2F5061] transition-colors font-medium"
                  >
                    Submit Inquiry
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Contact Information */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl border border-[#A7C4A0] shadow-sm p-6 md:p-8 mb-6">
              <h3 className="text-xl font-semibold text-[#1b4d70] mb-4">Contact Information</h3>

              <div className="space-y-4">
                <div className="flex items-start">
                  <FiPhoneCall className="text-[#1b4d70] mr-3 mt-1" size={18} />
                  <div>
                    <p className="font-medium">Call Us</p>
                    <a href="tel:2162323354" className="text-[#333333] hover:text-[#1b4d70]">(216) 232-3354</a>
                    <p className="text-sm text-[#666666]">Available 24/7</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FiMail className="text-[#1b4d70] mr-3 mt-1" size={18} />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-[#333333]">info@guideforseniors.com</p>
                    <p className="text-sm text-[#666666]">We respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FiClock className="text-[#1b4d70] mr-3 mt-1" size={18} />
                  <div>
                    <p className="font-medium">Hours of Operation</p>
                    <p className="text-[#333333]">Monday - Friday: 8am - 8pm</p>
                    <p className="text-[#333333]">Saturday - Sunday: 9am - 5pm</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FiMapPin className="text-[#1b4d70] mr-3 mt-1" size={18} />
                  <div>
                    <p className="font-medium">Headquarters</p>
                    <p className="text-[#333333]">123 Guide Avenue</p>
                    <p className="text-[#333333]">Columbus, OH 43215</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#f1f6f0] rounded-xl p-6 md:p-8">
              <h3 className="text-xl font-semibold text-[#1b4d70] mb-4">Why Contact a Care Advisor?</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <FiCheck className="text-[#1b4d70] mr-3 mt-1" />
                  <span className="text-gray-700">Get personalized recommendations based on your specific needs</span>
                </li>
                <li className="flex items-start">
                  <FiCheck className="text-[#1b4d70] mr-3 mt-1" />
                  <span className="text-gray-700">Receive guidance on care types and available options</span>
                </li>
                <li className="flex items-start">
                  <FiCheck className="text-[#1b4d70] mr-3 mt-1" />
                  <span className="text-gray-700">Learn about financial assistance and payment options</span>
                </li>
                <li className="flex items-start">
                  <FiCheck className="text-[#1b4d70] mr-3 mt-1" />
                  <span className="text-gray-700">Get help scheduling tours with communities</span>
                </li>
                <li className="flex items-start">
                  <FiCheck className="text-[#1b4d70] mr-3 mt-1" />
                  <span className="text-gray-700">Access our network of trusted senior living communities</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
