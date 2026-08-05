import { PageHeading } from "@/components/admin/Shell";
import { OpeningHoursEditor } from "@/components/admin/OpeningHoursEditor";
import { getOpeningHours } from "@/lib/content";
import { getAdminAccess } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function HoursPage() {
  const [access, hours] = await Promise.all([getAdminAccess(), getOpeningHours()]);

  return (
    <div>
      <PageHeading
        title="Opening Hours"
        description="Shown in the Contact section and published as structured data so Google can display them in search results."
      />
      <OpeningHoursEditor
        hours={hours}
        readOnly={access.mode !== "authorized"}
      />
    </div>
  );
}
