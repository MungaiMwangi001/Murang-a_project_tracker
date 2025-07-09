import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlusIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import  api  from "../services/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: "STAFF";
  isApproved: boolean;
  createdAt: string;
}

const PendingApprovals: React.FC = () => {
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const fetchPendingUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get('/users/pending');
      console.log(`API Response:`, response);
      // Ensure we always set an array, even if response.data is null/undefined
      const data = response?.data;
      setPendingUsers(
        Array.isArray(data) 
          ? data 
          : data !== null && data !== undefined 
            ? [data] 
            : []
      );
      
    } catch (err: any) {
      console.error(`Fetch Error:`, err);
      setError(err.response?.data?.message || 'Failed to fetch pending users');
      setPendingUsers([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const handleApprove = async (id: string) => {
    setError("");
    try {
      await api.put(`/users/${id}/approve`);
      setPendingUsers(prev => prev.filter(user => user.id !== id));
      setSuccess('User approved successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to approve user');
    }
  };

  const handleReject = async (id: string) => {
    if (!window.confirm('Are you sure you want to reject this user?')) return;
    setError("");
    try {
      await api.delete(`/users/${id}/reject`);
      setPendingUsers(prev => prev.filter(user => user.id !== id));
      setSuccess('User rejected successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reject user');
    }
  };

  if (loading) return <div className="text-center py-8">Loading pending approvals...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Pending Staff Approvals</h1>
          <button 
            onClick={() => navigate('/admin/users')}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            View All Users
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
            <button onClick={() => setError('')} className="float-right font-bold">×</button>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {success}
            <button onClick={() => setSuccess('')} className="float-right font-bold">×</button>
          </div>
        )}

        {pendingUsers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <UserPlusIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium">No pending approvals</h3>
            <p className="text-gray-500">All staff members have been approved.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* Table content remains the same */}
              <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApprove(user.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center"
                        >
                          <CheckIcon className="h-4 w-4 mr-1" /> Approve
                        </button>
                        <button
                          onClick={() => handleReject(user.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center"
                        >
                          <XIcon className="h-4 w-4 mr-1" /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            
              </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingApprovals;

