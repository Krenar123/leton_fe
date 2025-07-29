
export interface Objective {
  id: string;
  field: string;
  description?: string;
  start: string;
  due: string;
  participants: string[];
  status: 'Planned' | 'In Progress' | 'Finished' | 'Already Due';
}

export interface Task {
  id: string;
  objectiveId: string;
  task: string;
  description?: string;
  start: string;
  due: string;
  participants: string[];
  status: 'Planned' | 'In Progress' | 'Finished' | 'Already Due';
}
