export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "price"
  | "url"
  | "date"
  | "time"
  | "datetime-local"
  | "select"
  | "checkbox"
  | "hidden";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  options?: { value: string; label: string }[];
  /** Column span within the 2-column editor grid. */
  span?: 1 | 2;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: string | number | boolean;
}

/** How a record is summarised in the resource list. */
export interface ListConfig {
  primary: string;
  secondary?: string;
  image?: string;
  /** Field names rendered as small pills (booleans render as the label). */
  badges?: string[];
  price?: string;
}

export const AVAILABILITY_OPTIONS = [
  { value: "available", label: "Available" },
  { value: "limited", label: "Limited" },
  { value: "sold_out", label: "Sold out" },
  { value: "seasonal", label: "Seasonal" },
];

export const KIND_OPTIONS = [
  { value: "food", label: "Food" },
  { value: "beverage", label: "Beverage" },
];

export const RESERVATION_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "seated", label: "Seated" },
  { value: "cancelled", label: "Cancelled" },
  { value: "no_show", label: "No show" },
];

export const INQUIRY_STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "in_progress", label: "In progress" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];
