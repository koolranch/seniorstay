'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Search, Tag } from 'lucide-react';
import type { BlogPost } from '@/lib/blog-posts';

interface BlogListingProps {
  posts: BlogPost[];
}

export default function BlogListing({ posts }: BlogListingProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = useMemo(() => {
    const unique = new Set<string>();
    posts.forEach((post) => {
      if (post.category) {
        unique.add(post.category);
      }
    });
    return ['All', ...Array.from(unique).sort()];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts
      .filter((post) => {
        const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
        const matchesSearch =
          searchQuery === '' ||
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [posts, searchQuery, selectedCategory]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <>
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Senior Living Advice &amp; Insights
            </h1>
            <p className="text-xl text-gray-700 mb-4">
              Expert tips, practical advice, and helpful guidance for Cleveland families
            </p>
            <p className="text-gray-600">
              Stay informed with the latest information about senior care, memory support, and choosing the
              right community
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white py-8 border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">No articles found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="p-6 pb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Tag className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary">{post.category}</span>
                      </div>

                      <h2 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h2>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.description}</p>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
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

                    <div className="px-6 pb-6">
                      <span className="text-primary font-semibold text-sm group-hover:underline">
                        Read Article →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

