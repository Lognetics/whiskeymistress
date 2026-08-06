"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Expand } from "lucide-react";
import { useMemo, useState } from "react";
import { Lightbox } from "@/components/ui/Lightbox";
import type { GalleryImage } from "@/lib/types";

/** Every third tile spans two rows — an editorial rhythm, not a plain grid. */
const isTall = (index: number) => index % 5 === 0 || index % 5 === 3;

export function Gallery({ images }: { images: GalleryImage[] }) {
  const [filter, setFilter] = useState("All");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(images.map((image) => image.category)))],
    [images],
  );

  const visible = useMemo(
    () =>
      filter === "All"
        ? images
        : images.filter((image) => image.category === filter),
    [images, filter],
  );

  return (
    <div>
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {categories.map((category) => {
          const selected = category === filter;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setFilter(category)}
              aria-pressed={selected}
              className={`relative rounded-full px-5 py-2.5 font-ui text-[0.612rem] uppercase tracking-[0.16em] transition-colors duration-400 ${
                selected
                  ? "text-ink"
                  : "border border-white/10 text-warm/65 hover:border-gold/40 hover:text-warm"
              }`}
            >
              {selected ? (
                <motion.span
                  layoutId="gallery-pill"
                  className="absolute inset-0 rounded-full bg-[linear-gradient(100deg,#a9862a,#d4af37,#a9862a)]"
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                />
              ) : null}
              <span className="relative">{category}</span>
            </button>
          );
        })}
      </div>

      <ul className="grid auto-rows-[13rem] grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {visible.map((image, i) => (
          <motion.li
            key={image.id}
            layout
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: Math.min(i * 0.04, 0.32),
              ease: [0.22, 1, 0.36, 1],
            }}
            className={isTall(i) ? "row-span-2" : ""}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              className="group relative size-full overflow-hidden rounded-2xl border border-white/8"
              aria-label={`Open image: ${image.alt}`}
            >
              <Image
                src={image.image_url}
                alt={image.alt}
                fill
                loading="lazy"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
              />
              <div
                className="absolute inset-0 bg-ink/25 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden
              />
              <div className="absolute inset-0 flex items-end p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-ui text-[0.51rem] uppercase tracking-[0.16em] text-warm">
                  <Expand className="size-3 text-gold" aria-hidden />
                  {image.category}
                </span>
              </div>
            </button>
          </motion.li>
        ))}
      </ul>

      <Lightbox
        images={visible}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </div>
  );
}
