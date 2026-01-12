import { Metadata } from 'next';
import { fetchBlogPostBySlug, isRegionalPost, getPostRegionDisplayName } from '@/lib/blog-posts';

/**
 * Regional Blog SEO Enhancement
 * ============================================================================
 * Cleveland-specific posts (region_slug = 'cleveland') get enhanced metadata:
 * - Local keywords injected: "Cleveland senior care", "Northeast Ohio", etc.
 * - Regional suffix in title
 * - Enhanced description with geographic context
 * ============================================================================
 */

// Regional keyword mappings for SEO
const REGIONAL_KEYWORDS: Record<string, string[]> = {
  'cleveland': [
    'Cleveland senior care',
    'Northeast Ohio senior living',
    'Cuyahoga County assisted living',
    'Greater Cleveland memory care',
  ],
  'columbus': [
    'Columbus senior care',
    'Central Ohio senior living',
    'Franklin County assisted living',
    'Greater Columbus memory care',
  ],
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await fetchBlogPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Article Not Found | Guide for Seniors',
      description: 'The article you are looking for could not be found.',
    };
  }

  const canonicalUrl = `/blog/${params.slug}`;
  const baseUrl = 'https://www.guideforseniors.com';
  
  // Check if this is a regional post
  const isRegional = isRegionalPost(post);
  const regionDisplayName = getPostRegionDisplayName(post);
  const regionSlug = post.regionSlug || '';
  
  // Build enhanced title for regional posts
  let title = post.title;
  if (isRegional && regionDisplayName) {
    // Only add regional suffix if not already in title
    if (!title.toLowerCase().includes('cleveland') && !title.toLowerCase().includes('ohio')) {
      title = `${post.title} | ${regionDisplayName}`;
    }
  }
  title = `${title} | Guide for Seniors`;
  
  // Build enhanced description for regional posts
  let description = post.description;
  if (isRegional && regionDisplayName) {
    // Add regional context if not already present
    if (!description.toLowerCase().includes('cleveland') && !description.toLowerCase().includes('ohio')) {
      description = `${post.description} Expert guidance for ${regionDisplayName} families.`;
    }
  }
  
  // Build keywords array
  const categoryKeywords = [post.category.toLowerCase(), 'senior living', 'assisted living', 'memory care'];
  const regionalKeywords = isRegional && regionSlug ? (REGIONAL_KEYWORDS[regionSlug] || []) : [];
  const allKeywords = [...categoryKeywords, ...regionalKeywords].join(', ');
  
  // Build tags for OpenGraph
  const ogTags = [post.category];
  if (isRegional && regionDisplayName) {
    ogTags.push(regionDisplayName);
    ogTags.push('Local Expert Advice');
  }

  return {
    title,
    description,
    keywords: allKeywords,
    alternates: {
      canonical: `${baseUrl}${canonicalUrl}`,
    },
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: ogTags,
      url: `${baseUrl}${canonicalUrl}`,
      siteName: 'Guide for Seniors',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
    },
    // Additional metadata for regional posts
    ...(isRegional && regionDisplayName ? {
      other: {
        'geo.region': 'US-OH',
        'geo.placename': regionDisplayName,
      },
    } : {}),
  };
}

