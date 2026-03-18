import React, { createContext, useContext, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../lib/api";
import { clearAuth, getStoredUser, getToken, setAuth } from "../lib/authStorage";
import type { AuthUser } from "../lib/authStorage";

type AuthState = {
  user: AuthUser | null;
  token: string;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string>(() => getToken());
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());

  const isAuthenticated = !!token && !!user;

  async function login(email: string, password: string) {
    const res = await api.post("/auth/login", { email, password });
    const { token: t, user: u } = res.data as { token: string; user: AuthUser };
    setAuth(t, u);
    setToken(t);
    setUser(u);
    toast.success("Welcome back!");
  }

  async function register(name: string, email: string, password: string) {
    const res = await api.post("/auth/register", { name, email, password });
    const { token: t, user: u } = res.data as { token: string; user: AuthUser };
    setAuth(t, u);
    setToken(t);
    setUser(u);
    toast.success("Account created!");
  }

  function logout() {
    clearAuth();
    setToken("");
    setUser(null);
    toast.success("Logged out");
  }

  async function refreshMe() {
    if (!getToken()) return;
    const res = await api.get("/auth/me");
    const u = (res.data as { user: AuthUser }).user;
    setAuth(getToken(), u);
    setUser(u);
    setToken(getToken());
  }

  const value = useMemo<AuthState>(
    () => ({ user, token, isAuthenticated, login, register, logout, refreshMe }),
    [user, token, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

