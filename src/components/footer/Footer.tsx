"use client";

import React from 'react';
import Link from 'next/link';
import { Globe } from 'lucide-react';

const footerLinks = {
  support: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'About Us', href: '/about' },
    { label: 'Greater Cleveland', href: '/greater-cleveland' },
  ],
  seniorCare: [
    { label: 'Assisted Living', href: '/assisted-living-cleveland' },
    { label: 'Memory Care', href: '/memory-care-cleveland' },
    { label: 'Pricing Guide', href: '/senior-living-costs-cleveland' },
    { label: 'Choosing Guide', href: '/choosing-senior-living' },
    { label: 'Resources', href: '/resources' },
    { label: 'Blog & Advice', href: '/blog' },
  ],
  company: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
    { label: 'Sitemap', href: '/sitemap.xml' },
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
              <Link href="/sitemap.xml" className="text-sm text-gray-600 hover:underline">
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
