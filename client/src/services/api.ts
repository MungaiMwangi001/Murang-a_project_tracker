import { Project as BackendProject } from '../types/project';
import { Project as FrontendProject } from '../types/projects';

// Get API base URL from environment or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Convert backend project format to frontend format
const convertProject = (backendProject: BackendProject): FrontendProject => {
  // Map backend status to frontend status
  const statusMap: Record<string, string> = {
    'completed': 'Completed',
    'ongoing': 'Ongoing', 
    'stalled': 'Stalled',
    'not_started': 'Not Started',
    'under_procurement': 'Under Procurement'
  };

  return {
    id: backendProject.id,
    name: backendProject.title,
    description: backendProject.description || '',
    department: backendProject.department,
    subCounty: backendProject.subCounty,
    ward: backendProject.ward,
    budget: {
      amount: backendProject.budgetedCost,
      currency: 'KES'
    },
    status: statusMap[backendProject.status] || backendProject.status as any,
    timeline: {
      startDate: backendProject.contractStartDate,
      expectedEndDate: backendProject.contractEndDate
    },
    financialYear: backendProject.financialYear,
    imageUrl: backendProject.images?.[0] || undefined,
    contractor: backendProject.contractor,
    progress: backendProject.progress,
    location: {
      county: 'Murang\'a County',
      subCounty: backendProject.subCounty,
      ward: backendProject.ward
    },
    contractNumber: backendProject.contractNumber,
    lpoNumber: backendProject.lpoNumber,
    contractCost: backendProject.contractCost,
    directorate: backendProject.directorate
  };
};

export const api = {
  // Get all projects
  getProjects: async (): Promise<FrontendProject[]> => {
    const res = await fetch(`${API_BASE_URL}/api/projects`);
    if (!res.ok) throw new Error('Failed to fetch projects');
    const data = await res.json();
    const backendProjects = data.projects || data;
    return backendProjects.map(convertProject);
  },

  // Get a single project by ID
  getProject: async (id: string): Promise<FrontendProject | undefined> => {
    const res = await fetch(`${API_BASE_URL}/api/projects/${id}`);
    if (res.status === 404) return undefined;
    if (!res.ok) throw new Error('Failed to fetch project');
    const data = await res.json();
    const backendProject = data.project || data;
    return convertProject(backendProject);
  },

  // Optionally, implement search and filter using backend endpoints if available
}; 