import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "gold" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const BASE =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-ui font-medium tracking-wide transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:cursor-not-allowed disabled:opacity-55";

const VARIANTS: Record<Variant, string> = {
  gold:
    "bg-[linear-gradient(100deg,#a9862a_0%,#d4af37_35%,#f0e2c0_50%,#d4af37_65%,#a9862a_100%)] bg-[length:200%_auto] text-ink shadow-[0_18px_40px_-18px_rgba(212,175,55,0.75)] hover:bg-[position:right_center] hover:shadow-[0_24px_60px_-18px_rgba(212,175,55,0.9)] hover:-translate-y-0.5",
  outline:
    "border border-gold/45 text-champagne hover:border-gold hover:bg-gold/10 hover:-translate-y-0.5",
  ghost:
    "border border-white/12 text-warm/85 hover:border-white/30 hover:bg-white/5",
};

const SIZES: Record<Size, string> = {
  sm: "px-5 py-2.5 text-[0.663rem]",
  md: "px-7 py-3.5 text-[0.697rem]",
  lg: "px-9 py-4 text-[0.731rem]",
};

function classes(variant: Variant, size: Size, className?: string) {
  return [BASE, VARIANTS[variant], SIZES[size], "uppercase", className]
    .filter(Boolean)
    .join(" ");
}

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function ButtonLink({
  href,
  variant = "gold",
  size = "md",
  className,
  children,
  ...rest
}: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link href={href} className={classes(variant, size, className)} {...rest}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "gold",
  size = "md",
  className,
  children,
  type = "button",
  ...rest
}: CommonProps & ComponentProps<"button">) {
  return (
    <button type={type} className={classes(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}
