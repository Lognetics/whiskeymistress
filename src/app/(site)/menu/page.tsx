import type { Metadata } from "next";
import { PriceList } from "@/components/site/PriceList";
import { Section } from "@/components/ui/Section";
import { getMenuSections } from "@/lib/content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Liquid Assets — Our Menu",
  description:
    "The full Whiskey Mistress menu and prices: bottle service from Glenlivet to Dom Perignon, grills off the fire, cocktails, beverages and puffs. All prices in naira.",
  alternates: { canonical: "/menu" },
};

export default async function MenuPage() {
  const menuSections = await getMenuSections();

  return (
    <Section
      id="menu"
      eyebrow="Liquid Assets"
      title="Our Menu"
      intro="Grills off the fire, cocktails built to order and a bottle list that runs from Glenlivet to Dom Perignon. All prices in naira."
    >
      <PriceList sections={menuSections} />
    </Section>
  );
}
