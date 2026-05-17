import { useEffect, useState } from "react";
import { apiGetUsers, apiUpdateUser } from "../services/api";
import { PageHeader, Spinner } from "../components/UI";
import toast from "react-hot-toast";
import "./AdminUsers.css";

export default function AdminUsers() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGetUsers().then(r => { setUsers(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleRole = async (id, role) => {
    try {
      const { data } = await apiUpdateUser(id, { role });
      setUsers(prev => prev.map(u => u._id === id ? data : u));
      toast.success("Role updated");
    } catch { toast.error("Failed to update role"); }
  };

  const handleToggle = async (id, isActive) => {
    try {
      const { data } = await apiUpdateUser(id, { isActive: !isActive });
      setUsers(prev => prev.map(u => u._id === id ? data : u));
      toast.success(data.isActive ? "User activated" : "User deactivated");
    } catch { toast.error("Failed to update user"); }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader title="Manage Users" subtitle={`${users.length} registered users`} />
      <div className="users-table-wrap">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>
                  <div className="user-cell">
                    <div className="user-av">{u.name[0].toUpperCase()}</div>
                    {u.name}
                  </div>
                </td>
                <td className="muted">{u.email}</td>
                <td>
                  <select className="role-select" value={u.role} onChange={e => handleRole(u._id, e.target.value)}>
                    <option value="citizen">Citizen</option>
                    <option value="official">Official</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <span className={`status-pill ${u.isActive ? "active" : "inactive"}`}>
                    {u.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className={`toggle-btn ${u.isActive ? "deact" : "act"}`}
                    onClick={() => handleToggle(u._id, u.isActive)}>
                    {u.isActive ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
