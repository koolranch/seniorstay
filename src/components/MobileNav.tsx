"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FiX,
  FiHeart,
  FiMessageSquare,
  FiInfo,
  FiSearch,
  FiHome,
  FiMapPin,
  FiUser,
  FiLogIn,
  FiUserPlus,
  FiLogOut
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import type { User } from '@/context/AuthContext';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onLogout: () => void;
  onLogin: () => void;
  onSignup: () => void;
}

const MobileNav = ({ isOpen, onClose, user, onLogout, onLogin, onSignup }: MobileNavProps) => {
  // Prevent body scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.dialog
            open
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-[80%] max-w-sm bg-white z-50 overflow-y-auto m-0 p-0 border-0"
            aria-modal="true"
          >
            {/* User info section (if logged in) */}
            {user && (
              <div className="bg-[#f1f6f0] p-4 border-b border-[#A7C4A0]">
                <div className="flex items-center">
                  <div className="bg-[#1b4d70] text-white rounded-full p-3 mr-3">
                    <FiUser size={20} />
                  </div>
                  <div>
                    <p className="font-medium font-semibold text-[#1b4d70]">{user.name || user.email.split('@')[0]}</p>
                    <p className="text-sm text-[#333333]">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Close button */}
            <div className="flex justify-end p-4">
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Close menu"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Navigation links */}
            <nav className="px-6 py-2">
              <ul className="space-y-6">
                <li>
                  <Link
                    href="/"
                    className="flex items-center py-2 text-lg font-medium font-semibold text-[#1b4d70]"
                    onClick={onClose}
                  >
                    <FiHome className="mr-3" size={20} />
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/search"
                    className="flex items-center py-2 text-lg font-medium font-semibold text-[#1b4d70]"
                    onClick={onClose}
                  >
                    <FiSearch className="mr-3" size={20} />
                    Search Communities
                  </Link>
                </li>
                <li>
                  <Link
                    href="/favorites"
                    className="flex items-center py-2 text-lg font-medium font-semibold text-[#1b4d70]"
                    onClick={onClose}
                  >
                    <FiHeart className="mr-3" size={20} />
                    My Favorites
                  </Link>
                </li>
                <li>
                  <Link
                    href="/compare"
                    className="flex items-center py-2 text-lg font-medium font-semibold text-[#1b4d70]"
                    onClick={onClose}
                  >
                    <FiHeart className="mr-3" size={20} />
                    Compare Communities
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="flex items-center py-2 text-lg font-medium font-semibold text-[#1b4d70]"
                    onClick={onClose}
                  >
                    <FiMessageSquare className="mr-3" size={20} />
                    Contact a Care Advisor
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="flex items-center py-2 text-lg font-medium font-semibold text-[#1b4d70]"
                    onClick={onClose}
                  >
                    <FiInfo className="mr-3" size={20} />
                    Resources
                  </Link>
                </li>

                {user ? (
                  <>
                    <li>
                      <Link
                        href="/profile"
                        className="flex items-center py-2 text-lg font-medium font-semibold text-[#1b4d70]"
                        onClick={onClose}
                      >
                        <FiUser className="mr-3" size={20} />
                        My Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        className="flex items-center py-2 text-lg font-medium font-semibold text-[#1b4d70] w-full text-left"
                        onClick={() => {
                          onLogout();
                          onClose();
                        }}
                      >
                        <FiLogOut className="mr-3" size={20} />
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <button
                        className="flex items-center py-2 text-lg font-medium font-semibold text-[#1b4d70] w-full text-left"
                        onClick={() => {
                          onLogin();
                          onClose();
                        }}
                      >
                        <FiLogIn className="mr-3" size={20} />
                        Login
                      </button>
                    </li>
                    <li>
                      <button
                        className="flex items-center py-2 text-lg font-medium font-semibold text-[#1b4d70] w-full text-left"
                        onClick={() => {
                          onSignup();
                          onClose();
                        }}
                      >
                        <FiUserPlus className="mr-3" size={20} />
                        Sign Up
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </nav>

            {/* Secondary links */}
            <div className="mt-8 px-6 py-4 border-t border-gray-200">
              <h3 className="text-sm font-medium font-semibold text-gray-500 mb-4">POPULAR LOCATIONS</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/search?city=columbus"
                    className="flex items-center py-1 text-[#1b4d70]"
                    onClick={onClose}
                  >
                    <FiMapPin className="mr-2" size={16} />
                    Columbus
                  </Link>
                </li>
                <li>
                  <Link
                    href="/search?city=cleveland"
                    className="flex items-center py-1 text-[#1b4d70]"
                    onClick={onClose}
                  >
                    <FiMapPin className="mr-2" size={16} />
                    Cleveland
                  </Link>
                </li>
                <li>
                  <Link
                    href="/search?city=cincinnati"
                    className="flex items-center py-1 text-[#1b4d70]"
                    onClick={onClose}
                  >
                    <FiMapPin className="mr-2" size={16} />
                    Cincinnati
                  </Link>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <div className="mt-auto px-6 py-6 border-t border-gray-200">
              <Link
                href="/contact"
                className="block w-full py-3 px-4 bg-[#1b4d70] text-white text-center rounded-lg font-medium font-semibold hover:bg-[#2F5061] transition"
                onClick={onClose}
              >
                Talk to a Care Advisor
              </Link>
            </div>
          </motion.dialog>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileNav;
