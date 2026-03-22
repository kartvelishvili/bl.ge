"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

const getToken = () => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("user");
  if (!user) return null;
  try {
    return JSON.parse(user).token;
  } catch {
    return null;
  }
};

export function useAdminAuth() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const tokenRef = useRef<string | null>(null);

  useEffect(() => {
    const t = getToken();
    if (!t) {
      router.replace("/admin/login");
    } else {
      tokenRef.current = t;
      setToken(t);
      setReady(true);
    }
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    tokenRef.current = null;
    setToken(null);
    router.push("/admin/login");
  }, [router]);

  const authFetch = useCallback(async (url: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers);
    if (tokenRef.current) {
      headers.set("Authorization", `Bearer ${tokenRef.current}`);
    }
    const res = await fetch(url, { ...options, headers });
    if (res.status === 401) {
      logout();
      throw new Error("Unauthorized");
    }
    return res;
  }, [logout]);

  return { token, ready, logout, authFetch };
}
