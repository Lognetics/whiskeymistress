"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  CalendarDays,
  ChefHat,
  Clock,
  Images,
  LayoutDashboard,
  LogOut,
  Mail,
  Megaphone,
  Menu,
  Settings,
  Sparkles,
  Tags,
  X,
} from "lucide-react";
import { useState } from "react";
import { signOut } from "@/lib/actions/admin";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/reservations", label: "Reservations", icon: CalendarDays },
  { href: "/admin/inquiries", label: "Private Events", icon: Mail },
  { href: "/admin/careers", label: "Applications", icon: Briefcase },
  { href: "/admin/menu", label: "Menu", icon: ChefHat },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/experiences", label: "Experiences", icon: Sparkles },
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { href: "/admin/hours", label: "Opening Hours", icon: Clock },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
] as const;

interface ShellProps {
  children: React.ReactNode;
  staffEmail: string | null;
  role: string | null;
  preview: boolean;
}

export function Shell({ children, staffEmail, role, preview }: ShellProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white/85">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/8 bg-[#0d0d0d]/95 px-5 py-3.5 backdrop-blur lg:hidden">
        <Link href="/admin" className="font-display text-[0.8075rem] tracking-[0.14em]">
          WM · ADMIN
        </Link>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? "Close navigation" : "Open navigation"}
          className="rounded-lg border border-white/12 p-2"
        >
          {open ? <X className="size-4" aria-hidden /> : <Menu className="size-4" aria-hidden />}
        </button>
      </header>

      <div className="flex">
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 overflow-y-auto border-r border-white/8 bg-[#111] transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="px-6 py-7">
            <Link href="/" className="block">
              <p className="font-display text-[0.8925rem] tracking-[0.16em] text-white/95">
                WHISKEY MISTRESS
              </p>
              <p className="mt-1.5 font-ui text-[0.493rem] uppercase tracking-[0.34em] text-gold/80">
                Control Room
              </p>
            </Link>
          </div>

          <nav aria-label="Dashboard" className="px-3 pb-6">
            <ul className="grid gap-0.5">
              {NAV.map(({ href, label, icon: Icon }) => {
                const active =
                  href === "/admin" ? pathname === href : pathname.startsWith(href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 font-ui text-[0.697rem] transition-colors ${
                        active
                          ? "bg-gold/12 text-gold"
                          : "text-white/55 hover:bg-white/5 hover:text-white/85"
                      }`}
                    >
                      <Icon className="size-4 shrink-0" aria-hidden />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-auto border-t border-white/8 px-5 py-5">
            {staffEmail ? (
              <>
                <p className="truncate font-ui text-[0.663rem] text-white/70">
                  {staffEmail}
                </p>
                <p className="mt-0.5 font-ui text-[0.527rem] uppercase tracking-[0.16em] text-white/35">
                  {role}
                </p>
                <form action={signOut} className="mt-4">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-lg border border-white/12 px-3.5 py-2 font-ui text-[0.6375rem] text-white/60 transition-colors hover:border-white/25 hover:text-white/85"
                  >
                    <LogOut className="size-3.5" aria-hidden />
                    Sign out
                  </button>
                </form>
              </>
            ) : (
              <p className="font-ui text-[0.6375rem] text-white/40">
                Preview mode — no database connected.
              </p>
            )}

            <Link
              href="/"
              className="mt-4 block font-ui text-[0.6375rem] text-gold/80 hover:text-gold"
            >
              ← View live site
            </Link>
          </div>
        </aside>

        {open ? (
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          />
        ) : null}

        <main className="min-w-0 flex-1 px-5 py-8 lg:px-10 lg:py-12">
          {preview ? (
            <p className="mb-8 rounded-xl border border-gold/25 bg-gold/8 px-5 py-4 font-ui text-[0.697rem] text-gold/90">
              Read-only preview. Add Supabase credentials to{" "}
              <code className="rounded bg-black/30 px-1.5 py-0.5">.env.local</code> to
              enable editing.
            </p>
          ) : null}
          {children}
        </main>
      </div>
    </div>
  );
}

export function PageHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8">
      <h1 className="font-display text-[1.615rem] leading-tight text-white/95">
        {title}
      </h1>
      {description ? (
        <p className="mt-2 max-w-2xl font-ui text-[0.731rem] leading-relaxed text-white/45">
          {description}
        </p>
      ) : null}
    </div>
  );
}
