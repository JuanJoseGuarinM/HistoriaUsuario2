"use client";

import Link from "next/link";
import { ProtectedView } from "@/components/ProtectedView";

export default function DashboardPage() {
  return (
    <ProtectedView>
      {({ user, clearSession, hasRole }) => (
        <main className="app-shell">
          <div className="app-container space-y-6">
            
            {/* Minimalist Top Nav */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">RegistryPlus</h1>
                <p className="text-xs text-gray-500">Panel de control</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{user?.nombre}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role === "admin" ? "Administrador" : "Usuario"}</p>
                </div>
                <button
                  onClick={clearSession}
                  className="btn-light px-3 py-1.5 text-xs font-medium"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="grid gap-6 md:grid-cols-3">
              
              {/* User Profile Card */}
              <div className="bg-white border border-gray-200 p-6 rounded-md shadow-sm md:col-span-2 space-y-4">
                <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
                  Información del Perfil
                </h2>
                
                <div className="grid gap-4 sm:grid-cols-2 text-sm">
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Nombre</span>
                    <span className="text-gray-900 font-medium">{user?.nombre || "-"}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Correo Electrónico</span>
                    <span className="text-gray-900 font-medium">{user?.email || "-"}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Rol</span>
                    <span className="text-gray-900 font-medium capitalize">{user?.role || "-"}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">ID de Usuario</span>
                    <span className="text-gray-900 font-mono text-xs">{user?._id || "-"}</span>
                  </div>
                </div>
              </div>

              {/* Actions Box */}
              <div className="bg-white border border-gray-200 p-6 rounded-md shadow-sm space-y-4 h-fit">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Accesos Disponibles
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {hasRole("admin")
                    ? "Tienes acceso completo para gestionar los usuarios del sistema."
                    : "Tu cuenta de usuario normal está activa en la plataforma."}
                </p>
                
                {hasRole("admin") ? (
                  <Link href="/admin/users" className="block pt-2">
                    <button className="w-full btn-dark py-2 text-xs font-medium">
                      Gestionar usuarios
                    </button>
                  </Link>
                ) : (
                  <div className="bg-green-50 border border-green-100 text-green-700 p-3 rounded-md text-xs font-medium text-center">
                    Estado: Activo
                  </div>
                )}
              </div>

            </div>

          </div>
        </main>
      )}
    </ProtectedView>
  );
}
