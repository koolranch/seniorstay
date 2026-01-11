"use client";

import React from 'react';
import Link from 'next/link';
import { Home, Phone, Mail, MapPin } from 'lucide-react';

const footerLinks = {
  support: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'About Us', href: '/about' },
    { label: 'Greater Cleveland', href: '/greater-cleveland' },
    { label: 'Care Assessment', href: '/assessment' },
  ],
  seniorCare: [
    { label: 'Assisted Living', href: '/assisted-living-cleveland' },
    { label: 'Memory Care', href: '/memory-care-cleveland' },
    { label: 'Local Events', href: '/events' },
    { label: 'Pricing Guide', href: '/senior-living-costs-cleveland' },
    { label: 'Choosing Guide', href: '/choosing-senior-living' },
    { label: 'Resources', href: '/resources' },
    { label: 'Blog & Advice', href: '/blog' },
  ],
  neighborhoods: [
    { label: 'Westlake', href: '/location/westlake' },
    { label: 'Beachwood', href: '/location/beachwood' },
    { label: 'Shaker Heights', href: '/location/shaker-heights' },
    { label: 'Rocky River', href: '/location/rocky-river' },
    { label: 'Parma', href: '/location/parma' },
    { label: 'Lakewood', href: '/location/lakewood' },
  ],
  company: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
    { label: 'Sitemap', href: '/sitemap.xml' },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-2 rounded-lg">
                <Home className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">Guide for Seniors</span>
            </Link>
            <p className="text-slate-400 mb-6 max-w-sm leading-relaxed">
              Helping Cleveland families find the right senior living communities. 
              Free expert guidance for assisted living, memory care, and independent living.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <a href="tel:+12166774630" className="flex items-center gap-2 text-slate-300 hover:text-teal-400 transition-colors">
                <Phone className="h-4 w-4" />
                <span>(216) 677-4630</span>
              </a>
              <a href="mailto:info@guideforseniors.com" className="flex items-center gap-2 text-slate-300 hover:text-teal-400 transition-colors">
                <Mail className="h-4 w-4" />
                <span>info@guideforseniors.com</span>
              </a>
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="h-4 w-4" />
                <span>Cleveland, Ohio</span>
              </div>
            </div>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400 mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-300 hover:text-teal-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Senior Care Links */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400 mb-4">Senior Care</h3>
            <ul className="space-y-3">
              {footerLinks.seniorCare.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-300 hover:text-teal-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Neighborhoods Links */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400 mb-4">Neighborhoods</h3>
            <ul className="space-y-3">
              {footerLinks.neighborhoods.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-300 hover:text-teal-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} Guide for Seniors, Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {footerLinks.company.map((link) => (
                <Link 
                  key={link.label}
                  href={link.href} 
                  className="text-sm text-slate-500 hover:text-teal-400 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
