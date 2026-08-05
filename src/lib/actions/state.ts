/**
 * Shared form-action state. Kept out of the "use server" modules, which may
 * only export async functions.
 */

export interface FormState {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string>;
  /** Echoed back so the UI can re-render the guest's input after a failure. */
  values?: Record<string, string>;
}

export const initialFormState: FormState = { status: "idle" };

export interface AdminState {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string>;
}

export const initialAdminState: AdminState = { status: "idle" };
