"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getCurrentSession, logout } from "@/services/authService";
import {
  clearClientSession,
  getClientStoredSession,
  storeClientSession
} from "@/lib/session.client";
import type { Role, SessionUser } from "@/types/user";

type Options = {
  requiresAuth?: boolean;
  requiresAdmin?: boolean;
};

export function useAuthSession(options: Options = {}) {
  const { requiresAuth = false, requiresAdmin = false } = options;
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const storedSession = getClientStoredSession();

    if (!storedSession) {
      setUser(null);
      setIsReady(true);

      if (requiresAuth) {
        router.replace("/login");
      }

      return;
    }

    async function loadSession() {
      try {
        const sessionUser = await getCurrentSession();

        if (!isMounted) {
          return;
        }

        if (!sessionUser) {
          clearClientSession();
          setUser(null);

          if (requiresAuth) {
            router.replace("/login");
          }

          return;
        }

        if (requiresAdmin && sessionUser.role !== "admin") {
          storeClientSession(sessionUser);
          setUser(sessionUser);
          router.replace("/dashboard");
          return;
        }

        storeClientSession(sessionUser);
        setUser(sessionUser);
      } catch {
        if (!isMounted) {
          return;
        }

        clearClientSession();
        setUser(null);

        if (requiresAuth) {
          router.replace("/login");
        }
      } finally {
        if (isMounted) {
          setIsReady(true);
        }
      }
    }

    setIsReady(false);
    void loadSession();

    return () => {
      isMounted = false;
    };
  }, [pathname, requiresAdmin, requiresAuth, router]);

  function saveSession(sessionUser: SessionUser) {
    storeClientSession(sessionUser);
    setUser(sessionUser);
    setIsReady(true);
  }

  async function clearSession() {
    try {
      await logout();
    } catch {
      // Even if the server cookie is already gone, we still want the client to recover.
    } finally {
      clearClientSession();
      setUser(null);
      setIsReady(true);
      router.push("/login");
    }
  }

  function hasRole(role: Role) {
    return user?.role === role;
  }

  return {
    user,
    isReady,
    isAuthenticated: Boolean(user),
    saveSession,
    clearSession,
    hasRole
  };
}
