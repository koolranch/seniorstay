import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';
import { fetchAllBlogPosts } from '@/lib/blog-posts';
import { fetchCommunitiesByRegion } from '@/lib/fetch-community';
import { Community } from '@/data/facilities';
import { getAllRegionSlugs, getRegionCitySlugs, REGIONS } from '@/data/regions';
import { SeniorEvent } from '@/types/events';

// Supabase client for events and sitemap queries
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hncgnxbooghjhpncujzx.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuY2dueGJvb2doamhwbmN1anp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMTI0ODIsImV4cCI6MjA1OTc4ODQ4Mn0.mdAL87W0h4PN7Xu8ESjjDxzjW_H3YH55i-FqAE5SXcs';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * SEO FIX: Fetch only sitemap-eligible blog posts
 * Filters out: draft posts, noindex posts, and explicitly excluded posts
 */
async function fetchSitemapEligibleBlogPosts(): Promise<{ slug: string; published_at: string; updated_at: string }[]> {
  try {
    // Use the sitemap_eligible_blog_posts view for optimized query
    const { data, error } = await supabase
      .from('sitemap_eligible_blog_posts')
      .select('slug, published_at, updated_at')
      .order('published_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching sitemap-eligible blog posts:', error);
      // Fallback to regular query with filters
      const { data: fallbackData } = await supabase
        .from('blog_posts')
        .select('slug, published_at, updated_at')
        .eq('status', 'published')
        .eq('exclude_from_sitemap', false)
        .order('published_at', { ascending: false });
      return fallbackData || [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchSitemapEligibleBlogPosts:', error);
    return [];
  }
}

/**
 * SEO FIX: Fetch only sitemap-eligible communities for a region
 * Filters out: unpublished, noindex, incomplete profiles (missing description or images)
 */
async function fetchSitemapEligibleCommunities(regionSlug: string): Promise<Community[]> {
  try {
    // Use the sitemap_eligible_communities view for optimized query
    const { data, error } = await supabase
      .from('sitemap_eligible_communities')
      .select('*')
      .eq('region_slug', regionSlug)
      .order('name');
    
    if (error) {
      console.error(`Error fetching sitemap-eligible communities for ${regionSlug}:`, error);
      // Fallback: fetch all and filter in code
      const allCommunities = await fetchCommunitiesByRegion(regionSlug);
      return allCommunities.filter(community => {
        // Apply same noindex logic as the page metadata
        const hasDescription = community.description && community.description.trim().length > 50;
        const communityImage = community.images?.[0] || '';
        const hasPlaceholderImage = !communityImage || 
          communityImage.toLowerCase().includes('placeholder') ||
          communityImage.toLowerCase().includes('no-image') ||
          communityImage.toLowerCase().includes('default-community');
        const isComplete = hasDescription && !hasPlaceholderImage;
        return isComplete;
      });
    }
    
    // Transform to Community interface
    return (data || []).map(row => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      location: `${row.city}, OH`,
      images: row.image_urls?.length > 0 ? row.image_urls : (row.image_url ? [row.image_url] : []),
      careTypes: [],
      description: row.description,
      regionSlug: row.region_slug,
    })) as Community[];
  } catch (error) {
    console.error(`Error in fetchSitemapEligibleCommunities for ${regionSlug}:`, error);
    return [];
  }
}

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

/**
 * Generate URL-friendly slug from event title
 */
const createEventSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
};

/**
 * Fetch events by region from Supabase
 */
async function fetchEventsByRegion(regionSlug: string): Promise<SeniorEvent[]> {
  try {
    const { data: events, error } = await supabase
      .from('senior_events')
      .select('*')
      .eq('region_slug', regionSlug)
      .gte('start_date', new Date().toISOString())
      .order('start_date', { ascending: true });
    
    if (error) {
      console.error(`Error fetching events for ${regionSlug}:`, error);
      return [];
    }
    
    return (events as SeniorEvent[]) || [];
  } catch (error) {
    console.error(`Error fetching events for ${regionSlug}:`, error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.guideforseniors.com';
  const currentDate = new Date().toISOString();
  
  // Get all region slugs
  const regionSlugs = getAllRegionSlugs();
  
  // SEO FIX: Fetch ONLY sitemap-eligible content (no noindex pages)
  // This resolves the "Noindex page in sitemap" conflicts from Ahrefs
  const [sitemapBlogPosts, ...regionDataArrays] = await Promise.all([
    fetchSitemapEligibleBlogPosts(),
    ...regionSlugs.flatMap(region => [
      fetchSitemapEligibleCommunities(region),
      fetchEventsByRegion(region)
    ])
  ]);
  
  // Separate communities and events arrays (they alternate in the results)
  const regionCommunitiesArrays: Community[][] = [];
  const regionEventsArrays: SeniorEvent[][] = [];
  
  for (let i = 0; i < regionDataArrays.length; i++) {
    if (i % 2 === 0) {
      regionCommunitiesArrays.push(regionDataArrays[i] as Community[]);
    } else {
      regionEventsArrays.push(regionDataArrays[i] as SeniorEvent[]);
    }
  }

  // Build region-specific URLs
  const regionEntries: MetadataRoute.Sitemap = [];
  
  regionSlugs.forEach((regionSlug, index) => {
    const communities = regionCommunitiesArrays[index];
    const events = regionEventsArrays[index] || [];
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
    
    // Individual event pages for region
    events.forEach(event => {
      const eventSlug = createEventSlug(event.title);
      regionEntries.push({
        url: `${baseUrl}/${regionSlug}/events/${eventSlug}`,
        lastModified: event.updated_at || currentDate,
        changeFrequency: 'weekly',
        priority: 0.6,
      });
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

  // Generate blog post entries (ONLY sitemap-eligible posts)
  const blogEntries: MetadataRoute.Sitemap = sitemapBlogPosts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updated_at || post.published_at,
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
