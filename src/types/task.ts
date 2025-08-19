export interface Task {
  id: string;
  ref: string;
  objective_id: string;
  title: string;
  description?: string;
  start_date: string;
  due_date: string;
  participants: string[];
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold';
}