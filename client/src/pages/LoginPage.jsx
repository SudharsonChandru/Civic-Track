import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import "./AuthPages.css";

export default function LoginPage() {
  const { login }   = useAuth();
  const navigate    = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    await login(form.email, form.password);
    toast.success("Welcome back!");
    navigate("/dashboard");
  } catch (err) {
    // ✅ Shows the exact error message from server
    toast.error(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

  // Quick demo login
  const demoLogin = async (email) => {
    setLoading(true);
    try {
      await login(email, "demo1234");
      navigate("/dashboard");
    } catch {
      toast.error("Demo accounts not seeded yet. Register first.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">🏘️</div>
          <div>
            <h1>CivicTrack</h1>
            <span>Community Issue Tracker</span>
          </div>
        </div>

        <h2 className="auth-title">Sign In</h2>
        <p className="auth-sub">Report & track community issues</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <div className="demo-section">
          <p className="demo-title">Quick Demo Login</p>
          <div className="demo-grid">
            <button className="demo-btn" onClick={() => demoLogin("citizen@demo.com")}>👤 Citizen</button>
            <button className="demo-btn" onClick={() => demoLogin("official@demo.com")}>🏛️ Official</button>
            <button className="demo-btn" onClick={() => demoLogin("admin@demo.com")}>⚙️ Admin</button>
          </div>
        </div>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}
