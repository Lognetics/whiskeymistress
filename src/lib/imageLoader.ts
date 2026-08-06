/**
 * Custom image loader.
 *
 * The catalogue points at Unsplash, which is already an imgix-backed CDN: it
 * resizes and re-encodes from the `w`, `q` and `auto=format` query parameters.
 * Sending those images through a second optimizer (Vercel's `/_next/image`)
 * buys nothing, costs a transformation per image per breakpoint, and adds a
 * server-side fetch that can fail or be throttled upstream. With ~80 remote
 * images on the page, that is hundreds of transformations for a single view.
 *
 * So Unsplash URLs are handed to Unsplash directly, and everything else —
 * local files and Supabase Storage uploads — still goes through the built-in
 * optimizer, which is validated against `remotePatterns` in next.config.ts.
 */

const CDN_HOSTS = ["images.unsplash.com", "plus.unsplash.com"];

interface LoaderArgs {
  src: string;
  width: number;
  quality?: number;
}

export default function imageLoader({ src, width, quality }: LoaderArgs) {
  const q = quality ?? 75;

  if (CDN_HOSTS.some((host) => src.includes(host))) {
    // Rebuild the query so our width/quality win over whatever was in the URL.
    const [base, search = ""] = src.split("?");
    const params = new URLSearchParams(search);
    params.set("auto", "format");
    params.set("fit", "crop");
    params.set("w", String(width));
    params.set("q", String(q));
    return `${base}?${params.toString()}`;
  }

  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${q}`;
}
