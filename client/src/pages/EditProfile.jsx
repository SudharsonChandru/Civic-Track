import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiUpdateProfile } from "../services/api";
import { PageHeader } from "../components/UI";
import toast from "react-hot-toast";
import "./ReportIssue.css";

export default function EditProfile() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name:  user?.name  || "",
    phone: user?.phone || "",
    password:        "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name)
      return toast.error("Name is required");

    if (form.password && form.password !== form.confirmPassword)
      return toast.error("Passwords do not match");

    if (form.password && form.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    setLoading(true);
    try {
      const updateData = { name: form.name, phone: form.phone };
      if (form.password) updateData.password = form.password;

      await apiUpdateProfile(updateData);
      toast.success("Profile updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Edit Profile" subtitle="Update your account details" />
      <div className="report-card">
        <form onSubmit={handleSubmit}>

          {/* Read-only info */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" value={user?.email} disabled
              style={{ opacity: 0.6, cursor: "not-allowed" }} />
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <input className="form-input" value={user?.role} disabled
              style={{ opacity: 0.6, cursor: "not-allowed", textTransform: "capitalize" }} />
          </div>

          {/* Editable fields */}
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input className="form-input" placeholder="Your full name"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input className="form-input" placeholder="Your phone number"
              value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>

          {/* Change password */}
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 18, marginTop: 8 }}>
            <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 14, fontWeight: 600 }}>
              Change Password (leave blank to keep current)
            </p>
            <div className="form-row-3">
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input className="form-input" type="password" placeholder="Min 6 characters"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input className="form-input" type="password" placeholder="Repeat new password"
                  value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? "Saving..." : "💾 Save Changes"}
            </button>
            <button type="button" className="submit-btn"
              style={{ background: "var(--surface2)", color: "var(--text)", border: "1px solid var(--border)", boxShadow: "none" }}
              onClick={() => navigate(-1)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}