import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authApi, tokenStore, type CurrentUser } from "./api";

interface AuthState {
  user: CurrentUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // On mount: try to rehydrate user from stored token
  useEffect(() => {
    const rehydrate = async () => {
      const access = tokenStore.getAccess();
      if (!access) {
        setState({ user: null, isLoading: false, isAuthenticated: false });
        return;
      }
      try {
        const res = await authApi.me();
        setState({ user: res.data.user, isLoading: false, isAuthenticated: true });
      } catch {
        tokenStore.clear();
        setState({ user: null, isLoading: false, isAuthenticated: false });
      }
    };
    rehydrate();
  }, []);

  // Listen for forced logout (e.g., refresh token expired)
  useEffect(() => {
    const handler = () => {
      setState({ user: null, isLoading: false, isAuthenticated: false });
    };
    window.addEventListener("auth:logout", handler);
    return () => window.removeEventListener("auth:logout", handler);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    tokenStore.set(res.data.accessToken, res.data.refreshToken);
    const me = await authApi.me();
    setState({ user: me.data.user, isLoading: false, isAuthenticated: true });
  }, []);

  const logout = useCallback(async () => {
    const refresh = tokenStore.getRefresh();
    if (refresh) {
      try { await authApi.logout(refresh); } catch { /* ignore */ }
    }
    tokenStore.clear();
    setState({ user: null, isLoading: false, isAuthenticated: false });
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    await authApi.register(email, password, name);
    // Auto-login after registration
    await login(email, password);
  }, [login]);

  const value = useMemo<AuthContextValue>(
    () => ({ ...state, login, logout, register }),
    [state, login, logout, register]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Hook to access the auth context — must be inside <AuthProvider /> */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider />");
  return ctx;
}
