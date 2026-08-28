import "server-only";

import { cache } from "react";
import { createServerSupabase } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";
import { todayInLagos } from "./format";
import {
  seedAnnouncement,
  seedEvents,
  seedExperiences,
  seedGallery,
  seedMenuSections,
  seedHours,
  seedSettings,
  seedTestimonials,
} from "./seed";
import type {
  Announcement,
  Experience,
  GalleryImage,
  MenuCategory,
  MenuItem,
  MenuSection,
  OpeningHour,
  PrivateEventInquiry,
  Reservation,
  SiteContent,
  SiteSettings,
  Testimonial,
  VenueEvent,
} from "./types";

/**
 * Content access. Every reader here answers from Supabase when it is
 * configured and falls back to the seed catalogue otherwise, so the public site
 * renders identically in both modes.
 */

/** Groups a category's items by `group_label`, preserving sort order. */
function groupItems(items: MenuItem[]) {
  const out: { label: string | null; items: MenuItem[] }[] = [];
  for (const entry of items) {
    const bucket = out.find((g) => g.label === entry.group_label);
    if (bucket) bucket.items.push(entry);
    else out.push({ label: entry.group_label, items: [entry] });
  }
  return out;
}

function assemble(categories: MenuCategory[], items: MenuItem[]): MenuSection[] {
  return categories
    .map((category) => {
      const own = items
        .filter((entry) => entry.category_id === category.id)
        .sort((a, b) => a.sort_order - b.sort_order);
      return { ...category, items: own, groups: groupItems(own) };
    })
    .filter((section) => section.items.length > 0);
}

export const getMenuSections = cache(async (): Promise<MenuSection[]> => {
  const supabase = await createServerSupabase();
  if (!supabase) return seedMenuSections;

  const [{ data: categories }, { data: items }] = await Promise.all([
    supabase
      .from("menu_categories")
      .select("*")
      .eq("is_published", true)
      .order("sort_order"),
    supabase
      .from("menu_items")
      .select("*")
      .eq("is_published", true)
      .order("sort_order"),
  ]);

  if (!categories?.length) return seedMenuSections;

  return assemble(categories as MenuCategory[], (items ?? []) as MenuItem[]);
});

export const getSettings = cache(async (): Promise<SiteSettings> => {
  const supabase = await createServerSupabase();
  if (!supabase) return seedSettings;

  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  return (data as SiteSettings | null) ?? seedSettings;
});

export const getAnnouncement = cache(async (): Promise<Announcement | null> => {
  const supabase = await createServerSupabase();
  if (!supabase) return seedAnnouncement;

  const nowIso = new Date().toISOString();
  const { data } = await supabase
    .from("announcements")
    .select("*")
    .eq("is_published", true)
    .or(`starts_at.is.null,starts_at.lte.${nowIso}`)
    .or(`ends_at.is.null,ends_at.gte.${nowIso}`)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (data as Announcement | null) ?? null;
});

export const getExperiences = cache(async (): Promise<Experience[]> => {
  const supabase = await createServerSupabase();
  if (!supabase) return seedExperiences;

  const { data } = await supabase
    .from("experiences")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");

  return (data as Experience[] | null)?.length
    ? (data as Experience[])
    : seedExperiences;
});

export const getUpcomingEvents = cache(async (): Promise<VenueEvent[]> => {
  const today = todayInLagos();
  const supabase = await createServerSupabase();

  if (!supabase) {
    const upcoming = seedEvents.filter((event) => event.event_date >= today);
    // Seed dates eventually fall into the past; still show the roster rather
    // than an empty section in preview mode.
    return (upcoming.length ? upcoming : seedEvents).slice(0, 6);
  }

  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .gte("event_date", today)
    .order("event_date")
    .limit(9);

  return (data as VenueEvent[] | null) ?? [];
});

export const getGallery = cache(async (): Promise<GalleryImage[]> => {
  const supabase = await createServerSupabase();
  if (!supabase) return seedGallery;

  const { data } = await supabase
    .from("gallery_images")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");

  return (data as GalleryImage[] | null)?.length
    ? (data as GalleryImage[])
    : seedGallery;
});

export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  const supabase = await createServerSupabase();
  if (!supabase) return seedTestimonials;

  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");

  return (data as Testimonial[] | null)?.length
    ? (data as Testimonial[])
    : seedTestimonials;
});

export const getOpeningHours = cache(async (): Promise<OpeningHour[]> => {
  const supabase = await createServerSupabase();
  if (!supabase) return seedHours;

  const { data } = await supabase
    .from("opening_hours")
    .select("*")
    .order("day_of_week");

  return (data as OpeningHour[] | null)?.length
    ? (data as OpeningHour[])
    : seedHours;
});

/** One pass for the whole landing page. */
export const getSiteContent = cache(async (): Promise<SiteContent> => {
  const [
    settings,
    announcement,
    menuSections,
    experiences,
    events,
    gallery,
    testimonials,
    hours,
  ] = await Promise.all([
    getSettings(),
    getAnnouncement(),
    getMenuSections(),
    getExperiences(),
    getUpcomingEvents(),
    getGallery(),
    getTestimonials(),
    getOpeningHours(),
  ]);

  return {
    settings,
    announcement,
    menuSections,
    experiences,
    events,
    gallery,
    testimonials,
    hours,
    isPreview: !isSupabaseConfigured,
  };
});

/* ------------------------------------------------------------ admin reads */

export async function getAllMenuCategories() {
  const supabase = await createServerSupabase();
  if (!supabase) {
    return seedMenuSections.map(
      ({ items: _items, groups: _groups, ...category }) => category,
    );
  }

  const { data } = await supabase
    .from("menu_categories")
    .select("*")
    .order("sort_order");

  return (data ?? []) as MenuCategory[];
}

export async function getAllMenuItems() {
  const supabase = await createServerSupabase();
  if (!supabase) return seedMenuSections.flatMap((section) => section.items);

  const { data } = await supabase
    .from("menu_items")
    .select("*")
    .order("sort_order");

  return (data ?? []) as MenuItem[];
}

export async function getAllEvents() {
  const supabase = await createServerSupabase();
  if (!supabase) return seedEvents;

  const { data } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: false });

  return (data ?? []) as VenueEvent[];
}

export async function getAllGallery() {
  const supabase = await createServerSupabase();
  if (!supabase) return seedGallery;

  const { data } = await supabase
    .from("gallery_images")
    .select("*")
    .order("sort_order");

  return (data ?? []) as GalleryImage[];
}

export async function getAllAnnouncements() {
  const supabase = await createServerSupabase();
  if (!supabase) return [seedAnnouncement];

  const { data } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });

  return (data ?? []) as Announcement[];
}

export async function getAllExperiences() {
  const supabase = await createServerSupabase();
  if (!supabase) return seedExperiences;

  const { data } = await supabase
    .from("experiences")
    .select("*")
    .order("sort_order");

  return (data ?? []) as Experience[];
}

export async function getReservations() {
  const supabase = await createServerSupabase();
  if (!supabase) return [] as Reservation[];

  const { data } = await supabase
    .from("reservations")
    .select("*")
    .order("reservation_date", { ascending: false })
    .order("reservation_time", { ascending: false })
    .limit(300);

  return (data ?? []) as Reservation[];
}

export async function getInquiries() {
  const supabase = await createServerSupabase();
  if (!supabase) return [] as PrivateEventInquiry[];

  const { data } = await supabase
    .from("private_event_inquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(300);

  return (data ?? []) as PrivateEventInquiry[];
}

export async function getSubscriberCount() {
  const supabase = await createServerSupabase();
  if (!supabase) return 0;

  const { count } = await supabase
    .from("newsletter_subscribers")
    .select("*", { count: "exact", head: true });

  return count ?? 0;
}
