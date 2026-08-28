import { PageHeading } from "@/components/admin/Shell";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { APPLICATION_STATUS_OPTIONS } from "@/components/admin/fields";
import { updateApplicationStatus } from "@/lib/actions/admin";
import { getApplications } from "@/lib/content";
import { getAdminAccess } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function CareersPage() {
  const [access, applications] = await Promise.all([
    getAdminAccess(),
    getApplications(),
  ]);
  const readOnly = access.mode !== "authorized";

  return (
    <div>
      <PageHeading
        title="Job Applications"
        description="Everyone who has applied through the Careers section of the site."
      />

      {applications.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/12 px-6 py-16 text-center font-ui text-[0.731rem] text-white/40">
          {access.mode === "preview"
            ? "Connect a Supabase project to start capturing applications."
            : "No applications yet."}
        </p>
      ) : (
        <ul className="grid gap-4">
          {applications.map((application) => (
            <li
              key={application.id}
              className="rounded-xl border border-white/8 bg-white/[0.02] p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="font-ui text-[0.8075rem] text-white/90">
                    {application.full_name}
                    <span className="text-white/40"> · {application.position}</span>
                  </h2>
                  <p className="mt-1.5 flex flex-wrap gap-x-4 font-ui text-[0.663rem] text-white/45">
                    <a
                      href={`tel:${application.phone.replace(/\s/g, "")}`}
                      className="hover:text-gold"
                    >
                      {application.phone}
                    </a>
                    <a href={`mailto:${application.email}`} className="hover:text-gold">
                      {application.email}
                    </a>
                    {application.resume_url ? (
                      <a
                        href={application.resume_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gold/80 hover:text-gold"
                      >
                        Résumé ↗
                      </a>
                    ) : null}
                  </p>
                </div>

                <StatusSelect
                  id={application.id}
                  value={application.status}
                  options={APPLICATION_STATUS_OPTIONS}
                  action={updateApplicationStatus}
                  disabled={readOnly}
                  label={`Status for ${application.full_name}`}
                />
              </div>

              {application.previous_employment ? (
                <p className="mt-5 border-t border-white/6 pt-5 font-ui text-[0.697rem] leading-relaxed text-white/60">
                  {application.previous_employment}
                </p>
              ) : null}

              <p className="mt-4 font-ui text-[0.578rem] text-white/25">
                Applied {formatDateTime(application.created_at)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
