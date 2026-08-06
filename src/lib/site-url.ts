/**
 * The canonical origin for this deployment, used by page metadata, Open Graph
 * tags, the sitemap, robots.txt and the JSON-LD structured data.
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL — set this once the real domain is live.
 *   2. The Vercel production domain, injected automatically at build time, so
 *      a deployment is self-describing before a custom domain is attached.
 *   3. The intended production domain, as a last resort for local builds.
 *
 * Every consumer runs on the server, so the unprefixed Vercel variable is fine.
 */
function resolve() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit;

  const vercel =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return "https://whiskeymistress.com";
}

/** Normalised: absolute, no trailing slash. */
export const siteUrl = resolve().replace(/\/+$/, "");
