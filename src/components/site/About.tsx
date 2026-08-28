import Image from "next/image";
import { Award, Music4, UtensilsCrossed, Wine } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import type { SiteSettings } from "@/lib/types";

const PILLARS = [
  { icon: UtensilsCrossed, label: "Fine Dining" },
  { icon: Wine, label: "Signature Bar" },
  { icon: Music4, label: "Live Entertainment" },
  { icon: Award, label: "Private Hosting" },
] as const;

export function About({ settings }: { settings: SiteSettings }) {
  const paragraphs = settings.about_body.split("\n").filter(Boolean);

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative py-24 lg:py-32"
    >
      <div className="container-luxe grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal direction="right">
          <div className="relative">
            <div className="relative aspect-4/5 overflow-hidden rounded-[1.75rem] shadow-luxe">
              {settings.about_image_url ? (
                <Image
                  src={settings.about_image_url}
                  alt={`Inside ${settings.brand_name}`}
                  fill
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105"
                />
              ) : (
                <div className="size-full bg-charcoal" />
              )}
              <div
                className="absolute inset-0 bg-[linear-gradient(to_top,rgba(11,11,11,0.65),transparent_55%)]"
                aria-hidden
              />
            </div>

            {/* Floating credential card — the one asymmetric element on the page. */}
            <div className="glass-gold absolute -bottom-8 -right-4 hidden w-56 rounded-2xl p-6 shadow-luxe sm:block lg:-right-10">
              <p className="font-display text-4xl text-gold-gradient">2019</p>
              <p className="mt-2 font-ui text-[0.595rem] uppercase tracking-[0.22em] text-warm/70">
                Serving Abuja since
              </p>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal direction="none">
            <p className="font-ui text-[0.595rem] font-medium uppercase tracking-[0.42em] text-gold-gradient">
              Our Story
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <h2
              id="about-heading"
              className="mt-5 font-display text-[clamp(1.7rem,3.74vw,2.805rem)] leading-[1.1] tracking-tight text-warm"
            >
              {settings.about_heading}
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rule-gold mt-6 w-24" aria-hidden />
          </Reveal>

          <div className="prose-luxe mt-8">
            {paragraphs.map((paragraph, i) => (
              <Reveal key={i} delay={0.14 + i * 0.05}>
                <p className={i === 0 ? "" : "mt-5"}>{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {PILLARS.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="glass rounded-2xl px-4 py-5 text-center transition-colors duration-500 hover:border-gold/35"
                >
                  <Icon className="mx-auto size-5 text-gold" aria-hidden />
                  <p className="mt-3 font-ui text-[0.578rem] uppercase tracking-[0.14em] text-warm/75">
                    {label}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.36}>
            <div className="mt-10 flex flex-wrap gap-4">
              <ButtonLink href="/reservations">Reserve a Table</ButtonLink>
              <ButtonLink href="/menu" variant="outline">
                See the Menu
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
