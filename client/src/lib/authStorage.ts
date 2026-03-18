const TOKEN_KEY = "petadopt_token";
const USER_KEY = "petadopt_user";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

export function setAuth(token: string, user: AuthUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

