import { MetadataRoute } from 'next';
import { fetchAllBlogPosts } from '@/lib/blog-posts';
import { fetchAllCommunities } from '@/lib/fetch-community';
import { Community } from '@/data/facilities';

type SitemapEntry = {
  url: string;
  lastModified?: Date | string;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
};

// Extract unique cities from communities data
const getUniqueCities = (communities: Community[]): string[] => {
  const cities = communities.map(community => {
    return community.location.split(',')[0].trim();
  });

  return Array.from(new Set(cities));
};

// Create slugs for all cities
const createCitySlugs = (communities: Community[]): string[] => {
  const cities = getUniqueCities(communities);
  return cities.map(city => city.toLowerCase().replace(/\s+/g, '-'));
};

/**
 * Generate a clean, SEO-friendly slug from community name
 * Example: "Danbury Senior Living - Brunswick" → "danbury-senior-living-brunswick"
 * 
 * URL Structure: /community/{uuid}/{slug}
 * - UUID ensures unique identification in backend
 * - Slug provides clean, readable URL for Google
 */
const createCommunitySlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-')          // Replace spaces with hyphens
    .replace(/-+/g, '-')           // Remove consecutive hyphens
    .trim();
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.guideforseniors.com';
  const currentDate = new Date().toISOString();
  
  // Fetch live data from Supabase
  const [blogPosts, communityData] = await Promise.all([
    fetchAllBlogPosts(),
    fetchAllCommunities()
  ]);

  // Generate blog post entries
  const blogEntries: MetadataRoute.Sitemap = blogPosts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/greater-cleveland`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/assisted-living-cleveland`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/memory-care-cleveland`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/senior-living-costs-cleveland`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/choosing-senior-living`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...blogEntries,
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // Community detail pages
    ...communityData.map(community => ({
      url: `${baseUrl}/community/${community.id}/${createCommunitySlug(community.name)}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    // Location/city pages (generated from live Supabase data)
    ...createCitySlugs(communityData).map(citySlug => ({
      url: `${baseUrl}/location/${citySlug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
