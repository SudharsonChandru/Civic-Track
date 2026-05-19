import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiGetIssue, apiUpdateStatus, apiUpvote, apiAddComment, apiDeleteIssue } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { StatusBadge, PriorityBadge, CategoryTag, Spinner } from "../components/UI";
import toast from "react-hot-toast";
import "./IssueDetail.css";

export default function IssueDetail() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { user }   = useAuth();
  const [issue,    setIssue]   = useState(null);
  const [loading,  setLoading] = useState(true);
  const [comment,  setComment] = useState("");
  const [upvoted,  setUpvoted] = useState(false);
  const [upvotes,  setUpvotes] = useState(0);
  const [posting,  setPosting] = useState(false);

  const load = async () => {
    try {
      const { data } = await apiGetIssue(id);
      setIssue(data);
      setUpvotes(data?.upvotes?.length || 0);
      setUpvoted(data?.upvotes?.includes(user?._id) || false);
    } catch {
      toast.error("Issue not found");
      navigate("/issues");
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  const handleUpvote = async () => {
    try {
      const { data } = await apiUpvote(id);
      setUpvotes(data.upvotes);
      setUpvoted(data.upvoted);
    } catch { toast.error("Failed to upvote"); }
  };

  const handleStatus = async (e) => {
    try {
      await apiUpdateStatus(id, { status: e.target.value });
      setIssue(prev => ({ ...prev, status: e.target.value }));
      toast.success("Status updated!");
    } catch { toast.error("Failed to update status"); }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    setPosting(true);
    try {
      const { data } = await apiAddComment(id, comment);
      setIssue(prev => ({ ...prev, comments: data }));
      setComment("");
      toast.success("Comment added!");
    } catch { toast.error("Failed to add comment"); }
    setPosting(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this issue?")) return;
    try {
      await apiDeleteIssue(id);
      toast.success("Issue deleted!");
      navigate("/my-issues");
    } catch { toast.error("Failed to delete issue"); }
  };

  // ── Loading state ──────────────────────────
  if (loading) return <Spinner />;

  // ── Issue not found ────────────────────────
  if (!issue) return (
    <div style={{ textAlign: "center", padding: 60, color: "var(--muted)" }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
      <p>Issue not found.</p>
      <button className="primary-btn" style={{ marginTop: 16 }}
        onClick={() => navigate("/issues")}>Back to Issues</button>
    </div>
  );

  // ── Safe owner check ───────────────────────
  const reportedById = issue.reportedBy?._id || issue.reportedBy;
  const isOwner = user && reportedById &&
    reportedById.toString() === user._id?.toString();

  const canEdit = isOwner && issue.status === "Pending";
  const canUpdateStatus = user?.role === "official" || user?.role === "admin";

  return (
    <div className="detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="detail-card">
        <div className="detail-top">
          <h1 className="detail-title">{issue.title}</h1>
          <div className="detail-badges">
            <StatusBadge   status={issue.status} />
            <PriorityBadge priority={issue.priority} />
            <CategoryTag   category={issue.category} />
          </div>
        </div>

        {issue.photo && issue.photo !== "" && (
          <img
            src={issue.photo}
            alt="Issue"
            className="detail-photo"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        )}

        <div className="detail-desc">{issue.description}</div>

        <div className="detail-meta">
          <div className="meta-box">
            <span className="meta-label">📍 Location</span>
            <span className="meta-val">{issue.location?.address || "N/A"}</span>
          </div>
          <div className="meta-box">
            <span className="meta-label">👤 Reported By</span>
            <span className="meta-val">{issue.reportedBy?.name || "Unknown"}</span>
          </div>
          <div className="meta-box">
            <span className="meta-label">📅 Date</span>
            <span className="meta-val">{new Date(issue.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="meta-box">
            <span className="meta-label">👍 Upvotes</span>
            <span className="meta-val">{upvotes}</span>
          </div>
        </div>

        {/* ── Action Buttons ───────────────── */}
        <div className="detail-actions">

          {/* Upvote */}
          <button
            className={`upvote-btn ${upvoted ? "voted" : ""}`}
            onClick={handleUpvote}>
            👍 {upvoted ? "Upvoted" : "Upvote"} ({upvotes})
          </button>

          {/* Status update — Officials & Admins */}
          {canUpdateStatus && (
            <select
              className="status-select"
              value={issue.status}
              onChange={handleStatus}>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Resolved</option>
            </select>
          )}

          {/* Edit — Owner of Pending issue */}
          {canEdit && (
            <button
              className="upvote-btn"
              style={{ borderColor: "var(--blue)", color: "var(--blue)" }}
              onClick={() => navigate(`/issues/${issue._id}/edit`)}>
              ✏️ Edit
            </button>
          )}

          {/* Delete — Owner or Admin */}
          {(isOwner || user?.role === "admin") && (
            <button
              className="upvote-btn"
              style={{ borderColor: "var(--red)", color: "var(--red)" }}
              onClick={handleDelete}>
              🗑️ Delete
            </button>
          )}
        </div>
      </div>

      {/* ── Comments ─────────────────────── */}
      <div className="comments-section">
        <h2 className="comments-title">
          Comments ({issue.comments?.length || 0})
        </h2>

        {(!issue.comments || issue.comments.length === 0) && (
          <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 16 }}>
            No comments yet. Be the first!
          </p>
        )}

        <div className="comment-list">
          {issue.comments?.map((c, i) => (
            <div key={i} className="comment-item">
              <div className="comment-author">{c.name || "Anonymous"}</div>
              <div className="comment-text">{c.text}</div>
              <div className="comment-date">
                {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ""}
              </div>
            </div>
          ))}
        </div>

        <div className="comment-form">
          <input
            className="comment-input"
            placeholder="Write a comment..."
            value={comment}
            onChange={e => setComment(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleComment()}
          />
          <button
            className="comment-submit"
            onClick={handleComment}
            disabled={posting}>
            {posting ? "..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}