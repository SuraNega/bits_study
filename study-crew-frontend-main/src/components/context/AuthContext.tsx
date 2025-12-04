import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "assistant" | "user" | null;

interface AuthContextType {
  user: any | null;
  roles: string[];
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => Promise<void>;
  hasRole: (role: string) => boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updatedUser: any) => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [activeRole, setActiveRoleState] = useState<UserRole>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Optionally restore session from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedRoles = localStorage.getItem("roles");
    const storedActiveRole = localStorage.getItem("activeRole");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setRoles(storedRoles ? JSON.parse(storedRoles) : []);
      setActiveRoleState(storedActiveRole as UserRole);
    }
  }, []);

  const hasRole = (role: string): boolean => {
    return roles.includes(role);
  };

  const setActiveRole = async (role: UserRole) => {
    if (!user || !role || !hasRole(role)) return;
    
    try {
      // Update on backend
      const res = await fetch(`http://localhost:3000/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ user: { active_role: role } }),
      });
      
      if (res.ok) {
        const updatedUser = await res.json();
        setActiveRoleState(role);
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        localStorage.setItem("activeRole", role);
      }
    } catch (err) {
      console.error("Failed to switch role:", err);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      let data = null;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }
      if (!res.ok) {
        throw new Error(data?.error || "Login failed");
      }
      const userRoles = data.user.roles || ["user"];
      const userActiveRole = data.user.active_role || "user";
      
      setUser(data.user);
      setRoles(userRoles);
      setActiveRoleState(userActiveRole);
      
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("roles", JSON.stringify(userRoles));
      localStorage.setItem("activeRole", userActiveRole);
      
      setLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message || "Login failed");
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setRoles([]);
    setActiveRoleState(null);
    localStorage.removeItem("user");
    localStorage.removeItem("roles");
    localStorage.removeItem("activeRole");
    // Optionally: call /logout endpoint
  };

  const updateUser = (updatedUser: any) => {
    const newUser = JSON.parse(JSON.stringify(updatedUser));
    setUser(newUser);
    if (newUser.roles) {
      setRoles(newUser.roles);
      localStorage.setItem("roles", JSON.stringify(newUser.roles));
    }
    if (newUser.active_role) {
      setActiveRoleState(newUser.active_role);
      localStorage.setItem("activeRole", newUser.active_role);
    }
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      roles, 
      activeRole, 
      setActiveRole, 
      hasRole, 
      login, 
      logout, 
      updateUser, 
      loading, 
      error 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

