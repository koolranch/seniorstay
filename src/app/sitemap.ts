import { communities } from '@/lib/data/communities';
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://seniorstay.com';
  
  // Generate community URLs
  const communityUrls = communities.map((community) => ({
    url: `${baseUrl}/community/${community.state.toLowerCase()}/${community.city.toLowerCase()}/${community.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Add static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/community`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    // Add other static pages here
  ];

  return [...staticPages, ...communityUrls];
} 