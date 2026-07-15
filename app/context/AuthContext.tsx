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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const initializeAuth = async () => {
      const savedUser = localStorage.getItem("user");
      
      if (savedUser) {
        try {
            setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error("Failed to parse user", error);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (data: LoginCredentials) => {
    setIsLoading(true);
    try {
        const payload = {
            username: data.email,
            password: data.password
        };

      const response = await authService.login(payload);

      if (response.user) {
        const { user } = response;

        localStorage.setItem("user", JSON.stringify(user));

        setUser(user);

        const from = (location.state as any)?.from?.pathname || null;

        if (from) {
          navigate(from, { replace: true });
        } else {
            const role = user.role.toLowerCase();

            switch (role) {

                case 'customer':
                    navigate("/customer");
                    break;
                case 'desain':
                    navigate("/desain");
                    break;
                case 'gudang':
                    navigate("/gudang");
                    break;
                case 'admin':
                    navigate("/admin");
                    break;
                case 'manager':
                    navigate("/manager");
                    break;
                default:
                    console.warn("Unknown role, redirecting to home:", role);
                    navigate("/");
            }
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
    
    try {
      authService.logout().catch(e => console.error(e));
    } catch(e) { console.error(e) }

    window.location.href = "/login";
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
