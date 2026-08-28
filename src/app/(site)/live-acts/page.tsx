import type { Metadata } from "next";
import { Gallery } from "@/components/site/Gallery";
import { Pillars } from "@/components/site/Pillars";
import { Section } from "@/components/ui/Section";
import { getGallery } from "@/lib/content";
import { LIVE_ACT_PILLARS } from "@/lib/seed";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Live Acts",
  description:
    "Live performances, themed nights and resident DJs at Whiskey Mistress Abuja. Every night is staged — here is what it looks like when the lights drop.",
  alternates: { canonical: "/live-acts" },
};

export default async function LiveActsPage() {
  const gallery = await getGallery();
  const stage = gallery.filter((image) => image.category === "Live Acts");

  return (
    <>
      <Section
        id="live-acts"
        eyebrow="Live Acts"
        title="When The Lights Drop"
        intro="Every night is staged. Here is what it looks like when the room fills."
      >
        <Pillars pillars={LIVE_ACT_PILLARS} />
      </Section>

      {stage.length ? (
        <Section
          id="on-stage"
          eyebrow="On The Floor"
          title="The Room, Mid-Set"
          className="bg-[linear-gradient(180deg,transparent,rgba(26,26,26,0.6),transparent)]"
        >
          <Gallery images={stage} />
        </Section>
      ) : null}
    </>
  );
}
