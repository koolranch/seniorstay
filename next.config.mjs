/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure consistent URLs without trailing slashes
  trailingSlash: false,
  // Force fresh deployment - disable all caching
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
  images: {
    unoptimized: true,
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
        pathname: '/storage/v1/object/public/community-images/**',
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
