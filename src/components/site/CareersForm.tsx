"use client";

import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Loader2, TriangleAlert } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Honeypot, Input, Select, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { submitApplication } from "@/lib/actions/public";
import { initialFormState } from "@/lib/actions/state";
import { POSITIONS } from "@/lib/seed";

export function CareersForm() {
  const [state, formAction] = useActionState(submitApplication, initialFormState);
  const values = state.values ?? {};
  const errors = state.errors ?? {};

  return (
    <div className="glass mx-auto max-w-3xl rounded-[1.75rem] p-7 sm:p-10">
      <AnimatePresence mode="wait">
        {state.status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="py-10 text-center"
            role="status"
          >
            <CheckCircle2 className="mx-auto size-14 text-gold" aria-hidden />
            <h3 className="mt-6 font-display text-2xl text-warm">
              Application received
            </h3>
            <p className="mx-auto mt-4 max-w-md text-[0.782rem] leading-relaxed text-muted">
              {state.message}
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            action={formAction}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            noValidate
            className="relative"
          >
            <Honeypot />

            <p className="mb-8 font-ui text-[0.578rem] uppercase tracking-[0.28em] text-gold">
              Application Form
            </p>

            {state.status === "error" && state.message ? (
              <p
                role="alert"
                className="mb-7 flex items-start gap-3 rounded-xl border border-red-400/25 bg-red-500/8 px-4 py-3.5 text-[0.7225rem] text-red-200"
              >
                <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
                {state.message}
              </p>
            ) : null}

            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Full Name"
                name="full_name"
                required
                autoComplete="name"
                defaultValue={values.full_name}
                error={errors.full_name}
              />
              <Input
                label="Email"
                name="email"
                type="email"
                required
                autoComplete="email"
                defaultValue={values.email}
                error={errors.email}
              />
              <Input
                label="Phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                defaultValue={values.phone}
                error={errors.phone}
              />
              <Select
                label="Position"
                name="position"
                required
                options={POSITIONS}
                defaultValue={values.position}
                error={errors.position}
              />
              <Input
                label="Resume URL"
                name="resume_url"
                type="url"
                placeholder="https://…"
                hint="Optional — a link to your CV."
                defaultValue={values.resume_url}
                error={errors.resume_url}
                className="sm:col-span-2"
              />
              <Textarea
                label="Previous Employment"
                name="previous_employment"
                rows={4}
                placeholder="Where you have worked, and for how long."
                defaultValue={values.previous_employment}
                error={errors.previous_employment}
                className="sm:col-span-2"
              />
            </div>

            <div className="mt-9">
              <SubmitButton />
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden />
          Sending
        </>
      ) : (
        "Submit Application"
      )}
    </Button>
  );
}
