import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Events } from "@/components/site/Events";
import { Hero } from "@/components/site/Hero";
import { Metrics } from "@/components/site/Pillars";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { getSettings, getUpcomingEvents } from "@/lib/content";
import { NIGHTLIFE_METRICS } from "@/lib/seed";

export const revalidate = 300;

/** The four rooms of the site, as a visual index on the landing page. */
const DOORS = [
  {
    href: "/vibe",
    eyebrow: "The Vibe",
    title: "Where Elegance Meets Energy",
    body: "The atmosphere, the themed nights and the community behind the room.",
    image: "/images/venue-murals.jpg",
  },
  {
    href: "/menu",
    eyebrow: "Liquid Assets",
    title: "The Full List",
    body: "Bottle service, grills off the fire, cocktails and everything else — with prices.",
    image: "/images/venue-bar-draught.jpg",
  },
  {
    href: "/live-acts",
    eyebrow: "Live Acts",
    title: "When The Lights Drop",
    body: "Live performances, resident DJs and nights that never repeat themselves.",
    image: "/images/experience-live.jpg",
  },
  {
    href: "/events",
    eyebrow: "On The Calendar",
    title: "What's On",
    body: "Friday, Paradiso, One Night Only. Doors at 8PM — tables go fast.",
    image: "/images/event-paradiso.jpg",
  },
] as const;

export default async function HomePage() {
  const [settings, events] = await Promise.all([
    getSettings(),
    getUpcomingEvents(),
  ]);

  return (
    <>
      <Hero
        headline={settings.hero_headline}
        subheadline={settings.hero_subheadline}
        tagline={settings.tagline}
        videoUrl={process.env.NEXT_PUBLIC_HERO_VIDEO_URL}
      />

      <Section
        id="explore"
        eyebrow="Step Inside"
        title="Four Ways In"
        intro="Whiskey Mistress is Abuja's premium nightlife destination. Start wherever the night takes you."
      >
        <ul className="grid gap-6 md:grid-cols-2">
          {DOORS.map((door, i) => (
            <Reveal key={door.href} as="li" delay={Math.min(i * 0.07, 0.3)}>
              <Link
                href={door.href}
                className="group relative flex h-full min-h-[20rem] flex-col justify-end overflow-hidden rounded-[1.5rem] border border-white/8 p-8"
              >
                <Image
                  src={door.image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-108"
                />
                <div
                  className="absolute inset-0 bg-[linear-gradient(to_top,rgba(11,11,11,0.95),rgba(11,11,11,0.45)_60%,rgba(11,11,11,0.2))]"
                  aria-hidden
                />

                <div className="relative">
                  <p className="font-ui text-[0.561rem] uppercase tracking-[0.34em] text-gold">
                    {door.eyebrow}
                  </p>
                  <h3 className="mt-3 font-display text-[1.4rem] text-warm">
                    {door.title}
                  </h3>
                  <p className="mt-2.5 max-w-sm text-[0.748rem] leading-relaxed text-muted">
                    {door.body}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 font-ui text-[0.629rem] uppercase tracking-[0.2em] text-champagne">
                    Enter
                    <ArrowUpRight
                      className="size-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                      aria-hidden
                    />
                  </span>
                </div>

                <div
                  className="pointer-events-none absolute inset-0 rounded-[1.5rem] border border-transparent transition-colors duration-500 group-hover:border-gold/30"
                  aria-hidden
                />
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>

      <div className="py-16 lg:py-20">
        <Metrics metrics={NIGHTLIFE_METRICS} />
      </div>

      <Section
        id="next"
        eyebrow="On The Calendar"
        title="Next At The Mistress"
        intro="Doors open at 8PM. Tables go fast."
        className="bg-[linear-gradient(180deg,transparent,rgba(26,26,26,0.6),transparent)]"
        action={
          <ButtonLink href="/events" variant="outline" size="sm">
            All Events
          </ButtonLink>
        }
        align="left"
      >
        <Events events={events.slice(0, 3)} />
      </Section>

      <section className="pb-28 lg:pb-36">
        <div className="container-luxe">
          <Reveal>
            <div className="glass-gold flex flex-col items-center gap-6 rounded-[1.75rem] px-8 py-14 text-center">
              <p className="font-ui text-[0.561rem] uppercase tracking-[0.34em] text-gold">
                Get Access
              </p>
              <h2 className="max-w-2xl font-display text-[clamp(1.36rem,2.89vw,2.125rem)] leading-tight text-warm">
                Tonight deserves a better story.
              </h2>
              <p className="max-w-md text-[0.782rem] leading-relaxed text-muted">
                Open Wednesday to Sunday, doors at 8PM. Claim a table and we&apos;ll
                confirm it personally.
              </p>
              <ButtonLink href="/reservations" size="lg">
                Claim Your Table
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
