"use client";

import { Loader2 } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { saveOpeningHour } from "@/lib/actions/admin";
import { initialAdminState } from "@/lib/actions/state";
import { dayName } from "@/lib/format";
import type { OpeningHour } from "@/lib/types";

const CONTROL =
  "rounded-lg border border-white/12 bg-white/[0.03] px-3 py-2 font-ui text-[0.697rem] text-white/85 outline-none transition-colors focus:border-gold/70 disabled:opacity-45";

export function OpeningHoursEditor({
  hours,
  readOnly,
}: {
  hours: OpeningHour[];
  readOnly: boolean;
}) {
  // Always render all seven days, even if a row is missing from the table.
  const byDay = new Map(hours.map((hour) => [hour.day_of_week, hour]));

  return (
    <ul className="grid gap-3">
      {Array.from({ length: 7 }, (_, day) => (
        <DayRow
          key={day}
          day={day}
          hour={byDay.get(day)}
          readOnly={readOnly}
        />
      ))}
    </ul>
  );
}

function DayRow({
  day,
  hour,
  readOnly,
}: {
  day: number;
  hour?: OpeningHour;
  readOnly: boolean;
}) {
  const [state, action] = useActionState(saveOpeningHour, initialAdminState);

  return (
    <li className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
      <form
        action={action}
        className="flex flex-wrap items-end gap-4 sm:flex-nowrap"
      >
        <input type="hidden" name="day_of_week" value={day} />

        <p className="w-28 shrink-0 font-ui text-[0.748rem] text-white/85">
          {dayName(day)}
        </p>

        <div>
          <label
            htmlFor={`opens-${day}`}
            className="mb-1.5 block font-ui text-[0.527rem] uppercase tracking-[0.14em] text-white/35"
          >
            Opens
          </label>
          <input
            id={`opens-${day}`}
            name="opens_at"
            type="time"
            defaultValue={hour?.opens_at?.slice(0, 5) ?? ""}
            disabled={readOnly}
            className={CONTROL}
          />
        </div>

        <div>
          <label
            htmlFor={`closes-${day}`}
            className="mb-1.5 block font-ui text-[0.527rem] uppercase tracking-[0.14em] text-white/35"
          >
            Closes
          </label>
          <input
            id={`closes-${day}`}
            name="closes_at"
            type="time"
            defaultValue={hour?.closes_at?.slice(0, 5) ?? ""}
            disabled={readOnly}
            className={CONTROL}
          />
        </div>

        <div className="min-w-0 flex-1">
          <label
            htmlFor={`note-${day}`}
            className="mb-1.5 block font-ui text-[0.527rem] uppercase tracking-[0.14em] text-white/35"
          >
            Note
          </label>
          <input
            id={`note-${day}`}
            name="note"
            type="text"
            placeholder="Live band from 10pm"
            defaultValue={hour?.note ?? ""}
            disabled={readOnly}
            className={`${CONTROL} w-full`}
          />
        </div>

        <label
          htmlFor={`closed-${day}`}
          className="flex shrink-0 items-center gap-2 pb-2 font-ui text-[0.663rem] text-white/60"
        >
          <input type="hidden" name="is_closed" value="" />
          <input
            id={`closed-${day}`}
            name="is_closed"
            type="checkbox"
            value="true"
            defaultChecked={hour?.is_closed ?? false}
            disabled={readOnly}
            className="size-4 accent-[#d4af37]"
          />
          Closed
        </label>

        <SaveButton disabled={readOnly} state={state.status} />
      </form>

      {state.status === "error" ? (
        <p role="alert" className="mt-2 font-ui text-[0.6375rem] text-red-300">
          {state.message}
        </p>
      ) : null}
    </li>
  );
}

function SaveButton({
  disabled,
  state,
}: {
  disabled: boolean;
  state: "idle" | "success" | "error";
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="shrink-0 rounded-lg border border-white/12 px-4 py-2 font-ui text-[0.646rem] text-white/70 transition-colors hover:border-gold/50 hover:text-gold disabled:opacity-40"
    >
      {pending ? (
        <Loader2 className="size-3.5 animate-spin" aria-hidden />
      ) : state === "success" ? (
        "Saved"
      ) : (
        "Save"
      )}
    </button>
  );
}
