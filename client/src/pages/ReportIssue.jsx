import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiCreateIssue } from "../services/api";
import { PageHeader } from "../components/UI";
import toast from "react-hot-toast";
import "./ReportIssue.css";

export default function ReportIssue() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", description: "", category: "Road",
    priority: "Normal", address: "", lat: "", lng: "",
  });
  const [photo,   setPhoto]   = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.address)
      return toast.error("Please fill all required fields");

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title",       form.title);
      fd.append("description", form.description);
      fd.append("category",    form.category);
      fd.append("priority",    form.priority);
      fd.append("location",    JSON.stringify({ address: form.address, lat: parseFloat(form.lat) || 0, lng: parseFloat(form.lng) || 0 }));
      if (photo) fd.append("photo", photo);

      await apiCreateIssue(fd);
      toast.success("Issue reported successfully!");
      navigate("/my-issues");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit issue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Report an Issue" subtitle="Submit a new community issue for resolution" />

      <div className="report-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Issue Title *</label>
            <input className="form-input" placeholder="e.g. Broken street light on MG Road"
              value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea className="form-textarea" placeholder="Describe the issue in detail..."
              value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
          </div>

          <div className="form-row-3">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {["Road","Water","Electricity","Sanitation","Public Property","Other"].map(c =>
                  <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="form-select" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                {["Low","Normal","High","Urgent"].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Location / Address *</label>
            <input className="form-input" placeholder="e.g. MG Road, Block 4, Near Post Office"
              value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required />
          </div>

          <div className="form-row-3">
            <div className="form-group">
              <label className="form-label">Latitude (optional)</label>
              <input className="form-input" placeholder="e.g. 11.0168" type="number" step="any"
                value={form.lat} onChange={e => setForm({ ...form, lat: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Longitude (optional)</label>
              <input className="form-input" placeholder="e.g. 76.9558" type="number" step="any"
                value={form.lng} onChange={e => setForm({ ...form, lng: e.target.value })} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Upload Photo (optional)</label>
            <label className="photo-upload">
              {preview
                ? <img src={preview} alt="preview" className="photo-preview" />
                : <>
                    <div className="photo-icon">📷</div>
                    <p className="photo-text">Click to upload or drag & drop</p>
                    <p className="photo-sub">PNG, JPG up to 5MB</p>
                  </>
              }
              <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} />
            </label>
          </div>

          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? "Submitting..." : "🚀 Submit Issue"}
          </button>
        </form>
      </div>
    </div>
  );
}
