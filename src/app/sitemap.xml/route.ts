import { NextResponse } from 'next/server';
import { communities } from '@/lib/data/staticCommunities';
import { getCityPath, getCommunityPath } from '@/lib/utils/formatSlug';

// Base URL for the site
const BASE_URL = 'https://www.guideforseniors.com';

// Get current date in YYYY-MM-DD format
const getCurrentDate = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

export async function GET() {
  // Start building the XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Add homepage
  xml += `  <url>\n`;
  xml += `    <loc>${BASE_URL}</loc>\n`;
  xml += `    <lastmod>${getCurrentDate()}</lastmod>\n`;
  xml += `    <changefreq>daily</changefreq>\n`;
  xml += `    <priority>1.0</priority>\n`;
  xml += `  </url>\n`;

  // Add directory page
  xml += `  <url>\n`;
  xml += `    <loc>${BASE_URL}/community</loc>\n`;
  xml += `    <lastmod>${getCurrentDate()}</lastmod>\n`;
  xml += `    <changefreq>daily</changefreq>\n`;
  xml += `    <priority>0.9</priority>\n`;
  xml += `  </url>\n`;

  // Add Ohio index page
  xml += `  <url>\n`;
  xml += `    <loc>${BASE_URL}/ohio</loc>\n`;
  xml += `    <lastmod>${getCurrentDate()}</lastmod>\n`;
  xml += `    <changefreq>daily</changefreq>\n`;
  xml += `    <priority>0.9</priority>\n`;
  xml += `  </url>\n`;

  // Get unique cities in Ohio with 2+ communities
  const cityGroups = communities
    .filter(community => community.state === "OH")
    .reduce((acc, community) => {
      const city = community.city;
      if (!acc[city]) {
        acc[city] = 0;
      }
      acc[city]++;
      return acc;
    }, {} as Record<string, number>);

  // Add city pages
  Object.entries(cityGroups)
    .filter(([_, count]) => count >= 2)
    .forEach(([city]) => {
      const citySlug = city.toLowerCase().replace(/\s+/g, '-');
      const cityPath = getCityPath("OH", city);
      
      // DEBUG LOGGING for Macedonia
      if (city.toLowerCase() === 'macedonia') {
        console.log(`Sitemap Generation - Macedonia City: ${city}, Path: ${cityPath}`);
      }
      
      xml += `  <url>\n`;
      xml += `    <loc>${BASE_URL}${cityPath}</loc>\n`;
      xml += `    <lastmod>${getCurrentDate()}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    });

  // Add community pages
  communities
    .filter(community => community.state === "OH")
    .forEach(community => {
      const communityPath = getCommunityPath(community.state, community.city, community.name);
      
      xml += `  <url>\n`;
      xml += `    <loc>${BASE_URL}${communityPath}</loc>\n`;
      xml += `    <lastmod>${getCurrentDate()}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `  </url>\n`;
    });

  // Close the XML
  xml += '</urlset>';

  // Return the XML with the correct content type
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
} 