import type { User, UserFormPayload } from "@/types/user";

export async function getUsers(): Promise<User[]> {
  const res = await fetch("/api/users");
  if (!res.ok) {
    throw new Error("No fue posible cargar usuarios.");
  }
  const data = await res.json();
  return data.users || [];
}

export async function createUser(payload: UserFormPayload): Promise<User> {
  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Error al crear usuario.");
  }
  return data.user;
}

export async function updateUser(id: string, payload: UserFormPayload): Promise<User> {
  const res = await fetch(`/api/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Error al actualizar usuario.");
  }
  return data.user;
}

export async function deleteUser(id: string): Promise<void> {
  const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Error al eliminar usuario.");
  }
}
