import { NextResponse } from 'next/server';

export async function GET() {
  const robotsTxt = `# Robots.txt for Guide for Seniors
# https://www.guideforseniors.com

# Allow all crawlers
User-agent: *
Allow: /

# Sitemap location
Sitemap: https://www.guideforseniors.com/sitemap.xml

# Crawl-delay (optional, helps prevent server overload)
Crawl-delay: 1

# Disallow admin or private paths (if any exist)
Disallow: /api/
Disallow: /_next/
Disallow: /admin/`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}

