import { MetadataRoute } from 'next';
import { facilityData } from '@/data/facilities';

// Extract unique cities from facilities data
const getUniqueCities = (): string[] => {
  const cities = facilityData.map(facility => {
    return facility.location.split(',')[0].trim();
  });

  return Array.from(new Set(cities));
};

// Create slugs for all cities
const createCitySlugs = (): string[] => {
  const cities = getUniqueCities();
  return cities.map(city => city.toLowerCase().replace(/\s+/g, '-'));
};

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://rayseniorplacement.com';
  const citySlugs = createCitySlugs();

  // Basic pages
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  // Add city pages
  for (const citySlug of citySlugs) {
    routes.push({
      url: `${baseUrl}/location/${citySlug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  // Add individual facility pages
  for (const facility of facilityData) {
    const facilitySlug = facility.name.toLowerCase().replace(/\s+/g, '-');
    routes.push({
      url: `${baseUrl}/facility/${facility.id}/${facilitySlug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }

  return routes;
}
