"use client";

import { AnimatePresence, motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { formatPrice } from "@/lib/format";
import { MENU_NOTICE } from "@/lib/seed";
import type { MenuItem, MenuSection } from "@/lib/types";

/**
 * The full price list. Every item the venue sells, grouped exactly as the
 * printed menu groups it: a category (Bottle Service, Grills, Cocktails,
 * Beverages, Puffs), optionally split into labelled groups (Whiskey, Cognac,
 * Bubbly, Spirits).
 */
export function PriceList({ sections }: { sections: MenuSection[] }) {
  const [activeId, setActiveId] = useState<string>("all");

  const visible = useMemo(
    () =>
      activeId === "all"
        ? sections
        : sections.filter((section) => section.id === activeId),
    [sections, activeId],
  );

  if (!sections.length) {
    return (
      <p className="text-center text-muted">
        The menu is being updated. Please call us for tonight&apos;s list.
      </p>
    );
  }

  const tabs = [{ id: "all", name: "Everything" }, ...sections];

  return (
    <div>
      <div
        role="tablist"
        aria-label="Menu sections"
        className="-mx-6 flex snap-x gap-2 overflow-x-auto px-6 pb-3 [scrollbar-width:none] lg:mx-0 lg:flex-wrap lg:justify-center lg:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map((tab) => {
          const selected = tab.id === activeId;
          return (
            <button
              key={tab.id}
              role="tab"
              type="button"
              aria-selected={selected}
              onClick={() => setActiveId(tab.id)}
              className={`relative shrink-0 snap-start rounded-full px-5 py-2.5 font-ui text-[0.629rem] uppercase tracking-[0.16em] transition-colors duration-400 ${
                selected
                  ? "text-ink"
                  : "border border-white/10 text-warm/65 hover:border-gold/40 hover:text-warm"
              }`}
            >
              {selected ? (
                <motion.span
                  layoutId="price-pill"
                  className="absolute inset-0 rounded-full bg-[linear-gradient(100deg,#a9862a,#d4af37,#a9862a)]"
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                />
              ) : null}
              <span className="relative">{tab.name}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeId}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 grid gap-14 lg:grid-cols-2 lg:gap-x-16"
        >
          {visible.map((section) => (
            <section
              key={section.id}
              aria-labelledby={`menu-${section.slug}`}
              // Bottle service is long — let it run the full width on its own.
              className={section.groups.length > 1 ? "lg:col-span-2" : ""}
            >
              <header className="mb-7">
                <p className="font-ui text-[0.578rem] uppercase tracking-[0.34em] text-gold/80">
                  {section.eyebrow}
                </p>
                <h3
                  id={`menu-${section.slug}`}
                  className="mt-2.5 font-display text-[1.615rem] text-warm"
                >
                  {section.name}
                </h3>
                {section.description ? (
                  <p className="mt-2.5 text-[0.731rem] italic text-muted">
                    {section.description}
                  </p>
                ) : null}
              </header>

              <div
                className={
                  section.groups.length > 1
                    ? "grid gap-x-16 gap-y-10 md:grid-cols-2"
                    : ""
                }
              >
                {section.groups.map((group, gi) => (
                  <div key={group.label ?? `g-${gi}`}>
                    {group.label ? (
                      <p className="mb-3 font-ui text-[0.561rem] uppercase tracking-[0.28em] text-gold">
                        {group.label}
                      </p>
                    ) : null}

                    <ul className="divide-y divide-white/6 border-t border-white/6">
                      {group.items.map((entry) => (
                        <PriceRow key={entry.id} item={entry} />
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </motion.div>
      </AnimatePresence>

      <p className="mt-16 border-t border-line pt-8 text-center font-ui text-[0.646rem] uppercase leading-relaxed tracking-[0.14em] text-muted">
        {MENU_NOTICE}
      </p>
    </div>
  );
}

function PriceRow({ item }: { item: MenuItem }) {
  const soldOut = item.availability === "sold_out";

  return (
    <li className={`group py-3.5 ${soldOut ? "opacity-45" : ""}`}>
      <div className="flex items-baseline gap-3">
        <span className="flex min-w-0 items-baseline gap-2">
          <span className="font-ui text-[0.782rem] uppercase tracking-[0.06em] text-warm/90 transition-colors group-hover:text-champagne">
            {item.name}
          </span>
          {item.is_signature ? (
            <Sparkles className="size-3 shrink-0 text-gold/70" aria-label="Signature" />
          ) : null}
        </span>

        {/* Dotted leader — the row reads as a printed menu line. */}
        <span
          className="mx-1 h-px min-w-4 flex-1 translate-y-[-0.2em] bg-[repeating-linear-gradient(90deg,rgba(212,175,55,0.35)_0_2px,transparent_2px_6px)]"
          aria-hidden
        />

        <span className="shrink-0 font-ui text-[0.782rem] tabular-nums text-gold">
          {soldOut ? "—" : formatPrice(item.price_minor, item.currency)}
        </span>
      </div>

      {item.description ? (
        <p className="mt-1.5 max-w-prose text-[0.697rem] leading-relaxed text-muted">
          {item.description}
        </p>
      ) : null}
    </li>
  );
}
