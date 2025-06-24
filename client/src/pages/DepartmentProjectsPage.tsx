import { useParams, useNavigate } from 'react-router-dom';
import { departments, Project } from '../types/projects';
import StatusSummary from '../components/StatusSummary';
import ProjectGrid from '../components/ProjectGrid';

// Sample data - Replace with actual API data
const sampleProjects: Project[] = [
  {
    id: '1',
    name: 'Digital Skills Program',
    description: 'Training youth on digital skills and computer literacy',
    department: 'ict',
    constituency: 'kiharu ',
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
    name: 'E-Government Services Portal',
    description: 'Development of online county services portal',
    department: 'ict',
    constituency: 'kigumo',
    ward: 'Kigumo',
    budget: 'KES 5,000,000',
    status: 'Completed',
    startDate: '2023-07-01',
    completionDate: '2023-12-31',
    financialYear: '2023/2024',
    contractor: 'Digital Systems Inc',
    progress: 100,
    objectives: [
      'Develop online service portal',
      'Integrate payment systems',
      'Train staff on system usage'
    ],
    challenges: [
      'Initial resistance to digital transformation',
      'Need for extensive staff training'
    ],
    recommendations: [
      'Regular system updates and maintenance',
      'Continuous staff capacity building'
    ]
  }
];

const DepartmentProjectsPage = () => {
  const { deptId, year } = useParams();
  const navigate = useNavigate();
  
  const department = departments.find(d => d.id === deptId);
  if (!department) return <div>Department not found</div>;

  // Filter projects by department and year (if specified)
  const departmentProjects = sampleProjects.filter(project => 
    project.department === deptId && 
    (year === 'all' || project.financialYear === year)
  );

  const projectStats = {
    completed: departmentProjects.filter(p => p.status === 'Completed').length,
    ongoing: departmentProjects.filter(p => p.status === 'Ongoing').length,
    stalled: departmentProjects.filter(p => p.status === 'Stalled').length,
    notStarted: departmentProjects.filter(p => p.status === 'Not Started').length,
    underProcurement: departmentProjects.filter(p => p.status === 'Under Procurement').length,
    total: departmentProjects.length
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
            Back to Departments
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{department.name}</h1>
          <StatusSummary counts={projectStats} />
        </div>

        {/* Projects Grid */}
        <ProjectGrid
          projects={departmentProjects}
          title={`${department.name} Projects`}
          subtitle={year === 'all' ? 'All Financial Years' : `Financial Year: ${year}`}
        />
      </div>
    </div>
  );
};

export default DepartmentProjectsPage; 