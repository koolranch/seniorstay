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
  // Redirects for old URLs that ranked well
  async redirects() {
    return [
      {
        source: '/senior-entertainment/games/senior-online-games',
        destination: '/blog/senior-online-games',
        permanent: true, // 301 redirect - preserves SEO ranking
      },
      {
        source: '/senior-lifestyle/family/11-places-seniors-meet-seniors',
        destination: '/blog/11-places-seniors-meet-seniors',
        permanent: true,
      },
      // Redirect /contact-us (with or without trailing slash) to /contact
      {
        source: '/contact-us',
        destination: '/contact',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
