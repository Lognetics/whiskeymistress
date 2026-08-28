/**
 * Whiskey Mistress — content catalogue.
 *
 * Transcribed from the venue's own material (menu, event flyers, contact and
 * copy). This is the source of truth in two situations:
 *   1. No Supabase credentials are configured — the site renders from here so
 *      it is fully explorable out of the box (read-only "preview" mode).
 *   2. Seeding a fresh Supabase project — /admin/setup imports this catalogue
 *      into the live database in one click.
 *
 * Prices are in kobo (₦1 = 100 kobo) and are quoted before the 5% service
 * charge and 7.5% VAT noted on the menu.
 */
import type {
  Announcement,
  Experience,
  GalleryImage,
  MenuItem,
  MenuSection,
  OpeningHour,
  SiteSettings,
  Testimonial,
  VenueEvent,
} from "./types";

export const seedSettings: SiteSettings = {
  id: "default",
  brand_name: "Whiskey Mistress",
  tagline: "Abuja's Premium Nightlife Destination",
  hero_headline: "Abuja, You Are Invited!!",
  hero_subheadline: "Tonight deserves a better story.",
  about_heading: "Where Elegance Meets Energy",
  about_body:
    "Whiskey Mistress is Abuja's premium nightlife destination — a place where elegance meets energy and every night feels like an occasion.\n\nFrom expertly crafted cocktails and a world-class whiskey list to curated DJ lineups and an extraordinary live show, we deliver a seamless fusion of sophistication and excitement.\n\nOur guests come for the pour and stay for the performance. Join us in a vibrant atmosphere built for connection, celebration and unforgettable nights.",
  about_image_url: "/images/experience-live.jpg",
  address_line: "3rd Floor, Nurnberger Platz, Plot 1723, Ademola Adetokunbo Crescent",
  city: "Wuse 2, Abuja",
  country: "Nigeria",
  phone: "+234 809 172 9999",
  whatsapp: "2348091729999",
  email: "hello@whiskeymistressabuja.com",
  maps_query:
    "Nurnberger Platz, Ademola Adetokunbo Crescent, Wuse 2, Abuja, Nigeria",
  instagram_url: "https://instagram.com/whiskeymistress_abj",
  facebook_url: null,
  x_url: null,
  tiktok_url: null,
  reservation_lead_time_hours: 3,
  max_party_size: 30,
};

export const seedAnnouncement: Announcement = {
  id: "seed-announcement",
  message: "Open Wednesday – Sunday · Doors at 8PM. Tables go fast.",
  link_label: "Get Access",
  link_href: "/reservations",
  starts_at: null,
  ends_at: null,
  is_published: true,
};

/* ------------------------------------------------------------------- menu */

/** Compact item builder — the bottle list has no descriptions or imagery. */
let seq = 0;
function item(
  categoryId: string,
  name: string,
  naira: number,
  opts: {
    group?: string;
    description?: string;
    signature?: boolean;
  } = {},
): MenuItem {
  seq += 1;
  return {
    id: `mi-${seq}`,
    category_id: categoryId,
    name,
    description: opts.description ?? null,
    price_minor: naira * 100,
    currency: "NGN",
    image_url: null,
    availability: "available",
    is_signature: opts.signature ?? false,
    dietary_tags: [],
    group_label: opts.group ?? null,
    sort_order: seq,
    is_published: true,
  };
}

const bottleService = [
  item("cat-bottles", "Glenfiddich 23yrs", 1_100_000, { group: "Whiskey", signature: true }),
  item("cat-bottles", "Glenfiddich 21yrs", 890_000, { group: "Whiskey" }),
  item("cat-bottles", "Glenfiddich 18yrs", 390_000, { group: "Whiskey" }),
  item("cat-bottles", "Glenlivet 18yrs", 390_000, { group: "Whiskey" }),
  item("cat-bottles", "Glenlivet 15yrs", 320_000, { group: "Whiskey" }),
  item("cat-bottles", "Glenlivet 12yrs", 290_000, { group: "Whiskey" }),
  item("cat-bottles", "Johnnie Walker 18yrs", 390_000, { group: "Whiskey" }),

  item("cat-bottles", "Hennessy X.O", 890_000, { group: "Cognac", signature: true }),
  item("cat-bottles", "Martell X.O", 860_000, { group: "Cognac" }),
  item("cat-bottles", "Remy Martin XO", 650_000, { group: "Cognac" }),
  item("cat-bottles", "Hennessy VSOP", 310_000, { group: "Cognac" }),
  item("cat-bottles", "Martell Blueswift", 290_000, { group: "Cognac" }),

  item("cat-bottles", "Dom Perignon Brut", 1_100_000, { group: "Bubbly", signature: true }),
  item("cat-bottles", "Ace of Spades Brut", 970_000, { group: "Bubbly" }),
  item("cat-bottles", "Veuve Rich", 420_000, { group: "Bubbly" }),
  item("cat-bottles", "Moet Ice Imperial", 400_000, { group: "Bubbly" }),
  item("cat-bottles", "Moet Imperial Rose", 380_000, { group: "Bubbly" }),
  item("cat-bottles", "Moet Nectar Imperial", 340_000, { group: "Bubbly" }),
  item("cat-bottles", "Belaire Rose Fantome", 270_000, { group: "Bubbly" }),

  item("cat-bottles", "Don Julio 1942", 990_000, { group: "Spirits", signature: true }),
  item("cat-bottles", "Casamigos Reposado", 550_000, { group: "Spirits" }),
  item("cat-bottles", "Volcan Blanco", 250_000, { group: "Spirits" }),
];

const grills = [
  item("cat-grills", "Goat Thigh", 26_300, { signature: true }),
  item("cat-grills", "Lamb Chops", 24_500, { signature: true }),
  item("cat-grills", "Whole Chicken", 19_500),
  item("cat-grills", "Prawns", 15_500),
  item("cat-grills", "French Fries", 3_500),
];

const cocktails = [
  item("cat-cocktails", "Whiskey Long Island", 12_500, {
    description: "Whiskey, rum, gin, tequila, vodka, cointreau, coke and lime.",
    signature: true,
  }),
  item("cat-cocktails", "Whiskey Sour", 7_500, {
    description: "Bourbon whisky, egg whites, fresh lemon juice, gomme syrup.",
    signature: true,
  }),
];

const beverages = [
  item("cat-beverages", "Apple Juice", 10_000),
  item("cat-beverages", "Red Bull", 6_000),
  item("cat-beverages", "Voss Water", 4_000),
  item("cat-beverages", "Heineken", 4_000),
  item("cat-beverages", "Tomi Cranberry", 2_000),
  item("cat-beverages", "Tonic Water", 2_000),
  item("cat-beverages", "Coke", 2_000),
  item("cat-beverages", "Sprite", 2_000),
  item("cat-beverages", "Nestle Water", 1_000),
];

const puffs = [
  item("cat-puffs", "Vape", 25_000),
  item("cat-puffs", "Shisha", 20_000),
  item("cat-puffs", "Cigarette", 3_000),
];

/** Groups items by `group_label`, preserving first-seen order. */
function group(items: MenuItem[]) {
  const out: { label: string | null; items: MenuItem[] }[] = [];
  for (const entry of items) {
    const label = entry.group_label;
    const bucket = out.find((g) => g.label === label);
    if (bucket) bucket.items.push(entry);
    else out.push({ label, items: [entry] });
  }
  return out;
}

const SECTIONS: Omit<MenuSection, "groups">[] = [
  {
    id: "cat-bottles",
    eyebrow: "Table Service",
    name: "Bottle Service",
    slug: "bottle-service",
    description:
      "A bottle list that runs from Glenlivet to Dom Perignon, served to your table.",
    sort_order: 1,
    is_published: true,
    items: bottleService,
  },
  {
    id: "cat-grills",
    eyebrow: "From The Fire",
    name: "Grills",
    slug: "grills",
    description: "Off the fire, served hot to the table.",
    sort_order: 2,
    is_published: true,
    items: grills,
  },
  {
    id: "cat-cocktails",
    eyebrow: "House Pours",
    name: "Cocktails",
    slug: "cocktails",
    description: "Built to order at the bar.",
    sort_order: 3,
    is_published: true,
    items: cocktails,
  },
  {
    id: "cat-beverages",
    eyebrow: "Chilled",
    name: "Beverages",
    slug: "beverages",
    description: null,
    sort_order: 4,
    is_published: true,
    items: beverages,
  },
  {
    id: "cat-puffs",
    eyebrow: "Smoke",
    name: "Puffs",
    slug: "puffs",
    description: null,
    sort_order: 5,
    is_published: true,
    items: puffs,
  },
];

export const seedMenuSections: MenuSection[] = SECTIONS.map((section) => ({
  ...section,
  groups: group(section.items),
}));

/** Printed under the price list, exactly as the venue states it. */
export const MENU_NOTICE =
  "Prices are subject to change. 5% service charge, 7.5% VAT and other applicable taxes.";

/* ------------------------------------------------------------- experiences */

export const seedExperiences: Experience[] = [
  {
    id: "x-1",
    title: "Liquid Gold",
    description:
      "Rare vintages, premium pours, and master-crafted cocktails designed for the elite.",
    image_url: "/images/experience-drinks.jpg",
    capacity: "Drink Selection",
    price_note: null,
    cta_label: "See the List",
    sort_order: 1,
    is_published: true,
  },
  {
    id: "x-2",
    title: "Arena-Level Energy",
    description:
      "Mind-blowing live acts, world-class DJs, and unscripted entertainment that commands the room.",
    image_url: "/images/experience-live.jpg",
    capacity: "Live Performances",
    price_note: null,
    cta_label: "See What's On",
    sort_order: 2,
    is_published: true,
  },
  {
    id: "x-3",
    title: "Zero Repetition",
    description:
      "Every night is an exclusive event. High energy, high status, and completely unpredictable.",
    image_url: "/images/gallery-paradiso.jpg",
    capacity: "Themed Nights",
    price_note: null,
    cta_label: "Get Access",
    sort_order: 3,
    is_published: true,
  },
];

/** The three pillars printed under "The Vibe". */
export const VIBE_PILLARS = [
  {
    title: "Vibrant Atmosphere",
    body: "Where guests socialize, dance and savour our extensive whiskey offerings.",
  },
  {
    title: "Themed Nights",
    body: "Rotating experiences and special promotions you won't find anywhere else.",
  },
  {
    title: "Community Spirit",
    body: "Events that bring people together and celebrate Abuja's nightlife.",
  },
] as const;

/** Live Acts pillars. */
export const LIVE_ACT_PILLARS = [
  {
    title: "Live Performances",
    body: "Exhilarating acts and talented performers that keep the night moving.",
  },
  {
    title: "Themed Nights",
    body: "Rotating experiences and special promotions you won't find anywhere else.",
  },
  {
    title: "Resident DJs",
    body: "Curated lineups that carry the room from first pour to last call.",
  },
] as const;

export const NIGHTLIFE_METRICS = [
  { value: "2K+", label: "Unforgettable nights engineered" },
  { value: "100%", label: "Unmatched energy every weekend" },
  { value: "0", label: "Boring seconds allowed" },
] as const;

/* ------------------------------------------------------------------ events */

export const seedEvents: VenueEvent[] = [
  {
    id: "e-1",
    title: "Friday",
    slug: "friday",
    description: "DJ Peterpan, Boston, Charlex, Nextbeat.",
    banner_url: "/images/event-friday.jpg",
    event_date: "2026-08-28",
    start_time: "20:00",
    end_time: null,
    ticket_note: "18+ · Doors open 8PM",
    is_featured: true,
    is_published: true,
  },
  {
    id: "e-2",
    title: "Paradiso",
    slug: "paradiso",
    description: "DJ Peter Pan, Boston, Charlex, Nextbeat, Hypequeen Zee.",
    banner_url: "/images/event-paradiso.jpg",
    event_date: "2026-08-29",
    start_time: "20:00",
    end_time: null,
    ticket_note: "18+ · Doors open 8PM",
    is_featured: true,
    is_published: true,
  },
  {
    id: "e-3",
    title: "One Night Only",
    slug: "one-night-only",
    description:
      "Afro-Calypso, Dancehall and Bashment every Sunday, hosted by DJ Kenny. With DJ Borsh and DJ TTB.",
    banner_url: "/images/event-one-night.jpg",
    event_date: "2026-08-30",
    start_time: "16:00",
    end_time: null,
    ticket_note: "Every Sunday · 4PM",
    is_featured: true,
    is_published: true,
  },
  {
    id: "e-4",
    title: "Daughters of Eve",
    slug: "daughters-of-eve",
    description: "DJ Peter Pan, Boston, Charlex, Nextbeat.",
    banner_url: "/images/event-daughters.jpg",
    event_date: "2026-08-27",
    start_time: "20:00",
    end_time: null,
    ticket_note: "18+ · Doors open 8PM",
    is_featured: false,
    is_published: true,
  },
  {
    id: "e-5",
    title: "Delilah",
    slug: "delilah",
    description: "DJ Peterpan, Boston, Charlex, Nextbeat.",
    banner_url: "/images/event-delilah.jpg",
    event_date: "2026-08-26",
    start_time: "20:00",
    end_time: null,
    ticket_note: "18+ · Doors open 8PM",
    is_featured: false,
    is_published: true,
  },
];

/* ----------------------------------------------------------------- gallery */

/** Compact gallery-row builder. */
function img(
  id: string,
  image_url: string,
  alt: string,
  category: string,
  width: number,
  height: number,
): GalleryImage {
  return {
    id,
    image_url,
    alt,
    category,
    width,
    height,
    sort_order: Number(id.split("-")[1]),
    is_published: true,
  };
}

export const seedGallery: GalleryImage[] = [
  img("g-1",  "/images/venue-bar-draught.jpg",   "The whiskey wall behind the bar, poured cold", "The Bar",   1290, 1722),
  img("g-2",  "/images/venue-murals.jpg",        "Hand-painted murals along the booth wall",     "The Room",  1290, 1721),
  img("g-3",  "/images/venue-booths.jpg",        "Lounge booths under the mirrored ceiling",     "The Room",  1290, 1721),
  img("g-4",  "/images/venue-terrace.jpg",       "The terrace side of the floor by day",         "The Room",  1290, 1726),
  img("g-5",  "/images/venue-bar-stools.jpg",    "Bar stools along the marble counter",          "The Bar",   1290,  967),
  img("g-6",  "/images/venue-wings.jpg",         "Wings off the grill, plated to order",         "The Grill", 1290, 1736),
  img("g-7",  "/images/experience-live.jpg",     "A live set in full flow on the floor",         "Live Acts", 1191, 1029),
  img("g-8",  "/images/experience-drinks.jpg",   "The room under purple light during service",   "Live Acts", 1191, 1025),
  img("g-9",  "/images/vibe-themed-nights.jpg",  "A themed night on the floor",                  "Live Acts", 1191, 1055),
  img("g-10", "/images/room-purple.jpg",         "A guest on the floor under purple light",      "Live Acts",  556,  699),
  img("g-11", "/images/gallery-paradiso.jpg",    "A guest at Paradiso against the red velvet",   "Paradiso",  1191, 1029),
  img("g-12", "/images/gallery-eden.jpg",        "A guest at Eden against the red velvet",       "Eden",      1191, 1025),
  img("g-13", "/images/ig-red-dress.jpg",        "Red on red against the velvet wall",           "Paradiso",  1290, 1727),
  img("g-14", "/images/ig-suit.jpg",             "Suited and shaded against the velvet wall",    "Eden",      1290, 1639),
  img("g-15", "/images/ig-red-light.jpg",        "Under the red light in the booth",             "Eden",      1290, 1657),
  img("g-16", "/images/event-paradiso.jpg",      "Paradiso event artwork",                       "Events",    1141, 1407),
  img("g-17", "/images/event-friday.jpg",        "Friday event artwork",                         "Events",    1141, 1417),
  img("g-18", "/images/event-one-night.jpg",     "One Night Only event artwork",                 "Events",    1141, 1417),
  img("g-19", "/images/event-delilah.jpg",       "Delilah event artwork",                        "Events",    1141, 1416),
  img("g-20", "/images/event-daughters.jpg",     "Daughters of Eve event artwork",               "Events",    1141, 1420),
];

/* ------------------------------------------------------------ testimonials */

/** Not published — the venue's own material carries no guest reviews. */
export const seedTestimonials: Testimonial[] = [];

/* ------------------------------------------------------------------- hours */
// Open Wednesday – Sunday, 8:00 PM until late.

export const seedHours: OpeningHour[] = [
  { id: "h-0", day_of_week: 0, opens_at: "16:00", closes_at: "02:00", note: "One Night Only from 4PM", is_closed: false },
  { id: "h-1", day_of_week: 1, opens_at: null, closes_at: null, note: null, is_closed: true },
  { id: "h-2", day_of_week: 2, opens_at: null, closes_at: null, note: null, is_closed: true },
  { id: "h-3", day_of_week: 3, opens_at: "20:00", closes_at: "02:00", note: null, is_closed: false },
  { id: "h-4", day_of_week: 4, opens_at: "20:00", closes_at: "02:00", note: null, is_closed: false },
  { id: "h-5", day_of_week: 5, opens_at: "20:00", closes_at: "04:00", note: null, is_closed: false },
  { id: "h-6", day_of_week: 6, opens_at: "20:00", closes_at: "04:00", note: null, is_closed: false },
];

/* ------------------------------------------------------------------- forms */

/** VIP onboarding — the first question the venue asks a new table. */
export const EXECUTION_LEVELS = [
  { value: "Casual Recon", label: "Casual Recon", hint: "Low key. Good drinks, good seats, no noise." },
  { value: "Full Send", label: "Full Send", hint: "We came to move. Front of the room, all night." },
  { value: "Legendary", label: "Legendary", hint: "Celebration or takeover. Make it unforgettable." },
] as const;

export const OCCASIONS = [
  "Birthday",
  "Anniversary",
  "Date Night",
  "Business Guests",
  "Celebration",
  "Just the Night",
  "Other",
] as const;

export const SEATING_PREFERENCES = [
  "No preference",
  "VIP Table",
  "Booth",
  "Bar Seating",
  "Standing / Floor",
] as const;

export const EVENT_TYPES = [
  "Birthday Party",
  "Corporate Night",
  "Product Launch",
  "Bottle Takeover",
  "Networking Event",
  "Private Celebration",
  "Other",
] as const;

export const BUDGET_RANGES = [
  "Under ₦500,000",
  "₦500,000 – ₦1,500,000",
  "₦1,500,000 – ₦5,000,000",
  "₦5,000,000+",
  "Not sure yet",
] as const;

export const POSITIONS = [
  "Bartender",
  "Waiter / Waitress",
  "Host",
  "Security",
  "DJ",
  "Kitchen",
  "Management",
  "Other",
] as const;
