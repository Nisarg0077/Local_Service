import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AuthContext = createContext(null);

// Helper to read browser cookie
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return JSON.parse(parts.pop().split(";")[0]);
  return null;
}

// Helper to clear browser cookie
function clearCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Validate session on mount - check browser cookie and validate with database
  useEffect(() => {
    const validateSession = async () => {
      // 1. Check browser cookie first
      const browserCookie = getCookie("slms_session");

      if (!browserCookie || !browserCookie.uid) {
        // No browser cookie - clear any stale localStorage
        localStorage.removeItem("slms_token");
        localStorage.removeItem("slms_user");
        setLoading(false);
        return;
      }

      // 2. Get stored token from localStorage
      const storedToken = localStorage.getItem("slms_token");
      const storedUser = localStorage.getItem("slms_user");

      if (!storedToken) {
        // Have cookie but no token - clear cookie and redirect
        clearCookie("slms_session");
        try {
          await api.post("/userroutes/logout", { uid: browserCookie.uid });
        } catch (e) {}
        setLoading(false);
        return;
      }

      try {
        // 3. Validate with backend (checks database for valid cookie < 7 days)
        const res = await api.post("/userroutes/validate-cookie", {
          token: storedToken,
          uid: browserCookie.uid,
        });

        if (res.data.valid) {
          // Valid session - restore user
          const userData = storedUser ? JSON.parse(storedUser) : res.data.user;
          const currentToken = res.data.newToken || storedToken;
          if (res.data.newToken) {
            localStorage.setItem("slms_token", res.data.newToken);
          }
          setToken(currentToken);
          setUser(userData);
        } else {
          // Cookie invalid or expired - clean up both browser and database
          clearCookie("slms_session");
          localStorage.removeItem("slms_token");
          localStorage.removeItem("slms_user");
          // Notify backend to clear expired cookies
          await api.post("/userroutes/logout", { uid: browserCookie.uid });
        }
      } catch (error) {
        console.error("Session validation failed:", error);
        clearCookie("slms_session");
        localStorage.removeItem("slms_token");
        localStorage.removeItem("slms_user");
      } finally {
        setLoading(false);
      }
    };

    validateSession();
  }, []);

  const logout = useCallback(async () => {
    const userData = JSON.parse(localStorage.getItem("slms_user") || "{}");
    const uid = userData?.uid;

    if (uid) {
      try {
        await api.post("/userroutes/logout", { uid });
      } catch (error) {
        console.error("Logout error:", error);
      }
    }

    clearCookie("slms_session");
    localStorage.removeItem("slms_token");
    localStorage.removeItem("slms_user");
    setToken(null);
    setUser(null);
    navigate("/login");
    toast.success("Logged out successfully");
  }, [navigate]);

  // Auto logout on token expiry
  useEffect(() => {
    if (!token) return;
    try {
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
    } catch (error) {
      logout();
    }
  }, [token, logout]);

  const login = useCallback(async (email, password) => {
    setLoading(true);

    try {
      const res = await api.post("/userroutes/login", { email, password });

      if (!res.data.log) {
        throw new Error(res.data.message || "Login failed");
      }

      const user = res.data.user;
      const token = res.data.token;

      localStorage.setItem("slms_token", token);
      localStorage.setItem("slms_user", JSON.stringify(user));
      document.cookie = `slms_session=${JSON.stringify({
        uid: user.uid,
        token: token,
        createdAt: new Date().toISOString(),
      })}; max-age=${7 * 24 * 60 * 60}; path=/`;

      setToken(token);
      setUser(user);

      return user;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(
    async (formData) => {
      setLoading(true);

      try {
        const res = await api.post("/userroutes/register", formData);

        if (!res.data.reg) {
          throw new Error(res.data.message || "Registration failed");
        }

        toast.success("Registration successful! Please login.");
        navigate("/login");
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [navigate],
  );

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
