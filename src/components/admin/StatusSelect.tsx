"use client";

import { useActionState, useRef } from "react";
import { initialAdminState, type AdminState } from "@/lib/actions/state";

/**
 * Inline status control — changing the select submits immediately, so staff can
 * work a list of reservations without opening anything.
 */
export function StatusSelect({
  id,
  value,
  options,
  action,
  disabled,
  label,
}: {
  id: string;
  value: string;
  options: { value: string; label: string }[];
  action: (state: AdminState, formData: FormData) => Promise<AdminState>;
  disabled?: boolean;
  label: string;
}) {
  const [state, formAction] = useActionState(action, initialAdminState);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={formAction}>
      <input type="hidden" name="id" value={id} />
      <label htmlFor={`status-${id}`} className="sr-only">
        {label}
      </label>
      <select
        id={`status-${id}`}
        name="status"
        defaultValue={value}
        disabled={disabled}
        onChange={() => formRef.current?.requestSubmit()}
        className="rounded-lg border border-white/12 bg-white/[0.03] px-3 py-2 font-ui text-[0.76rem] text-white/80 outline-none transition-colors focus:border-gold/70 disabled:opacity-45 [&>option]:bg-[#141414]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {state.status === "error" ? (
        <p role="alert" className="mt-1 text-[0.7rem] text-red-300">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
