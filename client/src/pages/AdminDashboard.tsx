import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { BellIcon, UserGroupIcon, ClipboardIcon, UserPlusIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { api } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Dialog } from '@headlessui/react';
import { Fragment, useRef } from 'react';
import jsPDF from 'jspdf';
import pptxgen from 'pptxgenjs';

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "STAFF" | "PUBLIC";
  isApproved?: boolean;
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const { user } = useContext(UserContext);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [addUserForm, setAddUserForm] = useState({ name: '', email: '', password: '', role: 'STAFF' });
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [addUserError, setAddUserError] = useState('');
  const addUserRef = useRef(null);

  // Placeholder stats (replace with real data as needed)
  const totalProjects = 42; // TODO: fetch real project count
  const pendingStaff = users.filter(u => u.role === 'STAFF' && !u.isApproved).length;
  const totalUsers = users.length;
  const pendingProjects = 5; // TODO: fetch real pending project count

  // Fetch projects for analytics
  useEffect(() => {
    api.getProjects().then(setProjects);
  }, []);

  // Analytics calculations
  const statusCounts = projects.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const statusData = Object.entries(statusCounts).map(([status, count]) => ({ status, count }));

  const totalBudget = projects.reduce((sum, p) => sum + (p.budget?.amount || 0), 0);
  const totalSpent = projects.reduce((sum, p) => sum + (p.progress ? (p.budget?.amount || 0) * (p.progress / 100) : 0), 0);
  const budgetData = [
    { name: 'Spent', value: totalSpent },
    { name: 'Remaining', value: totalBudget - totalSpent },
  ];
  const COLORS = ['#34d399', '#fbbf24'];

  const overdueProjects = projects.filter(p => {
    const end = new Date(p.timeline?.expectedEndDate);
    return p.status !== 'Completed' && end < new Date();
  });

  // Export to Excel/CSV
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(projects.map(p => ({
      Name: p.name,
      Status: p.status,
      Budget: p.budget?.amount,
      Progress: p.progress,
      Start: p.timeline?.startDate,
      End: p.timeline?.expectedEndDate,
      Category: p.category,
      Ward: p.location?.ward,
      SubCounty: p.location?.subCounty,
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Projects');
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buf], { type: 'application/octet-stream' }), 'projects_report.xlsx');
  };

  // Export to PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Projects Report', 14, 16);
    doc.setFontSize(10);
    let y = 28;
    projects.forEach((p, idx) => {
      doc.text(`${idx + 1}. ${p.name} | Status: ${p.status} | Budget: ${p.budget?.amount || ''} | Progress: ${p.progress || ''}%`, 14, y);
      y += 8;
      if (y > 270) {
        doc.addPage();
        y = 16;
      }
    });
    doc.save('projects_report.pdf');
  };

  // Export to PowerPoint
  const handleExportPPT = () => {
    const pptx = new pptxgen();
    const slide = pptx.addSlide();
    slide.addText('Projects Report', { x: 0.5, y: 0.3, fontSize: 24, bold: true, color: '003366' });
    let y = 1;
    projects.forEach((p, idx) => {
      slide.addText(`${idx + 1}. ${p.name} | Status: ${p.status} | Budget: ${p.budget?.amount || ''} | Progress: ${p.progress || ''}%`, { x: 0.5, y, fontSize: 12 });
      y += 0.3;
      if (y > 6.5) {
        y = 1;
        pptx.addSlide();
      }
    });
    pptx.writeFile('projects_report.pptx');
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch users");
      setUsers(data.users || data); // support both {users:[]} and []
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const approveStaff = async (id: string) => {
    setError(""); setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/users/${id}/approve`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to approve staff");
      setSuccess("Staff approved successfully.");
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteUser = async (id: string) => {
    setError(""); setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete user");
      setSuccess("User deleted successfully.");
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddUserLoading(true);
    setAddUserError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addUserForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add user');
      setIsAddUserOpen(false);
      setAddUserForm({ name: '', email: '', password: '', role: 'STAFF' });
      fetchUsers();
    } catch (err: any) {
      setAddUserError(err.message);
    } finally {
      setAddUserLoading(false);
    }
  };

  // Delete project (admin)
  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete project');
      setProjects(projects => projects.filter(p => p.id !== id));
    } catch (err) {
      alert('Error deleting project.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-24">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-blue-800 mb-1">Welcome, {user?.name || 'Admin'}!</h1>
            <p className="text-gray-600 text-lg">Here's a summary and quick actions for your admin tasks.</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Notification Bell Placeholder */}
            <button className="relative p-2 rounded-full bg-white shadow hover:bg-blue-100 transition">
              <BellIcon className="h-7 w-7 text-blue-700" />
            </button>
          </div>
        </div>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition">
            <UserGroupIcon className="h-8 w-8 text-blue-700 mb-2" />
            <span className="text-3xl font-bold text-blue-700">{totalUsers}</span>
            <span className="text-gray-500 mt-2">Total Users</span>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition">
            <ClipboardIcon className="h-8 w-8 text-green-700 mb-2" />
            <span className="text-3xl font-bold text-green-700">{totalProjects}</span>
            <span className="text-gray-500 mt-2">Total Projects</span>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition">
            <UserPlusIcon className="h-8 w-8 text-yellow-600 mb-2" />
            <span className="text-3xl font-bold text-yellow-600">{pendingStaff}</span>
            <span className="text-gray-500 mt-2">Pending Staff Approvals</span>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition">
            <CheckCircleIcon className="h-8 w-8 text-purple-700 mb-2" />
            <span className="text-3xl font-bold text-purple-700">{pendingProjects}</span>
            <span className="text-gray-500 mt-2">Projects Pending Approval</span>
          </div>
        </div>
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-10">
          <button
            className="flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg shadow hover:bg-blue-200 transition"
            onClick={() => setIsAddUserOpen(true)}
          >
            <UserPlusIcon className="h-5 w-5 mr-2" /> Add User
          </button>
          <button
            className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg shadow hover:bg-green-200 transition"
            // onClick={() => {/* TODO: View all projects */}}
          >
            <ClipboardIcon className="h-5 w-5 mr-2" /> All Projects
          </button>
          <button
            className="flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg shadow hover:bg-yellow-200 transition"
            // onClick={() => {/* TODO: View pending approvals */}}
          >
            <ClockIcon className="h-5 w-5 mr-2" /> Pending Approvals
          </button>
        </div>
        {/* Analytics & Reporting Section */}
        <div className="bg-white rounded-xl shadow p-8 mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold text-blue-800">Analytics & Reporting</h2>
            <div className="flex gap-2">
              <button
                onClick={handleExport}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition font-semibold"
              >
                Download Excel
              </button>
              <button
                onClick={handleExportPDF}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition font-semibold"
              >
                Download PDF
              </button>
              <button
                onClick={handleExportPPT}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition font-semibold"
              >
                Download PowerPoint
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Project Status Bar Chart */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Projects by Status</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={statusData}>
                  <XAxis dataKey="status" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Budget Utilization Pie Chart */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Budget Utilization</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={budgetData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {budgetData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Overdue Projects */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2 text-red-600">Overdue Projects</h3>
            {overdueProjects.length === 0 ? (
              <div className="text-gray-500">No overdue projects 🎉</div>
            ) : (
              <ul className="list-disc pl-6 text-gray-700">
                {overdueProjects.map(p => (
                  <li key={p.id}>
                    <span className="font-semibold">{p.name}</span> (End: {p.timeline?.expectedEndDate})
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {/* Recent Activity Feed Placeholder */}
        <div className="bg-white rounded-xl shadow p-6 mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          <ul className="text-gray-600 space-y-2">
            <li>• John Doe registered as staff</li>
            <li>• Project 'Water Supply' approved</li>
            <li>• Comment added to 'Road Rehab'</li>
            {/* TODO: Dynamically load real activity */}
          </ul>
        </div>
        {/* User Table (existing logic) */}
        {error && <div className="mb-4 text-red-600">{error}</div>}
        {success && <div className="mb-4 text-green-600">{success}</div>}
        {loading ? (
          <div>Loading users...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow mb-8">
              <thead>
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Role</th>
                  <th className="px-4 py-2">Approved</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-t">
                    <td className="px-4 py-2">{u.name}</td>
                    <td className="px-4 py-2">{u.email}</td>
                    <td className="px-4 py-2">{u.role}</td>
                    <td className="px-4 py-2">{u.role === "STAFF" ? (u.isApproved ? "Yes" : "No") : "-"}</td>
                    <td className="px-4 py-2 space-x-2">
                      {u.role === "STAFF" && !u.isApproved && (
                        <button
                          onClick={() => approveStaff(u.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Approve
                        </button>
                      )}
                      {u.role !== "ADMIN" && (
                        <button
                          onClick={() => deleteUser(u.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Project Table for Admin Delete */}
            <h2 className="text-xl font-bold mb-2 text-blue-800">All Projects</h2>
            <table className="min-w-full bg-white rounded shadow">
              <thead>
                <tr>
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Budget</th>
                  <th className="px-4 py-2">Progress</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(p => (
                  <tr key={p.id} className="border-t">
                    <td className="px-4 py-2">{p.name || p.title}</td>
                    <td className="px-4 py-2">{p.status}</td>
                    <td className="px-4 py-2">{p.budget?.amount || p.budgetedCost}</td>
                    <td className="px-4 py-2">{p.progress}%</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDeleteProject(p.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Add User Modal */}
        <Dialog as={Fragment} open={isAddUserOpen} onClose={() => setIsAddUserOpen(false)} initialFocus={addUserRef}>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <Dialog.Panel className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md mx-auto">
              <Dialog.Title className="text-xl font-bold mb-4 text-blue-800">Add New User</Dialog.Title>
              <form onSubmit={handleAddUser} className="space-y-4">
                {addUserError && <div className="text-red-600 text-center font-semibold">{addUserError}</div>}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={addUserForm.name}
                    onChange={e => setAddUserForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                    ref={addUserRef}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={addUserForm.email}
                    onChange={e => setAddUserForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={addUserForm.password}
                    onChange={e => setAddUserForm(f => ({ ...f, password: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    name="role"
                    value={addUserForm.role}
                    onChange={e => setAddUserForm(f => ({ ...f, role: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="STAFF">Staff</option>
                    <option value="ADMIN">Admin</option>
                    <option value="PUBLIC">Public</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                    onClick={() => setIsAddUserOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
                    disabled={addUserLoading}
                  >
                    {addUserLoading ? 'Adding...' : 'Add User'}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminDashboard; 