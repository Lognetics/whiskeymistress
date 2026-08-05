"use client";

import { Loader2, Send } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { subscribeToNewsletter } from "@/lib/actions/public";
import { initialFormState } from "@/lib/actions/state";

export function NewsletterForm() {
  const [state, formAction] = useActionState(
    subscribeToNewsletter,
    initialFormState,
  );

  return (
    <div>
      <form action={formAction} className="flex gap-2" noValidate>
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="Your email address"
          aria-invalid={state.status === "error" ? true : undefined}
          aria-describedby={state.message ? "newsletter-status" : undefined}
          className="min-w-0 flex-1 rounded-full border border-white/12 bg-white/[0.03] px-5 py-3 font-ui text-[0.84rem] text-warm placeholder:text-muted/55 outline-none transition-colors focus:border-gold/70"
        />
        <SubmitButton />
      </form>

      {state.message ? (
        <p
          id="newsletter-status"
          role="status"
          className={`mt-3 font-ui text-[0.76rem] ${
            state.status === "error" ? "text-red-300" : "text-gold"
          }`}
        >
          {state.message}
        </p>
      ) : null}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-label="Subscribe to the newsletter"
      className="shrink-0 rounded-full bg-[linear-gradient(100deg,#a9862a,#d4af37,#a9862a)] bg-[length:200%_auto] px-5 py-3 text-ink transition-all duration-500 hover:bg-[position:right_center] disabled:opacity-60"
    >
      {pending ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : (
        <Send className="size-4" aria-hidden />
      )}
    </button>
  );
}
