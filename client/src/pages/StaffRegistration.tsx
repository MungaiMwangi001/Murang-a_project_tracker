import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { UserPlusIcon } from '@heroicons/react/24/outline';

const StaffRegistration: React.FC = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(e.target.files[0]);
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("role", "STAFF");
      if (profilePic) formData.append("profilePic", profilePic);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      setUser(data.user);
      setSuccess("Registration successful! Awaiting admin approval before you can create projects.");
      setForm({ name: "", email: "", password: "" });
      setProfilePic(null);
      setPreviewUrl(null);
      // Optionally redirect to login after a delay
      // setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-2xl p-10">
        <div className="flex flex-col items-center mb-6">
          <UserPlusIcon className="h-12 w-12 text-green-600 mb-2" />
          <h2 className="text-3xl font-extrabold text-green-800 text-center">Staff Registration</h2>
          <p className="mt-2 text-gray-500 text-center text-base">Create your staff account to manage and track projects.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="mb-2 text-red-600 text-center font-semibold">{error}</div>}
          {success && <div className="mb-2 text-green-600 text-center font-semibold">{success}</div>}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 text-lg"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 text-lg"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 text-lg"
              required
            />
          </div>
          <div>
            <label htmlFor="profilePic" className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
            <input
              type="file"
              name="profilePic"
              id="profilePic"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            {previewUrl && (
              <img src={previewUrl} alt="Profile Preview" className="mt-2 w-20 h-20 rounded-full object-cover border-2 border-green-300 mx-auto" />
            )}
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register as Staff"}
          </button>
        </form>
        <div className="text-center mt-4 text-gray-500">
          Already have an account?{' '}
          <button
            className="text-green-700 hover:underline font-semibold"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffRegistration; 