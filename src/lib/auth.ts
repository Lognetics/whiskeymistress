import "server-only";

import { cache } from "react";
import { createServerSupabase } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";

export interface StaffSession {
  userId: string;
  email: string;
  fullName: string | null;
  role: "staff" | "manager" | "owner";
}

export type AdminAccess =
  /** No Supabase project connected — dashboard is a read-only tour. */
  | { mode: "preview"; staff: null }
  | { mode: "unauthenticated"; staff: null }
  /** Signed in, but no row in staff_members. */
  | { mode: "forbidden"; staff: null; email: string }
  | { mode: "authorized"; staff: StaffSession };

export const getAdminAccess = cache(async (): Promise<AdminAccess> => {
  if (!isSupabaseConfigured) return { mode: "preview", staff: null };

  const supabase = await createServerSupabase();
  if (!supabase) return { mode: "preview", staff: null };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { mode: "unauthenticated", staff: null };

  const { data: member } = await supabase
    .from("staff_members")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!member) {
    return { mode: "forbidden", staff: null, email: user.email ?? "" };
  }

  return {
    mode: "authorized",
    staff: {
      userId: member.id,
      email: member.email ?? user.email ?? "",
      fullName: member.full_name ?? null,
      role: member.role,
    },
  };
});

/** Throws unless the caller is authorized staff. Guards every write action. */
export async function requireStaff(): Promise<StaffSession> {
  const access = await getAdminAccess();
  if (access.mode !== "authorized") {
    throw new Error(
      access.mode === "preview"
        ? "Connect a Supabase project before saving changes."
        : "You do not have permission to perform this action.",
    );
  }
  return access.staff;
}
