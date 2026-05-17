import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("citUser");
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setUser(u);
        // ── Set token on every page load ──
        if (u?.token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${u.token}`;
        }
      } catch {
        localStorage.removeItem("citUser");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post("/api/auth/login", { email, password });
    localStorage.setItem("citUser", JSON.stringify(data));
    // ── Set token immediately after login ──
    axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    setUser(data);
    return data;
  };

  const register = async (name, email, password, role, phone) => {
    const { data } = await axios.post("/api/auth/register", {
      name, email, password, role, phone
    });
    localStorage.setItem("citUser", JSON.stringify(data));
    // ── Set token immediately after register ──
    axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("citUser");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);