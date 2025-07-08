import { useParams, useNavigate } from 'react-router-dom';
import { constituencies } from '../types/projects';
import StatusSummary from '../components/StatusSummary';
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Project } from '../types/projects';

const WardProjectsPage = () => {
  const { constituencyId, wardName, year = 'all' } = useParams();
  const navigate = useNavigate();
  const constituency = constituencies.find(c => c.id === constituencyId);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api.getProjects()
      .then((allProjects) => {
        setProjects(allProjects.filter(project => {
          const matchesWard = project.ward?.toLowerCase() === wardName?.toLowerCase();
          const matchesConstituency = project.subCounty?.toLowerCase() === constituencyId?.toLowerCase();
          const matchesYear = year === 'all' || project.financialYear === year;
          return matchesWard && matchesConstituency && matchesYear;
        }));
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load projects');
        setLoading(false);
      });
  }, [constituencyId, wardName, year]);

  if (!constituency) return <div>Constituency not found</div>;
  if (!constituency.wards.includes(wardName || '')) return <div>Ward not found</div>;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const projectStats = {
    completed: projects.filter(p => p.status === 'Completed').length,
    ongoing: projects.filter(p => p.status === 'Ongoing').length,
    stalled: projects.filter(p => p.status === 'Stalled').length,
    notStarted: projects.filter(p => p.status === 'Not Started').length,
    underProcurement: projects.filter(p => p.status === 'Under Procurement').length,
    total: projects.length
  };

  const yearDisplay = year === 'all' ? 'All Financial Years' : `Financial Year: ${year}`;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800 flex items-center mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to {constituency.name}
          </button>
          <div className="flex items-center space-x-2 mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{wardName} Ward</h1>
            <span className="text-gray-500">•</span>
            <span className="text-xl text-gray-500">{constituency.name} Constituency</span>
          </div>
          <StatusSummary counts={projectStats} />
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                <div className="flex justify-between items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      project.status === 'Ongoing' ? 'bg-blue-100 text-blue-800' :
                      project.status === 'Stalled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'}`}
                  >
                    {project.status}
                  </span>
                  <button
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WardProjectsPage; 