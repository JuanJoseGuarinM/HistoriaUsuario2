"use client";

import { useEffect, useState } from "react";
import type { User, UserFormPayload } from "@/types/user";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadUsers() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/users");
      if (!res.ok) {
        throw new Error("No fue posible cargar usuarios.");
      }
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido.");
    } finally {
      setLoading(false);
    }
  }

  async function createUser(payload: UserFormPayload) {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Error al crear usuario.");
    }
    setUsers((current) => [data.user, ...current]);
    return data.user;
  }

  async function updateUser(id: string, payload: UserFormPayload) {
    const res = await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Error al actualizar usuario.");
    }
    setUsers((current) => current.map((u) => (u._id === id ? data.user : u)));
    return data.user;
  }

  async function deleteUser(id: string) {
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Error al eliminar usuario.");
    }
    setUsers((current) => current.filter((u) => u._id !== id));
  }

  useEffect(() => {
    void loadUsers();
  }, []);

  return {
    users,
    loading,
    error,
    loadUsers,
    createUser,
    updateUser,
    deleteUser
  };
}
