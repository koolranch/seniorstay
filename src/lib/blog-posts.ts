import { cache } from 'react';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  image?: string | null;
  content: string;
  regionSlug?: string | null; // null = global, 'cleveland' = Cleveland-specific
}

type BlogPostRow = {
  slug: string;
  title: string;
  description: string;
  category: string;
  author: string;
  published_at: string;
  read_time_minutes: number;
  image_url: string | null;
  content_markdown: string;
  region_slug: string | null;
};

/**
 * REGIONAL BLOG CONTENT LOGIC
 * ============================================================================
 * - Global Posts (region_slug = NULL): Created ON or BEFORE May 13, 2025
 *   These appear on ALL regional hubs and the main blog index.
 * 
 * - Regional Posts (region_slug = 'cleveland'): Created AFTER May 13, 2025
 *   These appear on their specific regional hub AND the main blog index.
 * ============================================================================
 */

// Hardcode Supabase configuration for blog posts
const supabaseUrl = 'https://hncgnxbooghjhpncujzx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuY2dueGJvb2doamhwbmN1anp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMTI0ODIsImV4cCI6MjA1OTc4ODQ4Mn0.mdAL87W0h4PN7Xu8ESjjDxzjW_H3YH55i-FqAE5SXcs';

let supabase: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (supabase) {
    return supabase;
  }

  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabase;
}

function mapRowToBlogPost(row: BlogPostRow): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    category: row.category,
    author: row.author,
    date: row.published_at,
    readTime: `${row.read_time_minutes} min read`,
    image: row.image_url,
    content: row.content_markdown,
    regionSlug: row.region_slug,
  };
}

export const fetchAllBlogPosts = cache(async (): Promise<BlogPost[]> => {
  const client = getSupabaseClient();
  if (!client) {
    return [];
  }

  const { data, error } = await client
    .from('blog_posts')
    .select('*')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Failed to load blog posts from Supabase:', error);
    return [];
  }

  return ((data ?? []) as BlogPostRow[]).map(mapRowToBlogPost);
});

export const fetchBlogPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  const client = getSupabaseClient();
  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error(`Failed to load blog post (${slug}) from Supabase:`, error);
    return null;
  }

  return data ? mapRowToBlogPost(data as BlogPostRow) : null;
});

export const fetchRecentBlogPosts = cache(async (limit = 3): Promise<BlogPost[]> => {
  const posts = await fetchAllBlogPosts();
  return posts.slice(0, limit);
});

/**
 * Fetch related blog posts based on category matching
 * Prioritizes posts from the same category, then fills with recent posts
 * Excludes the current post from results
 */
export const fetchRelatedBlogPosts = cache(async (
  currentSlug: string,
  currentCategory: string,
  limit = 3
): Promise<BlogPost[]> => {
  const allPosts = await fetchAllBlogPosts();
  
  // Exclude the current post
  const otherPosts = allPosts.filter(p => p.slug !== currentSlug);
  
  // Normalize category for matching (handle inconsistent casing/naming)
  const normalizeCategory = (cat: string) => cat.toLowerCase().trim();
  const normalizedCurrentCategory = normalizeCategory(currentCategory);
  
  // Find posts in the same category
  const sameCategoryPosts = otherPosts.filter(
    p => normalizeCategory(p.category) === normalizedCurrentCategory
  );
  
  // If we have enough category matches, return them
  if (sameCategoryPosts.length >= limit) {
    return sameCategoryPosts.slice(0, limit);
  }
  
  // Otherwise, supplement with related topic posts
  // Group related categories for better matching
  const categoryGroups: Record<string, string[]> = {
    'cost': ['cost', 'price', 'affordable', 'budget', 'expense', 'payment'],
    'memory-care': ['memory', 'alzheimer', 'dementia', 'cognitive'],
    'assisted-living': ['assisted living', 'senior living', 'retirement'],
    'health': ['health', 'wellness', 'medical', 'care'],
    'lifestyle': ['lifestyle', 'relationships', 'dating', 'social'],
    'location': ['cleveland', 'ohio', 'parma', 'lakewood', 'westlake'],
  };
  
  // Find which group the current category belongs to
  let relatedPosts: BlogPost[] = [];
  for (const [group, keywords] of Object.entries(categoryGroups)) {
    if (keywords.some(kw => normalizedCurrentCategory.includes(kw))) {
      relatedPosts = otherPosts.filter(p => 
        p.slug !== currentSlug && 
        !sameCategoryPosts.includes(p) &&
        keywords.some(kw => normalizeCategory(p.category).includes(kw) || p.title.toLowerCase().includes(kw))
      );
      break;
    }
  }
  
  // Combine: same category first, then related, then fill with recent
  const combined = [
    ...sameCategoryPosts,
    ...relatedPosts.filter(p => !sameCategoryPosts.includes(p)),
    ...otherPosts.filter(p => !sameCategoryPosts.includes(p) && !relatedPosts.includes(p))
  ];
  
  return combined.slice(0, limit);
});

export const fetchBlogCategories = cache(async (): Promise<string[]> => {
  const posts = await fetchAllBlogPosts();
  const categories = new Set<string>();

  posts.forEach((post) => {
    if (post.category) {
      categories.add(post.category);
    }
  });

  return Array.from(categories).sort();
});

/**
 * Fetch posts for a specific region + all global posts
 * Returns: Regional posts (matching region_slug) + Global posts (region_slug = NULL)
 * 
 * Use case: Regional hub pages like /cleveland that want to show
 * both local content AND universally relevant articles.
 */
export const fetchPostsByRegion = cache(async (regionSlug: string, limit?: number): Promise<BlogPost[]> => {
  const client = getSupabaseClient();
  if (!client) {
    return [];
  }

  // Fetch posts where region matches OR region is NULL (global)
  const { data, error } = await client
    .from('blog_posts')
    .select('*')
    .or(`region_slug.eq.${regionSlug},region_slug.is.null`)
    .order('published_at', { ascending: false });

  if (error) {
    console.error(`Failed to load blog posts for region ${regionSlug}:`, error);
    return [];
  }

  const posts = ((data ?? []) as BlogPostRow[]).map(mapRowToBlogPost);
  return limit ? posts.slice(0, limit) : posts;
});

/**
 * Fetch ONLY region-specific posts (excludes global posts)
 * Returns: Posts where region_slug matches exactly
 * 
 * Use case: "Local Expert Advice" sections that should ONLY show
 * hyper-local Cleveland content, not generic senior living articles.
 */
export const fetchRegionalOnlyPosts = cache(async (regionSlug: string, limit?: number): Promise<BlogPost[]> => {
  const client = getSupabaseClient();
  if (!client) {
    return [];
  }

  let query = client
    .from('blog_posts')
    .select('*')
    .eq('region_slug', regionSlug)
    .order('published_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error(`Failed to load regional posts for ${regionSlug}:`, error);
    return [];
  }

  return ((data ?? []) as BlogPostRow[]).map(mapRowToBlogPost);
});

/**
 * Fetch ONLY global posts (region_slug = NULL)
 * Returns: Posts that are universally relevant across all regions
 */
export const fetchGlobalPosts = cache(async (limit?: number): Promise<BlogPost[]> => {
  const client = getSupabaseClient();
  if (!client) {
    return [];
  }

  let query = client
    .from('blog_posts')
    .select('*')
    .is('region_slug', null)
    .order('published_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Failed to load global posts:', error);
    return [];
  }

  return ((data ?? []) as BlogPostRow[]).map(mapRowToBlogPost);
});

/**
 * Check if a blog post is regional (has a specific region_slug)
 */
export function isRegionalPost(post: BlogPost): boolean {
  return post.regionSlug !== null && post.regionSlug !== undefined;
}

/**
 * Check if a blog post belongs to a specific region
 */
export function postBelongsToRegion(post: BlogPost, regionSlug: string): boolean {
  return post.regionSlug === regionSlug;
}

/**
 * Get the display region name for a post
 */
export function getPostRegionDisplayName(post: BlogPost): string | null {
  if (!post.regionSlug) return null;
  
  const regionNames: Record<string, string> = {
    'cleveland': 'Greater Cleveland',
    'columbus': 'Greater Columbus',
  };
  
  return regionNames[post.regionSlug] || post.regionSlug;
}
