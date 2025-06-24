import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import ProjectGrid from '../components/ProjectGrid';
import ProjectSections from '../components/ProjectSections';
import ProjectDetailsModal from '../components/ProjectDetailsModal';
import { Project } from '../types/project';
import { api } from '../services/api';
import Navbar from '../components/Navbar';

const ProjectsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { year } = useParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<'recent' | 'constituency' | 'department' | null>(null);
  const [selectedConstituency, setSelectedConstituency] = useState<string | null>(null);
  const [selectedWard, setSelectedWard] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const statusOptions = [
    { value: 'all', label: 'All Projects', color: 'gray' },
    { value: 'completed', label: 'Completed', color: 'green' },
    { value: 'ongoing', label: 'Ongoing', color: 'blue' },
    { value: 'stalled', label: 'Stalled', color: 'red' },
    { value: 'not_started', label: 'Not Started', color: 'gray' },
    { value: 'under_procurement', label: 'Under Procurement', color: 'purple' }
  ];

  const constituencyData = [
    {
      name: "Kangema",
      wards: ["Kanyenya-Ini", "Muguru", "Rwathia"]
    },
    {
      name: "Mathioya",
      wards: ["Gitugi", "Kiru", "Kamacharia"]
    },
    {
      name: "Kiharu",
      wards: ["Wangu", "Mugoiri", "Mbiri", "Township", "Murarandia", "Gaturi"]
    },
    {
      name: "Kigumo",
      wards: ["Kahumbu", "Muthithi", "Kigumo", "Kangari", "Kinyona"]
    },
    {
      name: "Maragwa",
      wards: ["Kimorori/Wempa", "Makuyu", "Kambiti", "Kamahuhu", "Ichagaki", "Nginda"]
    },
    {
      name: "Kandara",
      wards: ["Ng'araria", "Muruka", "Kagundu-Ini", "Gaichanjiru", "Ithiru", "Ruchu"]
    },
    {
      name: "Gatanga",
      wards: ["Ithanga", "Kakuzi/Mitubiri", "Mugumo-Ini", "Kihumbu-Ini", "Gatanga", "Kariara"]
    }
  ];

  const departments = [
    {
      name: "ICT & Public Administration",
      subDepartments: ["ICT", "Public Administration"]
    },
    {
      name: "Agriculture, Livestock and Cooperatives",
      subDepartments: ["Agriculture", "Livestock", "Cooperatives"]
    },
    {
      name: "Trade, Industrialization & Tourism",
      subDepartments: ["Trade"]
    },
    {
      name: "Health",
      subDepartments: ["Health"]
    },
    {
      name: "Water, Irrigation, Environment & Natural Resources",
      subDepartments: []
    },
    {
      name: "Youth Affairs, Culture & Social Services",
      subDepartments: []
    },
    {
      name: "Education and Technical Training",
      subDepartments: []
    },
    {
      name: "Lands, Physical Planning & Urban Development",
      subDepartments: []
    },
    {
      name: "County Attorney",
      subDepartments: []
    },
    {
      name: "Roads, Housing & Infrastructure",
      subDepartments: []
    }
  ];

  // Determine the current section from the URL
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/recent')) {
      setSelectedSection('recent');
    } else if (path.includes('/constituency')) {
      setSelectedSection('constituency');
    } else if (path.includes('/department')) {
      setSelectedSection('department');
      // Extract department from URL if present
      const departmentPath = path.split('/department/')[1];
      if (departmentPath) {
        const decodedDepartment = decodeURIComponent(departmentPath);
        setSelectedDepartment(decodedDepartment);
      }
    } else {
      setSelectedSection('recent'); // Default to recent if no section specified
    }
  }, [location]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulated data for testing - replace with actual API call
        const mockProjects: Project[] = [
          {
            id: '1',
            title: 'Water Supply Project - Phase 1',
            description: 'Installation of water supply infrastructure in rural areas',
            status: 'ongoing',
            budgetedCost: 5000000,
            sourceOfFunds: 'County Development Fund',
            progress: 65,
            department: 'Water and Sanitation',
            directorate: 'Water Resources',
            contractName: 'Rural Water Supply Initiative 2024',
            lpoNumber: 'LPO-2024-001',
            contractNumber: 'CNT-2024-001',
            contractor: 'Maji Solutions Ltd',
            contractPeriod: '12 months',
            contractStartDate: '2024-01-15',
            contractEndDate: '2025-01-14',
            contractCost: 4800000,
            implementationStatus: 'On Schedule',
            amountPaidToDate: 3120000,
            recommendations: 'Project progressing well, maintain current pace',
            pmc: 'Water Development Committee',
            lastUpdated: '2024-03-10',
            constituency: 'Kiharu',
            ward: 'Township',
            financialYear: '2024/2025',
            images: [
              '/images/projects/water-supply-1.jpg',
              '/images/projects/water-supply-2.jpg',
            ],
            comments: [
              {
                id: '1',
                userId: 'user1',
                userName: 'John Kamau',
                content: 'The water pressure in our area has significantly improved since this project started. Looking forward to its completion.',
                timestamp: '2024-03-08T10:30:00Z',
                replies: [
                  {
                    id: '2',
                    userId: 'user2',
                    userName: 'Project Manager',
                    content: 'Thank you for the feedback, John. We\'re working to ensure consistent water supply across all areas.',
                    timestamp: '2024-03-08T14:15:00Z'
                  }
                ]
              },
              {
                id: '3',
                userId: 'user3',
                userName: 'Mary Wanjiku',
                content: 'When will the project reach Mihuti area? We\'re still experiencing water shortages.',
                timestamp: '2024-03-09T09:45:00Z'
              }
            ]
          },
          {
            id: '2',
            title: 'Healthcare Center Upgrade',
            description: 'Modernization of existing healthcare facilities',
            status: 'completed',
            budgetedCost: 8000000,
            sourceOfFunds: 'Health Sector Support Fund',
            progress: 100,
            department: 'Health',
            directorate: 'Medical Services',
            contractName: 'Health Facilities Upgrade 2023',
            lpoNumber: 'LPO-2023-045',
            contractNumber: 'CNT-2023-089',
            contractor: 'HealthBuild Construction Ltd',
            contractPeriod: '8 months',
            contractStartDate: '2023-06-01',
            contractEndDate: '2024-01-31',
            contractCost: 7800000,
            implementationStatus: 'Completed',
            amountPaidToDate: 7800000,
            recommendations: 'Facility ready for commissioning',
            pmc: 'Health Services Committee',
            lastUpdated: '2024-02-28',
            constituency: 'Kandara',
            ward: 'Muruka',
            financialYear: '2023/2024',
            images: [
              '/images/projects/health-center-1.jpg',
              '/images/projects/health-center-2.jpg',
            ],
            comments: [
              {
                id: '4',
                userId: 'user4',
                userName: 'James Mwangi',
                content: 'The new facilities are impressive. The waiting area is much more comfortable now.',
                timestamp: '2024-02-25T11:20:00Z'
              },
              {
                id: '5',
                userId: 'user5',
                userName: 'Sarah Njeri',
                content: 'Great improvement in service delivery. Hope to see more such upgrades in other facilities.',
                timestamp: '2024-02-27T16:05:00Z',
                replies: [
                  {
                    id: '6',
                    userId: 'user6',
                    userName: 'Health Officer',
                    content: 'We\'re glad to hear about the improved services. More facility upgrades are planned for this year.',
                    timestamp: '2024-02-28T08:30:00Z'
                  }
                ]
              }
            ]
          },
          // Add more mock projects as needed
        ];

        let filteredData = mockProjects;
        
        // First apply year filter if specified
        if (year && year !== 'all') {
          filteredData = mockProjects.filter(project => 
            project.financialYear === year
          );
          // When specific year is selected, show all projects from that year
          setSelectedSection('recent');
        } else {
          // If no year or 'all' is selected, apply section filters
          if (selectedSection === 'recent') {
            // Show most recent projects
            filteredData = mockProjects.slice(0, 13);
          } else if (selectedSection === 'constituency' && selectedConstituency) {
            filteredData = mockProjects.filter(project => 
              project.constituency === selectedConstituency
            );
          } else if (selectedSection === 'department' && selectedDepartment) {
            filteredData = mockProjects.filter(project => 
              project.department === selectedDepartment
            );
          }
        }

        // Apply status filter if not 'all'
        if (selectedStatus !== 'all') {
          filteredData = filteredData.filter(project => 
            project.status.toLowerCase() === selectedStatus
          );
        }
        
        setProjects(filteredData);
      } catch (err) {
        setError('Failed to load projects. Please try again later.');
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [selectedSection, selectedConstituency, selectedDepartment, selectedStatus, year]);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
    setIsModalOpen(false);
  };

  const handleBackToConstituencies = () => {
    setSelectedConstituency(null);
    navigate('/projects/constituency', { replace: true });
  };

  // Render status filters
  const StatusFilters = () => (
    <div className="flex flex-wrap gap-2 mb-6">
      {statusOptions.map(status => (
        <button
          key={status.value}
          onClick={() => setSelectedStatus(status.value)}
          className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
            ${selectedStatus === status.value 
              ? `bg-${status.color}-100 text-${status.color}-800 border-${status.color}-200` 
              : 'bg-white hover:bg-gray-50 text-gray-700'
            } border shadow-sm hover:shadow`}
        >
          <span className={`w-2 h-2 rounded-full mr-2 bg-${status.color}-${selectedStatus === status.value ? '600' : '400'}`} />
          {status.label}
        </button>
      ))}
    </div>
  );

  const renderDepartmentGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {departments.map((dept) => (
        <button
          key={dept.name}
          onClick={() => navigate(`/projects/department/${encodeURIComponent(dept.name)}`)}
          className="p-6 text-left rounded-lg shadow hover:shadow-lg transition-all duration-200 bg-white border border-gray-200 hover:border-green-500 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-50 rounded-lg p-3 group-hover:bg-green-100 transition-colors duration-200">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <svg 
              className="w-5 h-5 text-gray-400 group-hover:text-green-600 transform group-hover:translate-x-1 transition-all duration-200" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-200">
            {dept.name}
          </h3>
          {dept.subDepartments.length > 0 && (
            <div className="mt-2 space-y-1">
              {dept.subDepartments.map((sub) => (
                <p key={sub} className="text-sm text-gray-500">{sub}</p>
              ))}
            </div>
          )}
        </button>
      ))}
    </div>
  );

  const renderRecentProjects = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Recent Projects</h2>
        <StatusFilters />
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h4 className="text-lg font-medium text-red-600 mb-2">Error</h4>
          <p className="text-gray-500">{error}</p>
        </div>
      ) : projects.length > 0 ? (
        <ProjectGrid projects={projects} onProjectClick={handleProjectClick} />
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h4 className="text-lg font-medium text-gray-900 mb-2">No projects found</h4>
          <p className="text-gray-500">There are currently no projects to display.</p>
        </div>
      )}
    </div>
  );

  const renderConstituencyView = () => {
    if (!selectedConstituency) {
      return (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Browse by Constituency</h2>
              {year && year !== 'all' && (
                <p className="text-gray-600 mt-1">Financial Year: {year}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {constituencyData.map((constituency) => (
              <button
                key={constituency.name}
                onClick={() => {
                  setSelectedConstituency(constituency.name);
                  // Update URL without full navigation
                  navigate(`/projects/constituency/${encodeURIComponent(constituency.name)}`, { replace: true });
                }}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-green-50 rounded-lg p-3 group-hover:bg-green-100 transition-colors duration-200">
                      <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-500">{constituency.wards.length} Wards</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-green-600">
                    {constituency.name} Constituency
                  </h3>
                  <div className="mt-4">
                    <div className="text-sm text-gray-600">
                      Wards: {constituency.wards.join(', ')}
                    </div>
                  </div>
                </div>
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center text-sm text-green-600">
                    <span>View Projects</span>
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      );
    }

    const constituency = constituencyData.find(c => c.name === selectedConstituency);
    if (!constituency) return null;

    return (
      <div>
        <div className="mb-8">
          <button
            onClick={handleBackToConstituencies}
            className="inline-flex items-center text-sm text-gray-500 hover:text-green-600 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Constituencies
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{constituency.name} Constituency</h2>
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">Viewing all projects across {constituency.wards.length} wards</p>
            <StatusFilters />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {constituency.wards.map(ward => {
              const wardProjects = projects.filter(project => project.ward === ward);
              
              return (
                <div key={ward} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">{ward} Ward</h3>
                  </div>
                  
                  {wardProjects.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Project Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Budget
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Timeline
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Progress
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                              <span className="sr-only">View</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {wardProjects.map((project) => (
                            <tr 
                              key={project.id}
                              className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                              onClick={() => handleProjectClick(project)}
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{project.title}</div>
                                <div className="text-sm text-gray-500">{project.description.substring(0, 60)}...</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                  ${project.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    project.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                                    project.status === 'stalled' ? 'bg-red-100 text-red-800' :
                                    project.status === 'not_started' ? 'bg-gray-100 text-gray-800' :
                                    'bg-purple-100 text-purple-800'}`}
                                >
                                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                KES {project.budgetedCost.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{new Date(project.contractStartDate).toLocaleDateString()}</div>
                                <div className="text-sm text-gray-500">to {new Date(project.contractEndDate).toLocaleDateString()}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div 
                                    className={`h-2.5 rounded-full ${
                                      project.status === 'completed' ? 'bg-green-600' :
                                      project.status === 'ongoing' ? 'bg-blue-600' :
                                      project.status === 'stalled' ? 'bg-red-600' :
                                      'bg-gray-600'
                                    }`}
                                    style={{ width: `${project.progress}%` }}
                                  ></div>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">{project.progress}%</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button className="text-green-600 hover:text-green-900">View Details</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No projects found in this ward</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderDepartmentView = () => {
    const department = departments.find(d => d.name === selectedDepartment);
    if (!department) return null;

    return (
      <div>
        <div className="mb-8">
          <button
            onClick={() => {
              navigate('/projects/department');
              setSelectedDepartment(null);
            }}
            className="inline-flex items-center text-sm text-gray-500 hover:text-green-600 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Departments
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{department.name}</h2>
            {year && year !== 'all' && (
              <p className="text-gray-600">Financial Year: {year}</p>
            )}
          </div>
          {department.subDepartments.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {department.subDepartments.map((sub) => (
                <span key={sub} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                  {sub}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Department Projects</h3>
            <StatusFilters />
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : projects.length > 0 ? (
            <ProjectGrid projects={projects} onProjectClick={handleProjectClick} />
          ) : (
            <div className="text-center py-12">
              <h4 className="text-lg font-medium text-gray-900 mb-2">No projects found</h4>
              <p className="text-gray-500">There are currently no projects in this department.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Update the header display
  const renderHeader = () => {
    if (year && year !== 'all') {
      return (
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Financial Year {year}</h2>
            <p className="text-gray-600 mt-1">All Projects</p>
          </div>
          <StatusFilters />
        </div>
      );
    }

    return null;
  };

  // If no section is selected, show the sections overview
  if (!selectedSection) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <ProjectSections />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Section Tabs - Only show when no specific year is selected */}
      {(!year || year === 'all') && (
        <div className="mt-24">
          <div className="max-w-7xl mx-auto">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-4 sm:px-6 lg:px-8" aria-label="Tabs">
                {['recent', 'constituency', 'department'].map((section) => (
                  <button
                    key={section}
                    onClick={() => {
                      navigate(`/projects/${section}`, { replace: true });
                      setSelectedSection(section as 'recent' | 'constituency' | 'department');
                      setSelectedConstituency(null);
                      setSelectedProject(null);
                      setSelectedStatus('all');
                    }}
                    className={`
                      whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                      ${selectedSection === section
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                    `}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)} Projects
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}

      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${year && year !== 'all' ? 'mt-24' : ''} py-6`}>
        {renderHeader()}
        {year && year !== 'all' ? (
          <ProjectGrid projects={projects} onProjectClick={handleProjectClick} />
        ) : (
          <>
            {selectedSection === 'recent' && renderRecentProjects()}
            {selectedSection === 'constituency' && renderConstituencyView()}
            {selectedSection === 'department' && renderDepartmentView()}
          </>
        )}
      </div>

      <ProjectDetailsModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleBackToProjects}
      />
    </div>
  );
};

export default ProjectsPage;