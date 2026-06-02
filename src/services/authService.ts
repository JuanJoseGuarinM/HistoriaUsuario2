import type { LoginPayload, RegisterPayload, SessionUser } from "@/types/user";

export async function login(payload: LoginPayload): Promise<SessionUser> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Error al iniciar sesión.");
  }
  return data.user;
}

export async function register(payload: RegisterPayload): Promise<SessionUser> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Error al registrarse.");
  }
  return data.user;
}

export async function getCurrentSession(): Promise<SessionUser | null> {
  try {
    const res = await fetch("/api/auth/session");
    if (!res.ok) return null;
    const data = await res.json();
    return data.user || null;
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  const res = await fetch("/api/auth/logout", { method: "POST" });
  if (!res.ok) {
    throw new Error("Error al cerrar sesión.");
  }
}
