import { dayName } from "@/lib/format";
import type { OpeningHour, SiteSettings, VenueEvent } from "@/lib/types";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://whiskeymistress.com";

export function StructuredData({
  settings,
  hours,
  events,
}: {
  settings: SiteSettings;
  hours: OpeningHour[];
  events: VenueEvent[];
}) {
  const restaurant = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${siteUrl}#restaurant`,
    name: settings.brand_name,
    description: settings.hero_subheadline,
    url: siteUrl,
    telephone: settings.phone,
    email: settings.email,
    servesCuisine: ["Nigerian", "Continental", "Seafood", "Grill"],
    priceRange: "₦₦₦",
    image: settings.about_image_url ? [settings.about_image_url] : undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address_line,
      addressLocality: settings.city,
      addressCountry: settings.country,
    },
    acceptsReservations: `${siteUrl}#reservations`,
    sameAs: [
      settings.instagram_url,
      settings.facebook_url,
      settings.x_url,
      settings.tiktok_url,
    ].filter(Boolean),
    openingHoursSpecification: hours
      .filter((hour) => !hour.is_closed && hour.opens_at)
      .map((hour) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${dayName(hour.day_of_week)}`,
        opens: hour.opens_at,
        closes: hour.closes_at,
      })),
  };

  const eventGraph = events.slice(0, 6).map((event) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    image: event.banner_url ?? undefined,
    startDate: `${event.event_date}T${event.start_time}:00+01:00`,
    endDate: event.end_time
      ? `${event.event_date}T${event.end_time}:00+01:00`
      : undefined,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: settings.brand_name,
      address: {
        "@type": "PostalAddress",
        streetAddress: settings.address_line,
        addressLocality: settings.city,
        addressCountry: settings.country,
      },
    },
    organizer: { "@type": "Organization", name: settings.brand_name, url: siteUrl },
  }));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([restaurant, ...eventGraph]),
      }}
    />
  );
}
