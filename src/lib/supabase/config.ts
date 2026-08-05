export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * The whole site degrades gracefully: when Supabase is not configured we serve
 * the seed catalogue and put the admin dashboard into a read-only preview.
 */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const hasServiceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
