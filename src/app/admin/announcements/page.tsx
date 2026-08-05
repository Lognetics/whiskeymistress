import { PageHeading } from "@/components/admin/Shell";
import { ResourceManager } from "@/components/admin/ResourceManager";
import type { FieldDef } from "@/components/admin/fields";
import { saveAnnouncement } from "@/lib/actions/admin";
import { getAllAnnouncements } from "@/lib/content";
import { getAdminAccess } from "@/lib/auth";

export const dynamic = "force-dynamic";

const fields: FieldDef[] = [
  {
    name: "message",
    label: "Message",
    type: "text",
    required: true,
    span: 2,
    placeholder: "Sunday Brunch & Live Sax — every Sunday, 1pm till late.",
  },
  { name: "link_label", label: "Link label", type: "text", placeholder: "Reserve" },
  { name: "link_href", label: "Link URL", type: "text", placeholder: "#reservations" },
  {
    name: "starts_at",
    label: "Starts",
    type: "datetime-local",
    hint: "Leave empty to show immediately.",
  },
  {
    name: "ends_at",
    label: "Ends",
    type: "datetime-local",
    hint: "Leave empty to run indefinitely.",
  },
  { name: "is_published", label: "Published", type: "checkbox", defaultValue: true },
];

export default async function AnnouncementsPage() {
  const [access, announcements] = await Promise.all([
    getAdminAccess(),
    getAllAnnouncements(),
  ]);

  return (
    <div>
      <PageHeading
        title="Announcements"
        description="The gold bar above the navigation. The most recent published announcement inside its date window is the one guests see."
      />

      <ResourceManager
        title="announcement"
        table="announcements"
        records={announcements}
        fields={fields}
        saveAction={saveAnnouncement}
        readOnly={access.mode !== "authorized"}
        addLabel="Add announcement"
        listConfig={{
          primary: "message",
          secondary: "link_label",
          badges: ["is_published"],
        }}
      />
    </div>
  );
}
