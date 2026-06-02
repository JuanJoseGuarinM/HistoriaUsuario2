"use client";

import { useAuthSession } from "@/hooks/useAuthSession";

type ProtectedViewProps = {
  children: (session: ReturnType<typeof useAuthSession>) => React.ReactNode;
  requiresAdmin?: boolean;
};

export function ProtectedView({ children, requiresAdmin = false }: ProtectedViewProps) {
  const session = useAuthSession({ requiresAuth: true, requiresAdmin });

  if (!session.isReady) {
    return (
      <div className="app-shell flex items-center justify-center">
        <div className="bg-white border border-gray-200 flex min-w-56 flex-col items-center gap-3 px-8 py-10 rounded-md shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Cargando sesión...</p>
        </div>
      </div>
    );
  }

  if (!session.user) {
    return null;
  }

  return <>{children(session)}</>;
}
