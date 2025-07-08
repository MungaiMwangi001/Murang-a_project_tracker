import { Project } from '../types/projects';

interface ProjectCardProps {
  project: Project;
  onViewDetails?: (projectId: string) => void;
}

const getStatusColor = (status: Project['status']): { bg: string; text: string; button: string } => {
  switch (status) {
    case 'Completed':
      return {
        bg: 'bg-green-100',
        text: 'text-green-800',
        button: 'bg-green-600 hover:bg-green-700'
      };
    case 'Ongoing':
      return {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        button: 'bg-blue-600 hover:bg-blue-700'
      };
    case 'Stalled':
      return {
        bg: 'bg-red-100',
        text: 'text-red-800',
        button: 'bg-red-600 hover:bg-red-700'
      };
    case 'Not Started':
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        button: 'bg-gray-600 hover:bg-gray-700'
      };
    case 'Under Procurement':
      return {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        button: 'bg-purple-600 hover:bg-purple-700'
      };
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        button: 'bg-gray-600 hover:bg-gray-700'
      };
  }
};

const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const ProjectCard = ({ project, onViewDetails }: ProjectCardProps) => {
  const statusColors = getStatusColor(project.status);

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col">
      {/* Project Image */}
      <div className="relative h-48 rounded-t-2xl overflow-hidden">
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.name}
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold shadow ${statusColors.bg} ${statusColors.text}`}>
            {project.status}
          </span>
        </div>
      </div>

      {/* Project Info */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">{project.name}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
        </div>
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center text-xs text-gray-500">
            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {project.location ? `${project.location.ward}, ${project.location.subCounty}` : 'Location N/A'}
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatCurrency(project.budget.amount, project.budget.currency)}
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {`${new Date(project.timeline.startDate).toLocaleDateString()} - ${new Date(project.timeline.expectedEndDate).toLocaleDateString()}`}
          </div>
        </div>
        <button
          onClick={() => onViewDetails?.(project.id)}
          className={`mt-5 w-full py-2 rounded-lg text-white font-semibold text-sm shadow ${statusColors.button} transition-colors duration-200`}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
