"use client";

import { useEffect, useState } from "react";
import type { Role, User, UserFormPayload } from "@/types/user";

const initialState: UserFormPayload = {
  nombre: "",
  cc: "",
  email: "",
  password: "",
  role: "user"
};

type UserFormProps = {
  editingUser: User | null;
  busy: boolean;
  onCancel: () => void;
  onSubmit: (payload: UserFormPayload) => Promise<void>;
};

export function UserForm({ editingUser, busy, onCancel, onSubmit }: UserFormProps) {
  const [form, setForm] = useState<UserFormPayload>(initialState);

  useEffect(() => {
    if (!editingUser) {
      setForm(initialState);
      return;
    }

    setForm({
      nombre: editingUser.nombre,
      cc: editingUser.cc,
      email: editingUser.email,
      password: "",
      role: editingUser.role
    });
  }, [editingUser]);

  function updateField<K extends keyof UserFormPayload>(key: K, value: UserFormPayload[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit(form);

    if (!editingUser) {
      setForm(initialState);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
          Nombre Completo
        </label>
        <input
          required
          className="form-input"
          placeholder="Ej. Valentina Alvarez"
          value={form.nombre}
          onChange={(event) => updateField("nombre", event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
          Cédula (CC)
        </label>
        <input
          required
          className="form-input"
          placeholder="Ej. 1098123456"
          value={form.cc}
          onChange={(event) => updateField("cc", event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
          Correo Electrónico
        </label>
        <input
          required
          className="form-input"
          placeholder="Ej. valentina@empresa.com"
          type="email"
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
          {editingUser ? "Nueva Contraseña (opcional)" : "Contraseña"}
        </label>
        <input
          required={!editingUser}
          className="form-input"
          placeholder={editingUser ? "Dejar vacío para conservar la actual" : "Mínimo 6 caracteres"}
          type="password"
          value={form.password}
          onChange={(event) => updateField("password", event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
          Rol de Acceso
        </label>
        <select
          className="form-input"
          value={form.role}
          onChange={(event) => updateField("role", event.target.value as Role)}
        >
          <option value="user">Usuario</option>
          <option value="admin">Administrador</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="btn-light px-4 py-2"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={busy}
          className="btn-dark px-5 py-2"
        >
          {busy ? "Guardando..." : editingUser ? "Guardar Cambios" : "Crear Usuario"}
        </button>
      </div>
    </form>
  );
}
