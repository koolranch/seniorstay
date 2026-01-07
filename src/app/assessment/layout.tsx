import { ReactNode } from 'react';
import { metadata } from './metadata';
import Link from 'next/link';
import { Home, Phone } from 'lucide-react';

export { metadata };

export default function AssessmentLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Minimal header with logo - Matches new homepage style */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-teal-600 to-teal-700 p-2 rounded-lg shadow-md group-hover:shadow-lg transition-all">
              <Home className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-900 leading-tight">
                Guide for Seniors
              </span>
              <span className="text-xs text-slate-500 hidden sm:block">
                Care Assessment
              </span>
            </div>
          </Link>
          
          {/* Help CTA */}
          <a
            href="tel:+12166774630"
            className="hidden sm:flex items-center gap-2 text-slate-600 hover:text-teal-600 font-medium transition-colors"
          >
            <Phone className="h-4 w-4" />
            <span>Need help? (216) 677-4630</span>
          </a>
        </div>
      </header>

      {/* Main content */}
      <main>{children}</main>

      {/* Minimal footer - Matches new style */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} Guide for Seniors. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy-policy" className="text-slate-500 hover:text-teal-600 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/contact" className="text-slate-500 hover:text-teal-600 transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
