
export interface ProjectObjective {
  id: string;
  field: string;
  projectName: string;
  projectId: number;
  start: string;
  due: string;
  participants: string[];
  status: 'Planned' | 'In Progress' | 'Finished' | 'Already Due';
}

export interface ColumnVisibility {
  projectName: boolean;
  start: boolean;
  due: boolean;
  participants: boolean;
  status: boolean;
}
