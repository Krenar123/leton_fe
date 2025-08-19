export interface Objective {
  id: number;
  ref: string;
  title: string;
  description: string;
  status: "not_started" | "in_progress" | "completed" | "on_hold";
  priority: "low" | "medium" | "high" | "critical"; 
  start_date: string; // e.g. "2025-08-04"
  end_date: string;   // e.g. "2025-08-28"
  assigned_to: number | null; 
  depends_on?: number | null;
  created_by: number;
  project_id: number;
  created_at: string;
  updated_at: string;
  participants: string[]; 
}
