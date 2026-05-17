import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiGetIssues } from "../services/api";
import { PageHeader, Spinner, EmptyState } from "../components/UI";
import IssueCard from "../components/IssueCard";
import "./Dashboard.css";

export default function MyIssues() {
  const { user }  = useAuth();
  const [issues,  setIssues]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await apiGetIssues();
        // Filter client-side by current user
        setIssues(data.filter(i => i.reportedBy?._id === user?._id));
      } catch {}
      setLoading(false);
    };
    load();
  }, [user]);

  return (
    <div>
      <PageHeader title="My Issues" subtitle={`${issues.length} issues reported by you`} />
      {loading ? <Spinner /> : issues.length === 0
        ? <EmptyState icon="📋" text="You haven't reported any issues yet." />
        : <div className="issues-grid">
            {issues.map(issue => <IssueCard key={issue._id} issue={issue} />)}
          </div>
      }
    </div>
  );
}
