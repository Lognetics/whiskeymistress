import { PageHeading } from "@/components/admin/Shell";
import { ResourceManager } from "@/components/admin/ResourceManager";
import type { FieldDef } from "@/components/admin/fields";
import { saveExperience } from "@/lib/actions/admin";
import { getAllExperiences } from "@/lib/content";
import { getAdminAccess } from "@/lib/auth";

export const dynamic = "force-dynamic";

const fields: FieldDef[] = [
  { name: "title", label: "Title", type: "text", required: true, span: 2 },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    required: true,
    span: 2,
  },
  { name: "image_url", label: "Image URL", type: "url", span: 2, placeholder: "https://…" },
  { name: "capacity", label: "Capacity", type: "text", placeholder: "6 – 12 guests" },
  {
    name: "price_note",
    label: "Price note",
    type: "text",
    placeholder: "Minimum spend applies",
  },
  { name: "cta_label", label: "Button label", type: "text", defaultValue: "Book Now" },
  { name: "sort_order", label: "Sort order", type: "number", min: 0, defaultValue: 0 },
  { name: "is_published", label: "Published", type: "checkbox", defaultValue: true },
];

export default async function ExperiencesPage() {
  const [access, experiences] = await Promise.all([
    getAdminAccess(),
    getAllExperiences(),
  ]);

  return (
    <div>
      <PageHeading
        title="Featured Experiences"
        description="VIP lounges, private dining, celebrations and corporate hosting — the cards in the VIP Experience section."
      />

      <ResourceManager
        title="experience"
        table="experiences"
        records={experiences}
        fields={fields}
        saveAction={saveExperience}
        readOnly={access.mode !== "authorized"}
        addLabel="Add experience"
        listConfig={{
          primary: "title",
          secondary: "capacity",
          image: "image_url",
          badges: ["is_published"],
        }}
      />
    </div>
  );
}
