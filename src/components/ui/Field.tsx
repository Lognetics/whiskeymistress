import type { ComponentProps, ReactNode } from "react";

const CONTROL =
  "w-full rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3.5 font-ui text-[0.782rem] text-warm placeholder:text-muted/55 transition-colors duration-300 outline-none focus:border-gold/70 focus:bg-white/[0.06] disabled:opacity-60 aria-[invalid=true]:border-red-400/70";

interface WrapProps {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

export function FieldShell({
  label,
  name,
  error,
  hint,
  required,
  className = "",
  children,
}: WrapProps) {
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="mb-2 block font-ui text-[0.595rem] font-medium uppercase tracking-[0.2em] text-muted"
      >
        {label}
        {required ? (
          <span className="ml-1 text-gold" aria-hidden>
            *
          </span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p id={`${name}-error`} role="alert" className="mt-2 text-[0.663rem] text-red-300">
          {error}
        </p>
      ) : hint ? (
        <p id={`${name}-hint`} className="mt-2 text-[0.663rem] text-muted/75">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

type BaseProps = Omit<WrapProps, "children"> & { hint?: string };

export function Input({
  label,
  name,
  error,
  hint,
  required,
  className,
  ...rest
}: BaseProps & ComponentProps<"input">) {
  return (
    <FieldShell
      label={label}
      name={name}
      error={error}
      hint={hint}
      required={required}
      className={className}
    >
      <input
        id={name}
        name={name}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : hint ? `${name}-hint` : undefined}
        className={CONTROL}
        {...rest}
      />
    </FieldShell>
  );
}

export function Textarea({
  label,
  name,
  error,
  hint,
  required,
  className,
  rows = 4,
  ...rest
}: BaseProps & ComponentProps<"textarea">) {
  return (
    <FieldShell
      label={label}
      name={name}
      error={error}
      hint={hint}
      required={required}
      className={className}
    >
      <textarea
        id={name}
        name={name}
        rows={rows}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : hint ? `${name}-hint` : undefined}
        className={`${CONTROL} resize-y`}
        {...rest}
      />
    </FieldShell>
  );
}

export function Select({
  label,
  name,
  error,
  hint,
  required,
  className,
  options,
  ...rest
}: BaseProps &
  ComponentProps<"select"> & {
    options: readonly (string | { value: string; label: string })[];
  }) {
  return (
    <FieldShell
      label={label}
      name={name}
      error={error}
      hint={hint}
      required={required}
      className={className}
    >
      <select
        id={name}
        name={name}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : hint ? `${name}-hint` : undefined}
        className={`${CONTROL} appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23d4af37%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22/%3E%3C/svg%3E')] bg-[length:1.05rem] bg-[position:right_1rem_center] bg-no-repeat pr-11 [&>option]:bg-charcoal [&>option]:text-warm`}
        {...rest}
      >
        {options.map((option) => {
          const value = typeof option === "string" ? option : option.value;
          const text = typeof option === "string" ? option : option.label;
          return (
            <option key={value} value={value}>
              {text}
            </option>
          );
        })}
      </select>
    </FieldShell>
  );
}

export function Checkbox({
  label,
  name,
  className = "",
  ...rest
}: { label: string; name: string; className?: string } & ComponentProps<"input">) {
  return (
    <label
      htmlFor={name}
      className={`flex cursor-pointer items-center gap-3 font-ui text-[0.7225rem] text-warm/85 ${className}`}
    >
      <input
        id={name}
        name={name}
        type="checkbox"
        className="size-4 shrink-0 accent-[#d4af37]"
        {...rest}
      />
      {label}
    </label>
  );
}

/** Anti-spam honeypot. Off-screen, not display:none, so bots still fill it. */
export function Honeypot() {
  return (
    <div className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden" aria-hidden>
      <label htmlFor="company_website">Company website</label>
      <input
        id="company_website"
        name="company_website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
}
