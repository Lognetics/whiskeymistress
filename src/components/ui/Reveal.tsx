"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

const OFFSET: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 28 },
  down: { x: 0, y: -28 },
  left: { x: 28, y: 0 },
  right: { x: -28, y: 0 },
  none: { x: 0, y: 0 },
};

interface RevealProps {
  children: ReactNode;
  /** Seconds. Use small staggers (0.06 × index) inside grids. */
  delay?: number;
  direction?: Direction;
  className?: string;
  as?: "div" | "li" | "section" | "article" | "span";
}

/**
 * Scroll-triggered entrance. Animates once, respects reduced-motion, and
 * leaves content fully visible if JS never runs (SSR renders the child).
 */
export function Reveal({
  children,
  delay = 0,
  direction = "up",
  className,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  const Component = motion[as];
  const offset = reduce ? OFFSET.none : OFFSET[direction];

  return (
    <Component
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{
        duration: reduce ? 0.01 : 0.75,
        delay: reduce ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </Component>
  );
}
