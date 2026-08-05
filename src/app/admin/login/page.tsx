import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { getAdminAccess } from "@/lib/auth";

export default async function LoginPage() {
  const access = await getAdminAccess();

  // Already signed in (or running without a database) — nothing to log into.
  if (access.mode === "authorized" || access.mode === "preview") {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d0d0d] px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <Link href="/" className="inline-block">
            <p className="font-display text-xl tracking-[0.16em] text-white/95">
              WHISKEY MISTRESS
            </p>
            <p className="mt-2 font-ui text-[0.58rem] uppercase tracking-[0.36em] text-gold/80">
              Control Room
            </p>
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#141414] p-8 sm:p-10">
          <h1 className="font-display text-xl text-white/90">Staff sign in</h1>
          <p className="mt-2 font-ui text-[0.82rem] text-white/45">
            Use the email and password issued to you by the venue owner.
          </p>
          <div className="mt-8">
            <LoginForm />
          </div>
        </div>

        <Link
          href="/"
          className="mt-8 block text-center font-ui text-[0.78rem] text-white/40 hover:text-white/70"
        >
          ← Back to the site
        </Link>
      </div>
    </div>
  );
}
