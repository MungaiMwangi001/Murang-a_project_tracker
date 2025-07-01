import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import construction4 from '../assets/constrcuction4.jpg';
import constructionSite2 from '../assets/construction_site2.jpg';
import Navbar from '../components/Navbar';
import { Project } from '../types/project';

const HomePage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await fetch('/api/projects', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (!res.ok) throw new Error('Failed to fetch projects');
        const data = await res.json();
        const allProjects = data.projects || data;
        setProjects(allProjects);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Calculate statistics from real data
  const calculateStats = () => {
    const totalProjects = projects.length;
    const totalBudget = projects.reduce((sum, p) => sum + (p.budgetedCost || 0), 0);
    
    const statusCounts = projects.reduce((acc, p) => {
      const status = p.status?.toLowerCase() || 'unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusBudgets = projects.reduce((acc, p) => {
      const status = p.status?.toLowerCase() || 'unknown';
      acc[status] = (acc[status] || 0) + (p.budgetedCost || 0);
      return acc;
    }, {} as Record<string, number>);

    return [
      {
        label: 'Total Projects',
        value: totalProjects.toString(),
        amount: `KSH ${(totalBudget / 1000000).toFixed(1)}M`,
        color: 'bg-blue-600/90 backdrop-blur-sm',
        status: 'all'
      },
      {
        label: 'Completed',
        value: (statusCounts.completed || 0).toString(),
        amount: `KSH ${((statusBudgets.completed || 0) / 1000000).toFixed(1)}M`,
        color: 'bg-green-600/90 backdrop-blur-sm',
        status: 'completed'
      },
      {
        label: 'Ongoing',
        value: (statusCounts.ongoing || 0).toString(),
        amount: `KSH ${((statusBudgets.ongoing || 0) / 1000000).toFixed(1)}M`,
        color: 'bg-yellow-600/90 backdrop-blur-sm',
        status: 'ongoing'
      },
      {
        label: 'Stalled',
        value: (statusCounts.stalled || 0).toString(),
        amount: `KSH ${((statusBudgets.stalled || 0) / 1000000).toFixed(1)}M`,
        color: 'bg-red-600/90 backdrop-blur-sm',
        status: 'stalled'
      },
      {
        label: 'Not Started',
        value: (statusCounts.not_started || 0).toString(),
        amount: `KSH ${((statusBudgets.not_started || 0) / 1000000).toFixed(1)}M`,
        color: 'bg-gray-600/90 backdrop-blur-sm',
        status: 'not_started'
      },
      {
        label: 'Under Procurement',
        value: (statusCounts.under_procurement || 0).toString(),
        amount: `KSH ${((statusBudgets.under_procurement || 0) / 1000000).toFixed(1)}M`,
        color: 'bg-purple-600/90 backdrop-blur-sm',
        status: 'under_procurement'
      }
    ];
  };

  const stats = calculateStats();

  const handleCardClick = (status: string) => {
    if (status === 'all') {
      navigate('/projects');
    } else {
      navigate(`/projects?status=${status}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pt-16">
      <Navbar />
      
      {/* Welcome Section - Brighter and Reduced height */}
      <div className="relative h-[50vh] flex items-center justify-center text-center px-0 bg-gray-800 mt-8 mb-8">
        <div className="absolute inset-0">
          <img
            src={construction4}
            alt="Welcome Background"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/50" />
        </div>
        <div className="relative z-10 text-center max-w-4xl mx-auto py-12">
          <h1 className="text-white text-5xl lg:text-6xl font-bold tracking-wider animate-fade-in drop-shadow-lg mb-6">
            WELCOME
          </h1>
          <h2 className="text-white text-2xl lg:text-3xl font-semibold mb-4 drop-shadow-md">
            Murang'a County Projects Monitoring and Tracking System
          </h2>
          <p className="text-white/95 text-base lg:text-lg leading-relaxed mb-6 max-w-3xl mx-auto">
            A centralized platform developed to enhance efficiency, promote transparency, 
            and ensure accountability in the planning, execution, and monitoring of 
            development projects across all wards and constituencies in Murang'a County.
          </p>
          <div className="flex justify-center">
            <Link 
              to="/projects" 
              className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-lg 
                        text-lg font-semibold transition-colors duration-200 
                        transform hover:scale-105 shadow-lg"
            >
              Explore Projects
            </Link>
          </div>
        </div>
      </div>

      {/* Stats and Mission/Vision Section */}
      <div className="grid lg:grid-cols-2 gap-0 shadow-lg">
        {/* Stats Section */}
        <div className="lg:w-full bg-gray-100 p-8 lg:p-12">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">Project Statistics</h3>
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-gray-300 rounded-xl p-4 lg:p-6 animate-pulse">
                  <div className="h-8 bg-gray-400 rounded mb-2"></div>
                  <div className="h-4 bg-gray-400 rounded mb-2"></div>
                  <div className="h-6 bg-gray-400 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {stats.map((stat, index) => (
                <button
                  key={index}
                  onClick={() => handleCardClick(stat.status)}
                  className={`${stat.color} rounded-xl p-4 lg:p-6 text-white transform hover:scale-105 transition-transform duration-300 shadow-2xl flex flex-col cursor-pointer hover:shadow-3xl`}
                >
                  <div className="text-3xl lg:text-4xl font-bold mb-2 drop-shadow-md">{stat.value}</div>
                  <div className="text-sm lg:text-base text-white/90 mb-2">{stat.label}</div>
                  <div className="mt-auto pt-2 border-t border-white/30 text-lg lg:text-xl font-semibold text-white">
                    {stat.amount}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mission/Vision Section */}
        <div className="relative lg:w-full">
          <div className="absolute inset-0">
            <img
              src={constructionSite2}
              alt="Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/70" />
          </div>

          <div className="relative z-10 p-8 lg:p-12">
            <div className="space-y-8">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 lg:p-8 transform hover:scale-105 transition-duration-300 shadow-2xl">
                <h3 className="text-2xl font-semibold text-white mb-4 drop-shadow-md">
                  Our Vision
                </h3>
                <p className="text-white/90 leading-relaxed">
                  To be a leading county in sustainable development and improved 
                  quality of life for all residents through efficient project 
                  implementation and resource management.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 lg:p-8 transform hover:scale-105 transition-duration-300 shadow-2xl">
                <h3 className="text-2xl font-semibold text-white mb-4 drop-shadow-md">
                  Our Mission
                </h3>
                <p className="text-white/90 leading-relaxed">
                  To transform Murang'a County through strategic implementation of 
                  development projects, fostering economic growth, and ensuring 
                  equitable distribution of resources across all constituencies.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 lg:p-8 transform hover:scale-105 transition-duration-300 shadow-2xl">
                <h3 className="text-2xl font-semibold text-white mb-4 drop-shadow-md">
                  What We Want to Achieve
                </h3>
                <p className="text-white/90 leading-relaxed">
                  Our goal is to ensure transparent and efficient project 
                  implementation across all constituencies, focusing on key areas 
                  such as infrastructure development, water and sanitation, 
                  healthcare, education, and agricultural advancement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 