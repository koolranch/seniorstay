import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma'; // Replace Supabase import with Prisma import

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const baseUrl = 'https://www.guideforseniors.com'; // Replace with your actual domain if different
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

  const staticPaths = [
    '', // Homepage
    'how-it-works',
    'our-mission',
    'privacy-policy',
    'terms-of-service',
    'list-your-community',
    'provider-resources',
    'community-guidelines',
    'family-resources',
    'caregiver-support',
    'senior-living-guide',
    'testimonials',
    'success-stories',
    'help-center',
    'faq',
    'contact-a-care-advisor',
    'accessibility',
    'sitemap' // HTML Sitemap
  ];

  const staticUrls = staticPaths
    .map((path) => {
      const priority = path === '' ? '1.0' : '0.7';
      return `
    <url>
      <loc>${baseUrl}/${path}</loc>
      <lastmod>${today}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>${priority}</priority>
    </url>
  `;
    })
    .join('');

  let dynamicUrls = '';
  try {
    // Fetch communities using Prisma instead of Supabase
    const communities = await prisma.community.findMany({
      select: {
        slug: true,
        updatedAt: true, // Use updatedAt from Prisma schema
      }
    });

    dynamicUrls = communities
      .map(({ slug, updatedAt }) => {
        // Ensure slug exists before creating the URL
        if (!slug) return null;
        const lastModDate = updatedAt ? updatedAt.toISOString().split('T')[0] : today;
        return `
    <url>
      <loc>${baseUrl}/senior-living/${slug}</loc>
      <lastmod>${lastModDate}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>
  `;
      })
      .filter(Boolean) // Remove any null entries from map
      .join('');

  } catch (error) {
    console.error('Error fetching dynamic URLs for sitemap:', error);
    // Optionally return a 500 error or just generate sitemap with static URLs
    // dynamicUrls remains '' in case of error
  }

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticUrls}
      ${dynamicUrls}
    </urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  // Add Cache-Control header for CDN/browser caching (e.g., 1 day)
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
  res.status(200).send(sitemapXml);
} 