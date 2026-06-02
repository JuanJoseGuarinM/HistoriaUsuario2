"use client";

import { useEffect, useState } from "react";
import {
  getUsers,
  createUser as createUserRequest,
  updateUser as updateUserRequest,
  deleteUser as deleteUserRequest
} from "@/services/userService";
import type { User, UserFormPayload } from "@/types/user";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadUsers() {
    try {
      setLoading(true);
      setError(null);
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido.");
    } finally {
      setLoading(false);
    }
  }

  async function createUser(payload: UserFormPayload) {
    const created = await createUserRequest(payload);
    setUsers((current) => [created, ...current]);
    return created;
  }

  async function updateUser(id: string, payload: UserFormPayload) {
    const updated = await updateUserRequest(id, payload);
    setUsers((current) => current.map((u) => (u._id === id ? updated : u)));
    return updated;
  }

  async function deleteUser(id: string) {
    await deleteUserRequest(id);
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
