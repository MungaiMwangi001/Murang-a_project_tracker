import { Link, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

const Navbar = () => {
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState('2024/2025');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const yearOptions = [
    { value: 'all', label: 'All Financial Years' },
    { value: '2024/2025', label: 'FY 2024/2025' },
    { value: '2023/2024', label: 'FY 2023/2024' },
    { value: '2022/2023', label: 'FY 2022/2023' },
    { value: '2021/2022', label: 'FY 2021/2022' }
  ];

  // Update selected year based on current URL
  useEffect(() => {
    const path = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    const yearFromQuery = searchParams.get('year');
    
    if (yearFromQuery && yearOptions.some(option => option.value === yearFromQuery)) {
      setSelectedYear(yearFromQuery);
    } else if (path === '/projects' && !yearFromQuery) {
      setSelectedYear('all');
    }
  }, [location]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsYearDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsYearDropdownOpen(!isYearDropdownOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 w-full bg-green-700/95 border-b-4 border-green-900 shadow-2xl z-50 backdrop-blur-md">
      <div className="flex justify-between items-center h-20 px-6 mx-0">
        {/* Left side - Logos */}
        <div className="flex items-center space-x-6">
          <img
            src="/src/assets/kenyan logo.png"
            alt="Government of Kenya"
            className="h-16 w-auto drop-shadow-xl bg-white rounded-lg p-1"
          />
          <img
            src="/src/assets/murang'a_logo.jpeg"
            alt="Murang'a County"
            className="h-16 w-auto drop-shadow-xl bg-white rounded-lg p-1"
          />
        </div>

        {/* Right side - Navigation */}
        <div className="flex items-center space-x-8 bg-transparent">
          <Link
            to="/"
            className="text-white hover:text-green-200 font-medium text-lg"
          >
            Home
          </Link>
          
          {/* Projects Dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={toggleDropdown}
              className="text-white hover:text-green-200 transition-colors duration-200 flex items-center bg-transparent"
            >
              <span className="text-lg">Projects</span>
              <svg
                className={`ml-1 w-4 h-4 transition-transform duration-200 ${isYearDropdownOpen ? 'transform rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Year Dropdown Menu */}
            {isYearDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100">
                <Link
                  to="/projects"
                  className="block px-4 py-2.5 text-gray-700 hover:bg-green-50 hover:text-green-700 first:rounded-t-lg"
                  onClick={() => setIsYearDropdownOpen(false)}
                >
                  All Projects
                </Link>
                <Link
                  to="/projects/recent"
                  className="block px-4 py-2.5 text-gray-700 hover:bg-green-50 hover:text-green-700"
                  onClick={() => setIsYearDropdownOpen(false)}
                >
                  Recent Projects
                </Link>
                <Link
                  to="/projects/sub-county"
                  className="block px-4 py-2.5 text-gray-700 hover:bg-green-50 hover:text-green-700"
                  onClick={() => setIsYearDropdownOpen(false)}
                >
                  By Sub-County
                </Link>
                <Link
                  to="/projects/department"
                  className="block px-4 py-2.5 text-gray-700 hover:bg-green-50 hover:text-green-700"
                  onClick={() => setIsYearDropdownOpen(false)}
                >
                  By Department
                </Link>
                <div className="border-t border-gray-100">
                  <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Filter by Year
                  </div>
                  {yearOptions.map(option => (
                    <Link
                      key={option.value}
                      to={`/projects${option.value === 'all' ? '' : `?year=${option.value}`}`}
                      className="block px-4 py-2.5 text-gray-700 hover:bg-green-50 hover:text-green-700"
                      onClick={() => {
                        console.log('Navbar - Selected year:', option.value);
                        console.log('Navbar - Navigating to:', `/projects${option.value === 'all' ? '' : `?year=${option.value}`}`);
                        setIsYearDropdownOpen(false);
                        setSelectedYear(option.value);
                      }}
                    >
                      {option.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            to="/staff"
            className="text-white hover:text-green-200 font-medium text-lg"
          >
            Staff
          </Link>

          <Link
            to="/faq"
            className="text-white hover:text-green-200 font-medium text-lg"
          >
            FAQ
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 