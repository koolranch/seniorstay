"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Menu, User, Home, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  // Hydration fix - only render client-side components after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      // Add the search query to the URL as a query parameter and navigate
      const searchParams = new URLSearchParams();
      searchParams.set('query', searchQuery.trim());
      router.push(`/?${searchParams.toString()}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 group">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-primary to-primary/70 p-2 rounded-lg shadow-md group-hover:shadow-lg transition-shadow">
                <Home className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <span className="text-base md:text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">Guide for Seniors</span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <form
              className="flex items-center w-full px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm"
              onSubmit={handleSearchSubmit}
            >
              <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search locations"
                className="flex-1 ml-3 bg-transparent border-none outline-none text-sm"
                aria-label="Search for senior living facilities"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <Button
                type="submit"
                size="sm"
                className="flex-shrink-0 rounded-full bg-primary hover:bg-primary/90 text-white"
              >
                Search
              </Button>
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/assessment">
              <Button className="rounded-full text-sm font-medium bg-[#ff5a5f] hover:bg-[#ff4449] text-white">
                Find Your Care Level
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="rounded-full text-sm font-medium">
                Contact Us
              </Button>
            </Link>

            {isMounted && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-full border border-gray-200 p-1 ml-2 flex items-center gap-1">
                    <Menu className="h-5 w-5" />
                    <div className="bg-primary text-white rounded-full p-1">
                      <User className="h-4 w-4" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60 mt-2">
                  <DropdownMenuItem asChild>
                    <Link href="/assessment" className="cursor-pointer font-semibold text-[#ff5a5f]">Find Your Care Level</Link>
                  </DropdownMenuItem>
                  <hr className="my-1" />
                  <DropdownMenuItem asChild>
                    <Link href="/greater-cleveland" className="cursor-pointer">Browse Communities</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/resources" className="cursor-pointer">Resources & Guides</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/blog" className="cursor-pointer">Blog & Advice</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/compare" className="cursor-pointer">Compare Communities</Link>
                  </DropdownMenuItem>
                  <hr className="my-1" />
                  <DropdownMenuItem asChild>
                    <Link href="/about" className="cursor-pointer">About Us</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/contact" className="cursor-pointer">Contact Us</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center md:hidden gap-3">
            {/* Mobile Menu - Only render after mount */}
            {isMounted && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="rounded-full border border-gray-200 p-1.5 flex items-center gap-1"
                    type="button"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] sm:w-[350px] pt-12">
                  <SheetHeader className="mb-6">
                    <SheetTitle className="flex items-center">
                      <Home className="h-5 w-5 text-primary mr-2" />
                      Guide for Seniors
                    </SheetTitle>
                  </SheetHeader>

                  <nav className="flex flex-col gap-1">
                    <Link href="/" className="py-3 px-2 hover:bg-gray-50 rounded-md">
                      Home
                    </Link>
                    <Link href="/assessment" className="py-3 px-2 bg-orange-50 hover:bg-orange-100 rounded-md font-semibold text-[#ff5a5f] border border-[#ff5a5f]">
                      Find Your Care Level ✨
                    </Link>
                    <hr className="my-2" />
                    <Link href="/greater-cleveland" className="py-3 px-2 hover:bg-gray-50 rounded-md">
                      Browse Communities
                    </Link>
                    <Link href="/resources" className="py-3 px-2 hover:bg-gray-50 rounded-md">
                      Resources & Guides
                    </Link>
                    <Link href="/blog" className="py-3 px-2 hover:bg-gray-50 rounded-md">
                      Blog & Advice
                    </Link>
                    <Link href="/about" className="py-3 px-2 hover:bg-gray-50 rounded-md">
                      About Us
                    </Link>
                    <Link href="/contact" className="py-3 px-2 hover:bg-gray-50 rounded-md">
                      Contact Us
                    </Link>
                    <hr className="my-2" />
                    <Link href="/compare" className="py-3 px-2 hover:bg-gray-50 rounded-md">
                      Compare Communities
                    </Link>
                  </nav>

                  <div className="absolute bottom-6 left-6 right-6">
                    <Link href="/contact" className="w-full">
                      <Button className="w-full">Get Help Finding Care</Button>
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 py-3 border-t border-gray-100 bg-white">
        <form
          className="flex items-center w-full px-3 py-2.5 bg-white rounded-full border border-gray-200"
          onSubmit={handleSearchSubmit}
        >
          <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search senior living"
            className="flex-1 ml-2 bg-transparent border-none outline-none text-sm"
            aria-label="Search for senior living facilities on mobile"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Button
            type="submit"
            size="sm"
            variant="ghost"
            className="p-1"
          >
            <Search className="h-4 w-4 text-primary" />
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Header;
