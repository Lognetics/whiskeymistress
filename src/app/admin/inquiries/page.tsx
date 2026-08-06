import { PageHeading } from "@/components/admin/Shell";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { INQUIRY_STATUS_OPTIONS } from "@/components/admin/fields";
import { updateInquiryStatus } from "@/lib/actions/admin";
import { getInquiries } from "@/lib/content";
import { getAdminAccess } from "@/lib/auth";
import { formatDate, formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function InquiriesPage() {
  const [access, inquiries] = await Promise.all([getAdminAccess(), getInquiries()]);
  const readOnly = access.mode !== "authorized";

  return (
    <div>
      <PageHeading
        title="Private Event Enquiries"
        description="Birthdays, corporate dinners, launches and celebrations submitted through the site."
      />

      {inquiries.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/12 px-6 py-16 text-center font-ui text-[0.731rem] text-white/40">
          {access.mode === "preview"
            ? "Connect a Supabase project to start capturing enquiries."
            : "No enquiries yet."}
        </p>
      ) : (
        <ul className="grid gap-4">
          {inquiries.map((inquiry) => (
            <li
              key={inquiry.id}
              className="rounded-xl border border-white/8 bg-white/[0.02] p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="font-ui text-[0.8075rem] text-white/90">
                    {inquiry.full_name}
                    {inquiry.company ? (
                      <span className="text-white/40"> · {inquiry.company}</span>
                    ) : null}
                  </h2>
                  <p className="mt-1.5 flex flex-wrap gap-x-4 font-ui text-[0.663rem] text-white/45">
                    <a
                      href={`tel:${inquiry.phone.replace(/\s/g, "")}`}
                      className="hover:text-gold"
                    >
                      {inquiry.phone}
                    </a>
                    <a href={`mailto:${inquiry.email}`} className="hover:text-gold">
                      {inquiry.email}
                    </a>
                  </p>
                </div>

                <StatusSelect
                  id={inquiry.id}
                  value={inquiry.status}
                  options={INQUIRY_STATUS_OPTIONS}
                  action={updateInquiryStatus}
                  disabled={readOnly}
                  label={`Status for ${inquiry.full_name}`}
                />
              </div>

              <dl className="mt-5 grid gap-4 sm:grid-cols-4">
                {[
                  { term: "Event type", value: inquiry.event_type },
                  {
                    term: "Preferred date",
                    value: inquiry.preferred_date
                      ? formatDate(inquiry.preferred_date)
                      : "Flexible",
                  },
                  { term: "Guests", value: String(inquiry.guest_count) },
                  { term: "Budget", value: inquiry.budget_range || "Not specified" },
                ].map(({ term, value }) => (
                  <div key={term}>
                    <dt className="font-ui text-[0.561rem] uppercase tracking-[0.14em] text-white/35">
                      {term}
                    </dt>
                    <dd className="mt-1 font-ui text-[0.714rem] text-white/75">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>

              {inquiry.message ? (
                <p className="mt-5 rounded-lg border border-white/6 bg-black/20 p-4 font-ui text-[0.714rem] leading-relaxed text-white/60">
                  {inquiry.message}
                </p>
              ) : null}

              <p className="mt-4 font-ui text-[0.595rem] text-white/25">
                Received {formatDateTime(inquiry.created_at)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
