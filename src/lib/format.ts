import type { Availability, OpeningHour } from "./types";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

/** Kobo → "₦18,500". Whole naira only; the kitchen never prices in kobo. */
export function formatPrice(minor: number, currency = "NGN") {
  const major = minor / 100;
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: major % 1 === 0 ? 0 : 2,
    }).format(major);
  } catch {
    return `${currency} ${major.toLocaleString("en-NG")}`;
  }
}

/** "21:00" or "21:00:00" → "9:00 PM" */
export function formatTime(value: string | null) {
  if (!value) return "";
  const [hRaw, mRaw = "00"] = value.split(":");
  const hour = Number(hRaw);
  if (Number.isNaN(hour)) return value;
  const suffix = hour >= 12 ? "PM" : "AM";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}:${mRaw.padStart(2, "0")} ${suffix}`;
}

/** "2026-08-08" → "Sat, 8 August 2026" — parsed as a plain date, never UTC-shifted. */
export function formatDate(value: string, opts?: Intl.DateTimeFormatOptions) {
  const [y, m, d] = value.split("T")[0].split("-").map(Number);
  if (!y || !m || !d) return value;
  return new Date(y, m - 1, d).toLocaleDateString("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    ...opts,
  });
}

export function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function dayName(dayOfWeek: number) {
  return DAYS[dayOfWeek] ?? "";
}

export function formatHours(hour: OpeningHour) {
  if (hour.is_closed || !hour.opens_at) return "Closed";
  return `${formatTime(hour.opens_at)} – ${formatTime(hour.closes_at)}`;
}

export const AVAILABILITY_LABEL: Record<Availability, string> = {
  available: "Available",
  limited: "Limited",
  sold_out: "Sold out",
  seasonal: "Seasonal",
};

/** Today in Africa/Lagos as YYYY-MM-DD — the venue's clock, not the browser's. */
export function todayInLagos() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}
