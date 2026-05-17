import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiGetSummary, apiGetIssues } from "../services/api";
import { PageHeader, StatCard, Spinner } from "../components/UI";
import IssueCard from "../components/IssueCard";
import "./Dashboard.css";

export default function Dashboard() {
  const { user }  = useAuth();
  const navigate  = useNavigate();
  const [summary, setSummary] = useState(null);
  const [recent,  setRecent]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, i] = await Promise.all([apiGetSummary(), apiGetIssues({ limit: 4 })]);
        setSummary(s.data);
        setRecent(i.data.slice(0, 4));
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader
        title={`Welcome, ${user?.name?.split(" ")[0]} 👋`}
        subtitle="Here's your community overview"
        action={
          user?.role === "citizen" &&
          <button className="primary-btn" onClick={() => navigate("/report")}>+ Report Issue</button>
        }
      />

      <div className="stats-grid">
        <StatCard icon="📋" label="Total Issues"  value={summary?.total      || 0} color="orange" />
        <StatCard icon="⏳" label="Pending"        value={summary?.pending    || 0} color="yellow" />
        <StatCard icon="🔄" label="In Progress"    value={summary?.inProgress || 0} color="blue"   />
        <StatCard icon="✅" label="Resolved"        value={summary?.resolved   || 0} color="green"  />
      </div>

      <div className="section-header">
        <h2 className="section-title">Recent Issues</h2>
        <button className="link-btn" onClick={() => navigate("/issues")}>View all →</button>
      </div>

      <div className="issues-grid">
        {recent.map(issue => <IssueCard key={issue._id} issue={issue} />)}
      </div>
    </div>
  );
}
