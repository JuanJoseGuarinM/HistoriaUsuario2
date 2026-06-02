/**
 * Funciones de sesión que se ejecutan exclusivamente en el cliente (browser).
 * Este archivo NO importa nada de Node.js para que sea seguro en el bundle del cliente.
 */

import { SESSION_STORAGE_KEY } from "@/lib/sessionConstants";
import type { SessionUser } from "@/types/user";

export function getClientStoredSession(): SessionUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawSession = window.localStorage.getItem(SESSION_STORAGE_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession) as SessionUser;
  } catch {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

export function storeClientSession(user: SessionUser): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
}

export function clearClientSession(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(SESSION_STORAGE_KEY);
}
