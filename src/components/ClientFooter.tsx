"use client";

import Link from "next/link";

const ClientFooter = () => {
  return (
    <footer className="border-t border-[#A7C4A0] py-6 mt-16 bg-[#FAFAF5]">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-base font-semibold mb-4 text-[#1b4d70]">Support</h3>
            <ul className="space-y-3 text-sm text-[#333333]">
              <li><Link href="#" className="hover:text-[#F5A623] block py-1">Help Center</Link></li>
              <li><Link href="#" className="hover:text-[#F5A623] block py-1">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-[#F5A623] block py-1">Contact a Care Advisor</Link></li>
              <li><Link href="#" className="hover:text-[#F5A623] block py-1">Accessibility</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-semibold mb-4 text-[#1b4d70]">Community</h3>
            <ul className="space-y-3 text-sm text-[#333333]">
              <li><Link href="/blog" className="hover:text-[#F5A623] block py-1">Family Resources</Link></li>
              <li><Link href="/blog" className="hover:text-[#F5A623] block py-1">Caregiver Support</Link></li>
              <li><Link href="#" className="hover:text-[#F5A623] block py-1">Senior Living Guide</Link></li>
              <li><Link href="#" className="hover:text-[#F5A623] block py-1">Testimonials</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-semibold mb-4 text-[#1b4d70]">For Providers</h3>
            <ul className="space-y-3 text-sm text-[#333333]">
              <li><Link href="#" className="hover:text-[#F5A623] block py-1">List Your Community</Link></li>
              <li><Link href="#" className="hover:text-[#F5A623] block py-1">Provider Resources</Link></li>
              <li><Link href="#" className="hover:text-[#F5A623] block py-1">Community Guidelines</Link></li>
              <li><Link href="#" className="hover:text-[#F5A623] block py-1">Success Stories</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-semibold mb-4 text-[#1b4d70]">About</h3>
            <ul className="space-y-3 text-sm text-[#333333]">
              <li><Link href="#" className="hover:text-[#F5A623] block py-1">How SeniorStay works</Link></li>
              <li><Link href="#" className="hover:text-[#F5A623] block py-1">Our Mission</Link></li>
              <li><Link href="#" className="hover:text-[#F5A623] block py-1">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-[#F5A623] block py-1">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#A7C4A0] mt-8 pt-8 flex flex-col md:flex-row md:items-center justify-between text-sm">
          <div className="text-[#333333]">
            © {new Date().getFullYear()} SeniorStay, Inc.
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="#" className="text-[#333333] hover:text-[#F5A623]">Privacy</Link>
            <Link href="#" className="text-[#333333] hover:text-[#F5A623]">Terms</Link>
            <Link href="#" className="text-[#333333] hover:text-[#F5A623]">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ClientFooter;
