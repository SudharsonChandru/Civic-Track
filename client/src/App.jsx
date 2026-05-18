import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout       from "./components/Layout";
import LoginPage    from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard    from "./pages/Dashboard";
import AllIssues    from "./pages/AllIssues";
import IssueDetail  from "./pages/IssueDetail";
import ReportIssue  from "./pages/ReportIssue";
import MyIssues     from "./pages/MyIssues";
import Analytics    from "./pages/Analytics";
import AdminUsers   from "./pages/AdminUsers";
import EditProfile from "./pages/EditProfile";
import EditIssue   from "./pages/EditIssue";

function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ color: "#fff", padding: 40 }}>Loading...</div>;
  if (!user)   return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login"    element={!user ? <LoginPage />    : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/dashboard" />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="issues"    element={<AllIssues />} />
        <Route path="issues/:id" element={<IssueDetail />} />
        <Route path="report"    element={<PrivateRoute roles={["citizen","admin"]}><ReportIssue /></PrivateRoute>} />
        <Route path="my-issues" element={<PrivateRoute roles={["citizen"]}><MyIssues /></PrivateRoute>} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="users"     element={<PrivateRoute roles={["admin"]}><AdminUsers /></PrivateRoute>} />
        <Route path="edit-profile"        element={<EditProfile />} />
        <Route path="issues/:id/edit"     element={<EditIssue />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: { background: "#13161e", color: "#f1f5f9", border: "1px solid #252a38" },
          }}
        />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
