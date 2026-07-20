import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

/**
 * Demo auth service backed by localStorage.
 * The API surface (register / login / logout) is async and mirrors a real
 * HTTP backend, so swapping in a server later only touches this file.
 */

export interface User {
  name: string;
  phone: string; // 9 digits after +998
  createdAt: string;
}

interface StoredUser extends User {
  hash: string;
}

export type RegisterError = "taken" | "unknown";

interface AuthValue {
  user: User | null;
  register: (name: string, phone: string, password: string) => Promise<{ ok: boolean; error?: RegisterError }>;
  login: (phone: string, password: string) => Promise<boolean>;
  /** Demo recovery: no SMS step, so the caller must surface that to the user. */
  resetPassword: (phone: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const USERS_KEY = "tanzif-users";
const SESSION_KEY = "tanzif-session";

/** Uzbek mobile number: exactly 9 digits after +998, operator code 20-99. */
export function isValidUzPhone(digits: string): boolean {
  return /^[2-9]\d{8}$/.test(digits);
}

export function formatUzPhone(digits: string): string {
  const p = [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 7), digits.slice(7, 9)];
  return "+998 " + p.filter(Boolean).join(" ");
}

async function hashPassword(phone: string, password: string): Promise<string> {
  const data = new TextEncoder().encode(`tanzif:${phone}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

function loadUsers(): Record<string, StoredUser> {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function saveUsers(users: Record<string, StoredUser>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function loadSession(): User | null {
  const phone = localStorage.getItem(SESSION_KEY);
  if (!phone) return null;
  const stored = loadUsers()[phone];
  if (!stored) return null;
  return { name: stored.name, phone: stored.phone, createdAt: stored.createdAt };
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadSession);

  const register = useCallback(
    async (name: string, phone: string, password: string) => {
      const users = loadUsers();
      if (users[phone]) return { ok: false, error: "taken" as const };
      const hash = await hashPassword(phone, password);
      const record: StoredUser = {
        name,
        phone,
        createdAt: new Date().toISOString(),
        hash,
      };
      users[phone] = record;
      saveUsers(users);
      localStorage.setItem(SESSION_KEY, phone);
      setUser({ name, phone, createdAt: record.createdAt });
      return { ok: true };
    },
    [],
  );

  const login = useCallback(async (phone: string, password: string) => {
    const stored = loadUsers()[phone];
    if (!stored) return false;
    const hash = await hashPassword(phone, password);
    if (hash !== stored.hash) return false;
    localStorage.setItem(SESSION_KEY, phone);
    setUser({ name: stored.name, phone: stored.phone, createdAt: stored.createdAt });
    return true;
  }, []);

  /**
   * Rewrites the stored hash for an existing number. A real backend would gate
   * this behind an SMS code — that step slots in here without touching the UI.
   */
  const resetPassword = useCallback(async (phone: string, password: string) => {
    const users = loadUsers();
    const stored = users[phone];
    if (!stored) return false;
    users[phone] = { ...stored, hash: await hashPassword(phone, password) };
    saveUsers(users);
    return true;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, register, login, resetPassword, logout }),
    [user, register, login, resetPassword, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
