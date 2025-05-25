"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Phone, Menu, User, Home, X } from 'lucide-react';
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
          <Link href="/" className="flex-shrink-0">
            <div className="flex items-center">
              <Home className="h-6 w-6 md:h-7 md:w-7 text-primary mr-2" />
              <span className="text-base md:text-lg font-semibold">Guide for Seniors</span>
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
            <Button variant="ghost" className="rounded-full text-sm font-medium">
              For families
            </Button>
            <Button variant="ghost" className="rounded-full text-sm font-medium">
              For providers
            </Button>
            <Button variant="outline" className="flex items-center rounded-full text-sm font-medium gap-2 border-primary text-primary">
              <Phone className="h-4 w-4" />
              1-888-SENIORS
            </Button>

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
                  <DropdownMenuItem className="font-medium">Sign up</DropdownMenuItem>
                  <DropdownMenuItem>Login</DropdownMenuItem>
                  <hr className="my-1" />
                  <DropdownMenuItem>Saved communities</DropdownMenuItem>
                  <DropdownMenuItem>Resources</DropdownMenuItem>
                  <DropdownMenuItem>Contact us</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center md:hidden gap-3">
            {/* Phone button - Always visible on mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="text-primary rounded-full"
              asChild
            >
              <a href="tel:1888736467" aria-label="Call us">
                <Phone className="h-5 w-5" />
              </a>
            </Button>

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
                    <Link href="#" className="py-3 px-2 hover:bg-gray-50 rounded-md">
                      For families
                    </Link>
                    <Link href="#" className="py-3 px-2 hover:bg-gray-50 rounded-md">
                      For providers
                    </Link>
                    <hr className="my-2" />
                    <Link href="#" className="py-3 px-2 hover:bg-gray-50 rounded-md">
                      Saved communities
                    </Link>
                    <Link href="#" className="py-3 px-2 hover:bg-gray-50 rounded-md">
                      Resources
                    </Link>
                    <Link href="#" className="py-3 px-2 hover:bg-gray-50 rounded-md">
                      Contact us
                    </Link>
                    <hr className="my-2" />
                    <Button className="mt-4 w-full">Sign up</Button>
                    <Button variant="outline" className="mt-2 w-full">Login</Button>
                  </nav>

                  <div className="absolute bottom-6 left-6 right-6">
                    <a href="tel:1888736467" className="flex items-center justify-center gap-2 text-center py-3 px-4 bg-primary/10 text-primary rounded-md font-medium">
                      <Phone className="h-4 w-4" />
                      1-888-SENIORS
                    </a>
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
