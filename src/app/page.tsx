import { About } from "@/components/site/About";
import { Contact } from "@/components/site/Contact";
import { Events } from "@/components/site/Events";
import { Experiences } from "@/components/site/Experiences";
import { FloatingActions } from "@/components/site/FloatingActions";
import { Footer } from "@/components/site/Footer";
import { Gallery } from "@/components/site/Gallery";
import { Hero } from "@/components/site/Hero";
import { Navbar } from "@/components/site/Navbar";
import { Metrics, Pillars } from "@/components/site/Pillars";
import { PreviewBanner } from "@/components/site/PreviewBanner";
import { PriceList } from "@/components/site/PriceList";
import { PrivateEventForm } from "@/components/site/PrivateEventForm";
import { ReservationForm } from "@/components/site/ReservationForm";
import { StructuredData } from "@/components/site/StructuredData";
import { Section } from "@/components/ui/Section";
import { getSiteContent } from "@/lib/content";
import { LIVE_ACT_PILLARS, NIGHTLIFE_METRICS, VIBE_PILLARS } from "@/lib/seed";

export const revalidate = 300;

export default async function HomePage() {
  const {
    settings,
    announcement,
    menuSections,
    experiences,
    events,
    gallery,
    hours,
    isPreview,
  } = await getSiteContent();

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = events.filter((event) => event.event_date >= today);
  const recent = events.filter((event) => event.event_date < today);
  // Seed dates drift into the past; never render an empty calendar.
  const onTheCalendar = upcoming.length ? upcoming : events;

  return (
    <>
      <StructuredData settings={settings} hours={hours} events={events} />

      {isPreview ? <PreviewBanner /> : null}

      <Navbar
        brandName={settings.brand_name}
        phone={settings.phone}
        announcement={announcement}
      />

      <main id="main">
        <Hero
          headline={settings.hero_headline}
          subheadline={settings.hero_subheadline}
          tagline={settings.tagline}
          videoUrl={process.env.NEXT_PUBLIC_HERO_VIDEO_URL}
        />

        <About settings={settings} />

        <Section
          id="vibe"
          eyebrow="The Vibe"
          title="Every Night Is An Occasion"
          intro="Three things you can count on, whichever night you walk in."
        >
          <Pillars pillars={VIBE_PILLARS} />
        </Section>

        <Section
          id="experience"
          eyebrow="What We Offer"
          title="The Experience"
          className="bg-[linear-gradient(180deg,transparent,rgba(26,26,26,0.6),transparent)]"
        >
          <Experiences experiences={experiences} />
        </Section>

        <div className="py-20 lg:py-24">
          <Metrics metrics={NIGHTLIFE_METRICS} />
        </div>

        <Section
          id="menu"
          eyebrow="Liquid Assets"
          title="Our Menu"
          intro="Grills off the fire, cocktails built to order and a bottle list that runs from Glenlivet to Dom Perignon. All prices in naira."
          className="bg-[linear-gradient(180deg,transparent,rgba(26,26,26,0.6),transparent)]"
        >
          <PriceList sections={menuSections} />
        </Section>

        <Section
          id="live-acts"
          eyebrow="Live Acts"
          title="When The Lights Drop"
          intro="Every night is staged. Here is what it looks like when the room fills."
        >
          <Pillars pillars={LIVE_ACT_PILLARS} />
        </Section>

        <Section
          id="events"
          eyebrow="On The Calendar"
          title="Upcoming Events"
          intro="Doors open at 8PM. Tables go fast."
          className="bg-[linear-gradient(180deg,transparent,rgba(26,26,26,0.6),transparent)]"
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

        <Section
          id="gallery"
          eyebrow="Glimpses"
          title="See You Soon"
          intro="A look at the room, the acts and the nights that follow."
        >
          <Gallery images={gallery} />
        </Section>

        <Section
          id="reservations"
          eyebrow="Get Access"
          title="Claim Your Table"
          intro="Tell us when you are coming and how the night should feel. We confirm every request personally."
          className="bg-[linear-gradient(180deg,transparent,rgba(26,26,26,0.6),transparent)]"
        >
          <div className="mx-auto max-w-4xl">
            <ReservationForm
              maxPartySize={settings.max_party_size}
              leadTimeHours={settings.reservation_lead_time_hours}
              phone={settings.phone}
            />
          </div>
        </Section>

        <Section
          id="private-events"
          eyebrow="Send Us A Message"
          title="Tell Us What You Need"
          intro="Private events, bottle takeovers, enquiries or feedback. We reply by email or phone."
        >
          <div className="mx-auto max-w-4xl">
            <PrivateEventForm email={settings.email} />
          </div>
        </Section>

        <Section
          id="contact"
          eyebrow="Visit Us"
          title="Find Whiskey Mistress"
          intro={`${settings.address_line}, ${settings.city}.`}
          className="bg-[linear-gradient(180deg,transparent,rgba(26,26,26,0.6),transparent)]"
        >
          <Contact settings={settings} hours={hours} />
        </Section>
      </main>

      <Footer settings={settings} />
      <FloatingActions whatsapp={settings.whatsapp} />
    </>
  );
}
