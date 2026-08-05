"use server";

import { createAdminSupabase, createServerSupabase } from "@/lib/supabase/server";
import type { FormState } from "./state";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  fieldErrors,
  inquirySchema,
  newsletterSchema,
  reservationSchema,
} from "@/lib/validation";

function readValues(formData: FormData) {
  const values: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string" && key !== "company_website") {
      values[key] = value;
    }
  }
  return values;
}

const PREVIEW_NOTE =
  "This site is running in preview mode without a database, so nothing was saved. Connect Supabase to start capturing submissions.";

/** Writes go through the service role: RLS allows anonymous insert, but using
 *  the admin client keeps behaviour identical whether or not anon key policies
 *  are later tightened. */
function writeClient() {
  return createAdminSupabase();
}

export async function submitReservation(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const values = readValues(formData);
  const parsed = reservationSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please check the highlighted fields and try again.",
      errors: fieldErrors(parsed.error),
      values,
    };
  }

  // Honeypot filled → silently accept without writing anything.
  if (parsed.data.company_website) {
    return { status: "success", message: "Thank you — your request has been received." };
  }

  const { company_website: _hp, ...row } = parsed.data;

  if (!isSupabaseConfigured) {
    return { status: "success", message: PREVIEW_NOTE };
  }

  const supabase = writeClient() ?? (await createServerSupabase());
  if (!supabase) return { status: "success", message: PREVIEW_NOTE };

  const { error } = await supabase.from("reservations").insert({
    ...row,
    occasion: row.occasion || null,
    seating_preference: row.seating_preference || null,
    special_requests: row.special_requests || null,
  });

  if (error) {
    return {
      status: "error",
      message:
        "We could not save your reservation. Please call us directly and we will seat you.",
      values,
    };
  }

  return {
    status: "success",
    message:
      "Your table request is in. Our reservations team will confirm by phone or email shortly.",
  };
}

export async function submitInquiry(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const values = readValues(formData);
  const parsed = inquirySchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please check the highlighted fields and try again.",
      errors: fieldErrors(parsed.error),
      values,
    };
  }

  if (parsed.data.company_website) {
    return { status: "success", message: "Thank you — your enquiry has been received." };
  }

  const { company_website: _hp, ...row } = parsed.data;

  if (!isSupabaseConfigured) {
    return { status: "success", message: PREVIEW_NOTE };
  }

  const supabase = writeClient() ?? (await createServerSupabase());
  if (!supabase) return { status: "success", message: PREVIEW_NOTE };

  const { error } = await supabase.from("private_event_inquiries").insert({
    ...row,
    company: row.company || null,
    preferred_date: row.preferred_date || null,
    budget_range: row.budget_range || null,
    message: row.message || null,
  });

  if (error) {
    return {
      status: "error",
      message: "We could not send your enquiry. Please email us and we will respond today.",
      values,
    };
  }

  return {
    status: "success",
    message:
      "Enquiry received. Our events team will be in touch within one business day with availability and a proposal.",
  };
}

export async function subscribeToNewsletter(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = newsletterSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { status: "error", message: "Enter a valid email address." };
  }

  if (!isSupabaseConfigured) {
    return { status: "success", message: "You're on the list." };
  }

  const supabase = writeClient() ?? (await createServerSupabase());
  if (!supabase) return { status: "success", message: "You're on the list." };

  const { error } = await supabase
    .from("newsletter_subscribers")
    .upsert({ email: parsed.data.email.toLowerCase() }, { onConflict: "email" });

  if (error) {
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  return { status: "success", message: "You're on the list. Watch for our next invitation." };
}
