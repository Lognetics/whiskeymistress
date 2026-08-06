import { PageHeading } from "@/components/admin/Shell";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { RESERVATION_STATUS_OPTIONS } from "@/components/admin/fields";
import { updateReservationStatus } from "@/lib/actions/admin";
import { getReservations } from "@/lib/content";
import { getAdminAccess } from "@/lib/auth";
import { formatDate, formatDateTime, formatTime, todayInLagos } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ReservationsPage() {
  const [access, reservations] = await Promise.all([
    getAdminAccess(),
    getReservations(),
  ]);

  const readOnly = access.mode !== "authorized";
  const today = todayInLagos();

  const upcoming = reservations
    .filter((r) => r.reservation_date >= today)
    .sort((a, b) =>
      `${a.reservation_date}${a.reservation_time}`.localeCompare(
        `${b.reservation_date}${b.reservation_time}`,
      ),
    );
  const past = reservations.filter((r) => r.reservation_date < today);

  return (
    <div>
      <PageHeading
        title="Reservations"
        description="Every table request from the site. Change a status inline — it saves as soon as you pick it."
      />

      {reservations.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/12 px-6 py-16 text-center font-ui text-[0.731rem] text-white/40">
          {access.mode === "preview"
            ? "Connect a Supabase project to start capturing reservations."
            : "No reservations yet."}
        </p>
      ) : (
        <div className="grid gap-12">
          <Group
            heading="Upcoming"
            rows={upcoming}
            readOnly={readOnly}
            emptyLabel="Nothing on the books yet."
          />
          <Group
            heading="Past"
            rows={past}
            readOnly={readOnly}
            emptyLabel="No past reservations."
          />
        </div>
      )}
    </div>
  );
}

function Group({
  heading,
  rows,
  readOnly,
  emptyLabel,
}: {
  heading: string;
  rows: Awaited<ReturnType<typeof getReservations>>;
  readOnly: boolean;
  emptyLabel: string;
}) {
  return (
    <section aria-labelledby={`${heading.toLowerCase()}-heading`}>
      <h2
        id={`${heading.toLowerCase()}-heading`}
        className="mb-4 font-ui text-[0.595rem] uppercase tracking-[0.22em] text-white/40"
      >
        {heading} · {rows.length}
      </h2>

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/10 px-5 py-10 text-center font-ui text-[0.697rem] text-white/30">
          {emptyLabel}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/8">
          <table className="w-full min-w-[56rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-white/8 bg-white/[0.02]">
                {["Guest", "When", "Party", "Occasion", "Requests", "Status"].map(
                  (label) => (
                    <th
                      key={label}
                      scope="col"
                      className="px-4 py-3.5 font-ui text-[0.578rem] uppercase tracking-[0.14em] text-white/40"
                    >
                      {label}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((reservation) => (
                <tr
                  key={reservation.id}
                  className="border-b border-white/5 align-top last:border-0"
                >
                  <td className="px-4 py-4">
                    <p className="font-ui text-[0.731rem] text-white/90">
                      {reservation.full_name}
                    </p>
                    <a
                      href={`tel:${reservation.phone.replace(/\s/g, "")}`}
                      className="mt-1 block font-ui text-[0.6375rem] text-white/45 hover:text-gold"
                    >
                      {reservation.phone}
                    </a>
                    <a
                      href={`mailto:${reservation.email}`}
                      className="block font-ui text-[0.6375rem] text-white/45 hover:text-gold"
                    >
                      {reservation.email}
                    </a>
                    <p className="mt-1.5 font-ui text-[0.578rem] text-white/25">
                      Booked {formatDateTime(reservation.created_at)}
                    </p>
                  </td>
                  <td className="px-4 py-4 font-ui text-[0.697rem] text-white/70">
                    {formatDate(reservation.reservation_date)}
                    <span className="mt-0.5 block text-white/45">
                      {formatTime(reservation.reservation_time)}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-ui text-[0.697rem] text-white/70">
                    {reservation.party_size}
                  </td>
                  <td className="px-4 py-4 font-ui text-[0.68rem] text-white/60">
                    {reservation.occasion || "—"}
                    {reservation.seating_preference ? (
                      <span className="mt-0.5 block text-[0.629rem] text-white/35">
                        {reservation.seating_preference}
                      </span>
                    ) : null}
                  </td>
                  <td className="max-w-xs px-4 py-4 font-ui text-[0.68rem] leading-relaxed text-white/55">
                    {reservation.special_requests || "—"}
                  </td>
                  <td className="px-4 py-4">
                    <StatusSelect
                      id={reservation.id}
                      value={reservation.status}
                      options={RESERVATION_STATUS_OPTIONS}
                      action={updateReservationStatus}
                      disabled={readOnly}
                      label={`Status for ${reservation.full_name}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
