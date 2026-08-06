"use client";

import { Loader2, Sprout } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { importSeedCatalogue } from "@/lib/actions/admin";
import { initialAdminState } from "@/lib/actions/state";

/**
 * Fills an empty Supabase project with the built-in catalogue so a new venue
 * starts from a full site rather than blank tables.
 */
export function SeedImporter({ disabled = false }: { disabled?: boolean }) {
  const [state, action] = useActionState(importSeedCatalogue, initialAdminState);

  return (
    <section
      aria-labelledby="seed-heading"
      className="mb-10 rounded-xl border border-white/8 bg-white/[0.02] p-6"
    >
      <div className="flex items-start gap-4">
        <span className="rounded-lg border border-gold/25 bg-gold/8 p-2.5">
          <Sprout className="size-4 text-gold" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="seed-heading" className="font-display text-lg text-white/90">
            Import the starter catalogue
          </h2>
          <p className="mt-2 max-w-2xl font-ui text-[0.714rem] leading-relaxed text-white/45">
            Copies the full demo menu, beverage list, experiences, events, gallery,
            testimonials, opening hours and site copy into your database. Runs only
            while the menu is still empty.
          </p>

          {state.message ? (
            <p
              role="status"
              className={`mt-4 rounded-lg border px-4 py-3 font-ui text-[0.697rem] ${
                state.status === "error"
                  ? "border-red-400/25 bg-red-500/10 text-red-200"
                  : "border-emerald-400/25 bg-emerald-500/10 text-emerald-200"
              }`}
            >
              {state.message}
            </p>
          ) : null}

          <form action={action} className="mt-5">
            <ImportButton disabled={disabled} />
          </form>
        </div>
      </div>
    </section>
  );
}

function ImportButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="inline-flex items-center gap-2 rounded-lg border border-gold/40 px-5 py-2.5 font-ui text-[0.68rem] text-gold transition-colors hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-45"
    >
      {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
      {disabled ? "Connect a database first" : "Import starter catalogue"}
    </button>
  );
}
