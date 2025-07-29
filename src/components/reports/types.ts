
export interface Report {
  id: number;
  name: string;
  projectId: number;
  projectName: string;
  client: string;
  createdBy: string;
  createdAt: string;
  lastRun: string;
  status: 'Active' | 'Draft' | 'Archived';
  format: 'PDF' | 'Excel';
  includedSections: {
    estimatesVsActuals: boolean;
    invoicedVsPaid: boolean;
    billsVsPayments: boolean;
    cashFlowGraph: boolean;
  };
}

export interface ReportFilters {
  projectName: string;
  client: string;
  status: string;
  format: string;
  createdBy: string;
}

export type ReportSortField = 'name' | 'projectName' | 'client' | 'createdBy' | 'createdAt' | 'lastRun' | 'status';
export type ReportSortDirection = 'asc' | 'desc';

export interface ReportColumnVisibility {
  name: boolean;
  projectName: boolean;
  client: boolean;
  createdBy: boolean;
  createdAt: boolean;
  lastRun: boolean;
  status: boolean;
  format: boolean;
  includedSections: boolean;
}

export interface Project {
  id: number;
  name: string;
  client: string;
  contact: string;
  startDate: string;
  dueDate: string;
  value: number;
}

export interface GenerateReportFormData {
  projectId: number;
  reportName: string;
  format: 'PDF' | 'Excel';
  includedSections: {
    estimatesVsActuals: boolean;
    invoicedVsPaid: boolean;
    billsVsPayments: boolean;
    cashFlowGraph: boolean;
  };
}
