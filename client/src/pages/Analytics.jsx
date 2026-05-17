import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer, Legend,
} from "recharts";
import { apiGetSummary, apiGetByCategory, apiGetMonthly, apiGetTopUpvoted } from "../services/api";
import { PageHeader, StatCard, Spinner } from "../components/UI";
import "./Analytics.css";

const COLORS = ["#f97316", "#3b82f6", "#22c55e", "#eab308", "#a855f7", "#ef4444"];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function Analytics() {
  const [summary,  setSummary]  = useState(null);
  const [category, setCategory] = useState([]);
  const [monthly,  setMonthly]  = useState([]);
  const [topUp,    setTopUp]    = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, c, m, t] = await Promise.all([
          apiGetSummary(), apiGetByCategory(),
          apiGetMonthly(), apiGetTopUpvoted(),
        ]);
        setSummary(s.data);
        setCategory(c.data.map(d => ({ name: d._id, count: d.count })));
        setMonthly(m.data.map(d => ({
          name: MONTHS[(d._id.month || 1) - 1],
          count: d.count,
        })));
        setTopUp(t.data.map(d => ({ name: d.title.slice(0, 18) + "…", votes: d.upvoteCount })));
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader title="Analytics" subtitle="Visual overview of community issues" />

      <div className="stats-grid" style={{ marginBottom: 28 }}>
        <StatCard icon="📋" label="Total"       value={summary?.total      || 0} color="orange" />
        <StatCard icon="⏳" label="Pending"      value={summary?.pending    || 0} color="yellow" />
        <StatCard icon="🔄" label="In Progress"  value={summary?.inProgress || 0} color="blue"   />
        <StatCard icon="✅" label="Resolved"      value={summary?.resolved   || 0} color="green"  />
      </div>

      <div className="analytics-grid">
        {/* Category Bar */}
        <div className="chart-card">
          <h3 className="chart-title">Issues by Category</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={category} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#252a38" />
              <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#13161e", border: "1px solid #252a38", borderRadius: 8 }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {category.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Pie */}
        <div className="chart-card">
          <h3 className="chart-title">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={[
                  { name: "Pending",     value: summary?.pending    || 0 },
                  { name: "In Progress", value: summary?.inProgress || 0 },
                  { name: "Resolved",    value: summary?.resolved   || 0 },
                ]}
                cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                paddingAngle={3} dataKey="value"
              >
                <Cell fill="#eab308" />
                <Cell fill="#3b82f6" />
                <Cell fill="#22c55e" />
              </Pie>
              <Tooltip contentStyle={{ background: "#13161e", border: "1px solid #252a38", borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#64748b" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Trend */}
        <div className="chart-card">
          <h3 className="chart-title">Monthly Issue Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthly} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#252a38" />
              <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#13161e", border: "1px solid #252a38", borderRadius: 8 }} />
              <Line type="monotone" dataKey="count" stroke="#f97316" strokeWidth={2} dot={{ fill: "#f97316", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Upvoted */}
        <div className="chart-card">
          <h3 className="chart-title">Most Upvoted Issues</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topUp} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#252a38" />
              <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#64748b", fontSize: 10 }} width={100} />
              <Tooltip contentStyle={{ background: "#13161e", border: "1px solid #252a38", borderRadius: 8 }} />
              <Bar dataKey="votes" fill="#f97316" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
