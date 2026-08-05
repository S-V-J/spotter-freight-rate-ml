"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api";

interface AuthContextType {
  isAuthenticated: boolean;
  isSuperuser: boolean;
  isLoading: boolean;
  login: (token: string, isSuperuser: boolean) => void;
  handleLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check localStorage immediately on mount
    const token = localStorage.getItem("token");
    const superuser = localStorage.getItem("is_superuser") === "true";
    if (token) {
      setIsAuthenticated(true);
      setIsSuperuser(superuser);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (token: string, superuser: boolean) => {
    localStorage.setItem("token", token);
    localStorage.setItem("is_superuser", superuser.toString());
    setIsAuthenticated(true);
    setIsSuperuser(superuser);
    router.push("/dashboard");
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setIsSuperuser(false);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isSuperuser, isLoading, login: handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
