import { Link } from 'react-router-dom';

const ProjectSections = () => {
  const sections = [
    {
      title: "Recent Projects",
      description: "View our latest development initiatives",
      icon: (
        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      link: "/projects/recent"
    },
    {
      title: "Browse by Department",
      description: "Find projects by county departments",
      icon: (
        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      link: "/projects/department"
    },
    {
      title: "Browse by Subcounty",
      description: "Explore projects in your area",
      icon: (
        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      link: "/projects/sub-county/Kiharu"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Browse Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {sections.map((section) => (
          <Link
            key={section.title}
            to={section.link}
            className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-50 rounded-lg p-3 group-hover:bg-green-100 transition-colors duration-200">
                  {section.icon}
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
                {section.title}
              </h3>
              <p className="text-gray-500">
                {section.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProjectSections; 