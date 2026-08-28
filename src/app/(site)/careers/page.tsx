import type { Metadata } from "next";
import { CareersForm } from "@/components/site/CareersForm";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join the team at Whiskey Mistress Abuja. We're always looking for talented people who love hospitality.",
  alternates: { canonical: "/careers" },
};

export default function CareersPage() {
  return (
    <Section
      id="careers"
      eyebrow="Join The Team"
      title="Careers"
      intro="We're always looking for talented people who love hospitality. Tell us about yourself."
    >
      <CareersForm />
    </Section>
  );
}
