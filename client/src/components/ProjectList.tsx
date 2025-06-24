import { Project } from '../types/projects';

interface ProjectListProps {
  projects: Project[];
  viewMode: 'department' | 'constituency';
}

const ProjectList = ({ projects, viewMode }: ProjectListProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-xl shadow-md">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="py-3 px-4 text-left">Project Name</th>
            <th className="py-3 px-4 text-left">{viewMode === 'department' ? 'Constituency' : 'Department'}</th>
            <th className="py-3 px-4 text-left">Ward</th>
            <th className="py-3 px-4 text-left">Budget</th>
            <th className="py-3 px-4 text-left">Status</th>
            <th className="py-3 px-4 text-left">Timeline</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {projects.map((project) => (
            <tr key={project.id} className="hover:bg-gray-50">
              <td className="py-4 px-4">
                <div>
                  <div className="font-medium text-gray-900">{project.name}</div>
                  <div className="text-sm text-gray-500">{project.description}</div>
                </div>
              </td>
              <td className="py-4 px-4 text-gray-700">
                {viewMode === 'department' ? project.constituency : project.department}
              </td>
              <td className="py-4 px-4 text-gray-700">{project.ward}</td>
              <td className="py-4 px-4 text-gray-700">{project.budget}</td>
              <td className="py-4 px-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    project.status === 'Ongoing' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'}`}>
                  {project.status}
                </span>
              </td>
              <td className="py-4 px-4 text-sm text-gray-500">
                <div>Start: {project.startDate}</div>
                <div>End: {project.completionDate}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectList; 