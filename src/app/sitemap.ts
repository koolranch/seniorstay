import { MetadataRoute } from 'next';
import { fetchAllBlogPosts } from '@/lib/blog-posts';
import { fetchCommunitiesByRegion } from '@/lib/fetch-community';
import { Community } from '@/data/facilities';
import { getAllRegionSlugs, getRegionCitySlugs, REGIONS } from '@/data/regions';

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
 */
const createCommunitySlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.guideforseniors.com';
  const currentDate = new Date().toISOString();
  
  // Get all region slugs
  const regionSlugs = getAllRegionSlugs();
  
  // Fetch live data from Supabase
  const [blogPosts, ...regionCommunitiesArrays] = await Promise.all([
    fetchAllBlogPosts(),
    ...regionSlugs.map(region => fetchCommunitiesByRegion(region))
  ]);

  // Build region-specific URLs
  const regionEntries: MetadataRoute.Sitemap = [];
  
  regionSlugs.forEach((regionSlug, index) => {
    const communities = regionCommunitiesArrays[index];
    const citySlugs = createCitySlugs(communities);
    
    // Region hub page
    regionEntries.push({
      url: `${baseUrl}/${regionSlug}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    });
    
    // Events hub for region
    regionEntries.push({
      url: `${baseUrl}/${regionSlug}/events`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    });
    
    // City pages for region
    citySlugs.forEach(citySlug => {
      regionEntries.push({
        url: `${baseUrl}/${regionSlug}/${citySlug}`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
    
    // Community detail pages for region
    communities.forEach(community => {
      regionEntries.push({
        url: `${baseUrl}/${regionSlug}/community/${community.id}/${createCommunitySlug(community.name)}`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    });
  });

  // Generate blog post entries
  const blogEntries: MetadataRoute.Sitemap = blogPosts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    // Homepage
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1,
    },
    
    // Static informational pages
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
    
    // Blog posts
    ...blogEntries,
    
    // Legal pages
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
    
    // All region-specific pages (hubs, cities, communities, events)
    ...regionEntries,
  ];
}
