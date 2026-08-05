"use client";

import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Loader2, TriangleAlert } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Honeypot, Input, Select, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { submitReservation } from "@/lib/actions/public";
import { initialFormState } from "@/lib/actions/state";
import { OCCASIONS, SEATING_PREFERENCES } from "@/lib/seed";
import { todayInLagos } from "@/lib/format";

interface ReservationFormProps {
  maxPartySize: number;
  leadTimeHours: number;
  phone: string;
}

export function ReservationForm({
  maxPartySize,
  leadTimeHours,
  phone,
}: ReservationFormProps) {
  const [state, formAction] = useActionState(submitReservation, initialFormState);
  const values = state.values ?? {};
  const errors = state.errors ?? {};

  const partySizes = Array.from({ length: maxPartySize }, (_, i) => ({
    value: String(i + 1),
    label: `${i + 1} ${i === 0 ? "guest" : "guests"}`,
  }));

  return (
    <div className="glass relative overflow-hidden rounded-[1.75rem] p-7 sm:p-10 lg:p-12">
      <div
        className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.16),transparent_65%)] blur-2xl"
        aria-hidden
      />

      <AnimatePresence mode="wait">
        {state.status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative py-10 text-center"
            role="status"
          >
            <CheckCircle2 className="mx-auto size-14 text-gold" aria-hidden />
            <h3 className="mt-6 font-display text-2xl text-warm">
              Reservation received
            </h3>
            <p className="mx-auto mt-4 max-w-md text-[0.92rem] leading-relaxed text-muted">
              {state.message}
            </p>
            <p className="mt-6 font-ui text-[0.78rem] text-muted">
              Need it sooner? Call{" "}
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="text-gold underline underline-offset-4">
                {phone}
              </a>
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            action={formAction}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="relative"
            noValidate
          >
            <Honeypot />

            {state.status === "error" && state.message ? (
              <p
                role="alert"
                className="mb-7 flex items-start gap-3 rounded-xl border border-red-400/25 bg-red-500/8 px-4 py-3.5 text-[0.85rem] text-red-200"
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
                placeholder="Adaeze Okonkwo"
                defaultValue={values.full_name}
                error={errors.full_name}
              />
              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                placeholder="+234 800 000 0000"
                defaultValue={values.phone}
                error={errors.phone}
              />
              <Input
                label="Email Address"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                defaultValue={values.email}
                error={errors.email}
                className="sm:col-span-2"
              />
              <Input
                label="Reservation Date"
                name="reservation_date"
                type="date"
                required
                min={todayInLagos()}
                defaultValue={values.reservation_date}
                error={errors.reservation_date}
              />
              <Input
                label="Reservation Time"
                name="reservation_time"
                type="time"
                required
                step={900}
                defaultValue={values.reservation_time ?? "19:00"}
                error={errors.reservation_time}
              />
              <Select
                label="Number of Guests"
                name="party_size"
                required
                options={partySizes}
                defaultValue={values.party_size ?? "2"}
                error={errors.party_size}
              />
              <Select
                label="Occasion"
                name="occasion"
                options={OCCASIONS}
                defaultValue={values.occasion}
                error={errors.occasion}
              />
              <Select
                label="Seating Preference"
                name="seating_preference"
                options={SEATING_PREFERENCES}
                defaultValue={values.seating_preference}
                error={errors.seating_preference}
                className="sm:col-span-2"
              />
              <Textarea
                label="Special Requests"
                name="special_requests"
                rows={4}
                placeholder="Dietary requirements, celebration details, seating notes…"
                defaultValue={values.special_requests}
                error={errors.special_requests}
                hint={`Requests are subject to availability. We ask for at least ${leadTimeHours} hours' notice.`}
                className="sm:col-span-2"
              />
            </div>

            <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <SubmitButton />
              <p className="font-ui text-[0.74rem] text-muted">
                Or call{" "}
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="text-gold underline underline-offset-4"
                >
                  {phone}
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
        "Request Reservation"
      )}
    </Button>
  );
}
