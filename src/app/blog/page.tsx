"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowLeft, FiSearch, FiCalendar, FiClock, FiArrowRight } from 'react-icons/fi';

// Mock blog post data
const blogPosts = [
  {
    id: 1,
    title: "Understanding the Different Types of Senior Living Communities",
    excerpt: "Explore the various senior living options available, from independent living to memory care, and find the right fit for your loved one.",
    image: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?q=80&w=2070&auto=format&fit=crop",
    category: "Guides",
    date: "March 15, 2025",
    readTime: "8 min read",
    featured: true
  },
  {
    id: 2,
    title: "Financial Planning for Senior Living: What You Need to Know",
    excerpt: "Learn about the costs associated with senior living communities and strategies to help finance the care your loved one needs.",
    image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?q=80&w=2070&auto=format&fit=crop",
    category: "Financial",
    date: "March 10, 2025",
    readTime: "6 min read",
    featured: false
  },
  {
    id: 3,
    title: "How to Have the Conversation About Moving to a Senior Community",
    excerpt: "Tips and strategies for discussing senior living options with your loved ones in a compassionate and effective way.",
    image: "https://images.unsplash.com/photo-1573497491208-6b1acb260507?q=80&w=2070&auto=format&fit=crop",
    category: "Family Resources",
    date: "March 5, 2025",
    readTime: "5 min read",
    featured: false
  },
  {
    id: 4,
    title: "The Benefits of Social Activities for Seniors' Mental Health",
    excerpt: "Discover how social engagement and community activities can significantly improve quality of life for seniors.",
    image: "https://images.unsplash.com/photo-1566473965997-3de9c817e938?q=80&w=2070&auto=format&fit=crop",
    category: "Wellness",
    date: "February 28, 2025",
    readTime: "7 min read",
    featured: false
  },
  {
    id: 5,
    title: "Designing Senior-Friendly Living Spaces: Key Considerations",
    excerpt: "Learn about important design elements that create safe, accessible, and comfortable environments for seniors.",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=2070&auto=format&fit=crop",
    category: "Lifestyle",
    date: "February 20, 2025",
    readTime: "9 min read",
    featured: false
  },
  {
    id: 6,
    title: "Nutrition and Dietary Needs for Seniors: A Comprehensive Guide",
    excerpt: "Understanding the unique nutritional requirements of older adults and how senior living communities address these needs.",
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=2070&auto=format&fit=crop",
    category: "Health",
    date: "February 15, 2025",
    readTime: "10 min read",
    featured: false
  }
];

// Blog categories
const categories = [
  "All",
  "Guides",
  "Financial",
  "Health",
  "Wellness",
  "Family Resources",
  "Lifestyle"
];

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter posts based on active category and search query
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && (searchQuery === "" || matchesSearch);
  });

  // Featured post is the first post marked as featured
  const featuredPost = blogPosts.find(post => post.featured);

  return (
    <div className="min-h-screen bg-[#FAFAF5]">
      {/* Header */}
      <div className="bg-[#1b4d70] text-white">
        <div className="container mx-auto px-6 md:px-10 lg:px-20 py-12 md:py-20">
          <Link
            href="/"
            className="inline-flex items-center text-white mb-6 hover:text-[#F5A623] transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Senior Living Resources</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Helpful guides, tips, and information to support you and your loved ones in the senior living journey.
          </p>
        </div>
      </div>

      {/* Search and filter bar */}
      <div className="sticky top-[73px] bg-white z-20 border-b border-[#A7C4A0] py-4">
        <div className="container mx-auto px-6 md:px-10 lg:px-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            {/* Search bar */}
            <div className="relative w-full md:w-auto md:min-w-[300px]">
              <div className="flex items-center border border-[#A7C4A0] rounded-lg bg-white px-3 py-2">
                <FiSearch className="text-[#1b4d70] mr-2" />
                <input
                  type="text"
                  className="bg-transparent w-full outline-none"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Categories */}
            <div className="flex overflow-x-auto hide-scrollbar space-x-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 whitespace-nowrap rounded-full text-sm font-medium ${
                    activeCategory === category
                      ? "bg-[#1b4d70] text-white"
                      : "bg-[#f1f6f0] text-[#1b4d70] hover:bg-[#A7C4A0]/20"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-10 lg:px-20 py-12">
        {/* Featured post */}
        {featuredPost && activeCategory === "All" && searchQuery === "" && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-6">Featured Article</h2>
            <div className="bg-white rounded-xl overflow-hidden shadow-md">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/2 relative h-60 lg:h-auto">
                  <Image
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="lg:w-1/2 p-6 md:p-8">
                  <div className="flex items-center mb-3">
                    <span className="bg-[#1b4d70] text-white text-xs font-medium rounded-full px-3 py-1">
                      {featuredPost.category}
                    </span>
                    <div className="flex items-center text-[#666666] text-sm ml-3">
                      <FiCalendar className="mr-1" size={14} />
                      <span>{featuredPost.date}</span>
                    </div>
                    <div className="flex items-center text-[#666666] text-sm ml-3">
                      <FiClock className="mr-1" size={14} />
                      <span>{featuredPost.readTime}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-[#1b4d70]">{featuredPost.title}</h3>
                  <p className="text-[#333333] mb-6">{featuredPost.excerpt}</p>
                  <Link
                    href={`/blog/${featuredPost.id}`}
                    className="inline-flex items-center text-[#1b4d70] font-medium hover:text-[#F5A623] transition-colors"
                  >
                    Read Full Article
                    <FiArrowRight className="ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All posts */}
        <div>
          <h2 className="text-2xl font-semibold text-[#1b4d70] mb-6">
            {activeCategory === "All" ? "Recent Articles" : `${activeCategory} Articles`}
          </h2>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-[#A7C4A0]">
              <h3 className="text-xl font-medium text-[#1b4d70] mb-2">No articles found</h3>
              <p className="text-[#333333] mb-4">We couldn't find any articles matching your criteria.</p>
              <button
                onClick={() => {
                  setActiveCategory("All");
                  setSearchQuery("");
                }}
                className="px-6 py-2 bg-[#1b4d70] text-white rounded-md hover:bg-[#2F5061] transition-colors"
              >
                Show all articles
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.id}`}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center mb-3">
                      <span className="bg-[#f1f6f0] text-[#1b4d70] text-xs font-medium rounded-full px-3 py-1">
                        {post.category}
                      </span>
                      <div className="flex items-center text-[#666666] text-xs ml-3">
                        <FiClock className="mr-1" size={12} />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-[#1b4d70] line-clamp-2">{post.title}</h3>
                    <p className="text-sm text-[#333333] mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center text-[#666666] text-xs">
                      <FiCalendar className="mr-1" size={12} />
                      <span>{post.date}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Newsletter signup */}
        <div className="mt-16 bg-[#1b4d70] rounded-xl p-8 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-semibold mb-4">Stay Updated with Senior Living Resources</h3>
            <p className="text-white/80 mb-6">
              Join our newsletter to receive the latest articles, tips, and resources for navigating senior living.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-md text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#F5A623]"
              />
              <button className="bg-[#F5A623] text-[#1b4d70] font-medium px-6 py-3 rounded-md hover:bg-[#FFC65C] transition-colors">
                Subscribe
              </button>
            </div>
            <p className="text-xs text-white/60 mt-4">
              By subscribing, you agree to our privacy policy. We'll never share your information.
            </p>
          </div>
        </div>
      </div>

      {/* Custom styles for the scrollbar */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default BlogPage;
