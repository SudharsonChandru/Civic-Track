import axios from "axios";

// ── Base URL ─────────────────────────────────
axios.defaults.baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// ── Auth ────────────────────────────────────
export const apiLogin    = (data)  => axios.post("/api/auth/login",    data);
export const apiRegister = (data)  => axios.post("/api/auth/register", data);
export const apiGetMe    = ()      => axios.get("/api/auth/me");

// ── Issues ──────────────────────────────────
export const apiGetIssues  = (params) => axios.get("/api/issues", { params });
export const apiGetIssue   = (id)     => axios.get(`/api/issues/${id}`);
export const apiCreateIssue = (data)  => axios.post("/api/issues", data, {
  headers: { "Content-Type": "multipart/form-data" },
});
export const apiUpdateStatus = (id, data)  => axios.put(`/api/issues/${id}/status`,  data);
export const apiUpvote        = (id)        => axios.post(`/api/issues/${id}/upvote`);
export const apiAddComment    = (id, text)  => axios.post(`/api/issues/${id}/comment`, { text });
export const apiDeleteIssue   = (id)        => axios.delete(`/api/issues/${id}`);

// ── Analytics ───────────────────────────────
export const apiGetSummary    = () => axios.get("/api/analytics/summary");
export const apiGetByCategory = () => axios.get("/api/analytics/category");
export const apiGetMonthly    = () => axios.get("/api/analytics/monthly");
export const apiGetTopUpvoted = () => axios.get("/api/analytics/top-upvoted");

// ── Users (admin) ───────────────────────────
export const apiGetUsers  = ()        => axios.get("/api/users");
export const apiUpdateUser = (id, d)  => axios.put(`/api/users/${id}`, d);
