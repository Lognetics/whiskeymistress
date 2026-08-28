"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "motion/react";
import { Menu, Phone, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Announcement } from "@/lib/types";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/vibe", label: "The Vibe" },
  { href: "/menu", label: "Liquid Assets" },
  { href: "/live-acts", label: "Live Acts" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/reservations", label: "Claims" },
  { href: "/contact", label: "Contact" },
  { href: "/careers", label: "Careers" },
] as const;

interface NavbarProps {
  brandName: string;
  phone: string;
  announcement: Announcement | null;
}

export function Navbar({ brandName, phone, announcement }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const [drawerTop, setDrawerTop] = useState(0);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (value) => {
    setScrolled(value > 40);
  });

  // Anchor the drawer to the header's real bottom edge rather than the top of
  // the viewport, so a long link list can never ride up under the wordmark.
  useEffect(() => {
    if (!open) return;
    const measure = () =>
      setDrawerTop(headerRef.current?.getBoundingClientRect().bottom ?? 0);
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, [open]);

  // Lock the page behind the mobile drawer.
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  return (
    <>
      {announcement ? (
        <div className="relative z-50 bg-[linear-gradient(90deg,#8a7024,#d4af37,#8a7024)] text-ink no-print">
          <div className="container-luxe flex items-center justify-center gap-3 py-2 text-center">
            <p className="font-ui text-[0.612rem] font-medium tracking-wide sm:text-[0.663rem]">
              {announcement.message}
              {announcement.link_href && announcement.link_label ? (
                <Link
                  href={announcement.link_href}
                  className="ml-2 underline underline-offset-4 hover:opacity-70"
                >
                  {announcement.link_label}
                </Link>
              ) : null}
            </p>
          </div>
        </div>
      ) : null}

      <motion.header
        ref={headerRef}
        className={`sticky top-0 z-50 no-print transition-all duration-500 ${
          scrolled
            ? "glass border-b border-line shadow-[0_10px_40px_-20px_rgba(0,0,0,0.9)]"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav
          aria-label="Primary"
          className="container-luxe flex items-center justify-between"
          style={{ height: "var(--nav-height)" }}
        >
          <Link
            href="/"
            className="group flex flex-col leading-none"
            aria-label={`${brandName} home`}
          >
            <Image
              src="/images/logo-wordmark.png"
              alt={brandName}
              width={1063}
              height={541}
              priority
              className="h-9 w-auto lg:h-10"
            />
          </Link>

          <ul className="hidden items-center gap-1 xl:flex">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={pathname === link.href ? "true" : undefined}
                  className={`relative rounded-full px-3.5 py-2 font-ui text-[0.629rem] uppercase tracking-[0.16em] transition-colors duration-300 ${
                    pathname === link.href
                      ? "text-gold"
                      : "text-warm/70 hover:text-warm"
                  }`}
                >
                  {link.label}
                  {pathname === link.href ? (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-3.5 -bottom-0.5 h-px bg-gold"
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    />
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="hidden items-center gap-2 font-ui text-[0.646rem] text-warm/75 transition-colors hover:text-gold 2xl:flex"
            >
              <Phone className="size-3.5" aria-hidden />
              {phone}
            </a>

            <Link
              href="/reservations"
              className="hidden rounded-full bg-[linear-gradient(100deg,#a9862a,#d4af37,#a9862a)] bg-[length:200%_auto] px-6 py-2.5 font-ui text-[0.629rem] font-medium uppercase tracking-[0.16em] text-ink transition-all duration-500 hover:bg-[position:right_center] sm:block"
            >
              Get Access
            </Link>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="rounded-full border border-white/12 p-2.5 text-warm transition-colors hover:border-gold hover:text-gold xl:hidden"
            >
              {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            className="fixed inset-x-0 bottom-0 z-40 overflow-y-auto overscroll-contain bg-ink/97 backdrop-blur-2xl xl:hidden"
            style={{ top: drawerTop }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Centres when it fits, scrolls when it does not. */}
            <div className="flex min-h-full flex-col justify-center px-8 py-8">
            <ul className="flex flex-col gap-1">
              {LINKS.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.04, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-white/6 py-3.5 font-display text-xl text-warm transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>

            <motion.div
              className="mt-8 flex flex-col gap-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <Link
                href="/reservations"
                onClick={() => setOpen(false)}
                className="rounded-full bg-gold px-8 py-4 text-center font-ui text-[0.68rem] font-medium uppercase tracking-[0.2em] text-ink"
              >
                Get Access
              </Link>
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="rounded-full border border-gold/40 px-8 py-4 text-center font-ui text-[0.68rem] uppercase tracking-[0.2em] text-champagne"
              >
                {phone}
              </a>
            </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
