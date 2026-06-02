"use client";

import type { Role, User } from "@/types/user";

type UserCardProps = {
  nombre: string;
  cc: string;
  email: string;
  role: Role;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  user: User;
};

export function UserCard({ nombre, cc, email, role, onEdit, onDelete, user }: UserCardProps) {
  return (
    <div className="bg-white border border-gray-200 p-5 rounded-md shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-base font-bold text-gray-900">{nombre}</h3>
          <p className="text-xs text-gray-400">CC: {cc}</p>
        </div>
        <span className={`min-badge ${role === "admin" ? "min-badge-admin" : "min-badge-user"}`}>
          {role === "admin" ? "Admin" : "Usuario"}
        </span>
      </div>

      <div className="text-sm text-gray-600">
        <p className="truncate"><span className="font-semibold text-gray-800">Email:</span> {email}</p>
      </div>

      <div className="flex gap-2 pt-2 border-t border-gray-100">
        <button
          onClick={() => onEdit(user)}
          className="btn-light px-3 py-1.5 text-xs font-medium"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(user)}
          className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 text-xs font-medium rounded-md border border-red-200 transition-colors"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
