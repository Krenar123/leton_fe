
export interface ActiveTask {
  id: number;
  task: string;
  project: string;
  projectId: number;
  start: string;
  due: string;
  assignees: string[];
  status: 'Not Started' | 'In Progress' | 'Completed' | 'On Hold';
}

export interface TaskFilters {
  searchTerm: string;
  statusFilter: string;
  projectFilter: string;
}
