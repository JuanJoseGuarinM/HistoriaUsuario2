"use client";

import { useEffect, useState } from "react";
import {
  createUser as createUserRequest,
  deleteUser as deleteUserRequest,
  getUsers,
  updateUser as updateUserRequest
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
      setError(err instanceof Error ? err.message : "No fue posible cargar usuarios.");
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
    setUsers((current) => current.map((user) => (user._id === id ? updated : user)));
    return updated;
  }

  async function deleteUser(id: string) {
    await deleteUserRequest(id);
    setUsers((current) => current.filter((user) => user._id !== id));
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
