import { useParams, useNavigate } from 'react-router-dom';
import { constituencies } from '../types/projects';
import StatusSummary from '../components/StatusSummary';
import ProjectCard from '../components/ProjectCard';
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Project } from '../types/projects';

const SubcountyProjectsPage = () => {
  const { subCountyId, year = 'all' } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const subCounty = constituencies.find(c => c.id === subCountyId);
  if (!subCounty) {
    return <div>SubCounty not found</div>;
  }

  useEffect(() => {
    setLoading(true);
    api.getProjects()
      .then((allProjects) => {
        setProjects(allProjects.filter(project => 
          (project.subCounty || '').toLowerCase() === (subCountyId || '').toLowerCase() && 
          (year === 'all' || project.financialYear === year)
        ));
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load projects');
        setLoading(false);
      });
  }, [subCountyId, year]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Group projects by ward with case-insensitive comparison
  const projectsByWard = subCounty.wards.reduce((acc, ward) => {
    acc[ward] = projects.filter(project => 
      (project.ward || '').toLowerCase() === (ward || '').toLowerCase()
    );
    return acc;
  }, {} as Record<string, Project[]>);

  const projectStats = {
    completed: projects.filter(p => p.status === 'Completed').length,
    ongoing: projects.filter(p => p.status === 'Ongoing').length,
    stalled: projects.filter(p => p.status === 'Stalled').length,
    notStarted: projects.filter(p => p.status === 'Not Started').length,
    underProcurement: projects.filter(p => p.status === 'Under Procurement').length,
    total: projects.length
  };

  const handleWardClick = (ward: string) => {
    const currentYear = year || 'all';
    navigate(`/projects/${currentYear}/subCounty/${subCountyId}/ward/${ward}`);
  };

  const handleViewDetails = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

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
            Back to SubCounties
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{subCounty.name}</h1>
          <StatusSummary counts={projectStats} />
        </div>

        {/* Projects by Ward */}
        <div className="space-y-6">
          {subCounty.wards.map((ward) => {
            const wardProjects = projectsByWard[ward] || [];
            return (
              <div key={ward} className="bg-white rounded-xl shadow overflow-hidden">
                <div 
                  className="px-6 py-4 bg-gray-50 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => handleWardClick(ward)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{ward} Ward</h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {wardProjects.length} {wardProjects.length === 1 ? 'Project' : 'Projects'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex space-x-2 text-sm">
                        <span className="text-gray-500">
                          {wardProjects.filter(p => p.status === 'Completed').length} Completed
                        </span>
                        <span className="text-gray-500">
                          {wardProjects.filter(p => p.status === 'Ongoing').length} Ongoing
                        </span>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Projects in this ward */}
                {wardProjects.length > 0 && (
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {wardProjects.map((project) => (
                        <ProjectCard
                          key={project.id}
                          project={project}
                          onViewDetails={handleViewDetails}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SubcountyProjectsPage; 