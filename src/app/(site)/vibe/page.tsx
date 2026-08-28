import type { Metadata } from "next";
import { About } from "@/components/site/About";
import { Experiences } from "@/components/site/Experiences";
import { Metrics, Pillars } from "@/components/site/Pillars";
import { Section } from "@/components/ui/Section";
import { getExperiences, getSettings } from "@/lib/content";
import { NIGHTLIFE_METRICS, VIBE_PILLARS } from "@/lib/seed";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "The Vibe",
  description:
    "Where elegance meets energy. Inside Abuja's premium nightlife destination — the atmosphere, the themed nights and the community behind Whiskey Mistress.",
  alternates: { canonical: "/vibe" },
};

export default async function VibePage() {
  const [settings, experiences] = await Promise.all([
    getSettings(),
    getExperiences(),
  ]);

  return (
    <>
      <About settings={settings} />

      <Section
        id="pillars"
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
    </>
  );
}
