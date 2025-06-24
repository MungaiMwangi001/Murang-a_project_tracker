import { useParams, useNavigate } from 'react-router-dom';
import { constituencies, Project } from '../types/projects';
import StatusSummary from '../components/StatusSummary';
import ProjectGrid from '../components/ProjectGrid';

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
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
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
  }
];

const WardProjectsPage = () => {
  const { constituencyId, wardName, year = 'all' } = useParams();
  const navigate = useNavigate();
  
  console.log('Route params:', { constituencyId, wardName, year });
  
  const constituency = constituencies.find(c => c.id === constituencyId);
  if (!constituency) {
    console.log('Constituency not found:', constituencyId);
    return <div>Constituency not found</div>;
  }
  
  console.log('Found constituency:', constituency);
  
  if (!constituency.wards.includes(wardName || '')) {
    console.log('Ward not found in constituency:', wardName);
    return <div>Ward not found</div>;
  }

  // Filter projects by ward and year (if specified)
  const wardProjects = sampleProjects.filter(project => {
    const matchesWard = project.ward.toLowerCase() === wardName?.toLowerCase();
    const matchesConstituency = project.constituency.toLowerCase() === constituencyId?.toLowerCase();
    const matchesYear = year === 'all' || project.financialYear === year;
    
    console.log('Project filtering:', {
      project: project.name,
      wardMatch: matchesWard,
      constituencyMatch: matchesConstituency,
      yearMatch: matchesYear,
      projectWard: project.ward.toLowerCase(),
      paramWard: wardName?.toLowerCase(),
      projectConstituency: project.constituency.toLowerCase(),
      paramConstituency: constituencyId?.toLowerCase(),
      projectYear: project.financialYear,
      paramYear: year
    });
    
    return matchesWard && matchesConstituency && matchesYear;
  });

  console.log('Filtered ward projects:', wardProjects);

  const projectStats = {
    completed: wardProjects.filter(p => p.status === 'Completed').length,
    ongoing: wardProjects.filter(p => p.status === 'Ongoing').length,
    stalled: wardProjects.filter(p => p.status === 'Stalled').length,
    notStarted: wardProjects.filter(p => p.status === 'Not Started').length,
    underProcurement: wardProjects.filter(p => p.status === 'Under Procurement').length,
    total: wardProjects.length
  };

  console.log('Project stats:', projectStats);

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
        <ProjectGrid
          projects={wardProjects}
          title={`${wardName} Ward Projects`}
          subtitle={yearDisplay}
        />
      </div>
    </div>
  );
};

export default WardProjectsPage; 