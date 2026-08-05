"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { Testimonial } from "@/lib/types";

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = testimonials.length;

  const go = useCallback(
    (delta: number) => setIndex((current) => (current + delta + count) % count),
    [count],
  );

  useEffect(() => {
    if (paused || count < 2) return;
    const timer = setInterval(() => go(1), 7000);
    return () => clearInterval(timer);
  }, [paused, count, go]);

  if (!count) return null;
  const current = testimonials[index];

  return (
    <div
      className="relative mx-auto max-w-4xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <Quote
        className="mx-auto mb-8 size-9 text-gold/35"
        aria-hidden
      />

      <div className="relative min-h-[19rem] sm:min-h-[16rem]">
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={current.id}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
            aria-live="polite"
          >
            <div
              className="mb-6 flex justify-center gap-1"
              aria-label={`${current.rating} out of 5 stars`}
            >
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`size-4 ${
                    i < current.rating
                      ? "fill-gold text-gold"
                      : "text-white/15"
                  }`}
                  aria-hidden
                />
              ))}
            </div>

            <p className="font-display text-[clamp(1.15rem,2.6vw,1.75rem)] leading-[1.55] text-warm/90">
              &ldquo;{current.quote}&rdquo;
            </p>

            <footer className="mt-9 flex items-center justify-center gap-4">
              {current.avatar_url ? (
                <Image
                  src={current.avatar_url}
                  alt=""
                  width={56}
                  height={56}
                  className="size-14 rounded-full object-cover ring-1 ring-gold/40"
                />
              ) : null}
              <div className="text-left">
                <p className="font-ui text-[0.9rem] font-medium text-champagne">
                  {current.guest_name}
                </p>
                {current.guest_title ? (
                  <p className="mt-0.5 font-ui text-[0.74rem] uppercase tracking-[0.14em] text-muted">
                    {current.guest_title}
                  </p>
                ) : null}
              </div>
            </footer>
          </motion.blockquote>
        </AnimatePresence>
      </div>

      <div className="mt-10 flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous review"
          className="rounded-full border border-white/12 p-3 text-warm transition-colors hover:border-gold hover:text-gold"
        >
          <ChevronLeft className="size-4" aria-hidden />
        </button>

        <div className="flex gap-2">
          {testimonials.map((testimonial, i) => (
            <button
              key={testimonial.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show review ${i + 1} of ${count}`}
              aria-current={i === index ? "true" : undefined}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === index ? "w-8 bg-gold" : "w-1.5 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next review"
          className="rounded-full border border-white/12 p-3 text-warm transition-colors hover:border-gold hover:text-gold"
        >
          <ChevronRight className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
