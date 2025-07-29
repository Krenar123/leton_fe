
export interface Project {
  id: number;
  name: string;
  client: string;
  location: string;
  start: string;
  due: string;
  value: number;
  profitability: number;
  status: "Active" | "Completed";
  description?: string;
}

export interface ActionItem {
  task: string;
  startDate: string;
  endDate: string;
  assignees: string[];
  completed: boolean;
}
