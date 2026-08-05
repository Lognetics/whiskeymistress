"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import type { GalleryImage } from "@/lib/types";

interface LightboxProps {
  images: GalleryImage[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function Lightbox({ images, index, onClose, onNavigate }: LightboxProps) {
  const open = index !== null;
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);

  const go = useCallback(
    (delta: number) => {
      if (index === null || images.length === 0) return;
      onNavigate((index + delta + images.length) % images.length);
    },
    [index, images.length, onNavigate],
  );

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
      // Keep focus inside the dialog.
      if (event.key === "Tab") {
        event.preventDefault();
        closeRef.current?.focus();
      }
    };

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, go]);

  const current = index !== null ? images[index] : null;

  return (
    <AnimatePresence>
      {open && current ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Gallery image ${index + 1} of ${images.length}: ${current.alt}`}
          className="fixed inset-0 z-100 flex flex-col bg-ink/95 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            const start = touchStartX.current;
            const end = e.changedTouches[0]?.clientX;
            if (start === null || end === undefined) return;
            if (Math.abs(end - start) > 50) go(end < start ? 1 : -1);
            touchStartX.current = null;
          }}
        >
          <div className="flex items-center justify-between px-5 py-5 lg:px-10">
            <p className="font-ui text-[0.72rem] uppercase tracking-[0.3em] text-muted">
              {current.category} · {index + 1} / {images.length}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close gallery"
              className="rounded-full border border-white/15 p-2.5 text-warm transition-colors hover:border-gold hover:text-gold"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 lg:px-16">
            <button
              type="button"
              aria-label="Previous image"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              className="absolute left-2 z-10 rounded-full border border-white/15 bg-ink/60 p-3 text-warm transition-colors hover:border-gold hover:text-gold lg:left-6"
            >
              <ChevronLeft className="size-5" aria-hidden />
            </button>

            <motion.figure
              key={current.id}
              className="relative flex h-full max-h-full w-full max-w-5xl flex-col items-center justify-center"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={current.image_url}
                alt={current.alt}
                width={current.width}
                height={current.height}
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="max-h-[70vh] w-auto rounded-xl object-contain shadow-luxe"
                priority
              />
              <figcaption className="mt-5 max-w-2xl text-center text-[0.88rem] text-muted">
                {current.alt}
              </figcaption>
            </motion.figure>

            <button
              type="button"
              aria-label="Next image"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              className="absolute right-2 z-10 rounded-full border border-white/15 bg-ink/60 p-3 text-warm transition-colors hover:border-gold hover:text-gold lg:right-6"
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
