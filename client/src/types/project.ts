export type ProjectStatus = 'completed' | 'ongoing' | 'stalled' | 'not_started' | 'under_procurement';

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
  replies?: Comment[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  budgetedCost: number;
  sourceOfFunds: string;
  progress: number;
  department: string;
  directorate: string;
  contractName: string;
  lpoNumber: string;
  contractNumber: string;
  contractor: string;
  contractPeriod: string;
  contractStartDate: string;
  contractEndDate: string;
  contractCost: number;
  implementationStatus: string;
  amountPaidToDate: number;
  recommendations: string;
  pmc: string; // Project Management Committee
  lastUpdated: string;
  subCounty: string;
  ward: string;
  images: string[];
  financialYear: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  comments: Comment[];
}

export interface ProjectFilters {
  status?: ProjectStatus[];
  category?: string[];
  ward?: string[];
  subCounty?: string[];
  startDate?: {
    from: string;
    to: string;
  };
  budgetRange?: {
    min: number;
    max: number;
  };
  searchQuery?: string;
} 