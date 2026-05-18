import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Layout.css";

const NAV = {
  citizen:  [
    { to: "/dashboard", icon: "🏠", label: "Dashboard" },
    { to: "/issues",    icon: "📋", label: "All Issues" },
    { to: "/report",    icon: "➕", label: "Report Issue" },
    { to: "/my-issues", icon: "👤", label: "My Issues" },
    { to: "/analytics", icon: "📊", label: "Analytics" },
    { to: "/edit-profile", icon: "✏️", label: "Edit Profile" },
  ],
  official: [
    { to: "/dashboard", icon: "🏠", label: "Dashboard" },
    { to: "/issues",    icon: "📋", label: "All Issues" },
    { to: "/analytics", icon: "📊", label: "Analytics" },
    { to: "/edit-profile", icon: "✏️", label: "Edit Profile" },
  ],
  admin: [
    { to: "/dashboard", icon: "🏠", label: "Dashboard" },
    { to: "/issues",    icon: "📋", label: "All Issues" },
    { to: "/analytics", icon: "📊", label: "Analytics" },
    { to: "/users",     icon: "👥", label: "Manage Users" },
    { to: "/edit-profile", icon: "✏️", label: "Edit Profile" },
  ],
};

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = NAV[user?.role] || NAV.citizen;

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div className="layout">
      {/* Mobile toggle */}
      <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>☰</button>

      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🏘️</div>
          <div className="sidebar-logo-text">Civic<span>Track</span></div>
        </div>

        <nav className="sidebar-nav">
          {nav.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
              onClick={() => setMobileOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="user-badge">
            <div className="user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
            <div>
              <div className="user-name">{user?.name}</div>
              <div className="user-role">{user?.role}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>← Logout</button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
