import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

/** One entry per public route. */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/vibe", priority: 0.8, changeFrequency: "monthly" },
    { path: "/menu", priority: 0.9, changeFrequency: "monthly" },
    { path: "/live-acts", priority: 0.7, changeFrequency: "monthly" },
    { path: "/events", priority: 0.9, changeFrequency: "weekly" },
    { path: "/gallery", priority: 0.6, changeFrequency: "monthly" },
    { path: "/reservations", priority: 0.9, changeFrequency: "monthly" },
    { path: "/private-events", priority: 0.7, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
    { path: "/careers", priority: 0.5, changeFrequency: "monthly" },
  ];

  const lastModified = new Date();

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
