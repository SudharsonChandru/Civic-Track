import "./UI.css";

export function StatusBadge({ status }) {
  const cls = status === "Pending" ? "badge-pending"
            : status === "In Progress" ? "badge-progress"
            : "badge-resolved";
  return <span className={`badge ${cls}`}>{status}</span>;
}

export function PriorityBadge({ priority }) {
  const cls = priority === "Urgent" ? "pri-urgent"
            : priority === "High"   ? "pri-high"
            : priority === "Normal" ? "pri-normal"
            : "pri-low";
  return <span className={`badge ${cls}`}>{priority}</span>;
}

export function CategoryTag({ category }) {
  return <span className="category-tag">{category}</span>;
}

export function Spinner() {
  return <div className="spinner" />;
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="page-header">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-sub">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function StatCard({ icon, label, value, color }) {
  return (
    <div className={`stat-card stat-${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}

export function EmptyState({ icon = "📋", text = "Nothing here yet." }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <p className="empty-text">{text}</p>
    </div>
  );
}
