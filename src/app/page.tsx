import { About } from "@/components/site/About";
import { Contact } from "@/components/site/Contact";
import { Events } from "@/components/site/Events";
import { Experiences } from "@/components/site/Experiences";
import { FloatingActions } from "@/components/site/FloatingActions";
import { Footer } from "@/components/site/Footer";
import { Gallery } from "@/components/site/Gallery";
import { Hero } from "@/components/site/Hero";
import { MenuBoard } from "@/components/site/MenuBoard";
import { Navbar } from "@/components/site/Navbar";
import { PreviewBanner } from "@/components/site/PreviewBanner";
import { PrivateEventForm } from "@/components/site/PrivateEventForm";
import { ReservationForm } from "@/components/site/ReservationForm";
import { StructuredData } from "@/components/site/StructuredData";
import { Testimonials } from "@/components/site/Testimonials";
import { Section } from "@/components/ui/Section";
import { getSiteContent } from "@/lib/content";

export const revalidate = 300;

export default async function HomePage() {
  const {
    settings,
    announcement,
    foodSections,
    beverageSections,
    experiences,
    events,
    gallery,
    testimonials,
    hours,
    isPreview,
  } = await getSiteContent();

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
          id="dining"
          eyebrow="The Kitchen"
          title="Dining Menu"
          intro="Nigerian cuisine cooked with reverence alongside a modern grill, seafood and pasta programme. Every plate is finished by hand at the pass."
          className="bg-[linear-gradient(180deg,transparent,rgba(26,26,26,0.6),transparent)]"
        >
          <MenuBoard sections={foodSections} variant="food" />
        </Section>

        <Section
          id="beverages"
          eyebrow="The Bar"
          title="Beverage Menu"
          intro="Signature cocktails, zero-proof creations, pressed juices and a considered coffee and tea list — built at the bar, garnished to order."
        >
          <MenuBoard sections={beverageSections} variant="beverage" />
        </Section>

        <Section
          id="experiences"
          eyebrow="Featured Experiences"
          title="The VIP Experience"
          intro="Six ways to take the room. Each one comes with a dedicated host and a service team that knows the night before it happens."
          className="bg-[linear-gradient(180deg,transparent,rgba(26,26,26,0.6),transparent)]"
        >
          <Experiences experiences={experiences} />
        </Section>

        <Section
          id="events"
          eyebrow="What's On"
          title="Upcoming Events"
          intro="Live bands, tasting menus, guest DJs and seasonal galas. Tables go quickly — reserve ahead."
        >
          <Events events={events} />
        </Section>

        <Section
          id="gallery"
          eyebrow="The Room"
          title="Gallery"
          intro="A look inside the dining room, the lounge, the kitchen's work and the nights that follow."
          className="bg-[linear-gradient(180deg,transparent,rgba(26,26,26,0.6),transparent)]"
        >
          <Gallery images={gallery} />
        </Section>

        <Section
          id="reservations"
          eyebrow="Reservations"
          title="Reserve Your Table"
          intro="Tell us when you're coming and what you're celebrating. Our reservations team confirms every request personally."
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
          eyebrow="Private Events"
          title="Host It Here"
          intro="Birthdays, corporate dinners, product launches, engagements and networking evenings — from an intimate room of twelve to the full venue."
          className="bg-[linear-gradient(180deg,transparent,rgba(26,26,26,0.6),transparent)]"
        >
          <div className="mx-auto max-w-4xl">
            <PrivateEventForm email={settings.email} />
          </div>
        </Section>

        <Section id="testimonials" eyebrow="Guest Book" title="What Our Guests Say">
          <Testimonials testimonials={testimonials} />
        </Section>

        <Section
          id="contact"
          eyebrow="Find Us"
          title="Visit Whiskey Mistress"
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
