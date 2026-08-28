import type { Metadata } from "next";
import { ReservationForm } from "@/components/site/ReservationForm";
import { Section } from "@/components/ui/Section";
import { getSettings } from "@/lib/content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Claim Your Table",
  description:
    "Reserve a table at Whiskey Mistress Abuja. Tell us when you are coming and how the night should feel — we confirm every request personally.",
  alternates: { canonical: "/reservations" },
};

export default async function ReservationsPage() {
  const settings = await getSettings();

  return (
    <Section
      id="reservations"
      eyebrow="Get Access"
      title="Claim Your Table"
      intro="Tell us when you are coming and how the night should feel. We confirm every request personally."
    >
      <div className="mx-auto max-w-4xl">
        <ReservationForm
          maxPartySize={settings.max_party_size}
          leadTimeHours={settings.reservation_lead_time_hours}
          phone={settings.phone}
        />
      </div>
    </Section>
  );
}
