import type { PublicUser, RegisterInput } from "../../server/types";

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; errors: Record<string, string>; message: string };

async function parseResponse<T>(response: Response): Promise<ApiResult<T>> {
  const body = (await response.json().catch(() => ({}))) as {
    error?: string;
    errors?: Record<string, string>;
  } & T;

  if (!response.ok) {
    return {
      ok: false,
      errors: body.errors ?? {},
      message: body.error ?? "Ha ocurrido un error inesperado.",
    };
  }

  return { ok: true, data: body };
}

export async function registerUser(input: RegisterInput): Promise<ApiResult<{ user: PublicUser }>> {
  const response = await fetch("/api/users/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  });
  return parseResponse(response);
}

export async function loginUser(input: {
  email: string;
  password: string;
}): Promise<ApiResult<{ user: PublicUser }>> {
  const response = await fetch("/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  });
  return parseResponse(response);
}

export async function logoutUser(): Promise<void> {
  await fetch("/api/users/logout", { method: "POST", credentials: "include" });
}

export async function updateSelectedPlan(plan: string): Promise<ApiResult<{ user: PublicUser }>> {
  const response = await fetch("/api/users/me/plan", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ plan }),
  });
  return parseResponse(response);
}
