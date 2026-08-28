"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock, Ticket } from "lucide-react";
import { useRef } from "react";
import { formatDate, formatTime } from "@/lib/format";
import type { VenueEvent } from "@/lib/types";

export function Events({ events }: { events: VenueEvent[] }) {
  const trackRef = useRef<HTMLUListElement>(null);

  if (!events.length) {
    return (
      <p className="text-center text-muted">
        Our next season of events is being finalised. Join the list below to hear first.
      </p>
    );
  }

  const scrollBy = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("li");
    const amount = card ? card.clientWidth + 24 : track.clientWidth * 0.8;
    track.scrollBy({ left: amount * direction, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div className="mb-6 flex justify-end gap-2 lg:absolute lg:-top-20 lg:right-0 lg:mb-0">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label="Previous events"
          className="rounded-full border border-white/12 p-3 text-warm transition-colors hover:border-gold hover:text-gold"
        >
          <ChevronLeft className="size-4" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label="More events"
          className="rounded-full border border-white/12 p-3 text-warm transition-colors hover:border-gold hover:text-gold"
        >
          <ChevronRight className="size-4" aria-hidden />
        </button>
      </div>

      <ul
        ref={trackRef}
        className="-mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-6 [scrollbar-width:none] lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {events.map((event, i) => (
          <motion.li
            key={event.id}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{
              duration: 0.65,
              delay: Math.min(i * 0.06, 0.3),
              ease: [0.22, 1, 0.36, 1],
            }}
            className="w-[min(85vw,22rem)] shrink-0 snap-start lg:w-[min(30vw,24rem)]"
          >
            <article className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-white/8 bg-charcoal/55 transition-colors duration-500 hover:border-gold/35">
              <div className="relative aspect-16/10 overflow-hidden">
                {event.banner_url ? (
                  <Image
                    src={event.banner_url}
                    alt={event.title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 1024px) 85vw, 30vw"
                    className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-108"
                  />
                ) : null}
                <div
                  className="absolute inset-0 bg-[linear-gradient(to_top,rgba(11,11,11,0.9),transparent_60%)]"
                  aria-hidden
                />

                <div className="glass-gold absolute left-4 top-4 rounded-xl px-3.5 py-2 text-center">
                  <p className="font-display text-xl leading-none text-champagne">
                    {formatDate(event.event_date, {
                      weekday: undefined,
                      month: undefined,
                      year: undefined,
                      day: "numeric",
                    })}
                  </p>
                  <p className="mt-1 font-ui text-[0.493rem] uppercase tracking-[0.18em] text-warm/75">
                    {formatDate(event.event_date, {
                      weekday: undefined,
                      day: undefined,
                      year: undefined,
                      month: "short",
                    })}
                  </p>
                </div>

                {event.is_featured ? (
                  <span className="absolute right-4 top-4 rounded-full bg-gold px-3 py-1 font-ui text-[0.493rem] font-medium uppercase tracking-[0.18em] text-ink">
                    Featured
                  </span>
                ) : null}
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-[1.0625rem] leading-snug text-warm">
                  {event.title}
                </h3>

                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-ui text-[0.612rem] text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="size-3.5 text-gold/80" aria-hidden />
                    {formatDate(event.event_date)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-3.5 text-gold/80" aria-hidden />
                    {formatTime(event.start_time)}
                    {event.end_time ? ` – ${formatTime(event.end_time)}` : ""}
                  </span>
                </div>

                <p className="mt-4 flex-1 text-[0.731rem] leading-relaxed text-muted">
                  {event.description}
                </p>

                {event.ticket_note ? (
                  <p className="mt-5 inline-flex items-center gap-2 font-ui text-[0.612rem] uppercase tracking-[0.14em] text-gold/85">
                    <Ticket className="size-3.5" aria-hidden />
                    {event.ticket_note}
                  </p>
                ) : null}

                <Link
                  href="/reservations"
                  className="mt-6 rounded-full border border-gold/40 px-6 py-3 text-center font-ui text-[0.612rem] uppercase tracking-[0.2em] text-champagne transition-all duration-500 hover:border-gold hover:bg-gold/10"
                >
                  Reserve
                </Link>
              </div>
            </article>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
