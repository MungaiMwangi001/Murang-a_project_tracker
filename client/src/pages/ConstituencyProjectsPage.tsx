import { useParams, useNavigate } from 'react-router-dom';
import { constituencies, Project } from '../types/projects';
import StatusSummary from '../components/StatusSummary';
import ProjectCard from '../components/ProjectCard';

// Sample data - Replace with actual API data
const sampleProjects: Project[] = [
  {
    id: '1',
    name: 'Digital Skills Program',
    description: 'Training youth on digital skills and computer literacy',
    department: 'ict',
    constituency: 'kiharu',
    ward: 'Wangu',
    budget: 'KES 2,500,000',
    status: 'Ongoing',
    startDate: '2024-01-15',
    completionDate: '2024-06-30',
    financialYear: '2023/2024',
    contractor: 'Tech Solutions Ltd',
    progress: 65,
    objectives: [
      'Train 500 youth in basic computer skills',
      'Establish 3 computer labs',
      'Provide internet connectivity'
    ],
    challenges: [
      'Limited access to computers in rural areas',
      'Inconsistent power supply'
    ],
    recommendations: [
      'Partner with local cyber cafes',
      'Install solar power backup systems'
    ]
  },
  {
    id: '2',
    name: 'Road Maintenance',
    description: 'Rehabilitation of feeder roads',
    department: 'roads',
    constituency: 'kiharu',
    ward: 'Mugoiri',
    budget: 'KES 15,000,000',
    status: 'Completed',
    startDate: '2023-08-01',
    completionDate: '2023-12-31',
    financialYear: '2023/2024',
    contractor: 'BuildWell Construction Ltd',
    progress: 100,
    objectives: [
      'Repair 5km of feeder roads',
      'Install proper drainage systems',
      'Add road signs and markings'
    ],
    challenges: [
      'Heavy rains during construction',
      'Material transportation logistics'
    ],
    recommendations: [
      'Schedule major works during dry season',
      'Establish local material storage facilities'
    ]
  },
  {
    id: '3',
    name: 'Water Supply Project',
    description: 'Installation of water supply infrastructure',
    department: 'water',
    constituency: 'kiharu',
    ward: 'Wangu',
    budget: 'KES 8,000,000',
    status: 'Ongoing',
    startDate: '2024-02-01',
    completionDate: '2024-08-31',
    financialYear: '2023/2024',
    contractor: 'WaterTech Solutions',
    progress: 40,
    objectives: [
      'Install 10km of water pipes',
      'Construct 2 water storage tanks',
      'Set up distribution points'
    ],
    challenges: [
      'Rocky terrain in some areas',
      'Pipeline route negotiations'
    ],
    recommendations: [
      'Use modern drilling equipment',
      'Enhance community engagement'
    ]
  },
  {
    id: '4',
    name: 'Healthcare Center Upgrade',
    description: 'Modernization of local healthcare facility',
    department: 'health',
    constituency: 'kiharu',
    ward: 'Mbiri',
    budget: 'KES 12,000,000',
    status: 'Not Started',
    startDate: '2024-07-01',
    completionDate: '2025-01-31',
    financialYear: '2024/2025',
    contractor: 'HealthBuild Kenya',
    progress: 0,
    objectives: [
      'Renovate existing structure',
      'Add maternity wing',
      'Install modern medical equipment'
    ],
    challenges: [
      'Maintaining services during renovation',
      'Equipment procurement delays'
    ],
    recommendations: [
      'Implement phased renovation approach',
      'Early procurement planning'
    ]
  }
];

const ConstituencyProjectsPage = () => {
  const { constituencyId, year = 'all' } = useParams();
  const navigate = useNavigate();
  
  console.log('Current constituency:', constituencyId);
  console.log('Current year:', year);
  
  const constituency = constituencies.find(c => c.id === constituencyId);
  if (!constituency) {
    console.log('Constituency not found');
    return <div>Constituency not found</div>;
  }
  
  console.log('Found constituency:', constituency);

  // Filter projects by constituency and year (if specified)
  const constituencyProjects = sampleProjects.filter(project => 
    project.constituency.toLowerCase() === constituencyId?.toLowerCase() && 
    (year === 'all' || project.financialYear === year)
  );
  
  console.log('Filtered constituency projects:', constituencyProjects);

  // Group projects by ward with case-insensitive comparison
  const projectsByWard = constituency.wards.reduce((acc, ward) => {
    acc[ward] = constituencyProjects.filter(project => 
      project.ward.toLowerCase() === ward.toLowerCase()
    );
    return acc;
  }, {} as Record<string, Project[]>);

  const projectStats = {
    completed: constituencyProjects.filter(p => p.status === 'Completed').length,
    ongoing: constituencyProjects.filter(p => p.status === 'Ongoing').length,
    stalled: constituencyProjects.filter(p => p.status === 'Stalled').length,
    notStarted: constituencyProjects.filter(p => p.status === 'Not Started').length,
    underProcurement: constituencyProjects.filter(p => p.status === 'Under Procurement').length,
    total: constituencyProjects.length
  };

  const handleWardClick = (ward: string) => {
    const currentYear = year || 'all';
    navigate(`/projects/${currentYear}/constituency/${constituencyId}/ward/${ward}`);
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
            Back to Constituencies
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{constituency.name}</h1>
          <StatusSummary counts={projectStats} />
        </div>

        {/* Projects by Ward */}
        <div className="space-y-6">
          {constituency.wards.map((ward) => {
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
                          Completed: {wardProjects.filter(p => p.status === 'Completed').length}
                        </span>
                        <span className="text-gray-500">
                          Ongoing: {wardProjects.filter(p => p.status === 'Ongoing').length}
                        </span>
                      </div>
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  {wardProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {wardProjects.map((project) => (
                        <ProjectCard
                          key={project.id}
                          project={project}
                          showDetailedView={true}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No projects found for this ward
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ConstituencyProjectsPage; 