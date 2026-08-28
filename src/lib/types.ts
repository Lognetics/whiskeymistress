/**
 * Domain types shared by the public site, the server actions and the admin
 * dashboard. These mirror the tables created in
 * `supabase/migrations/0001_init.sql` one-for-one.
 */

export type Availability = "available" | "limited" | "sold_out" | "seasonal";

export interface MenuCategory {
  id: string;
  /** Small-caps label above the title, e.g. "TABLE SERVICE". */
  eyebrow: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  is_published: boolean;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  /** Stored in minor units (kobo) to avoid float drift. */
  price_minor: number;
  currency: string;
  image_url: string | null;
  availability: Availability;
  is_signature: boolean;
  dietary_tags: string[];
  /**
   * Optional sub-heading inside a category — the bottle list is grouped into
   * WHISKEY / COGNAC / BUBBLY / SPIRITS under one "Bottle Service" category.
   */
  group_label: string | null;
  sort_order: number;
  is_published: boolean;
}

/** Items sharing a `group_label` within a category. */
export interface MenuGroup {
  label: string | null;
  items: MenuItem[];
}

/** A category with its items grouped — what the price list renders. */
export interface MenuSection extends MenuCategory {
  items: MenuItem[];
  groups: MenuGroup[];
}

export interface Experience {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  capacity: string | null;
  price_note: string | null;
  cta_label: string;
  sort_order: number;
  is_published: boolean;
}

export interface VenueEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  banner_url: string | null;
  /** ISO date, e.g. 2026-08-22 */
  event_date: string;
  /** 24h local time, e.g. 21:00 */
  start_time: string;
  end_time: string | null;
  ticket_note: string | null;
  is_featured: boolean;
  is_published: boolean;
}

export interface GalleryImage {
  id: string;
  image_url: string;
  alt: string;
  category: string;
  width: number;
  height: number;
  sort_order: number;
  is_published: boolean;
}

export interface Testimonial {
  id: string;
  guest_name: string;
  guest_title: string | null;
  avatar_url: string | null;
  rating: number;
  quote: string;
  sort_order: number;
  is_published: boolean;
}

export interface Announcement {
  id: string;
  message: string;
  link_label: string | null;
  link_href: string | null;
  starts_at: string | null;
  ends_at: string | null;
  is_published: boolean;
}

export interface OpeningHour {
  id: string;
  /** 0 = Sunday … 6 = Saturday */
  day_of_week: number;
  opens_at: string | null;
  closes_at: string | null;
  note: string | null;
  is_closed: boolean;
}

export interface SiteSettings {
  id: string;
  brand_name: string;
  tagline: string;
  hero_headline: string;
  hero_subheadline: string;
  about_heading: string;
  about_body: string;
  about_image_url: string | null;
  address_line: string;
  city: string;
  country: string;
  phone: string;
  whatsapp: string;
  email: string;
  maps_query: string;
  instagram_url: string | null;
  facebook_url: string | null;
  x_url: string | null;
  tiktok_url: string | null;
  reservation_lead_time_hours: number;
  max_party_size: number;
}

export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "seated"
  | "cancelled"
  | "no_show";

export interface Reservation {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  reservation_date: string;
  reservation_time: string;
  party_size: number;
  occasion: string | null;
  seating_preference: string | null;
  special_requests: string | null;
  status: ReservationStatus;
  created_at: string;
}

export type InquiryStatus = "new" | "in_progress" | "won" | "lost";

export interface PrivateEventInquiry {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  company: string | null;
  event_type: string;
  preferred_date: string | null;
  guest_count: number;
  budget_range: string | null;
  message: string | null;
  status: InquiryStatus;
  created_at: string;
}

export type ApplicationStatus = "new" | "reviewing" | "hired" | "rejected";

export interface JobApplication {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  position: string;
  resume_url: string | null;
  previous_employment: string | null;
  status: ApplicationStatus;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  created_at: string;
}

/** Everything the landing page needs, fetched in one pass. */
export interface SiteContent {
  settings: SiteSettings;
  announcement: Announcement | null;
  menuSections: MenuSection[];
  experiences: Experience[];
  events: VenueEvent[];
  gallery: GalleryImage[];
  testimonials: Testimonial[];
  hours: OpeningHour[];
  /** True when content came from the built-in seed rather than Supabase. */
  isPreview: boolean;
}
