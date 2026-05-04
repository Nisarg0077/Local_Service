import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { mockUsers, mockProviders } from "../data/mockData";
import { generateMockToken, isTokenExpired } from "../utils";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
// import { CookiesProvider } from "react-cookie";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Restore session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("slms_token");
    const storedUser = localStorage.getItem("slms_user");
    if (storedToken && storedUser && !isTokenExpired(storedToken)) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    } else {
      localStorage.removeItem("slms_token");
      localStorage.removeItem("slms_user");
    }
    setLoading(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("slms_token");
    localStorage.removeItem("slms_user");
    setToken(null);
    setUser(null);
  }, []);

  // Auto logout on token expiry
  useEffect(() => {
    if (!token) return;
    const payload = JSON.parse(atob(token.split(".")[1]));
    const msUntilExpiry = payload.exp * 1000 - Date.now();
    if (msUntilExpiry <= 0) {
      logout();
      return;
    }
    const timer = setTimeout(
      () => {
        logout();
        toast.error("Session expired. Please log in again.");
      },
      Math.min(msUntilExpiry, 2147483647),
    );
    return () => clearTimeout(timer);
  }, [token, logout]);

  // const login = useCallback(async (email, password, role) => {
  //   setLoading(true);
  //   await new Promise(r => setTimeout(r, 1200)); // simulate API

  //   // Check all user pools
  //   const allUsers = [
  //     ...mockUsers,
  //     ...mockProviders.map(p => ({ ...p, role: 'provider' })),
  //   ];
  //   const found = allUsers.find(
  //     u => u.email === email && u.password === password
  //   );

  //   if (!found) {
  //     setLoading(false);
  //     throw new Error('Invalid email or password.');
  //   }

  //   const { password: _pw, ...safeUser } = found;
  //   const mockToken = generateMockToken(safeUser);

  //   localStorage.setItem('slms_token', mockToken);
  //   localStorage.setItem('slms_user', JSON.stringify(safeUser));
  //   setToken(mockToken);
  //   setUser(safeUser);
  //   setLoading(false);
  //   return safeUser;
  // }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/userroutes/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.log) {
        throw new Error(data.message || "Login failed");
      }

      const user = data.user;
      const token = data.token;

      // cookies.set("slms_token", token, { path: "/" });
      // cookies.set("slms_user", JSON.stringify(user), { path: "/" });

      localStorage.setItem("slms_token", token);
      localStorage.setItem("slms_user", JSON.stringify(user));

      setToken(token);
      setUser(user);

      return user;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (formData) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));

    const existsInUsers = mockUsers.find((u) => u.email === formData.email);
    const existsInProviders = mockProviders.find(
      (p) => p.email === formData.email,
    );
    if (existsInUsers || existsInProviders) {
      setLoading(false);
      throw new Error("Email already registered. Please login.");
    }

    const newUser = {
      uid: formData.uid,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone || "",
      role: formData.role || "customer",
      avatar: `https://i.pravatar.cc/150?u=${formData.email}`,
      address: "",
      joinedAt: new Date().toISOString(),
      favorites: [],
    };

    const mockToken = generateMockToken(newUser);
    localStorage.setItem("slms_token", mockToken);
    localStorage.setItem("slms_user", JSON.stringify(newUser));
    setToken(mockToken);
    setUser(newUser);
    setLoading(false);
    return newUser;
  }, []);

  const updateUser = useCallback(
    (updates) => {
      const updated = { ...user, ...updates };
      localStorage.setItem("slms_user", JSON.stringify(updated));
      setUser(updated);
    },
    [user],
  );

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === "admin";
  const isProvider = user?.role === "provider";
  const isCustomer = user?.role === "customer";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        isProvider,
        isCustomer,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
