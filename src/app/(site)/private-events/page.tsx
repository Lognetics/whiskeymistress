import type { Metadata } from "next";
import { PrivateEventForm } from "@/components/site/PrivateEventForm";
import { Section } from "@/components/ui/Section";
import { getSettings } from "@/lib/content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Private Events",
  description:
    "Birthdays, corporate nights, launches and bottle takeovers at Whiskey Mistress Abuja. Tell us what you need and we'll reply by email or phone.",
  alternates: { canonical: "/private-events" },
};

export default async function PrivateEventsPage() {
  const settings = await getSettings();

  return (
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
  );
}
