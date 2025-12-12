/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      // Map lowercase /api requests to the existing /Api routes (current folder casing)
      { source: "/Api/:path*", destination: "/Api/:path*" },
    ];
  },
};

export default nextConfig;
