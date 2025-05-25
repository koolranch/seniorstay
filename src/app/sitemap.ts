import { MetadataRoute } from 'next';
import { communityData } from '@/data/facilities';

type SitemapEntry = {
  url: string;
  lastModified?: Date | string;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
};

// Extract unique cities from communities data
const getUniqueCities = (): string[] => {
  const cities = communityData.map(community => {
    return community.location.split(',')[0].trim();
  });

  return Array.from(new Set(cities));
};

// Create slugs for all cities
const createCitySlugs = (): string[] => {
  const cities = getUniqueCities();
  return cities.map(city => city.toLowerCase().replace(/\s+/g, '-'));
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://guideforseniors.com';
  const citySlugs = createCitySlugs();

  // Basic pages
  const routes: SitemapEntry[] = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  // Add city pages
  for (const citySlug of citySlugs) {
    routes.push({
      url: `${baseUrl}/location/${citySlug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  // Add individual community pages
  for (const community of communityData) {
    const communitySlug = community.name.toLowerCase().replace(/\s+/g, '-');
    routes.push({
      url: `${baseUrl}/community/${community.id}/${communitySlug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  return routes;
}
