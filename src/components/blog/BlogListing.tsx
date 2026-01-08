'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Search, Tag, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import type { BlogPost } from '@/lib/blog-posts';
import { getCategoryCounts, getParentCategoryName } from '@/data/blog-categories';

interface BlogListingProps {
  posts: BlogPost[];
}

const POSTS_PER_PAGE = 12;

export default function BlogListing({ posts }: BlogListingProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Get category counts using the consolidated parent categories
  const categoryCounts = useMemo(() => getCategoryCounts(posts), [posts]);

  // Filter posts by parent category and search
  const filteredPosts = useMemo(() => {
    return posts
      .filter((post) => {
        const parentCategory = getParentCategoryName(post.category);
        const matchesCategory = selectedCategory === 'All' || parentCategory === selectedCategory;
        const matchesSearch =
          searchQuery === '' ||
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [posts, searchQuery, selectedCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
  
  // Featured post (most recent)
  const featuredPost = filteredPosts[0];
  const remainingPosts = paginatedPosts.slice(currentPage === 1 ? 1 : 0);

  // Reset to page 1 when filters change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <>
      {/* Search and Filters */}
      <div className="bg-white py-6 border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Search */}
            <div className="relative mb-5">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-slate-50"
              />
            </div>

            {/* Category Filters with Counts */}
            <div className="flex flex-wrap gap-2">
              {categoryCounts.map(({ name, count }) => (
                <button
                  key={name}
                  onClick={() => handleCategoryChange(name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === name
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {name}
                  <span className={`ml-1.5 ${selectedCategory === name ? 'text-teal-200' : 'text-slate-400'}`}>
                    ({count})
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="bg-slate-50 py-3 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <p className="text-sm text-slate-600">
              Showing {filteredPosts.length === 0 ? 0 : startIndex + 1}–{Math.min(endIndex, filteredPosts.length)} of{' '}
              <strong>{filteredPosts.length}</strong> articles
              {selectedCategory !== 'All' && (
                <span> in <strong>{selectedCategory}</strong></span>
              )}
              {searchQuery && (
                <span> matching &quot;<strong>{searchQuery}</strong>&quot;</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No articles found</h3>
                <p className="text-slate-600 mb-6">Try adjusting your search or filter to find what you&apos;re looking for.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="text-teal-600 font-medium hover:text-teal-700"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                {/* Featured Post (only on first page) */}
                {currentPage === 1 && featuredPost && (
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="group block mb-10 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all"
                  >
                    <div className="p-8 md:p-10">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                          Latest
                        </span>
                        <span className="text-slate-400 text-sm">
                          {getParentCategoryName(featuredPost.category)}
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 group-hover:text-teal-300 transition-colors leading-tight">
                        {featuredPost.title}
                      </h2>
                      <p className="text-slate-300 text-lg mb-6 line-clamp-2 max-w-3xl">
                        {featuredPost.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(featuredPost.date)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            <span>{featuredPost.readTime}</span>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-2 text-teal-400 font-semibold group-hover:gap-3 transition-all">
                          Read Article
                          <ArrowRight className="h-5 w-5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                )}

                {/* Article Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {remainingPosts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all"
                    >
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Tag className="h-4 w-4 text-teal-600" />
                          <span className="text-sm font-medium text-teal-600">
                            {getParentCategoryName(post.category)}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold mb-3 text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2">
                          {post.title}
                        </h3>

                        <p className="text-slate-600 text-sm mb-4 line-clamp-3">{post.description}</p>

                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(post.date)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                      </div>

                      <div className="px-6 pb-5 pt-0">
                        <span className="text-teal-600 font-semibold text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                          Read Article
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        // Show first, last, current, and adjacent pages
                        const showPage =
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPage) <= 1;
                        const showEllipsis =
                          (page === 2 && currentPage > 3) ||
                          (page === totalPages - 1 && currentPage < totalPages - 2);

                        if (showEllipsis) {
                          return (
                            <span key={page} className="px-2 text-slate-400">
                              ...
                            </span>
                          );
                        }

                        if (!showPage) return null;

                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                              currentPage === page
                                ? 'bg-teal-600 text-white'
                                : 'text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      aria-label="Next page"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
