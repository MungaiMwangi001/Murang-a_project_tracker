import { Project } from '../types/project';

interface ProjectGridProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

const ProjectGrid = ({ projects, onProjectClick }: ProjectGridProps) => {
  if (!projects.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <svg
          className="w-16 h-16 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No Projects Found</h3>
        <p className="text-gray-500">There are no projects matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <button
          key={project.id}
          onClick={() => onProjectClick(project)}
          className="block w-full text-left bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
        >
          {/* Project Image */}
          <div className="relative h-48 overflow-hidden bg-gray-100">
            {project.images && project.images.length > 0 ? (
              <img
                src={project.images[0]}
                alt={project.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            )}
            <div className="absolute top-0 right-0 mt-2 mr-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium shadow-sm
                ${project.status === 'completed' ? 'bg-green-100 text-green-800' :
                  project.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                  project.status === 'stalled' ? 'bg-red-100 text-red-800' :
                  project.status === 'not_started' ? 'bg-gray-100 text-gray-800' :
                  'bg-purple-100 text-purple-800'}`}
              >
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </span>
            </div>
          </div>
          
          {/* Project Info */}
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
              {project.title}
            </h3>

            <div className="space-y-2">
              {/* Location */}
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="truncate">{project.ward}, {project.constituency}</span>
              </div>

              {/* Budget */}
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>KES {project.budgetedCost.toLocaleString()}</span>
              </div>

              {/* Progress Bar */}
              <div className="pt-1">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${
                      project.status === 'completed' ? 'bg-green-600' :
                      project.status === 'ongoing' ? 'bg-blue-600' :
                      project.status === 'stalled' ? 'bg-red-600' :
                      'bg-gray-600'
                    }`}
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* View Details Button */}
            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-center text-sm font-medium text-green-600 group-hover:text-green-700">
                <span>View Project Details</span>
                <svg className="w-4 h-4 ml-1.5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ProjectGrid; 