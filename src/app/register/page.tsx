"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { register } from "@/services/authService";

export default function RegisterPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [cc, setCc] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const sessionUser = await register({ nombre, cc, email, password });

      router.push(`/login?registered=1&email=${encodeURIComponent(sessionUser.email)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No fue posible crear la cuenta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app-shell flex items-center justify-center">
      <div className="w-full max-w-md bg-white border border-gray-200 p-8 rounded-md shadow-sm">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Crear cuenta
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Completa tus datos para registrarte en la plataforma.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Nombre
            </label>
            <input
              required
              className="form-input"
              placeholder="Valentina Alvarez"
              type="text"
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Cédula
            </label>
            <input
              required
              className="form-input"
              placeholder="1098123456"
              type="text"
              value={cc}
              onChange={(event) => setCc(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Email
            </label>
            <input
              required
              className="form-input"
              placeholder="usuario@empresa.com"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Contraseña
            </label>
            <input
              required
              className="form-input"
              placeholder="Mínimo 6 caracteres"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          {error ? (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded-md">
              {error}
            </div>
          ) : null}

          <button
            className="w-full btn-dark py-2 text-sm font-medium mt-2"
            disabled={loading}
            type="submit"
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm border-t border-gray-100 pt-6">
          <p className="text-xs text-gray-400 mb-3 leading-relaxed">
            ¿Ya tienes una cuenta registrada?
          </p>
          <Link
            className="text-sm font-medium text-gray-600 hover:text-gray-950 underline underline-offset-4"
            href="/login"
          >
            Volver al login
          </Link>
        </div>
      </div>
    </main>
  );
}
