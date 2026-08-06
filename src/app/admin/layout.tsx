import type { Metadata } from "next";
import Link from "next/link";
import { Shell } from "@/components/admin/Shell";
import { getAdminAccess } from "@/lib/auth";
import { signOut } from "@/lib/actions/admin";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const access = await getAdminAccess();

  if (access.mode === "unauthenticated") {
    // The login route renders its own chrome; everything else is gated.
    return <>{children}</>;
  }

  if (access.mode === "forbidden") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d0d0d] px-6">
        <div className="max-w-md rounded-2xl border border-white/10 bg-[#141414] p-10 text-center">
          <h1 className="font-display text-2xl text-white/90">
            Account not authorised
          </h1>
          <p className="mt-4 font-ui text-[0.731rem] leading-relaxed text-white/50">
            You are signed in as{" "}
            <span className="text-white/80">{access.email}</span>, but this account
            has no staff record. Ask an owner to add your user id to the{" "}
            <code className="rounded bg-black/40 px-1.5 py-0.5">staff_members</code>{" "}
            table.
          </p>
          <form action={signOut} className="mt-8">
            <button
              type="submit"
              className="rounded-lg border border-white/15 px-6 py-2.5 font-ui text-[0.68rem] text-white/70 hover:border-white/30"
            >
              Sign out
            </button>
          </form>
          <Link
            href="/"
            className="mt-6 block font-ui text-[0.663rem] text-gold/80 hover:text-gold"
          >
            ← Back to the site
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Shell
      staffEmail={access.staff?.email ?? null}
      role={access.staff?.role ?? null}
      preview={access.mode === "preview"}
    >
      {children}
    </Shell>
  );
}
