import Link from "next/link";
import {
  CalendarDays,
  ChefHat,
  Images,
  Mail,
  Sparkles,
  Users,
  Wine,
} from "lucide-react";
import { PageHeading } from "@/components/admin/Shell";
import { SeedImporter } from "@/components/admin/SeedImporter";
import {
  getAllEvents,
  getAllGallery,
  getAllMenuItems,
  getInquiries,
  getReservations,
  getSubscriberCount,
} from "@/lib/content";
import { getAdminAccess } from "@/lib/auth";
import { formatDate, formatTime, todayInLagos } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const access = await getAdminAccess();
  const preview = access.mode === "preview";

  const [food, beverages, events, gallery, reservations, inquiries, subscribers] =
    await Promise.all([
      getAllMenuItems("food"),
      getAllMenuItems("beverage"),
      getAllEvents(),
      getAllGallery(),
      getReservations(),
      getInquiries(),
      getSubscriberCount(),
    ]);

  const today = todayInLagos();
  const upcoming = reservations
    .filter((r) => r.reservation_date >= today && r.status !== "cancelled")
    .sort((a, b) =>
      `${a.reservation_date}${a.reservation_time}`.localeCompare(
        `${b.reservation_date}${b.reservation_time}`,
      ),
    );

  const pendingCount = reservations.filter((r) => r.status === "pending").length;
  const newInquiries = inquiries.filter((i) => i.status === "new").length;
  const coversToday = reservations
    .filter((r) => r.reservation_date === today && r.status !== "cancelled")
    .reduce((sum, r) => sum + r.party_size, 0);

  const stats = [
    { label: "Covers booked today", value: coversToday, icon: Users },
    { label: "Reservations pending", value: pendingCount, icon: CalendarDays },
    { label: "New event enquiries", value: newInquiries, icon: Mail },
    { label: "Newsletter subscribers", value: subscribers, icon: Sparkles },
  ];

  const catalogue = [
    { label: "Food items", value: food.length, href: "/admin/menu", icon: ChefHat },
    { label: "Beverages", value: beverages.length, href: "/admin/beverages", icon: Wine },
    { label: "Events", value: events.length, href: "/admin/events", icon: CalendarDays },
    { label: "Gallery images", value: gallery.length, href: "/admin/gallery", icon: Images },
  ];

  return (
    <div>
      <PageHeading
        title={`Good evening${access.staff?.fullName ? `, ${access.staff.fullName.split(" ")[0]}` : ""}`}
        description="Everything guests see on the site is managed from here. Changes go live immediately."
      />

      {preview ? <SeedImporter disabled /> : null}

      <section aria-labelledby="tonight-heading">
        <h2 id="tonight-heading" className="sr-only">
          Tonight at a glance
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <li
              key={label}
              className="rounded-xl border border-white/8 bg-white/[0.02] p-5"
            >
              <div className="flex items-start justify-between">
                <p className="font-ui text-[0.612rem] uppercase tracking-[0.14em] text-white/40">
                  {label}
                </p>
                <Icon className="size-4 text-gold/70" aria-hidden />
              </div>
              <p className="mt-4 font-display text-4xl text-white/95">{value}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-10 grid gap-6 xl:grid-cols-3">
        <section
          aria-labelledby="upcoming-heading"
          className="rounded-xl border border-white/8 bg-white/[0.02] p-6 xl:col-span-2"
        >
          <div className="flex items-center justify-between">
            <h2 id="upcoming-heading" className="font-display text-lg text-white/90">
              Next reservations
            </h2>
            <Link
              href="/admin/reservations"
              className="font-ui text-[0.646rem] text-gold/80 hover:text-gold"
            >
              View all →
            </Link>
          </div>

          {upcoming.length === 0 ? (
            <p className="mt-8 rounded-lg border border-dashed border-white/10 px-5 py-10 text-center font-ui text-[0.714rem] text-white/35">
              {preview
                ? "Reservations appear here once a database is connected."
                : "No upcoming reservations yet."}
            </p>
          ) : (
            <ul className="mt-5 divide-y divide-white/6">
              {upcoming.slice(0, 8).map((reservation) => (
                <li
                  key={reservation.id}
                  className="flex items-center justify-between gap-4 py-3.5"
                >
                  <div className="min-w-0">
                    <p className="truncate font-ui text-[0.748rem] text-white/85">
                      {reservation.full_name}
                    </p>
                    <p className="mt-0.5 font-ui text-[0.6375rem] text-white/40">
                      {formatDate(reservation.reservation_date)} ·{" "}
                      {formatTime(reservation.reservation_time)} ·{" "}
                      {reservation.party_size}{" "}
                      {reservation.party_size === 1 ? "guest" : "guests"}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-white/12 px-2.5 py-1 font-ui text-[0.527rem] uppercase tracking-[0.12em] text-white/55">
                    {reservation.status.replace(/_/g, " ")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section
          aria-labelledby="catalogue-heading"
          className="rounded-xl border border-white/8 bg-white/[0.02] p-6"
        >
          <h2 id="catalogue-heading" className="font-display text-lg text-white/90">
            Catalogue
          </h2>
          <ul className="mt-5 grid gap-2">
            {catalogue.map(({ label, value, href, icon: Icon }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="flex items-center justify-between rounded-lg border border-white/8 px-4 py-3.5 transition-colors hover:border-gold/35"
                >
                  <span className="flex items-center gap-3 font-ui text-[0.714rem] text-white/70">
                    <Icon className="size-4 text-gold/70" aria-hidden />
                    {label}
                  </span>
                  <span className="font-ui text-[0.765rem] text-white/90">{value}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {!preview ? (
        <div className="mt-10">
          <SeedImporter />
        </div>
      ) : null}
    </div>
  );
}
