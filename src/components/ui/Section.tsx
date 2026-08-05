import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

interface SectionProps {
  id: string;
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Centre the heading block (default) or align it left. */
  align?: "center" | "left";
  action?: ReactNode;
}

export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  className = "",
  align = "center",
  action,
}: SectionProps) {
  const centered = align === "center";

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`relative py-24 lg:py-32 ${className}`}
    >
      <div className="container-luxe">
        <div
          className={`flex flex-col gap-6 ${
            centered
              ? "items-center text-center"
              : "items-start text-left md:flex-row md:items-end md:justify-between"
          }`}
        >
          <div className={centered ? "max-w-3xl" : "max-w-2xl"}>
            {eyebrow ? (
              <Reveal direction="none">
                <p className="font-ui text-[0.7rem] font-medium uppercase tracking-[0.42em] text-gold-gradient">
                  {eyebrow}
                </p>
              </Reveal>
            ) : null}

            <Reveal delay={0.06}>
              <h2
                id={`${id}-heading`}
                className="mt-5 font-display text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.08] tracking-tight text-warm"
              >
                {title}
              </h2>
            </Reveal>

            <Reveal delay={0.12}>
              <div
                className={`rule-gold mt-6 w-24 ${centered ? "mx-auto" : ""}`}
                aria-hidden
              />
            </Reveal>

            {intro ? (
              <Reveal delay={0.16}>
                <p className="mt-6 text-[0.98rem] leading-relaxed text-muted lg:text-[1.05rem]">
                  {intro}
                </p>
              </Reveal>
            ) : null}
          </div>

          {action ? <Reveal delay={0.2}>{action}</Reveal> : null}
        </div>

        <div className="mt-14 lg:mt-20">{children}</div>
      </div>
    </section>
  );
}
