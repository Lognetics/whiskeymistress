import { PageHeading } from "@/components/admin/Shell";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { getSettings } from "@/lib/content";
import { getAdminAccess } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [access, settings] = await Promise.all([getAdminAccess(), getSettings()]);

  return (
    <div>
      <PageHeading
        title="Site Settings"
        description="Brand copy, hero headline, the About story, contact details and social links. These feed the page, the footer and the search-engine structured data."
      />
      <SettingsForm
        settings={settings}
        readOnly={access.mode !== "authorized"}
      />
    </div>
  );
}
