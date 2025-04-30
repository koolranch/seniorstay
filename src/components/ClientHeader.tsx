"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiSearch,
  FiUser,
  FiMenu,
  FiHeart,
  FiMessageSquare,
  FiLogOut,
  FiSettings,
  FiBarChart2
} from "react-icons/fi";
import MobileNav from "./MobileNav";
import { useAuth } from "@/context/AuthContext";

const ClientHeader = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [searchQuery, setSearchQuery] = useState("");

  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/community?location=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");  // Clear the search after submission
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <header className="border-b sticky top-0 bg-[#FAFAF5] z-50 py-4">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-20">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-[#1b4d70] text-xl md:text-2xl font-bold">GuideforSeniors</span>
          </Link>

          {/* Center Search Bar - Desktop */}
          <div className="hidden md:flex items-center justify-center flex-1 mx-4 lg:mx-24">
            <div className="flex items-center border border-[#A7C4A0] rounded-full shadow-sm hover:shadow transition px-2 py-2 w-full max-w-lg">
              <input
                type="text"
                placeholder="Where to?"
                className="flex-1 px-4 font-medium font-semibold text-sm text-[#333333] focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button 
                onClick={() => handleSearch()}
                className="ml-auto bg-[#1b4d70] text-white p-2 rounded-full hover:bg-[#2F5061] transition"
              >
                <FiSearch />
              </button>
            </div>
          </div>

          {/* Right Nav - Desktop */}
          <div className="flex items-center space-x-3 md:space-x-4">
            <Link
              href="/favorites"
              className="hidden md:flex items-center text-[#1b4d70] hover:text-[#2F5061] transition"
              aria-label="Saved communities"
            >
              <FiHeart className="mr-1" />
              <span>Favorites</span>
            </Link>
            <Link
              href="/compare"
              className="hidden md:flex items-center text-[#1b4d70] hover:text-[#2F5061] transition"
              aria-label="Compare communities"
            >
              <FiBarChart2 className="mr-1" />
              <span>Compare</span>
            </Link>
            <Link
              href="/contact"
              className="hidden md:flex items-center text-[#1b4d70] hover:text-[#2F5061] transition"
              aria-label="Contact Us"
            >
              <FiMessageSquare className="mr-1" />
              <span>Contact</span>
            </Link>

            {/* User Account / Login Button */}
            <div className="relative" ref={userMenuRef}>
              {user ? (
                <button
                  className="flex items-center border border-[#A7C4A0] rounded-full p-2 shadow-sm hover:shadow-md"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  aria-label="User menu"
                  aria-expanded={showUserMenu}
                >
                  <div className="bg-[#1b4d70] text-white rounded-full p-1 flex items-center justify-center">
                    <FiUser size={16} />
                  </div>
                  <span className="hidden md:block ml-2 text-sm font-medium font-semibold">
                    {user.name || user.email.split('@')[0]}
                  </span>
                </button>
              ) : (
                <>
                  {/* Mobile menu button - when not logged in */}
                  <button
                    className="md:hidden flex items-center border border-[#A7C4A0] rounded-full p-2 shadow-sm hover:shadow-md"
                    onClick={() => setIsMobileMenuOpen(true)}
                    aria-label="Open menu"
                    aria-expanded={isMobileMenuOpen}
                  >
                    <FiMenu className="text-[#1b4d70]" size={20} />
                  </button>

                  {/* Desktop login button */}
                  <button
                    className="hidden md:flex items-center bg-[#1b4d70] text-white rounded-full py-2 px-4 shadow-sm hover:bg-[#2F5061] transition"
                    onClick={() => {
                      setAuthMode('login');
                      setShowAuthModal(true);
                    }}
                  >
                    <FiUser className="mr-2" size={16} />
                    <span>Login</span>
                  </button>
                </>
              )}

              {/* User dropdown menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-[#333333] hover:bg-[#f1f6f0]"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/favorites"
                    className="block px-4 py-2 text-sm text-[#333333] hover:bg-[#f1f6f0]"
                    onClick={() => setShowUserMenu(false)}
                  >
                    My Favorites
                  </Link>
                  <Link
                    href="/compare"
                    className="block px-4 py-2 text-sm text-[#333333] hover:bg-[#f1f6f0]"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Compare
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-[#333333] hover:bg-[#f1f6f0]"
                    onClick={handleLogout}
                  >
                    <div className="flex items-center">
                      <FiLogOut className="mr-2" size={14} />
                      Logout
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Button */}
        <div className="md:hidden mt-4">
          <div className="flex items-center w-full border border-[#A7C4A0] rounded-full shadow-sm p-3">
            <input
              type="text"
              placeholder="Where to?"
              className="flex-1 text-[#333333] text-sm focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button onClick={() => handleSearch()} aria-label="Search for communities">
              <FiSearch className="text-[#1b4d70]" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        user={user}
        onLogout={handleLogout}
        onLogin={() => {
          setAuthMode('login');
          setShowAuthModal(true);
          setIsMobileMenuOpen(false);
        }}
        onSignup={() => {
          setAuthMode('signup');
          setShowAuthModal(true);
          setIsMobileMenuOpen(false);
        }}
      />

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onToggleMode={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
        />
      )}
    </header>
  );
};

interface AuthModalProps {
  mode: 'login' | 'signup';
  onClose: () => void;
  onToggleMode: () => void;
}

const AuthModal = ({ mode, onClose, onToggleMode }: AuthModalProps) => {
  const { login, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await signUp(email, password, name);
      }
      onClose();
    } catch (err) {
      setError((err as Error).message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">
          {mode === 'login' ? 'Login to Your Account' : 'Create an Account'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium font-semibold text-[#333333] mb-1">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-[#A7C4A0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4d70]"
                placeholder="Your name"
              />
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium font-semibold text-[#333333] mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-[#A7C4A0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4d70]"
              placeholder="your@email.com"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium font-semibold text-[#333333] mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-[#A7C4A0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4d70]"
              placeholder="Your password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1b4d70] text-white py-3 rounded-md hover:bg-[#2F5061] transition disabled:opacity-70"
          >
            {isLoading ? 'Processing...' : mode === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-[#333333]">
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={onToggleMode}
              className="text-[#1b4d70] hover:text-[#2F5061] font-medium font-semibold ml-1"
            >
              {mode === 'login' ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientHeader;
