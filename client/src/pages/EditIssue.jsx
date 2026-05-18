import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiGetIssue, apiEditIssue } from "../services/api";
import { PageHeader, Spinner } from "../components/UI";
import toast from "react-hot-toast";
import "./ReportIssue.css";

export default function EditIssue() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", description: "", category: "Road",
    priority: "Normal", address: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    apiGetIssue(id).then(({ data }) => {
      setForm({
        title:       data.title,
        description: data.description,
        category:    data.category,
        priority:    data.priority,
        address:     data.location?.address || "",
      });
      setLoading(false);
    }).catch(() => { toast.error("Issue not found"); navigate("/my-issues"); });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.address)
      return toast.error("Please fill all required fields");

    setSaving(true);
    try {
      await apiEditIssue(id, {
        title:       form.title,
        description: form.description,
        category:    form.category,
        priority:    form.priority,
        location:    { address: form.address },
      });
      toast.success("Issue updated successfully!");
      navigate(`/issues/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update issue");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader title="Edit Issue" subtitle="Update your reported issue details" />
      <div className="report-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Issue Title *</label>
            <input className="form-input" placeholder="Issue title"
              value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea className="form-textarea" placeholder="Describe the issue..."
              value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
          </div>
          <div className="form-row-3">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}>
                {["Road","Water","Electricity","Sanitation","Public Property","Other"].map(c =>
                  <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="form-select" value={form.priority}
                onChange={e => setForm({ ...form, priority: e.target.value })}>
                {["Low","Normal","High","Urgent"].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Location *</label>
            <input className="form-input" placeholder="Location address"
              value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button className="submit-btn" type="submit" disabled={saving}>
              {saving ? "Saving..." : "💾 Update Issue"}
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