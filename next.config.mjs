/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Product images are rendered with a plain <img> + fallback so admins can paste any URL.
  // This allow-list is ready for when you switch to next/image in Phase 2.
  images: { remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }] },
};
export default nextConfig;
