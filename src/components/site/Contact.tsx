import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { dayName, formatHours, todayInLagos } from "@/lib/format";
import type { OpeningHour, SiteSettings } from "@/lib/types";

function mapsEmbedSrc(query: string) {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY;
  const q = encodeURIComponent(query);
  return key
    ? `https://www.google.com/maps/embed/v1/place?key=${key}&q=${q}&zoom=15`
    : `https://maps.google.com/maps?q=${q}&z=15&output=embed`;
}

export function Contact({
  settings,
  hours,
}: {
  settings: SiteSettings;
  hours: OpeningHour[];
}) {
  // Highlight today's row using the venue's clock, not the visitor's.
  const [y, m, d] = todayInLagos().split("-").map(Number);
  const todayIndex = new Date(y, m - 1, d).getDay();

  const details = [
    {
      icon: MapPin,
      label: "Address",
      value: `${settings.address_line}, ${settings.city}, ${settings.country}`,
      href: `https://maps.google.com/?q=${encodeURIComponent(settings.maps_query)}`,
    },
    {
      icon: Phone,
      label: "Reservations",
      value: settings.phone,
      href: `tel:${settings.phone.replace(/\s/g, "")}`,
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "Message us directly",
      href: `https://wa.me/${settings.whatsapp}`,
    },
    {
      icon: Mail,
      label: "Email",
      value: settings.email,
      href: `mailto:${settings.email}`,
    },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <Reveal direction="right" className="lg:col-span-3">
        <div className="h-full overflow-hidden rounded-[1.75rem] border border-white/8">
          <iframe
            src={mapsEmbedSrc(settings.maps_query)}
            title={`Map showing ${settings.brand_name} in ${settings.city}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="min-h-[26rem] w-full grayscale-[0.75] contrast-125 transition-all duration-700 hover:grayscale-0 lg:h-full"
          />
        </div>
      </Reveal>

      <div className="lg:col-span-2">
        <Reveal direction="left">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {details.map(({ icon: Icon, label, value, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                  className="glass group flex items-start gap-4 rounded-2xl p-5 transition-colors duration-500 hover:border-gold/35"
                >
                  <span className="mt-0.5 rounded-full border border-gold/25 bg-gold/8 p-2.5">
                    <Icon className="size-4 text-gold" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-ui text-[0.561rem] uppercase tracking-[0.22em] text-muted">
                      {label}
                    </span>
                    <span className="mt-1.5 block text-[0.765rem] text-warm/90 transition-colors group-hover:text-champagne">
                      {value}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal direction="left" delay={0.12}>
          <div className="glass mt-3 rounded-2xl p-6">
            <h3 className="font-ui text-[0.561rem] uppercase tracking-[0.22em] text-muted">
              Opening Hours
            </h3>
            <ul className="mt-4 space-y-2.5">
              {hours.map((hour) => {
                const isToday = hour.day_of_week === todayIndex;
                return (
                  <li
                    key={hour.id}
                    className={`flex items-baseline justify-between gap-4 text-[0.731rem] ${
                      isToday ? "text-champagne" : "text-warm/70"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {dayName(hour.day_of_week)}
                      {isToday ? (
                        <span className="rounded-full bg-gold/15 px-2 py-0.5 font-ui text-[0.4675rem] uppercase tracking-[0.16em] text-gold">
                          Today
                        </span>
                      ) : null}
                    </span>
                    <span className="text-right font-ui text-[0.697rem] tabular-nums">
                      {formatHours(hour)}
                      {hour.note ? (
                        <span className="block text-[0.595rem] text-muted">{hour.note}</span>
                      ) : null}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
