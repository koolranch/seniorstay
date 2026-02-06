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
      
      // ============================================================
      // REMOVED: These blog posts EXIST in database - no redirect needed!
      // Jan 2026 SEO Audit: Found that these redirects were destroying
      // link equity from 700+ referring domains
      // ============================================================
      // Kept: /blog/senior-online-games - 309 referring domains, EXISTS
      // Kept: /blog/cruises-for-seniors - 263 referring domains, EXISTS
      // Kept: /blog/apps-for-seniors - 100 referring domains, EXISTS
      // Kept: /blog/entertainment-ideas - DR 75 backlink, may exist
      // ============================================================
      
      // === Feb 2026 Lost Backlink Recovery (Ahrefs CSV Analysis) ===
      // High-value backlinks lost due to redirect chains - restore with direct redirects
      
      // DR 72 backlink - Cleveland winter safety (MeloQ Devices)
      {
        source: '/blog/cleveland-winter-safety-tips-for-seniors',
        destination: '/blog',
        permanent: true,
      },
      // DR 70 backlink - Person-centered dementia care (Atlanta Hyperbaric)
      {
        source: '/blog/person-centered-dementia-care-assisted-living',
        destination: '/resources',
        permanent: true,
      },
      // DR 29 backlink - Questions to ask facilities (TX Family Adoption)
      {
        source: '/blog/questions-to-ask-assisted-living-facilities',
        destination: '/resources',
        permanent: true,
      },
      // DR 29, DR 25 backlinks - Medicare vs Medicaid Ohio
      {
        source: '/blog/medicare-vs-medicaid-ohio-senior-care',
        destination: '/resources',
        permanent: true,
      },
      
      // === Redirects for blog posts that DON'T exist (Jan 2026 Backlink Recovery) ===
      
      // DR 75 backlink from rate.com - HIGH PRIORITY
      {
        source: '/blog/entertainment-ideas',
        destination: '/resources',
        permanent: true,
      },
      // DR 21 backlink from edenwald.org - spring gardening
      {
        source: '/blog/spring-seeds',
        destination: '/blog',
        permanent: true,
      },
      // DR 13 backlink from trustontap.com - word games
      {
        source: '/blog/wordle',
        destination: '/blog/senior-online-games',
        permanent: true,
      },
      // Multiple links - superfoods content
      {
        source: '/blog/what-are-superfoods',
        destination: '/blog/magnesium-for-health',
        permanent: true,
      },
      // Link from ritebook.in - travel content
      {
        source: '/blog/prismatic-spring',
        destination: '/blog/cruises-for-seniors',
        permanent: true,
      },
      // Link from papasearch.net - finance
      {
        source: '/blog/how-to-save-money-52-great-tips',
        destination: '/blog/long-term-care-insurance-options',
        permanent: true,
      },
      // DR 21 backlink - no matching content
      {
        source: '/blog/fiction-novel',
        destination: '/blog',
        permanent: true,
      },
      // Brain health redirect
      {
        source: '/blog/adult-brain-puzzles',
        destination: '/resources/brain-health',
        permanent: true,
      },
      // Travel packing -> cruises (DR 7 backlink from Nurses and Company)
      {
        source: '/blog/packing-for-a-trip',
        destination: '/blog/cruises-for-seniors',
        permanent: true,
      },
      // Historical content
      {
        source: '/blog/uss-yorktown',
        destination: '/blog',
        permanent: true,
      },
      // Travel content
      {
        source: '/blog/universal-studios-florida',
        destination: '/blog/cruises-for-seniors',
        permanent: true,
      },
      // Face lift content (DR 67 link from csa.us)
      {
        source: '/blog/mini-face-lift',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/senior-health/aesthetics/mini-face-lift',
        destination: '/blog',
        permanent: true,
      },
      // Games redirect to actual games page
      {
        source: '/senior-entertainment/games/games-for-seniors',
        destination: '/blog/games-for-seniors',
        permanent: true,
      },
      // Old blog category paths
      {
        source: '/blog/category/:path*',
        destination: '/blog',
        permanent: true,
      },
      
      // === SPECIFIC Legacy URL Redirects (High-Value Backlinks) ===
      // These have external backlinks - redirect to relevant content
      
      // Games-related legacy URLs -> actual games content (DR 51+ backlinks)
      {
        source: '/senior-entertainment/games/senior-online-games',
        destination: '/blog/senior-online-games',
        permanent: true,
      },
      {
        source: '/senior-entertainment/games/senior-online-games/',
        destination: '/blog/senior-online-games',
        permanent: true,
      },
      // Additional games paths found in lost backlinks
      {
        source: '/senior-entertainment/games/games-for-seniors/',
        destination: '/blog/games-for-seniors',
        permanent: true,
      },
      
      // Travel clubs -> cruises content (closest match)
      {
        source: '/senior-lifestyle/family/senior-travel-clubs',
        destination: '/blog/cruises-for-seniors',
        permanent: true,
      },
      {
        source: '/senior-lifestyle/family/senior-travel-clubs/',
        destination: '/blog/cruises-for-seniors',
        permanent: true,
      },
      
      // Travel destinations -> cruises (closest match)
      {
        source: '/senior-travel/destinations/universal-studios-florida',
        destination: '/blog/cruises-for-seniors',
        permanent: true,
      },
      {
        source: '/senior-travel/destinations/universal-studios-florida/',
        destination: '/blog/cruises-for-seniors',
        permanent: true,
      },
      {
        source: '/senior-travel/destinations/the-villages',
        destination: '/blog/cruises-for-seniors',
        permanent: true,
      },
      {
        source: '/senior-travel/destinations/the-villages/',
        destination: '/blog/cruises-for-seniors',
        permanent: true,
      },
      {
        source: '/senior-travel/destinations/activities-in-tampa',
        destination: '/blog/cruises-for-seniors',
        permanent: true,
      },
      {
        source: '/senior-travel/destinations/travel-thailand',
        destination: '/blog/cruises-for-seniors',
        permanent: true,
      },
      {
        source: '/senior-travel/destinations/uss-yorktown',
        destination: '/blog',
        permanent: true,
      },
      
      // Health-related legacy URLs -> specific content
      {
        source: '/senior-health/general-health/ginkgo-biloba-it-will-work-for-you',
        destination: '/blog/magnesium-for-health',
        permanent: true,
      },
      
      // Technology legacy URLs
      {
        source: '/senior-lifestyle/technology-for-seniors/how-to-use-selfie-stick',
        destination: '/blog/keep-up-with-tech',
        permanent: true,
      },
      {
        source: '/senior-lifestyle/technology-for-seniors/how-to-use-selfie-stick/',
        destination: '/blog/keep-up-with-tech',
        permanent: true,
      },
      
      // Meeting places legacy URL
      {
        source: '/senior-lifestyle/family/11-places-seniors-meet-seniors',
        destination: '/resources/social-activities',
        permanent: true,
      },
      {
        source: '/senior-lifestyle/family/11-places-seniors-meet-seniors/',
        destination: '/resources/social-activities',
        permanent: true,
      },
      
      // === Catch-all redirects for remaining old URL structures ===
      // These catch any remaining paths not specifically handled above
      {
        source: '/senior-lifestyle/:path*',
        destination: '/resources',
        permanent: true,
      },
      {
        source: '/senior-entertainment/:path*',
        destination: '/resources/games-for-seniors',
        permanent: true,
      },
      {
        source: '/senior-travel/:path*',
        destination: '/blog/cruises-for-seniors',
        permanent: true,
      },
      {
        source: '/senior-health/:path*',
        destination: '/resources/brain-health',
        permanent: true,
      },
      
      // === Legacy WordPress Image Hotlinks ===
      // These return 403 - redirect to homepage with image fallback
      {
        source: '/wp-content/uploads/:path*',
        destination: '/images/default-community.jpg',
        permanent: false, // 302 - May change later
      },
      {
        source: '/blog/wp-content/uploads/:path*',
        destination: '/images/default-community.jpg',
        permanent: false,
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
        destination: '/cleveland/:slug',
        permanent: true,
      },
      
      // === Multi-Region Architecture (Jan 2026) ===
      // Legacy Cleveland paths redirect to new region-aware URLs
      // This preserves SEO equity while enabling multi-city expansion
      
      // Region hub: /greater-cleveland -> /cleveland
      {
        source: '/greater-cleveland',
        destination: '/cleveland',
        permanent: true,
      },
      
      // City/location pages: /location/:slug -> /cleveland/:slug
      {
        source: '/location/:slug',
        destination: '/cleveland/:slug',
        permanent: true,
      },
      
      // Community detail pages: /community/:id/:slug -> /cleveland/community/:id/:slug
      {
        source: '/community/:id/:slug',
        destination: '/cleveland/community/:id/:slug',
        permanent: true,
      },
      
      // Event pages: /events/:slug -> /cleveland/events/:slug
      {
        source: '/events/:slug',
        destination: '/cleveland/events/:slug',
        permanent: true,
      },
      
      // Events hub: /events -> /cleveland/events (if accessed directly)
      {
        source: '/events',
        destination: '/cleveland/events',
        permanent: true,
      },
      
      // === 404 Recovery (Jan 2026 Ahrefs Audit) ===
      
      // Columbus region is now LIVE - redirects removed Feb 2026
      // 20 Columbus-area communities now available
      
      // /connect - Old URL from blog post (non-existent page)
      {
        source: '/connect',
        destination: '/contact',
        permanent: true,
      },
      
      // /ohio/:city -> /cleveland/:city (state-based URLs redirect to metro region)
      {
        source: '/ohio/:city',
        destination: '/cleveland/:city',
        permanent: true,
      },
      
      // Old /assisted-living/ohio/* URL structure
      {
        source: '/assisted-living/ohio/:city',
        destination: '/cleveland/:city',
        permanent: true,
      },
      {
        source: '/assisted-living/:state/:city',
        destination: '/cleveland',
        permanent: true,
      },
      
      // /cleveland/regional - "Regional" is not a valid city
      {
        source: '/cleveland/regional',
        destination: '/cleveland/events',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
