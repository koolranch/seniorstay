"use client";

import React from 'react';
import BlogClient from './BlogClient';

// Sample blog posts data - replace with your actual data source
const blogPosts = [
  {
    id: 1,
    title: "The Importance of Community Involvement for Seniors",
    excerpt: "Discover how staying active in your community can improve your health, happiness, and overall well-being as you age.",
    image: "/blog/community-involvement.jpg",
    category: "Lifestyle",
    date: "March 15, 2024",
    readTime: "5 min read",
    featured: true
  },
  {
    id: 2,
    title: "How to Use a Selfie Stick: A Guide for Seniors",
    excerpt: "Learn the basics of using a selfie stick to capture better photos with your smartphone or camera.",
    image: "/blog/selfie-stick.jpg",
    category: "Technology",
    date: "March 14, 2024",
    readTime: "4 min read",
    featured: false
  },
  {
    id: 3,
    title: "BOSU Ball Exercises for Seniors",
    excerpt: "Improve your balance and core strength with these senior-friendly BOSU ball exercises.",
    image: "/blog/bosu-ball.jpg",
    category: "Health",
    date: "March 13, 2024",
    readTime: "6 min read",
    featured: false
  }
];

// Get unique categories and sort them
const categories = ["All", ...new Set(blogPosts.map(post => post.category))].sort();

// Group posts by category
const postsByCategory = blogPosts.reduce((acc, post) => {
  if (!acc[post.category]) {
    acc[post.category] = [];
  }
  acc[post.category].push(post);
  return acc;
}, {} as Record<string, typeof blogPosts>);

// Sort categories by post count (excluding "All")
const sortedCategories = categories
  .filter(category => category !== "All")
  .sort((a, b) => (postsByCategory[b]?.length || 0) - (postsByCategory[a]?.length || 0));

export default function BlogPage() {
  return (
    <BlogClient
      blogPosts={blogPosts}
      categories={categories}
      postsByCategory={postsByCategory}
      sortedCategories={sortedCategories}
    />
  );
}
