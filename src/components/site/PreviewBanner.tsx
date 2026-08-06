import { Database } from "lucide-react";

/**
 * Shown only when the site is running without Supabase credentials, so it is
 * obvious that content is coming from the built-in catalogue.
 */
export function PreviewBanner() {
  return (
    <div className="border-b border-line bg-charcoal/80 no-print">
      <div className="container-luxe flex flex-wrap items-center justify-center gap-x-3 gap-y-1 py-2 text-center">
        <Database className="size-3.5 text-gold" aria-hidden />
        <p className="font-ui text-[0.612rem] text-muted">
          Preview mode — content is served from the built-in catalogue.
        </p>
        <a
          href="/admin"
          className="font-ui text-[0.612rem] text-gold underline underline-offset-4"
        >
          Connect a database
        </a>
      </div>
    </div>
  );
}
