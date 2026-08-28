"use client";

import Link from "next/link";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "motion/react";
import { ArrowUp, CalendarCheck, MessageCircle } from "lucide-react";
import { useState } from "react";

/** Appears once the hero is behind the guest — reservation, WhatsApp, top. */
export function FloatingActions({ whatsapp }: { whatsapp: string }) {
  const [visible, setVisible] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (value) => {
    setVisible(value > 700);
  });

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 no-print"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="glass rounded-full p-3 text-warm/80 transition-colors hover:border-gold/40 hover:text-gold"
          >
            <ArrowUp className="size-4" aria-hidden />
          </button>

          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noreferrer"
            aria-label="Chat with us on WhatsApp"
            className="glass rounded-full p-3.5 text-emerald-300/90 transition-colors hover:border-emerald-400/40 hover:text-emerald-200"
          >
            <MessageCircle className="size-5" aria-hidden />
          </a>

          <Link
            href="/reservations"
            className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(100deg,#a9862a,#d4af37,#a9862a)] bg-[length:200%_auto] px-6 py-3.5 font-ui text-[0.629rem] font-medium uppercase tracking-[0.18em] text-ink shadow-[0_18px_45px_-18px_rgba(212,175,55,0.85)] transition-all duration-500 hover:bg-[position:right_center]"
          >
            <CalendarCheck className="size-4" aria-hidden />
            <span className="hidden sm:inline">Reserve</span>
          </Link>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
