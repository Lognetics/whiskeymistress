"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { AVAILABILITY_LABEL, formatPrice } from "@/lib/format";
import type { MenuItem, MenuSection } from "@/lib/types";

const AVAILABILITY_STYLE: Record<string, string> = {
  available: "border-emerald-400/25 text-emerald-200/85",
  limited: "border-amber-400/30 text-amber-200/90",
  sold_out: "border-red-400/30 text-red-200/85",
  seasonal: "border-sky-400/25 text-sky-200/85",
};

interface MenuBoardProps {
  sections: MenuSection[];
  /** Beverage cards are compact — no imagery-first layout. */
  variant?: "food" | "beverage";
}

export function MenuBoard({ sections, variant = "food" }: MenuBoardProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  const active = useMemo(
    () => sections.find((section) => section.id === activeId) ?? sections[0],
    [sections, activeId],
  );

  if (!active) {
    return (
      <p className="text-center text-muted">
        Our menu is being updated. Please call us for today&apos;s selection.
      </p>
    );
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Menu categories"
        className="-mx-6 flex snap-x gap-2 overflow-x-auto px-6 pb-3 [scrollbar-width:none] lg:mx-0 lg:flex-wrap lg:justify-center lg:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {sections.map((section) => {
          const selected = section.id === active.id;
          return (
            <button
              key={section.id}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`panel-${section.id}`}
              id={`tab-${section.id}`}
              onClick={() => setActiveId(section.id)}
              className={`relative shrink-0 snap-start rounded-full px-5 py-2.5 font-ui text-[0.74rem] uppercase tracking-[0.16em] transition-colors duration-400 ${
                selected
                  ? "text-ink"
                  : "border border-white/10 text-warm/65 hover:border-gold/40 hover:text-warm"
              }`}
            >
              {selected ? (
                <motion.span
                  layoutId={`menu-pill-${variant}`}
                  className="absolute inset-0 rounded-full bg-[linear-gradient(100deg,#a9862a,#d4af37,#a9862a)]"
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                />
              ) : null}
              <span className="relative">{section.name}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          id={`panel-${active.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${active.id}`}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12"
        >
          {active.description ? (
            <p className="mx-auto mb-10 max-w-xl text-center text-[0.92rem] italic text-muted">
              {active.description}
            </p>
          ) : null}

          <ul
            className={
              variant === "food"
                ? "grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
                : "grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            }
          >
            {active.items.map((item, i) => (
              <MenuCard key={item.id} item={item} index={i} variant={variant} />
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function MenuCard({
  item,
  index,
  variant,
}: {
  item: MenuItem;
  index: number;
  variant: "food" | "beverage";
}) {
  const soldOut = item.availability === "sold_out";

  return (
    <motion.li
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: Math.min(index * 0.05, 0.4),
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`group glass relative overflow-hidden rounded-[1.25rem] transition-all duration-500 hover:border-gold/35 hover:shadow-gold ${
        soldOut ? "opacity-65" : ""
      }`}
    >
      {item.image_url ? (
        <div
          className={`relative overflow-hidden ${
            variant === "food" ? "aspect-16/10" : "aspect-16/9"
          }`}
        >
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-108"
          />
          <div
            className="absolute inset-0 bg-[linear-gradient(to_top,rgba(11,11,11,0.85),rgba(11,11,11,0.1)_55%)]"
            aria-hidden
          />
          {item.is_signature ? (
            <span className="glass-gold absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-ui text-[0.6rem] uppercase tracking-[0.18em] text-champagne">
              <Sparkles className="size-3" aria-hidden />
              Signature
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-[1.15rem] leading-snug text-warm transition-colors group-hover:text-champagne">
            {item.name}
          </h3>
          <p className="shrink-0 font-ui text-[0.95rem] font-medium tracking-tight text-gold">
            {formatPrice(item.price_minor, item.currency)}
          </p>
        </div>

        {item.description ? (
          <p className="mt-3 text-[0.86rem] leading-relaxed text-muted">
            {item.description}
          </p>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full border px-2.5 py-1 font-ui text-[0.6rem] uppercase tracking-[0.16em] ${
              AVAILABILITY_STYLE[item.availability] ?? AVAILABILITY_STYLE.available
            }`}
          >
            {AVAILABILITY_LABEL[item.availability]}
          </span>

          {item.dietary_tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 px-2.5 py-1 font-ui text-[0.6rem] uppercase tracking-[0.16em] text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.li>
  );
}
