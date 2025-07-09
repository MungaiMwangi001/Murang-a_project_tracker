import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import StaffRegistration from "./pages/StaffRegistration";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UsersManagement from "./pages/UserManagement";
import PendingApprovals from "./pages/PendingApprovals";
import StaffDashboard from "./pages/StaffDashboard";
import { UserContext } from "./context/UserContext";
import FaqPage from "./pages/FaqPage";
import './App.css';

const App: React.FC = () => {
  const { user, logout } = useContext(UserContext);

  return (
    <Router>
      <nav className="bg-green-700 p-4 flex justify-between items-center">
        <div className="flex space-x-4">
          <Link to="/" className="text-white font-bold text-lg">Home</Link>
          {user?.role === "ADMIN" && <Link to="/admin" className="text-white">Admin Dashboard</Link>}
          {user?.role === "STAFF" && <Link to="/staff" className="text-white">Staff Dashboard</Link>}
        </div>
        <div className="flex space-x-4">
          {!user && <Link to="/login" className="text-white">Login</Link>}
          {!user && <Link to="/register" className="text-white">Staff Registration</Link>}
          {user && <button onClick={logout} className="text-white">Logout</button>}
        </div>
      </nav>
      <Routes>
        <Route path="/register" element={<StaffRegistration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={user?.role === "ADMIN" ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/staff/*" element={user?.role === "STAFF" ? <StaffDashboard /> : <Navigate to="/login" />} />
        <Route path="/admin/users" element={<UsersManagement />} />
        <Route path="/admin/pending-approvals" element={<PendingApprovals />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/recent" element={<ProjectsPage />} />
        <Route path="/projects/sub-county" element={<ProjectsPage />} />
        <Route path="/projects/sub-county/:subCountyName" element={<ProjectsPage />} />
        <Route path="/projects/department" element={<ProjectsPage />} />
        <Route path="/projects/department/:departmentName" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/faq" element={<FaqPage />} />
      </Routes>
    </Router>
  );
};

export default App;
