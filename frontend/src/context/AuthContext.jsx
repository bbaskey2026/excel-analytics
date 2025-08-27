import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user info from backend
  const fetchAuthStatus = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuth(false);
      setRole(null);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${apiUrl}/api/auth/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.isLoggedIn) {
        setAuth(true);
        setRole(res.data.user.role);
        localStorage.setItem("role", res.data.user.role);
      } else {
        setAuth(false);
        setRole(null);
        localStorage.removeItem("token");
        localStorage.removeItem("role");
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setAuth(false);
      setRole(null);
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthStatus();
    const handleStorageChange = () => fetchAuthStatus();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Login function
  const login = async (email, password) => {
    const res = await axios.post("/api/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.user.role);
    setAuth(true);
    setRole(res.data.user.role);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setAuth(false);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{ auth, role, loading, login, logout, fetchAuthStatus }}
    >
      {children}
    </AuthContext.Provider>
  );
};
