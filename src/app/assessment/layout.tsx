import { ReactNode } from 'react';
import { metadata } from './metadata';
import Link from 'next/link';
import Image from 'next/image';

export { metadata };

export default function AssessmentLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Minimal header with just logo */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#1e3a5f] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-xl font-semibold text-[#1e3a5f]">
              Cleveland Senior Living Finder
            </span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main>{children}</main>

      {/* Minimal footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Cleveland Senior Living Finder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

