import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { Project } from '../types/projects';
import { api } from '../services/api';
import ProjectComments from '../components/ProjectComments';
import { Comment } from '../types/project';
import { UserContext } from '../context/UserContext';

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const { user } = useContext(UserContext);

  // Guard against invalid IDs
  if (!id || id === 'subCounty' || id === 'recent' || id === 'department') {
    return <Navigate to="/projects" />;
  }

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const data = await api.getProject(id);
        if (data) {
          setProject(data);
        } else {
          setError('Project not found');
        }
      } catch (err) {
        setError('Failed to load project details. Please try again later.');
        console.error('Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const fetchComments = async () => {
      setCommentsLoading(true);
      setCommentsError(null);
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL;
        const res = await fetch(`${API_BASE_URL}/api/comments/project/${id}`);
        if (res.status === 404) {
          setComments([]); // No comments yet
          return;
        }
        if (!res.ok) throw new Error('Failed to fetch comments');
        const data = await res.json();
        setComments(data.comments || []);
      } catch (err: any) {
        setCommentsError(err.message);
      } finally {
        setCommentsLoading(false);
      }
    };
    fetchComments();
  }, [id]);

  const handleAddComment = async (content: string, userName?: string) => {
    if (!id) return;
    try {
      const token = localStorage.getItem('token');
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      const requestBody: any = { 
        projectId: id, 
        content,
        userName: userName || 'Anonymous User' // Always provide a userName
      };
      
      const res = await fetch(`${API_BASE_URL}/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      setComments([data.comment, ...comments]);
    } catch (err: any) {
      console.error('Comment error:', err);
      alert(`Failed to add comment: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Project Not Found</h2>
          <p className="mt-2 text-gray-600">{error || "The project you're looking for doesn't exist."}</p>
    <button
            onClick={() => navigate('/')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Return Home
    </button>
        </div>
      </div>
  );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border-gray-300"
            >
              Back to Projects
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Project Image */}
          {project.imageUrl && (
            <div className="h-64 w-full">
              <img
                src={project.imageUrl}
                alt={project.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Project Info */}
          <div className="p-6">
            {/* Status and Progress */}
            <div className="flex items-center justify-between mb-6">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                ${project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  project.status === 'Ongoing' ? 'bg-blue-100 text-blue-800' :
                  project.status === 'Stalled' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'}`}
              >
                {project.status}
              </span>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 mr-2">Progress:</span>
                <div className="w-48 bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <span className="ml-2 text-sm text-gray-600">{project.progress}%</span>
        </div>
      </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600">{project.description}</p>
            </div>
            
            {/* Location and Budget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Location</h3>
                <div className="space-y-1 text-gray-600">
                  <p>County: {project.location?.county}</p>
                  <p>Sub-County: {project.location?.subCounty}</p>
                  <p>Ward: {project.location?.ward}</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Budget</h3>
                <p className="text-gray-600">
                  {project.budget ? new Intl.NumberFormat('en-KE', {
                    style: 'currency',
                    currency: project.budget.currency,
                    minimumFractionDigits: 0,
                  }).format(project.budget.amount) : 'N/A'}
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Timeline</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="text-gray-900">{project.timeline ? new Date(project.timeline.startDate).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Expected End Date</p>
                  <p className="text-gray-900">{project.timeline ? new Date(project.timeline.expectedEndDate).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Objectives */}
            {project.objectives && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Objectives</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {project.objectives.map((objective, index) => (
                    <li key={index}>{objective}</li>
                  ))}
                </ul>
          </div>
        )}

            {/* Milestones */}
            {/* project.milestones and project.updates are removed as per the instructions */}

            {/* Updates */}
            {/* project.updates are removed as per the instructions */}

            {/* Comments Section */}
            <div className="mt-12">
              {commentsLoading ? (
                <div className="text-center text-gray-500">Loading comments...</div>
              ) : commentsError ? (
                <div className="text-center text-red-500">{commentsError}</div>
              ) : (
                <ProjectComments
                  projectId={id!}
                  comments={comments}
                  onAddComment={handleAddComment}
                />
              )}
            </div>
          </div>
          </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage; 