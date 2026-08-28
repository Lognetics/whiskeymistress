import type { Metadata } from "next";
import { Events } from "@/components/site/Events";
import { Section } from "@/components/ui/Section";
import { getUpcomingEvents } from "@/lib/content";
import { todayInLagos } from "@/lib/format";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Events",
  description:
    "What's on at Whiskey Mistress Abuja — Friday, Paradiso, One Night Only and more. Doors open at 8PM. Tables go fast.",
  alternates: { canonical: "/events" },
};

export default async function EventsPage() {
  const events = await getUpcomingEvents();
  const today = todayInLagos();
  const upcoming = events.filter((event) => event.event_date >= today);
  const recent = events.filter((event) => event.event_date < today);
  const onTheCalendar = upcoming.length ? upcoming : events;

  return (
    <Section
      id="events"
      eyebrow="On The Calendar"
      title="Upcoming Events"
      intro="Doors open at 8PM. Tables go fast."
    >
      <Events events={onTheCalendar} />

      {recent.length && upcoming.length ? (
        <div className="mt-20">
          <p className="mb-8 font-ui text-[0.612rem] uppercase tracking-[0.34em] text-gold/80">
            Recent Nights
          </p>
          <Events events={recent} />
        </div>
      ) : null}
    </Section>
  );
}
