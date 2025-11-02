import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/', '/admin/'],
    },
    sitemap: 'https://www.guideforseniors.com/sitemap.xml',
    // TESTING: If you see this comment in robots.txt, the file is being used
  }
}

