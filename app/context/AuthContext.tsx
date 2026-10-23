import React, { createContext, useState, useEffect, type ReactNode } from "react";
import { authService } from "~/services/authService";
import type { User, LoginCredentials } from "~/types/auth";
import { useNavigate, useLocation } from "react-router";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginCredentials) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          return JSON.parse(savedUser);
        } catch (error) {
          console.error("Failed to parse user from localStorage", error);
        }
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Keep user state in sync with localStorage on mount
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
      } catch (error) {
        console.error("Failed to parse user", error);
        setUser(null);
      }
    }
  }, []);

  const login = async (data: LoginCredentials) => {
    setIsLoading(true);
    try {
      const payload = {
        username: data.email || data.username,
        password: data.password
      };

      const response = await authService.login(payload);

      if (response?.user) {
        const token = response.token;
        const userObj: User = {
          ...response.user,
          token: token || response.user.token
        };

        if (token) {
          localStorage.setItem("jwt", token);
        }
        localStorage.setItem("user", JSON.stringify(userObj));
        setUser(userObj);

        const role = (userObj.role || "").toLowerCase();

        const getDashboardForRole = (r: string) => {
          switch (r) {
            case "customer":
              return "/customer";
            case "desain":
              return "/desain";
            case "gudang":
              return "/gudang";
            case "admin":
              return "/admin";
            case "manager":
              return "/manager";
            default:
              console.warn("Unknown role, redirecting to home:", r);
              return "/";
          }
        };

        const defaultDashboard = getDashboardForRole(role);
        const from = (location.state as any)?.from?.pathname || null;

        // Verify if `from` is a safe and role-authorized destination to prevent bouncing
        const isFromAuthorized = () => {
          if (!from || typeof from !== "string") return false;
          if (from === "/login" || from === "/register" || from === "/") return false;
          if (from.startsWith("/admin") && role !== "admin") return false;
          if (from.startsWith("/customer") && role !== "customer") return false;
          if (from.startsWith("/manager") && role !== "manager") return false;
          if (from.startsWith("/desain") && role !== "desain") return false;
          if (from.startsWith("/gudang") && role !== "gudang") return false;
          return true;
        };

        if (isFromAuthorized()) {
          navigate(from, { replace: true });
        } else {
          navigate(defaultDashboard, { replace: true });
        }
      }
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    localStorage.removeItem("user");
    localStorage.removeItem("jwt");
    setUser(null);

    try {
      await authService.logout();
    } catch (e) {
      console.error("Logout error:", e);
    }

    navigate("/login", { replace: true });
  };

  const value = React.useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout
  }), [user, isLoading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
