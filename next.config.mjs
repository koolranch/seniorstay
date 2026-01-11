/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure consistent URLs without trailing slashes
  trailingSlash: false,
  // Force fresh deployment - disable all caching
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
  images: {
    // Enable Next.js image optimization for better performance
    unoptimized: false,
    // Use modern formats for better compression
    formats: ['image/avif', 'image/webp'],
    // Optimize device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Allow images from these domains
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ext.same-assets.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'hncgnxbooghjhpncujzx.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      // Community facility websites
      {
        protocol: 'https',
        hostname: '**.brookdale.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'images.brookdale.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '**.talkfurther.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'images.talkfurther.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '**.ganzhorn.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '**.maplewoodseniorliving.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'g5-assets-cld-res.cloudinary.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '**.elizajennings.org',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '**.winfieldrichmondheights.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '**.middleburgheightsal.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '**.vitaliamontrose.com',
        pathname: '**',
      },
      // Sunrise Senior Living (Stylelabs CDN)
      {
        protocol: 'https',
        hostname: 'mss-p-045-delivery.stylelabs.cloud',
        pathname: '**',
      },
      // GoDaddy Website Builder (Westlake AL)
      {
        protocol: 'https',
        hostname: 'img1.wsimg.com',
        pathname: '**',
      },
      // Assisted Living Magazine CDN (aggregator with community photos)
      {
        protocol: 'https',
        hostname: 'cdn.assistedlivingmagazine.com',
        pathname: '**',
      },
      // Squarespace CDN (Middleburg Heights, etc.)
      {
        protocol: 'https',
        hostname: 'images.squarespace-cdn.com',
        pathname: '**',
      },
      // Catch-all for other facility websites (use wildcard carefully)
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
  // Redirects for old URLs that ranked well + broken backlink recovery
  async redirects() {
    return [
      // === CRITICAL: High-Traffic Blog Post Recovery (SEO Audit Jan 2026) ===
      // These URLs have 100-300+ referring domains and need permanent redirects
      
      // 309 referring domains - "free games for seniors" keyword (vol 1000)
      {
        source: '/blog/senior-online-games',
        destination: '/resources',
        permanent: true,
      },
      {
        source: '/blog/senior-online-games/',
        destination: '/resources',
        permanent: true,
      },
      
      // 263 referring domains - "cruises for seniors" keyword
      {
        source: '/blog/cruises-for-seniors',
        destination: '/resources',
        permanent: true,
      },
      {
        source: '/blog/cruises-for-seniors/',
        destination: '/resources',
        permanent: true,
      },
      
      // 146 referring domains - "universal studios senior discount" keyword
      {
        source: '/blog/universal-studios-florida',
        destination: '/resources',
        permanent: true,
      },
      {
        source: '/blog/universal-studios-florida/',
        destination: '/resources',
        permanent: true,
      },
      
      // 100 referring domains - "apps for seniors" keyword
      {
        source: '/blog/apps-for-seniors',
        destination: '/resources',
        permanent: true,
      },
      {
        source: '/blog/apps-for-seniors/',
        destination: '/resources',
        permanent: true,
      },
      
      // === CRITICAL: Broken Backlink Recovery (SEO Audit Jan 2026) ===
      // These URLs have high-authority backlinks pointing to 404s
      
      // DR 75 backlink from rate.com - HIGHEST PRIORITY
      {
        source: '/blog/entertainment-ideas',
        destination: '/resources',
        permanent: true, // 301 - Preserves link equity
      },
      // DR 23 backlinks from homecare-aid.com, thereviewstories.com
      {
        source: '/blog/adult-brain-puzzles',
        destination: '/resources',
        permanent: true,
      },
      // DR 21 backlink from edenwald.org
      {
        source: '/blog/fiction-novel',
        destination: '/blog',
        permanent: true,
      },
      // DR 12 backlink from hometostayhc.com
      {
        source: '/blog/packing-for-a-trip',
        destination: '/resources',
        permanent: true,
      },
      // DR 9 backlink from sanantonioseniors.com
      {
        source: '/senior-entertainment/games/games-for-seniors',
        destination: '/resources',
        permanent: true,
      },
      // DR 7 backlink from global-air.com
      {
        source: '/blog/uss-yorktown',
        destination: '/resources',
        permanent: true,
      },
      
      // === Catch-all redirects for old URL structures ===
      // Redirect all old /senior-lifestyle/ paths
      {
        source: '/senior-lifestyle/:path*',
        destination: '/resources',
        permanent: true,
      },
      // Redirect all old /senior-entertainment/ paths  
      {
        source: '/senior-entertainment/:path*',
        destination: '/resources',
        permanent: true,
      },
      // Redirect all old /senior-travel/ paths
      {
        source: '/senior-travel/:path*',
        destination: '/resources',
        permanent: true,
      },
      // Redirect all old /senior-health/ paths
      {
        source: '/senior-health/:path*',
        destination: '/resources',
        permanent: true,
      },
      
      // === Legacy blog post redirects ===
      // Note: /senior-entertainment/* and /senior-lifestyle/* are now covered by catch-all above
      // Redirect /contact-us (with or without trailing slash) to /contact
      {
        source: '/contact-us',
        destination: '/contact',
        permanent: true,
      },
      
      // === Neighborhood Hub Consolidation (Jan 2026) ===
      // Redirect /neighborhoods/* to /location/* to prevent SEO cannibalization
      {
        source: '/neighborhoods/:slug',
        destination: '/location/:slug',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
