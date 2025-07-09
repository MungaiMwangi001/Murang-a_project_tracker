import { Project } from '../types/project';

interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

interface ApiService {
  // Project methods
  getProjects: () => Promise<ApiResponse<Project[]>>;
  getProject: (id: string) => Promise<ApiResponse<Project | null>>;
  searchProjects: (query: string) => Promise<ApiResponse<Project[]>>;
  filterProjects: (filters: ProjectFilters) => Promise<ApiResponse<Project[]>>;
  createProject: (project: Omit<Project, 'id'>) => Promise<ApiResponse<Project>>;
  updateProject: (id: string, project: Partial<Project>) => Promise<ApiResponse<Project>>;
  deleteProject: (id: string) => Promise<ApiResponse<void>>;
  
  // HTTP methods
  get: <T>(url: string) => Promise<ApiResponse<T>>;
  post: <T>(url: string, data: any) => Promise<ApiResponse<T>>;
  put: <T>(url: string, data: any) => Promise<ApiResponse<T>>;
  delete: <T>(url: string) => Promise<ApiResponse<T>>;
}

interface ProjectFilters {
  status?: string[];
  category?: string[];
  ward?: string[];
  subCounty?: string[];
  minBudget?: number;
  maxBudget?: number;
  startDate?: string;
  endDate?: string;
}

// Sample data
const sampleProjects: Project[] = [
  {
    id: '1',
    name: 'Digital Skills Training Program',
    description: 'A comprehensive digital literacy program targeting youth in the community.',
    location: {
      county: 'Murang\'a',
      subCounty: 'Central',
      ward: 'Downtown',
    },
    budget: {
      amount: 2500000,
      currency: 'KES',
    },
    status: 'Ongoing',
    timeline: {
      startDate: '2024-01-01',
      expectedEndDate: '2024-12-31',
    },
    category: 'Education',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998',
    progress: 65,
    objectives: [
      'Train 1000 youth in digital skills',
      'Establish 5 digital hubs',
    ],
    milestones: [
      {
        title: 'Phase 1',
        description: 'Initial training batch completed',
        dueDate: '2024-03-31',
        completed: true,
      },
    ],
    updates: [
      {
        date: '2024-02-15',
        description: 'Successfully completed first batch training',
      },
    ],
  },
  // More sample projects...
];

// Helper function to simulate API delay
const simulateApiDelay = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
};

// Helper function to generate success response
const successResponse = <T>(data: T): ApiResponse<T> => ({
  data,
  status: 200,
  statusText: 'OK',
});

// Helper function to generate error response
const errorResponse = (status: number, message: string): ApiResponse<null> => ({
  data: null,
  status,
  statusText: message,
});

const api: ApiService = {
  // Project methods
  getProjects: async () => {
    await simulateApiDelay();
    return successResponse(sampleProjects);
  },

  getProject: async (id) => {
    await simulateApiDelay();
    const project = sampleProjects.find(p => p.id === id);
    return project 
      ? successResponse(project)
      : errorResponse(404, 'Project not found');
  },

  searchProjects: async (query) => {
    await simulateApiDelay();
    const lowercaseQuery = query.toLowerCase();
    const results = sampleProjects.filter(project =>
      project.name.toLowerCase().includes(lowercaseQuery) ||
      project.description.toLowerCase().includes(lowercaseQuery) ||
      project.category.toLowerCase().includes(lowercaseQuery)
    );
    return successResponse(results);
  },

  filterProjects: async (filters) => {
    await simulateApiDelay();
    const results = sampleProjects.filter(project => {
      if (filters.status?.length && !filters.status.includes(project.status)) return false;
      if (filters.category?.length && !filters.category.includes(project.category)) return false;
      if (filters.ward?.length && !filters.ward.includes(project.location.ward)) return false;
      if (filters.subCounty?.length && !filters.subCounty.includes(project.location.subCounty)) return false;
      if (filters.minBudget && project.budget.amount < filters.minBudget) return false;
      if (filters.maxBudget && project.budget.amount > filters.maxBudget) return false;
      return true;
    });
    return successResponse(results);
  },

  createProject: async (project) => {
    await simulateApiDelay();
    const newProject = {
      ...project,
      id: (sampleProjects.length + 1).toString(),
    };
    sampleProjects.push(newProject);
    return successResponse(newProject);
  },

  updateProject: async (id, updates) => {
    await simulateApiDelay();
    const index = sampleProjects.findIndex(p => p.id === id);
    if (index === -1) return errorResponse(404, 'Project not found');
    
    const updatedProject = {
      ...sampleProjects[index],
      ...updates,
      id, // Ensure ID remains the same
    };
    sampleProjects[index] = updatedProject;
    return successResponse(updatedProject);
  },

  deleteProject: async (id) => {
    await simulateApiDelay();
    const index = sampleProjects.findIndex(p => p.id === id);
    if (index === -1) return errorResponse(404, 'Project not found');
    
    sampleProjects.splice(index, 1);
    return successResponse(undefined);
  },

  // HTTP methods
  get: async (url) => {
    await simulateApiDelay();
    console.log(`GET ${url}`);
    return successResponse(null);
  },

  post: async (url, data) => {
    await simulateApiDelay();
    console.log(`POST ${url}`, data);
    return successResponse(data);
  },

  put: async (url, data) => {
    await simulateApiDelay();
    console.log(`PUT ${url}`, data);
    return successResponse(data);
  },

  delete: async (url) => {
    await simulateApiDelay();
    console.log(`DELETE ${url}`);
    return successResponse(null);
  },
};

export default api;