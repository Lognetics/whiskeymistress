import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://whiskeymistress.com";

/** Single-page site — the anchors are listed so each section can be surfaced. */
export default function sitemap(): MetadataRoute.Sitemap {
  const sections = [
    "",
    "#about",
    "#dining",
    "#beverages",
    "#experiences",
    "#events",
    "#gallery",
    "#reservations",
    "#private-events",
    "#contact",
  ];

  return sections.map((section) => ({
    url: `${siteUrl}/${section}`,
    lastModified: new Date(),
    changeFrequency: section === "#events" ? "weekly" : "monthly",
    priority: section === "" ? 1 : 0.7,
  }));
}
