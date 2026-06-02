"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentSession, logout } from "@/services/authService";
import type { Role, SessionUser } from "@/types/user";

export function useAuthSession(options: { requiresAuth?: boolean; requiresAdmin?: boolean } = {}) {
  const { requiresAuth = false, requiresAdmin = false } = options;
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function checkSession() {
      try {
        const sessionUser = await getCurrentSession();
        
        if (isMounted) {
          if (!sessionUser) {
            setUser(null);
            if (requiresAuth) {
              router.replace("/login");
            }
          } else if (requiresAdmin && sessionUser.role !== "admin") {
            setUser(sessionUser);
            router.replace("/dashboard");
          } else {
            setUser(sessionUser);
          }
        }
      } catch {
        if (isMounted) {
          setUser(null);
          if (requiresAuth) {
            router.replace("/login");
          }
        }
      } finally {
        if (isMounted) {
          setIsReady(true);
        }
      }
    }

    checkSession();
    return () => {
      isMounted = false;
    };
  }, [requiresAuth, requiresAdmin, router]);

  function saveSession(sessionUser: SessionUser) {
    setUser(sessionUser);
    setIsReady(true);
  }

  async function clearSession() {
    try {
      await logout();
    } catch {}
    setUser(null);
    setIsReady(true);
    router.push("/login");
  }

  return {
    user,
    isReady,
    isAuthenticated: Boolean(user),
    saveSession,
    clearSession,
    hasRole: (role: Role) => user?.role === role
  };
}
