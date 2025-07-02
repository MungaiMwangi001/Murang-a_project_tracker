export type FinancialYear = '2023/2024' | '2024/2025';

export type Department = {
  id: string;
  name: string;
};

export interface Constituency {
  id: string;
  name: string;
  wards: string[];
}

export type ProjectStatus = 'Completed' | 'Ongoing' | 'Stalled' | 'Not Started' | 'Under Procurement';

export interface Project {
  id: string;
  name: string;
  description: string;
  department: string;
  constituency: string;
  ward: string;
  budget: string;
  status: ProjectStatus;
  startDate: string;
  completionDate: string;
  financialYear: string;
  imageUrl?: string;
  contractor?: string;
  progress?: number;
  objectives?: string[];
  challenges?: string[];
  recommendations?: string[];
}

export const constituencies: Constituency[] = [
  {
    id: 'kangema',
    name: 'Kangema',
    wards: ['Kanyenya-Ini', 'Muguru', 'Rwathia']
  },
  {
    id: 'mathioya',
    name: 'Mathioya',
    wards: ['Gitugi', 'Kiru', 'Kamacharia']
  },
  {
    id: 'kiharu',
    name: 'Kiharu',
    wards: ['Wangu', 'Mugoiri', 'Mbiri', 'Township', 'Murarandia', 'Gaturi']
  },
  {
    id: 'kigumo',
    name: 'Kigumo',
    wards: ['Kahumbu', 'Muthithi', 'Kigumo', 'Kangari', 'Kinyona']
  },
  {
    id: 'maragwa',
    name: 'Maragwa',
    wards: ['Kimorori/Wempa', 'Makuyu', 'Kambiti', 'Kamahuhu', 'Ichagaki', 'Nginda']
  },
  {
    id: 'kandara',
    name: 'Kandara',
    wards: ["Ng'araria", 'Muruka', 'Kagundu-Ini', 'Gaichanjiru', 'Ithiru', 'Ruchu']
  },
  {
    id: 'gatanga',
    name: 'Gatanga',
    wards: ['Ithanga', 'Kakuzi/Mitubiri', 'Mugumo-Ini', 'Kihumbu-Ini', 'Gatanga', 'Kariara']
  }
];

export const departments = [
  { id: 'ict', name: 'ICT and Digital Services' },
  { id: 'roads', name: 'Roads and Infrastructure' },
  { id: 'water', name: 'Water and Sanitation' },
  { id: 'health', name: 'Health Services' },
  { id: 'agriculture', name: 'Agriculture and Livestock' }
]; 