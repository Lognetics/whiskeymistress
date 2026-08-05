"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { z } from "zod";
import { requireStaff } from "@/lib/auth";
import type { AdminState } from "./state";
import { createServerSupabase } from "@/lib/supabase/server";
import {
  announcementSchema,
  categorySchema,
  eventSchema,
  experienceSchema,
  fieldErrors,
  galleryImageSchema,
  menuItemSchema,
  openingHourSchema,
  settingsSchema,
} from "@/lib/validation";
import {
  seedBeverageSections,
  seedExperiences,
  seedEvents,
  seedFoodSections,
  seedGallery,
  seedHours,
  seedSettings,
  seedTestimonials,
} from "@/lib/seed";

/** Every admin mutation refreshes both the dashboard and the public page. */
function revalidateAll() {
  revalidatePath("/", "layout");
}

function empty(value: unknown) {
  return typeof value === "string" && value.trim() === "" ? null : value;
}

async function guarded<T extends z.ZodTypeAny>(
  schema: T,
  formData: FormData,
  run: (
    data: z.infer<T>,
    supabase: NonNullable<Awaited<ReturnType<typeof createServerSupabase>>>,
  ) => Promise<{ error: { message: string } | null }>,
): Promise<AdminState> {
  try {
    await requireStaff();
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Not authorized.",
    };
  }

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      errors: fieldErrors(parsed.error),
    };
  }

  const supabase = await createServerSupabase();
  if (!supabase) {
    return { status: "error", message: "Database is not connected." };
  }

  const { error } = await run(parsed.data, supabase);
  if (error) return { status: "error", message: error.message };

  revalidateAll();
  return { status: "success", message: "Saved." };
}

/* ------------------------------------------------------------- menu items */

export async function saveMenuItem(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  return guarded(menuItemSchema, formData, async (data, supabase) => {
    const row = {
      category_id: data.category_id,
      name: data.name,
      description: empty(data.description),
      price_minor: Math.round(data.price_major * 100),
      currency: data.currency || "NGN",
      image_url: empty(data.image_url),
      availability: data.availability,
      is_signature: data.is_signature,
      dietary_tags: (data.dietary_tags ?? "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      sort_order: data.sort_order,
      is_published: data.is_published,
    };

    return data.id
      ? supabase.from("menu_items").update(row).eq("id", data.id)
      : supabase.from("menu_items").insert(row);
  });
}

/* -------------------------------------------------------------- categories */

export async function saveCategory(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  return guarded(categorySchema, formData, async (data, supabase) => {
    const row = {
      kind: data.kind,
      name: data.name,
      slug: data.slug,
      description: empty(data.description),
      sort_order: data.sort_order,
      is_published: data.is_published,
    };

    return data.id
      ? supabase.from("menu_categories").update(row).eq("id", data.id)
      : supabase.from("menu_categories").insert(row);
  });
}

/* ------------------------------------------------------------- experiences */

export async function saveExperience(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  return guarded(experienceSchema, formData, async (data, supabase) => {
    const row = {
      title: data.title,
      description: data.description,
      image_url: empty(data.image_url),
      capacity: empty(data.capacity),
      price_note: empty(data.price_note),
      cta_label: data.cta_label || "Book Now",
      sort_order: data.sort_order,
      is_published: data.is_published,
    };

    return data.id
      ? supabase.from("experiences").update(row).eq("id", data.id)
      : supabase.from("experiences").insert(row);
  });
}

/* ------------------------------------------------------------------ events */

export async function saveEvent(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  return guarded(eventSchema, formData, async (data, supabase) => {
    const row = {
      title: data.title,
      slug: data.slug,
      description: data.description ?? "",
      banner_url: empty(data.banner_url),
      event_date: data.event_date,
      start_time: data.start_time,
      end_time: empty(data.end_time),
      ticket_note: empty(data.ticket_note),
      is_featured: data.is_featured,
      is_published: data.is_published,
    };

    return data.id
      ? supabase.from("events").update(row).eq("id", data.id)
      : supabase.from("events").insert(row);
  });
}

/* ----------------------------------------------------------------- gallery */

export async function saveGalleryImage(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  return guarded(galleryImageSchema, formData, async (data, supabase) => {
    const row = {
      image_url: data.image_url,
      alt: data.alt,
      category: data.category,
      width: data.width,
      height: data.height,
      sort_order: data.sort_order,
      is_published: data.is_published,
    };

    return data.id
      ? supabase.from("gallery_images").update(row).eq("id", data.id)
      : supabase.from("gallery_images").insert(row);
  });
}

/* ----------------------------------------------------------- announcements */

export async function saveAnnouncement(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  return guarded(announcementSchema, formData, async (data, supabase) => {
    const row = {
      message: data.message,
      link_label: empty(data.link_label),
      link_href: empty(data.link_href),
      starts_at: empty(data.starts_at),
      ends_at: empty(data.ends_at),
      is_published: data.is_published,
    };

    return data.id
      ? supabase.from("announcements").update(row).eq("id", data.id)
      : supabase.from("announcements").insert(row);
  });
}

/* ---------------------------------------------------------------- settings */

export async function saveSettings(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  return guarded(settingsSchema, formData, async (data, supabase) =>
    supabase.from("site_settings").upsert({ id: "default", ...data }),
  );
}

export async function saveOpeningHour(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  return guarded(openingHourSchema, formData, async (data, supabase) =>
    supabase.from("opening_hours").upsert(
      {
        day_of_week: data.day_of_week,
        opens_at: data.is_closed ? null : empty(data.opens_at),
        closes_at: data.is_closed ? null : empty(data.closes_at),
        note: empty(data.note),
        is_closed: data.is_closed,
      },
      { onConflict: "day_of_week" },
    ),
  );
}

/* ------------------------------------------------------------- submissions */

export async function updateReservationStatus(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  try {
    await requireStaff();
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Not authorized.",
    };
  }

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const supabase = await createServerSupabase();
  if (!supabase || !id) {
    return { status: "error", message: "Database is not connected." };
  }

  const { error } = await supabase
    .from("reservations")
    .update({ status })
    .eq("id", id);

  if (error) return { status: "error", message: error.message };

  revalidatePath("/admin/reservations");
  return { status: "success", message: "Reservation updated." };
}

export async function updateInquiryStatus(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  try {
    await requireStaff();
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Not authorized.",
    };
  }

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const supabase = await createServerSupabase();
  if (!supabase || !id) {
    return { status: "error", message: "Database is not connected." };
  }

  const { error } = await supabase
    .from("private_event_inquiries")
    .update({ status })
    .eq("id", id);

  if (error) return { status: "error", message: error.message };

  revalidatePath("/admin/inquiries");
  return { status: "success", message: "Enquiry updated." };
}

/* ------------------------------------------------------------------ delete */

const DELETABLE = new Set([
  "menu_items",
  "menu_categories",
  "experiences",
  "events",
  "gallery_images",
  "announcements",
  "testimonials",
  "reservations",
  "private_event_inquiries",
]);

export async function deleteRecord(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  try {
    await requireStaff();
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Not authorized.",
    };
  }

  const table = String(formData.get("table") ?? "");
  const id = String(formData.get("id") ?? "");

  // Table name comes from the client, so it is checked against an allow-list
  // before it ever reaches the query builder.
  if (!DELETABLE.has(table) || !id) {
    return { status: "error", message: "That record cannot be deleted." };
  }

  const supabase = await createServerSupabase();
  if (!supabase) return { status: "error", message: "Database is not connected." };

  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) return { status: "error", message: error.message };

  revalidateAll();
  return { status: "success", message: "Deleted." };
}

/* ------------------------------------------------------------------- setup */

/** One-click import of the built-in catalogue into an empty Supabase project. */
export async function importSeedCatalogue(
  _prev: AdminState,
  _formData: FormData,
): Promise<AdminState> {
  try {
    await requireStaff();
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Not authorized.",
    };
  }

  const supabase = await createServerSupabase();
  if (!supabase) return { status: "error", message: "Database is not connected." };

  const { count } = await supabase
    .from("menu_categories")
    .select("*", { count: "exact", head: true });

  if (count && count > 0) {
    return {
      status: "error",
      message:
        "The menu already has categories. Clear them first if you want to re-import the starter catalogue.",
    };
  }

  const { id: _settingsId, ...settingsRow } = seedSettings;
  const steps: {
    label: string;
    run: () => PromiseLike<{ error: { message: string } | null }>;
  }[] = [
    {
      label: "settings",
      run: () =>
        supabase.from("site_settings").upsert({ id: "default", ...settingsRow }),
    },
    {
      label: "opening hours",
      run: () =>
        supabase.from("opening_hours").upsert(
          seedHours.map(({ id: _id, ...hour }) => hour),
          { onConflict: "day_of_week" },
        ),
    },
    {
      label: "experiences",
      run: () =>
        supabase
          .from("experiences")
          .insert(seedExperiences.map(({ id: _id, ...row }) => row)),
    },
    {
      label: "events",
      run: () =>
        supabase.from("events").insert(seedEvents.map(({ id: _id, ...row }) => row)),
    },
    {
      label: "gallery",
      run: () =>
        supabase
          .from("gallery_images")
          .insert(seedGallery.map(({ id: _id, ...row }) => row)),
    },
    {
      label: "testimonials",
      run: () =>
        supabase
          .from("testimonials")
          .insert(seedTestimonials.map(({ id: _id, ...row }) => row)),
    },
  ];

  for (const step of steps) {
    const { error } = await step.run();
    if (error) {
      return {
        status: "error",
        message: `Failed while importing ${step.label}: ${
          error.message ?? "unknown error"
        }`,
      };
    }
  }

  // Menu categories carry generated ids, so items are inserted per category.
  for (const section of [...seedFoodSections, ...seedBeverageSections]) {
    const { items, id: _id, ...category } = section;

    const { data: inserted, error: categoryError } = await supabase
      .from("menu_categories")
      .insert(category)
      .select("id")
      .single();

    if (categoryError || !inserted) {
      return {
        status: "error",
        message: `Failed while importing the ${section.name} category: ${
          categoryError?.message ?? "unknown error"
        }`,
      };
    }

    const { error: itemError } = await supabase.from("menu_items").insert(
      items.map(({ id: _itemId, category_id: _catId, ...item }) => ({
        ...item,
        category_id: inserted.id,
      })),
    );

    if (itemError) {
      return {
        status: "error",
        message: `Failed while importing ${section.name} items: ${itemError.message}`,
      };
    }
  }

  revalidateAll();
  return {
    status: "success",
    message: "Starter catalogue imported. Your site is now database-backed.",
  };
}

/* ------------------------------------------------------------------ signout */

export async function signOut() {
  const supabase = await createServerSupabase();
  await supabase?.auth.signOut();
  redirect("/admin/login");
}
