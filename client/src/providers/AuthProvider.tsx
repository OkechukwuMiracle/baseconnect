import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Role = "creator" | "contributor";

export type User = {
  id: string;
  email?: string;
  role: Role | null;
  profileCompleted: boolean;
  token?: string;
  firstName?: string;
  lastName?: string;
  walletAddress?: string;
  emailVerified?: boolean;
  address?: string;
  bio?: string;
  // Creator profile fields
  profileSlug?: string;
  professionalTitle?: string;
  profilePicture?: string;
  skills?: string[];
  linkedin?: string;
  github?: string;
  website?: string;
  // Gamification fields
  points?: number;
  activityLevel?: number;
  referralCount?: number;
  // Rating
  rating?: number;
  // Timestamps
  createdAt?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<User | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async (token?: string): Promise<User | null> => {
    const t = token || localStorage.getItem("token");
    if (!t) {
      setUser(null);
      setLoading(false);
      return null;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      const nextUser = { ...data, token: t };
      setUser(nextUser);
      return nextUser;
    } catch {
      setUser(null);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
    return null;
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const value = useMemo<AuthContextType>(() => ({
    user,
    loading,
    login: async (token: string) => {
      localStorage.setItem("token", token);
      setLoading(true);
      await fetchMe(token);
    },
    logout: () => {
      localStorage.removeItem("token");
      setUser(null);
    },
    refresh: async () => fetchMe(),
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
