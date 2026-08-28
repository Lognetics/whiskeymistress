import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";


/** Single-page site — the anchors are listed so each section can be surfaced. */
export default function sitemap(): MetadataRoute.Sitemap {
  const sections = [
    "",
    "#vibe",
    "#experience",
    "#menu",
    "#live-acts",
    "#events",
    "#gallery",
    "#reservations",
    "#private-events",
    "#contact",
    "#careers",
  ];

  return sections.map((section) => ({
    url: `${siteUrl}/${section}`,
    lastModified: new Date(),
    changeFrequency: section === "#events" ? "weekly" : "monthly",
    priority: section === "" ? 1 : 0.7,
  }));
}
