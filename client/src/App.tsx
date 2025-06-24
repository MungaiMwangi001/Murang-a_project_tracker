import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import StaffDashboard from './pages/StaffDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/recent" element={<ProjectsPage />} />
          <Route path="/projects/constituency" element={<ProjectsPage />} />
          <Route path="/projects/department" element={<ProjectsPage />} />
          <Route path="/projects/department/:departmentName" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/staff/*" element={<StaffDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
