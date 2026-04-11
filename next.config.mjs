/** Keep in sync with `BRAND.iconSrc` in `src/lib/constants.ts` (192×192 Cloudinary logo). */
const brandFaviconUrl =
  "https://res.cloudinary.com/dyfnobo9r/image/upload/w_192,h_192,c_pad,b_rgb:faf9f7,f_auto,q_auto/v1775097905/glochammy_logo-beauty_jt8hxr.png";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: "/favicon.ico", destination: brandFaviconUrl },
      { source: "/icon.png", destination: brandFaviconUrl },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 300,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/**",
      },
      // Product uploads (Supabase Storage public URLs, e.g. …/storage/v1/object/public/product-images/…)
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
