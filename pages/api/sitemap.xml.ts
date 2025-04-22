import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from 'src/lib/supabase'; // Adjusted import path again

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
    // Fetch only the slug column from the communities table
    const { data: communities, error } = await supabase
      .from('communities') // Adjust table name if needed
      .select('slug, updated_at'); // Fetch slug and optionally updated_at for lastmod

    if (error) {
      throw error; // Throw error to be caught below
    }

    dynamicUrls = communities
      ?.map(({ slug, updated_at }: { slug: any; updated_at: any }) => { // Added types
        // Ensure slug exists before creating the URL
        if (!slug) return null;
        const lastModDate = updated_at ? new Date(updated_at).toISOString().split('T')[0] : today;
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
      .join('') || '';

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