"use client";

import { useState } from "react";
import Link from "next/link";
import { ProtectedView } from "@/components/ProtectedView";
import { UserForm } from "@/components/UserForm";
import { useUsers } from "@/hooks/useUsers";
import type { User, UserFormPayload } from "@/types/user";

export default function AdminUsersPage() {
  return (
    <ProtectedView requiresAdmin>
      {({ user, clearSession }) => (
        <AdminUsersContent userName={user?.nombre ?? ""} onLogout={clearSession} />
      )}
    </ProtectedView>
  );
}

function AdminUsersContent({
  userName,
  onLogout
}: {
  userName: string;
  onLogout: () => void;
}) {
  const { users, loading, error, createUser, updateUser, deleteUser } = useUsers();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  async function handleSubmit(payload: UserFormPayload) {
    try {
      setBusy(true);
      setFeedback(null);

      if (editingUser) {
        await updateUser(editingUser._id, payload);
        setFeedback("Usuario actualizado correctamente.");
      } else {
        await createUser(payload);
        setFeedback("Usuario creado correctamente.");
      }

      setEditingUser(null);
      setIsFormOpen(false);
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : "Ocurrió un error inesperado.");
    } finally {
      setBusy(false);
    }
  }

  function handleCreate() {
    setEditingUser(null);
    setFeedback(null);
    setIsFormOpen(true);
  }

  function handleEdit(user: User) {
    setFeedback(null);
    setEditingUser(user);
    setIsFormOpen(true);
  }

  function handleDeleteRequest(user: User) {
    setUserToDelete(user);
    setFeedback(null);
    setIsDeleteOpen(true);
  }

  function handleCloseForm() {
    setEditingUser(null);
    setIsFormOpen(false);
  }

  async function handleConfirmDelete() {
    if (!userToDelete) {
      return;
    }

    try {
      setBusy(true);
      await deleteUser(userToDelete._id);
      setFeedback("Usuario eliminado correctamente.");

      if (editingUser?._id === userToDelete._id) {
        setEditingUser(null);
      }

      setUserToDelete(null);
      setIsDeleteOpen(false);
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : "No fue posible eliminar el usuario.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <main className="app-shell">
        <div className="app-container space-y-6">
          
          {/* Header/Nav */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">RegistryPlus</h1>
              <p className="text-xs text-gray-500">Administración de Usuarios</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <button className="btn-light px-3 py-1.5 text-xs font-medium">
                  Ir al Dashboard
                </button>
              </Link>
              <button
                onClick={onLogout}
                className="btn-light px-3 py-1.5 text-xs font-medium"
              >
                Cerrar sesión
              </button>
            </div>
          </div>

          {/* Stats Boxes */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="bg-white border border-gray-200 p-4 rounded-md shadow-sm">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Administrador</span>
              <span className="text-sm font-semibold text-gray-900 mt-1 block">{userName}</span>
            </div>
            <div className="bg-white border border-gray-200 p-4 rounded-md shadow-sm">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Total Usuarios</span>
              <span className="text-sm font-semibold text-gray-900 mt-1 block">{users.length}</span>
            </div>
            <div className="bg-white border border-gray-200 p-4 rounded-md shadow-sm">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Estado Sistema</span>
              <span className="text-sm font-semibold text-emerald-700 mt-1 block">Conectado</span>
            </div>
          </div>

          {/* Main User List Section */}
          <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 border-b border-gray-150 gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Lista de Usuarios
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Crea, edita y elimina registros del sistema de usuarios.
                </p>
              </div>
              <button onClick={handleCreate} className="btn-dark py-2 text-xs font-medium px-4">
                Nuevo Usuario
              </button>
            </div>

            <div className="p-6 pt-4">
              {feedback ? (
                <div className="text-sm text-gray-700 bg-gray-50 border border-gray-200 p-3 rounded-md mb-4">
                  {feedback}
                </div>
              ) : null}

              {loading ? (
                <div className="flex py-10 items-center justify-center">
                  <p className="text-sm text-gray-500">Cargando usuarios...</p>
                </div>
              ) : null}

              {!loading && error ? (
                <div className="text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded-md mb-4">
                  {error}
                </div>
              ) : null}

              {!loading && !error && users.length === 0 ? (
                <div className="py-10 text-center text-sm text-gray-500">
                  No hay usuarios registrados.
                </div>
              ) : null}

              {!loading && users.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-table">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Cédula (CC)</th>
                        <th>Correo Electrónico</th>
                        <th>Rol</th>
                        <th className="text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((listedUser) => (
                        <tr key={listedUser._id}>
                          <td className="font-semibold text-gray-900">{listedUser.nombre}</td>
                          <td>{listedUser.cc}</td>
                          <td>{listedUser.email}</td>
                          <td>
                            <span className={`min-badge ${listedUser.role === 'admin' ? 'min-badge-admin' : 'min-badge-user'}`}>
                              {listedUser.role === 'admin' ? 'Administrador' : 'Usuario'}
                            </span>
                          </td>
                          <td className="text-right space-x-3">
                            <button
                              onClick={() => handleEdit(listedUser)}
                              className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteRequest(listedUser)}
                              className="text-xs text-red-600 hover:text-red-800 font-semibold"
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </main>

      {/* Dialog Shell for Create/Edit Form */}
      {isFormOpen ? (
        <DialogShell>
          <div className="relative mx-auto w-full max-w-lg rounded-md border border-gray-200 bg-white p-6 shadow-md">
            <div className="mb-4 pb-3 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {editingUser ? "Editar Usuario" : "Nuevo Usuario"}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Completa los datos del formulario a continuación.
              </p>
            </div>
            
            <UserForm
              busy={busy}
              editingUser={editingUser}
              onCancel={handleCloseForm}
              onSubmit={handleSubmit}
            />
          </div>
        </DialogShell>
      ) : null}

      {/* Dialog Shell for Delete Confirmation */}
      {isDeleteOpen ? (
        <DialogShell>
          <div className="relative mx-auto w-full max-w-md rounded-md border border-gray-200 bg-white p-6 shadow-md">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                Eliminar Usuario
              </h2>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-500">
                {userToDelete
                  ? `¿Confirmas que deseas eliminar a ${userToDelete.nombre}? Esta acción no se puede deshacer.`
                  : "¿Confirmas esta acción para continuar?"}
              </p>
            </div>
            
            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setUserToDelete(null);
                  setIsDeleteOpen(false);
                }}
                className="btn-light px-4 py-2 text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={busy}
                className="bg-red-600 hover:bg-red-700 text-white rounded-md px-4 py-2 text-xs font-medium"
              >
                {busy ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </DialogShell>
      ) : null}
    </>
  );
}

function DialogShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-xs" />
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
