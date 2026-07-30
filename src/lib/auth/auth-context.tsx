"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getMe, getProfile, login as apiLogin, register as apiRegister } from "@/lib/api/auth";
import { setToken } from "@/lib/api/client";
import type { AuthUser, UserProfile } from "@/lib/api/types";

interface AuthContextValue {
  user: AuthUser | null;
  profile: UserProfile | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [ready, setReady] = useState(false);

  const bootstrap = useCallback(async () => {
    try {
      const me = await getMe();
      setUser(me);
      try {
        const p = await getProfile();
        setProfile(p);
      } catch {
        setProfile(null);
      }
    } catch {
      setToken(null);
      setUser(null);
      setProfile(null);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  const login = useCallback(async (email: string, password: string) => {
    const { accessToken } = await apiLogin({ email, password });
    setToken(accessToken);
    const me = await getMe();
    setUser(me);
    const p = await getProfile();
    setProfile(p);
  }, []);

  const register = useCallback(
    async (input: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    }) => {
      const { accessToken } = await apiRegister(input);
      setToken(accessToken);
      const me = await getMe();
      setUser(me);
      const p = await getProfile();
      setProfile(p);
    },
    [],
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const p = await getProfile();
    setProfile(p);
  }, []);

  const value = useMemo(
    () => ({
      user,
      profile,
      ready,
      login,
      register,
      logout,
      refreshProfile,
    }),
    [user, profile, ready, login, register, logout, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
