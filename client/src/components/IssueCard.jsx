import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiUpvote } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { StatusBadge, PriorityBadge, CategoryTag } from "./UI";
import toast from "react-hot-toast";
import "./IssueCard.css";

export default function IssueCard({ issue, onUpvote }) {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [upvotes,  setUpvotes]  = useState(issue.upvotes?.length || 0);
  const [upvoted,  setUpvoted]  = useState(issue.upvotes?.includes(user?._id));

  const handleUpvote = async (e) => {
    e.stopPropagation();
    try {
      const { data } = await apiUpvote(issue._id);
      setUpvotes(data.upvotes);
      setUpvoted(data.upvoted);
    } catch {
      toast.error("Login required to upvote");
    }
  };

  return (
    <div className="issue-card" onClick={() => navigate(`/issues/${issue._id}`)}>
      <div className="ic-header">
        <h3 className="ic-title">{issue.title}</h3>
        <StatusBadge status={issue.status} />
      </div>

      <p className="ic-desc">{issue.description}</p>

      <div className="ic-meta">
        <span>📍 {issue.location?.address}</span>
        <span>📅 {new Date(issue.createdAt).toLocaleDateString()}</span>
        <span>💬 {issue.comments?.length || 0}</span>
      </div>

      <div className="ic-footer">
        <button className={`upvote-btn ${upvoted ? "voted" : ""}`} onClick={handleUpvote}>
          👍 {upvotes}
        </button>
        <div style={{ display: "flex", gap: 6 }}>
          <PriorityBadge priority={issue.priority} />
          <CategoryTag category={issue.category} />
        </div>
      </div>
    </div>
  );
}
