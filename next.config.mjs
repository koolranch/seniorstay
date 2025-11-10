/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ];
  },
};

export default nextConfig;
