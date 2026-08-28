import type { Metadata } from "next";
import { Gallery } from "@/components/site/Gallery";
import { Section } from "@/components/ui/Section";
import { getGallery } from "@/lib/content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Inside Whiskey Mistress Abuja — the room, the bar, the grill and the nights that follow.",
  alternates: { canonical: "/gallery" },
};

export default async function GalleryPage() {
  const gallery = await getGallery();

  return (
    <Section
      id="gallery"
      eyebrow="Glimpses"
      title="See You Soon"
      intro="A look at the room, the acts and the nights that follow."
    >
      <Gallery images={gallery} />
    </Section>
  );
}
