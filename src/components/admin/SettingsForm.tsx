"use client";

import { Loader2 } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { saveSettings } from "@/lib/actions/admin";
import { initialAdminState } from "@/lib/actions/state";
import type { SiteSettings } from "@/lib/types";

const CONTROL =
  "w-full rounded-lg border border-white/12 bg-white/[0.03] px-3.5 py-2.5 font-ui text-[0.86rem] text-white/90 placeholder:text-white/25 outline-none transition-colors focus:border-gold/70 disabled:opacity-50 aria-[invalid=true]:border-red-400/70";

interface FieldSpec {
  name: keyof SiteSettings;
  label: string;
  type?: "text" | "textarea" | "url" | "email" | "number";
  span?: 1 | 2;
  rows?: number;
  hint?: string;
}

const GROUPS: { heading: string; fields: FieldSpec[] }[] = [
  {
    heading: "Brand",
    fields: [
      { name: "brand_name", label: "Brand name" },
      { name: "tagline", label: "Tagline" },
      { name: "hero_headline", label: "Hero headline", type: "textarea", span: 2, rows: 2 },
      {
        name: "hero_subheadline",
        label: "Hero supporting text",
        type: "textarea",
        span: 2,
        rows: 3,
      },
    ],
  },
  {
    heading: "About",
    fields: [
      { name: "about_heading", label: "About heading", span: 2 },
      {
        name: "about_body",
        label: "About story",
        type: "textarea",
        span: 2,
        rows: 9,
        hint: "Separate paragraphs with a blank line.",
      },
      { name: "about_image_url", label: "About image URL", type: "url", span: 2 },
    ],
  },
  {
    heading: "Contact",
    fields: [
      { name: "address_line", label: "Address", span: 2 },
      { name: "city", label: "City" },
      { name: "country", label: "Country" },
      { name: "phone", label: "Phone" },
      {
        name: "whatsapp",
        label: "WhatsApp number",
        hint: "Digits only, with country code — e.g. 2348000000000.",
      },
      { name: "email", label: "Email", type: "email" },
      {
        name: "maps_query",
        label: "Google Maps search",
        hint: "What to search for on the embedded map.",
      },
    ],
  },
  {
    heading: "Social",
    fields: [
      { name: "instagram_url", label: "Instagram", type: "url" },
      { name: "facebook_url", label: "Facebook", type: "url" },
      { name: "x_url", label: "X", type: "url" },
      { name: "tiktok_url", label: "TikTok", type: "url" },
    ],
  },
  {
    heading: "Reservations",
    fields: [
      {
        name: "reservation_lead_time_hours",
        label: "Lead time (hours)",
        type: "number",
        hint: "Shown as guidance on the reservation form.",
      },
      {
        name: "max_party_size",
        label: "Max party size",
        type: "number",
        hint: "Largest option in the guests dropdown.",
      },
    ],
  },
];

export function SettingsForm({
  settings,
  readOnly,
}: {
  settings: SiteSettings;
  readOnly: boolean;
}) {
  const [state, action] = useActionState(saveSettings, initialAdminState);

  return (
    <form action={action} className="grid gap-10">
      {state.message ? (
        <p
          role="status"
          className={`rounded-lg border px-4 py-3 font-ui text-[0.84rem] ${
            state.status === "error"
              ? "border-red-400/25 bg-red-500/10 text-red-200"
              : "border-emerald-400/25 bg-emerald-500/10 text-emerald-200"
          }`}
        >
          {state.status === "success" ? "Settings saved." : state.message}
        </p>
      ) : null}

      {GROUPS.map((group) => (
        <section
          key={group.heading}
          aria-labelledby={`${group.heading}-heading`}
          className="rounded-xl border border-white/8 bg-white/[0.02] p-6"
        >
          <h2
            id={`${group.heading}-heading`}
            className="mb-6 font-ui text-[0.7rem] uppercase tracking-[0.22em] text-gold/80"
          >
            {group.heading}
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
            {group.fields.map((field) => {
              const value = settings[field.name];
              const error = state.errors?.[field.name];
              return (
                <div
                  key={field.name}
                  className={field.span === 2 ? "sm:col-span-2" : ""}
                >
                  <label
                    htmlFor={field.name}
                    className="mb-2 block font-ui text-[0.68rem] uppercase tracking-[0.16em] text-white/45"
                  >
                    {field.label}
                  </label>

                  {field.type === "textarea" ? (
                    <textarea
                      id={field.name}
                      name={field.name}
                      rows={field.rows ?? 4}
                      defaultValue={String(value ?? "")}
                      disabled={readOnly}
                      aria-invalid={error ? true : undefined}
                      aria-describedby={error ? `${field.name}-error` : undefined}
                      className={`${CONTROL} resize-y`}
                    />
                  ) : (
                    <input
                      id={field.name}
                      name={field.name}
                      type={field.type ?? "text"}
                      defaultValue={String(value ?? "")}
                      disabled={readOnly}
                      aria-invalid={error ? true : undefined}
                      aria-describedby={error ? `${field.name}-error` : undefined}
                      className={CONTROL}
                    />
                  )}

                  {error ? (
                    <p
                      id={`${field.name}-error`}
                      role="alert"
                      className="mt-1.5 text-[0.75rem] text-red-300"
                    >
                      {error}
                    </p>
                  ) : field.hint ? (
                    <p className="mt-1.5 text-[0.75rem] text-white/35">{field.hint}</p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <div className="sticky bottom-0 -mx-5 border-t border-white/8 bg-[#0d0d0d]/95 px-5 py-4 backdrop-blur lg:-mx-10 lg:px-10">
        <SaveButton disabled={readOnly} />
      </div>
    </form>
  );
}

function SaveButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="inline-flex items-center gap-2 rounded-lg bg-gold px-7 py-3 font-ui text-[0.82rem] font-medium text-ink transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
    >
      {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
      Save settings
    </button>
  );
}
