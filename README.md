# Whiskey Mistress

A luxury dining, lounge and entertainment landing page for Whiskey Mistress,
Abuja — with a full staff dashboard behind it.

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Motion ·
Supabase (Postgres + Auth + Storage).

---

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

**No configuration is needed to see the finished site.** Without Supabase
credentials the app runs in *preview mode*: every section renders from the
built-in catalogue in [`src/lib/seed.ts`](src/lib/seed.ts), forms accept input
and confirm without writing anywhere, and `/admin` is a read-only tour of the
dashboard.

---

## Connecting a database

1. Create a Supabase project.
2. Run [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql)
   — SQL Editor, or `supabase db push`. It creates every table, the row-level
   security policies, and a public `media` storage bucket.
3. Copy `.env.example` to `.env.local` and fill in:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...        # server-only
   NEXT_PUBLIC_SITE_URL=https://whiskeymistress.com
   ```

4. Create your first staff login: **Authentication → Users → Add user**, then
   authorise it:

   ```sql
   insert into staff_members (id, email, full_name, role)
   values ('<the-new-user-uuid>', 'manager@whiskeymistress.com', 'Manager', 'owner');
   ```

5. Restart, sign in at `/admin/login`, and click **Import starter catalogue** on
   the dashboard. That copies the entire demo menu, beverage list, experiences,
   events, gallery, testimonials, hours and site copy into your database. Edit
   from there.

### Optional environment

| Variable | Effect |
| --- | --- |
| `NEXT_PUBLIC_HERO_VIDEO_URL` | Plays a looping video behind the hero instead of the parallax image stack. |
| `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY` | Removes the "for development" watermark from the contact map. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Loads Google Analytics. |

---

## The dashboard

`/admin` — staff only, `noindex`, and excluded in `robots.txt`.

| Screen | What it controls |
| --- | --- |
| Overview | Covers booked today, pending reservations, new enquiries, subscriber count, next bookings, starter-catalogue import |
| Reservations | Every table request; status changes save inline |
| Private Events | Event enquiries with contact details and status pipeline |
| Food Menu / Beverage Menu | Items, prices, images, availability, dietary tags, signature flag, publish state |
| Categories | The tabs guests browse on both menus |
| Experiences | The VIP Experience cards |
| Events | Upcoming events; only today-or-later publish to the site |
| Gallery | Images, alt text, filter categories |
| Announcements | The gold bar above the navigation, with optional date window |
| Opening Hours | Per-day hours and notes — also feeds the search-engine structured data |
| Site Settings | Brand copy, hero headline, About story, contact details, social links |

Prices are entered in whole naira and stored in kobo (`price_minor`), so no
floating-point drift.

### Security model

- **Content tables** — world-readable when `is_published`, staff-writable.
- **Submission tables** (reservations, enquiries, subscribers) — anonymous
  `INSERT` only. Guests can never read another guest's booking; only staff can
  select, update or delete.
- Staff access is a row in `staff_members`, checked by the `is_staff()` SQL
  function used across every policy. A signed-in user without that row gets an
  explicit "not authorised" screen, not the dashboard.
- Every write server action calls `requireStaff()` before touching the database.
- The delete action validates the table name against an allow-list.
- Both public forms carry an off-screen honeypot field.

---

## Structure

```
src/
  app/
    page.tsx            the landing page (all sections assembled)
    layout.tsx          fonts, metadata, skip link, analytics
    sitemap.ts robots.ts not-found.tsx
    admin/              dashboard routes
  components/
    site/               Hero, About, MenuBoard, Events, Gallery, forms, Footer…
    admin/              Shell, ResourceManager, SettingsForm, editors
    ui/                 Reveal, Section, Button, Field, Lightbox
  lib/
    types.ts            domain types, mirroring the SQL schema
    seed.ts             built-in catalogue (preview mode + starter import)
    content.ts          reads — Supabase with seed fallback
    actions/            server actions (public forms, admin CRUD)
    validation.ts       zod schemas for every form
    auth.ts             staff session + requireStaff guard
    format.ts           naira, dates, times (Africa/Lagos)
  middleware.ts         refreshes the staff session, gates /admin
supabase/migrations/    schema, RLS, storage bucket
```

`ResourceManager` is the generic CRUD surface — a list plus a slide-over editor
driven by a field descriptor array. Adding a managed resource means writing a
`FieldDef[]` and a save action, not another screen.

---

## Design notes

Matte black (`#0B0B0B`) canvas, metallic gold (`#D4AF37`) and champagne accents,
warm white type. Playfair Display for headings, Poppins for body, Inter for UI —
all self-hosted through `next/font`. Design tokens live in the `@theme` block of
[`src/app/globals.css`](src/app/globals.css).

Motion is scroll-triggered and restrained: a parallax hero with a slow Ken Burns
drift, one-shot reveals on section entry, and shared-layout pills on the menu and
gallery filters. Every animation is disabled under `prefers-reduced-motion`.

Accessibility: skip link, labelled landmarks and form controls, gold focus rings
on keyboard focus only, `aria-live` on form results, a focus-trapped lightbox
with arrow-key and swipe navigation, and `aria-current` on the active nav item.

SEO: per-page metadata, Open Graph and Twitter cards, `Restaurant` + `Event`
JSON-LD built from live content, sitemap and robots.

---

## Images

The seed catalogue points at Unsplash URLs so the site looks finished
immediately. **Replace these with the venue's own photography before launch** —
upload to the `media` bucket in Supabase Storage and paste the public URLs into
the dashboard. Contact details, address, phone and social handles in
`seedSettings` are placeholders and must be replaced with the real ones.

---

## Scripts

```bash
npm run dev        # dev server
npm run build      # production build
npm run start      # serve the build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```
