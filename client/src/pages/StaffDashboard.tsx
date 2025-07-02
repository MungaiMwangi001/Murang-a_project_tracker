import { useState, useEffect, useContext } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Project } from '../types/project';
import Navbar from '../components/Navbar';
import ProjectForm from './ProjectForm';
import { UserContext } from '../context/UserContext';
import { BellIcon, PlusCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import * as XLSX from 'xlsx';
// @ts-ignore
import { saveAs } from 'file-saver';
import { departments } from '../types/projects';

const StaffDashboardHome = () => {
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(UserContext);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');

  const fetchStaffProjects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch('/api/projects/staff/projects', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await res.json();
      setUserProjects(data.projects || data); // Adjust based on backend response
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffProjects();
  }, []);

  // Refresh projects if navigated with refresh flag
  useEffect(() => {
    if (location.state?.refresh) {
      fetchStaffProjects();
      // Clear the refresh flag so it doesn't refetch on every render
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  // Delete project (staff)
  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete project');
      setUserProjects(projects => projects.filter(p => p.id !== id));
    } catch (err) {
      alert('Error deleting project.');
    }
  };

  if (user && user.role === 'STAFF' && !user.isApproved) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="w-full px-0 py-24 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Awaiting Admin Approval</h2>
          <p className="text-gray-600">Your staff account is pending approval by an administrator. You will be able to create and manage projects once approved.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <Navbar />
      <div className="w-full px-0 py-4 mt-24">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-green-800 mb-1">Welcome, {user?.name || 'Staff'}!</h1>
            <p className="text-gray-600 text-lg">Here's a summary of your projects and quick actions.</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Notification Bell Placeholder */}
            <button className="relative p-2 rounded-full bg-white shadow hover:bg-green-100 transition">
              <BellIcon className="h-7 w-7 text-green-700" />
            </button>
            <button
              onClick={() => {
                // Export My Projects logic
                const ws = XLSX.utils.json_to_sheet(userProjects.map(p => ({
                  Title: p.title,
                  Status: p.status,
                  Progress: p.progress,
                  Budget: p.budgetedCost,
                  Start: p.contractStartDate,
                  End: p.contractEndDate,
                  Constituency: p.constituency,
                  Ward: p.ward,
                })));
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'My Projects');
                const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                saveAs(new Blob([buf], { type: 'application/octet-stream' }), 'my_projects.xlsx');
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
            >
              Export My Projects
            </button>
            <button
              onClick={() => navigate('/staff/projects/new')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition"
            >
              <PlusCircleIcon className="h-6 w-6 mr-2" />
              Add New Project
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-semibold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
            >
              Logout
            </button>
          </div>
        </div>
        {/* Project Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition">
            <span className="text-3xl font-bold text-green-700">{userProjects.length}</span>
            <span className="text-gray-500 mt-2">Total Projects</span>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition">
            <span className="text-3xl font-bold text-blue-700">{userProjects.filter(p => p.status === 'ongoing').length}</span>
            <span className="text-gray-500 mt-2">Ongoing</span>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition">
            <span className="text-3xl font-bold text-green-500">{userProjects.filter(p => p.status === 'completed').length}</span>
            <span className="text-gray-500 mt-2">Completed</span>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition">
            <span className="text-3xl font-bold text-yellow-600">{userProjects.filter(p => (typeof p.status === 'string' && (p.status.toLowerCase() === 'pending' || p.status.toLowerCase() === 'under_procurement'))).length}</span>
            <span className="text-gray-500 mt-2">Pending/Procurement</span>
          </div>
        </div>
        {/* Quick Links */}
        <div className="flex flex-wrap gap-4 mb-10">
          <button
            onClick={() => navigate('/staff/projects/new')}
            className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg shadow hover:bg-green-200 transition"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" /> New Project
          </button>
          <button
            onClick={() => {/* TODO: navigate to pending approvals */}}
            className="flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg shadow hover:bg-yellow-200 transition"
          >
            <ClockIcon className="h-5 w-5 mr-2" /> Pending Approvals
          </button>
          <button
            onClick={() => {/* TODO: navigate to recent activity */}}
            className="flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg shadow hover:bg-blue-200 transition"
          >
            <BellIcon className="h-5 w-5 mr-2" /> Recent Activity
          </button>
        </div>
        {/* Project List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              </div>
            ) : userProjects.filter(p => !selectedDepartment || p.department === selectedDepartment).length > 0 ? (
              userProjects.filter(p => !selectedDepartment || p.department === selectedDepartment).map((project) => (
                <li key={project.id}>
                  <div className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-green-600 truncate">{project.title}</p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${project.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                project.status === 'ongoing' ? 'bg-blue-100 text-blue-800' : 
                                'bg-gray-100 text-gray-800'}`}
                            >
                              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                            </p>
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <button
                            onClick={() => navigate(`/staff/projects/${project.id}/edit`)}
                            className="font-medium text-green-600 hover:text-green-500"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="ml-2 font-medium text-red-600 hover:text-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {project.constituency} - {project.ward}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p>
                            Last updated on{' '}
                            <time dateTime={project.lastUpdated}>
                              {new Date(project.lastUpdated).toLocaleDateString()}
                            </time>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No projects</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
                <div className="mt-6">
                  <button
                    onClick={() => navigate('/staff/projects/new')}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    New Project
                  </button>
                </div>
              </div>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

const StaffDashboard = () => {
  return (
    <Routes>
      <Route path="/" element={<StaffDashboardHome />} />
      <Route path="/projects/new" element={<ProjectForm />} />
      <Route path="/projects/:id/edit" element={<ProjectForm />} />
    </Routes>
  );
};

export default StaffDashboard; 