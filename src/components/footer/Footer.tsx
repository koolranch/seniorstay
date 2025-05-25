"use client";

import React from 'react';
import Link from 'next/link';
import { Globe } from 'lucide-react';

const footerLinks = {
  support: [
    { label: 'Help Center', href: '/help' },
    { label: 'Resources Guide', href: '/resources' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Financial Options', href: '/resources/financial-options' },
  ],
  seniorCare: [
    { label: 'Independent Living', href: '/facilities?careLevel=Independent%20Living' },
    { label: 'Assisted Living', href: '/facilities?careLevel=Assisted%20Living' },
    { label: 'Memory Care', href: '/facilities?careLevel=Memory%20Care' },
    { label: 'Nursing Homes', href: '/facilities?careLevel=Nursing%20Home' },
    { label: 'Senior Apartments', href: '/facilities?careLevel=Senior%20Apartments' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Partners', href: '/partners' },
    { label: 'Testimonials', href: '/testimonials' },
  ],
};

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="container px-6 mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-sm mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-4">Senior Care Types</h3>
            <ul className="space-y-3">
              {footerLinks.seniorCare.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <p className="text-sm">© 2024 Guide for Seniors, Inc.</p>
            <div className="flex items-center space-x-6">
              <Link href="/privacy-policy" className="text-sm text-gray-600 hover:underline">
                Privacy
              </Link>
              <Link href="/terms-of-service" className="text-sm text-gray-600 hover:underline">
                Terms
              </Link>
              <Link href="/sitemap" className="text-sm text-gray-600 hover:underline">
                Sitemap
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <button className="flex items-center text-sm">
              <Globe className="h-4 w-4 mr-2" />
              English (US)
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
