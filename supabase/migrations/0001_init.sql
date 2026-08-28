-- ===========================================================================
-- Whiskey Mistress — schema
--
-- Apply with the Supabase CLI (`supabase db push`) or paste into the SQL
-- editor of a fresh project, then run `supabase/seed.sql`.
-- ===========================================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------------- enums

do $$ begin
  create type availability_status as enum ('available', 'limited', 'sold_out', 'seasonal');
exception when duplicate_object then null; end $$;

do $$ begin
  create type reservation_status as enum ('pending', 'confirmed', 'seated', 'cancelled', 'no_show');
exception when duplicate_object then null; end $$;

do $$ begin
  create type inquiry_status as enum ('new', 'in_progress', 'won', 'lost');
exception when duplicate_object then null; end $$;

do $$ begin
  create type application_status as enum ('new', 'reviewing', 'hired', 'rejected');
exception when duplicate_object then null; end $$;

-- --------------------------------------------------------------- staff acl

-- A row here grants dashboard access. Create the auth user first (Dashboard →
-- Authentication → Add user), then insert their id below.
create table if not exists staff_members (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'staff' check (role in ('staff', 'manager', 'owner')),
  created_at timestamptz not null default now()
);

create or replace function is_staff()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from staff_members where id = auth.uid());
$$;

-- ---------------------------------------------------------------- content

create table if not exists site_settings (
  id text primary key default 'default',
  brand_name text not null default 'Whiskey Mistress',
  tagline text not null default '',
  hero_headline text not null default '',
  hero_subheadline text not null default '',
  about_heading text not null default '',
  about_body text not null default '',
  about_image_url text,
  address_line text not null default '',
  city text not null default 'Abuja',
  country text not null default 'Nigeria',
  phone text not null default '',
  whatsapp text not null default '',
  email text not null default '',
  maps_query text not null default '',
  instagram_url text,
  facebook_url text,
  x_url text,
  tiktok_url text,
  reservation_lead_time_hours int not null default 3,
  max_party_size int not null default 30,
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = 'default')
);

-- One ordered menu. `eyebrow` is the small-caps label printed above the
-- section title, e.g. TABLE SERVICE above "Bottle Service".
create table if not exists menu_categories (
  id uuid primary key default gen_random_uuid(),
  eyebrow text not null default '',
  name text not null,
  slug text not null unique,
  description text,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references menu_categories (id) on delete cascade,
  name text not null,
  description text,
  price_minor int not null default 0 check (price_minor >= 0),
  currency text not null default 'NGN',
  image_url text,
  availability availability_status not null default 'available',
  is_signature boolean not null default false,
  dietary_tags text[] not null default '{}',
  -- Optional sub-heading inside a category: WHISKEY / COGNAC / BUBBLY / SPIRITS.
  group_label text,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists menu_items_category_idx on menu_items (category_id, sort_order);

create table if not exists experiences (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  image_url text,
  capacity text,
  price_note text,
  cta_label text not null default 'Book Now',
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  banner_url text,
  event_date date not null,
  start_time time not null,
  end_time time,
  ticket_note text,
  is_featured boolean not null default false,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists events_date_idx on events (event_date);

create table if not exists gallery_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  alt text not null default '',
  category text not null default 'Interior',
  width int not null default 1400,
  height int not null default 933,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null,
  guest_title text,
  avatar_url text,
  rating int not null default 5 check (rating between 1 and 5),
  quote text not null,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists announcements (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  link_label text,
  link_href text,
  starts_at timestamptz,
  ends_at timestamptz,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists opening_hours (
  id uuid primary key default gen_random_uuid(),
  day_of_week int not null unique check (day_of_week between 0 and 6),
  opens_at time,
  closes_at time,
  note text,
  is_closed boolean not null default false
);

-- ------------------------------------------------------------- submissions

create table if not exists reservations (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text not null,
  reservation_date date not null,
  reservation_time time not null,
  party_size int not null check (party_size > 0),
  occasion text,
  seating_preference text,
  special_requests text,
  status reservation_status not null default 'pending',
  created_at timestamptz not null default now()
);

create index if not exists reservations_date_idx on reservations (reservation_date desc);

create table if not exists private_event_inquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text not null,
  company text,
  event_type text not null,
  preferred_date date,
  guest_count int not null check (guest_count > 0),
  budget_range text,
  message text,
  status inquiry_status not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists job_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  position text not null,
  resume_url text,
  previous_employment text,
  status application_status not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------- RLS
--
-- Content tables: world-readable when published, staff-writable.
-- Submission tables: anonymous INSERT only, staff read/update. Guests can
-- never read another guest's reservation.

alter table staff_members enable row level security;
alter table site_settings enable row level security;
alter table menu_categories enable row level security;
alter table menu_items enable row level security;
alter table experiences enable row level security;
alter table events enable row level security;
alter table gallery_images enable row level security;
alter table testimonials enable row level security;
alter table announcements enable row level security;
alter table opening_hours enable row level security;
alter table reservations enable row level security;
alter table private_event_inquiries enable row level security;
alter table job_applications enable row level security;
alter table newsletter_subscribers enable row level security;

do $$
declare
  t text;
begin
  -- Published content is readable by anyone; staff may do anything.
  foreach t in array array[
    'menu_categories', 'menu_items', 'experiences', 'events',
    'gallery_images', 'testimonials', 'announcements'
  ] loop
    execute format('drop policy if exists %I_public_read on %I', t, t);
    execute format(
      'create policy %I_public_read on %I for select using (is_published or is_staff())', t, t);
    execute format('drop policy if exists %I_staff_write on %I', t, t);
    execute format(
      'create policy %I_staff_write on %I for all using (is_staff()) with check (is_staff())', t, t);
  end loop;

  -- Always-public content (no publish flag).
  foreach t in array array['site_settings', 'opening_hours'] loop
    execute format('drop policy if exists %I_public_read on %I', t, t);
    execute format('create policy %I_public_read on %I for select using (true)', t, t);
    execute format('drop policy if exists %I_staff_write on %I', t, t);
    execute format(
      'create policy %I_staff_write on %I for all using (is_staff()) with check (is_staff())', t, t);
  end loop;

  -- Guest submissions: insert-only for the public.
  foreach t in array array[
    'reservations', 'private_event_inquiries', 'newsletter_subscribers',
    'job_applications'
  ] loop
    execute format('drop policy if exists %I_public_insert on %I', t, t);
    execute format('create policy %I_public_insert on %I for insert with check (true)', t, t);
    execute format('drop policy if exists %I_staff_read on %I', t, t);
    execute format('create policy %I_staff_read on %I for select using (is_staff())', t, t);
    execute format('drop policy if exists %I_staff_update on %I', t, t);
    execute format(
      'create policy %I_staff_update on %I for update using (is_staff()) with check (is_staff())', t, t);
    execute format('drop policy if exists %I_staff_delete on %I', t, t);
    execute format('create policy %I_staff_delete on %I for delete using (is_staff())', t, t);
  end loop;
end $$;

drop policy if exists staff_read_self on staff_members;
create policy staff_read_self on staff_members
  for select using (id = auth.uid() or is_staff());

-- --------------------------------------------------------------- storage
-- Public bucket for CMS-uploaded menu, event and gallery imagery.

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists media_public_read on storage.objects;
create policy media_public_read on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists media_staff_write on storage.objects;
create policy media_staff_write on storage.objects
  for all using (bucket_id = 'media' and is_staff())
  with check (bucket_id = 'media' and is_staff());
