"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowLeft, FiSearch, FiCalendar, FiClock, FiArrowRight } from 'react-icons/fi';

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

export default function BlogClient() {
  return <div>Blog content will go here.</div>;
} 