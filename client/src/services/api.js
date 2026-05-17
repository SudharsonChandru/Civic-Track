import axios from "axios";

// ── Base URL ──────────────────────────────────
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
});

// ── Auto attach token on every request ────────
instance.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem("citUser");
    if (stored) {
      try {
        const u = JSON.parse(stored);
        if (u?.token) {
          config.headers["Authorization"] = `Bearer ${u.token}`;
        }
      } catch {}
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Auth ──────────────────────────────────────
export const apiLogin    = (data) => instance.post("/api/auth/login",    data);
export const apiRegister = (data) => instance.post("/api/auth/register", data);
export const apiGetMe    = ()     => instance.get("/api/auth/me");

// ── Issues ────────────────────────────────────
export const apiGetIssues   = (params) => instance.get("/api/issues", { params });
export const apiGetIssue    = (id)     => instance.get(`/api/issues/${id}`);
export const apiCreateIssue = (data)   => instance.post("/api/issues", data, {
  headers: { "Content-Type": "multipart/form-data" },
});
export const apiUpdateStatus = (id, data) => instance.put(`/api/issues/${id}/status`, data);
export const apiUpvote       = (id)       => instance.post(`/api/issues/${id}/upvote`);
export const apiAddComment   = (id, text) => instance.post(`/api/issues/${id}/comment`, { text });
export const apiDeleteIssue  = (id)       => instance.delete(`/api/issues/${id}`);

// ── Analytics ─────────────────────────────────
export const apiGetSummary    = () => instance.get("/api/analytics/summary");
export const apiGetByCategory = () => instance.get("/api/analytics/category");
export const apiGetMonthly    = () => instance.get("/api/analytics/monthly");
export const apiGetTopUpvoted = () => instance.get("/api/analytics/top-upvoted");

// ── Users (admin) ─────────────────────────────
export const apiGetUsers   = ()      => instance.get("/api/users");
export const apiUpdateUser = (id, d) => instance.put(`/api/users/${id}`, d);

export default instance;