"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import type { FieldDef, ListConfig } from "./fields";
import { deleteRecord } from "@/lib/actions/admin";
import { initialAdminState, type AdminState } from "@/lib/actions/state";
import { formatPrice } from "@/lib/format";

/** Records arrive as concrete domain interfaces; fields are read by name. */
type Record_ = { id: string };

const read = (record: Record_ | null, key: string): unknown =>
  record ? (record as unknown as Record<string, unknown>)[key] : undefined;

interface ResourceManagerProps {
  title: string;
  /** Table name used by the shared delete action. Must be on its allow-list. */
  table: string;
  records: Record_[];
  fields: FieldDef[];
  saveAction: (state: AdminState, formData: FormData) => Promise<AdminState>;
  listConfig: ListConfig;
  readOnly?: boolean;
  emptyLabel?: string;
  addLabel?: string;
}

export function ResourceManager({
  title,
  table,
  records,
  fields,
  saveAction,
  listConfig,
  readOnly = false,
  emptyLabel = "Nothing here yet.",
  addLabel = "Add new",
}: ResourceManagerProps) {
  const [editing, setEditing] = useState<Record_ | "new" | null>(null);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="font-ui text-[0.663rem] text-white/45">
          {records.length} {records.length === 1 ? "record" : "records"}
        </p>
        <button
          type="button"
          disabled={readOnly}
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-2 rounded-lg bg-gold px-4 py-2.5 font-ui text-[0.663rem] font-medium text-ink transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
        >
          <Plus className="size-4" aria-hidden />
          {addLabel}
        </button>
      </div>

      {records.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/12 px-6 py-14 text-center font-ui text-[0.731rem] text-white/40">
          {emptyLabel}
        </p>
      ) : (
        <ul className="grid gap-3">
          {records.map((record) => (
            <li
              key={record.id}
              className="flex items-center gap-4 rounded-xl border border-white/8 bg-white/[0.02] p-3.5 transition-colors hover:border-white/16"
            >
              {listConfig.image && read(record, listConfig.image) ? (
                <div className="relative size-14 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={String(read(record, listConfig.image))}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
              ) : null}

              <div className="min-w-0 flex-1">
                <p className="truncate font-ui text-[0.765rem] font-medium text-white/90">
                  {String(read(record, listConfig.primary) ?? "Untitled")}
                </p>
                {listConfig.secondary && read(record, listConfig.secondary) ? (
                  <p className="mt-0.5 truncate font-ui text-[0.663rem] text-white/40">
                    {String(read(record, listConfig.secondary))}
                  </p>
                ) : null}

                <div className="mt-2 flex flex-wrap gap-1.5">
                  {listConfig.price && read(record, listConfig.price) !== undefined ? (
                    <Badge tone="gold">
                      {formatPrice(Number(read(record, listConfig.price)))}
                    </Badge>
                  ) : null}
                  {listConfig.badges?.map((name) => {
                    const value = read(record, name);
                    if (value === undefined || value === null || value === "") return null;
                    if (typeof value === "boolean") {
                      return value ? (
                        <Badge key={name} tone="muted">
                          {name.replace(/^is_/, "").replace(/_/g, " ")}
                        </Badge>
                      ) : (
                        <Badge key={name} tone="dim">
                          not {name.replace(/^is_/, "").replace(/_/g, " ")}
                        </Badge>
                      );
                    }
                    return (
                      <Badge key={name} tone="muted">
                        {String(value).replace(/_/g, " ")}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  disabled={readOnly}
                  onClick={() => setEditing(record)}
                  aria-label={`Edit ${String(read(record, listConfig.primary) ?? "record")}`}
                  className="rounded-lg border border-white/10 p-2.5 text-white/60 transition-colors hover:border-gold/50 hover:text-gold disabled:opacity-40"
                >
                  <Pencil className="size-4" aria-hidden />
                </button>
                <DeleteButton
                  table={table}
                  id={record.id}
                  label={String(read(record, listConfig.primary) ?? "record")}
                  disabled={readOnly}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      <AnimatePresence>
        {editing ? (
          <EditorDrawer
            title={editing === "new" ? `${addLabel} — ${title}` : `Edit ${title}`}
            fields={fields}
            record={editing === "new" ? null : editing}
            saveAction={saveAction}
            onClose={() => setEditing(null)}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function Badge({
  children,
  tone = "muted",
}: {
  children: React.ReactNode;
  tone?: "gold" | "muted" | "dim";
}) {
  const tones = {
    gold: "border-gold/30 text-gold",
    muted: "border-white/12 text-white/55",
    dim: "border-white/8 text-white/25",
  };
  return (
    <span
      className={`rounded-full border px-2 py-0.5 font-ui text-[0.51rem] uppercase tracking-[0.12em] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function DeleteButton({
  table,
  id,
  label,
  disabled,
}: {
  table: string;
  id: string;
  label: string;
  disabled?: boolean;
}) {
  const [state, action] = useActionState(deleteRecord, initialAdminState);
  const [confirming, setConfirming] = useState(false);

  // Give the guest a moment to change their mind before the button re-arms.
  useEffect(() => {
    if (!confirming) return;
    const timer = setTimeout(() => setConfirming(false), 4000);
    return () => clearTimeout(timer);
  }, [confirming]);

  if (!confirming) {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={() => setConfirming(true)}
        aria-label={`Delete ${label}`}
        className="rounded-lg border border-white/10 p-2.5 text-white/60 transition-colors hover:border-red-400/50 hover:text-red-300 disabled:opacity-40"
      >
        <Trash2 className="size-4" aria-hidden />
      </button>
    );
  }

  return (
    <form action={action} className="flex items-center gap-1">
      <input type="hidden" name="table" value={table} />
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="rounded-lg border border-red-400/50 bg-red-500/10 px-3 py-2.5 font-ui text-[0.612rem] text-red-200"
      >
        {state.status === "error" ? "Retry" : "Confirm"}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        aria-label="Cancel delete"
        className="rounded-lg border border-white/10 p-2.5 text-white/50"
      >
        <X className="size-4" aria-hidden />
      </button>
    </form>
  );
}

function EditorDrawer({
  title,
  fields,
  record,
  saveAction,
  onClose,
}: {
  title: string;
  fields: FieldDef[];
  record: Record_ | null;
  saveAction: (state: AdminState, formData: FormData) => Promise<AdminState>;
  onClose: () => void;
}) {
  const [state, action] = useActionState(saveAction, initialAdminState);

  useEffect(() => {
    if (state.status === "success") onClose();
  }, [state.status, onClose]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-100 flex justify-end bg-black/70 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <motion.div
        className="flex h-full w-full max-w-2xl flex-col border-l border-white/10 bg-[#141414]"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/8 px-6 py-5">
          <h2 className="font-display text-lg text-white/90">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close editor"
            className="rounded-lg border border-white/10 p-2 text-white/60 hover:border-white/25"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>

        <form action={action} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {state.status === "error" && state.message ? (
              <p
                role="alert"
                className="mb-5 rounded-lg border border-red-400/25 bg-red-500/10 px-4 py-3 font-ui text-[0.697rem] text-red-200"
              >
                {state.message}
              </p>
            ) : null}

            <input type="hidden" name="id" value={record?.id ?? ""} />

            <div className="grid gap-5 sm:grid-cols-2">
              {fields.map((field) => (
                <EditorField
                  key={field.name}
                  field={field}
                  record={record}
                  error={state.errors?.[field.name]}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-white/8 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-white/12 px-5 py-2.5 font-ui text-[0.68rem] text-white/70 hover:border-white/25"
            >
              Cancel
            </button>
            <SaveButton />
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

const CONTROL =
  "w-full rounded-lg border border-white/12 bg-white/[0.03] px-3.5 py-2.5 font-ui text-[0.731rem] text-white/90 placeholder:text-white/25 outline-none transition-colors focus:border-gold/70 aria-[invalid=true]:border-red-400/70";

function EditorField({
  field,
  record,
  error,
}: {
  field: FieldDef;
  record: Record_ | null;
  error?: string;
}) {
  const raw = read(record, field.name);

  // Prices live in kobo but are edited in naira.
  const value =
    field.type === "price"
      ? raw === undefined || raw === null
        ? ""
        : String(Number(raw) / 100)
      : Array.isArray(raw)
        ? raw.join(", ")
        : raw === null || raw === undefined
          ? ""
          : String(raw);

  const fallback =
    value === "" && field.defaultValue !== undefined
      ? String(field.defaultValue)
      : value;

  const span = field.span === 2 ? "sm:col-span-2" : "";

  if (field.type === "hidden") {
    return <input type="hidden" name={field.name} value={fallback} />;
  }

  if (field.type === "checkbox") {
    const checked =
      raw === undefined ? Boolean(field.defaultValue) : Boolean(raw);
    return (
      <div className={`${span} flex items-center`}>
        <label
          htmlFor={field.name}
          className="flex cursor-pointer items-center gap-3 font-ui text-[0.731rem] text-white/75"
        >
          {/* Unchecked boxes submit nothing, so a paired hidden input keeps
              the field present in FormData for the "false" case. */}
          <input type="hidden" name={field.name} value="" />
          <input
            id={field.name}
            name={field.name}
            type="checkbox"
            value="true"
            defaultChecked={checked}
            className="size-4 accent-[#d4af37]"
          />
          {field.label}
        </label>
      </div>
    );
  }

  const describedBy = error
    ? `${field.name}-error`
    : field.hint
      ? `${field.name}-hint`
      : undefined;

  return (
    <div className={span}>
      <label
        htmlFor={field.name}
        className="mb-2 block font-ui text-[0.578rem] uppercase tracking-[0.16em] text-white/45"
      >
        {field.label}
        {field.required ? <span className="ml-1 text-gold">*</span> : null}
      </label>

      {field.type === "textarea" ? (
        <textarea
          id={field.name}
          name={field.name}
          rows={5}
          required={field.required}
          placeholder={field.placeholder}
          defaultValue={fallback}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`${CONTROL} resize-y`}
        />
      ) : field.type === "select" ? (
        <select
          id={field.name}
          name={field.name}
          required={field.required}
          defaultValue={fallback}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`${CONTROL} [&>option]:bg-[#141414]`}
        >
          {!field.required ? <option value="">—</option> : null}
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={field.name}
          name={field.name}
          type={
            field.type === "price" || field.type === "number"
              ? "number"
              : field.type === "url"
                ? "url"
                : field.type
          }
          step={field.type === "price" ? 1 : field.step}
          min={field.min}
          max={field.max}
          required={field.required}
          placeholder={field.placeholder}
          defaultValue={fallback}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={CONTROL}
        />
      )}

      {error ? (
        <p id={`${field.name}-error`} role="alert" className="mt-1.5 text-[0.6375rem] text-red-300">
          {error}
        </p>
      ) : field.hint ? (
        <p id={`${field.name}-hint`} className="mt-1.5 text-[0.6375rem] text-white/35">
          {field.hint}
        </p>
      ) : null}
    </div>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-2.5 font-ui text-[0.68rem] font-medium text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
    >
      {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
      Save
    </button>
  );
}
