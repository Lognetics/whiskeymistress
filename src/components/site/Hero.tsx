"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2400&q=80";

interface HeroProps {
  headline: string;
  subheadline: string;
  tagline: string;
  videoUrl?: string;
}

export function Hero({ headline, subheadline, tagline, videoUrl }: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Background drifts slower than the copy — a restrained parallax.
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "45%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={ref}
      id="top"
      aria-label="Welcome"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 -z-20"
        style={reduce ? undefined : { y: bgY }}
      >
        {videoUrl ? (
          <video
            className="size-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={HERO_IMAGE}
            aria-hidden
          >
            <source src={videoUrl} />
          </video>
        ) : (
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            priority
            sizes="100vw"
            quality={85}
            className={`object-cover ${reduce ? "" : "animate-kenburns"}`}
          />
        )}
      </motion.div>

      {/* Depth: a warm floor glow, then a vignette that hands off to the page. */}
      <div className="absolute inset-0 -z-10 bg-ink/62" aria-hidden />
      <div className="vignette absolute inset-0 -z-10" aria-hidden />
      <div
        className="absolute inset-x-0 bottom-0 -z-10 h-64 bg-[linear-gradient(to_top,#0b0b0b,transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 size-[42rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.16),transparent_62%)] blur-3xl"
        aria-hidden
      />

      <motion.div
        className="container-luxe relative flex flex-col items-center pt-20 text-center"
        style={reduce ? undefined : { y: contentY, opacity }}
      >
        <motion.p
          className="font-ui text-[0.578rem] uppercase tracking-[0.5em] text-gold-gradient sm:text-[0.6375rem]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {tagline}
        </motion.p>

        <motion.h1
          className="mt-8 max-w-5xl font-display text-[clamp(2.04rem,5.61vw,4.335rem)] leading-[1.03] tracking-[-0.02em] text-warm"
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {headline}
        </motion.h1>

        <motion.div
          className="rule-gold mt-9 w-32"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          aria-hidden
        />

        <motion.p
          className="mt-8 max-w-2xl text-[0.8075rem] leading-relaxed text-warm/72 sm:text-[0.8925rem]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          {subheadline}
        </motion.p>

        <motion.div
          className="mt-11 flex flex-col items-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href="#reservations"
            className="rounded-full bg-[linear-gradient(100deg,#a9862a_0%,#d4af37_35%,#f0e2c0_50%,#d4af37_65%,#a9862a_100%)] bg-[length:200%_auto] px-10 py-4 font-ui text-[0.68rem] font-medium uppercase tracking-[0.2em] text-ink shadow-[0_18px_50px_-18px_rgba(212,175,55,0.8)] transition-all duration-500 hover:bg-[position:right_center] hover:shadow-[0_26px_70px_-18px_rgba(212,175,55,0.95)]"
          >
            Reserve a Table
          </Link>
          <Link
            href="#dining"
            className="rounded-full border border-gold/40 px-10 py-4 font-ui text-[0.68rem] uppercase tracking-[0.2em] text-champagne backdrop-blur-sm transition-all duration-500 hover:border-gold hover:bg-gold/10"
          >
            Explore the Menu
          </Link>
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        aria-label="Scroll to explore"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gold/70 transition-colors hover:text-gold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
      >
        <span className="sr-only">Scroll to explore</span>
        <ChevronDown className="size-7 animate-float" aria-hidden />
      </motion.a>
    </section>
  );
}
