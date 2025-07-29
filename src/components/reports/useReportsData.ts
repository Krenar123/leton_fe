
import { useState } from "react";
import { Report, ReportFilters, ReportSortField, ReportSortDirection, ReportColumnVisibility, Project, GenerateReportFormData } from "./types";

// Mock data for projects
const mockProjects: Project[] = [{
  id: 1,
  name: "Office Building Renovation",
  client: "ABC Corp",
  contact: "John Smith",
  startDate: "2025-01-15",
  dueDate: "2025-06-30",
  value: 250000
}, {
  id: 2,
  name: "Residential Complex",
  client: "XYZ Holdings",
  contact: "Sarah Johnson",
  startDate: "2025-02-01",
  dueDate: "2025-12-15",
  value: 1200000
}, {
  id: 3,
  name: "Shopping Mall Extension",
  client: "Retail Partners",
  contact: "Mike Davis",
  startDate: "2025-03-01",
  dueDate: "2025-08-30",
  value: 800000
}];

// Mock reports data
const mockReports: Report[] = [{
  id: 1,
  name: "Office Building Q1 Financial Report",
  projectId: 1,
  projectName: "Office Building Renovation",
  client: "ABC Corp",
  createdBy: "Sarah Johnson",
  createdAt: "2025-01-15T10:00:00Z",
  lastRun: "2025-01-20T09:00:00Z",
  status: "Active",
  format: "PDF",
  includedSections: {
    estimatesVsActuals: true,
    invoicedVsPaid: true,
    billsVsPayments: false,
    cashFlowGraph: true
  }
}, {
  id: 2,
  name: "Residential Complex Financial Summary",
  projectId: 2,
  projectName: "Residential Complex",
  client: "XYZ Holdings",
  createdBy: "Mike Chen",
  createdAt: "2025-02-05T14:30:00Z",
  lastRun: "2025-02-10T08:00:00Z",
  status: "Active",
  format: "Excel",
  includedSections: {
    estimatesVsActuals: true,
    invoicedVsPaid: true,
    billsVsPayments: true,
    cashFlowGraph: true
  }
}];

export const useReportsData = () => {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<ReportFilters>({
    projectName: "",
    client: "",
    status: "",
    format: "",
    createdBy: ""
  });
  const [columnVisibility, setColumnVisibility] = useState<ReportColumnVisibility>({
    name: true,
    projectName: true,
    client: true,
    createdBy: true,
    createdAt: true,
    lastRun: true,
    status: true,
    format: false,
    includedSections: false
  });
  const [sortField, setSortField] = useState<ReportSortField>('name');
  const [sortDirection, setSortDirection] = useState<ReportSortDirection>('asc');

  const hasActiveFilters = !!(filters.projectName || filters.client || filters.status || filters.format || filters.createdBy);

  const clearFilters = () => {
    setFilters({
      projectName: "",
      client: "",
      status: "",
      format: "",
      createdBy: ""
    });
  };

  const filteredAndSortedReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         report.projectName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         report.client.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilters = (!filters.projectName || report.projectName.toLowerCase().includes(filters.projectName.toLowerCase())) &&
                          (!filters.client || report.client.toLowerCase().includes(filters.client.toLowerCase())) &&
                          (!filters.status || report.status === filters.status) &&
                          (!filters.format || report.format === filters.format) &&
                          (!filters.createdBy || report.createdBy.toLowerCase().includes(filters.createdBy.toLowerCase()));
    
    return matchesSearch && matchesFilters;
  }).sort((a, b) => {
    let aValue = a[sortField] || '';
    let bValue = b[sortField] || '';
    
    if (typeof aValue === 'string') aValue = aValue.toLowerCase();
    if (typeof bValue === 'string') bValue = bValue.toLowerCase();
    
    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const handleSort = (field: ReportSortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleGenerateReport = (data: GenerateReportFormData) => {
    const project = mockProjects.find(p => p.id === data.projectId);
    if (!project) return;
    
    const newReport: Report = {
      id: Math.max(...reports.map(r => r.id)) + 1,
      name: data.reportName,
      projectId: data.projectId,
      projectName: project.name,
      client: project.client,
      createdBy: "Current User",
      createdAt: new Date().toISOString(),
      lastRun: new Date().toISOString(),
      status: "Active",
      format: data.format,
      includedSections: data.includedSections
    };
    setReports([...reports, newReport]);
    console.log('Generated report:', newReport);
  };

  const handleDeleteReport = (reportId: number) => {
    setReports(reports.filter(r => r.id !== reportId));
  };

  return {
    reports,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    columnVisibility,
    setColumnVisibility,
    sortField,
    sortDirection,
    hasActiveFilters,
    clearFilters,
    filteredAndSortedReports,
    handleSort,
    handleGenerateReport,
    handleDeleteReport,
    mockProjects
  };
};
