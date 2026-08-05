import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Users } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import type { Experience } from "@/lib/types";

export function Experiences({ experiences }: { experiences: Experience[] }) {
  return (
    <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {experiences.map((experience, i) => (
        <Reveal key={experience.id} as="li" delay={Math.min(i * 0.07, 0.35)}>
          <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-white/8 bg-charcoal/60">
            <div className="relative aspect-4/3 overflow-hidden">
              {experience.image_url ? (
                <Image
                  src={experience.image_url}
                  alt={experience.title}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                />
              ) : null}
              <div
                className="absolute inset-0 bg-[linear-gradient(to_top,#0b0b0b_6%,rgba(11,11,11,0.35)_55%,transparent)]"
                aria-hidden
              />
              {experience.capacity ? (
                <span className="glass absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-ui text-[0.62rem] uppercase tracking-[0.14em] text-warm/85">
                  <Users className="size-3 text-gold" aria-hidden />
                  {experience.capacity}
                </span>
              ) : null}
            </div>

            <div className="flex flex-1 flex-col p-7">
              <h3 className="font-display text-[1.35rem] text-warm transition-colors group-hover:text-champagne">
                {experience.title}
              </h3>
              <p className="mt-3 flex-1 text-[0.88rem] leading-relaxed text-muted">
                {experience.description}
              </p>

              {experience.price_note ? (
                <p className="mt-5 font-ui text-[0.72rem] uppercase tracking-[0.16em] text-gold/85">
                  {experience.price_note}
                </p>
              ) : null}

              <Link
                href="#private-events"
                className="mt-6 inline-flex items-center gap-2 self-start font-ui text-[0.74rem] uppercase tracking-[0.2em] text-champagne transition-colors hover:text-gold"
              >
                {experience.cta_label}
                <ArrowUpRight
                  className="size-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                  aria-hidden
                />
              </Link>
            </div>

            <div
              className="pointer-events-none absolute inset-0 rounded-[1.5rem] border border-transparent transition-colors duration-500 group-hover:border-gold/30"
              aria-hidden
            />
          </article>
        </Reveal>
      ))}
    </ul>
  );
}
