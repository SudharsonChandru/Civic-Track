import { useEffect, useState } from "react";
import { apiGetIssues } from "../services/api";
import { PageHeader, Spinner, EmptyState } from "../components/UI";
import IssueCard from "../components/IssueCard";
import "./Dashboard.css";

const CATEGORIES = ["All", "Road", "Water", "Electricity", "Sanitation", "Public Property", "Other"];
const STATUSES   = ["All", "Pending", "In Progress", "Resolved"];
const PRIORITIES = ["All", "Low", "Normal", "High", "Urgent"];

export default function AllIssues() {
  const [issues,   setIssues]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("All");
  const [status,   setStatus]   = useState("All");
  const [priority, setPriority] = useState("All");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params = {};
        if (category !== "All") params.category = category;
        if (status   !== "All") params.status   = status;
        if (priority !== "All") params.priority = priority;
        if (search) params.search = search;
        const { data } = await apiGetIssues(params);
        setIssues(data);
      } catch {}
      setLoading(false);
    };
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [search, category, status, priority]);

  return (
    <div>
      <PageHeader title="All Issues" subtitle={`${issues.length} issues found`} />

      <div className="filter-bar">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input className="search-input" placeholder="Search issues..." value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="filter-select" value={category} onChange={e => setCategory(e.target.value)}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select className="filter-select" value={status} onChange={e => setStatus(e.target.value)}>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <select className="filter-select" value={priority} onChange={e => setPriority(e.target.value)}>
          {PRIORITIES.map(p => <option key={p}>{p}</option>)}
        </select>
      </div>

      {loading ? <Spinner /> : issues.length === 0
        ? <EmptyState icon="🔍" text="No issues match your filters." />
        : <div className="issues-grid">
            {issues.map(issue => <IssueCard key={issue._id} issue={issue} />)}
          </div>
      }
    </div>
  );
}
