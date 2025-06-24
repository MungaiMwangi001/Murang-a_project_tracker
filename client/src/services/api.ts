import { Project } from '../types/project';

// Sample data - replace with actual API calls
const sampleProjects: Project[] = [
  {
    id: '1',
    name: 'Digital Skills Training Program',
    description: 'A comprehensive digital literacy program targeting youth in the community to enhance their employability and entrepreneurship skills.',
    location: {
      county: 'Sample County',
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
      'Create online learning platform',
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
  {
    id: '2',
    name: 'Community Water Supply Project',
    description: 'Installation of water supply infrastructure to provide clean and reliable water access to the community.',
    location: {
      county: 'Sample County',
      subCounty: 'Eastern',
      ward: 'Riverside',
    },
    budget: {
      amount: 5000000,
      currency: 'KES',
    },
    status: 'Ongoing',
    timeline: {
      startDate: '2024-02-01',
      expectedEndDate: '2024-08-31',
    },
    category: 'Infrastructure',
    imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837',
    progress: 40,
    objectives: [
      'Install 5km of water pipeline',
      'Build 2 water storage tanks',
      'Connect 1000 households',
    ],
    milestones: [
      {
        title: 'Phase 1',
        description: 'Pipeline installation started',
        dueDate: '2024-04-30',
        completed: false,
      },
    ],
    updates: [
      {
        date: '2024-03-01',
        description: 'Ground breaking ceremony completed',
      },
    ],
  },
];

export const api = {
  // Get all projects
  getProjects: async (): Promise<Project[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return sampleProjects;
  },

  // Get a single project by ID
  getProject: async (id: string): Promise<Project | undefined> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return sampleProjects.find(p => p.id === id);
  },

  // Search projects
  searchProjects: async (query: string): Promise<Project[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const lowercaseQuery = query.toLowerCase();
    return sampleProjects.filter(project =>
      project.name.toLowerCase().includes(lowercaseQuery) ||
      project.description.toLowerCase().includes(lowercaseQuery) ||
      project.category.toLowerCase().includes(lowercaseQuery) ||
      project.location.ward.toLowerCase().includes(lowercaseQuery) ||
      project.location.subCounty.toLowerCase().includes(lowercaseQuery)
    );
  },

  // Filter projects
  filterProjects: async (filters: {
    status?: string[];
    category?: string[];
    ward?: string[];
    subCounty?: string[];
    minBudget?: number;
    maxBudget?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<Project[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return sampleProjects.filter(project => {
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(project.status)) return false;
      }
      
      if (filters.category && filters.category.length > 0) {
        if (!filters.category.includes(project.category)) return false;
      }
      
      if (filters.ward && filters.ward.length > 0) {
        if (!filters.ward.includes(project.location.ward)) return false;
      }
      
      if (filters.subCounty && filters.subCounty.length > 0) {
        if (!filters.subCounty.includes(project.location.subCounty)) return false;
      }
      
      if (filters.minBudget !== undefined) {
        if (project.budget.amount < filters.minBudget) return false;
      }
      
      if (filters.maxBudget !== undefined) {
        if (project.budget.amount > filters.maxBudget) return false;
      }
      
      if (filters.startDate) {
        if (project.timeline.startDate < filters.startDate) return false;
      }
      
      if (filters.endDate) {
        if (project.timeline.expectedEndDate > filters.endDate) return false;
      }
      
      return true;
    });
  },
}; 