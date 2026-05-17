import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

// ── Axios instance base URL ───────────────────
axios.defaults.baseURL = process.env.REACT_APP_API_URL
  || "http://localhost:5000";

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("citUser");
    if (stored) {
      try {
        const u = JSON.parse(stored);
        if (u?.token) {
          setUser(u);
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
    axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    setUser(data);
    return data;
  };

  const register = async (name, email, password, role, phone) => {
    const { data } = await axios.post("/api/auth/register", {
      name, email, password, role, phone,
    });
    localStorage.setItem("citUser", JSON.stringify(data));
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