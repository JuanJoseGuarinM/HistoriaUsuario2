"use client";

import { Suspense, FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { login } from "@/services/authService";
import { useAuthSession } from "@/hooks/useAuthSession";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { saveSession, isAuthenticated, isReady, user } = useAuthSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isReady && isAuthenticated && user) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isReady, router, user]);

  useEffect(() => {
    if (searchParams.get("registered") === "1") {
      setMessage("Cuenta creada correctamente. Ya puedes iniciar sesión.");

      const email = searchParams.get("email");
      if (email) {
        setEmail(email);
      }
    }
  }, [searchParams]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");
      const sessionUser = await login({ email, password });
      saveSession(sessionUser);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Email o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  }

  if (isReady && isAuthenticated && user) {
    return null;
  }

  return (
    <main className="app-shell flex items-center justify-center">
      <div className="w-full max-w-md bg-white border border-gray-200 p-8 rounded-md shadow-sm">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            RegistryPlus
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Inicia sesión para gestionar usuarios y acceder al dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Email
            </label>
            <input
              required
              className="form-input"
              placeholder="admin@empresa.com"
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
              placeholder="Tu contraseña"
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

          {message ? (
            <div className="text-sm text-gray-600 bg-gray-50 border border-gray-150 p-3 rounded-md">
              {message}
            </div>
          ) : null}

          <button
            className="w-full btn-dark py-2 text-sm font-medium mt-2"
            disabled={loading}
            type="submit"
          >
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm border-t border-gray-100 pt-6">
          <p className="text-xs text-gray-400 mb-3 leading-relaxed">
            Si eres nuevo, crea tu cuenta desde el registro.
          </p>
          <Link
            className="text-sm font-medium text-gray-600 hover:text-gray-950 underline underline-offset-4"
            href="/register"
          >
            Ir a registro
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="app-shell flex items-center justify-center">
          <div className="w-full max-w-md bg-white border border-gray-200 p-8 rounded-md text-center text-sm text-gray-500 shadow-sm">
            Cargando login...
          </div>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
