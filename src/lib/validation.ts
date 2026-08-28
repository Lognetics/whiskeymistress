import { z } from "zod";

const trimmed = (min: number, max: number, label: string) =>
  z
    .string()
    .trim()
    .min(min, `${label} is required`)
    .max(max, `${label} is too long`);

/** Accepts +234…, 0803…, spaced or dashed — 7 to 15 digits after cleaning. */
const phone = z
  .string()
  .trim()
  .min(1, "Phone number is required")
  .refine(
    (value) => /^\+?[\d\s()-]{7,20}$/.test(value) &&
      value.replace(/\D/g, "").length >= 7 &&
      value.replace(/\D/g, "").length <= 15,
    "Enter a valid phone number",
  );

/** Absolute URL or a site-relative path such as /images/hero.jpg. */
const imageRef = z
  .string()
  .trim()
  .refine(
    (v) => v === "" || v.startsWith("/") || /^https?:\/\//.test(v),
    "Enter an image URL or a path beginning with /",
  );

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid date");

export const reservationSchema = z.object({
  full_name: trimmed(2, 120, "Full name"),
  phone,
  email: z.string().trim().email("Enter a valid email address").max(160),
  reservation_date: isoDate,
  reservation_time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Choose a valid time"),
  party_size: z.coerce
    .number()
    .int("Enter a whole number")
    .min(1, "At least one guest")
    .max(200, "For parties this size, please use the private events form"),
  occasion: z.string().trim().max(80).optional().or(z.literal("")),
  seating_preference: z.string().trim().max(80).optional().or(z.literal("")),
  special_requests: z.string().trim().max(1000).optional().or(z.literal("")),
  /** Honeypot — bots fill it, humans never see it. */
  company_website: z.string().max(0).optional().or(z.literal("")),
});

export const inquirySchema = z.object({
  full_name: trimmed(2, 120, "Full name"),
  phone,
  email: z.string().trim().email("Enter a valid email address").max(160),
  company: z.string().trim().max(140).optional().or(z.literal("")),
  event_type: trimmed(2, 80, "Event type"),
  preferred_date: isoDate.optional().or(z.literal("")),
  guest_count: z.coerce
    .number()
    .int("Enter a whole number")
    .min(1, "At least one guest")
    .max(2000, "Enter a realistic guest count"),
  budget_range: z.string().trim().max(80).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  company_website: z.string().max(0).optional().or(z.literal("")),
});

export const newsletterSchema = z.object({
  email: z.string().trim().email("Enter a valid email address").max(160),
});

export const menuItemSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  category_id: z.string().uuid("Choose a category"),
  name: trimmed(1, 140, "Name"),
  description: z.string().trim().max(600).optional().or(z.literal("")),
  /** Entered in naira in the dashboard; converted to kobo on save. */
  price_major: z.coerce.number().min(0, "Price cannot be negative").max(100_000_000),
  currency: z.string().trim().length(3).default("NGN"),
  image_url: imageRef.optional().or(z.literal("")),
  availability: z.enum(["available", "limited", "sold_out", "seasonal"]),
  is_signature: z.coerce.boolean().default(false),
  dietary_tags: z.string().trim().max(200).optional().or(z.literal("")),
  group_label: z.string().trim().max(60).optional().or(z.literal("")),
  sort_order: z.coerce.number().int().min(0).max(9999).default(0),
  is_published: z.coerce.boolean().default(true),
});

export const categorySchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  eyebrow: z.string().trim().max(60).optional().or(z.literal("")),
  name: trimmed(1, 80, "Name"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens only"),
  description: z.string().trim().max(400).optional().or(z.literal("")),
  sort_order: z.coerce.number().int().min(0).max(9999).default(0),
  is_published: z.coerce.boolean().default(true),
});

export const eventSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  title: trimmed(1, 140, "Title"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(140)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens only"),
  description: z.string().trim().max(1200).optional().or(z.literal("")),
  banner_url: imageRef.optional().or(z.literal("")),
  event_date: isoDate,
  start_time: z.string().regex(/^\d{2}:\d{2}$/, "Choose a start time"),
  end_time: z.string().regex(/^\d{2}:\d{2}$/).optional().or(z.literal("")),
  ticket_note: z.string().trim().max(140).optional().or(z.literal("")),
  is_featured: z.coerce.boolean().default(false),
  is_published: z.coerce.boolean().default(true),
});

export const galleryImageSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  image_url: imageRef,
  alt: trimmed(1, 200, "Alt text"),
  category: trimmed(1, 60, "Category"),
  width: z.coerce.number().int().min(1).max(10000).default(1400),
  height: z.coerce.number().int().min(1).max(10000).default(933),
  sort_order: z.coerce.number().int().min(0).max(9999).default(0),
  is_published: z.coerce.boolean().default(true),
});

export const announcementSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  message: trimmed(1, 240, "Message"),
  link_label: z.string().trim().max(40).optional().or(z.literal("")),
  link_href: z.string().trim().max(300).optional().or(z.literal("")),
  starts_at: z.string().trim().max(40).optional().or(z.literal("")),
  ends_at: z.string().trim().max(40).optional().or(z.literal("")),
  is_published: z.coerce.boolean().default(true),
});

export const experienceSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  title: trimmed(1, 100, "Title"),
  description: trimmed(1, 800, "Description"),
  image_url: imageRef.optional().or(z.literal("")),
  capacity: z.string().trim().max(60).optional().or(z.literal("")),
  price_note: z.string().trim().max(120).optional().or(z.literal("")),
  cta_label: z.string().trim().max(40).default("Book Now"),
  sort_order: z.coerce.number().int().min(0).max(9999).default(0),
  is_published: z.coerce.boolean().default(true),
});

export const settingsSchema = z.object({
  brand_name: trimmed(1, 80, "Brand name"),
  tagline: z.string().trim().max(160).optional().or(z.literal("")),
  hero_headline: trimmed(1, 200, "Hero headline"),
  hero_subheadline: z.string().trim().max(400).optional().or(z.literal("")),
  about_heading: trimmed(1, 160, "About heading"),
  about_body: z.string().trim().max(4000).optional().or(z.literal("")),
  about_image_url: imageRef.optional().or(z.literal("")),
  address_line: trimmed(1, 200, "Address"),
  city: trimmed(1, 80, "City"),
  country: trimmed(1, 80, "Country"),
  phone: z.string().trim().max(40),
  whatsapp: z.string().trim().max(40),
  email: z.string().trim().email("Enter a valid email address").max(160),
  maps_query: z.string().trim().max(300),
  instagram_url: z.string().trim().max(300).optional().or(z.literal("")),
  facebook_url: z.string().trim().max(300).optional().or(z.literal("")),
  x_url: z.string().trim().max(300).optional().or(z.literal("")),
  tiktok_url: z.string().trim().max(300).optional().or(z.literal("")),
  reservation_lead_time_hours: z.coerce.number().int().min(0).max(72).default(3),
  max_party_size: z.coerce.number().int().min(1).max(500).default(30),
});

export const openingHourSchema = z.object({
  day_of_week: z.coerce.number().int().min(0).max(6),
  opens_at: z.string().regex(/^\d{2}:\d{2}$/).optional().or(z.literal("")),
  closes_at: z.string().regex(/^\d{2}:\d{2}$/).optional().or(z.literal("")),
  note: z.string().trim().max(120).optional().or(z.literal("")),
  is_closed: z.coerce.boolean().default(false),
});

/** Flatten a ZodError into { field: message } for inline form display. */
export function fieldErrors(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
