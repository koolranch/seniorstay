"use client";

import React from 'react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  featured: boolean;
}

interface BlogClientProps {
  blogPosts: BlogPost[];
  categories: string[];
  postsByCategory: Record<string, BlogPost[]>;
  sortedCategories: string[];
}

export default function BlogClient({
  blogPosts,
  categories,
  postsByCategory,
  sortedCategories,
}: BlogClientProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
      <div>Blog content will go here.</div>
      <pre>{JSON.stringify({ blogPosts, categories, postsByCategory, sortedCategories }, null, 2)}</pre>
    </div>
  );
} 