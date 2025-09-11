
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

export interface Meeting {
  id: string;
  ref: string;
  title: string;
  start_at: string; // ISO datetime
  end_at: string;   // ISO datetime
  location?: string;
  agenda?: string;
  notes?: string;
  client_ref?: string; // Optional client reference
  client_attendees_text?: string; // Free-form text for client attendees
  attendee_user_refs: string[]; // Array of team member user refs
  created_at: string;
  updated_at: string;
}

export interface CreateMeetingData {
  title: string;
  start_at: string;
  end_at: string;
  location?: string;
  agenda?: string;
  notes?: string;
  client_ref?: string;
  client_attendees_text?: string;
  attendee_user_refs: string[];
}

export interface UpdateMeetingData extends Partial<CreateMeetingData> {
  id: string;
}
