import type { NextConfig } from "next";

const supabaseHost = (() => {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
      : null;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  images: {
    // Unsplash images are served straight from their own CDN; local files and
    // Supabase uploads still fall through to the built-in optimizer.
    // See src/lib/imageLoader.ts.
    loader: "custom",
    loaderFile: "./src/lib/imageLoader.ts",
    formats: ["image/avif", "image/webp"],
    // Still enforced for anything the loader routes to /_next/image.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      ...(supabaseHost
        ? ([{ protocol: "https", hostname: supabaseHost }] as const)
        : []),
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "motion"],
  },
};

export default nextConfig;
