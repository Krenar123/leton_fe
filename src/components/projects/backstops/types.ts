
export interface Backstop {
  id: number;
  what: string;
  where: string;
  backstopValue: string;
  status: string;
  currentValue?: string;
  type: "task_due" | "item_line_due" | "individual" | "item_expense" | "project_expense" | "job_profitability" | "overall_profitability" | "cashflow";
  isReached: boolean;
  severity: "high" | "medium" | "low";
  dateCreated: string;
  isAutomatic: boolean;
}

export interface BackstopsDialogProps {
  projectRef: string;
  projectName: string;
  onClose: () => void;
}

export interface AddBackstopData {
  field: string;
  itemLine?: string;
  type: string;
  threshold: number;
}
