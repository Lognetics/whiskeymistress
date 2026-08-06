"use client";

import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Loader2, TriangleAlert } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Honeypot, Input, Select, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { submitInquiry } from "@/lib/actions/public";
import { initialFormState } from "@/lib/actions/state";
import { BUDGET_RANGES, EVENT_TYPES } from "@/lib/seed";
import { todayInLagos } from "@/lib/format";

export function PrivateEventForm({ email }: { email: string }) {
  const [state, formAction] = useActionState(submitInquiry, initialFormState);
  const values = state.values ?? {};
  const errors = state.errors ?? {};

  return (
    <div className="glass rounded-[1.75rem] p-7 sm:p-10">
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
            <h3 className="mt-6 font-display text-2xl text-warm">Enquiry sent</h3>
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
                label="Company / Organisation"
                name="company"
                autoComplete="organization"
                defaultValue={values.company}
                error={errors.company}
              />
              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                defaultValue={values.phone}
                error={errors.phone}
              />
              <Input
                label="Email Address"
                name="email"
                type="email"
                required
                autoComplete="email"
                defaultValue={values.email}
                error={errors.email}
              />
              <Select
                label="Event Type"
                name="event_type"
                required
                options={EVENT_TYPES}
                defaultValue={values.event_type}
                error={errors.event_type}
              />
              <Input
                label="Preferred Date"
                name="preferred_date"
                type="date"
                min={todayInLagos()}
                defaultValue={values.preferred_date}
                error={errors.preferred_date}
              />
              <Input
                label="Expected Guests"
                name="guest_count"
                type="number"
                min={1}
                max={2000}
                required
                defaultValue={values.guest_count ?? "30"}
                error={errors.guest_count}
              />
              <Select
                label="Budget Range"
                name="budget_range"
                options={BUDGET_RANGES}
                defaultValue={values.budget_range}
                error={errors.budget_range}
              />
              <Textarea
                label="Tell Us About Your Event"
                name="message"
                rows={4}
                placeholder="Format, timings, AV needs, menu preferences…"
                defaultValue={values.message}
                error={errors.message}
                className="sm:col-span-2"
              />
            </div>

            <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <SubmitButton />
              <p className="font-ui text-[0.629rem] text-muted">
                Or email{" "}
                <a href={`mailto:${email}`} className="text-gold underline underline-offset-4">
                  {email}
                </a>
              </p>
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
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden />
          Sending
        </>
      ) : (
        "Send Enquiry"
      )}
    </Button>
  );
}
