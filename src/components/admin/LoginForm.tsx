"use client";

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

const CONTROL =
  "w-full rounded-lg border border-white/12 bg-white/[0.03] px-3.5 py-3 font-ui text-[0.88rem] text-white/90 placeholder:text-white/25 outline-none transition-colors focus:border-gold/70";

export function LoginForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const form = new FormData(event.currentTarget);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: String(form.get("email") ?? ""),
        password: String(form.get("password") ?? ""),
      });

      if (signInError) {
        setError(signInError.message);
        setPending(false);
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Unable to sign in right now.",
      );
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      {error ? (
        <p
          role="alert"
          className="rounded-lg border border-red-400/25 bg-red-500/10 px-4 py-3 font-ui text-[0.82rem] text-red-200"
        >
          {error}
        </p>
      ) : null}

      <div>
        <label
          htmlFor="email"
          className="mb-2 block font-ui text-[0.68rem] uppercase tracking-[0.16em] text-white/45"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={CONTROL}
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block font-ui text-[0.68rem] uppercase tracking-[0.16em] text-white/45"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={CONTROL}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-gold px-6 py-3 font-ui text-[0.82rem] font-medium text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
        Sign in
      </button>
    </form>
  );
}
