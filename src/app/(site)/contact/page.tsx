import type { Metadata } from "next";
import { Contact } from "@/components/site/Contact";
import { Section } from "@/components/ui/Section";
import { getOpeningHours, getSettings } from "@/lib/content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Contact & Directions",
  description:
    "Whiskey Mistress, 3rd Floor Nurnberger Platz, Ademola Adetokunbo Crescent, Wuse 2, Abuja. Open Wednesday to Sunday, 8PM until late.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const [settings, hours] = await Promise.all([getSettings(), getOpeningHours()]);

  return (
    <Section
      id="contact"
      eyebrow="Visit Us"
      title="Find Whiskey Mistress"
      intro={`${settings.address_line}, ${settings.city}.`}
    >
      <Contact settings={settings} hours={hours} />
    </Section>
  );
}
