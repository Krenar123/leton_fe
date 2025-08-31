
export interface Project {
  id: number;
  ref: string;
  name: string;
  description: string;
  client_id: number;
  project_manager_id: number;
  start_date: string;
  end_date: string;
  budget: number;
  profitability: number;
  status: "planning" | "active" | "on-hold" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
  openBillsOutstanding: number;
  openInvoicesOutstanding: number;
}


export interface ActionItem {
  task: string;
  startDate: string;
  endDate: string;
  assignees: string[];
  completed: boolean;
}
