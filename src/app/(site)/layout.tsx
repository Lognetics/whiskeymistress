import { FloatingActions } from "@/components/site/FloatingActions";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { PreviewBanner } from "@/components/site/PreviewBanner";
import { StructuredData } from "@/components/site/StructuredData";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  getAnnouncement,
  getOpeningHours,
  getSettings,
  getUpcomingEvents,
} from "@/lib/content";

/**
 * Chrome shared by every public page: the announcement bar, sticky nav,
 * footer, floating actions and the site-wide structured data.
 */
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, announcement, hours, events] = await Promise.all([
    getSettings(),
    getAnnouncement(),
    getOpeningHours(),
    getUpcomingEvents(),
  ]);

  return (
    <>
      <StructuredData settings={settings} hours={hours} events={events} />

      {!isSupabaseConfigured ? <PreviewBanner /> : null}

      <Navbar
        brandName={settings.brand_name}
        phone={settings.phone}
        announcement={announcement}
      />

      <main id="main">{children}</main>

      <Footer settings={settings} />
      <FloatingActions whatsapp={settings.whatsapp} />
    </>
  );
}
