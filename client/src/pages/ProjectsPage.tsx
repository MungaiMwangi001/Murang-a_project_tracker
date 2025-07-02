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
  const { subCountyName } = useParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<'recent' | 'subCounty' | 'department' | null>(null);
  const [selectedSubCounty, setSelectedSubCounty] = useState<string>('Kangema');
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

  const subCountyData = [
    { name: "Kangema", wards: ["Rwathia", "Muguru", "Kangema"] },
    { name: "Mathioya", wards: ["Gitugi", "Kiru", "Kamacharia"] },
    { name: "Kiharu", wards: ["Wangu", "Mugoiri", "Mbiri", "Township", "Murarandia", "Gaturi"] },
    { name: "Kigumo", wards: ["Kahumbu", "Muthithi", "Kigumo", "Kangari", "Kinyona"] },
    { name: "Maragua", wards: ["Kimorori/Wempa", "Makuyu", "Kambiti", "Kamahuha", "Ichagaki", "Nginda"] },
    { name: "Kandara", wards: ["Muruka", "Kihumbu-ini", "Ithiru", "Ng'araria", "Kandara"] },
    { name: "Gatanga", wards: ["Kigumo", "Ichichi", "Kihoya", "Karuri", "Kandara", "Gitugi", "Cabros Kihumbuini", "Mununga", "Kamune"] }
  ];

  const departments = [
    "ICT & Public Administration",
    "Agriculture, Livestock and Cooperatives",
    "Trade, Industrialization & Tourism",
    "Health",
    "Water, Irrigation, Environment & Natural Resources",
    "Youth Affairs, Culture & Social Services",
    "Education and Technical Training",
    "Lands, Physical Planning & Urban Development",
    "County Attorney",
    "Roads, Housing & Infrastructure"
  ];

  // Determine the current section from the URL and set subCounty from URL params
  useEffect(() => {
    const path = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    const yearFromQuery = searchParams.get('year');
    const statusFromQuery = searchParams.get('status');
    const subcountyFromQuery = searchParams.get('subcounty');
    const wardFromQuery = searchParams.get('ward');
    
    console.log('ProjectsPage - Current path:', path);
    console.log('ProjectsPage - Year param:', year);
    console.log('ProjectsPage - Year from query:', yearFromQuery);
    console.log('ProjectsPage - Status from query:', statusFromQuery);
    console.log('ProjectsPage - SubCounty param:', subCountyName);
    
    // Set status filter from query parameter if present
    if (statusFromQuery) {
      setSelectedStatus(statusFromQuery);
    }
    
    // Check if this is a project ID route (format: /projects/123)
    if (year && !isNaN(Number(year))) {
      console.log('ProjectsPage - Detected project ID route');
      // This is a project ID route, not a financial year
      return;
    }
    
    if (path.includes('/recent')) {
      setSelectedSection('recent');
    } else if (path.includes('/sub-county')) {
      setSelectedSection('subCounty');
      // Set subCounty from URL parameter if available
      if (subCountyName) {
        setSelectedSubCounty(decodeURIComponent(subCountyName));
      }
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

    if (subcountyFromQuery) {
      setSelectedSection('subCounty');
      setSelectedSubCounty(subcountyFromQuery);
      setSelectedWard(wardFromQuery || null);
    }
  }, [location, subCountyName, year]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch real projects from backend
        const token = localStorage.getItem('token');
        const res = await fetch('/api/projects', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (!res.ok) throw new Error('Failed to fetch projects');
        const data = await res.json();
        const allProjects = data.projects || data;
        
        // Filter by financial year if specified in query parameters
        const searchParams = new URLSearchParams(location.search);
        const yearFromQuery = searchParams.get('year');
        
        if (yearFromQuery && yearFromQuery !== 'all') {
          console.log('ProjectsPage - Filtering by year:', yearFromQuery);
          const filteredProjects = allProjects.filter((project: Project) => 
            project.financialYear === yearFromQuery
          );
          setProjects(filteredProjects);
        } else {
          setProjects(allProjects);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [location.search]);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
    setIsModalOpen(false);
    setSelectedSubCounty('');
    setSelectedWard(null);
    navigate('/projects');
  };

  const handleSubCountyChange = (subCounty: string) => {
    setSelectedSubCounty(subCounty);
    setSelectedWard(null);
    navigate(`/projects?subcounty=${encodeURIComponent(subCounty)}`);
  };

  const handleWardChange = (ward: string) => {
    setSelectedWard(ward);
    navigate(`/projects?subcounty=${encodeURIComponent(selectedSubCounty)}&ward=${encodeURIComponent(ward)}`);
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
          key={dept}
          onClick={() => navigate(`/projects/department/${encodeURIComponent(dept)}`)}
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
            {dept}
          </h3>
        </button>
      ))}
    </div>
  );

  const renderSubCountyView = () => {
    // Show subCounty overview with 5 projects per subCounty
    if (!selectedSubCounty) {
      return (
        <>
          <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Browse by Sub-County</h2>
          </div>
          <div className="space-y-8">
            {subCountyData.map(subCounty => {
              const subCountyProjects = projects.filter(project => project.subCounty === subCounty.name);
              const displayProjects = subCountyProjects.slice(0, 5);
              
              return (
                <div key={subCounty.name} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">{subCounty.name} Sub-County</h3>
                      {subCountyProjects.length > 5 && (
              <button
                onClick={() => {
                  setSelectedSubCounty(subCounty.name);
                          }}
                          className="text-sm text-green-600 hover:text-green-800 font-medium"
                        >
                          View All ({subCountyProjects.length} projects)
                        </button>
                      )}
                    </div>
                  </div>
                  {displayProjects.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ward</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {displayProjects.map((project) => (
                            <tr key={project.id} className="hover:bg-gray-50 transition-colors duration-200">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.ward}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                  onClick={() => { setSelectedProject(project); setIsModalOpen(true); }}
                                  className="text-sm font-medium text-green-600 hover:text-green-900 text-left"
                                >
                                  {project.title}
                                </button>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.department}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                  ${project.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    project.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                                    project.status === 'stalled' ? 'bg-red-100 text-red-800' :
                                    project.status === 'not_started' ? 'bg-gray-100 text-gray-800' :
                                    'bg-purple-100 text-purple-800'}`}>
                                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No projects found in this sub-county</p>
                  </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      );
    }

    // Show all projects for selected subCounty with ward filter
    const subCounty = subCountyData.find(c => c.name === selectedSubCounty);
    if (!subCounty) return null;

    const subCountyProjects = projects.filter(project => project.subCounty === subCounty.name);
    const filteredProjects = selectedWard 
      ? subCountyProjects.filter(project => project.ward === selectedWard)
      : subCountyProjects;

    return (
      <div>
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{subCounty.name} Sub-County</h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Ward:</label>
                <select
                  value={selectedWard || ''}
                  onChange={e => handleWardChange(e.target.value || '')}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">All Wards</option>
                  {subCounty.wards.map(w => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <div className="relative">
                <select
                  value={selectedSubCounty}
                  onChange={e => handleSubCountyChange(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  {subCountyData.map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ward</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.ward}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => { setSelectedProject(project); setIsModalOpen(true); }}
                        className="text-sm font-medium text-green-600 hover:text-green-900 text-left"
                      >
                        {project.title}
                      </button>
                              </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.department}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                  ${project.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    project.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                                    project.status === 'stalled' ? 'bg-red-100 text-red-800' :
                                    project.status === 'not_started' ? 'bg-gray-100 text-gray-800' :
                          'bg-purple-100 text-purple-800'}`}>
                                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                </span>
                              </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h4 className="text-lg font-medium text-gray-900 mb-2">No projects found</h4>
            <p className="text-gray-500">No projects found in this sub-county.</p>
          </div>
        )}
      </div>
    );
  };

  const renderRecentProjects = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Recently Uploaded Projects</h2>
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
        <ProjectGrid projects={projects.slice(0, 6)} onProjectClick={handleProjectClick} />
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h4 className="text-lg font-medium text-gray-900 mb-2">No projects found</h4>
          <p className="text-gray-500">There are currently no projects to display.</p>
        </div>
      )}
    </div>
  );

  const renderDepartmentView = () => {
    // If no department selected, show a table for each department; if selected, show only that department's table
    const departmentsToShow = selectedDepartment ? [selectedDepartment] : departments;
    return (
      <div>
        <div className="mb-8">
          {selectedDepartment && (
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
          )}
        </div>
        
        {/* Department Dropdown */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Filter by Department:</label>
            <div className="relative">
              <select
                value={selectedDepartment || ''}
                onChange={e => setSelectedDepartment(e.target.value || null)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {selectedDepartment && (
              <button
                onClick={() => setSelectedDepartment(null)}
                className="text-sm text-green-600 hover:text-green-800 font-medium"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>
        
        {departmentsToShow.map(dept => {
          const deptProjects = projects.filter(project => project.department === dept);
          const displayProjects = selectedDepartment ? deptProjects : deptProjects.slice(0, 5);
          
          return (
            <div key={dept} className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">{dept} Department</h3>
                  {!selectedDepartment && deptProjects.length > 5 && (
                    <button
                      onClick={() => {
                        setSelectedDepartment(dept);
                        navigate(`/projects/department/${encodeURIComponent(dept)}`);
                      }}
                      className="text-sm text-green-600 hover:text-green-800 font-medium"
                    >
                      View All ({deptProjects.length} projects)
                    </button>
                  )}
                </div>
              </div>
              {displayProjects.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Constituency</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ward</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timeline</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {displayProjects.map((project) => (
                        <tr key={project.id} className="hover:bg-gray-50 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => { setSelectedProject(project); setIsModalOpen(true); }}
                              className="text-sm font-medium text-green-600 hover:text-green-900 text-left"
                            >
                              {project.title}
                            </button>
                              </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.department}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.subCounty}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.ward}</td>
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
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${project.status === 'completed' ? 'bg-green-100 text-green-800' :
                                project.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                                project.status === 'stalled' ? 'bg-red-100 text-red-800' :
                                project.status === 'not_started' ? 'bg-gray-100 text-gray-800' :
                                'bg-purple-100 text-purple-800'}`}>
                              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                            </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                  <p className="text-gray-500">No projects found in this department</p>
                    </div>
                  )}
                </div>
              );
            })}
      </div>
    );
  };

    // Update the header display
  const renderHeader = () => {
    const searchParams = new URLSearchParams(location.search);
    const yearFromQuery = searchParams.get('year');
    const statusFromQuery = searchParams.get('status');

    return (
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
      <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Projects
              </h1>
              {yearFromQuery && yearFromQuery !== 'all' && (
                <p className="mt-2 text-lg text-green-600 font-medium">
                  Financial Year: {yearFromQuery}
                </p>
              )}
              {statusFromQuery && statusFromQuery !== 'all' && (
                <p className="mt-2 text-lg text-blue-600 font-medium">
                  Status: {statusFromQuery.charAt(0).toUpperCase() + statusFromQuery.slice(1).replace('_', ' ')}
                </p>
            )}
          </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/projects')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                View All Projects
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Filtering logic
  const filteredProjects = projects.filter(p => {
    if (selectedSubCounty && p.subCounty !== selectedSubCounty) return false;
    if (selectedWard && p.ward !== selectedWard) return false;
    if (selectedDepartment && p.department !== selectedDepartment) return false;
    if (selectedStatus && selectedStatus !== 'all' && p.status !== selectedStatus) return false;
    return true;
  });

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
      {(() => {
        const searchParams = new URLSearchParams(location.search);
        const yearFromQuery = searchParams.get('year');
        return !yearFromQuery || yearFromQuery === 'all';
      })() && (
        <div className="mt-24">
          <div className="max-w-7xl mx-auto">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-4 sm:px-6 lg:px-8" aria-label="Tabs">
                {['recent', 'subCounty', 'department'].map((section) => (
                  <button
                    key={section}
                    onClick={() => {
                      navigate(`/projects/${section}`, { replace: true });
                      setSelectedSection(section as 'recent' | 'subCounty' | 'department');
                      setSelectedSubCounty('Kangema');
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

        {renderHeader()}
      
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6`}>
        {/* Status Filters - Show when a year is selected or when status filter is applied */}
        {(() => {
          const searchParams = new URLSearchParams(location.search);
          const yearFromQuery = searchParams.get('year');
          const statusFromQuery = searchParams.get('status');
          return (yearFromQuery && yearFromQuery !== 'all') || (statusFromQuery && statusFromQuery !== 'all');
        })() && <StatusFilters />}
        
        {(() => {
          const searchParams = new URLSearchParams(location.search);
          const yearFromQuery = searchParams.get('year');
          return yearFromQuery && yearFromQuery !== 'all';
        })() ? (
          <ProjectGrid projects={filteredProjects} onProjectClick={handleProjectClick} />
        ) : (
          <>
            {selectedSection === 'recent' && renderRecentProjects()}
            {selectedSection === 'subCounty' && renderSubCountyView()}
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