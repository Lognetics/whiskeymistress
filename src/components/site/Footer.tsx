import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Music2, Twitter } from "lucide-react";
import { NewsletterForm } from "./NewsletterForm";
import { ButtonLink } from "@/components/ui/Button";
import type { SiteSettings } from "@/lib/types";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/vibe", label: "The Vibe" },
  { href: "/menu", label: "Our Menu" },
  { href: "/live-acts", label: "Live Acts" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/reservations", label: "Claim a Table" },
  { href: "/private-events", label: "Private Events" },
  { href: "/contact", label: "Contact" },
  { href: "/careers", label: "Careers" },
] as const;

export function Footer({ settings }: { settings: SiteSettings }) {
  const socials = [
    { href: settings.instagram_url, icon: Instagram, label: "Instagram" },
    { href: settings.facebook_url, icon: Facebook, label: "Facebook" },
    { href: settings.x_url, icon: Twitter, label: "X" },
    { href: settings.tiktok_url, icon: Music2, label: "TikTok" },
  ].filter((social): social is typeof social & { href: string } =>
    Boolean(social.href),
  );

  return (
    <footer className="relative border-t border-line bg-charcoal/45 no-print">
      <div className="container-luxe py-20">
        <div className="glass-gold mb-16 flex flex-col items-center gap-6 rounded-[1.75rem] px-8 py-12 text-center">
          <h2 className="max-w-2xl font-display text-[clamp(1.36rem,2.89vw,2.125rem)] leading-tight text-warm">
Tonight deserves a better story.
          </h2>
          <ButtonLink href="/reservations" size="lg">
            Get Access
          </ButtonLink>
        </div>

        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex flex-col leading-none">
              <Image
                src="/images/logo-wordmark.png"
                alt={settings.brand_name}
                width={1063}
                height={541}
                className="h-12 w-auto"
              />
              <span className="mt-3 font-ui text-[0.493rem] uppercase tracking-[0.42em] text-gold/80">
                {settings.city} · {settings.country}
              </span>
            </Link>

            <p className="mt-6 max-w-sm text-[0.748rem] leading-relaxed text-muted">
              {settings.tagline}. {settings.address_line}, {settings.city}.
            </p>

            {socials.length ? (
              <ul className="mt-8 flex gap-3">
                {socials.map(({ href, icon: Icon, label }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      className="inline-flex rounded-full border border-white/12 p-3 text-warm/70 transition-all duration-500 hover:border-gold hover:text-gold"
                    >
                      <Icon className="size-4" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <nav aria-label="Footer" className="lg:col-span-4">
            <h2 className="font-ui text-[0.561rem] uppercase tracking-[0.26em] text-gold">
              Explore
            </h2>
            <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[0.731rem] text-muted transition-colors hover:text-champagne"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <h2 className="font-ui text-[0.561rem] uppercase tracking-[0.26em] text-gold">
              Stay In The Room
            </h2>
            <p className="mt-6 text-[0.731rem] leading-relaxed text-muted">
              Early access to event tables, seasonal menus and members-only
              evenings. No noise, only invitations.
            </p>
            <div className="mt-6">
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="rule-gold mt-16" aria-hidden />

        <div className="mt-8 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="font-ui text-[0.6375rem] text-muted">
            © {new Date().getFullYear()} {settings.brand_name}. All rights reserved.
          </p>
          <div className="flex gap-6 font-ui text-[0.6375rem] text-muted">
            <a
              href={`tel:${settings.phone.replace(/\s/g, "")}`}
              className="transition-colors hover:text-champagne"
            >
              {settings.phone}
            </a>
            <a
              href={`mailto:${settings.email}`}
              className="transition-colors hover:text-champagne"
            >
              {settings.email}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
