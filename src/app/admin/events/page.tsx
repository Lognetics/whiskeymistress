import { PageHeading } from "@/components/admin/Shell";
import { ResourceManager } from "@/components/admin/ResourceManager";
import type { FieldDef } from "@/components/admin/fields";
import { saveEvent } from "@/lib/actions/admin";
import { getAllEvents } from "@/lib/content";
import { getAdminAccess } from "@/lib/auth";

export const dynamic = "force-dynamic";

const fields: FieldDef[] = [
  { name: "title", label: "Title", type: "text", required: true, span: 2 },
  {
    name: "slug",
    label: "Slug",
    type: "text",
    required: true,
    span: 2,
    placeholder: "saturday-night-live-band",
    hint: "Unique. Lowercase letters, numbers and hyphens.",
  },
  { name: "description", label: "Description", type: "textarea", span: 2 },
  { name: "banner_url", label: "Banner URL", type: "url", span: 2, placeholder: "https://…" },
  { name: "event_date", label: "Date", type: "date", required: true },
  { name: "start_time", label: "Start time", type: "time", required: true },
  { name: "end_time", label: "End time", type: "time" },
  {
    name: "ticket_note",
    label: "Ticket note",
    type: "text",
    placeholder: "₦35,000 per guest",
  },
  { name: "is_featured", label: "Featured", type: "checkbox" },
  { name: "is_published", label: "Published", type: "checkbox", defaultValue: true },
];

export default async function EventsPage() {
  const [access, events] = await Promise.all([getAdminAccess(), getAllEvents()]);

  return (
    <div>
      <PageHeading
        title="Events"
        description="Only events dated today or later appear on the site, ordered by date."
      />

      <ResourceManager
        title="event"
        table="events"
        records={events}
        fields={fields}
        saveAction={saveEvent}
        readOnly={access.mode !== "authorized"}
        addLabel="Add event"
        listConfig={{
          primary: "title",
          secondary: "event_date",
          image: "banner_url",
          badges: ["start_time", "is_featured", "is_published"],
        }}
      />
    </div>
  );
}
